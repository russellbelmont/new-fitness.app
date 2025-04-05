import { useState } from 'react';
import Navbar from './components/Navbar';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import ExerciseCard from './components/ExerciseCard';
import ProgressChart from './components/ProgressChart';
import './App.css';

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div className="app">
      <Navbar onTabChange={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <WorkoutForm onSubmit={addWorkout} />
            <WorkoutList 
              workouts={workouts} 
              onDelete={deleteWorkout} 
              onEdit={editWorkout}
            />
          </>
        )}
        
        {activeTab === 'exercises' && (
          <div className="exercise-container">
            <ExerciseCard exerciseId={selectedExerciseId || 345} />
          </div>
        )}
        
        {activeTab === 'progress' && (
          <div className="chart-container">
            <ProgressChart workouts={workouts} />
          </div>
        )}
      </main>
    </div>
  );
}