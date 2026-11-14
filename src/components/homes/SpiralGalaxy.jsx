import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// 1. PURE JAVASCRIPT 3D MATH, COLOR & ORBIT CAMERA ENGINE
// ============================================================================
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;
        return this;
    }
}

class Color {
    constructor(hexOrR = 1, g = 1, b = 1) {
        this.r = 1;
        this.g = 1;
        this.b = 1;
        if (typeof hexOrR === 'string') {
            this.set(hexOrR);
        } else if (typeof hexOrR === 'number') {
            this.r = hexOrR;
            this.g = g;
            this.b = b;
        }
    }
    set(hex) {
        let clean = hex.replace(/^#/, '');
        if (clean.length === 3) {
            clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
        }
        const num = parseInt(clean, 16);
        this.r = ((num >> 16) & 255) / 255;
        this.g = ((num >> 8) & 255) / 255;
        this.b = (num & 255) / 255;
        return this;
    }
    copy(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        return this;
    }
    lerp(c, alpha) {
        this.r += (c.r - this.r) * alpha;
        this.g += (c.g - this.g) * alpha;
        this.b += (c.b - this.b) * alpha;
        return this;
    }
    setHSL(h, s, l) {
        h = ((h % 1) + 1) % 1;
        s = Math.max(0, Math.min(1, s));
        l = Math.max(0, Math.min(1, l));
        if (s === 0) {
            this.r = this.g = this.b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l <= 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            this.r = hue2rgb(p, q, h + 1 / 3);
            this.g = hue2rgb(p, q, h);
            this.b = hue2rgb(p, q, h - 1 / 3);
        }
        return this;
    }
    getHexString() {
        const toHex = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0');
        return toHex(this.r) + toHex(this.g) + toHex(this.b);
    }
}

const Mat4 = {
    create() {
        const out = new Float32Array(16);
        out[0] = 1; out[5] = 1; out[10] = 1; out[15] = 1;
        return out;
    },
    perspective(out, fovyRad, aspect, near, far) {
        const f = 1.0 / Math.tan(fovyRad / 2);
        out.fill(0);
        out[0] = f / aspect;
        out[5] = f;
        out[10] = (far + near) / (near - far);
        out[11] = -1;
        out[14] = (2 * far * near) / (near - far);
        return out;
    },
    lookAt(out, eye, center, up) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        z0 = eye.x - center.x;
        z1 = eye.y - center.y;
        z2 = eye.z - center.z;
        len = Math.hypot(z0, z1, z2);
        if (len === 0) {
            z2 = 1;
        } else {
            len = 1 / len;
            z0 *= len; z1 *= len; z2 *= len;
        }
        x0 = up.y * z2 - up.z * z1;
        x1 = up.z * z0 - up.x * z2;
        x2 = up.x * z1 - up.y * z0;
        len = Math.hypot(x0, x1, x2);
        if (len === 0) {
            x0 = 0; x1 = 0; x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len; x1 *= len; x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);
        if (len === 0) {
            y0 = 0; y1 = 0; y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len; y1 *= len; y2 *= len;
        }
        out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
        out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
        out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
        out[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
        out[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
        out[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
        out[15] = 1;
        return out;
    },
    fromRotationY(out, rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        out.fill(0);
        out[0] = c;  out[2] = -s;
        out[5] = 1;
        out[8] = s;  out[10] = c;
        out[15] = 1;
        return out;
    }
};

// Passive Spherical Camera Controller (No mouse/touch interception so page scrolls naturally)
class CanvasOrbitControls {
    constructor(camera) {
        this.camera = camera;
        this.target = new Vec3(0, 0, 0);
        this.minDistance = 0.4;
        this.maxDistance = 120.0;
        this.spherical = { radius: 14, phi: Math.PI / 3, theta: 0 };
        this.syncFromCamera();
    }

    syncFromCamera() {
        const dx = this.camera.position.x - this.target.x;
        const dy = this.camera.position.y - this.target.y;
        const dz = this.camera.position.z - this.target.z;
        const r = Math.max(0.001, Math.hypot(dx, dy, dz));
        this.spherical.radius = r;
        this.spherical.theta = Math.atan2(dx, dz);
        this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, dy / r)));
    }

    update() {
        const EPS = 0.0001;
        this.spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.spherical.phi));
        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

        const sinPhiRadius = Math.sin(this.spherical.phi) * this.spherical.radius;
        this.camera.position.x = this.target.x + sinPhiRadius * Math.sin(this.spherical.theta);
        this.camera.position.y = this.target.y + Math.cos(this.spherical.phi) * this.spherical.radius;
        this.camera.position.z = this.target.z + sinPhiRadius * Math.cos(this.spherical.theta);
    }
}

// ============================================================================
// 2. GALAXY MODEL DEFINITION & CONSTANTS
// ============================================================================
const PRESETS = {
    spiralGalaxy: {
        key: 'spiralGalaxy',
        title: '3D Spiral Galaxy',
        badge: 'Orbital Disk',
        subtitle: '3D Orbital Spiral Galaxy Disk',
        count: 250000,
        radius: 12.6,
        branches: 4,
        spin: 0.0,
        barFactor: 0.0,
        randomness: 0.46,
        randomnessPower: 2.9,
        coreConcentration: 0.42,
        thickness: 0.24,
        nebula: 0.20,
        coreColor: '#ff7b00',
        midColor: '#9333ea',
        outerColor: '#ec4899',
        starSize: 32,
        rotationSpeed: 0.14,
        differential: 0.52
    }
};

const POETIC_PREFIXES = ['Seraphic', 'Astral', 'Velvet', 'Hyperion', 'Elysian', 'Solstice', 'Valhalla', 'Obsidian', 'Luminous', 'Cygnus'];
const POETIC_NOUNS = ['Crown', 'Halo', 'Cascade', 'Sanctuary', 'Nebula', 'Horizon', 'Cluster', 'Diadem', 'Ascendant', 'Ring'];

// ============================================================================
// 3. CUSTOM GLSL SHADER PIPELINES (DEFINED AT MODULE SCOPE FOR ESLINT)
// ============================================================================
const galaxyVertexShaderSrc = `
    precision highp float;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uSize;
    uniform float uRotationSpeed;
    uniform float uDifferential;
    uniform float uMaxRadius;

    attribute vec3 position;
    attribute vec3 color;
    attribute float aScale;
    attribute vec3 aRandomness;
    attribute float aType;

    varying vec3 vColor;
    varying float vType;
    varying float vAlpha;
    varying float vFogDepth;

    void main() {
        vColor = color;
        vType = aType;

        vec3 pos = position;

        float dist = length(pos.xz);
        float normDist = clamp(dist / max(uMaxRadius, 0.001), 0.025, 1.6);
        float keplerFactor = 1.0 / pow(normDist + 0.22, 0.68);
        float angularVel = uRotationSpeed * mix(1.0, keplerFactor, uDifferential);
        float angle = -uTime * angularVel;

        float cosA = cos(angle);
        float sinA = sin(angle);

        vec2 rotatedXZ = vec2(
            pos.x * cosA - pos.z * sinA,
            pos.x * sinA + pos.z * cosA
        );
        pos.x = rotatedXZ.x;
        pos.z = rotatedXZ.y;

        vec2 rotatedRandXZ = vec2(
            aRandomness.x * cosA - aRandomness.z * sinA,
            aRandomness.x * sinA + aRandomness.z * cosA
        );
        pos.x += rotatedRandXZ.x;
        pos.y += aRandomness.y + sin(uTime * 0.75 + dist * 1.8) * 0.014;
        pos.z += rotatedRandXZ.y;

        vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;
        vFogDepth = -viewPosition.z;

        float typeMultiplier = 1.0;
        if (aType > 0.5 && aType < 1.5) {
            typeMultiplier = 4.4;
        } else if (aType >= 1.5) {
            typeMultiplier = 2.35;
        }

        float finalSize = uSize * aScale * typeMultiplier * (1.0 / max(-viewPosition.z, 0.001));
        gl_PointSize = clamp(finalSize, 0.8, 135.0);

        float twinkle = 1.0;
        if (aType >= 1.5) {
            twinkle = 0.84 + 0.16 * sin(uTime * 3.8 + aScale * 47.0);
        }
        vAlpha = twinkle;
    }
`;

