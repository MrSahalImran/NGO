import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

interface NGOInfo {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const Contact = () => {
  const [ngoInfo, setNgoInfo] = useState<NGOInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNgoInfo();
  }, []);

  const fetchNgoInfo = async () => {
    try {
      const res = await axios.get("/api/ngo/info");
      setNgoInfo(res.data);
    } catch (error) {
      console.error("Error fetching NGO info:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would send this to your backend
      // For demo purposes, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success(
        "Thank you for your message! We will get back to you soon."
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!ngoInfo) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div>
      {/* Contact Header */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1>Contact Us</h1>
              <p className="lead">
                Get in touch with us. We'd love to hear from you and answer any
                questions you might have.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information & Form */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Contact Information */}
            <Col lg={4} className="mb-5">
              <Card className="card-hover h-100">
                <Card.Body className="p-4">
                  <Card.Title className="h4 text-primary mb-4">
                    Get in Touch
                  </Card.Title>

                  <div className="contact-item mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-primary me-3" size={20} />
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <p className="ms-4">{ngoInfo.contact.address}</p>
                  </div>

                  <div className="contact-item mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaPhone className="text-primary me-3" size={20} />
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <p className="ms-4">{ngoInfo.contact.phone}</p>
                  </div>

                  <div className="contact-item mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="text-primary me-3" size={20} />
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <p className="ms-4">{ngoInfo.contact.email}</p>
                  </div>

                  <div className="contact-item">
                    <h6 className="mb-3">Follow Us</h6>
                    <div className="social-links">
                      <a
                        href={ngoInfo.socialMedia.facebook}
                        className="text-primary me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook size={24} />
                      </a>
                      <a
                        href={ngoInfo.socialMedia.twitter}
                        className="text-primary me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTwitter size={24} />
                      </a>
                      <a
                        href={ngoInfo.socialMedia.instagram}
                        className="text-primary me-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaInstagram size={24} />
                      </a>
                      <a
                        href={ngoInfo.socialMedia.linkedin}
                        className="text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin size={24} />
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Form */}
            <Col lg={8}>
              <Card className="card-hover">
                <Card.Body className="p-4">
                  <Card.Title className="h4 text-primary mb-4">
                    Send us a Message
                  </Card.Title>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Subject *</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this about?"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Message *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Office Hours */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <Card>
                <Card.Body className="p-4 text-center">
                  <Card.Title className="h4 text-primary mb-3">
                    Office Hours
                  </Card.Title>
                  <Row>
                    <Col md={4} className="mb-3">
                      <h6>Monday - Friday</h6>
                      <p className="mb-0">9:00 AM - 6:00 PM</p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <h6>Saturday</h6>
                      <p className="mb-0">10:00 AM - 4:00 PM</p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <h6>Sunday</h6>
                      <p className="mb-0">Closed</p>
                    </Col>
                  </Row>
                  <hr className="my-3" />
                  <p className="text-muted mb-0">
                    For urgent matters outside office hours, please send us an
                    email and we'll get back to you as soon as possible.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
