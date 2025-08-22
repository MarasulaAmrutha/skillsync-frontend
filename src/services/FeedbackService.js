import axios from 'axios';

// Ensure this matches your backend's server.port in application.properties
const API_URL = 'https://skillsync-backend-4.onrender.com/api/feedback'; // Updated to match backend port

const FeedbackService = {
  submitFeedback: (feedback) => {
    return axios.post(API_URL, feedback);
  },

  getAllFeedback: () => {
    return axios.get(API_URL);
  },

  getFeedbackById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  deleteFeedback: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },

  updateFeedback: (id, updatedFeedback) => {
    return axios.put(`${API_URL}/${id}`, updatedFeedback);
  },

  // New methods for filtering and analytics
  getFeedbackByCourse: (courseId) => {
    return axios.get(`${API_URL}/course/${courseId}`);
  },

  getFeedbackByUser: (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
  },

  getFeedbackByTrainer: (trainerId) => {
    return axios.get(`${API_URL}/trainer/${trainerId}`);
  },

  getFeedbackByDateRange: (startDate, endDate) => {
    // Dates need to be in ISO format (e.g., "2025-01-01T00:00:00")
    return axios.get(`${API_URL}/date-range`, {
      params: { start: startDate.toISOString(), end: endDate.toISOString() }
    });
  },

  getFeedbackByStatus: (status) => {
    return axios.get(`${API_URL}/status/${status}`);
  },

  getFeedbackByTag: (tag) => {
    return axios.get(`${API_URL}/tag/${tag}`);
  },

  getFeedbackByCourseAndStatus: (courseId, status) => {
    return axios.get(`${API_URL}/course/${courseId}/status/${status}`); // Assuming you add this endpoint later if needed
  },

  updateFeedbackStatus: (id, status) => {
    return axios.patch(`${API_URL}/${id}/status`, { status });
  },

  addTagsToFeedback: (id, tags) => {
    return axios.patch(`${API_URL}/${id}/tags`, { tags });
  },

  getAverageOverallRatingForCourse: (courseId) => {
    return axios.get(`${API_URL}/course/${courseId}/average-rating`);
  },

  getFeedbackCountForCourse: (courseId) => {
    return axios.get(`${API_URL}/course/${courseId}/count`);
  },

  getAverageContentRelevanceRatingForCourse: (courseId) => {
    return axios.get(`${API_URL}/course/${courseId}/average-content-relevance`);
  },

  getAverageTrainerEffectivenessRatingForCourse: (courseId) => {
    return axios.get(`${API_URL}/course/${courseId}/average-trainer-effectiveness`);
  },
};

export default FeedbackService;