const galaxyFragmentShaderSrc = `
    precision highp float;

    varying vec3 vColor;
    varying float vType;
    varying float vAlpha;
    varying float vFogDepth;

    void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;

        float strength = 0.0;

        if (vType > 0.5 && vType < 1.5) {
            strength = smoothstep(0.5, 0.0, dist);
            strength = pow(strength, 2.15) * 0.25;
        } else if (vType >= 1.5) {
            float core = pow(max(0.0, 1.0 - dist * 2.0), 2.7);
            float spikeH = max(0.0, 1.0 - abs(uv.x * 26.0)) * max(0.0, 1.0 - dist * 2.0);
            float spikeV = max(0.0, 1.0 - abs(uv.y * 26.0)) * max(0.0, 1.0 - dist * 2.0);
            strength = (core + (spikeH + spikeV) * 0.52) * vAlpha;
        } else {
            strength = 1.0 - (dist * 2.0);
            strength = pow(max(0.0, strength), 2.35);
        }

        float fogFactor = exp(-0.0001 * vFogDepth * vFogDepth);
        strength *= clamp(fogFactor, 0.0, 1.0);

        vec3 finalColor = mix(vColor, vec3(1.0), pow(clamp(strength, 0.0, 1.0), 2.8) * 0.38);
        gl_FragColor = vec4(finalColor * strength, strength);
    }
`;

const bgStarVertexShaderSrc = `
    precision highp float;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uPointSize;
    uniform float uViewportHeight;

    attribute vec3 position;
    attribute vec3 color;

    varying vec3 vColor;
    varying float vFogDepth;

    void main() {
        vColor = color;
        vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        vFogDepth = -viewPosition.z;

        float projScale = projectionMatrix[1][1] * (uViewportHeight * 0.5);
        gl_PointSize = clamp((uPointSize * projScale) / max(-viewPosition.z, 0.1), 1.0, 12.0);
    }
`;

const bgStarFragmentShaderSrc = `
    precision highp float;

    uniform float uOpacity;
    varying vec3 vColor;
    varying float vFogDepth;

    void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;
        float softEdge = smoothstep(0.5, 0.15, d);
        float fogFactor = exp(-0.0001 * vFogDepth * vFogDepth);
        float alpha = uOpacity * softEdge * clamp(fogFactor, 0.0, 1.0);
        gl_FragColor = vec4(vColor, alpha);
    }
`;

const spriteVertexShaderSrc = `
    precision highp float;

    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec2 uScale;

    attribute vec2 aCorner;
    varying vec2 vUv;

    void main() {
        vUv = aCorner + vec2(0.5);
        vec4 viewCenter = viewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        viewCenter.xy += aCorner * uScale;
        gl_Position = projectionMatrix * viewCenter;
    }
`;

const spriteFragmentShaderSrc = `
    precision highp float;

    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;

    varying vec2 vUv;

    void main() {
        vec4 texel = texture2D(uTexture, vUv);
        float a = texel.a * uOpacity;
        gl_FragColor = vec4(texel.rgb * uColor * a, a);
    }
`;

