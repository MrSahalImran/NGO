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

const bankDetails = {
  accountName: "Virdh Ashram Foundation",
  accountNumber: "1234567890",
  ifsc: "SBIN0001234",
  bankName: "State Bank of India",
  branch: "Main Branch, City",
  upiId: "virdhashram@upi",
  qrCodeUrl: "/static/upi-qr.png", // Place your QR code image in public/static/upi-qr.png
};

const Donation: React.FC = () => {
  const [wantsCertificate, setWantsCertificate] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: "",
    transactionId: "",
    message: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    // You'll tell me what to do with this data next
    console.log("Donation form submitted:", formData);
    console.log("Payment proof file:", paymentProof);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        donorName: "",
        email: "",
        phone: "",
        amount: "",
        transactionId: "",
        message: "",
      });
      setPaymentProof(null);
    }, 3000);
  };

  return (
    <div>
      {/* Donation Header */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1>Make a Donation</h1>
              <p className="lead">
                Your contribution helps us continue our mission of creating
                positive change in communities. Please use the details below to
                donate via bank transfer or UPI.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Bank Details & UPI QR */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h4 className="mb-3">Bank Transfer Details</h4>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Account Name:</strong> {bankDetails.accountName}
                    </li>
                    <li>
                      <strong>Account Number:</strong>{" "}
                      {bankDetails.accountNumber}
                    </li>
                    <li>
                      <strong>IFSC Code:</strong> {bankDetails.ifsc}
                    </li>
                    <li>
                      <strong>Bank Name:</strong> {bankDetails.bankName}
                    </li>
                    <li>
                      <strong>Branch:</strong> {bankDetails.branch}
                    </li>
                  </ul>
                  <div className="mt-3">
                    <strong>UPI ID:</strong> {bankDetails.upiId}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col
              md={6}
              className="mb-4 d-flex align-items-center justify-content-center"
            >
              <div className="text-center w-100">
                <h4 className="mb-3">Scan UPI QR Code</h4>
                <img
                  src={bankDetails.qrCodeUrl}
                  alt="UPI QR Code"
                  style={{
                    maxWidth: 240,
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />
                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  Scan with any UPI app (Paytm, GPay, PhonePe, etc.)
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Donation Record Form */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={6} className="mx-auto">
              <Card>
                <Card.Body className="p-4">
                  <h4 className="mb-4 text-center">Need a Receipt?</h4>

                  {/* Certificate Request Toggle */}
                  <div className="text-center mb-4 p-3 bg-white rounded border">
                    <Form.Check
                      type="checkbox"
                      id="wantsCertificate"
                      checked={wantsCertificate}
                      onChange={(e) => setWantsCertificate(e.target.checked)}
                      label={
                        <span className="fw-bold">
                          I want a Donation Receipt and 80G Certificate
                        </span>
                      }
                    />
                    <Form.Text className="text-muted d-block mt-2">
                      Check this box if you need tax benefits under Section 80G
                    </Form.Text>
                  </div>

                  {submitted && (
                    <Alert variant="success">
                      <strong>Thank you!</strong> Your donation information has
                      been recorded. We will send your 80G certificate via
                      email.
                    </Alert>
                  )}

                  {wantsCertificate && !submitted && (
                    <>
                      <p className="text-center text-muted mb-4">
                        Please fill this form to receive your donation receipt
                        and 80G certificate.
                      </p>

                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="donorName"
                            value={formData.donorName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                          />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91-XXXXXXXXXX"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Amount Donated (₹) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="Enter amount"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Transaction ID / UTR Number *</Form.Label>
                          <Form.Control
                            type="text"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleChange}
                            required
                            placeholder="12-digit UTR or Transaction ID"
                          />
                          <Form.Text className="text-muted">
                            Required for verification and receipt generation
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Payment Proof (Screenshot) *</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            required
                          />
                          <Form.Text className="text-muted">
                            Upload screenshot or PDF of payment confirmation
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Message (Optional)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Any message or dedication..."
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          variant="primary"
                          className="w-100"
                          disabled={submitted}
                        >
                          {submitted
                            ? "Submitted!"
                            : "Submit for 80G Certificate"}
                        </Button>
                      </Form>
                    </>
                  )}

                  {!wantsCertificate && !submitted && (
                    <div className="text-center p-4">
                      <p className="text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        If you don't need a receipt, you can simply donate using
                        the details above. Thank you for your generosity!
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Impact Information */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-4">
                <h3>Your Impact</h3>
                <p className="lead">See how your donation makes a difference</p>
              </div>
              <Row>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">₹500</h4>
                  <p>Provides meals for 10 residents for a day</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">₹2000</h4>
                  <p>Funds a health checkup camp</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">₹5000</h4>
                  <p>Supports monthly medicines for 5 elders</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">₹10000</h4>
                  <p>Sponsors a cultural event for all residents</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Donation;
