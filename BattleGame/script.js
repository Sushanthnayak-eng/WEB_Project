const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const aiExplanation = document.getElementById("aiExplanation");
const resetBtn = document.getElementById("resetBtn");

const game = new Chess();

let board = Chessboard(boardElement, {
  draggable: true,
  position: "start",
  onDrop: handleMove,
  orientation: "white"
});

function handleMove(source, target) {
  const move = game.move({ from: source, to: target, promotion: "q" });
  if (move === null) return "snapback";
  updateStatus();

  // Delay AI move
  window.setTimeout(makeAIMove, 500);
}

function makeAIMove() {
  const validMoves = game.moves();
  if (game.game_over()) {
    statusElement.textContent = "Game Over!";
    return;
  }

  // Simple "AI" that picks the best move using heuristics
  const move = chooseMove(validMoves);
  game.move(move);
  board.position(game.fen());
  updateStatus();

  // Generate "ChatGPT-style" explanation
  const explanation = generateExplanation(move);
  aiExplanation.innerHTML = `<b>Move:</b> ${move}<br><b>Explanation:</b> ${explanation}`;
}

function chooseMove(moves) {
  // Prioritize central and aggressive moves
  const priorities = ["Q", "R", "B", "N", "e", "d"];
  for (let p of priorities) {
    const move = moves.find(m => m.includes(p));
    if (move) return move;
  }
  // fallback random
  return moves[Math.floor(Math.random() * moves.length)];
}

function generateExplanation(move) {
  if (move.includes("c5"))
    return "The Sicilian Defence aims to unbalance the game and counterattack on the queenside.";
  if (move.includes("e5"))
    return "This move fights for the center and mirrors White’s idea, leading to open tactical positions.";
  if (move.includes("Nf6"))
    return "Develops the knight and attacks White’s center, aiming for quick development.";
  if (move.includes("d5"))
    return "A central break to challenge White’s pawn structure immediately.";
  return "A solid developing move that improves position and prepares future tactics.";
}

function updateStatus() {
  if (game.in_checkmate()) {
    statusElement.textContent = "Checkmate! " + (game.turn() === "w" ? "Black wins!" : "White wins!");
  } else if (game.in_draw()) {
    statusElement.textContent = "Draw!";
  } else {
    const moveColor = game.turn() === "w" ? "White" : "Black";
    statusElement.textContent = `${moveColor} to move`;
  }
}

resetBtn.addEventListener("click", () => {
  game.reset();
  board.start();
  aiExplanation.innerHTML = "";
  statusElement.textContent = "Your move as White...";
});
