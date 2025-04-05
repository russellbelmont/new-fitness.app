import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import './WorkoutList.css';

export default function WorkoutList({ workouts, onDelete, onEdit, onReorder }) {
  // State management
  const [filters, setFilters] = useState({
    intensity: 'all',
    dateRange: [null, null],
    exerciseType: ''
  });
  const [deletedWorkouts, setDeletedWorkouts] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sortedWorkouts, setSortedWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  // Sort workouts by date (newest first)
  useEffect(() => {
    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedWorkouts(sorted);
  }, [workouts]);

  // Apply filters
  useEffect(() => {
    const filtered = sortedWorkouts.filter(workout => {
      return (
        (filters.intensity === 'all' || workout.intensity === filters.intensity) &&
        (!filters.exerciseType || workout.exercise.toLowerCase().includes(filters.exerciseType.toLowerCase())) &&
        (!filters.dateRange[0] || new Date(workout.date) >= filters.dateRange[0]) &&
        (!filters.dateRange[1] || new Date(workout.date) <= filters.dateRange[1])
      );
    });
    setFilteredWorkouts(filtered);
    setIsSyncing(false);
  }, [filters, sortedWorkouts]);

  // Sync indicator
  useEffect(() => {
    if (workouts.length) {
      setIsSyncing(true);
    }
  }, [workouts]);

  // Analytics
  const analytics = useMemo(() => ({
    totalMinutes: filteredWorkouts.reduce((sum, w) => sum + w.duration, 0),
    avgIntensity: (filteredWorkouts.reduce((sum, w) => {
      const val = w.intensity === 'high' ? 3 : w.intensity === 'medium' ? 2 : 1;
      return sum + val;
    }, 0) / filteredWorkouts.length || 0).toFixed(1),
    favoriteExercise: filteredWorkouts.length ? [...filteredWorkouts
      .reduce((map, w) => {
        map.set(w.exercise, (map.get(w.exercise) || 0) + 1);
        return map;
      }, new Map())]
      .sort((a, b) => b[1] - a[1])[0][0] : 'None'
  }), [filteredWorkouts]);

  // Handlers
  const handleDelete = useCallback((id) => {
    const workout = workouts.find(w => w.id === id);
    setDeletedWorkouts([...deletedWorkouts, workout]);
    onDelete(id);
    
    toast.custom((t) => (
      <div className="undo-toast">
        Workout deleted
        <button 
          onClick={() => {
            onEdit(workout);
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 });
  }, [workouts, deletedWorkouts, onDelete, onEdit]);

  const exportToCSV = useCallback(() => {
    const headers = ['Exercise', 'Duration', 'Date', 'Intensity'];
    const csvContent = [
      headers.join(','),
      ...filteredWorkouts.map(w => 
        `"${w.exercise.replace(/"/g, '""')}",${w.duration},"${w.date}",${w.intensity}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `workouts_${new Date().toISOString().slice(0,10)}.csv`);
  }, [filteredWorkouts]);

  const onDragEnd = useCallback(({ destination, source }) => {
    if (!destination || destination.index === source.index) return;
    
    const newWorkouts = Array.from(filteredWorkouts);
    const [removed] = newWorkouts.splice(source.index, 1);
    newWorkouts.splice(destination.index, 0, removed);
    
    onReorder(newWorkouts.map(w => w.id));
  }, [filteredWorkouts, onReorder]);

  // Helper functions
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#feca57';
      case 'low': return '#1dd1a1';
      default: return '#dfe6e9';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Row component for virtualized list
  const Row = useCallback(({ index, style, data }) => {
    const workout = data[index];
    return (
      <div style={style}>
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
              onClick={() => handleDelete(workout.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }, [onEdit, handleDelete]);

  return (
    <div className="workout-list">
      <div className="list-header">
        <h2>Your Workouts</h2>
        <div className="header-actions">
          {isSyncing && (
            <div className="sync-indicator">
              <div className="sync-spinner"></div>
              <span>Syncing...</span>
            </div>
          )}
          <button onClick={exportToCSV} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{analytics.totalMinutes} min</span>
          <span className="stat-label">Total Time</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{analytics.avgIntensity}/3</span>
          <span className="stat-label">Avg Intensity</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">
            {analytics.favoriteExercise.length > 12 
              ? `${analytics.favoriteExercise.substring(0, 10)}...` 
              : analytics.favoriteExercise}
          </span>
          <span className="stat-label">Top Exercise</span>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Intensity:</label>
          <select 
            value={filters.intensity}
            onChange={(e) => setFilters({...filters, intensity: e.target.value})}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Exercise:</label>
          <input
            type="text"
            placeholder="Filter by name"
            value={filters.exerciseType}
            onChange={(e) => setFilters({...filters, exerciseType: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={filters.dateRange[0] || ''}
            onChange={(e) => setFilters({...filters, dateRange: [e.target.value, filters.dateRange[1]]})}
          />
        </div>
        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={filters.dateRange[1] || ''}
            onChange={(e) => setFilters({...filters, dateRange: [filters.dateRange[0], e.target.value]})}
          />
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {workouts.length === 0 ? (
            <>
              <div className="empty-illustration">🏋️‍♂️</div>
              <h3>Your workout log is empty</h3>
              <p>Add your first workout to get started!</p>
            </>
          ) : (
            <>
              <div className="empty-illustration">🔍</div>
              <h3>No workouts match your filters</h3>
              <p>Try adjusting your search criteria</p>
              <button 
                className="reset-filters"
                onClick={() => setFilters({
                  intensity: 'all',
                  dateRange: [null, null],
                  exerciseType: ''
                })}
              >
                Reset Filters
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="workouts" mode="virtual" renderClone={(provided, snapshot, rubric) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              style={{
                ...provided.draggableProps.style,
                opacity: snapshot.isDragging ? 0.8 : 1,
                transform: provided.draggableProps.style?.transform,
              }}
            >
              <div className="workout-item dragging">
                {/* Same as workout item but condensed */}
                <div className="workout-header">
                  <h3>{filteredWorkouts[rubric.source.index].exercise}</h3>
                  <div className="intensity-indicator">
                    <span 
                      className="intensity-dot" 
                      style={{ 
                        backgroundColor: getIntensityColor(filteredWorkouts[rubric.source.index].intensity) 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}>
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="workout-items-container"
              >
                <List
                  height={Math.min(600, filteredWorkouts.length * 120)}
                  itemCount={filteredWorkouts.length}
                  itemSize={120}
                  width="100%"
                  itemData={filteredWorkouts}
                >
                  {Row}
                </List>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}