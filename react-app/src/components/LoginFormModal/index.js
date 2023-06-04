import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
        history.push("/")
    }
  };

  return (
    <>
      <div className="login-form-container">
        <h1 id="login-title" className="title-text">Sign in to Banter</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-error-handling">
            <ul className="error">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
          {/* <label className="login-labels">
            Email */}
            <div className="sign-in-inputs">
            <div className="login-input">
              <input
                className="text-input-login"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          {/* </label> */}
          {/* <label className="login-labels"> */}
            {/* Password */}
            <div className="login-input">
              <input
                className="text-input-login"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {/* </label> */}
          <button className="login-button" type="submit">Sign in</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
