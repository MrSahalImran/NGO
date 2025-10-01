import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    interests: [],
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    "Education",
    "Healthcare",
    "Environment",
    "Poverty Alleviation",
    "Community Development",
    "Children Welfare",
    "Women Empowerment",
    "Elder Care",
    "Disaster Relief",
    "Fundraising",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleInterestChange = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];

    setFormData({
      ...formData,
      interests: updatedInterests,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/registrations", formData);

      toast.success(
        "Registration submitted successfully! We will review your application and get back to you soon."
      );
      setSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        occupation: "",
        interests: [],
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <Alert variant="success" className="text-center p-5">
              <h3>Thank You for Your Interest!</h3>
              <p className="lead">
                Your volunteer registration has been submitted successfully. Our
                team will review your application and contact you within 2-3
                business days.
              </p>
              <Button variant="primary" onClick={() => setSubmitted(false)}>
                Submit Another Registration
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div>
      {/* Registration Header */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1>Volunteer Registration</h1>
              <p className="lead">
                Join our mission to create positive change in communities. Fill
                out the form below to become a volunteer.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Registration Form */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="card-hover">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">
                        Personal Information
                      </h4>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Enter your full name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
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

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="+1-XXX-XXX-XXXX"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date of Birth *</Form.Label>
                            <Form.Control
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Gender *</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control
                              type="text"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleChange}
                              placeholder="Your current occupation"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Address *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full address"
                        />
                      </Form.Group>
                    </div>

                    {/* Volunteer Interests */}
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">Areas of Interest</h4>
                      <p className="text-muted mb-3">
                        Select the areas you would like to volunteer in (select
                        multiple):
                      </p>

                      <Row>
                        {interestOptions.map((interest) => (
                          <Col md={6} lg={4} key={interest} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={interest}
                              label={interest}
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestChange(interest)}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">Emergency Contact</h4>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="emergencyContact.name"
                              value={formData.emergencyContact.name}
                              onChange={handleChange}
                              required
                              placeholder="Emergency contact full name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Phone *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="emergencyContact.phone"
                              value={formData.emergencyContact.phone}
                              onChange={handleChange}
                              required
                              placeholder="+1-XXX-XXX-XXXX"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Relationship *</Form.Label>
                        <Form.Control
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Parent, Spouse, Sibling, Friend"
                        />
                      </Form.Group>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="px-5"
                      >
                        {loading ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <small className="text-muted">
                        By submitting this form, you agree to our terms and
                        conditions and privacy policy.
                      </small>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What to Expect */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-4">
                <h3>What to Expect Next</h3>
              </div>

              <Row>
                <Col md={4} className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <strong>1</strong>
                  </div>
                  <h5 className="mt-3">Application Review</h5>
                  <p>We'll review your application within 2-3 business days.</p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <strong>2</strong>
                  </div>
                  <h5 className="mt-3">Orientation</h5>
                  <p>
                    Attend a brief orientation session to learn about our
                    programs.
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <strong>3</strong>
                  </div>
                  <h5 className="mt-3">Start Volunteering</h5>
                  <p>
                    Begin making a difference in your chosen area of interest.
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Registration;
