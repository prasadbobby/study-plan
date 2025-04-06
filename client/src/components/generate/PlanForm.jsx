// client/src/components/generate/PlanForm.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const PlanForm = ({ onSubmit, loading }) => {
  const today = new Date().toISOString().split('T')[0];
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 30);
  
  const [formData, setFormData] = useState({
    subject: '',
    duration: 30,
    difficulty: 'medium',
    startDate: today,
    endDate: defaultEndDate.toISOString().split('T')[0]
  });
  
  const [validated, setValidated] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'duration') {
      // Update end date based on duration
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(value));
      
      setFormData({
        ...formData,
        duration: parseInt(value),
        endDate: endDate.toISOString().split('T')[0]
      });
    } else if (name === 'startDate') {
      // Update end date based on start date and duration
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + formData.duration);
      
      setFormData({
        ...formData,
        startDate: value,
        endDate: endDate.toISOString().split('T')[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Send form data without topics - the backend will generate them
    onSubmit(formData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Subject<span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Python Programming, Calculus, Marketing"
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a subject.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Enter a subject and we'll automatically generate appropriate topics
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Difficulty Level</Form.Label>
        <Form.Select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          <option value="beginner">Beginner - New to this subject</option>
          <option value="easy">Easy - Some familiarity</option>
          <option value="medium">Medium - Intermediate knowledge</option>
          <option value="advanced">Advanced - Strong understanding</option>
          <option value="expert">Expert - Looking for mastery</option>
        </Form.Select>
      </Form.Group>
      
      <Row>
        <Col sm={6}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              required
            />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3">
            <Form.Label>Duration (days)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              max="365"
              required
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-4">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={formData.endDate}
          disabled
          className="bg-light"
        />
        <Form.Text className="text-muted">
          End date is calculated based on start date and duration.
        </Form.Text>
      </Form.Group>
      
      <Button 
        type="submit" 
        variant="primary" 
        className="w-100 py-2" 
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Generating Plan...
          </>
        ) : 'Generate Study Plan'}
      </Button>
    </Form>
  );
};

export default PlanForm;