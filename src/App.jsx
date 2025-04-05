import { useState } from 'react'
import './App.css'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [exercise, setExercise] = useState('')
  const [duration, setDuration] = useState('')

  const addWorkout = () => {
    if (exercise && duration) {
      setWorkouts([...workouts, { exercise, duration }])
      setExercise('')
      setDuration('')
    }
  }

  return (
    <div className="app">
      <h1>🏋️‍♂️ Fitness Tracker</h1>
      
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
        />
        <button onClick={addWorkout}>Add Workout</button>
      </div>

      <div className="workouts-list">
        {workouts.map((workout, index) => (
          <div key={index} className="workout-card">
            <p><strong>{workout.exercise}</strong></p>
            <p>{workout.duration} minutes</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App