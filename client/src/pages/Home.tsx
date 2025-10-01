import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHandHoldingHeart,
  FaUsers,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";
import axios from "axios";
import type { NGOInfo, Testimonial, NewsArticle } from "../types";

const Home: React.FC = () => {
  const [ngoInfo, setNgoInfo] = useState<NGOInfo | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchNgoInfo();
    fetchTestimonials();
    fetchNews();
  }, []);

  const fetchNgoInfo = async (): Promise<void> => {
    try {
      const res = await axios.get<NGOInfo>("/api/ngo/info");
      setNgoInfo(res.data);
    } catch (error: any) {
      console.error("Error fetching NGO info:", error);
    }
  };

  const fetchTestimonials = async (): Promise<void> => {
    try {
      const res = await axios.get<Testimonial[]>("/api/ngo/testimonials");
      setTestimonials(res.data);
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const fetchNews = async (): Promise<void> => {
    try {
      const res = await axios.get<NewsArticle[]>("/api/ngo/news");
      setNews(res.data);
    } catch (error: any) {
      console.error("Error fetching news:", error);
    }
  };

  if (!ngoInfo) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1 className="fade-in-up">{ngoInfo.name}</h1>
              <p className="lead fade-in-up">{ngoInfo.mission}</p>
              <div className="fade-in-up">
                <LinkContainer to="/donation">
                  <Button variant="secondary" size="lg" className="me-3">
                    Donate Now
                  </Button>
                </LinkContainer>
                <LinkContainer to="/registration">
                  <Button variant="outline-light" size="lg">
                    Join as Volunteer
                  </Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row>
            <Col md={3} className="stat-item">
              <FaUsers className="stat-number text-primary mb-3" />
              <div className="stat-number">
                {ngoInfo.impact.beneficiaries.toLocaleString()}
              </div>
              <div className="stat-label">People Helped</div>
            </Col>
            <Col md={3} className="stat-item">
              <FaGraduationCap className="stat-number text-primary mb-3" />
              <div className="stat-number">{ngoInfo.impact.projects}</div>
              <div className="stat-label">Projects Completed</div>
            </Col>
            <Col md={3} className="stat-item">
              <FaHandHoldingHeart className="stat-number text-primary mb-3" />
              <div className="stat-number">{ngoInfo.impact.volunteers}</div>
              <div className="stat-label">Active Volunteers</div>
            </Col>
            <Col md={3} className="stat-item">
              <FaHeart className="stat-number text-primary mb-3" />
              <div className="stat-number">{ngoInfo.impact.yearsActive}</div>
              <div className="stat-label">Years of Service</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Programs Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2>Our Programs</h2>
              <p className="lead">
                Making a difference through focused initiatives
              </p>
            </Col>
          </Row>
          <Row>
            {ngoInfo.programs.slice(0, 4).map((program) => (
              <Col md={6} lg={3} key={program.id} className="mb-4">
                <Card className="card-hover h-100">
                  <Card.Img
                    variant="top"
                    src={program.image}
                    alt={program.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{program.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {program.description}
                    </Card.Text>
                    <LinkContainer to="/programs">
                      <Button variant="primary" size="sm">
                        Learn More
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row>
              <Col className="text-center mb-5">
                <h2>What People Say</h2>
                <p className="lead">Stories from our community</p>
              </Col>
            </Row>
            <Row>
              <Col lg={8} className="mx-auto">
                <Carousel>
                  {testimonials.map((testimonial) => (
                    <Carousel.Item key={testimonial.id}>
                      <Card className="border-0 text-center">
                        <Card.Body className="p-5">
                          <Card.Text className="h5 mb-4">
                            "{testimonial.message}"
                          </Card.Text>
                          <Card.Title className="h6">
                            {testimonial.name}
                          </Card.Title>
                          <Card.Subtitle className="text-muted">
                            {testimonial.role}
                          </Card.Subtitle>
                        </Card.Body>
                      </Card>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Latest News Section */}
      {news.length > 0 && (
        <section className="py-5">
          <Container>
            <Row>
              <Col className="text-center mb-5">
                <h2>Latest News</h2>
                <p className="lead">Stay updated with our recent activities</p>
              </Col>
            </Row>
            <Row>
              {news.slice(0, 3).map((article) => (
                <Col md={4} key={article.id} className="mb-4">
                  <Card className="card-hover h-100">
                    <Card.Img
                      variant="top"
                      src={article.image}
                      alt={article.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {article.summary}
                      </Card.Text>
                      <small className="text-muted">
                        {new Date(article.date).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Join Our Mission</h2>
              <p className="lead mb-4">
                Together, we can create lasting change in communities around the
                world.
              </p>
              <LinkContainer to="/registration">
                <Button variant="light" size="lg" className="me-3">
                  Volunteer Now
                </Button>
              </LinkContainer>
              <LinkContainer to="/donation">
                <Button variant="outline-light" size="lg">
                  Make a Donation
                </Button>
              </LinkContainer>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
