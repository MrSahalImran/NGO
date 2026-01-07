import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaHandHoldingHeart,
  FaUsers,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";
import type { NGOInfo, Testimonial, NewsArticle } from "../types";
import ControlledTestimonialsCarousel from "../components/ControlledTestimonialsCarousel";
import PhotoGallery from "../components/PhotoGallery";

const Home: React.FC = () => {
  const NGO_INFO: NGOInfo = {
    name: "Vridh Ashram",
    mission:
      "Our mission goes beyond providing basic necessities—it is about restoring self-worth, spreading kindness, and upholding the belief that every elder deserves to live with respect and compassion. Guided by the spirit of humanity, we strive to serve each resident with unconditional love, ensuring that they feel valued, cherished, and never alone.",
    vision:
      "A world where every individual has access to basic necessities and opportunities for growth.",
    founded: "2010",
    description:
      "Vridh Ashram is a non-profit organization dedicated to creating positive change in underserved communities.",
    programs: [
      {
        id: 1,
        title: "Education for All",
        description:
          "Providing quality education and resources to children in rural areas.",
        image: "/images/education.jpg",
      },
      {
        id: 2,
        title: "Healthcare Access",
        description:
          "Mobile health clinics and medical camps in remote locations.",
        image: "/images/healthcare.jpg",
      },
      {
        id: 3,
        title: "Environmental Conservation",
        description:
          "Tree plantation drives and environmental awareness programs.",
        image: "/images/environment.jpg",
      },
      {
        id: 4,
        title: "Poverty Alleviation",
        description:
          "Skill development and microfinance programs for economic empowerment.",
        image: "/images/poverty.jpg",
      },
    ],
    impact: {
      beneficiaries: 10000,
      projects: 150,
      volunteers: 500,
      yearsActive: 13,
    },
    contact: {
      address: "Amphalla",
      phone: "+914564653151",
      email: "info@vridhashram.org",
      website: "www.virdhashram.org",
    },
    socialMedia: {
      facebook: "/",
      twitter: "/",
      instagram: "/",
      linkedin: "/",
    },
  };

  const TESTIMONIALS: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Volunteer",
      message:
        "Working with Hope Foundation has been incredibly rewarding. The impact we make together is truly inspiring.",
      image: "/images/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Beneficiary Parent",
      message:
        "Thanks to Hope Foundation, my daughter now has access to quality education. Our family's future looks brighter.",
      image: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Medical Volunteer",
      message:
        "The healthcare programs reach people who need it most. It's amazing to see the difference we can make.",
      image: "/images/testimonial3.jpg",
    },
  ];

  const NEWS: NewsArticle[] = [
    {
      id: 1,
      title: "New School Opens in Rural Community",
      summary:
        "Hope Foundation inaugurates its 50th school in a remote village, bringing education closer to 200 children.",
      date: "2024-01-15",
      image: "/images/news1.jpg",
    },
    {
      id: 2,
      title: "Medical Camp Serves 500 Patients",
      summary:
        "Free medical camp conducted in partnership with local hospitals provides healthcare to underserved population.",
      date: "2024-01-10",
      image: "/images/news2.jpg",
    },
    {
      id: 3,
      title: "Environmental Awareness Drive",
      summary:
        "Community tree plantation program plants 1000 trees and educates locals about environmental conservation.",
      date: "2024-01-05",
      image: "/images/news3.jpg",
    },
  ];

  const [ngoInfo] = useState<NGOInfo>(NGO_INFO);
  const [testimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [news] = useState<NewsArticle[]>(NEWS);

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
              <h2>Our Home & Facilities</h2>
              <p className="lead">
                A glimpse into the warm, caring environment where our residents
                live and thrive.
              </p>
            </Col>
          </Row>
          <Row>
            {/* Photo gallery for building, rooms, and common areas */}
            <Col>
              <PhotoGallery
                images={[
                  {
                    src: "/images/home-page/building1.jpg",
                    caption: "Exterior - Main Building",
                  },
                  {
                    src: "/images/reception.jpg",
                    caption: "Reception & Welcome Area",
                  },
                  {
                    src: "/images/room1.jpg",
                    caption: "Resident Room (Sample)",
                  },
                  { src: "/images/dining.jpg", caption: "Dining Hall" },
                  { src: "/images/garden.jpg", caption: "Garden & Courtyard" },
                  { src: "/images/activity.jpg", caption: "Activity Room" },
                ]}
              />

              <Card className="mt-4">
                <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div>
                    <Card.Title>Visit Vridh Ashram</Card.Title>
                    <Card.Text className="mb-0">
                      Visiting hours: Mon–Sat 10:00–17:00
                    </Card.Text>
                    <Card.Text className="mb-0">
                      Address: {ngoInfo.contact.address}
                    </Card.Text>
                    <Card.Text className="mb-0">
                      Phone:{" "}
                      <a href={`tel:${ngoInfo.contact.phone}`}>
                        {ngoInfo.contact.phone}
                      </a>
                    </Card.Text>
                  </div>
                  <div className="mt-3 mt-md-0">
                    <LinkContainer to="/registration">
                      <Button variant="secondary" className="me-2">
                        Volunteer
                      </Button>
                    </LinkContainer>
                    <a href={`mailto:${ngoInfo.contact.email}`}>
                      <Button variant="primary">Contact Us</Button>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
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
                {/* Controlled carousel to ensure reliable cycling across environments */}
                {testimonials.length > 0 && (
                  <ControlledTestimonialsCarousel testimonials={testimonials} />
                )}
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
