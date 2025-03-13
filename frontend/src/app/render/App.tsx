import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Login from "./Login";
import SignUp from "./Signup";
import GameScreen from "./GameScreen";

const App = () => {
  console.log("app");
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="game" element={<GameScreen />} />
    </Routes>
  );
};

export default App;
