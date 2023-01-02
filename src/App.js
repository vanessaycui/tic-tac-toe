import { useState } from 'react';

//a function defining each square. 
function Square({value, onSquareClick}){
  //value stares the value, setValue is a function that changes the value.
  //null is a initial value
  //when parent is calling a square, it will set a value to be shown on the button
  return (
  <button className="square" onClick={onSquareClick}>{value}</button>
  )
}

function calculateWinner(squares){
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i=0; i<lines.length; i++){
    const[a,b,c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function Board({ xIsNext, squares, onPlay }) {
  //if you want to collect data from multiple children, declare shared state in the parent.
  //useState() sets all square state to corresponding element in array
  //pass corresponding array element to the square children. 
  //the value will either be X, O or null
  // const [squares, setSquares] = useState(Array(9).fill(null));
  // const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }


  function handleClick(i){
    //if square is not null, skip 
    if (squares[i] || calculateWinner(squares)){
      return;
    }

    //create a shallow copy of the squares array 
    const nextSquares = squares.slice()

    if (xIsNext){
      nextSquares[i] = "X"

    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)

    //tells react that the state of the component has changed. react re-renders the board the child components
    // setSquares(nextSquares)
    // setXIsNext(!xIsNext)

  }


  //returns a JSX element
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={()=>handleClick(0)} />
        <Square value={squares[1]} onSquareClick={()=>handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={()=>handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={()=>handleClick(4)} />
        <Square value={squares[5]} onSquareClick={()=>handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={()=>handleClick(6)} />
        <Square value={squares[7]} onSquareClick={()=>handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
      </div>
  </>
  
  )
}

//lifing the state up to Game, so now game will be the root.
export default function Game(){
  //an list of arrays that mirrors history of what board looks like
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const[currentMove, setCurrentMove]=useState(0);
  const xIsNext= currentMove % 2 ===0;
  //current will be the last array in the history list.
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  //create buttons for history. when buttons are clicked, jumpTo will be triggered(going back in time )
  function jumpTo(nextMove){
    setCurrentMove(nextMove)
  }
  //squares to thru each element of history; move goes thru each array index
  const moves = history.map((squares, move) => {
    
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* transfer info to the board so the board renders properly. */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
