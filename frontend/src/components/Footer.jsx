import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <div className="footer  text-center p-3">
            <div className="social-icons mb-3">
            <p className="">Seguici sui social:</p>
                <a className='m-1' href="https://www.facebook.com/">
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a className='m-1' href="https://www.instagram.com/">
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
                <a className='m-1' href="https://twitter.com/">
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
            </div>
            <hr />
            <p className="mb-0">Contatti: info@example.com</p>
            <p className="mb-0">Telefono: +1234567890</p>
            <hr />
            <p className="mb-0">© 2024 Nome del tuo sito. Tutti i diritti riservati.</p>
        </div>
    );
}

export default Footer;
