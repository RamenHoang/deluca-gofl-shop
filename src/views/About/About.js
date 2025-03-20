import React, { useState } from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { FaFacebookF } from 'react-icons/fa';
import './About.css';
import contactAPI from '../../apis/contactAPI';

const About = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await contactAPI.sendContactMessage(contactForm);

      if (response.status === 200) {
        setSubmitResult({ success: true, message: 'Tin nhắn đã được gửi thành công!' });
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setSubmitResult({ success: false, message: 'Có lỗi xảy ra khi gửi tin nhắn.' });
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Có lỗi xảy ra khi gửi tin nhắn.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="about-container py-5">
      {/* Main Title and Description */}
      <Row className="mb-5 text-left">
        <Col>
          <h1 className="brand-title mb-4">Giới thiệu về thương hiệu Deluca</h1>
          <p className="brand-description" style={{textAlign: "justify"}}>
            Tại DeLuca Golf, chúng tôi không chỉ đơn thuần cung cấp trang phục và phụ kiện golf
            chúng tôi mang đến phong cách, đẳng cấp và sự tinh tế cho những ai đam mê bộ môn
            thể thao quý tộc này.
          </p>
        </Col>
      </Row>

      {/* Story 1 - Image Left, Text Right */}
      <Row className="my-5 story-section align-items-center">
        <Col md={6}>
          <Image
            src="/deluca-origin.png"
            alt="Hành trình khởi nguồn Deluca Golf"
            fluid
            className="story-image"
          />
        </Col>
        <Col md={6}>
          <div className="story-content">
            <h2 className="story-title mb-3">Hành trình khởi nguồn</h2>
            <p className="story-text" style={{textAlign: "justify"}}>
              DeLuca Golf ra đời từ niềm đam mê mãnh liệt với golf và mong muốn mang đến cho golfer
              những sản phẩm không chỉ đẹp mà còn hỗ trợ tối đa hiệu suất trên sân. Chúng tôi hiểu rằng,
              mỗi cú đánh không chỉ là kỹ thuật mà còn là sự tự tin – và trang phục chính là một phần
              quan trọng giúp golfer thể hiện phong thái chuyên nghiệp của mình.
            </p>
            <p className="story-text" style={{textAlign: "justify"}}>
              DeLuca Golf không chỉ đơn thuần là một thương hiệu – đó là một cộng đồng dành cho những
              người yêu golf, đam mê thử thách và không ngừng nâng cao bản thân. Hãy để DeLuca Golf
              đồng hành cùng bạn trên từng đường bóng, cùng bạn tạo nên những khoảnh khắc tuyệt vời trên sân.
            </p>
          </div>
        </Col>
      </Row>

      {/* Story 2 - Text Left, Image Right */}
      <Row className="my-5 story-section align-items-center">
        <Col md={6}>
          <div className="story-content">
            <h2 className="story-title mb-3">Chất lượng & Đẳng cấp</h2>
            <p className="story-text" style={{textAlign: "justify"}}>
              DeLuca Golf ra đời từ niềm đam mê mãnh liệt với golf và mong muốn mang đến cho golfer
              những sản phẩm không chỉ đẹp mà còn hỗ trợ tối đa hiệu suất trên sân. Chúng tôi hiểu rằng,
              mỗi cú đánh không chỉ là kỹ thuật mà còn là sự tự tin – và trang phục chính là một phần
              quan trọng giúp golfer thể hiện phong thái chuyên nghiệp của mình.
            </p>
            <p className="story-text" style={{textAlign: "justify"}}>
              Mỗi sản phẩm của DeLuca Golf được thiết kế với tiêu chuẩn khắt khe, sử dụng những chất liệu
              cao cấp, thoáng khí và co giãn tốt, giúp golfer luôn cảm thấy thoải mái và tự tin trong từng
              chuyển động. Đội ngũ thiết kế của chúng tôi không ngừng sáng tạo để mang đến những bộ sưu tập
              mang phong cách hiện đại, sang trọng nhưng vẫn giữ được sự tối giản tinh tế.
            </p>
          </div>
        </Col>
        <Col md={6}>
          <Image
            src="/deluca-quality.png"
            alt="Chất lượng và đẳng cấp Deluca Golf"
            fluid
            className="story-image"
          />
        </Col>
      </Row>

      <Row className="my-5 contact-section">
        <Col md={12} className="text-left mb-5">
          <h1 className=""><strong>Liên hệ với chúng tôi</strong></h1>
        </Col>

        <Col md={5}>
          <div className="contact-info">
            <div className="contact-item mb-4">
              <h5 className="contact-label"><strong>Address</strong></h5>
              <p className="contact-content">478 Phố Minh Khai, Hanoi, Quận Hai Bà Trưng, Vietnam</p>
            </div>

            <div className="contact-item mb-4">
              <h5 className="contact-label"><strong>Email</strong></h5>
              <p className="contact-content">mksvietnam@gmail.com</p>
            </div>

            <div className="contact-item mb-4">
              <h5 className="contact-label"><strong>Phone</strong></h5>
              <p className="contact-content">090 329 68 12</p>
            </div>

            <div className="contact-item">
              <h5 className="contact-label"><strong>Social</strong></h5>
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=61556549114607" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaFacebookF />
                </a>
              </div>
            </div>
          </div>
        </Col>

        <Col md={7}>
          <div className="contact-form">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label><strong>Họ và tên</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  style={{ borderRadius: "12px" }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Email</strong></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  style={{ borderRadius: "12px" }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Tin nhắn</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  style={{ borderRadius: "12px" }}
                  required
                />
              </Form.Group>

              {submitResult && (
                <div className={`alert ${submitResult.success ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {submitResult.message}
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                className="submit-btn"
                disabled={submitting}
                style={{
                  borderRadius: "9999px",
                  backgroundColor: "rgb(17, 24, 39)",
                  border: "none",
                  padding: "14px"
                }}
              >
                {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
