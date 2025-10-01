import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import type { NGOInfo } from "../types";

const About: React.FC = () => {
  const [ngoInfo, setNgoInfo] = useState<NGOInfo | null>(null);

  useEffect(() => {
    fetchNgoInfo();
  }, []);

  const fetchNgoInfo = async (): Promise<void> => {
    try {
      const res = await axios.get<NGOInfo>("/api/ngo/info");
      setNgoInfo(res.data);
    } catch (error: any) {
      console.error("Error fetching NGO info:", error);
    }
  };

  if (!ngoInfo) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div>
      {/* About Header */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1>About {ngoInfo.name}</h1>
              <p className="lead">{ngoInfo.description}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="card-hover h-100">
                <Card.Body className="p-4">
                  <Card.Title className="h3 text-primary mb-3">
                    Our Mission
                  </Card.Title>
                  <Card.Text className="lead">{ngoInfo.mission}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="card-hover h-100">
                <Card.Body className="p-4">
                  <Card.Title className="h3 text-primary mb-3">
                    Our Vision
                  </Card.Title>
                  <Card.Text className="lead">{ngoInfo.vision}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* History & Impact */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-5">
                <h2>Our Journey</h2>
                <p className="lead">
                  Founded in {ngoInfo.founded}, we have been making a difference
                  for over {ngoInfo.impact.yearsActive} years.
                </p>
              </div>

              <Row className="text-center">
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">
                      {ngoInfo.impact.beneficiaries.toLocaleString()}
                    </div>
                    <div className="stat-label">Lives Impacted</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">{ngoInfo.impact.projects}</div>
                    <div className="stat-label">Projects Completed</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">
                      {ngoInfo.impact.volunteers}
                    </div>
                    <div className="stat-label">Active Volunteers</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">
                      {ngoInfo.impact.yearsActive}
                    </div>
                    <div className="stat-label">Years of Service</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-5">
                <h2>Get in Touch</h2>
                <p className="lead">
                  We'd love to hear from you and answer any questions you might
                  have.
                </p>
              </div>

              <Card>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6} className="mb-3">
                      <h5>Address</h5>
                      <p>{ngoInfo.contact.address}</p>
                    </Col>
                    <Col md={3} className="mb-3">
                      <h5>Phone</h5>
                      <p>{ngoInfo.contact.phone}</p>
                    </Col>
                    <Col md={3} className="mb-3">
                      <h5>Email</h5>
                      <p>{ngoInfo.contact.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h5>Follow Us</h5>
                      <div className="social-links">
                        <a href={ngoInfo.socialMedia.facebook} className="me-3">
                          Facebook
                        </a>
                        <a href={ngoInfo.socialMedia.twitter} className="me-3">
                          Twitter
                        </a>
                        <a
                          href={ngoInfo.socialMedia.instagram}
                          className="me-3"
                        >
                          Instagram
                        </a>
                        <a href={ngoInfo.socialMedia.linkedin}>LinkedIn</a>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
