import { useState } from 'react';

// 1つのマスを表現し、クリックイベントを親に伝える責務を持つ
function Square({ value, onSquareClick }) {
  return <button
    className="square"
    // クリックされたら親から渡された関数を呼び出す
    onClick={onSquareClick}
  >
    {value}
  </button>
}

// 9つのSquareを並べて盤面を描画し、クリック時の処理・勝敗判定・状態表示の責務を持つ
function Board({ squares, xIsNext, onPlay }) {
  // handleClick: 指定マスがクリックされた時の処理（値の更新と親への通知）の責務を持つ
  function handleClick(i) {
    // すでにマスが埋まっている場合は何もしない
    if (squares[i] || calculateWinner(squares)) return;
    // シャローコピー
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
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

  return (
    <>
      <div className="status">{status}</div>
      {/* keyとして使うため、...Array(3)ではなくハードコード */}
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const col_idx = row * 3 + col;
            return (
              <Square
                key={col_idx}
                value={squares[col_idx]}
                onSquareClick={() => handleClick(col_idx)}
              />
            )
          })}
        </div>
      ))}
    </>
  );
}

// ゲーム全体の状態管理（履歴・手番・現在の盤面）と、履歴ジャンプ・盤面描画の責務を持つ
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const xIsNext = history.length % 2 === 0; // 偶数手番はX、奇数手番はO
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // 新しい盤面状態を履歴に追加し、現在の手番を更新する責務を持つ
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 指定した手番に履歴を巻き戻す責務を持つ
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 履歴リストを生成し、現在の手番かどうかで表示を切り替える責務を持つ
  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'Go to game start';
    } else if (move === currentMove) {
      description = `You are at move #${move}`;
    } else {
      description = `Go to move #${move}`;
    }

    return (
      <li key={move}>
        {/* JSX内ではif文を書けない */}
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
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
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 現在の盤面から勝者を判定する責務を持つ
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
