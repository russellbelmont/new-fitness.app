import { useState } from 'react';
import './WorkoutForm.css';

export default function WorkoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    exercise: '',
    duration: 30,
    date: new Date().toISOString().slice(0, 10),
    intensity: 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      duration: parseInt(formData.duration)
    });
    setFormData({
      exercise: '',
      duration: 30,
      date: new Date().toISOString().slice(0, 10),
      intensity: 'medium'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <div className="form-group">
        <label>Exercise</label>
        <input
          type="text"
          name="exercise"
          value={formData.exercise}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Duration (minutes)</label>
        <input
          type="number"
          name="duration"
          min="1"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Intensity</label>
        <select
          name="intensity"
          value={formData.intensity}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">
        Log Workout
      </button>
    </form>
  );
}