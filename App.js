import './App.css';
import {useState} from 'react';



function Square({value,onSquareClick, isWinningSquare}) {
  return (<button
    className={`square ${isWinningSquare ? 'winning' : ''}`}
    onClick={onSquareClick}
    >
      {value}</button>);
}

function Undo({squares,onUndoClick}) {
  return (<button
    className="undo"
    onClick={onUndoClick}
    >
      undo</button>);
}

function Restart({squares,onResetClick}) {
  return (<button
    className="restart"
    onClick={onResetClick}
    >
      restart</button>);
}


export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(true);
  const [squaresStack, setSquaresStack] = useState([Array(9).fill(null)]);
  const [undoStatus, setUndoStatus] = useState("");
  const [winningSquares, setWinningSquares] = useState([]);

  function handleClick(i,turn){
    if(calWinner(squares))
      return;
    const nextSquares = squares.slice();
    if(nextSquares[i]==null){
        nextSquares[i] = turn ? "X" : "O";
      setSquares(nextSquares);
      setSquaresStack([...squaresStack,nextSquares])
      setTurn(!turn)
      setUndoStatus("");

      const result = calWinner(nextSquares);
      if (result) {
        setWinningSquares(result.line);
      }
    }
  }

  const winner = calWinner(squares)?.winner;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (turn ? "X" : "O");
  }
  

  function handleUndo() {
    if (squaresStack.length > 2) {
      squaresStack.pop();
      setSquares(squaresStack[squaresStack.length - 1]);
      setTurn(!turn);
      setUndoStatus("The game has moved back one step.");
    }
    else 
      setUndoStatus("No more undos available. Please reset the game.");
      setWinningSquares([]);

}

  function handleReset(squares){
    setSquares(Array(9).fill(null));
    setSquaresStack([Array(9).fill(null)])
    setUndoStatus("The game just restared.");
    setTurn(true);
    setWinningSquares([]);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0, turn)} isWinningSquare={winningSquares.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1, turn)} isWinningSquare={winningSquares.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2, turn)} isWinningSquare={winningSquares.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3, turn)} isWinningSquare={winningSquares.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4, turn)} isWinningSquare={winningSquares.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5, turn)} isWinningSquare={winningSquares.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6, turn)} isWinningSquare={winningSquares.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7, turn)} isWinningSquare={winningSquares.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8, turn)} isWinningSquare={winningSquares.includes(8)} />
      </div>
      <Restart onResetClick={handleReset} />
      <Undo onUndoClick={handleUndo} />
      <div className="undoStatus">{undoStatus}</div>
    </>
  );
}


function calWinner(squares) {
  const straight = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < straight.length; i++) {
    const [a, b, c] = straight[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {  winner: squares[a],
                line: [a,b,c],
      };
    }
  }
  return false;
}
