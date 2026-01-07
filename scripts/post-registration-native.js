(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
    if (!res.ok) process.exit(1);
  } catch (err) {
    console.error("Fetch error:", err);
    process.exit(2);
  }
})();
