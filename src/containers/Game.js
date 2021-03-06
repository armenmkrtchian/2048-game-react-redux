import React, { Component } from 'react';
import GameBoard from '../components/GameBoard/GameBoard';
import {Swipeable} from 'react-swipeable';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

class Game extends Component {
  
  componentDidMount () {
    this.props.startNewGame();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSwiped = this.handleSwiped.bind(this);
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress (event) {
    let { key } = event;

    if (!this.props.gameStarted) return;
    let match = key.toLowerCase().match(/arrow(up|right|down|left)/);
    if (match) {
      this.move(match[1]);
      event.preventDefault();
    }
  }

  handleSwiped (dir) {
    if (!this.props.gameStarted) return;
    this.move(dir);
    return false;
  }

  move (dir) {
    if (this.isMoving) return;
    let {movingPromise, score} = this.props.moveChessBoard(dir);
    if (movingPromise) {
      this.isMoving = true;
      movingPromise.then(() => {
        score && this.props.addScore(score);
        this.isMoving = false;
        this.props.generateNewTile();
        this.checkGameStatus();
      });
    }
  }

  isMovable () {
    let movable = false;
    let { tiles, size } = this.props;
    const deepEach = (arr, fn) => arr.forEach(row => row.forEach(fn));

    deepEach(tiles, tile => {
      if (movable) return; 
      if (!tile) {
        movable = true;
        return;
      }
      let {row: i, col: j} = tile;
      if (i < size - 1) {
        let bottomTile = tiles[i+1][j];
        if (bottomTile && bottomTile.number === tile.number) {
          movable = true;
          return;
        }
      }

      if (j < size - 1) {
        let rightTile = tiles[i][j+1];
        if (rightTile && rightTile.number === tile.number) {
          movable = true;
          return;
        }
      }
    });
    return movable;
  }

  checkGameStatus () {
    if (!this.isMovable()) {
      this.props.updateBestScore(this.props.score);
      this.props.setGameOver();
    }
  }

  render () {
    let swipeOptions = ['up', 'right', 'down', 'left'].reduce((options, dir) => {
      let propName = `on-swiped-${dir}`.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
      //console.log(propName);
      options[propName] = this.handleSwiped.bind(this, dir);
      return options;
    }, {});

    return  <Swipeable {...swipeOptions} preventDefaultTouchmoveEvent>
      <GameBoard />
    </Swipeable>;
  }
}

const mapStateToProps = (state) => {
  return {
    size: state.size,
    tiles: state.tiles,
    score: state.scores.score,
    gameStarted: state.gameStatus === 'playing'
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startNewGame: () => dispatch(actions.startNewGame()),
    setGameOver: () => dispatch(actions.setGameOver()),
    generateNewTile: () => dispatch(actions.generateNewTile()),
    moveChessBoard: dir => dispatch(actions.moveChessBoard(dir)),
    addScore: score => dispatch(actions.addScore(score)),
    updateBestScore: score => dispatch(actions.updateBestScore(score))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
