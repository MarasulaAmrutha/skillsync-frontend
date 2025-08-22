import React, { useState } from "react";
import FeedbackService from "../services/FeedbackService";

const FeedbackForm = ({ onSubmitSuccess, fetchAllFeedback, fetchAnalytics }) => {
  // Initial state for all feedback fields (matching backend model)
  const [formData, setFormData] = useState({
    userId: '',
    courseId: '',
    trainerId: '',
    comment: '',
    rating: '3', // Default rating
    overallRating: '3',
    contentRelevanceRating: '3',
    trainerEffectivenessRating: '3',
    wouldRecommend: true,
    isAnonymous: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await FeedbackService.submitFeedback(formData);
      alert('Feedback submitted successfully!');
      setFormData({ // Reset form
        userId: '',
        courseId: '',
        trainerId: '',
        comment: '',
        rating: '3',
        overallRating: '3',
        contentRelevanceRating: '3',
        trainerEffectivenessRating: '3',
        wouldRecommend: true,
        isAnonymous: false,
      });
      // Fetch updated feedback and analytics
      await fetchAllFeedback();
      if (formData.courseId) {
        await fetchAnalytics(formData.courseId);
      }
      onSubmitSuccess(); // Refresh parent component
    } catch (err) {
      console.error("Submit failed:", err.response ? err.response.data : err.message);
      alert(`Failed to submit feedback: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
    }
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const textareaStyle = {
    ...inputStyle,
    gridColumn: '1 / -1', // Span across two columns
    minHeight: '80px',
    resize: 'vertical',
  };

  const selectStyle = {
    ...inputStyle,
    width: '100%',
  };

  const checkboxContainerStyle = {
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const buttonStyle = {
    gridColumn: '1 / -1',
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
      <h3>Submit New Feedback</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle} htmlFor="userId">User ID:</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="e.g., 101"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="courseId">Course ID:</label>
          <input
            type="number"
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            placeholder="e.g., 201"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="trainerId">Trainer ID (Optional):</label>
          <input
            type="number"
            id="trainerId"
            name="trainerId"
            value={formData.trainerId}
            onChange={handleChange}
            placeholder="e.g., 301"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="rating">Overall Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="overallRating">Course Content Rating (1-5):</label>
          <input
            type="number"
            id="overallRating"
            name="overallRating"
            min="1"
            max="5"
            value={formData.overallRating}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="contentRelevanceRating">Relevance Rating (1-5):</label>
          <input
            type="number"
            id="contentRelevanceRating"
            name="contentRelevanceRating"
            min="1"
            max="5"
            value={formData.contentRelevanceRating}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="trainerEffectivenessRating">Trainer Effectiveness (1-5):</label>
          <input
            type="number"
            id="trainerEffectivenessRating"
            name="trainerEffectivenessRating"
            min="1"
            max="5"
            value={formData.trainerEffectivenessRating}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="wouldRecommend">Would you recommend this course?</label>
          <select
            id="wouldRecommend"
            name="wouldRecommend"
            value={formData.wouldRecommend}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div style={checkboxContainerStyle}>
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
          <label htmlFor="isAnonymous">Submit Anonymously?</label>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle} htmlFor="comment">Comments:</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Your detailed feedback..."
            required
            style={textareaStyle}
          ></textarea>
        </div>
        <button type="submit" style={buttonStyle}>Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;