// ============================================================================
// 4. CONTAINER-SCOPED CSS STYLES (SQUARE CORNERS + TOP/BOTTOM SPACING)
// ============================================================================
const GALAXY_STYLES = `
    .galaxy-root {
        --bg-deep: #02040a;
        --panel-bg: rgba(8, 12, 24, 0.84);
        --border-glass: rgba(148, 163, 184, 0.18);
        --accent-indigo: #818cf8;
        --text-main: #e2e8f0;
        --text-muted: #94a3b8;
        position: relative;
        isolation: isolate;
        width: 100%;
        margin-top: 20px;
        margin-bottom: 38px;
        border-radius: 0;
        overflow: hidden;
        background-color: var(--bg-deep);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: var(--text-main);
        touch-action: pan-y;
    }

    @media (max-width: 768px) {
        .galaxy-root {
        margin-top: 25px;
        margin-bottom: 45px;
        }
    }

    .galaxy-root * {
        box-sizing: border-box;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    .galaxy-root .font-mono-tech {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .galaxy-root #preloader {
        position: absolute;
        inset: 0;
        z-index: 50;
        background: var(--bg-deep);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.55s ease;
    }
    .galaxy-root #preloader.loaded {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
    .galaxy-root .loader-orbit {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 4px solid rgba(148, 163, 184, 0.25);
        border-top-color: #ff7b00;
        animation: galaxyOrbitSpin 0.85s linear infinite;
    }
    .galaxy-root .loader-text {
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: #ff7b00;
    }
    @keyframes galaxyOrbitSpin {
        to { transform: rotate(360deg); }
    }

    .galaxy-root #canvas-container {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        touch-action: pan-y;
    }

    .galaxy-root #canvas-container canvas {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .galaxy-root .glass-panel {
        background: var(--panel-bg);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid var(--border-glass);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .galaxy-root .custom-scroll::-webkit-scrollbar {
        width: 5px;
    }
    .galaxy-root .custom-scroll::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.35);
    }
    .galaxy-root .custom-scroll::-webkit-scrollbar-thumb {
        background: rgba(129, 140, 248, 0.45);
        border-radius: 9999px;
    }
    .galaxy-root .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(129, 140, 248, 0.85);
    }

    .galaxy-root input[type="range"].astro-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 5px;
        background: rgba(30, 41, 59, 0.9);
        border-radius: 999px;
        outline: none;
        border: 1px solid rgba(148, 163, 184, 0.16);
        transition: border-color 0.2s ease;
    }
    .galaxy-root input[type="range"].astro-slider:hover {
        border-color: rgba(129, 140, 248, 0.55);
    }
    .galaxy-root input[type="range"].astro-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent-indigo);
        cursor: pointer;
        box-shadow: 0 0 10px rgba(129, 140, 248, 0.85);
        border: 2px solid #e0e7ff;
        transition: transform 0.15s ease, background-color 0.15s ease;
    }
    .galaxy-root input[type="range"].astro-slider::-webkit-slider-thumb:hover {
        transform: scale(1.18);
        background: #a5b4fc;
    }

    .galaxy-root input[type="color"].astro-color {
        -webkit-appearance: none;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        cursor: pointer;
        background: transparent;
        padding: 0;
    }
    .galaxy-root input[type="color"].astro-color::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    .galaxy-root input[type="color"].astro-color::-webkit-color-swatch {
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 7px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .galaxy-root .hud-top-left {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        pointer-events: none;
        max-width: 380px;
        width: calc(100% - 2rem);
    }
    .galaxy-root .pointer-auto { pointer-events: auto; }

    .galaxy-root .preset-header-card {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.85rem 1rem;
        border-radius: 1rem;
    }
    .galaxy-root .icon-box {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.75rem;
        background: rgba(129, 140, 248, 0.15);
        border: 1px solid rgba(129, 140, 248, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-indigo);
        flex-shrink: 0;
    }
    .galaxy-root .icon-box svg {
        width: 1.35rem;
        height: 1.35rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .galaxy-root .title-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    .galaxy-root .preset-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .galaxy-root .telemetry-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.6rem 0.85rem;
        border-radius: 0.75rem;
        font-size: 0.7rem;
        font-family: ui-monospace, monospace;
        color: #cbd5e1;
    }
    .galaxy-root .telemetry-item {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        white-space: nowrap;
    }
    .galaxy-root .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 8px #34d399;
        display: inline-block;
        flex-shrink: 0;
    }
    .galaxy-root .divider-v {
        width: 1px;
        height: 0.85rem;
        background: rgba(148, 163, 184, 0.25);
        flex-shrink: 0;
    }

    .galaxy-root .hud-bottom-dock {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 0.75rem;
        border-radius: 1rem;
        pointer-events: auto;
        max-width: calc(100% - 1.5rem);
    }
    .galaxy-root .dock-group {
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }
    .galaxy-root .dock-divider {
        height: 1.25rem;
        margin: 0 0.2rem;
    }
    .galaxy-root .dock-btn {
        background: transparent;
        border: 1px solid transparent;
        color: #cbd5e1;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.42rem 0.65rem;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        white-space: nowrap;
    }
    .galaxy-root .dock-btn svg {
        width: 0.95rem;
        height: 0.95rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        flex-shrink: 0;
    }
    .galaxy-root .dock-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
    }
    .galaxy-root .dock-btn.active-cam {
        background: rgba(129, 140, 248, 0.22);
        color: #ffffff;
        border-color: rgba(129, 140, 248, 0.45);
    }
    .galaxy-root .pause-label {
        display: none;
    }

    .galaxy-root .toggle-gui-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 0.85rem;
        height: 2.5rem;
        border-radius: 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #e2e8f0;
        cursor: pointer;
        border: 1px solid var(--border-glass);
        transition: all 0.2s ease;
    }
    .galaxy-root .toggle-gui-btn svg {
        width: 0.9rem;
        height: 0.9rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        flex-shrink: 0;
    }
    .galaxy-root .toggle-gui-btn:hover {
        color: #ffffff;
        border-color: rgba(129, 140, 248, 0.5);
    }

    .galaxy-root .gui-panel {
        position: absolute;
        top: 4.2rem;
        right: 1rem;
        bottom: 4.8rem;
        width: 340px;
        max-width: calc(100% - 2rem);
        z-index: 25;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
    }
    .galaxy-root .gui-panel.closed {
        transform: translateX(calc(100% + 2rem));
        opacity: 0;
        pointer-events: none;
    }

    @media (min-width: 1024px) {
        .galaxy-root .gui-panel {
            bottom: 1rem;
            width: 360px;
        }
    }

    .galaxy-root .panel-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(15, 23, 42, 0.4);
        flex-shrink: 0;
    }
    .galaxy-root .panel-title {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #cbd5e1;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .galaxy-root .panel-title svg {
        width: 0.95rem;
        height: 0.95rem;
        fill: none;
        stroke: var(--accent-indigo);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .galaxy-root .reset-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--text-muted);
        font-size: 0.7rem;
        padding: 0.3rem 0.6rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    .galaxy-root .reset-btn svg {
        width: 0.8rem;
        height: 0.8rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .galaxy-root .reset-btn:hover {
        background: rgba(129, 140, 248, 0.2);
        color: #ffffff;
        border-color: rgba(129, 140, 248, 0.35);
    }

    .galaxy-root .panel-body {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .galaxy-root .section-label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #a5b4fc;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.65rem;
    }
    .galaxy-root .section-label svg {
        width: 0.85rem;
        height: 0.85rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .galaxy-root .preset-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0.5rem;
    }
    .galaxy-root .preset-btn {
        text-align: left;
        padding: 0.65rem;
        border-radius: 0.75rem;
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.55);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .galaxy-root .preset-btn:hover {
        border-color: rgba(129, 140, 248, 0.5);
        transform: translateY(-1px);
    }
    .galaxy-root .preset-btn.active {
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.38), rgba(147, 51, 234, 0.28));
        border-color: rgba(129, 140, 248, 0.85);
        box-shadow: 0 0 15px rgba(129, 140, 248, 0.25);
    }
    .galaxy-root .preset-btn-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .galaxy-root .dot-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    .galaxy-root .preset-btn-sub {
        font-size: 0.65rem;
        color: var(--text-muted);
        font-family: ui-monospace, monospace;
        margin-top: 0.2rem;
    }

    .galaxy-root .gradient-preview {
        height: 0.85rem;
        width: 100%;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
    }

    .galaxy-root .color-pickers-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    .galaxy-root .color-card {
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(148, 163, 184, 0.12);
        border-radius: 0.75rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
    }
    .galaxy-root .color-label {
        font-size: 0.65rem;
        color: #cbd5e1;
        font-weight: 500;
    }
    .galaxy-root .color-hex {
        font-size: 0.6rem;
        font-family: ui-monospace, monospace;
        color: var(--text-muted);
    }

    .galaxy-root .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .galaxy-root .control-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.72rem;
    }
    .galaxy-root .control-title { color: #cbd5e1; }
    .galaxy-root .control-value { font-family: ui-monospace, monospace; color: #a5b4fc; }

    .galaxy-root .divider-h {
        height: 1px;
        width: 100%;
        background: rgba(148, 163, 184, 0.12);
        flex-shrink: 0;
    }

    .galaxy-root .panel-footer {
        padding: 0.6rem 1rem;
        border-top: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(2, 4, 10, 0.7);
        font-size: 0.68rem;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
    }

    .galaxy-root .toast-banner {
        position: absolute;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 40;
        background: rgba(8, 12, 24, 0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(129, 140, 248, 0.35);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;
        color: #e0e7ff;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: calc(100% - 2rem);
        white-space: nowrap;
    }
    .galaxy-root .toast-banner svg {
        width: 0.9rem;
        height: 0.9rem;
        fill: none;
        stroke: var(--accent-indigo);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        flex-shrink: 0;
    }
    .galaxy-root .toast-banner.show { opacity: 1; }

    @media (max-width: 768px) {
        .galaxy-root .hud-top-left {
            top: 0.65rem;
            left: 0.65rem;
            right: 0.65rem;
            width: auto;
            max-width: none;
            gap: 0.45rem;
        }

        .galaxy-root .preset-header-card {
            margin-right: 7.4rem;
            padding: 0.6rem 0.75rem;
            gap: 0.65rem;
            border-radius: 0.85rem;
        }

        .galaxy-root .icon-box {
            width: 2.1rem;
            height: 2.1rem;
            border-radius: 0.6rem;
        }
        .galaxy-root .icon-box svg {
            width: 1.15rem;
            height: 1.15rem;
        }
        .galaxy-root .preset-title {
            font-size: 0.85rem;
        }

        .galaxy-root .toggle-gui-btn {
            top: 0.65rem;
            right: 0.65rem;
            height: 3.1rem;
            padding: 0 0.75rem;
            border-radius: 0.85rem;
            font-size: 0.72rem;
        }

        .galaxy-root .telemetry-bar {
            padding: 0.45rem 0.75rem;
            font-size: 0.65rem;
            gap: 0.5rem;
        }

        .galaxy-root .hud-bottom-dock {
            bottom: 0.65rem;
            width: calc(100% - 1.3rem);
            max-width: 440px;
            flex-direction: column;
            align-items: stretch;
            padding: 0.45rem;
            gap: 0.35rem;
            border-radius: 0.95rem;
        }

        .galaxy-root .dock-divider {
            display: none;
        }

        .galaxy-root .dock-group-cam {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.28rem;
            width: 100%;
        }

        .galaxy-root .dock-group-actions {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.28rem;
            width: 100%;
            padding-top: 0.35rem;
            border-top: 1px solid rgba(148, 163, 184, 0.16);
        }

        .galaxy-root .dock-btn {
            padding: 0.45rem 0.3rem;
            font-size: 0.7rem;
            gap: 0.3rem;
            border-radius: 0.6rem;
        }

        .galaxy-root .pause-label {
            display: inline;
        }

        .galaxy-root .gui-panel {
            top: 6.8rem;
            bottom: 6.2rem;
            right: 0.65rem;
            left: 0.65rem;
            width: auto;
            max-width: 420px;
            margin-left: auto;
        }

        .galaxy-root .toast-banner {
            top: auto;
            bottom: 6.4rem;
            font-size: 0.7rem;
            padding: 0.42rem 0.85rem;
        }

        .galaxy-root input[type="range"].astro-slider::-webkit-slider-thumb {
            width: 18px;
            height: 18px;
        }
    }
`;

