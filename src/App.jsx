import { useState } from 'react';

function Square({ value, onSquareClick }) {
  // useStateでマスの値を管理（初期値はnull）
  // それぞれ独自のStateを有する
  // const [value, setValue] = useState(null);

  return <button
    className="square"
    // クリックされたら親から渡された関数を呼び出す
    onClick={onSquareClick}
  >
    {value}
  </button>
}

function Board({ squares, xIsNext, onPlay }) {
  // onClickハンドラから呼び出すことでSquareを再レンダリング
  function handleClick(i) {
    // すでにマスが埋まっている場合は何もしない
    if (squares[i] || calculateWinner(squares)) return;
    // シャローコピー
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`; // 勝者がいる場合のメッセージ
  }
  else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`; // 勝者がいない場合のメッセージ
  }

  // Boardコンポーネント: 3x3のマスを描画
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {/* 1行目 */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} /> {/* 1行目2列目 */}
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} /> {/* 1行目3列目 */}
      </div>
      <div className="board-row">
        {/* 2行目 */}
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} /> {/* 2行目1列目 */}
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} /> {/* 2行目2列目 */}
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} /> {/* 2行目3列目 */}
      </div>
      <div className="board-row">
        {/* 3行目 */}
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} /> {/* 3行目1列目 */}
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} /> {/* 3行目2列目 */}
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} /> {/* 3行目3列目 */}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const xIsNext = history.length % 2 === 0; // 偶数手番はX、奇数手番はO
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
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
    <div className='game'>
      <div className='game-board'>
        <Board squares={currentSquares} xIsNext={xIsNext} onPlay={handlePlay}
        />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // 1行目
    [3, 4, 5], // 2行目
    [6, 7, 8], // 3行目
    [0, 3, 6], // 1列目
    [1, 4, 7], // 2列目
    [2, 5, 8], // 3列目
    [0, 4, 8], // 左上から右下の斜め
    [2, 4, 6] // 左下から右上の斜め
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 勝者を返す
    }
  }
  
  return null; // 勝者がいない場合はnullを返す
}
