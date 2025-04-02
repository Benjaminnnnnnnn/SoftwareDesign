"use client";

import { useState } from "react";

async function attemptLogin(u: string, p: string) {}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const infoInputHandler = () => {
    const worked = attemptLogin(username, password);
    localStorage.setItem("loggedIn", "true");
    if (typeof window !== "undefined") {
      window.location.href = "/"; // Hard redirect
    }
  };
  return (
    <div className="login-container relative min-h-screen overflow-hidden">
      <h1 className="font-mono text-8xl font-bold text-black m-0">
        FROGGY FISTICUFFS
      </h1>
      {/* <input
        className="font-serif text-black m-0 justify-center"
        id="name"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder=""
      />
      <input
        className="font-serif text-black m-0 justify-center"
        id="pass"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder=""
      /> */}
      <button className="button button--thin" onClick={infoInputHandler}>
        Start
      </button>
    </div>
  );
}
