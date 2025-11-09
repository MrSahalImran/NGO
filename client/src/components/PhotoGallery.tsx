import React, { useState } from "react";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
// no external types required

type ImageItem = {
  src: string;
  alt?: string;
  caption?: string;
};

const PhotoGallery: React.FC<{ images: ImageItem[] }> = ({ images }) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<ImageItem | null>(null);

  const open = (img: ImageItem) => {
    setActive(img);
    setShow(true);
  };
  const close = () => setShow(false);

  return (
    <>
      <Row>
        {images.map((img, i) => (
          <Col md={6} lg={4} key={i} className="mb-4">
            <Card
              className="h-100 card-hover"
              onClick={() => open(img)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ height: 200, overflow: "hidden" }}>
                <Card.Img
                  src={img.src}
                  alt={img.alt || `photo-${i}`}
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>
              <Card.Body>
                <Card.Title className="h6">{img.caption || img.alt}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{active?.caption || active?.alt}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {active && (
            <img
              src={active.src}
              alt={active.alt}
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PhotoGallery;
