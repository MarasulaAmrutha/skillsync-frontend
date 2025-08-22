import React, { useEffect, useState, useCallback } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import FeedbackCharts from './components/FeedbackCharts';
import FeedbackService from './services/FeedbackService';
import './App.css'; // Your existing CSS

const App = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [ratingCounts, setRatingCounts] = useState([]);
  const [avgOverallRating, setAvgOverallRating] = useState(null);
  const [avgContentRating, setAvgContentRating] = useState(null);
  const [avgTrainerRating, setAvgTrainerRating] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);

  // Filter states for the dashboard
  const [filterCourseId, setFilterCourseId] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterTrainerId, setFilterTrainerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const updateChartData = (data) => {
    const groupedRatings = [1, 2, 3, 4, 5].map(value => ({
      rating: `${value} ★`,
      count: data.filter(item => item.rating === value).length
    }));
    setRatingCounts(groupedRatings);
  };

  const fetchAllFeedback = useCallback(async () => {
    try {
      const res = await FeedbackService.getAllFeedback();
      setFeedbackList(res.data);
      updateChartData(res.data);
    } catch (err) {
      console.error("Error fetching all feedback:", err.response ? err.response.data : err.message);
    }
  }, []);

  const fetchFilteredFeedback = async () => {
    try {
      let res;
      if (filterCourseId) {
        res = await FeedbackService.getFeedbackByCourse(parseInt(filterCourseId));
      } else if (filterUserId) {
        res = await FeedbackService.getFeedbackByUser(parseInt(filterUserId));
      } else if (filterTrainerId) {
        res = await FeedbackService.getFeedbackByTrainer(parseInt(filterTrainerId));
      } else if (filterStatus) {
        res = await FeedbackService.getFeedbackByStatus(filterStatus);
      } else if (filterTag) {
        res = await FeedbackService.getFeedbackByTag(filterTag);
      } else if (startDate && endDate) {
        res = await FeedbackService.getFeedbackByDateRange(new Date(startDate), new Date(endDate));
      } else {
        await fetchAllFeedback(); // Fallback to all if no filters are applied
        return;
      }
      setFeedbackList(res.data);
      updateChartData(res.data); // Update charts with filtered data
    } catch (err) {
      console.error("Error fetching filtered feedback:", err.response ? err.response.data : err.message);
      setFeedbackList([]); // Clear list on error
      updateChartData([]);
    }
  };

  const fetchAnalytics = async (currentCourseId) => {
    if (!currentCourseId) {
      setAvgOverallRating(null);
      setAvgContentRating(null);
      setAvgTrainerRating(null);
      setFeedbackCount(0);
      return;
    }
    try {
      const [overallRes, contentRes, trainerRes, countRes] = await Promise.all([
        FeedbackService.getAverageOverallRatingForCourse(parseInt(currentCourseId)),
        FeedbackService.getAverageContentRelevanceRatingForCourse(parseInt(currentCourseId)),
        FeedbackService.getAverageTrainerEffectivenessRatingForCourse(parseInt(currentCourseId)),
        FeedbackService.getFeedbackCountForCourse(parseInt(currentCourseId))
      ]);
      setAvgOverallRating(overallRes.data);
      setAvgContentRating(contentRes.data);
      setAvgTrainerRating(trainerRes.data);
      setFeedbackCount(countRes.data);
    } catch (err) {
      console.error("Error fetching analytics:", err.response ? err.response.data : err.message);
      setAvgOverallRating(null);
      setAvgContentRating(null);
      setAvgTrainerRating(null);
      setFeedbackCount(0);
    }
  };

  useEffect(() => {
    fetchAllFeedback(); // Initial load of all feedback
  }, [fetchAllFeedback]);

  useEffect(() => {
    fetchAnalytics(filterCourseId); // Re-fetch analytics when course ID changes
  }, [filterCourseId]);

  const handleFilterChange = () => {
    fetchFilteredFeedback();
  };

  const handleClearFilters = () => {
    setFilterCourseId('');
    setFilterUserId('');
    setFilterTrainerId('');
    setFilterStatus('');
    setFilterTag('');
    setStartDate('');
    setEndDate('');
    fetchAllFeedback(); // Reset to all feedback
  };

  const pageContainerStyle = {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f4f7f6',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const sectionTitleStyle = {
    color: '#0056b3',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    justifyContent: 'center'
  };

  const filterInputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minWidth: '150px'
  };

  const filterButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const clearButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div className="App" style={pageContainerStyle}>
      <h1 style={sectionTitleStyle}>SkillSync Feedback Management</h1>

      {/* Participant Interface for Submitting Feedback */}
      <FeedbackForm 
        onSubmitSuccess={fetchAllFeedback} 
        fetchAllFeedback={fetchAllFeedback} 
        fetchAnalytics={fetchAnalytics} 
      />

      {/* Centralized Feedback Dashboard - Filters */}
      <h2 style={sectionTitleStyle}>Feedback Dashboard & Analytics</h2>
      <div style={filterGroupStyle}>
        <input
          type="number"
          placeholder="Filter by Course ID"
          value={filterCourseId}
          onChange={(e) => setFilterCourseId(e.target.value)}
          style={filterInputStyle}
        />
        <input
          type="number"
          placeholder="Filter by User ID"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          style={filterInputStyle}
        />
        <input
          type="number"
          placeholder="Filter by Trainer ID"
          value={filterTrainerId}
          onChange={(e) => setFilterTrainerId(e.target.value)}
          style={filterInputStyle}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={filterInputStyle}
        >
          <option value="">Filter by Status</option>
          <option value="New">New</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Actioned">Actioned</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Filter by Tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={filterInputStyle}
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={filterInputStyle}
          title="Start Date/Time"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={filterInputStyle}
          title="End Date/Time"
        />
        <button onClick={handleFilterChange} style={filterButtonStyle}>Apply Filters</button>
        <button onClick={handleClearFilters} style={clearButtonStyle}>Clear Filters</button>
      </div>

      {/* Feedback Charts and Analytics */}
      <FeedbackCharts
        ratingCounts={ratingCounts}
        avgOverallRating={avgOverallRating}
        avgContentRating={avgContentRating}
        avgTrainerRating={avgTrainerRating}
        feedbackCount={feedbackCount}
        courseId={filterCourseId}
      />

      {/* Feedback List */}
      <h2 style={sectionTitleStyle}>All Feedback Entries</h2>
      <FeedbackList
        feedbackList={feedbackList}
        onUpdateFeedback={handleFilterChange}
        onDeleteFeedback={handleFilterChange}
      />
    </div>
  );
};

export default App;
