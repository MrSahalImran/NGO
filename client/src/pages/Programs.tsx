import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get("/api/ngo/info");
      setPrograms(res.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  return (
    <div>
      {/* Programs Header */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1>Our Programs</h1>
              <p className="lead">
                Creating positive change through focused initiatives and
                community engagement
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Programs Grid */}
      <section className="py-5">
        <Container>
          <Row>
            {programs.map((program, index) => (
              <Col md={6} lg={6} key={program.id} className="mb-5">
                <Card className="card-hover h-100">
                  <Row className="g-0">
                    <Col md={5}>
                      <Card.Img
                        src={program.image}
                        alt={program.title}
                        className="h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={7}>
                      <Card.Body className="p-4">
                        <Card.Title className="h4 text-primary mb-3">
                          {program.title}
                        </Card.Title>
                        <Card.Text className="mb-4">
                          {program.description}
                        </Card.Text>

                        {/* Program details based on type */}
                        {program.id === 1 && (
                          <div>
                            <h6>Key Focus Areas:</h6>
                            <ul>
                              <li>Primary and secondary education</li>
                              <li>Adult literacy programs</li>
                              <li>Vocational training</li>
                              <li>Scholarship programs</li>
                            </ul>
                          </div>
                        )}

                        {program.id === 2 && (
                          <div>
                            <h6>Services Provided:</h6>
                            <ul>
                              <li>Mobile medical units</li>
                              <li>Free health checkups</li>
                              <li>Vaccination drives</li>
                              <li>Health awareness programs</li>
                            </ul>
                          </div>
                        )}

                        {program.id === 3 && (
                          <div>
                            <h6>Initiatives:</h6>
                            <ul>
                              <li>Tree plantation drives</li>
                              <li>Waste management programs</li>
                              <li>Water conservation projects</li>
                              <li>Environmental education</li>
                            </ul>
                          </div>
                        )}

                        {program.id === 4 && (
                          <div>
                            <h6>Support Programs:</h6>
                            <ul>
                              <li>Microfinance services</li>
                              <li>Skill development training</li>
                              <li>Women empowerment initiatives</li>
                              <li>Small business support</li>
                            </ul>
                          </div>
                        )}
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Program Impact */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Our Impact</h2>
              <p className="lead mb-5">
                Through these programs, we have been able to create meaningful
                change in communities across the region.
              </p>

              <Row>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Schools Supported</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">25,000+</div>
                    <div className="stat-label">Medical Consultations</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">100,000+</div>
                    <div className="stat-label">Trees Planted</div>
                  </div>
                </Col>
                <Col md={3} className="mb-4">
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Families Empowered</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Get Involved */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Get Involved</h2>
              <p className="lead mb-4">
                Join us in making a difference. Whether through volunteering,
                donations, or spreading awareness, every contribution helps us
                expand our impact.
              </p>
              <div>
                <a href="/registration" className="btn btn-primary btn-lg me-3">
                  Volunteer With Us
                </a>
                <a href="/donation" className="btn btn-secondary btn-lg">
                  Support Our Work
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Programs;
