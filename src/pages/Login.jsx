import React, { useEffect, Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import {
  isLockedOutUser,
  setCredentials,
  verifyCredentials,
  currentUser,
} from "../utils/Credentials";
import { ROUTES, VALID_USERNAMES, VALID_PASSWORD } from "../utils/Constants";
import InputError, { INPUT_TYPES } from "../components/InputError";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import { BacktraceClient } from "@backtrace-labs/react";

function Login({ simulatedUsername = "", simulatedPassword = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [username, setUsername] = useState(simulatedUsername || "");
  const [password, setPassword] = useState(simulatedPassword || "");
  const [isPrefilled, setIsPrefilled] = useState({
    username: Boolean(simulatedUsername),
    password: Boolean(simulatedPassword),
  });

  useEffect(() => {
    if (location.state?.from) {
      setError(`Redirected from: ${location.state.from.pathname}`);
    }
  }, [location.state]);

  useEffect(() => {
    setUsername(simulatedUsername);
    setPassword(simulatedPassword);
    setIsPrefilled({
      username: Boolean(simulatedUsername),
      password: Boolean(simulatedPassword),
    });
  }, [simulatedUsername, simulatedPassword]);

  const dismissError = () => setError("");

  const handleSubmit = (evt) => {
    evt.preventDefault();

    console.log("Submitting Username:", username);
    console.log("Submitting Password:", password);

    if (!username) return setError("Username is required");
    if (!password) return setError("Password is required");

    if (verifyCredentials(username, password)) {
      setCredentials(username, password);
      console.log("Stored Username after login:", currentUser());

      setTimeout(() => {
        if (isLockedOutUser()) {
          BacktraceClient.instance?.send(new Error("Locked out user tried to log in."), { username });
          return setError("Sorry, this user has been locked out.");
        }
        navigate(ROUTES.INVENTORY);
      }, 100);
    } else {
      BacktraceClient.instance?.send(new Error("Invalid login attempt"), { username });
      return setError("Username and password do not match any user in this service");
    }
  };

  return (
    <div className="login_container">
      <div className="login_logo">Swag Labs</div>

      <div className="login_wrapper" data-test="login-container">
        <div className="login_wrapper-inner">
          <div id="login_button_container" className="form_column">
            <div className="login-box">
              <form onSubmit={handleSubmit}>
                <InputError
                  isError={Boolean(error)}
                  type={INPUT_TYPES.TEXT}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsPrefilled((prev) => ({ ...prev, username: false }));
                  }}
                  onFocus={() => {
                    if (isPrefilled.username) {
                      setUsername("");
                      setIsPrefilled((prev) => ({ ...prev, username: false }));
                    }
                  }}
                  testId="username"
                  placeholder="Username"
                  id="user-name"
                  name="user-name"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
                <InputError
                  isError={Boolean(error)}
                  type={INPUT_TYPES.TEXT} // Changed from password to text
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsPrefilled((prev) => ({ ...prev, password: false }));
                  }}
                  onFocus={() => {
                    if (isPrefilled.password) {
                      setPassword("");
                      setIsPrefilled((prev) => ({ ...prev, password: false }));
                    }
                  }}
                  testId="password"
                  placeholder="Password"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
                <ErrorMessage
                  isError={Boolean(error)}
                  errorMessage={`Epic sadface: ${error}`}
                  onClick={dismissError}
                />
                <SubmitButton customClass="btn_action" testId="login-button" value="Login" />
              </form>
            </div>
          </div>
        </div>
        <div className="login_credentials_wrap" data-test="login-credentials-container">
          <div className="login_credentials_wrap-inner">
            <div className="login_credentials" data-test="login-credentials">
              <h4>Accepted usernames are:</h4>
              {VALID_USERNAMES.map((u, i) => (
                <Fragment key={i}>{u}<br /></Fragment>
              ))}
            </div>
            <div className="login_password" data-test="login-password">
              <h4>Password for all users:</h4>
              {VALID_PASSWORD}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
