import React from 'react';
import { Link } from 'react-router-dom';

export const Contact = () => {
    return (
        <>
            <section className="contact">
                {/* <div id="mySidenav" className="sidenav">
                    <Link to='/pages' id="pages"> Pages </Link>
                    <Link to='/blog' id="blog"> Blog </Link>
                    <Link to='/portfolio' id="portfolio"> Portfolio </Link>
                    <Link to='/contact' id="contact"> Contact </Link>
                    <Link to='/galaxy' id="galaxy"> Galaxy </Link>
                </div> */}
                <div className="pdf-container">
                    <iframe className="pdf" src="/dluongta_resume.pdf" width="100%" height="100%"></iframe>
                </div>
            </section>
        </>
    );
}
