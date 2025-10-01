import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
import {
  FaUsers,
  FaDollarSign,
  FaHandHoldingHeart,
  FaChartBar,
} from "react-icons/fa";
import axios from "axios";
import AdminLayout from "../../components/Admin/AdminLayout";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
    <AdminLayout activePage="dashboard" title="Admin Dashboard">
      {/* Statistics Cards */}
      <Row className="admin-stats-row">
        <Col xs={6} lg={3} className="mb-3">
          <Card className="admin-stats-card card-hover h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-primary mb-2" size={40} />
              <h3 className="text-primary">
                {dashboardData?.registrations?.total || 0}
              </h3>
              <p className="mb-0">Total Registrations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3} className="mb-3">
          <Card className="admin-stats-card card-hover h-100">
            <Card.Body className="text-center">
              <FaHandHoldingHeart className="text-warning mb-2" size={40} />
              <h3 className="text-primary">
                {dashboardData?.registrations?.pending || 0}
              </h3>
              <p className="mb-0">Pending Approvals</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3} className="mb-3">
          <Card className="admin-stats-card card-hover h-100">
            <Card.Body className="text-center">
              <FaDollarSign className="text-success mb-2" size={40} />
              <h3 className="text-primary">
                ${dashboardData?.payments?.totalAmount?.toLocaleString() || 0}
              </h3>
              <p className="mb-0">Total Donations</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3} className="mb-3">
          <Card className="admin-stats-card card-hover h-100">
            <Card.Body className="text-center">
              <FaChartBar className="text-info mb-2" size={40} />
              <h3 className="text-primary">
                {dashboardData?.payments?.totalDonations || 0}
              </h3>
              <p className="mb-0">Total Donors</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="card-hover">
            <Card.Header>
              <h5 className="mb-0">Recent Registrations</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th className="d-none d-md-table-cell">Email</th>
                      <th>Status</th>
                      <th className="d-none d-sm-table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent?.registrations?.map(
                      (registration: any) => (
                        <tr key={registration._id}>
                          <td>
                            <div>
                              <div className="fw-medium">
                                {registration.name}
                              </div>
                              <small className="text-muted d-md-none">
                                {registration.email}
                              </small>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">
                            {registration.email}
                          </td>
                          <td>
                            <Badge
                              bg={
                                registration.status === "approved"
                                  ? "success"
                                  : registration.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {registration.status}
                            </Badge>
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <small>
                              {new Date(
                                registration.registeredAt
                              ).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      )
                    ) || (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No registrations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="card-hover">
            <Card.Header>
              <h5 className="mb-0">Recent Donations</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th className="d-none d-md-table-cell">Purpose</th>
                      <th className="d-none d-sm-table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent?.payments?.map((payment: any) => (
                      <tr key={payment._id}>
                        <td>
                          <div>
                            <div className="fw-medium">{payment.donorName}</div>
                            <small className="text-muted text-capitalize d-md-none">
                              {payment.purpose.replace("-", " ")}
                            </small>
                          </div>
                        </td>
                        <td className="fw-bold text-success">
                          ${payment.amount}
                        </td>
                        <td className="d-none d-md-table-cell text-capitalize">
                          {payment.purpose.replace("-", " ")}
                        </td>
                        <td className="d-none d-sm-table-cell">
                          <small>
                            {new Date(
                              payment.transactionDate
                            ).toLocaleDateString()}
                          </small>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No donations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Registration Status Breakdown */}
      <Row>
        <Col xs={12}>
          <Card className="card-hover">
            <Card.Header>
              <h5 className="mb-0">Registration Status Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={6} md={3} className="mb-3 mb-md-0">
                  <div className="stat-item">
                    <div className="stat-number text-success">
                      {dashboardData?.registrations?.approved || 0}
                    </div>
                    <div className="stat-label">Approved</div>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-3 mb-md-0">
                  <div className="stat-item">
                    <div className="stat-number text-warning">
                      {dashboardData?.registrations?.pending || 0}
                    </div>
                    <div className="stat-label">Pending</div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="stat-item">
                    <div className="stat-number text-danger">
                      {dashboardData?.registrations?.rejected || 0}
                    </div>
                    <div className="stat-label">Rejected</div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="stat-item">
                    <div className="stat-number text-primary">
                      {dashboardData?.registrations?.total || 0}
                    </div>
                    <div className="stat-label">Total</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default Dashboard;
