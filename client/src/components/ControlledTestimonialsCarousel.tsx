import React, { useState, useEffect } from "react";
import { Carousel, Card } from "react-bootstrap";
import type { Testimonial } from "../types";

const ControlledTestimonialsCarousel: React.FC<{
  testimonials: Testimonial[];
}> = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      controls
      indicators
      wrap
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {testimonials.map((testimonial) => (
        <Carousel.Item key={testimonial.id}>
          <Card className="border-0 text-center">
            <Card.Body className="p-5 d-flex flex-column align-items-center">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-circle mb-3"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              )}
              <Card.Text className="h5 mb-4">"{testimonial.message}"</Card.Text>
              <Card.Title className="h6 mb-1">{testimonial.name}</Card.Title>
              <Card.Subtitle className="text-muted">
                {testimonial.role}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ControlledTestimonialsCarousel;
