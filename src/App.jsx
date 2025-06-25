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

// default: このファイルのメイン関数であることを示す
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  // onClickハンドラから呼び出すことでSquareを再レンダリング
  function handleClick(i) {
    // シャローコピー
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  // Boardコンポーネント: 3x3のマスを描画
  return (
    <>
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