// ============================================================================
// 5. MAIN REACT COMPONENT (SpiralGalaxy)
// ============================================================================
export default function SpiralGalaxy({ height = '680px', margin = '1.5rem 0', className = '' }) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const toastTimerRef = useRef(null);

    const [uiParams, setUiParams] = useState(() => ({ ...PRESETS.spiralGalaxy }));
    const [activePresetKey, setActivePresetKey] = useState('spiralGalaxy');
    const [activeCam, setActiveCam] = useState('oblique');
    const [isPaused, setIsPaused] = useState(false);
    const [isGuiOpen, setIsGuiOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));
    const [isCompactToggle, setIsCompactToggle] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 420 : false));
    const [fps, setFps] = useState(60);
    const [isLoaded, setIsLoaded] = useState(false);
    const [toast, setToast] = useState({ message: 'Loaded Orbital Galaxy', visible: false });

    const showToast = useCallback((message) => {
        setToast({ message, visible: true });
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 2300);
    }, []);

    useEffect(() => {
        const rootEl = rootRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !rootEl) return undefined;

        const gl = canvas.getContext('webgl', {
            antialias: true,
            alpha: false,
            depth: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
        }) || canvas.getContext('experimental-webgl');

        if (!gl) {
            return undefined;
        }

        const getContainerDimensions = () => {
            const w = Math.max(1, rootEl.clientWidth || 800);
            const h = Math.max(1, rootEl.clientHeight || 600);
            return { width: w, height: h };
        };

        const getAspectDistanceMultiplier = () => {
            const { width, height } = getContainerDimensions();
            const aspect = width / height;
            return aspect < 1.0 ? Math.min(1.45, 1.0 / Math.pow(aspect, 0.42)) : 1.0;
        };

        // Góc nhìn sát trung tâm thiên hà hơn
        const computeCameraTargetPos = (mode, r) => {
            const mult = getAspectDistanceMultiplier();
            if (mode === 'top') {
                return new Vec3(0.01, r * 1.35 * mult, 0.01);
            }
            if (mode === 'edge') {
                return new Vec3(0, r * 0.04, r * 1.12 * mult);
            }
            if (mode === 'core') {
                return new Vec3(r * 0.14, r * 0.06, r * 0.18);
            }
            return new Vec3(0, r * 0.52 * mult, r * 0.98 * mult);
        };

        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const createProgram = (vsSource, fsSource, attribs, uniforms) => {
            const vs = compileShader(gl.VERTEX_SHADER, vsSource);
            const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            const attribLocs = {};
            attribs.forEach((a) => { attribLocs[a] = gl.getAttribLocation(prog, a); });
            const uniformLocs = {};
            uniforms.forEach((u) => { uniformLocs[u] = gl.getUniformLocation(prog, u); });
            return { program: prog, vs, fs, attribs: attribLocs, uniforms: uniformLocs };
        };

        const camera = {
            fov: 54,
            aspect: 1,
            near: 0.05,
            far: 320,
            position: new Vec3(),
            up: new Vec3(0, 1, 0),
            projectionMatrix: Mat4.create(),
            viewMatrix: Mat4.create(),
            updateProjectionMatrix() {
                Mat4.perspective(
                    this.projectionMatrix,
                    (this.fov * Math.PI) / 180,
                    this.aspect,
                    this.near,
                    this.far
                );
            }
        };

        const identityMatrix = Mat4.create();
        let pixelRatio = 1;

        const controls = new CanvasOrbitControls(camera);
        let currentCamMode = 'oblique';

        const camTransition = {
            active: false,
            startPos: new Vec3(),
            endPos: new Vec3(),
            startTarget: new Vec3(),
            endTarget: new Vec3(),
            progress: 0
        };

        const resizeCanvas = () => {
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const { width, height } = getContainerDimensions();
            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            gl.viewport(0, 0, canvas.width, canvas.height);
            setIsCompactToggle(width < 420);

            if (!camTransition.active && engineRef.current) {
                const fittedPos = computeCameraTargetPos(currentCamMode, engineRef.current.params.radius);
                camera.position.copy(fittedPos);
                controls.syncFromCamera();
            }
        };

        camera.position.copy(computeCameraTargetPos('oblique', PRESETS.spiralGalaxy.radius));
        controls.syncFromCamera();
        resizeCanvas();

        gl.clearColor(0.0078, 0.0157, 0.0392, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);

        const galaxyProgram = createProgram(
            galaxyVertexShaderSrc,
            galaxyFragmentShaderSrc,
            ['position', 'color', 'aScale', 'aRandomness', 'aType'],
            ['modelMatrix', 'viewMatrix', 'projectionMatrix', 'uTime', 'uSize', 'uRotationSpeed', 'uDifferential', 'uMaxRadius']
        );

        const bgStarProgram = createProgram(
            bgStarVertexShaderSrc,
            bgStarFragmentShaderSrc,
            ['position', 'color'],
            ['modelMatrix', 'viewMatrix', 'projectionMatrix', 'uPointSize', 'uViewportHeight', 'uOpacity']
        );

        const spriteProgram = createProgram(
            spriteVertexShaderSrc,
            spriteFragmentShaderSrc,
            ['aCorner'],
            ['viewMatrix', 'projectionMatrix', 'uScale', 'uTexture', 'uColor', 'uOpacity']
        );

        // Multi-Layered Background Starfield
        const backgroundStarLayers = [];
        const layers = [
            { count: 5500, minR: 50, maxR: 125, size: 0.16, opacity: 0.65 },
            { count: 1600, minR: 45, maxR: 105, size: 0.30, opacity: 0.85 }
        ];

        layers.forEach((layerCfg) => {
            const pos = new Float32Array(layerCfg.count * 3);
            const col = new Float32Array(layerCfg.count * 3);

            for (let i = 0; i < layerCfg.count; i++) {
                const r = layerCfg.minR + Math.random() * (layerCfg.maxR - layerCfg.minR);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                pos[i * 3 + 2] = r * Math.cos(phi);

                const tint = Math.random();
                const b = 0.45 + Math.random() * 0.55;
                if (tint < 0.35) {
                    col[i * 3] = 0.72 * b; col[i * 3 + 1] = 0.84 * b; col[i * 3 + 2] = 1.0 * b;
                } else if (tint < 0.7) {
                    col[i * 3] = 1.0 * b; col[i * 3 + 1] = 0.93 * b; col[i * 3 + 2] = 0.82 * b;
                } else {
                    col[i * 3] = 0.88 * b; col[i * 3 + 1] = 0.86 * b; col[i * 3 + 2] = 1.0 * b;
                }
            }

            const posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

            const colBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, col, gl.STATIC_DRAW);

            backgroundStarLayers.push({
                posBuffer,
                colBuffer,
                count: layerCfg.count,
                size: layerCfg.size,
                opacity: layerCfg.opacity,
                rotationY: 0,
                modelMatrix: Mat4.create()
            });
        });

        // Volumetric Core Glow Texture & Quad
        const texCanvas = document.createElement('canvas');
        texCanvas.width = 256;
        texCanvas.height = 256;
        const ctx = texCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.18, 'rgba(255, 220, 180, 0.78)');
        grad.addColorStop(0.48, 'rgba(255, 120, 50, 0.24)');
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);

        const glowTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glowTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const corners = new Float32Array([
            -0.5, -0.5,
             0.5, -0.5,
            -0.5,  0.5,
            -0.5,  0.5,
             0.5, -0.5,
             0.5,  0.5
        ]);
        const spriteQuadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spriteQuadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, corners, gl.STATIC_DRAW);

        const coreHaloSprite = {
            scale: { x: 1, y: 1 },
            color: new Color('#ff7b00'),
            opacity: 0.85
        };
        const innerNucleusSprite = {
            scale: { x: 1, y: 1 },
            color: new Color('#ffffff'),
            opacity: 0.95
        };

        const engine = {
            gl,
            canvas,
            camera,
            controls,
            camTransition,
            params: { ...PRESETS.spiralGalaxy },
            isPaused: false,
            simTime: 0,
            galaxyBuffers: null,
            galaxyVertexCount: 0,
            generateGalaxy: null,
            renderScene: null,
            flyCameraTo: null
        };

        const generateGalaxy = () => {
            const p = engine.params;
            if (engine.galaxyBuffers) {
                gl.deleteBuffer(engine.galaxyBuffers.position);
                gl.deleteBuffer(engine.galaxyBuffers.color);
                gl.deleteBuffer(engine.galaxyBuffers.scale);
                gl.deleteBuffer(engine.galaxyBuffers.randomness);
                gl.deleteBuffer(engine.galaxyBuffers.type);
            }

            const count = Math.floor(p.count);
            engine.galaxyVertexCount = count;

            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const scales = new Float32Array(count);
            const randomness = new Float32Array(count * 3);
            const particleTypes = new Float32Array(count);

            const colorCore = new Color(p.coreColor);
            const colorMid = new Color(p.midColor);
            const colorOuter = new Color(p.outerColor);

            const colorNebula = new Color(p.midColor).lerp(new Color('#ec4899'), 0.55);
            const tempColor = new Color();

            const maxR = p.radius;
            const bulgeFraction = p.coreConcentration * 0.42;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const isBulgeStar = Math.random() < bulgeFraction;

                let r = 0, rNorm = 0, x = 0, y = 0, z = 0;
                let pType = 0.0;

                if (isBulgeStar) {
                    const u = Math.random();
                    const bulgeRadius = maxR * (0.14 + p.coreConcentration * 0.26);
                    r = Math.pow(u, 1.85) * bulgeRadius;
                    rNorm = r / maxR;

                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const flattenY = 0.50 + p.thickness * 0.45;

                    x = r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 0.14;
                    y = r * Math.cos(phi) * flattenY + (Math.random() - 0.5) * 0.11;
                    z = r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 0.14;
                } else {
                    const u = Math.random();
                    const radialExp = 1.05 + p.coreConcentration * 1.40;
                    const baseR = Math.pow(u, radialExp) * maxR;

                    const spreadScale = p.randomness * (0.24 + baseR * 0.82);
                    const power = p.randomnessPower;
                    const radialOffset = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * spreadScale;

                    r = Math.max(0.02, baseR + radialOffset);
                    rNorm = Math.min(1.0, r / maxR);

                    const totalAngle = Math.random() * Math.PI * 2;

                    x = Math.cos(totalAngle) * r;
                    z = Math.sin(totalAngle) * r;

                    const verticalEnvelope = p.thickness * (1.15 - rNorm * 0.65) * maxR * 0.15;
                    y = Math.pow(Math.random(), power * 0.9) * (Math.random() < 0.5 ? 1 : -1) * verticalEnvelope;

                    const diskProximity = 1.0 - Math.min(1.0, Math.abs(radialOffset) / (spreadScale + 0.001));
                    if (rNorm > 0.12 && rNorm < 0.92 && diskProximity > 0.66 && Math.random() < p.nebula * 0.18) {
                        pType = 1.0;
                    } else if (Math.random() < 0.0075) {
                        pType = 2.0;
                    }
                }

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;

                randomness[i3] = 0;
                randomness[i3 + 1] = 0;
                randomness[i3 + 2] = 0;
                particleTypes[i] = pType;

                const curvedR = Math.min(1.0, Math.pow(rNorm, 0.82));
                if (curvedR < 0.45) {
                    const t = curvedR / 0.45;
                    tempColor.copy(colorCore).lerp(colorMid, t);
                } else {
                    const t = (curvedR - 0.45) / 0.55;
                    tempColor.copy(colorMid).lerp(colorOuter, t);
                }

                if (pType === 1.0) {
                    tempColor.lerp(colorNebula, 0.65);
                } else {
                    const jitter = (Math.random() - 0.5) * 0.10;
                    tempColor.r = Math.min(1, Math.max(0, tempColor.r + jitter));
                    tempColor.g = Math.min(1, Math.max(0, tempColor.g + jitter * 0.6));
                    tempColor.b = Math.min(1, Math.max(0, tempColor.b - jitter));
                }

                colors[i3] = tempColor.r;
                colors[i3 + 1] = tempColor.g;
                colors[i3 + 2] = tempColor.b;

                if (pType === 1.0) {
                    scales[i] = 1.45 + Math.random() * 1.85;
                } else if (pType === 2.0) {
                    scales[i] = 1.65 + Math.random() * 1.45;
                } else {
                    scales[i] = 0.25 + Math.pow(Math.random(), 2.5) * 1.35;
                }
            }

            const makeBuf = (arr) => {
                const b = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, b);
                gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
                return b;
            };

            engine.galaxyBuffers = {
                position: makeBuf(positions),
                color: makeBuf(colors),
                scale: makeBuf(scales),
                randomness: makeBuf(randomness),
                type: makeBuf(particleTypes)
            };

            const haloScale = p.radius * (0.38 + p.coreConcentration * 0.85);
            coreHaloSprite.scale.x = haloScale;
            coreHaloSprite.scale.y = haloScale * (0.68 + p.thickness * 0.32);
            coreHaloSprite.color.set(p.coreColor);
            coreHaloSprite.opacity = Math.min(0.92, 0.48 + p.coreConcentration * 0.70);

            const nucleusScale = haloScale * 0.35;
            innerNucleusSprite.scale.x = nucleusScale;
            innerNucleusSprite.scale.y = nucleusScale * 0.85;
            innerNucleusSprite.color.set(p.coreColor).lerp(new Color('#ffffff'), 0.6);

            const updatedTargetPos = computeCameraTargetPos(currentCamMode, p.radius);
            camera.position.copy(updatedTargetPos);
            controls.syncFromCamera();
        };

        const renderScene = () => {
            const p = engine.params;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.depthMask(false);

            Mat4.lookAt(camera.viewMatrix, camera.position, controls.target, camera.up);

            // 1. Multi-Layered Background Starfield
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(bgStarProgram.program);
            gl.uniformMatrix4fv(bgStarProgram.uniforms.viewMatrix, false, camera.viewMatrix);
            gl.uniformMatrix4fv(bgStarProgram.uniforms.projectionMatrix, false, camera.projectionMatrix);
            gl.uniform1f(bgStarProgram.uniforms.uViewportHeight, canvas.height);

            for (let i = 0; i < backgroundStarLayers.length; i++) {
                const layer = backgroundStarLayers[i];
                Mat4.fromRotationY(layer.modelMatrix, layer.rotationY);
                gl.uniformMatrix4fv(bgStarProgram.uniforms.modelMatrix, false, layer.modelMatrix);
                gl.uniform1f(bgStarProgram.uniforms.uPointSize, layer.size);
                gl.uniform1f(bgStarProgram.uniforms.uOpacity, layer.opacity);

                gl.bindBuffer(gl.ARRAY_BUFFER, layer.posBuffer);
                gl.enableVertexAttribArray(bgStarProgram.attribs.position);
                gl.vertexAttribPointer(bgStarProgram.attribs.position, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, layer.colBuffer);
                gl.enableVertexAttribArray(bgStarProgram.attribs.color);
                gl.vertexAttribPointer(bgStarProgram.attribs.color, 3, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.POINTS, 0, layer.count);
            }

            // 2. Additive Blending for Volumetric Core Glow & Galaxy Stars
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

            if (glowTexture && spriteQuadBuffer) {
                gl.useProgram(spriteProgram.program);
                gl.uniformMatrix4fv(spriteProgram.uniforms.viewMatrix, false, camera.viewMatrix);
                gl.uniformMatrix4fv(spriteProgram.uniforms.projectionMatrix, false, camera.projectionMatrix);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, glowTexture);
                gl.uniform1i(spriteProgram.uniforms.uTexture, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, spriteQuadBuffer);
                gl.enableVertexAttribArray(spriteProgram.attribs.aCorner);
                gl.vertexAttribPointer(spriteProgram.attribs.aCorner, 2, gl.FLOAT, false, 0, 0);

                gl.uniform2f(spriteProgram.uniforms.uScale, coreHaloSprite.scale.x, coreHaloSprite.scale.y);
                gl.uniform3f(spriteProgram.uniforms.uColor, coreHaloSprite.color.r, coreHaloSprite.color.g, coreHaloSprite.color.b);
                gl.uniform1f(spriteProgram.uniforms.uOpacity, coreHaloSprite.opacity);
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                gl.uniform2f(spriteProgram.uniforms.uScale, innerNucleusSprite.scale.x, innerNucleusSprite.scale.y);
                gl.uniform3f(spriteProgram.uniforms.uColor, innerNucleusSprite.color.r, innerNucleusSprite.color.g, innerNucleusSprite.color.b);
                gl.uniform1f(spriteProgram.uniforms.uOpacity, innerNucleusSprite.opacity);
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                gl.disableVertexAttribArray(spriteProgram.attribs.aCorner);
            }

            // 3. Main 250,000-Star Keplerian Galaxy
            if (engine.galaxyBuffers && engine.galaxyVertexCount > 0) {
                gl.useProgram(galaxyProgram.program);
                gl.uniformMatrix4fv(galaxyProgram.uniforms.modelMatrix, false, identityMatrix);
                gl.uniformMatrix4fv(galaxyProgram.uniforms.viewMatrix, false, camera.viewMatrix);
                gl.uniformMatrix4fv(galaxyProgram.uniforms.projectionMatrix, false, camera.projectionMatrix);
                gl.uniform1f(galaxyProgram.uniforms.uTime, engine.simTime);
                gl.uniform1f(galaxyProgram.uniforms.uSize, p.starSize * pixelRatio);
                gl.uniform1f(galaxyProgram.uniforms.uRotationSpeed, p.rotationSpeed);
                gl.uniform1f(galaxyProgram.uniforms.uDifferential, p.differential);
                gl.uniform1f(galaxyProgram.uniforms.uMaxRadius, p.radius);

                gl.bindBuffer(gl.ARRAY_BUFFER, engine.galaxyBuffers.position);
                gl.enableVertexAttribArray(galaxyProgram.attribs.position);
                gl.vertexAttribPointer(galaxyProgram.attribs.position, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, engine.galaxyBuffers.color);
                gl.enableVertexAttribArray(galaxyProgram.attribs.color);
                gl.vertexAttribPointer(galaxyProgram.attribs.color, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, engine.galaxyBuffers.scale);
                gl.enableVertexAttribArray(galaxyProgram.attribs.aScale);
                gl.vertexAttribPointer(galaxyProgram.attribs.aScale, 1, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, engine.galaxyBuffers.randomness);
                gl.enableVertexAttribArray(galaxyProgram.attribs.aRandomness);
                gl.vertexAttribPointer(galaxyProgram.attribs.aRandomness, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, engine.galaxyBuffers.type);
                gl.enableVertexAttribArray(galaxyProgram.attribs.aType);
                gl.vertexAttribPointer(galaxyProgram.attribs.aType, 1, gl.FLOAT, false, 0, 0);

                gl.drawArrays(gl.POINTS, 0, engine.galaxyVertexCount);
            }

            gl.depthMask(true);
        };

        const flyCameraTo = (mode) => {
            currentCamMode = mode;
            const r = engine.params.radius;
            camTransition.startPos.copy(camera.position);
            camTransition.startTarget.copy(controls.target);
            camTransition.endTarget.set(0, 0, 0);
            camTransition.endPos.copy(computeCameraTargetPos(mode, r));
            camTransition.progress = 0;
            camTransition.active = true;
        };

        engine.generateGalaxy = generateGalaxy;
        engine.renderScene = renderScene;
        engine.flyCameraTo = flyCameraTo;
        engineRef.current = engine;

        generateGalaxy();

        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => resizeCanvas());
            resizeObserver.observe(rootEl);
        }
        window.addEventListener('resize', resizeCanvas);

        let animFrameId = null;
        let lastFrameTime = performance.now();
        let frameCount = 0;
        let lastFpsUpdate = performance.now();

        const animate = () => {
            animFrameId = requestAnimationFrame(animate);

            const now = performance.now();
            const delta = Math.min(0.1, (now - lastFrameTime) / 1000);
            lastFrameTime = now;

            if (!engine.isPaused) {
                engine.simTime += delta;
                if (backgroundStarLayers.length > 0) {
                    backgroundStarLayers[0].rotationY = engine.simTime * 0.005;
                    backgroundStarLayers[1].rotationY = engine.simTime * 0.009;
                }
            }

            if (camTransition.active) {
                camTransition.progress += delta * 1.65;
                const t = Math.min(1.0, camTransition.progress);
                const ease = 1 - Math.pow(1 - t, 3);
                camera.position.lerpVectors(camTransition.startPos, camTransition.endPos, ease);
                controls.target.lerpVectors(camTransition.startTarget, camTransition.endTarget, ease);
                controls.syncFromCamera();
                if (t >= 1.0) camTransition.active = false;
            } else {
                controls.update();
            }

            renderScene();

            frameCount++;
            if (now - lastFpsUpdate >= 500) {
                const currentFps = Math.min(144, Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
                setFps(currentFps);
                frameCount = 0;
                lastFpsUpdate = now;
            }
        };

        let warmupFrames = 0;
        const runWarmup = () => {
            warmupFrames++;
            engine.simTime += 0.016;
            controls.update();
            renderScene();

            if (warmupFrames < 5) {
                animFrameId = requestAnimationFrame(runWarmup);
            } else {
                lastFrameTime = performance.now();
                lastFpsUpdate = performance.now();
                setIsLoaded(true);
                animFrameId = requestAnimationFrame(animate);
            }
        };
        animFrameId = requestAnimationFrame(runWarmup);

        return () => {
            if (animFrameId) cancelAnimationFrame(animFrameId);
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', resizeCanvas);

            if (engine.galaxyBuffers) {
                gl.deleteBuffer(engine.galaxyBuffers.position);
                gl.deleteBuffer(engine.galaxyBuffers.color);
                gl.deleteBuffer(engine.galaxyBuffers.scale);
                gl.deleteBuffer(engine.galaxyBuffers.randomness);
                gl.deleteBuffer(engine.galaxyBuffers.type);
            }
            backgroundStarLayers.forEach((l) => {
                gl.deleteBuffer(l.posBuffer);
                gl.deleteBuffer(l.colBuffer);
            });
            if (spriteQuadBuffer) gl.deleteBuffer(spriteQuadBuffer);
            if (glowTexture) gl.deleteTexture(glowTexture);
            [galaxyProgram, bgStarProgram, spriteProgram].forEach((p) => {
                if (p && p.program) {
                    if (p.vs) gl.deleteShader(p.vs);
                    if (p.fs) gl.deleteShader(p.fs);
                    gl.deleteProgram(p.program);
                }
            });
        };
    }, []);

    const handleRebuildParamChange = (key, value) => {
        setUiParams((prev) => ({ ...prev, [key]: value }));
        if (engineRef.current) {
            engineRef.current.params[key] = value;
            engineRef.current.generateGalaxy();
        }
    };

    const handleUniformParamChange = (key, value) => {
        setUiParams((prev) => ({ ...prev, [key]: value }));
        if (engineRef.current) {
            engineRef.current.params[key] = value;
        }
    };

    const handleSelectPreset = (presetKey) => {
        const preset = PRESETS[presetKey];
        if (!preset) return;
        setActivePresetKey(presetKey);
        const nextParams = { ...preset };
        setUiParams(nextParams);
        if (engineRef.current) {
            Object.assign(engineRef.current.params, nextParams);
            engineRef.current.generateGalaxy();
        }
        showToast(`Loaded ${nextParams.title}`);
    };

    const handleResetPreset = () => {
        const targetPreset = PRESETS[activePresetKey] || PRESETS.spiralGalaxy;
        const nextParams = { ...targetPreset };
        setActivePresetKey(targetPreset.key);
        setUiParams(nextParams);
        setActiveCam('oblique');
        if (engineRef.current) {
            Object.assign(engineRef.current.params, nextParams);
            engineRef.current.generateGalaxy();
            engineRef.current.flyCameraTo('oblique');
        }
        showToast(`Reset to ${nextParams.title}`);
    };

    const handleCameraView = (mode) => {
        setActiveCam(mode);
        if (engineRef.current) {
            engineRef.current.flyCameraTo(mode);
        }
        if (mode === 'top') {
            showToast('Viewpoint: Top-Down Galactic Zenith');
        } else if (mode === 'edge') {
            showToast('Viewpoint: Edge-On Galactic Horizon');
        } else if (mode === 'core') {
            showToast('Viewpoint: Galactic Nucleus Dive');
        } else {
            showToast('Viewpoint: Oblique Observatory');
        }
    };

    const handleTogglePause = () => {
        setIsPaused((prev) => {
            const next = !prev;
            if (engineRef.current) {
                engineRef.current.isPaused = next;
            }
            showToast(next ? 'Orbital time paused' : 'Orbital time resumed');
            return next;
        });
    };

    const handleMutate = () => {
        setActivePresetKey(null);

        const randomHex = (hMin, hMax, s, l) => {
            const c = new Color();
            const h = (hMin + Math.random() * (hMax - hMin)) / 360;
            c.setHSL(h, s, l);
            return '#' + c.getHexString();
        };

        const prefix = POETIC_PREFIXES[Math.floor(Math.random() * POETIC_PREFIXES.length)];
        const noun = POETIC_NOUNS[Math.floor(Math.random() * POETIC_NOUNS.length)];
        const ngcNum = Math.floor(1000 + Math.random() * 8999);

        const mutated = {
            ...uiParams,
            title: `${prefix} ${noun}`,
            radius: +(7.2 + Math.random() * 6.5).toFixed(1),
            randomness: +(0.26 + Math.random() * 0.42).toFixed(2),
            randomnessPower: +(2.4 + Math.random() * 2.0).toFixed(1),
            coreConcentration: +(0.22 + Math.random() * 0.36).toFixed(2),
            thickness: +(0.20 + Math.random() * 0.32).toFixed(2),
            nebula: +(0.18 + Math.random() * 0.45).toFixed(2),
            badge: `NGC ${ngcNum} • Orbital`,
            subtitle: 'Procedural concentric stellar disk synthesized in deep space',
            coreColor: randomHex(20, 60, 0.95, 0.76),
            midColor: randomHex(160, 330, 0.90, 0.60),
            outerColor: randomHex(200, 275, 0.88, 0.48)
        };

        setUiParams(mutated);
        if (engineRef.current) {
            Object.assign(engineRef.current.params, mutated);
            engineRef.current.generateGalaxy();
        }
        showToast(`Synthesized ${mutated.title}`);
    };

    const handleScreenshot = () => {
        if (!engineRef.current || !canvasRef.current) return;
        engineRef.current.renderScene();
        const dataURL = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        const slug = uiParams.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        link.download = `astron-${slug}-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        showToast('Snapshot exported to PNG');
    };

    const spanKly = Math.round(uiParams.radius * 12);

    return (
        <div
            ref={rootRef}
            className={`galaxy-root ${className}`}
            style={{ height, borderRadius: 0 }}
        >
            <style>{GALAXY_STYLES}</style>

            <div id="preloader" className={isLoaded ? 'loaded' : ''}>
                <div className="loader-orbit"></div>
                <div className="loader-text">LOADING UNIVERSE...</div>
            </div>

            <div id="canvas-container">
                <canvas ref={canvasRef} />
            </div>

            <div className="hud-top-left">
                <div className="glass-panel preset-header-card pointer-auto">
                    <div className="icon-box" title="Globe Observatory">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="title-row">
                            <h1 id="hud-preset-title" className="preset-title">{uiParams.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="glass-panel telemetry-bar pointer-auto">
                    <div className="telemetry-item">
                        <span className="pulse-dot"></span>
                        <span style={{ color: 'var(--text-muted)' }}>FPS:</span>
                        <span id="stat-fps" style={{ color: '#ffffff', fontWeight: 600 }}>{fps}</span>
                    </div>
                    <div className="divider-v"></div>
                    <div className="telemetry-item">
                        <span style={{ color: 'var(--text-muted)' }}>STARS:</span>
                        <span id="stat-particles" style={{ color: '#a5b4fc', fontWeight: 600 }}>
                            {Math.floor(uiParams.count).toLocaleString()}
                        </span>
                    </div>
                    <div className="divider-v"></div>
                    <div className="telemetry-item">
                        <span style={{ color: 'var(--text-muted)' }}>SPAN:</span>
                        <span id="stat-diameter" style={{ color: '#fcd34d' }}>{spanKly} kly</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel hud-bottom-dock">
                <div className="dock-group dock-group-cam">
                    <button
                        type="button"
                        onClick={() => handleCameraView('oblique')}
                        className={`dock-btn ${activeCam === 'oblique' ? 'active-cam' : ''}`}
                        title="Oblique Observatory View"
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span>Oblique</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCameraView('top')}
                        className={`dock-btn ${activeCam === 'top' ? 'active-cam' : ''}`}
                        title="Top-Down Galactic Zenith"
                    >
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>
                        <span>Zenith</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCameraView('edge')}
                        className={`dock-btn ${activeCam === 'edge' ? 'active-cam' : ''}`}
                        title="Edge-On Galactic Horizon"
                    >
                        <svg viewBox="0 0 24 24">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        <span>Horizon</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCameraView('core')}
                        className={`dock-btn ${activeCam === 'core' ? 'active-cam' : ''}`}
                        title="Galactic Nucleus Dive"
                    >
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <span>Core Dive</span>
                    </button>
                </div>

                <div className="divider-v dock-divider"></div>

                <div className="dock-group dock-group-actions">
                    <button
                        type="button"
                        onClick={handleTogglePause}
                        className="dock-btn"
                        title="Pause / Resume Orbital Time"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            style={{ stroke: isPaused ? '#f59e0b' : '#34d399' }}
                        >
                            {isPaused ? (
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            ) : (
                                <>
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </>
                            )}
                        </svg>
                        <span className="pause-label">
                            {isPaused ? 'Resume' : 'Pause'}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handleMutate}
                        className="dock-btn"
                        title="Random Cosmic Mutator"
                    >
                        <svg viewBox="0 0 24 24" style={{ stroke: '#e879f9' }}>
                            <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9z"></path>
                            <path d="m5 3 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"></path>
                            <path d="m19 15 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"></path>
                        </svg>
                        <span>Mutate</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleScreenshot}
                        className="dock-btn"
                        title="Export PNG Snapshot"
                    >
                        <svg viewBox="0 0 24 24" style={{ stroke: '#38bdf8' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <span>Snapshot</span>
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setIsGuiOpen((prev) => !prev)}
                className="glass-panel toggle-gui-btn"
                title="Toggle Astrophysics Control Panel"
            >
                <svg viewBox="0 0 24 24">
                    <polyline points={isGuiOpen ? '9 18 15 12 9 6' : '15 18 9 12 15 6'}></polyline>
                </svg>
                <span>
                    {isGuiOpen
                        ? (isCompactToggle ? 'Hide' : 'Hide Controls')
                        : (isCompactToggle ? 'Controls' : 'Show Controls')}
                </span>
            </button>

            <aside className={`glass-panel gui-panel ${isGuiOpen ? '' : 'closed'}`}>
                <div className="panel-header">
                    <h2 className="panel-title">
                        <svg viewBox="0 0 24 24">
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                        Astrophysics Synthesizer
                    </h2>
                    <button type="button" onClick={handleResetPreset} className="reset-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <path d="M3 3v5h5"></path>
                        </svg>
                        Reset
                    </button>
                </div>

                <div className="panel-body custom-scroll">
                    <div>
                        <div className="section-label">
                            <svg viewBox="0 0 24 24">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Celestial Orbital Model
                        </div>
                        <div className="preset-grid">
                            <button
                                type="button"
                                onClick={() => handleSelectPreset('spiralGalaxy')}
                                className={`preset-btn ${activePresetKey === 'spiralGalaxy' ? 'active' : ''}`}
                            >
                                <div className="preset-btn-title">
                                    <span>Orbital Galaxy</span>
                                    <span
                                        className="dot-indicator"
                                        style={{ background: '#ff7b00', boxShadow: '0 0 8px #ff7b00' }}
                                    ></span>
                                </div>
                                <div className="preset-btn-sub">360° Orbital • Orange-Purple-Pink</div>
                            </button>
                        </div>
                    </div>

                    <div className="divider-h"></div>

                    <div>
                        <div className="section-label">
                            <svg viewBox="0 0 24 24">
                                <circle cx="13.5" cy="6.5" r=".5"></circle>
                                <circle cx="17.5" cy="10.5" r=".5"></circle>
                                <circle cx="8.5" cy="7.5" r=".5"></circle>
                                <circle cx="6.5" cy="12.5" r=".5"></circle>
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                            </svg>
                            3-Stop Spectral Color Gradient
                        </div>
                        <div
                            className="gradient-preview"
                            style={{
                                background: `linear-gradient(90deg, ${uiParams.coreColor} 0%, ${uiParams.midColor} 50%, ${uiParams.outerColor} 100%)`
                            }}
                        ></div>
                        <div className="color-pickers-grid">
                            <div className="color-card">
                                <input
                                    type="color"
                                    value={uiParams.coreColor}
                                    onChange={(e) => handleRebuildParamChange('coreColor', e.target.value)}
                                    className="astro-color"
                                />
                                <span className="color-label">Core</span>
                                <span className="color-hex">{uiParams.coreColor.toUpperCase()}</span>
                            </div>
                            <div className="color-card">
                                <input
                                    type="color"
                                    value={uiParams.midColor}
                                    onChange={(e) => handleRebuildParamChange('midColor', e.target.value)}
                                    className="astro-color"
                                />
                                <span className="color-label">Mid-Disk</span>
                                <span className="color-hex">{uiParams.midColor.toUpperCase()}</span>
                            </div>
                            <div className="color-card">
                                <input
                                    type="color"
                                    value={uiParams.outerColor}
                                    onChange={(e) => handleRebuildParamChange('outerColor', e.target.value)}
                                    className="astro-color"
                                />
                                <span className="color-label">Outer Halo</span>
                                <span className="color-hex">{uiParams.outerColor.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="divider-h"></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div className="section-label">
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="1"></circle>
                                <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"></path>
                                <path d="M15.7 3.8c4.52 4.54 6.54 9.87 4.5 11.9-2.03 2.04-7.36.02-11.9-4.5C3.78 6.66 1.76 1.33 3.8-.7c2.03-2.04 7.36-.02 11.9 4.5Z"></path>
                            </svg>
                            Disk Structure & Geometry
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Star Count</span>
                                <span className="control-value">{uiParams.count.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="30000"
                                max="320000"
                                step="10000"
                                value={uiParams.count}
                                onChange={(e) => handleRebuildParamChange('count', parseInt(e.target.value, 10))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Galaxy Radius</span>
                                <span className="control-value">{Number(uiParams.radius).toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="4.0"
                                max="16.0"
                                step="0.2"
                                value={uiParams.radius}
                                onChange={(e) => handleRebuildParamChange('radius', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>
                    </div>

                    <div className="divider-h"></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div className="section-label">
                            <svg viewBox="0 0 24 24">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            Radial Distribution & Bulge
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Radial Scatter</span>
                                <span className="control-value">{Number(uiParams.randomness).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.05"
                                max="1.5"
                                step="0.02"
                                value={uiParams.randomness}
                                onChange={(e) => handleRebuildParamChange('randomness', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Core Concentration Power</span>
                                <span className="control-value">{Number(uiParams.randomnessPower).toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1.2"
                                max="6.5"
                                step="0.1"
                                value={uiParams.randomnessPower}
                                onChange={(e) => handleRebuildParamChange('randomnessPower', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Core Bulge Size</span>
                                <span className="control-value">{Number(uiParams.coreConcentration).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.08"
                                max="0.75"
                                step="0.02"
                                value={uiParams.coreConcentration}
                                onChange={(e) => handleRebuildParamChange('coreConcentration', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Disk Thickness</span>
                                <span className="control-value">{Number(uiParams.thickness).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.06"
                                max="1.00"
                                step="0.02"
                                value={uiParams.thickness}
                                onChange={(e) => handleRebuildParamChange('thickness', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Nebula H-II Density</span>
                                <span className="control-value">{Number(uiParams.nebula).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="0.75"
                                step="0.02"
                                value={uiParams.nebula}
                                onChange={(e) => handleRebuildParamChange('nebula', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>
                    </div>

                    <div className="divider-h"></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div className="section-label">
                            <svg viewBox="0 0 24 24">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            Orbital Kinematics & Optics
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Star Size</span>
                                <span className="control-value">{uiParams.starSize}</span>
                            </div>
                            <input
                                type="range"
                                min="12"
                                max="75"
                                step="1"
                                value={uiParams.starSize}
                                onChange={(e) => handleUniformParamChange('starSize', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Rotation Speed</span>
                                <span className="control-value">{Number(uiParams.rotationSpeed).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.02"
                                value={uiParams.rotationSpeed}
                                onChange={(e) => handleUniformParamChange('rotationSpeed', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-header">
                                <span className="control-title">Keplerian Shear</span>
                                <span className="control-value">{Number(uiParams.differential).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.0"
                                max="1.0"
                                step="0.05"
                                value={uiParams.differential}
                                onChange={(e) => handleUniformParamChange('differential', parseFloat(e.target.value))}
                                className="astro-slider"
                            />
                        </div>
                    </div>
                </div>

                <div className="panel-footer">
                    <span>Control Panel</span>
                    <span className="font-mono-tech" style={{ color: '#818cf8' }}>Dinh Luong Ta</span>
                </div>
            </aside>

            <div className={`toast-banner ${toast.visible ? 'show' : ''}`}>
                <svg viewBox="0 0 24 24">
                    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.5l1.9-5.8 5.8-1.9-5.8-1.9z"></path>
                </svg>
                <span>{toast.message}</span>
            </div>
        </div>
    );
}