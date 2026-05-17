import React from 'react';

export const Contact = () => {
    return (
        <section className="contact contact-page">
            <div className="pdf-container">
                <iframe
                    className="pdf"
                    src="/dluongta_resume.pdf"
                    title="resume"
                />
            </div>

            <div className="spacer" style={{ height: '120px' }} />
        </section>
    );
};