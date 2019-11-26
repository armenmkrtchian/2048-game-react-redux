import React from 'react';
import HeaderBox from './Header/Header';
import GameOver from './GameOver/GameOver';
import Tiles from './Tiles/Tiles';
import { connect } from 'react-redux';
import './GameBoard.css';

const BackgroundGrids = ({size}) => {
  let row = i => {
    return new Array(size).fill().map((_, j) =>
      <div className="grid-cell" key={`grid-cell-${i * size + j}`}></div>
    );
  };
  let grids = new Array(size).fill().map((_, i) => row(i));

  return (
    <div className="grid-container">{grids}</div>
  );
};

const GameBoard = (props) => (
  <div className="game-board">
    <HeaderBox />
    <div className="game-box">
      <BackgroundGrids size={props.size}/>
      <Tiles/>
      {props.gameOver && <GameOver />}
    </div>
    <h3>HOW TO PLAY: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</h3>
    <a href="/" className="view-score-link">view source on Github</a>
  </div>
);

const mapStateToProps = state => {
  return {
    size: state.size,
    gameOver: state.gameStatus === 'over'
  };
};

export default connect(mapStateToProps)(GameBoard);
