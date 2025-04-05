import { useState } from 'react'
import './App.css'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [exercise, setExercise] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [editingId, setEditingId] = useState(null)

  const addWorkout = () => {
    if (exercise && duration) {
      if (editingId !== null) {
        // Update existing workout
        setWorkouts(workouts.map(w => 
          w.id === editingId ? { ...w, exercise, duration: parseInt(duration), date } : w
        ))
        setEditingId(null)
      } else {
        // Add new workout
        setWorkouts([...workouts, {
          id: Date.now(),
          exercise,
          duration: parseInt(duration),
          date
        }])
      }
      setExercise('')
      setDuration('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  const editWorkout = (workout) => {
    setExercise(workout.exercise)
    setDuration(workout.duration)
    setDate(workout.date)
    setEditingId(workout.id)
  }

  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0)

  return (
    <div className="app">
      <h1>🏋️‍♂️ Fitness Tracker</h1>
      
      <div className="stats">
        <p>Total Workouts: {workouts.length}</p>
        <p>Total Minutes: {totalMinutes}</p>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise (e.g., Squats)"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (mins)"
          min="1"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addWorkout}>
          {editingId ? 'Update Workout' : 'Add Workout'}
        </button>
      </div>

      <div className="workouts-list">
        {workouts.length === 0 ? (
          <p className="empty-state">No workouts yet. Add your first workout!</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <div className="workout-info">
                <p><strong>{workout.exercise}</strong></p>
                <p>{workout.duration} minutes</p>
                <p className="workout-date">{workout.date}</p>
              </div>
              <div className="workout-actions">
                <button 
                  className="edit-btn"
                  onClick={() => editWorkout(workout)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteWorkout(workout.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App