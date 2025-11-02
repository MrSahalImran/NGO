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

  const members = [
    {
      name: "Sh. I.D. Soni",
      role: "President",
      description:
        "Former Deputy Director, Education Department, Former State Commissioner, J&K Bharat Scouts and Guides",
      image: "/images/director.png",
      mobile: "6005421997",
    },
    {
      name: "Dr. Dinesh Gupta",
      role: "Secretary",
      description:
        "Former Secretary Indian Red Cross Society, Jammu, Founder Director Childline, Former AGM, RBI",
      image: "/images/secretary.png",
      mobile: "9419112918",
    },
    {
      name: "Sh. H.S. Manhas",
      role: "Vice President",
      description: "Social Activist",
      image: "/images/members/hs-manhas.png",
      mobile: "9419130343",
    },
    {
      name: "Er. Vijay Kumar Gupta",
      role: "Joint Secretary",
      description: "Engineer (Retd.) ",
      image: "/images/members/vijay-gupta.png",
      mobile: "9419278698",
    },
    {
      name: "Er. B.B. Gupta",
      role: "Member",
      description: "Asstt. Executive Engineer (Retd.)",
      image: "/images/members/bb-gupta.png",
      mobile: "9796208431",
    },
    {
      name: "Smt. Nirmala Zutshi",
      role: "Member",
      description: "Social Activist",
      image: "/images/members/nirmala-zutshi.png",
      mobile: "9419109614",
    },
    {
      name: "Sh. R.C. Vaid",
      role: "Member",
      description: "Zonal Physical Education Officer (Retd.)",
      image: "/images/members/rc-vaid.png",
      mobile: "9419193420",
    },
    {
      name: "Er. Pankaj Gupta",
      role: "Member",
      description: "Executive Engineer (Retd.)",
      image: "/images/members/pankaj-gupta.png",
      mobile: "9419118259",
    },
  ] as {
    name: string;
    role: string;
    description: string;
    image?: string;
    mobile?: string;
  }[];

  const director = {
    name: "I.D Soni",
    title: "Director",
    image: "/images/director.png",
    message:
      "Old age always happens at the point of no return and in every respect poses a serious challenge to every human being. Elderly person’s heart is burdened. He/she lives in fear of future, of unpredictive mishap, of bankruptcy, of ill-health, of lack of emotional touch and, greatest of all - lonliness. O, for someone, who will direct him/her to a realm of true, abiding joy! Such is the cry of his/her tormentd heart.Old age is an age of maturity and wisdom, of knowledge and experience, of reasoning and analysis, of faith and freedom, of service and sacrifice, of integrity and grace, of love and compassion and above all of God’s precious gift and boon",
  };

  const secretary = {
    name: "Dr. Dinesh Gupta",
    title: "Secretary",
    image: "/images/secretary.png",
    message:
      "Each individual creature on this beautiful planet is created by God to fulfil a particular role. One rarely comes across divinely enlightened, compassionately humanitarian, exceptionally effulgence, diffidently down-to-earth, big-heartedly burden bearer, deeply influenced by the righteous deeds of divine souls, and Godly blessed individuals who precisely perceive and present an example of open-handed and magnanimous approach for the uncared for, impoverished, needy and miserable people. They are generally capable of envisioning the past, the present and the future in continuity. Their selfless, ethical, saintly, virtuous and pious actions and noble deeds survive the boundaries of time and space. Shri Ram Nath Prabhakar Ji, the Founder of “Home For The Aged & Infirm”, Ambphalla, Jammu was one such gift of God to humanity, particularly, for the uncared for, poorest of the poor, destitute and neglected people of Jammu and Kashmir State.",
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const createAvatarDataUrl = (name: string, bg = "#0d6efd") => {
    const initials = getInitials(name);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dy='0.35em' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='96' fill='white'>${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

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
      {/* Leadership Messages (frontend only) */}
      <section className="py-5 bg-white">
        <Container>
          <Row>
            <Col className="text-center mb-4">
              <h2>Messages from Leadership</h2>
              <p className="lead">
                Short notes from our Director and Secretary
              </p>
            </Col>
          </Row>
          <Row>
            {[director, secretary].map((person) => (
              <Col md={6} key={person.name} className="mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex">
                    <div style={{ minWidth: 140, marginRight: 20 }}>
                      <img
                        src={person.image}
                        alt={person.name}
                        style={{
                          width: 140,
                          height: 170,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = createAvatarDataUrl(person.name);
                        }}
                      />
                    </div>
                    <div>
                      <Card.Title className="h5">{person.name}</Card.Title>
                      <Card.Subtitle className="text-muted mb-3">
                        {person.title}
                      </Card.Subtitle>
                      <Card.Text>{person.message}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col className="text-center mb-4">
              <h2>Present Working Committee</h2>
              <p className="lead">
                Our current managing committee members and their roles
              </p>
            </Col>
          </Row>
          <Row>
            {members.map((m) => (
              <Col md={3} sm={6} key={m.name} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <div className="mb-2">
                      <img
                        src={m.image || createAvatarDataUrl(m.name)}
                        alt={m.name}
                        style={{
                          width: 96,
                          height: 96,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = createAvatarDataUrl(m.name);
                        }}
                      />
                    </div>
                    <Card.Title className="h6">{m.name}</Card.Title>
                    <Card.Subtitle className="text-muted mb-2">
                      {m.role}
                    </Card.Subtitle>
                    {m.description && (
                      <Card.Text className="small text-muted">
                        {m.description}
                      </Card.Text>
                    )}
                    {m.mobile && (
                      <div className="mt-2">
                        <p className="small">{m.mobile}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
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
