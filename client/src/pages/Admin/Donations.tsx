import React, { useState } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../../components/Admin/AdminLayout";

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  transactionId: string;
  paymentProof: {
    url: string;
    cloudinaryId: string;
  };
  message?: string;
  status: "pending" | "verified" | "rejected" | "certificate_sent";
  receiptNumber?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchDonations = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url =
        filter === "all"
          ? `${apiUrl}/api/donations`
          : `${apiUrl}/api/donations?status=${filter}`;

      const response = await axios.get(url, {
        headers: { "x-auth-token": token },
      });

      setDonations(response.data);
    } catch (err) {
      setError("Failed to fetch donations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filter]);

  React.useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleVerify = async (donationId: string) => {
    if (!window.confirm("Are you sure you want to verify this donation?")) {
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiUrl}/api/donations/${donationId}/verify`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );

      setShowModal(false);
      fetchDonations();
      alert("Donation verified and certificate sent successfully!");
    } catch (err) {
      alert("Failed to verify donation");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDonation || !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiUrl}/api/donations/${selectedDonation._id}/reject`,
        { reason: rejectionReason },
        {
          headers: { "x-auth-token": token },
        }
      );

      setShowModal(false);
      setShowRejectModal(false);
      setRejectionReason("");
      fetchDonations();
      alert("Donation rejected successfully!");
    } catch (err) {
      alert("Failed to reject donation");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "verified":
        return <Badge bg="info">Verified</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      case "certificate_sent":
        return <Badge bg="success">Certificate Sent</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    verified: donations.filter((d) => d.status === "verified").length,
    rejected: donations.filter((d) => d.status === "rejected").length,
    certificateSent: donations.filter((d) => d.status === "certificate_sent")
      .length,
    totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <AdminLayout activePage="donations" title="Donation Management">
      <Container className="py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary">{stats.total}</h3>
                <p className="mb-0 text-muted">Total Donations</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">{stats.pending}</h3>
                <p className="mb-0 text-muted">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{stats.certificateSent}</h3>
                <p className="mb-0 text-muted">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">
                  ₹{stats.totalAmount.toLocaleString()}
                </h3>
                <p className="mb-0 text-muted">Total Amount</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <div className="mt-4 mb-3">
          <Button
            variant={filter === "all" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "warning" : "outline-warning"}
            className="me-2"
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "verified" ? "info" : "outline-info"}
            className="me-2"
            onClick={() => setFilter("verified")}
          >
            Verified
          </Button>
          <Button
            variant={
              filter === "certificate_sent" ? "success" : "outline-success"
            }
            className="me-2"
            onClick={() => setFilter("certificate_sent")}
          >
            Certificate Sent
          </Button>
          <Button
            variant={filter === "rejected" ? "danger" : "outline-danger"}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
        </div>

        {/* Donations Table / Mobile Cards */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : donations.length === 0 ? (
          <Alert variant="info">No donations found.</Alert>
        ) : (
          <>
            {/* Mobile: Card list */}
            <div className="d-block d-md-none">
              <Row>
                {donations.map((donation) => (
                  <Col xs={12} className="mb-3" key={donation._id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-semibold">{donation.donorName}</div>
                            <div className="text-muted small">{formatDate(donation.createdAt)}</div>
                          </div>
                          <div>{getStatusBadge(donation.status)}</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small">Amount</div>
                            <div className="fw-bold">₹{donation.amount.toLocaleString()}</div>
                          </div>
                          <div className="text-end">
                            <div className="text-muted small">Txn</div>
                            <div className="small">
                              <code>
                                {donation.transactionId.length > 10
                                  ? `${donation.transactionId.slice(0, 6)}…${donation.transactionId.slice(-4)}`
                                  : donation.transactionId}
                              </code>
                            </div>
                          </div>
                        </div>
                        {donation.receiptNumber && (
                          <div className="mt-2 text-muted small">
                            Receipt: <code>{donation.receiptNumber}</code>
                          </div>
                        )}
                        <div className="mt-3 d-flex justify-content-end">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleViewDetails(donation)}
                          >
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Desktop/Tablet: Table */}
            <div className="table-responsive d-none d-md-block">
              <Table striped bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Donor Name</th>
                    <th>Amount</th>
                    <th className="d-none d-lg-table-cell">Transaction ID</th>
                    <th>Status</th>
                    <th className="d-none d-lg-table-cell">Receipt No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>{formatDate(donation.createdAt)}</td>
                      <td>{donation.donorName}</td>
                      <td>₹{donation.amount.toLocaleString()}</td>
                      <td className="d-none d-lg-table-cell">
                        <small>{donation.transactionId}</small>
                      </td>
                      <td>{getStatusBadge(donation.status)}</td>
                      <td className="d-none d-lg-table-cell">
                        {donation.receiptNumber ? (
                          <code>{donation.receiptNumber}</code>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleViewDetails(donation)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}

        {/* View Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Donation Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedDonation && (
              <div>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Donor Name:</strong> {selectedDonation.donorName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDonation.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedDonation.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹
                      {selectedDonation.amount.toLocaleString()}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedDonation.transactionId}
                    </p>
                    <p className="mt-3">
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedDonation.status)}
                    </p>
                    <p>
                      <strong>Receipt Number:</strong>{" "}
                      {selectedDonation.receiptNumber || "Not generated"}
                    </p>
                    <p>
                      <strong>Submitted:</strong>{" "}
                      {formatDate(selectedDonation.createdAt)}
                    </p>
                  </Col>
                </Row>

                {selectedDonation.message && (
                  <div className="mt-3">
                    <strong>Message:</strong>
                    <p className="bg-light p-2 rounded">
                      {selectedDonation.message}
                    </p>
                  </div>
                )}

                {selectedDonation.rejectionReason && (
                  <Alert variant="danger" className="mt-3">
                    <strong>Rejection Reason:</strong>{" "}
                    {selectedDonation.rejectionReason}
                  </Alert>
                )}

                <div className="mt-3">
                  <strong>Payment Proof:</strong>
                  <div className="mt-2">
                    <a
                      href={selectedDonation.paymentProof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={selectedDonation.paymentProof.url}
                        alt="Payment Proof"
                        style={{ maxWidth: "100%", maxHeight: 400 }}
                        className="img-thumbnail"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedDonation?.status === "pending" && (
              <>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                  disabled={processing}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleVerify(selectedDonation._id)}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Verify & Send Certificate"}
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reject Confirmation Modal */}
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reject Donation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Reason for Rejection *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this donation..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? "Processing..." : "Confirm Rejection"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default Donations;
