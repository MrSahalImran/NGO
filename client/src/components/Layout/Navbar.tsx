import React from "react";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <LinkContainer to="/">
          <BSNavbar.Brand className="d-flex align-items-center">
            {/* logo - using the raster logo provided in public/ */}
            <img
              src="/images/logo.png"
              alt="Virdh Ashram"
              width={36}
              height={36}
              className="me-2"
              style={{ objectFit: "contain" }}
            />
            <strong>Virdh Ashram</strong>
          </BSNavbar.Brand>
        </LinkContainer>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/programs">
              <Nav.Link>Programs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/gallery">
              <Nav.Link>Gallery</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact">
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav>
            <LinkContainer to="/donation">
              <Nav.Link className="btn btn-secondary text-white me-2">
                Donate Now
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/registration">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>

            {user ? (
              <NavDropdown title={`Welcome, ${user.name}`} id="user-dropdown">
                {user.role === "admin" && (
                  <>
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Admin Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/photos">
                      <NavDropdown.Item>Manage Photos</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
