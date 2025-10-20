import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
  Table,
  Badge,
  Image,
} from "react-bootstrap";
import axios from "axios";
import type { Photo } from "../../types/photo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Upload form state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("event");
  const [tags, setTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/photos`);
      setPhotos(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = fileArray.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Please select only image files (JPEG, PNG, GIF, WEBP)");
      return;
    }

    const oversizedFiles = fileArray.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError("Some files exceed 5MB size limit");
      return;
    }

    setSelectedFiles(fileArray);
    setError("");

    // Create previews
    const newPreviews: string[] = [];
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === fileArray.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in");
      }

      const formData = new FormData();

      if (selectedFiles.length === 1) {
        formData.append("photo", selectedFiles[0]);
      } else {
        selectedFiles.forEach((file) => {
          formData.append("photos", file);
        });
      }

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);

      const endpoint =
        selectedFiles.length === 1
          ? "/api/photos/upload"
          : "/api/photos/upload-multiple";

      await axios.post(`${API_URL}${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });

      setSuccess(`${selectedFiles.length} photo(s) uploaded successfully!`);
      resetForm();
      fetchPhotos();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setTitle("");
    setDescription("");
    setCategory("event");
    setTags("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingPhoto) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/photos/${editingPhoto._id}`,
        {
          title: editingPhoto.title,
          description: editingPhoto.description,
          category: editingPhoto.category,
          tags: editingPhoto.tags,
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      setSuccess("Photo updated successfully!");
      setShowEditModal(false);
      fetchPhotos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update photo");
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/photos/${photoId}`, {
        headers: { "x-auth-token": token },
      });

      setSuccess("Photo deleted successfully!");
      fetchPhotos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete photo");
    }
  };

  const removePreview = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-images me-2"></i>
        Manage Photos
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Upload Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-cloud-upload me-2"></i>
            Upload Photos
          </h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleUpload}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Images *</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Max 5MB per file. You can select multiple images (up to 10).
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter photo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="event">Event</option>
                    <option value="program">Program</option>
                    <option value="beneficiary">Beneficiary</option>
                    <option value="facility">Facility</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="charity, event, community (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={uploading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="w-100"
                >
                  {uploading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload{" "}
                      {selectedFiles.length > 0
                        ? `(${selectedFiles.length})`
                        : ""}
                    </>
                  )}
                </Button>
              </Col>

              <Col md={6}>
                {previews.length > 0 && (
                  <>
                    <Form.Label>Preview</Form.Label>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                      <Row>
                        {previews.map((preview, index) => (
                          <Col xs={6} key={index} className="mb-3">
                            <div className="position-relative">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                thumbnail
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1"
                                onClick={() => removePreview(index)}
                                disabled={uploading}
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Photos List */}
      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white">
          <h5 className="mb-0">
            <i className="bi bi-card-image me-2"></i>
            Uploaded Photos ({photos.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : photos.length === 0 ? (
            <p className="text-center text-muted py-4">
              No photos uploaded yet.
            </p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Date</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {photos.map((photo) => (
                    <tr key={photo._id}>
                      <td>
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title}
                          thumbnail
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>
                        <strong>{photo.title}</strong>
                        {photo.description && (
                          <div className="text-muted small">
                            {photo.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <Badge bg="info" className="text-capitalize">
                          {photo.category}
                        </Badge>
                      </td>
                      <td>
                        {photo.tags.map((tag, index) => (
                          <Badge key={index} bg="secondary" className="me-1">
                            {tag}
                          </Badge>
                        ))}
                      </td>
                      <td>{new Date(photo.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(photo)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(photo._id)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPhoto && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingPhoto.description}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editingPhoto.category}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      category: e.target.value as Photo["category"],
                    })
                  }
                >
                  <option value="event">Event</option>
                  <option value="program">Program</option>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="facility">Facility</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={editingPhoto.tags.join(", ")}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPhotos;
