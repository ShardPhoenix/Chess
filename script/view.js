var Renderer;
Renderer = (function() {
  function Renderer() {
    this.ctx = document.getElementById("canvas").getContext("2d");
  }
  Renderer.prototype.drawRect = function(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    return this.ctx.fillRect(x, y, width, height);
  };
  Renderer.prototype.drawCircle = function(x, y, radius, color) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.stroke();
    return this.ctx.fill();
  };
  Renderer.prototype.clear = function() {
    return this.drawRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT, colors.BACKGROUND);
  };
  Renderer.prototype.renderBoardSquare = function(square) {
    var xPos, yPos;
    this.ctx.save();
    xPos = (square.col - 1) * constants.SQUARE_WIDTH + constants.BOARD_LEFT_OFFSET;
    yPos = (square.row - 1) * constants.SQUARE_HEIGHT + constants.BOARD_TOP_OFFSET;
    this.drawRect(xPos, yPos, constants.SQUARE_WIDTH, constants.SQUARE_HEIGHT, square.color);
    if (square.selected) {
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = colors.GREEN;
      this.ctx.strokeRect(xPos, yPos, constants.SQUARE_WIDTH, constants.SQUARE_HEIGHT);
    }
    if (square.piece) {
      this.drawRect(xPos + constants.SQUARE_WIDTH / 4, yPos + constants.SQUARE_HEIGHT / 4, constants.SQUARE_WIDTH / 2, constants.SQUARE_HEIGHT / 2, colors.RED);
    }
    return this.ctx.restore();
  };
  Renderer.prototype.render = function(model) {
    var leftPress, row, square, _i, _j, _len, _len2, _ref;
    this.clear();
    this.ctx.save();
    _ref = model.board;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
        square = row[_j];
        this.renderBoardSquare(square);
      }
    }
    this.ctx.restore();
    leftPress = input.mouseHeld[mouseButtons.LEFT];
    if (leftPress) {
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = colors.GREEN;
      return this.ctx.strokeRect(leftPress.x, leftPress.y, input.mousePos.x - leftPress.x, input.mousePos.y - leftPress.y);
    }
  };
  return Renderer;
})();