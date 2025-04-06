// client/src/components/tracking/ProgressTracker.jsx
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const ProgressTracker = ({ progress }) => {
  const getVariant = () => {
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  };

  return (
    <div className="progress-tracker">
      <div className="text-center mb-3">
        <h1 className="display-4">{progress}%</h1>
      </div>
      
      <ProgressBar 
        now={progress} 
        variant={getVariant()}
        className="mb-3"
        animated={progress < 100}
        striped={progress < 100}
      />
      
      <div className="text-center mt-3">
        <p className="text-muted">
          {progress < 25 ? "Just getting started" : 
           progress < 50 ? "Making good progress" : 
           progress < 75 ? "More than halfway there" : 
           progress < 100 ? "Almost there!" : 
           "Completed! 🎉"}
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker;