# 概要

- Reactチュートリアルの三目並び作成+いくつかの改善点を実施
- https://ja.react.dev/learn/tutorial-tic-tac-toe#lifting-state-up-again


## 改善点

### 1.現在の着手の部分だけ、ボタンではなく “You are at move #…” というメッセージを表示するようにする。

- 今の手番にボタンでジャンプできる必要はないため、テキストで表示する。

### 2.マス目を全部ハードコードするのではなく、Board を 2 つのループを使ってレンダーするよう書き直す。

- 以下のハードコードをループでレンダーする。board-rowを3回、その中でSquareを3回ずつ回せばよさそう。
     
```
    <div className="board-row">
    {/* 1行目 */}
    <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
    <Square value={squares[1]} onSquareClick={() => handleClick(1)} /> {/* 1行目2列目 */}
    <Square value={squares[2]} onSquareClick={() => handleClick(2)} /> {/* 1行目3列目 */}
    </div>
```

### 3.手順を昇順または降順でソートできるトグルボタンを追加する。

- 順番movesをStateで管理することで実装
- movesをreverseした

### 4.どちらかが勝利したときに、勝利につながった 3 つのマス目をハイライト表示する。引き分けになった場合は、引き分けになったという結果をメッセージに表示する。

- 勝敗判定用の関数に戻り値について、〇×に加えて勝敗が決したlineを追加し、ハッシュで返す
- 勝敗判定用を動かすBoardでlineが帰ってくればSquareにhighlight変数を渡して、ハイライト表示
- ※ハイライトはstateで持たない。他のStateによって管理できるため。
