import React from 'react';
import FeedbackCard from './FeedbackCard'; // Import the new FeedbackCard component

const FeedbackList = ({ feedbackList, onUpdateFeedback, onDeleteFeedback }) => {
  const listContainerStyle = {
    marginTop: '20px',
    padding: '10px',
    borderTop: '1px solid #eee'
  };

  return (
    <div style={listContainerStyle}>
      {Array.isArray(feedbackList) && feedbackList.length > 0 ? (
        feedbackList.map(feedback => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            onUpdate={onUpdateFeedback} // Pass update callback
            onDelete={onDeleteFeedback} // Pass delete callback
          />
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No feedback available yet.</p>
      )}
    </div>
  );
};

export default FeedbackList; 