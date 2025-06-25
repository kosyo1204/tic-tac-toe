import { useState } from 'react';

// todo: BoardにSquareの状態を管理させる。現状Squareが管理。
// 子から親へ通知するか、親が子へ問いあわせることもできるが、リファクタが困難になってしまう？
// Reactでは子から親へ状態を上げる（リフトアップ）のが一般的。複数の子に共通のstateを定義することもできる

function Square() {
  // useStateでマスの値を管理（初期値はnull）
  // それぞれ独自のStateを有する
  const [value, setValue] = useState(null);

  // onClickハンドラから呼び出すことでSquareを再レンダリング
  function handleClick() {
    setValue('X');
  }

  return <button
    className="square"
    onClick={handleClick}
  >
    {value}
  </button>
}

// default: このファイルのメイン関数であることを示す
export default function Board() {
  // Boardコンポーネント: 3x3のマスを描画
  return (
    <>
      <div className="board-row">
        {/* 1行目 */}
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        {/* 2行目 */}
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        {/* 3行目 */}
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}