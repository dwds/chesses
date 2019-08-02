"use strict";


class Gravity extends BaseChess {

  constructor () {
    super();

    $('#board').css({
      transform: 'rotate(90deg)'
    });

    $('.square-55d63').css({
      transform: 'rotate(-90deg)'
    });


  }

  move(from,to) {
    super.move(from,to);

    let movedPiece = this.game.get(to);

    let files = "abcdefgh";

    // MAKE THE MOVED PIECE FALL

    let toRank = to[1];
    let toFile = to[0];
    let toFileIndex = files.indexOf(toFile);

    let placed = false;
    for (let f = toFileIndex + 1; f < 8; f++) {
      let square = files[f] + toRank;
      let piece = this.game.get(square);

      if (piece !== null) {
        this.game.remove(toFile + toRank);
        this.game.put({ type: movedPiece.type, color: movedPiece.color}, files[f - 1] + toRank);
        placed = true;
        break;
      }
    }

    if (!placed) {
      let square = files[7] + toRank;
      this.game.remove(toFile + toRank);
      this.game.put({ type: movedPiece.type, color: movedPiece.color}, square);
    }

    setTimeout(() => {
      this.board.position(this.game.fen(),true);
      setTimeout(() => { attackSFX.play(); }, this.config.moveSpeed*1.1);
    },this.config.moveSpeed * 1.1);

    // ADJUST TO THE HOLE MADE BY MOVING THE PIECE

    // Go through all piece above the location where the piece moved from and have them fall
    let fromRank = from[1];
    let fromFile = from[0];

    let fromFileIndex = files.indexOf(fromFile);

    let f = fromFileIndex - 1;
    let gravityInterval = setInterval(() => {
      let square = files[f] + fromRank;
      let piece = this.game.get(square);
      if (piece !== null) {
        this.game.remove(square);
        this.game.put({ type: piece.type, color: piece.color}, files[f+1] + fromRank);
        this.board.position(this.game.fen(),true);
        setTimeout(() => { attackSFX.play(); }, this.config.moveSpeed*1.1);
      }
      f--;
      if (f < 0 || piece === null) {
        clearInterval(gravityInterval);

        // THIS IS WHERE WE CAN CHECK FOR A RESULT
      }
    }, this.config.moveSpeed * 1.1);
  }
}
