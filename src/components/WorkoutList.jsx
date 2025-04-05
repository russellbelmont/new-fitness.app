import { useState, useEffect } from 'react';
import './WorkoutList.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkoutList({ workouts, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all');
  const [sortedWorkouts, setSortedWorkouts] = useState([]);

  // Sort workouts by date (newest first)
  useEffect(() => {
    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedWorkouts(sorted);
  }, [workouts]);

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#feca57';
      case 'low': return '#1dd1a1';
      default: return '#dfe6e9';
    }
  };

  const filteredWorkouts = sortedWorkouts.filter(workout => {
    if (filter === 'all') return true;
    return workout.intensity === filter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="workout-list">
      <div className="list-header">
        <h2>Your Workouts</h2>
        <div className="filter-controls">
          <label>Filter by Intensity:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="intensity-filter"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <motion.p 
          className="empty-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {workouts.length === 0 
            ? 'No workouts logged yet. Add your first workout!' 
            : 'No workouts match your filter criteria.'}
        </motion.p>
      ) : (
        <AnimatePresence>
          {filteredWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              className="workout-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="workout-header">
                <h3>{workout.exercise}</h3>
                <div className="intensity-indicator">
                  <span 
                    className="intensity-dot" 
                    style={{ backgroundColor: getIntensityColor(workout.intensity) }}
                  />
                  <span className="intensity-label">{workout.intensity}</span>
                </div>
              </div>
              
              <div className="workout-details">
                <div className="detail-group">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{workout.duration} mins</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(workout.date)}</span>
                </div>
              </div>

              <div className="workout-actions">
                <motion.button
                  className="edit-btn"
                  onClick={() => onEdit(workout.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  className="delete-btn"
                  onClick={() => onDelete(workout.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}