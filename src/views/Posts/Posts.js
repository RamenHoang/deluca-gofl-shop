import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Posts.css';
import postsAPI from '../../apis/postsAPI';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsAPI.getAllPosts();
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger">{error}</h3>
      </Container>
    );
  }

  return (
    <Container className="posts-container">
      <Row className="">
        <Col>
          <h1 className="brand-title mb-4">Tin tức</h1>
        </Col>
      </Row>

      <Row>
        {posts.length > 0 ? posts.map((post, index) => (
          <Col md={3} sm={6} className="mb-4" key={post.id || index}>
            <Card className="post-card h-100">
              <Card.Img
                variant="top"
                src={post.featuredImage.url || '/default-post-image.png'}
                alt={post.title}
                className="post-image"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="post-title">{post.title}</Card.Title>
                <Card.Text className="post-excerpt">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: post.content.length > 40
                        ? post.content.substring(0, 40) + '...'
                        : post.content
                    }}
                  ></span>
                </Card.Text>
                <div className="mt-auto">
                  <Link to={`/posts/${post._id}`}>
                    <Button
                      variant="primary"
                      className="read-more-btn"
                      style={{
                        borderRadius: "9999px",
                        backgroundColor: "rgb(17, 24, 39)",
                        border: "none",
                        padding: "8px 16px"
                      }}
                    >
                      Đọc tiếp
                    </Button>
                  </Link>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted post-date">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </Card.Footer>
            </Card>
          </Col>
        )) : (
          <Col>
            <h3 className="text-danger">Không có bài viết nào.</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Posts;
