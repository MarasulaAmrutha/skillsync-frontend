import React, { useState } from 'react';
import FeedbackService from '../services/FeedbackService';

const FeedbackCard = ({ feedback, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState(feedback.comment);
  const [editedRating, setEditedRating] = useState(feedback.rating);
  const [editedTags, setEditedTags] = useState(feedback.tags || '');
  const [editedStatus, setEditedStatus] = useState(feedback.status || 'New');
  const [editedAdminNotes, setEditedAdminNotes] = useState(feedback.adminNotes || '');

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px 20px',
    marginBottom: '15px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px'
  };

  const userIdStyle = {
    fontWeight: 'bold',
    color: '#0056b3'
  };

  const timestampStyle = {
    fontSize: '0.8em',
    color: '#777'
  };

  const commentStyle = {
    marginBottom: '10px',
    lineHeight: '1.5',
    color: '#333'
  };

  const ratingStyle = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#ffc107' // Gold color for stars
  };

  const sectionStyle = {
    marginBottom: '8px',
    padding: '5px 0',
    borderTop: '1px dashed #eee',
    marginTop: '5px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '5px'
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: 'calc(100% - 16px)',
    marginBottom: '5px'
  };

  const selectStyle = {
    ...inputStyle,
    width: '100%',
  };

  const buttonGroupStyle = {
    marginTop: '15px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  };

  const actionButtonStyle = {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  };

  const saveButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#28a745',
    color: 'white',
  };

  const cancelButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#007bff',
    color: 'white',
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...feedback, // Start with existing data
        comment: editedComment,
        rating: editedRating,
        tags: editedTags,
        status: editedStatus,
        adminNotes: editedAdminNotes
        // You might update other specific ratings here if they were part of the edit form
      };
      await FeedbackService.updateFeedback(feedback.id, updatedData);
      onUpdate(); // Refresh the list in parent
      setEditMode(false);
      alert('Feedback updated successfully!');
    } catch (error) {
      console.error('Error updating feedback:', error.response ? error.response.data : error.message);
      alert('Failed to update feedback.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await FeedbackService.deleteFeedback(feedback.id);
        onDelete(); // Refresh the list in parent
        alert('Feedback deleted successfully!');
      } catch (error) {
        console.error('Error deleting feedback:', error.response ? error.response.data : error.message);
        alert('Failed to delete feedback.');
      }
    }
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <span style={userIdStyle}>{feedback.isAnonymous ? 'Anonymous' : `User ID: ${feedback.userId}`}</span>
          {feedback.courseId && <span style={{ marginLeft: '15px', color: '#555' }}>Course ID: {feedback.courseId}</span>}
          {feedback.trainerId && <span style={{ marginLeft: '15px', color: '#555' }}>Trainer ID: {feedback.trainerId}</span>}
        </div>
        <span style={timestampStyle}>
          {new Date(feedback.submissionTimestamp).toLocaleString()}
          {feedback.lastUpdatedTimestamp && ` (Updated: ${new Date(feedback.lastUpdatedTimestamp).toLocaleString()})`}
        </span>
      </div>

      {!editMode ? (
        <>
          <p style={commentStyle}>{feedback.comment}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={ratingStyle}>Overall Rating: {'⭐'.repeat(feedback.rating)} ({feedback.rating}/5)</span>
            <span style={{ backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '5px', fontSize: '0.9em', color: '#495057' }}>
              Status: {feedback.status || 'New'}
            </span>
          </div>

          {(feedback.contentRelevanceRating || feedback.trainerEffectivenessRating || feedback.wouldRecommend !== null) && (
            <div style={sectionStyle}>
              <p><span style={labelStyle}>Content Relevance:</span> {feedback.contentRelevanceRating ? '⭐'.repeat(feedback.contentRelevanceRating) : 'N/A'}</p>
              <p><span style={labelStyle}>Trainer Effectiveness:</span> {feedback.trainerEffectivenessRating ? '⭐'.repeat(feedback.trainerEffectivenessRating) : 'N/A'}</p>
              <p><span style={labelStyle}>Would Recommend:</span> {feedback.wouldRecommend === true ? 'Yes' : (feedback.wouldRecommend === false ? 'No' : 'N/A')}</p>
            </div>
          )}

          {feedback.tags && feedback.tags.length > 0 && (
            <div style={sectionStyle}>
              <span style={labelStyle}>Tags:</span>
              {feedback.tags.split(',').map((tag, index) => (
                <span key={index} style={{
                  display: 'inline-block', backgroundColor: '#d1ecf1', color: '#0c5460',
                  padding: '3px 8px', borderRadius: '12px', fontSize: '0.8em', marginRight: '5px', marginBottom: '5px'
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {feedback.adminNotes && (
            <div style={sectionStyle}>
              <span style={labelStyle}>Admin Notes:</span> {feedback.adminNotes}
            </div>
          )}

          <div style={buttonGroupStyle}>
            <button onClick={() => setEditMode(true)} style={editButtonStyle}>Edit</button>
            <button onClick={handleDelete} style={deleteButtonStyle}>Delete</button>
          </div>
        </>
      ) : (
        <>
          <label style={labelStyle}>Comment:</label>
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            style={{ ...inputStyle, minHeight: '60px' }}
          />

          <label style={labelStyle}>Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={editedRating}
            onChange={(e) => setEditedRating(parseInt(e.target.value))}
            style={inputStyle}
          />

          <label style={labelStyle}>Tags (comma-separated):</label>
          <input
            type="text"
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            placeholder="e.g., bug, ui, suggestion"
            style={inputStyle}
          />

          <label style={labelStyle}>Status:</label>
          <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)} style={selectStyle}>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Actioned">Actioned</option>
            <option value="Closed">Closed</option>
          </select>

          <label style={labelStyle}>Admin Notes:</label>
          <textarea
            value={editedAdminNotes}
            onChange={(e) => setEditedAdminNotes(e.target.value)}
            style={{ ...inputStyle, minHeight: '60px' }}
          />

          <div style={buttonGroupStyle}>
            <button onClick={handleUpdate} style={saveButtonStyle}>Save</button>
            <button onClick={() => setEditMode(false)} style={cancelButtonStyle}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackCard;