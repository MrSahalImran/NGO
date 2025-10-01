const express = require("express");
const router = express.Router();

// NGO Information
router.get("/info", (req, res) => {
  const ngoInfo = {
    name: "Vridh Ashram",
    mission:
      "Empowering communities through education, healthcare, and sustainable development initiatives.",
    vision:
      "A world where every individual has access to basic necessities and opportunities for growth.",
    founded: "2010",
    description:
      "Vridh Ashram is a non-profit organization dedicated to creating positive change in underserved communities. We focus on education, healthcare, environmental conservation, and poverty alleviation programs.",
    programs: [
      {
        id: 1,
        title: "Education for All",
        description:
          "Providing quality education and resources to children in rural areas.",
        image: "/images/education.jpg",
      },
      {
        id: 2,
        title: "Healthcare Access",
        description:
          "Mobile health clinics and medical camps in remote locations.",
        image: "/images/healthcare.jpg",
      },
      {
        id: 3,
        title: "Environmental Conservation",
        description:
          "Tree plantation drives and environmental awareness programs.",
        image: "/images/environment.jpg",
      },
      {
        id: 4,
        title: "Poverty Alleviation",
        description:
          "Skill development and microfinance programs for economic empowerment.",
        image: "/images/poverty.jpg",
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

// Get testimonials
router.get("/testimonials", (req, res) => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Volunteer",
      message:
        "Working with Hope Foundation has been incredibly rewarding. The impact we make together is truly inspiring.",
      image: "/images/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Beneficiary Parent",
      message:
        "Thanks to Hope Foundation, my daughter now has access to quality education. Our family's future looks brighter.",
      image: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Medical Volunteer",
      message:
        "The healthcare programs reach people who need it most. It's amazing to see the difference we can make.",
      image: "/images/testimonial3.jpg",
    },
  ];

  res.json(testimonials);
});

// Get latest news/updates
router.get("/news", (req, res) => {
  const news = [
    {
      id: 1,
      title: "New School Opens in Rural Community",
      summary:
        "Hope Foundation inaugurates its 50th school in a remote village, bringing education closer to 200 children.",
      date: "2024-01-15",
      image: "/images/news1.jpg",
    },
    {
      id: 2,
      title: "Medical Camp Serves 500 Patients",
      summary:
        "Free medical camp conducted in partnership with local hospitals provides healthcare to underserved population.",
      date: "2024-01-10",
      image: "/images/news2.jpg",
    },
    {
      id: 3,
      title: "Environmental Awareness Drive",
      summary:
        "Community tree plantation program plants 1000 trees and educates locals about environmental conservation.",
      date: "2024-01-05",
      image: "/images/news3.jpg",
    },
  ];

  res.json(news);
});

module.exports = router;
