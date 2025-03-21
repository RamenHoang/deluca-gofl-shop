import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaShoppingBag, FaUser } from 'react-icons/fa';
import './PostDetail.css';
import postsAPI from '../../apis/postsAPI';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await postsAPI.getPostById(id);
        setPost(response.data.post);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="text-center">
        <h3 className="text-danger">{error || 'Không tìm thấy tin tức'}</h3>
        <Link to="/posts">
          <Button
            variant="primary"
            className="mt-3"
            style={{
              borderRadius: "9999px",
              backgroundColor: "rgb(17, 24, 39)",
              border: "none",
              padding: "8px 16px"
            }}
          >
            <FaArrowLeft className="me-2" /> Quay lại
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="post-detail-container">
      <Row className="mb-3">
        <Col>
          <h1 className="post-title">{post.title}</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="d-flex align-items-center justify-content-center">
          <Image
            src={post.featuredImage.url || '/default-post-image.png'}
            alt={post.title}
            fluid
            className="post-main-image"
          />
        </Col>
      </Row>

      <Row className="">
        <Col className="">
          <div className="post-meta">
            <span className="post-date">
              <FaCalendarAlt className="me-1" />&nbsp;{new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="post-date">
              <FaShoppingBag className="me-1" />&nbsp;Danh mục: {post.category.c_name}
            </span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="post-content-container">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
