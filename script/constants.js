var colors, constants, keys, mouseButtons, players;
constants = {
  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 768,
  MINIMAP_WIDTH: 384,
  MINIMAP_HEIGHT: 288,
  GAME_WIDTH: 7500,
  GAME_HEIGHT: 7500,
  MILLIS_PER_TICK: 20,
  KEY_SCROLL_RATE: 600,
  VIEWPORT_MARGIN: 200,
  BOARD_WIDTH: 8,
  BOARD_HEIGHT: 8,
  SQUARE_WIDTH: 40,
  SQUARE_HEIGHT: 40,
  BOARD_LEFT_OFFSET: 100,
  BOARD_TOP_OFFSET: 100
};
keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  CTRL: 17,
  SHIFT: 16,
  TAB: 9,
  S: 83,
  A: 65,
  D: 68,
  Q: 81,
  W: 87,
  E: 69,
  R: 82
};
players = {
  BLACK: "BLACK",
  WHITE: "WHITE"
};
colors = {
  BLACK: "rgba(0,0,0,1.0)",
  BROWN: "rgba(156,68,14,1.0)",
  LIGHT_BROWN: "rgba(210,190,168,1.0)",
  RED: "rgba(255,0,0,1.0)",
  BLUE: "rgba(0,0,255,1.0)",
  GREEN: "rgba(0,255,0,1.0)",
  WHITE: "rgba(255,255,255,1.0)",
  YELLOW: "rgba(255,255,0,1.0)",
  BACKGROUND: "rgba(255,255,255,1.0)",
  randomColor: function() {
    return "rgba(" + (Math.round(Math.random() * 255)) + "," + (Math.round(Math.random() * 255)) + "," + (Math.round(Math.random() * 255)) + ",1.0)";
  },
  forPlayer: function(player) {
    switch (player) {
      case players.COMPUTER:
        return colors.BLUE;
      case players.HUMAN:
        return colors.RED;
      default:
        return colors.GREEN;
    }
  }
};
mouseButtons = {
  LEFT: 0,
  RIGHT: 2,
  WHEEL: 1
};