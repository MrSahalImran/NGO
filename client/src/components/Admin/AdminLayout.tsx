import React, { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: "dashboard" | "registrations" | "payments";
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activePage,
  title,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const navigationItems = [
    {
      key: "dashboard",
      to: "/admin/dashboard",
      icon: FaChartBar,
      label: "Dashboard",
    },
    {
      key: "registrations",
      to: "/admin/registrations",
      icon: FaUsers,
      label: "Registrations",
    },
    {
      key: "payments",
      to: "/admin/payments",
      icon: FaDollarSign,
      label: "Donations",
    },
  ];

  return (
    <Container fluid className="p-0 m-0">
      <Row className="g-0">
        {/* Mobile Sidebar Toggle */}
        <Col xs={12} className="d-lg-none p-2">
          <Button
            variant="dark"
            className="admin-sidebar-toggle w-auto"
            onClick={toggleSidebar}
          >
            <FaBars className="me-2" />
            Menu
          </Button>
        </Col>

        {/* Sidebar */}
        <Col
          md={3}
          lg={2}
          className={`admin-sidebar ${sidebarVisible ? "show" : ""}`}
        >
          {/* Mobile Close Button */}
          <div className="d-lg-none d-flex justify-content-end p-2">
            <Button
              variant="link"
              className="text-white p-0"
              onClick={closeSidebar}
            >
              <FaTimes size={20} />
            </Button>
          </div>

          <Nav className="flex-column">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <LinkContainer key={item.key} to={item.to}>
                  <Nav.Link
                    className={activePage === item.key ? "active" : ""}
                    onClick={closeSidebar}
                  >
                    <IconComponent className="me-2" />
                    <span>{item.label}</span>
                  </Nav.Link>
                </LinkContainer>
              );
            })}
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="admin-content">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">{title}</h2>
          </div>
          {children}
        </Col>
      </Row>

      {/* Mobile Overlay */}
      <div
        className={`admin-overlay ${sidebarVisible ? "show" : ""}`}
        onClick={closeSidebar}
      />
    </Container>
  );
};

export default AdminLayout;
