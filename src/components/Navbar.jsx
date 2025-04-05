import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FitTrack
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/workouts" className="nav-links">
              Workouts
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exercises" className="nav-links">
              Exercises
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/progress" className="nav-links">
              Progress
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
