import { useState, useEffect } from 'react';
import './ExerciseCard.css';

export default function ExerciseCard({ exerciseId }) {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `https://wger.de/api/v2/exercise/${exerciseId}/?language=2` // English
        );
        if (!response.ok) throw new Error('Exercise not found');
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (loading) return <div className="loading">Loading exercise...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="exercise-card">
      <h2>{exercise.name}</h2>
      <div className="exercise-category">
        Category: {exercise.category.name}
      </div>
      <div className="exercise-muscles">
        Primary Muscles: {exercise.muscles.map(m => m.name).join(', ')}
      </div>
      <div className="exercise-description">
        <h3>Description</h3>
        <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
      </div>
    </div>
  );
}