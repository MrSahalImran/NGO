import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import Donation from "./pages/Donation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRegistrations from "./pages/Admin/Registrations";
import AdminPayments from "./pages/Admin/Payments";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Regular pages with main-content class */}
            <Route
              path="/"
              element={
                <main className="main-content">
                  <Home />
                </main>
              }
            />
            <Route
              path="/about"
              element={
                <main className="main-content">
                  <About />
                </main>
              }
            />
            <Route
              path="/programs"
              element={
                <main className="main-content">
                  <Programs />
                </main>
              }
            />
            <Route
              path="/contact"
              element={
                <main className="main-content">
                  <Contact />
                </main>
              }
            />
            <Route
              path="/registration"
              element={
                <main className="main-content">
                  <Registration />
                </main>
              }
            />
            <Route
              path="/donation"
              element={
                <main className="main-content">
                  <Donation />
                </main>
              }
            />
            <Route
              path="/login"
              element={
                <main className="main-content">
                  <Login />
                </main>
              }
            />
            <Route
              path="/register"
              element={
                <main className="main-content">
                  <Register />
                </main>
              }
            />

            {/* Admin pages with admin-page class */}
            <Route
              path="/admin/dashboard"
              element={
                <main className="admin-page">
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard />
                  </PrivateRoute>
                </main>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <main className="admin-page">
                  <PrivateRoute adminOnly={true}>
                    <AdminRegistrations />
                  </PrivateRoute>
                </main>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <main className="admin-page">
                  <PrivateRoute adminOnly={true}>
                    <AdminPayments />
                  </PrivateRoute>
                </main>
              }
            />
          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
};
export default App;
