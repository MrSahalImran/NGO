import { useState } from "react";
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
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: {
      name: "",
      email: "",
      phone: "",
      relationship: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  // interests removed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/registrations", formData);

      toast.success(
        "Resident admission submitted successfully. Admissions will review and contact you soon."
      );
      setSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        emergencyContact: {
          name: "",
          email: "",
          phone: "",
          relationship: "",
        },
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
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
              <h3>Resident Admission Submitted</h3>
              <p className="lead">
                The resident admission has been submitted successfully. Our
                admissions team will review the details and contact you within
                2-3 business days.
              </p>
              <Button variant="primary" onClick={() => setSubmitted(false)}>
                Submit Another Admission
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
              <h1>Resident Admission</h1>
              <p className="lead">
                Register a resident for admission, intake, and care at the
                facility. Fill out the form below with accurate resident
                details.
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
                            <Form.Label>Resident Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Enter resident full name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Resident Phone Number *</Form.Label>
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
                      </Row>

                      <Row>
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
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Resident Gender *</Form.Label>
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
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Resident Address *</Form.Label>
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

                    {/* Volunteer Interests removed */}

                    {/* Emergency Contact */}
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">
                        Registrant / Emergency Contact
                      </h4>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Registrant Name (person admitting resident) *
                            </Form.Label>
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
                            <Form.Label>Registrant Phone *</Form.Label>
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
                        <Form.Label>Registrant Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="emergencyContact.email"
                          value={formData.emergencyContact.email}
                          onChange={handleChange}
                          required
                          placeholder="contact.email@example.com"
                        />
                      </Form.Group>

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
                        {loading
                          ? "Submitting..."
                          : "Submit Resident Admission"}
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
                  <h5 className="mt-3">Intake Review</h5>
                  <p>
                    Our admissions team will verify submitted details and
                    records.
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <strong>2</strong>
                  </div>
                  <h5 className="mt-3">Medical Assessment</h5>
                  <p>
                    The resident will undergo a basic medical and welfare
                    assessment.
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <strong>3</strong>
                  </div>
                  <h5 className="mt-3">Placement & Care Plan</h5>
                  <p>
                    We will assign a placement and care plan tailored to the
                    resident's needs.
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
