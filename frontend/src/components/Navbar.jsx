import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <nav className="navbar">
      <div>
        <h2>Task Manager</h2>
      </div>

      <div className="navbar-right">
        <span>
          Welcome, {user?.name}
        </span>

        <button
          onClick={logout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;