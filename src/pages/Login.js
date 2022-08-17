import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { Trans } from 'react-i18next';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("../home");
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          <Trans i18nKey="SignUP.1">Login</Trans>
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          <Trans i18nKey="SignUP.2">Login with Google</Trans>
        </button>
        <div>
        <Trans i18nKey="SignUP.3"><Link to="/reset">Forgot Password</Link></Trans>
          
        </div>
        <div>
        <Trans i18nKey="SignUP.4">Don't have an account? Register now.</Trans><Link to="/register">Register</Link> 
        </div>
      </div>
    </div>
  );
}

export default Login;