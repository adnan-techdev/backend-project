import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Register = ({
  onSwitchToLogin,
}) => {
  const {
    register,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register(
        name,
        email,
        password
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        <p>
          Create your Task Manager account
        </p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Register"}
        </button>

        <p>
          Already have an account?{" "}

          <button
            type="button"
            className="link-button"
            onClick={
              onSwitchToLogin
            }
          >
            Login
          </button>
        </p>

      </form>

    </div>
  );
};

export default Register;