import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ProgressChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressChart({ workouts }) {
  // Process workout data for the chart
  const processData = () => {
    const weeklyData = {};
    
    workouts.forEach(workout => {
      const week = getWeekNumber(new Date(workout.date));
      if (!weeklyData[week]) {
        weeklyData[week] = { duration: 0, count: 0 };
      }
      weeklyData[week].duration += workout.duration;
      weeklyData[week].count += 1;
    });

    const weeks = Object.keys(weeklyData).sort();
    const durations = weeks.map(week => weeklyData[week].duration);
    const counts = weeks.map(week => weeklyData[week].count);

    return {
      labels: weeks.map(week => `Week ${week}`),
      datasets: [
        {
          label: 'Total Workout Duration (minutes)',
          data: durations,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Number of Workouts',
          data: counts,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }
      ]
    };
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Fitness Progress',
      },
    },
  };

  return (
    <div className="progress-chart">
      <Line data={processData()} options={options} />
    </div>
  );
}