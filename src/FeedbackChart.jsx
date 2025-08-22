import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const App = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const [ratingCounts, setRatingCounts] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/feedback');
      setFeedbackList(response.data);

      const groupedRatings = [1, 2, 3, 4, 5].map(value => ({
        rating: `${value} ★`,
        count: response.data.filter(item => item.rating === value).length
      }));
      setRatingCounts(groupedRatings);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/feedback', {
        comment,
        rating
      });
      setComment('');
      setRating(1);
      fetchFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Employee Feedback</h1>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={comment}
          placeholder="Enter feedback comment"
          onChange={(e) => setComment(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '10px' }}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          style={{ padding: '0.5rem', width: '60px', marginRight: '10px' }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'green',
            color: 'white',
            border: 'none'
          }}
        >
          Submit
        </button>
      </div>

      <h2>All Feedback</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {feedbackList.map((fb, index) => (
          <li key={index}>
            ⭐ {fb.rating} - {fb.comment}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '2rem' }}>Ratings Overview</h2>
      <BarChart width={600} height={300} data={ratingCounts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default App;