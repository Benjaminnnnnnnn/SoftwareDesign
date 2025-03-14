"use client";

import { useState } from "react";

async function attemptLogin(u: string, p: string) {}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const infoInputHandler = () => {
    const worked = attemptLogin(username, password);
  };
  return (
    <div className="login-container">
      <input
        id="name"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Type here..."
      />
      <input
        id="pass"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type here..."
      />
      <button className="button" onClick={infoInputHandler}>
        Submit
      </button>
    </div>
  );
}
