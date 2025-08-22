import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const FeedbackCharts = ({ ratingCounts, avgOverallRating, avgContentRating, avgTrainerRating, feedbackCount, courseId }) => {
  const chartContainerStyle = {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    textAlign: 'center'
  };

  const statItemStyle = {
    display: 'inline-block',
    margin: '0 15px',
    padding: '10px 15px',
    backgroundColor: '#e9f5ff',
    borderRadius: '5px',
    fontWeight: 'bold',
    color: '#0056b3'
  };

  return (
    <div style={chartContainerStyle}>
      <h3>Analytics for Course ID: {courseId || 'N/A'}</h3>
      <div style={{ marginBottom: '20px' }}>
        <span style={statItemStyle}>Total Feedback: {feedbackCount}</span>
        <span style={statItemStyle}>Avg. Overall Rating: {avgOverallRating ? avgOverallRating.toFixed(2) : 'N/A'}</span>
        <span style={statItemStyle}>Avg. Content Rating: {avgContentRating ? avgContentRating.toFixed(2) : 'N/A'}</span>
        <span style={statItemStyle}>Avg. Trainer Rating: {avgTrainerRating ? avgTrainerRating.toFixed(2) : 'N/A'}</span>
      </div>

      <h4 style={{marginTop: '30px', marginBottom: '20px'}}>Overall Rating Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={ratingCounts}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Number of Feedback" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackCharts; 