const express = require("express");
const router = express.Router();

// NGO Information
router.get("/info", (req, res) => {
  const ngoInfo = {
    name: "Vridh Ashram",
    mission:
      "Our mission goes beyond providing basic necessities—it is about restoring self-worth, spreading kindness, and upholding the belief that every elder deserves to live with respect and compassion. Guided by the spirit of humanity, we strive to serve each resident with unconditional love, ensuring that they feel valued, cherished, and never alone.",
    vision:
      "A society where no elder is abandoned — where old age is met with dignity, companionship, and belonging.",
    founded: "2010",
    description:
      "A home in Ambphalla, Jammu for elders who have no one — where the last years of life are met with care, not neglect.",
    programs: [
      {
        id: 1,
        title: "Meals & Nutrition",
        description:
          "Three warm, home-cooked meals a day, planned for ageing bodies.",
      },
      {
        id: 2,
        title: "Medical Care",
        description:
          "Daily medicines, regular check-ups, and help in emergencies.",
      },
      {
        id: 3,
        title: "Shelter & Comfort",
        description: "A clean bed, a safe room, and a place to belong.",
      },
      {
        id: 4,
        title: "Companionship",
        description:
          "Someone to sit with, talk to, and share the day — no one is left alone.",
      },
    ],
    impact: {
      beneficiaries: 10000,
      projects: 150,
      volunteers: 500,
      yearsActive: 13,
    },
    contact: {
      address: "Amphalla",
      phone: "+914564653151",
      email: "info@vridhashram.org",
      website: "www.virdhashram.org",
    },
    socialMedia: {
      facebook: "/",
      twitter: "/",
      instagram: "/",
      linkedin: "/",
    },
  };

  res.json(ngoInfo);
});

// Testimonials — served from a datastore/CMS once real quotes are collected.
// Returns an empty list rather than fabricated placeholder content.
router.get("/testimonials", (req, res) => {
  res.json([]);
});

// News/updates — served from a datastore/CMS once real posts exist.
// Returns an empty list rather than fabricated placeholder content.
router.get("/news", (req, res) => {
  res.json([]);
});

module.exports = router;
