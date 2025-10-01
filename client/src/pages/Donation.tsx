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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";
import { toast } from "react-toastify";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");

const Donation = () => {
  const [step, setStep] = useState(1);
  const [donationData, setDonationData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    amount: 0,
    donationType: "one-time",
    purpose: "general",
    message: "",
    isAnonymous: false,
  });
  const [clientSecret, setClientSecret] = useState("");

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  const purposes = [
    { value: "education", label: "Education Programs" },
    { value: "healthcare", label: "Healthcare Initiatives" },
    { value: "environment", label: "Environmental Projects" },
    { value: "poverty-relief", label: "Poverty Alleviation" },
    { value: "general", label: "General Fund" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationData({
      ...donationData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAmountSelect = (amount: number) => {
    setDonationData({
      ...donationData,
      amount: amount,
    });
  };

  const handleCustomAmount = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setDonationData({
      ...donationData,
      amount: amount,
    });
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!donationData.amount || donationData.amount < 1) {
        toast.error("Please select or enter a donation amount");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!donationData.donorName || !donationData.donorEmail) {
        toast.error("Please fill in all required fields");
        return;
      }

      try {
        // Create payment intent
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: donationData.amount,
            donorName: donationData.donorName,
            donorEmail: donationData.donorEmail,
          }),
        });

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setStep(3);
      } catch (error) {
        toast.error("Failed to initialize payment. Please try again.");
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePaymentSuccess = () => {
    setStep(4);
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
                positive change in communities worldwide.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Progress Indicator */}
      <section className="py-3 bg-light">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="d-flex justify-content-between align-items-center">
                <div className={`step-indicator ${step >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Amount</div>
                </div>
                <div className={`step-indicator ${step >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Details</div>
                </div>
                <div className={`step-indicator ${step >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Payment</div>
                </div>
                <div className={`step-indicator ${step >= 4 ? "active" : ""}`}>
                  <div className="step-number">4</div>
                  <div className="step-label">Complete</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Donation Form */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="card-hover">
                <Card.Body className="p-5">
                  {/* Step 1: Amount Selection */}
                  {step === 1 && (
                    <div>
                      <h3 className="text-primary mb-4">
                        Select Donation Amount
                      </h3>

                      <div className="donation-amount-buttons mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`donation-amount-btn ${
                              donationData.amount === amount ? "active" : ""
                            }`}
                            onClick={() => handleAmountSelect(amount)}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>

                      <Form.Group className="mb-4">
                        <Form.Label>Or enter custom amount:</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter amount"
                          onChange={handleCustomAmount}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Donation Type</Form.Label>
                        <Form.Select
                          name="donationType"
                          value={donationData.donationType}
                          onChange={handleChange}
                        >
                          <option value="one-time">One-time donation</option>
                          <option value="monthly">Monthly donation</option>
                          <option value="yearly">Yearly donation</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Purpose</Form.Label>
                        <Form.Select
                          name="purpose"
                          value={donationData.purpose}
                          onChange={handleChange}
                        >
                          {purposes.map((purpose) => (
                            <option key={purpose.value} value={purpose.value}>
                              {purpose.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <div className="text-center">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleNextStep}
                          disabled={
                            !donationData.amount || donationData.amount < 1
                          }
                        >
                          Continue - ${donationData.amount || 0}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Donor Information */}
                  {step === 2 && (
                    <div>
                      <h3 className="text-primary mb-4">Donor Information</h3>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="donorName"
                              value={donationData.donorName}
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
                              name="donorEmail"
                              value={donationData.donorEmail}
                              onChange={handleChange}
                              required
                              placeholder="your.email@example.com"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number (Optional)</Form.Label>
                        <Form.Control
                          type="tel"
                          name="donorPhone"
                          value={donationData.donorPhone}
                          onChange={handleChange}
                          placeholder="+1-XXX-XXX-XXXX"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Message (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="message"
                          value={donationData.message}
                          onChange={handleChange}
                          placeholder="Share a message or dedication..."
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="isAnonymous"
                          checked={donationData.isAnonymous}
                          onChange={handleChange}
                          label="Make this donation anonymous"
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-secondary"
                          onClick={handleBackStep}
                        >
                          Back
                        </Button>
                        <Button variant="primary" onClick={handleNextStep}>
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && clientSecret && (
                    <div>
                      <h3 className="text-primary mb-4">Payment Information</h3>

                      <div className="mb-4 p-3 bg-light rounded">
                        <h5>Donation Summary</h5>
                        <p className="mb-1">
                          <strong>Amount:</strong> ${donationData.amount}
                        </p>
                        <p className="mb-1">
                          <strong>Type:</strong> {donationData.donationType}
                        </p>
                        <p className="mb-0">
                          <strong>Purpose:</strong>{" "}
                          {
                            purposes.find(
                              (p) => p.value === donationData.purpose
                            )?.label
                          }
                        </p>
                      </div>

                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}
                      >
                        <PaymentForm
                          donationData={donationData}
                          onSuccess={handlePaymentSuccess}
                          onBack={handleBackStep}
                        />
                      </Elements>
                    </div>
                  )}

                  {/* Step 4: Success */}
                  {step === 4 && (
                    <div className="text-center">
                      <Alert variant="success" className="p-5">
                        <h3>Thank You for Your Generous Donation!</h3>
                        <p className="lead">
                          Your donation of ${donationData.amount} has been
                          processed successfully.
                        </p>
                        <p>
                          You will receive a confirmation email shortly. Your
                          support helps us continue our mission of creating
                          positive change in communities.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setStep(1);
                            setDonationData({
                              donorName: "",
                              donorEmail: "",
                              donorPhone: "",
                              amount: 0,
                              donationType: "one-time",
                              purpose: "general",
                              message: "",
                              isAnonymous: false,
                            });
                          }}
                        >
                          Make Another Donation
                        </Button>
                      </Alert>
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
                  <h4 className="text-primary">$25</h4>
                  <p>Provides school supplies for one child for a month</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">$50</h4>
                  <p>Funds a health checkup for a family in need</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">$100</h4>
                  <p>Plants 50 trees in environmental conservation areas</p>
                </Col>
                <Col md={3} className="text-center mb-4">
                  <h4 className="text-primary">$250</h4>
                  <p>Provides vocational training for one individual</p>
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
