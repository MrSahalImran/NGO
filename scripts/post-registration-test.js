const axios = require("axios");

(async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/registrations", {
      name: "Test Resident",
      phone: "+10000000000",
      address: "123 Test St",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      emergencyContact: {
        name: "John Doe",
        phone: "+10000000001",
        email: "test-contact@example.com",
        relationship: "Friend",
      },
    });
    console.log("Response:", res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.status, err.response.data);
    } else {
      console.error("Request error:", err.message);
    }
    process.exit(1);
  }
})();
