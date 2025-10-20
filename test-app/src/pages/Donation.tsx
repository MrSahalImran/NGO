import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

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
                positive change in communities. Please use the details below to donate via bank transfer or UPI.
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
                    <li><strong>Account Name:</strong> {bankDetails.accountName}</li>
                    <li><strong>Account Number:</strong> {bankDetails.accountNumber}</li>
                    <li><strong>IFSC Code:</strong> {bankDetails.ifsc}</li>
                    <li><strong>Bank Name:</strong> {bankDetails.bankName}</li>
                    <li><strong>Branch:</strong> {bankDetails.branch}</li>
                  </ul>
                  <div className="mt-3">
                    <strong>UPI ID:</strong> {bankDetails.upiId}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h4 className="mb-3">Scan UPI QR Code</h4>
                <img
                  src={bankDetails.qrCodeUrl}
                  alt="UPI QR Code"
                  style={{ maxWidth: 240, width: "100%", borderRadius: 8, border: "1px solid #eee" }}
                />
                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  Scan with any UPI app (Paytm, GPay, PhonePe, etc.)
                </div>
              </div>
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
