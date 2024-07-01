import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className="footer  text-center p-3">
      <div className="social-icons mb-3">
        <a className="m-1 social" href="https://www.facebook.com/">
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </a>
        <a className="m-1 social" href="https://www.instagram.com/">
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a className="m-1 social" href="https://twitter.com/">
          <FontAwesomeIcon icon={faXTwitter} size="2x" />
        </a>
      </div>
      <p className="mb-0">Seguici sui social:</p>
      <p className="mb-0">Contatti: info@example.com</p>
      <p className="mb-0">Telefono: +1234567890</p>
      <hr />
      <p className="mb-0">© 2024 TrailBlazer. Tutti i diritti riservati.</p>
    </div>
  );
}

export default Footer;
