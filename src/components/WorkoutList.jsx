import './WorkoutList.css';

export default function WorkoutList({ workouts, onDelete, onEdit }) {
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#feca57';
      case 'low': return '#1dd1a1';
      default: return '#dfe6e9';
    }
  };

  return (
    <div className="workout-list">
      <h2>Your Workouts</h2>
      {workouts.length === 0 ? (
        <p className="empty-message">No workouts logged yet.</p>
      ) : (
        <ul>
          {workouts.map((workout, index) => (
            <li key={index} className="workout-item">
              <div className="workout-header">
                <h3>{workout.exercise}</h3>
                <span 
                  className="intensity-dot" 
                  style={{ backgroundColor: getIntensityColor(workout.intensity) }}
                  title={workout.intensity}
                ></span>
              </div>
              <div className="workout-details">
                <span>{workout.duration} minutes</span>
                <span>{workout.date}</span>
              </div>
              <div className="workout-actions">
                <button onClick={() => onEdit(index)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => onDelete(index)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}