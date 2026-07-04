import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaUtensils,
  FaHeartbeat,
  FaHandsHelping,
  FaRegClock,
} from "react-icons/fa";

// A lightweight scroll reveal — respects prefers-reduced-motion via CSS.
const useReveal = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const CARE = [
  { icon: FaUtensils, label: "Three warm meals", note: "cooked fresh, served together, every day" },
  { icon: FaHeartbeat, label: "Medical care", note: "regular check-ups, medicines, and attention" },
  { icon: FaRegClock, label: "Round-the-clock", note: "someone awake and near, day and night" },
  { icon: FaHandsHelping, label: "Companionship", note: "conversation, festivals, and dignity" },
];

const Home: React.FC = () => {
  useReveal();

  return (
    <div>
      {/* ============================================================ HERO */}
      <section className="hero-section hero-home">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-home__copy">
              <div className="eyebrow fade-in-up">
                <span className="diya" aria-hidden="true" />
                Home for the Aged &amp; Infirm · Ambphalla, Jammu
              </div>
              <h1 className="fade-in-up">
                Where the evening of life
                <br />
                stays <span className="hero-accent">warm.</span>
              </h1>
              <p className="lead fade-in-up">
                For elders with no one left to turn to, Vridh Ashram is shelter,
                care, and company — a lamp kept lit against loneliness.
              </p>
              <div className="hero-home__actions fade-in-up">
                <LinkContainer to="/donation">
                  <Button variant="secondary" size="lg" className="me-3">
                    Donate now
                  </Button>
                </LinkContainer>
                <LinkContainer to="/contact">
                  <Button variant="outline-light" size="lg">
                    Arrange a visit
                  </Button>
                </LinkContainer>
              </div>
            </Col>

            <Col lg={6} className="hero-home__media-col">
              <figure className="hero-home__media fade-in-up">
                <img
                  src="/images/home-page/building1.jpg"
                  alt="The Vridh Ashram home in Ambphalla, Jammu"
                  loading="eager"
                />
                <figcaption>
                  <span className="diya" aria-hidden="true" />
                  Our home in Ambphalla — open since 2010
                </figcaption>
              </figure>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ========================================================= PROMISE */}
      <section className="promise">
        <Container>
          <Row>
            <Col lg={9} className="mx-auto text-center reveal">
              <div className="eyebrow justify-content-center">Our promise</div>
              <p className="promise__text">
                Our work is not only to provide food and shelter. It is to
                restore self-worth, to spread kindness, and to hold one simple
                belief — that every elder deserves to live with{" "}
                <em>respect and compassion</em>, valued, cherished, and never
                alone.
              </p>
              <div className="diya-rule reveal" aria-hidden="true">
                <span className="diya" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============================================================ CARE */}
      <section className="stats-section care">
        <Container>
          <div className="section-head text-center mx-auto reveal">
            <div className="eyebrow justify-content-center">
              What every day holds
            </div>
            <h2>Care that treats age as grace, not burden</h2>
          </div>
          <Row className="mt-4 mt-md-5 g-4">
            {CARE.map(({ icon: Icon, label, note }, i) => (
              <Col md={6} lg={3} key={label} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="care-item">
                  <span className="care-item__icon">
                    <Icon />
                  </span>
                  <div className="care-item__label">{label}</div>
                  <p className="care-item__note">{note}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ========================================================== VOICE
          The emotional heart — the President's own words. */}
      <section className="voice">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={4} lg={4} className="text-center text-md-start reveal">
              <img
                src="/images/director.png"
                alt="Sh. I.D. Soni, President"
                className="voice__portrait"
              />
              <div className="voice__cite">
                <div className="voice__name">Sh. I.D. Soni</div>
                <div className="voice__role">President</div>
              </div>
            </Col>
            <Col md={8} lg={8} className="reveal">
              <span className="diya voice__mark" aria-hidden="true" />
              <blockquote className="voice__quote">
                Old age is an age of maturity and wisdom, of knowledge and
                experience, of faith and freedom, of service and sacrifice — of
                love and compassion, and above all, of God&rsquo;s precious
                gift.
              </blockquote>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===================================================== VISIT / HOME */}
      <section className="visit">
        <Container>
          <Row className="align-items-stretch g-4 g-lg-5">
            <Col lg={7} className="reveal">
              <figure className="visit__media">
                <img
                  src="/images/home-page/building1.jpg"
                  alt="Inside the grounds of Vridh Ashram"
                  loading="lazy"
                />
              </figure>
            </Col>
            <Col lg={5} className="reveal">
              <div className="visit__card">
                <div className="eyebrow">Come and see</div>
                <h3>You are welcome at our door</h3>
                <p>
                  The best way to know a home is to visit it. Meet the residents,
                  share a cup of tea, and see how each day unfolds.
                </p>
                <ul className="visit__facts">
                  <li>
                    <span className="visit__fact-k">Visiting hours</span>
                    <span className="visit__fact-v">Mon–Sat, 10:00–17:00</span>
                  </li>
                  <li>
                    <span className="visit__fact-k">Where</span>
                    <span className="visit__fact-v">Ambphalla, Jammu</span>
                  </li>
                </ul>
                <div className="visit__actions">
                  <LinkContainer to="/gallery">
                    <Button variant="primary">See the gallery</Button>
                  </LinkContainer>
                  <LinkContainer to="/contact">
                    <Button variant="outline-primary">Contact us</Button>
                  </LinkContainer>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ======================================================== WAYS / CTA */}
      <section className="py-5 bg-primary text-white ways">
        <Container>
          <Row>
            <Col lg={9} className="mx-auto text-center reveal">
              <div className="eyebrow eyebrow--on-dusk justify-content-center">
                Stand with our elders
              </div>
              <h2>No one should grow old alone</h2>
              <p className="lead mb-4 mx-auto" style={{ maxWidth: "40rem" }}>
                Every meal served and every hand held here is made possible by
                people who choose to care. Give what you can, or come lend your
                time.
              </p>
              <div className="ways__actions">
                <LinkContainer to="/donation">
                  <Button variant="light" size="lg" className="me-3">
                    Make a donation
                  </Button>
                </LinkContainer>
                <LinkContainer to="/registration">
                  <Button variant="outline-light" size="lg">
                    Admissions
                  </Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
