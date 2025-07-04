import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  console.log('Squareレンダリング', value);
  return (
    <button
      className={"square" + (highlight ? " highlight" : "")}
      onClick={onSquareClick}
      // style={highlight ? { color: 'red' } : {}}
      style={highlight ? { backgroundColor: 'orange' } : {}}
    >
      {value}
    </button>
  );
}

// 9つのSquareを並べて盤面を描画し、クリック時の処理・勝敗判定・状態表示の責務を持つ
function Board({ squares, xIsNext, onPlay }) {
  console.log('Boardレンダリング', squares);
  // 勝敗判定は1回だけ
  const { winner, winnerLine } = calculateWinner(squares) || {};
  const isDraw = !winner && !squares.includes(null);
  const status = isDraw
    ? '引き分け'
    : winner
      ? `Winner: ${winner}`
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(i) {
    // すでにマスが埋まっている || 勝敗が決している場合は何もしない
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Square描画を関数化
  function renderSquare(col_idx) {
    const highlight = winnerLine ? winnerLine.includes(col_idx) : false;
    return (
      <Square
        key={col_idx}
        value={squares[col_idx]}
        onSquareClick={() => handleClick(col_idx)}
        highlight={highlight}
      />
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </>
  );
}

// ゲーム全体の状態管理（履歴・手番・現在の盤面）と、履歴ジャンプ・盤面描画の責務を持つ
export default function Game() {
  console.log('Gameレンダリング');
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, toggleSort] = useState(true);
  const xIsNext = currentMove % 2 === 0; // 偶数手番はX、奇数手番はO
  const currentSquares = history[currentMove];

  // 新しい盤面状態を履歴に追加し、現在の手番を更新
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) { setCurrentMove(nextMove); }
  function sortMoves() { toggleSort(prev => !prev); } // !isAscendingでも良いが、推奨される記法を優先

  const moves = (isAscending ? history : [...history].reverse()).map((squares, move) => {
    const realMove = isAscending ? move : history.length - 1 - move
    let description;
    if (realMove === 0) {
      description = 'Go to game start';
    } else if (realMove === currentMove) {
      description = `You are at move #${realMove}`;
    } else {
      description = `Go to move #${realMove}`;
    }

    return (
      <li key={realMove}>
        {/* JSX内ではif文を書けない */}
        {realMove === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(realMove)}>{description}</button>
        )}
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
        <p>手番の履歴</p>
        <button onClick={sortMoves}>
          {isAscending ? '降順にする' : '昇順にする'}
        </button>
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
      return { winner: squares[a], winnerLine: lines[i]};
    }
  }
  return null; // 勝者がいない場合はnullを返す
}
