import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../../components/Admin/AdminLayout";

const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${apiUrl}/api/donations?status=certificate_sent`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setCerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const handleResend = async (id: string) => {
    if (!window.confirm("Resend certificate to donor?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/donations/${id}/resend-certificate`,
        {},
        { headers: { "x-auth-token": token } }
      );
      fetchCerts();
      alert("Certificate resent");
    } catch (err) {
      console.error(err);
      alert("Failed to resend certificate");
    }
  };

  return (
    <AdminLayout activePage="certificates" title="Certificates">
      <Container className="py-4">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Generated 80G Certificates</h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-3">
                <Spinner animation="border" />
              </div>
            ) : certs.length === 0 ? (
              <Alert variant="info">No certificates found</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Receipt No.</th>
                      <th>Amount</th>
                      <th>Generated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map((d) => (
                      <tr key={d._id}>
                        <td>{d.donorName}</td>
                        <td>{d.receiptNumber || "-"}</td>
                        <td>₹{d.amount.toLocaleString()}</td>
                        <td>
                          {new Date(
                            d.verifiedAt || d.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td>
                          {d.certificateUrl ? (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleDownload(d.certificateUrl)}
                              className="me-2"
                            >
                              Download
                            </Button>
                          ) : (
                            <span className="me-2 text-muted">(no file)</span>
                          )}
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleResend(d._id)}
                          >
                            Resend
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default Certificates;
