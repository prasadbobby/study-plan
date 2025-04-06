// client/src/components/history/PlansList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { usePlans } from '../../contexts/PlanContext';

const PlansList = ({ plans }) => {
  const { toggleStar } = usePlans();

  const handleToggleStar = async (e, planId, isStarred) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleStar(planId, !isStarred);
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No plans found.</p>
      </div>
    );
  }

  return (
    <div className="plans-list">
      {plans.map((plan) => (
        <Card key={plan.id} className="mb-3 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Link to={`/tracking/${plan.id}`} className="text-decoration-none">
                  <h5 className="mb-1">{plan.title}</h5>
                </Link>
                <p className="text-muted small mb-2">{plan.description}</p>
              </div>
              <Button 
                variant="link" 
                className="text-warning p-0 border-0"
                onClick={(e) => handleToggleStar(e, plan.id, plan.isStarred)}
                title={plan.isStarred ? "Unstar plan" : "Star plan"}
              >
                {plan.isStarred ? <FaStar size={20} /> : <FaRegStar size={20} />}
              </Button>
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
              <ProgressBar 
                now={plan.progress || 0} 
                variant={
                  (plan.progress || 0) < 30 ? 'danger' : 
                  (plan.progress || 0) < 70 ? 'warning' : 
                  'success'
                } 
                style={{ height: '8px' }}
              />
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
  );
};

export default PlansList;