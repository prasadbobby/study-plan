// client/src/pages/Home.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>Your Study Dashboard</h2>
          <p className="text-muted">Track your progress and manage your study plans</p>
        </Col>
      </Row>
      
      <Card className="shadow-sm text-center py-5">
        <Card.Body>
          <h4>Welcome to Study Plan Generator!</h4>
          <p className="text-muted">
            You don't have any study plans yet. Get started by creating your first plan.
          </p>
          <Link to="/generate">
            <Button variant="primary">Create Your First Plan</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;