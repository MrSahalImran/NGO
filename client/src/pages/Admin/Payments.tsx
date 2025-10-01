import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Spinner,
  Form,
  Badge,
} from "react-bootstrap";
import {
  FaUsers,
  FaDollarSign,
  FaEye,
  FaSearch,
  FaCalendar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../../components/Admin/AdminLayout";

interface Payment {
  _id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  purpose: string;
  donationType: string;
  status: string;
  transactionDate: string;
  stripePaymentId: string;
  isAnonymous: boolean;
  message?: string;
}

interface PaymentStats {
  totalAmount: number;
  totalDonations: number;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [purposeFilter, setPurposeFilter] = useState<string>("all");
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const res = await axios.get("/api/payments/stats/summary");
      setPaymentStats(res.data);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose =
      purposeFilter === "all" || payment.purpose === purposeFilter;

    return matchesSearch && matchesPurpose;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "warning",
      completed: "success",
      failed: "danger",
      refunded: "info",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPurposeBadge = (purpose: string) => {
    const labels: { [key: string]: string } = {
      education: "Education",
      healthcare: "Healthcare",
      environment: "Environment",
      "poverty-relief": "Poverty Relief",
      general: "General Fund",
    };
    return labels[purpose] || purpose;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AdminLayout activePage="payments" title="Donation Management">
      {/* Statistics Cards */}
      {paymentStats && (
        <Row className="admin-stats-row">
          <Col xs={12} md={4} className="mb-3">
            <Card className="admin-stats-card card-hover h-100">
              <Card.Body className="text-center">
                <FaDollarSign className="text-success mb-2" size={40} />
                <h3 className="text-primary">
                  ${paymentStats.totalAmount?.toLocaleString() || 0}
                </h3>
                <p className="mb-0">Total Raised</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={4} className="mb-3">
            <Card className="admin-stats-card card-hover h-100">
              <Card.Body className="text-center">
                <FaUsers className="text-info mb-2" size={40} />
                <h3 className="text-primary">
                  {paymentStats.totalDonations || 0}
                </h3>
                <p className="mb-0">Total Donations</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={4} className="mb-3">
            <Card className="admin-stats-card card-hover h-100">
              <Card.Body className="text-center">
                <FaCalendar className="text-warning mb-2" size={40} />
                <h3 className="text-primary">
                  $
                  {Math.round(
                    (paymentStats.totalAmount || 0) /
                      (paymentStats.totalDonations || 1)
                  )}
                </h3>
                <p className="mb-0">Average Donation</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body className="mobile-filters">
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search Donations</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by donor name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3" />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Purpose</Form.Label>
                <Form.Select
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                >
                  <option value="all">All Purposes</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="environment">Environment</option>
                  <option value="poverty-relief">Poverty Relief</option>
                  <option value="general">General Fund</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payments Table */}
      <Card className="card-hover">
        <Card.Header>
          <h5 className="mb-0">All Donations ({filteredPayments.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th className="d-none d-md-table-cell">Purpose</th>
                  <th className="d-none d-lg-table-cell">Type</th>
                  <th>Status</th>
                  <th className="d-none d-sm-table-cell">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <div>
                        <div className="fw-medium">
                          {payment.isAnonymous ? (
                            <span className="text-muted">Anonymous</span>
                          ) : (
                            payment.donorName
                          )}
                        </div>
                        <div className="d-md-none">
                          <Badge bg="light" text="dark" className="me-1">
                            {getPurposeBadge(payment.purpose)}
                          </Badge>
                        </div>
                        <small className="text-muted text-capitalize d-lg-none">
                          {payment.donationType.replace("-", " ")}
                        </small>
                      </div>
                    </td>
                    <td className="fw-bold text-success">${payment.amount}</td>
                    <td className="d-none d-md-table-cell">
                      <Badge bg="light" text="dark">
                        {getPurposeBadge(payment.purpose)}
                      </Badge>
                    </td>
                    <td className="d-none d-lg-table-cell text-capitalize">
                      {payment.donationType.replace("-", " ")}
                    </td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td className="d-none d-sm-table-cell">
                      <small>
                        {new Date(payment.transactionDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(payment)}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No donations found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Payment Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Donation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <Row>
              <Col md={6}>
                <h6>Donor Information</h6>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedPayment.isAnonymous
                    ? "Anonymous Donor"
                    : selectedPayment.donorName}
                </p>
                {!selectedPayment.isAnonymous && (
                  <>
                    <p>
                      <strong>Email:</strong> {selectedPayment.donorEmail}
                    </p>
                    {selectedPayment.donorPhone && (
                      <p>
                        <strong>Phone:</strong> {selectedPayment.donorPhone}
                      </p>
                    )}
                  </>
                )}

                <h6 className="mt-4">Donation Details</h6>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="text-success fw-bold">
                    ${selectedPayment.amount}
                  </span>
                </p>
                <p>
                  <strong>Currency:</strong> {selectedPayment.currency}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  <span className="text-capitalize">
                    {selectedPayment.donationType.replace("-", " ")}
                  </span>
                </p>
                <p>
                  <strong>Purpose:</strong>{" "}
                  {getPurposeBadge(selectedPayment.purpose)}
                </p>
              </Col>
              <Col md={6}>
                <h6>Transaction Information</h6>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedPayment.status)}
                </p>
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  <code>{selectedPayment.stripePaymentId}</code>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedPayment.transactionDate).toLocaleString()}
                </p>

                {selectedPayment.message && (
                  <>
                    <h6 className="mt-4">Message from Donor</h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0 fst-italic">
                        "{selectedPayment.message}"
                      </p>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Payments;
