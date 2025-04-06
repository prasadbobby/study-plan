// client/src/pages/Generate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlans } from '../contexts/PlanContext';
import { Container, Row, Col, Card, Alert, Button, Modal } from 'react-bootstrap';
import PlanForm from '../components/generate/PlanForm';
import PlanPreview from '../components/generate/PlanPreview';
import { Loader } from '../components/common';
import { FaSave, FaTimes, FaChartLine } from 'react-icons/fa';

const Generate = () => {
  const navigate = useNavigate();
  const { generatePlan, loading, error } = usePlans();
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [planParams, setPlanParams] = useState(null);

  // Load plans on component mount
  useEffect(() => {
    // Clear any previously generated plan when the component mounts
    setGeneratedPlan(null);
    setPlanId(null);
  }, []);

  // Handle form submission to generate a plan
  const handleSubmit = async (formParams) => {
    console.log("Generating plan with params:", formParams);
    setPlanParams(formParams);
    
    try {
      // Generate the plan but don't save to database yet
      const result = await generatePlan(formParams, false);
      
      if (result && result.plan) {
        console.log("Plan generated:", result);
        setGeneratedPlan(result.plan);
        setPlanId(null); // Clear plan ID since we haven't saved it yet
      } else {
        console.error("Failed to generate plan");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    }
  };

  // Save the plan to database
  const handleSavePlan = async () => {
    if (!generatedPlan || !planParams) return;
    
    setIsSaving(true);
    
    try {
      // Now save the plan to database
      const result = await generatePlan(planParams, true, generatedPlan);
      
      if (result && result.planId) {
        setPlanId(result.planId);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to the tracking page for the generated plan
  const handleViewPlan = () => {
    if (planId) {
      navigate(`/tracking/${planId}`);
    }
  };

  // Discard the generated plan
  const handleDiscardPlan = () => {
    // Just clear the local state - no API call needed
    setGeneratedPlan(null);
    setPlanId(null);
    setPlanParams(null);
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h2 className="mb-0">Create Study Plan</h2>
          <p className="text-muted">Generate an AI-powered study plan tailored to your learning needs</p>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!generatedPlan ? (
        <Row>
          <Col lg={5}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Plan Parameters</Card.Title>
                <PlanForm onSubmit={handleSubmit} loading={loading} />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={7}>
            {loading ? (
              <Card className="shadow-sm text-center py-5">
                <Card.Body>
                  <Loader size="lg" />
                  <p className="mt-3">Generating your personalized study plan with AI...</p>
                  <p className="text-muted small">This may take a moment as we create a detailed plan based on your parameters</p>
                </Card.Body>
              </Card>
            ) : (
              <Card className="shadow-sm text-center py-5 bg-light">
                <Card.Body>
                  <i className="bi bi-lightbulb display-1 text-muted mb-3"></i>
                  <h4>Your study plan will appear here</h4>
                  <p className="text-muted mb-4">
                    Fill out the form and click 'Generate Plan' to create your personalized study schedule.
                  </p>
                  <ul className="text-start text-muted small mx-auto" style={{maxWidth: "400px"}}>
                    <li className="mb-2">Define your subject</li>
                    <li className="mb-2">Choose your preferred difficulty level</li>
                    <li className="mb-2">Set your study timeline</li>
                    <li>Get an optimized learning schedule</li>
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      ) : (
        <div className="generated-plan">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Your Generated Study Plan</h3>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={handleDiscardPlan}
                disabled={isSaving}
              >
                <FaTimes className="me-2" /> Discard
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSavePlan}
                disabled={isSaving || planId}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Plan
                  </>
                )}
              </Button>
              {planId && (
                <Button 
                  variant="success" 
                  onClick={handleViewPlan}
                >
                  <FaChartLine className="me-2" /> Track Progress
                </Button>
              )}
            </div>
          </div>
          
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <PlanPreview plan={generatedPlan} fullPreview={true} />
            </Card.Body>
          </Card>
        </div>
      )}
      
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Plan Saved Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="display-1 text-success mb-3">
            <i className="bi bi-check-circle"></i>
          </div>
          <h4>Your study plan has been saved!</h4>
          <p className="text-muted">
            You can now track your progress or view it in your history.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
          <Button 
            variant="primary"
            onClick={handleViewPlan}
          >
            Track Progress
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Generate;