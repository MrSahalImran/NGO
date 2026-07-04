import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaEnvelope, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={5} lg={4} className="mb-4">
            <h5 className="d-flex align-items-center">
              Vridh Ashram
              <span className="diya ms-2" aria-hidden="true" />
            </h5>
            <p className="mb-3">
              A home for the aged &amp; infirm in Ambphalla, Jammu — where
              elders live with dignity, care, and company. A lamp kept lit
              against loneliness.
            </p>
            <div className="social-links">
              <a href="/" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
            </div>
          </Col>

          <Col md={3} lg={4} className="mb-4">
            <h5>Explore</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about">About us</a>
              </li>
              <li>
                <a href="/gallery">Gallery</a>
              </li>
              <li>
                <a href="/donation">Donate</a>
              </li>
              <li>
                <a href="/registration">Admissions</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </Col>

          <Col md={4} lg={4} className="mb-4">
            <h5>Visit us</h5>
            <div className="contact-info">
              <p className="mb-2 d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 mt-1" />
                <span>Ambphalla, Jammu, J&amp;K</span>
              </p>
              <p className="mb-2 d-flex align-items-start">
                <FaRegClock className="me-2 mt-1" />
                <span>Mon–Sat, 10:00–17:00</span>
              </p>
              <p className="mb-2 d-flex align-items-start">
                <FaEnvelope className="me-2 mt-1" />
                <a href="mailto:info@vridhashram.org">info@vridhashram.org</a>
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 footer__legal">
              &copy; {new Date().getFullYear()} Vridh Ashram, Jammu. Made with
              care for those who cared for us.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
