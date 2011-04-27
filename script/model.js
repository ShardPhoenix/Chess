var BoardSquare, GameModel, King, Rook;
King = (function() {
  function King(color) {
    this.color = color;
  }
  King.prototype.canMoveTo = function(board, currentCoord, targetCoord) {
    var horiz, vert;
    vert = utils.abs(currentCoord.row - targetCoord.row);
    horiz = utils.abs(currentCoord.col - targetCoord.col);
    return (vert === 1 && horiz === 1) || (vert === 0 && horiz === 1) || (vert === 1 && horiz === 0);
  };
  return King;
})();
Rook = (function() {
  function Rook(color) {
    this.color = color;
  }
  Rook.prototype.canMoveTo = function(board, currentCoord, targetCoord) {
    var greater, i, less;
    if (currentCoord.col - targetCoord.col === 0 && currentCoord.row - targetCoord.row !== 0) {
      greater = utils.max(currentCoord.row, targetCoord.row) - 1;
      less = utils.min(currentCoord.row, targetCoord.row) + 1;
      if (greater > less) {
        for (i = less; (less <= greater ? i <= greater : i >= greater); (less <= greater ? i += 1 : i -= 1)) {
          if (board[currentCoord.col][i].piece) {
            return false;
          }
        }
      }
      return true;
    } else if (currentCoord.col - targetCoord.col !== 0 && currentCoord.row - targetCoord.row === 0) {
      greater = utils.max(currentCoord.col, targetCoord.col) - 1;
      less = utils.min(currentCoord.col, targetCoord.col) + 1;
      if (greater > less) {
        for (i = less; (less <= greater ? i <= greater : i >= greater); (less <= greater ? i += 1 : i -= 1)) {
          if (board[i][currentCoord.row].piece) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  };
  return Rook;
})();
BoardSquare = (function() {
  function BoardSquare(color, col, row) {
    this.color = color;
    this.piece = null;
    this.row = row;
    this.col = col;
    this.selected = false;
    this.piece = null;
  }
  return BoardSquare;
})();
GameModel = (function() {
  function GameModel() {
    var col, color, row, rowToAdd, squareNum, _ref, _ref2;
    this.board = [];
    for (col = 0, _ref = constants.BOARD_WIDTH - 1; (0 <= _ref ? col <= _ref : col >= _ref); (0 <= _ref ? col += 1 : col -= 1)) {
      rowToAdd = [];
      for (row = 0, _ref2 = constants.BOARD_HEIGHT - 1; (0 <= _ref2 ? row <= _ref2 : row >= _ref2); (0 <= _ref2 ? row += 1 : row -= 1)) {
        squareNum = (col * (constants.BOARD_WIDTH - 1)) + row;
        color = (squareNum % 2 !== 0 ? colors.BLACK : colors.WHITE);
        rowToAdd.push(new BoardSquare(color, col, row));
      }
      this.board.push(rowToAdd);
    }
    this.board[2][2].piece = new King(colors.WHITE);
    this.board[5][6].piece = new Rook(colors.BLACK);
    this.model = {
      board: this.board
    };
  }
  GameModel.prototype.boardCoord = function(screenCoord) {
    var col, row;
    if (screenCoord.x < (constants.BOARD_LEFT_OFFSET - constants.SQUARE_WIDTH) || screenCoord.x > constants.BOARD_LEFT_OFFSET + constants.SQUARE_WIDTH * constants.BOARD_WIDTH || screenCoord.y < (constants.BOARD_TOP_OFFSET - constants.SQUARE_HEIGHT) || screenCoord.y > constants.BOARD_TOP_OFFSET + constants.SQUARE_HEIGHT * constants.BOARD_HEIGHT) {
      return false;
    } else {
      col = Math.round((screenCoord.x - constants.BOARD_LEFT_OFFSET) / constants.SQUARE_WIDTH + 0.5);
      row = Math.round((screenCoord.y - constants.BOARD_TOP_OFFSET) / constants.SQUARE_HEIGHT + 0.5);
      return {
        col: col,
        row: row
      };
    }
  };
  GameModel.prototype.update = function(dt) {
    var alreadySelected, col, leftClick, newSelected, realCoord, rightClick, square, _i, _j, _len, _len2, _ref;
    rightClick = input.mouseClicked[mouseButtons.RIGHT];
    if ((rightClick != null) && !rightClick.handled) {
      rightClick.handled = true;
    }
    leftClick = input.mouseClicked[mouseButtons.LEFT];
    if ((leftClick != null) && !leftClick.handled) {
      realCoord = this.boardCoord(leftClick.coord);
      if (realCoord) {
        $("#debug").text("Selected col: " + realCoord.col + " row: " + realCoord.row);
        alreadySelected = null;
        _ref = this.model.board;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          col = _ref[_i];
          for (_j = 0, _len2 = col.length; _j < _len2; _j++) {
            square = col[_j];
            if (square.selected) {
              alreadySelected = square;
              square.selected = false;
            }
          }
        }
        newSelected = this.model.board[realCoord.col][realCoord.row];
        newSelected.selected = true;
        if (alreadySelected && alreadySelected.piece) {
          if (alreadySelected.piece.canMoveTo(this.board, {
            col: alreadySelected.col,
            row: alreadySelected.row
          }, {
            col: newSelected.col,
            row: newSelected.row
          })) {
            newSelected.piece = alreadySelected.piece;
            alreadySelected.piece = null;
          }
        }
      }
      return leftClick.handled = true;
    }
  };
  return GameModel;
})();