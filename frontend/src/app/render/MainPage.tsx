import React from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

const MainPage = () => {
  console.log("main");
  const navigate = useNavigate();

  const beginGameSession = () => {
    navigate("/game");
  };

  return (
    <div>
      <button className="button" onClick={beginGameSession}>
        {" "}
        Play{" "}
      </button>
    </div>
  );
};

export default MainPage;
