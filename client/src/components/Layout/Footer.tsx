import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>Vridh Ashram</h5>
            <p className="mb-3">
              Empowering communities through education, healthcare, and
              sustainable development initiatives.
            </p>
            <div className="social-links">
              <a href="/" className="text-white me-3" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="/" className="text-white me-3" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="/" className="text-white" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-white-50">
                  About Us
                </a>
              </li>
              <li>
                <a href="/programs" className="text-white-50">
                  Our Programs
                </a>
              </li>
              <li>
                <a href="/donation" className="text-white-50">
                  Donate
                </a>
              </li>
              <li>
                <a href="/registration" className="text-white-50">
                  Volunteer
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white-50">
                  Contact
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Contact Info</h5>
            <div className="contact-info">
              <p className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Amphalla
              </p>
              <p className="mb-2">
                <FaPhone className="me-2" />
                +91676454 5754 54
              </p>
              <p className="mb-2">
                <FaEnvelope className="me-2" />
                info@vridhashram.org
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Virdh Ashram. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
