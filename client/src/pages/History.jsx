// client/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form, 
  InputGroup,
  Alert
} from 'react-bootstrap';
import { FaSearch, FaTimes, FaPlus, FaStar } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const History = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Fetch plans only once when component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/plans`);
        if (response.data && response.data.data) {
          setPlans(response.data.data);
        } else {
          setPlans([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load your study plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  // Filter plans based on search term and active filter
  const getFilteredPlans = () => {
    let filtered = [...plans];
    
    // Apply category filter
    if (activeFilter === 'starred') {
      filtered = filtered.filter(plan => plan.isStarred);
    } else if (activeFilter === 'tracked') {
      filtered = filtered.filter(plan => plan.isTracked);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        (plan.title && plan.title.toLowerCase().includes(term)) || 
        (plan.description && plan.description.toLowerCase().includes(term)) ||
        (plan.params && plan.params.subject && plan.params.subject.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const filteredPlans = getFilteredPlans();
  const starredCount = plans.filter(plan => plan.isStarred).length;
  const trackedCount = plans.filter(plan => plan.isTracked).length;
  
  // Show loading state
  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your study plans...</p>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  // Show empty state
  if (plans.length === 0) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Study Plan History</h2>
          <Link to="/generate" className="btn btn-primary">
            <FaPlus className="me-2" /> Create New Plan
          </Link>
        </div>
        
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-journal-text display-1 text-muted mb-3"></i>
          <h4>You don't have any study plans yet</h4>
          <p className="text-muted mb-4">Create your first study plan to get started</p>
          <Link to="/generate">
            <Button variant="primary">
              <FaPlus className="me-2" /> Create Study Plan
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  // Main content with plans
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Study Plan History</h2>
        <Link to="/generate" className="btn btn-primary">
          <FaPlus className="me-2" /> Create New Plan
        </Link>
      </div>
      
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search plans by title, description or subject..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={clearSearch}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={4}>
          <div className="btn-group w-100">
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('all')}
            >
              All Plans ({plans.length})
            </Button>
            <Button 
              variant={activeFilter === 'starred' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('starred')}
            >
              Starred ({starredCount})
            </Button>
            <Button 
              variant={activeFilter === 'tracked' ? 'primary' : 'outline-primary'} 
              onClick={() => setActiveFilter('tracked')}
            >
              Tracked ({trackedCount})
            </Button>
          </div>
        </Col>
      </Row>
      
      {filteredPlans.length === 0 ? (
        <Alert variant="info">No plans found matching your search criteria.</Alert>
      ) : (
        <div className="plans-list">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Link to={`/tracking/${plan.id}`} className="text-decoration-none">
                      <h5 className="mb-1">{plan.title}</h5>
                    </Link>
                    <p className="text-muted small mb-2">{plan.description}</p>
                  </div>
                  {plan.isStarred && (
                    <FaStar className="text-warning" size={20} />
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {plan.params && (
                    <>
                      <Badge bg="primary">{plan.params.subject}</Badge>
                      <Badge bg="secondary">{plan.params.difficulty}</Badge>
                      <Badge bg="info">
                        {plan.params.duration} days
                      </Badge>
                    </>
                  )}
                </div>

                <div>
                  <div className="d-flex justify-content-between align-items-center small mb-1">
                    <span>Progress</span>
                    <span>{plan.progress || 0}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar bg-${
                        (plan.progress || 0) < 30 ? 'danger' : 
                        (plan.progress || 0) < 70 ? 'warning' : 
                        'success'
                      }`}
                      role="progressbar"
                      style={{ width: `${plan.progress || 0}%` }}
                      aria-valuenow={plan.progress || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="small text-muted">
                    {plan.params && (
                      <>
                        <span>Start: {plan.params.startDate}</span>
                        <span className="mx-2">|</span>
                        <span>End: {plan.params.endDate}</span>
                      </>
                    )}
                  </div>
                  <Link to={`/tracking/${plan.id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default History;