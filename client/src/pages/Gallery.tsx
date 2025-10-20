import React, { useState, useEffect, useCallback } from "react";
import { Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import type { Photo } from "../types/photo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/photos`;

      const response = await axios.get(url);
      setPhotos(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch photos error:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setHideHeader(true);
      } else {
        // Scrolling up
        setHideHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="instagram-feed">
      {/* Header Section */}
      <div className={`feed-header ${hideHeader ? "hidden" : ""}`}>
        <div className="text-center py-3">
          <h2 className="mb-1">
            <i className="bi bi-images me-2"></i>
            Photo Gallery
          </h2>
          <p className="text-muted small mb-0">
            Moments from our NGO activities and events
          </p>
        </div>
      </div>

      {/* Feed Content */}
      <div className="feed-container">
        {error && (
          <Alert variant="danger" className="mx-3">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-image-fill"></i>
            <p className="mt-3">No photos available yet.</p>
          </div>
        ) : (
          <div className="posts-feed">
            {photos.map((photo) => (
              <article key={photo._id} className="post-card">
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-user">
                    <div className="user-avatar">
                      <i className="bi bi-building"></i>
                    </div>
                    <div className="user-info">
                      <div className="username">Virdh Ashram</div>
                      <div className="post-location text-capitalize">
                        {photo.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                <div className="post-image">
                  <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <div className="post-title">
                    <strong>Virdh Ashram</strong> {photo.title}
                  </div>
                  {photo.description && (
                    <p className="post-description">{photo.description}</p>
                  )}
                  {photo.tags.length > 0 && (
                    <div className="post-tags">
                      {photo.tags.map((tag, index) => (
                        <span key={index} className="hashtag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="post-date">
                    {new Date(photo.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          /* Main Feed Container */
          .instagram-feed {
            background-color: #fafafa;
            min-height: 100vh;
            padding-bottom: 2rem;
          }

          /* Feed Header */
          .feed-header {
            background: white;
            border-bottom: 1px solid #dbdbdb;
            position: sticky;
            top: 56px;
            z-index: 100;
            padding: 0 1rem;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .feed-header.hidden {
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
          }

          /* Feed Container */
          .feed-container {
            max-width: 630px;
            margin: 0 auto;
            padding-top: 2rem;
            padding-left: 0;
            padding-right: 0;
          }

          .posts-feed {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          /* Post Card */
          .post-card {
            background: white;
            border: 1px solid #dbdbdb;
            border-radius: 8px;
            margin-bottom: 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }

          /* Post Header */
          .post-header {
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #efefef;
          }

          .post-user {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .user-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            padding: 2px;
          }

          .user-avatar i {
            background: white;
            color: #262626;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .user-info {
            display: flex;
            flex-direction: column;
          }

          .username {
            font-weight: 600;
            font-size: 14px;
            color: #262626;
          }

          .post-location {
            font-size: 12px;
            color: #737373;
          }

          /* Post Image */
          .post-image {
            width: 100%;
            max-height: 600px;
            overflow: hidden;
            background: #000;
            position: relative;
          }

          .post-image img {
            width: 100%;
            height: auto;
            max-height: 600px;
            display: block;
            object-fit: contain;
          }

          /* Post Content */
          .post-content {
            padding: 16px;
            border-top: 1px solid #efefef;
          }

          .post-title {
            font-size: 14px;
            color: #262626;
            margin-bottom: 8px;
            line-height: 1.5;
          }

          .post-title strong {
            font-weight: 600;
          }

          .post-description {
            font-size: 14px;
            color: #262626;
            margin: 8px 0;
            line-height: 1.5;
          }

          .post-tags {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .hashtag {
            color: #0095f6;
            font-size: 14px;
            cursor: pointer;
            font-weight: 400;
          }

          .hashtag:hover {
            text-decoration: underline;
          }

          .post-date {
            font-size: 10px;
            color: #8e8e8e;
            text-transform: uppercase;
            margin-top: 8px;
            letter-spacing: 0.2px;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 5rem 2rem;
            color: #8e8e8e;
          }

          .empty-state i {
            font-size: 5rem;
            opacity: 0.3;
          }

          .empty-state p {
            font-size: 1.1rem;
            margin: 0;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .instagram-feed {
              padding-bottom: 1rem;
            }

            .feed-header {
              top: 56px;
              padding: 0 0.75rem;
            }

            .feed-header .text-center {
              padding: 0.75rem 0 !important;
            }

            .feed-header h2 {
              font-size: 1.25rem;
            }

            .feed-container {
              max-width: 100%;
              padding-top: 0;
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }

            .posts-feed {
              gap: 0.75rem;
            }

            .post-card {
              border-radius: 12px;
              border: 1px solid #dbdbdb;
              margin-bottom: 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .post-header {
              padding: 12px;
            }

            .user-avatar {
              width: 36px;
              height: 36px;
            }

            .user-avatar i {
              width: 32px;
              height: 32px;
              font-size: 1rem;
            }

            .post-image {
              max-height: 500px;
            }

            .post-image img {
              max-height: 500px;
            }

            .post-content {
              padding: 12px;
            }

            .post-title,
            .post-description {
              font-size: 13px;
            }

            .empty-state {
              padding: 3rem 1rem;
            }

            .empty-state i {
              font-size: 3rem;
            }
          }

          /* Tablet Responsive */
          @media (min-width: 769px) and (max-width: 1024px) {
            .feed-container {
              max-width: 500px;
              padding-left: 1rem;
              padding-right: 1rem;
            }

            .post-image {
              max-height: 500px;
            }

            .post-image img {
              max-height: 500px;
            }
          }

          /* Large Desktop */
          @media (min-width: 1440px) {
            .feed-container {
              max-width: 700px;
            }

            .post-image {
              max-height: 700px;
            }

            .post-image img {
              max-height: 700px;
            }
          }

          /* Small Mobile */
          @media (max-width: 480px) {
            .feed-container {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }

            .posts-feed {
              gap: 0.5rem;
            }

            .feed-header {
              padding: 0 0.5rem;
            }

            .feed-header h2 {
              font-size: 1.1rem;
            }

            .feed-header .text-center p {
              font-size: 0.75rem;
            }

            .post-header {
              padding: 10px;
            }

            .user-avatar {
              width: 32px;
              height: 32px;
            }

            .user-avatar i {
              width: 28px;
              height: 28px;
              font-size: 0.9rem;
            }

            .username {
              font-size: 13px;
            }

            .post-location {
              font-size: 11px;
            }

            .post-content {
              padding: 10px;
            }

            .post-title,
            .post-description {
              font-size: 12px;
            }

            .hashtag {
              font-size: 12px;
            }

            .post-date {
              font-size: 9px;
            }
          }

          /* Smooth scrolling */
          .instagram-feed {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </div>
  );
};

export default Gallery;
