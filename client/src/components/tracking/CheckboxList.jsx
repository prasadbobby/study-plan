// client/src/components/tracking/CheckboxList.jsx
import React from 'react';
import { Form, Accordion } from 'react-bootstrap';

const CheckboxList = ({ topics, completedTopics, onToggle }) => {
  // Function to check if a topic is completed
  const isCompleted = (topicId) => {
    return completedTopics.includes(topicId);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e, topicId) => {
    onToggle(topicId, e.target.checked);
  };

  return (
    <div className="checkbox-list">
      {topics.map((topic, index) => {
        // For topics that might be strings or objects
        const topicId = topic.id || `topic-${index}`;
        const topicTitle = topic.title || topic.name || topic;
        const subtopics = topic.subtopics || [];
        
        return (
          <div key={topicId} className="topic-item mb-3">
            <Form.Check
              type="checkbox"
              id={topicId}
              label={topicTitle}
              checked={isCompleted(topicId)}
              onChange={(e) => handleCheckboxChange(e, topicId)}
              className="mb-2 fw-bold"
            />
            
            {subtopics.length > 0 && (
              <Accordion className="ms-4 mt-2">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Subtopics ({subtopics.length})</Accordion.Header>
                  <Accordion.Body>
                    {subtopics.map((subtopic, subIndex) => {
                      const subtopicId = subtopic.id || `${topicId}-sub-${subIndex}`;
                      const subtopicTitle = subtopic.title || subtopic.name || subtopic;
                      
                      return (
                        <Form.Check
                          key={subtopicId}
                          type="checkbox"
                          id={subtopicId}
                          label={subtopicTitle}
                          checked={isCompleted(subtopicId)}
                          onChange={(e) => handleCheckboxChange(e, subtopicId)}
                          className="mb-2"
                        />
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckboxList;