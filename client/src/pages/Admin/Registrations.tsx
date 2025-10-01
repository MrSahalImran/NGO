import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaEye, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../../components/Admin/AdminLayout";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registeredAt: string;
  dateOfBirth: string;
  gender: string;
  occupation?: string;
  address: string;
  interests: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get("/api/registrations");
      setRegistrations(res.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/registrations/${id}/status`, { status });

      // Update local state
      setRegistrations(
        registrations.map((reg) => (reg._id === id ? { ...reg, status } : reg))
      );

      if (selectedRegistration && selectedRegistration._id === id) {
        setSelectedRegistration({ ...selectedRegistration, status });
      }

      toast.success(`Registration ${status} successfully`);
    } catch (error) {
      console.error("Error updating registration status:", error);
      toast.error("Failed to update registration status");
    }
  };

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || registration.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
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
    <AdminLayout activePage="registrations" title="Volunteer Registrations">
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body className="mobile-filters">
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search Registrations</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3" />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Registrations Table */}
      <Card className="card-hover">
        <Card.Header>
          <h5 className="mb-0">
            All Registrations ({filteredRegistrations.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th className="d-none d-lg-table-cell">Phone</th>
                  <th>Status</th>
                  <th className="d-none d-sm-table-cell">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration._id}>
                    <td>
                      <div>
                        <div className="fw-medium">{registration.name}</div>
                        <small className="text-muted d-md-none">
                          {registration.email}
                        </small>
                        <div className="d-lg-none">
                          <small className="text-muted">
                            {registration.phone}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {registration.email}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {registration.phone}
                    </td>
                    <td>{getStatusBadge(registration.status)}</td>
                    <td className="d-none d-sm-table-cell">
                      <small>
                        {new Date(
                          registration.registeredAt
                        ).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex d-md-block mobile-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1 me-md-2 mb-1 mb-md-0"
                          onClick={() => handleViewDetails(registration)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        {registration.status === "pending" && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1 me-md-2 mb-1 mb-md-0"
                              onClick={() =>
                                handleUpdateStatus(registration._id, "approved")
                              }
                              title="Approve"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mb-1 mb-md-0"
                              onClick={() =>
                                handleUpdateStatus(registration._id, "rejected")
                              }
                              title="Reject"
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No registrations found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Registration Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registration Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRegistration && (
            <Row>
              <Col md={6}>
                <h6>Personal Information</h6>
                <p>
                  <strong>Name:</strong> {selectedRegistration.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRegistration.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRegistration.phone}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(
                    selectedRegistration.dateOfBirth
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedRegistration.gender}
                </p>
                <p>
                  <strong>Occupation:</strong>{" "}
                  {selectedRegistration.occupation || "Not specified"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedRegistration.address}
                </p>
              </Col>
              <Col md={6}>
                <h6>Volunteer Information</h6>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedRegistration.status)}
                </p>
                <p>
                  <strong>Registration Date:</strong>{" "}
                  {new Date(
                    selectedRegistration.registeredAt
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Areas of Interest:</strong>
                </p>
                <ul>
                  {selectedRegistration.interests.map((interest, index) => (
                    <li key={index}>{interest}</li>
                  ))}
                </ul>

                <h6>Emergency Contact</h6>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedRegistration.emergencyContact.name}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedRegistration.emergencyContact.phone}
                </p>
                <p>
                  <strong>Relationship:</strong>{" "}
                  {selectedRegistration.emergencyContact.relationship}
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedRegistration &&
            selectedRegistration.status === "pending" && (
              <>
                <Button
                  variant="success"
                  onClick={() => {
                    handleUpdateStatus(selectedRegistration._id, "approved");
                    setShowModal(false);
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleUpdateStatus(selectedRegistration._id, "rejected");
                    setShowModal(false);
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default Registrations;
