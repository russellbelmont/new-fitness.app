import { useState } from 'react';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import './App.css';

export default function App() {
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = (newWorkout) => {
    setWorkouts([...workouts, { ...newWorkout, id: Date.now() }]);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const editWorkout = (id, updatedWorkout) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id ? { ...workout, ...updatedWorkout } : workout
    ));
  };

  const reorderWorkouts = (newOrder) => {
    setWorkouts(newOrder.map(id => workouts.find(w => w.id === id)));
  };

  return (
    <div className="app-container">
      <WorkoutForm onSubmit={addWorkout} />
      <WorkoutList 
        workouts={workouts}
        onDelete={deleteWorkout}
        onEdit={editWorkout}
        onReorder={reorderWorkouts}
      />
    </div>
  );
}