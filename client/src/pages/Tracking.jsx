// client/src/pages/Tracking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlans } from '../contexts/PlanContext';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { Loader } from '../components/common';
import { FaStar, FaRegStar, FaTrash, FaLink, FaBook, FaCode, FaVideo } from 'react-icons/fa';

const Tracking = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { fetchPlan, trackProgress, toggleStar, removeStudyPlan, loading, error } = usePlans();
  const [plan, setPlan] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [progress, setProgress] = useState(0);
  const updateTimeout = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      const fetchedPlan = await fetchPlan(planId);
      if (fetchedPlan) {
        setPlan(fetchedPlan);
        setCompletedTopics(fetchedPlan.completedTopics || []);
        setProgress(fetchedPlan.progress || 0);
      }
    };
    
    if (planId) {
      loadPlan();
    }
    
    // Clean up timeout on unmount
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [planId, fetchPlan]);

  const handleTopicToggle = async (topicId) => {
    const isCompleted = completedTopics.includes(topicId);
    let updatedCompletedTopics;
    
    if (isCompleted) {
      updatedCompletedTopics = completedTopics.filter(id => id !== topicId);
    } else {
      updatedCompletedTopics = [...completedTopics, topicId];
    }
    
    setCompletedTopics(updatedCompletedTopics);
    
    // Calculate progress
    const totalTopics = Array.isArray(plan.topics) ? plan.topics.length : 0;
    const newProgress = totalTopics ? Math.round((updatedCompletedTopics.length / totalTopics) * 100) : 0;
    setProgress(newProgress);
    
    // Debounced update to Firebase
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
    
    updateTimeout.current = setTimeout(async () => {
      await trackProgress(planId, {
        completedTopics: updatedCompletedTopics,
        progress: newProgress
      });
    }, 2000); // Wait 2 seconds before sending update to Firebase
  };

  const handleToggleStar = async () => {
    if (!plan) return;
    
    const newStarredStatus = !plan.isStarred;
    const success = await toggleStar(planId, newStarredStatus);
    
    if (success) {
      setPlan({ ...plan, isStarred: newStarredStatus });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await removeStudyPlan(planId);
    if (success) {
      setShowDeleteModal(false);
      navigate('/history');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to generate resource links
  const getResourceLink = (resource) => {
    if (resource.url) return resource.url;
    
    // Generate dynamic links based on resource name
    const resourceName = resource.name.toLowerCase();
    
    if (resourceName.includes('python') && resourceName.includes('crash course')) {
      return 'https://nostarch.com/pythoncrashcourse2e';
    } else if (resourceName.includes('python') && resourceName.includes('standard library')) {
      return 'https://docs.python.org/3/library/';
    } else if (resourceName.includes('codecademy')) {
      return 'https://www.codecademy.com/learn/learn-python-3';
    } else if (resourceName.includes('documentation')) {
      return 'https://docs.python.org/3/';
    } else if (resourceName.includes('udemy')) {
      return 'https://www.udemy.com/topic/python/';
    } else if (resourceName.includes('coursera')) {
      return 'https://www.coursera.org/courses?query=python';
    } else if (resourceName.includes('edx')) {
      return 'https://www.edx.org/learn/python';
    } else if (resourceName.includes('book')) {
      return 'https://www.goodreads.com/shelf/show/python-programming';
    }
    
    // Default to a search query
    return `https://www.google.com/search?q=${encodeURIComponent(resource.name)}`;
  };

  // Function to get resource icon
  const getResourceIcon = (resource) => {
    const resourceName = (resource.name || '').toLowerCase();
    
    if (resourceName.includes('book') || resourceName.includes('course')) {
      return <FaBook />;
    } else if (resourceName.includes('documentation') || resourceName.includes('library')) {
      return <FaCode />;
    } else if (resourceName.includes('video') || resourceName.includes('youtube')) {
      return <FaVideo />;
    } else {
      return <FaLink />;
    }
  };

  if (loading && !plan) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-3">Loading your study plan...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Plan not found. The plan may have been deleted or you might not have access to it.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/generate')}>
          Create New Plan
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h2 className="mb-0">{plan.title}</h2>
              <p className="text-muted mt-2 mb-0">{plan.description}</p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-warning" 
                  onClick={handleToggleStar}
                  title={plan.isStarred ? "Unstar plan" : "Star plan"}
                >
                  {plan.isStarred ? <FaStar /> : <FaRegStar />}
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={handleDeleteClick}
                  title="Delete plan"
                >
                  <FaTrash />
                </Button>
                <Badge bg={progress === 100 ? 'success' : 'primary'} className="px-3 py-2 d-flex align-items-center">
                  {progress === 100 ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Progress</Card.Title>
              <div className="text-center my-4">
                <h1 className="display-4">{progress}%</h1>
                <div className="progress">
                  <div 
                    className={`progress-bar progress-bar-striped progress-bar-animated bg-${
                      progress < 30 ? 'danger' : 
                      progress < 70 ? 'warning' : 
                      'success'
                    }`}
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                {plan.params && (
                  <>
                    <p className="mb-2"><strong>Subject:</strong> {plan.params.subject}</p>
                    <p className="mb-2"><strong>Start Date:</strong> {plan.params.startDate}</p>
                    <p className="mb-2"><strong>End Date:</strong> {plan.params.endDate}</p>
                    <p className="mb-2"><strong>Difficulty:</strong> {
                      <Badge bg={
                        plan.params.difficulty === 'beginner' ? 'success' :
                        plan.params.difficulty === 'easy' ? 'info' :
                        plan.params.difficulty === 'medium' ? 'warning' :
                        plan.params.difficulty === 'advanced' ? 'danger' :
                        'dark'
                      }>
                        {plan.params.difficulty}
                      </Badge>
                    }</p>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {plan.resources && plan.resources.length > 0 && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Recommended Resources</Card.Title>
                <ul className="list-group list-group-flush">
                  {plan.resources.map((resource, index) => (
                    <li key={index} className="list-group-item px-0">
                      <h6 className="mb-1 d-flex align-items-center">
                        <span className="me-2">{getResourceIcon(resource)}</span>
                        {resource.name || resource.title}
                      </h6>
                      {resource.description && (
                        <p className="mb-2 small text-muted">{resource.description}</p>
                      )}
                      <a 
                        href={getResourceLink(resource)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaLink className="me-1" /> View Resource
                      </a>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Topics</Card.Title>
              
              {plan.topics && plan.topics.length > 0 ? (
                <div className="topic-list">
                  {plan.topics.map((topic, index) => {
                    const topicName = typeof topic === 'string' ? topic : (topic.title || topic.name || topic);
                    const topicId = `topic-${index}`;
                    const isCompleted = completedTopics.includes(topicId);
                    
                    return (
                      <div key={topicId} className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={topicId}
                          checked={isCompleted}
                          onChange={() => handleTopicToggle(topicId)}
                        />
                        <label 
                          className={`form-check-label ${isCompleted ? 'text-decoration-line-through text-muted' : 'fw-medium'}`} 
                          htmlFor={topicId}
                        >
                          {topicName}
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted">No topics defined for this plan.</p>
              )}
            </Card.Body>
          </Card>
          
          {plan.schedule && plan.schedule.length > 0 && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Study Schedule</Card.Title>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Topics</th>
                        <th>Est. Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.schedule.map((day, index) => (
                        <tr key={index}>
                          <td>{day.date}</td>
                          <td>{Array.isArray(day.topics) ? day.topics.join(', ') : day.topics}</td>
                          <td>{day.hours || day.estimatedHours || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
          
          {plan.milestones && plan.milestones.length > 0 && (
            <Card className="shadow-sm mt-4">
              <Card.Body>
                <Card.Title>Milestones</Card.Title>
                <ul className="list-group list-group-flush">
                  {plan.milestones.map((milestone, index) => {
                    const milestoneName = milestone.name || milestone.title;
                    const milestoneDesc = milestone.description;
                    const milestoneId = `milestone-${index}`;
                    const isCompleted = completedTopics.includes(milestoneId);
                    
                    return (
                      <li key={index} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={milestoneId}
                                checked={isCompleted}
                                onChange={() => handleTopicToggle(milestoneId)}
                              />
                              <label 
                                className={`form-check-label h6 mb-1 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`} 
                                htmlFor={milestoneId}
                              >
                                {milestoneName}
                              </label>
                            </div>
                            {milestoneDesc && (
                              <p className={`mb-0 small ${isCompleted ? 'text-muted' : 'text-dark'}`}>{milestoneDesc}</p>
                            )}
                          </div>
                          {milestone.date && (
                            <Badge bg="secondary">{milestone.date}</Badge>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Study Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{plan.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Tracking;