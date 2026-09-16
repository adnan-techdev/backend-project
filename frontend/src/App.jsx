import {
  useState,
} from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import { useAuth } from "./context/AuthContext";


function App() {

  const {
    isAuthenticated,
  } = useAuth();

  const [authPage, setAuthPage] =
    useState("login");


  if (isAuthenticated) {
    return <Dashboard />;
  }


  if (authPage === "register") {
    return (
      <Register
        onSwitchToLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }


  return (
    <Login
      onSwitchToRegister={() =>
        setAuthPage("register")
      }
    />
  );
}


export default App;