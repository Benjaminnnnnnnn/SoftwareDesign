import Shop from "./Shop";
import HexGrid from "./BoardRenderer";

const GameScreen = () => {
  return (
    <div className="screen-container">
      <div className="shop-container">
        <Shop />
      </div>
      <div className="board-container">
        <HexGrid />
      </div>
    </div>
  );
};

export default GameScreen;
