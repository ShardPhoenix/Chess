class Renderer
    constructor: ->
        @ctx = document.getElementById("canvas").getContext("2d");
        
        @images = 
            WHITE:
                KING: utils.makeImage("images/white_king.png")
                QUEEN: utils.makeImage("images/white_queen.png")
                ROOK: utils.makeImage("images/white_rook.png")
                BISHOP: utils.makeImage("images/white_bishop.png")
                KNIGHT: utils.makeImage("images/white_knight.png")
                PAWN: utils.makeImage("images/white_pawn.png")
            BLACK:
                KING: utils.makeImage("images/black_king.png")
                QUEEN: utils.makeImage("images/black_queen.png")
                ROOK: utils.makeImage("images/black_rook.png")
                BISHOP: utils.makeImage("images/black_bishop.png")
                KNIGHT: utils.makeImage("images/black_knight.png")
                PAWN: utils.makeImage("images/black_pawn.png")

    drawRect: (x, y, width, height, color) ->
        @ctx.fillStyle = color
        @ctx.fillRect(x, y, width, height)
        
    drawCircle: (x, y, radius, color) ->
        @ctx.strokeStyle = color
        @ctx.fillStyle = color
        @ctx.beginPath()
        @ctx.arc(x, y, radius, 0, Math.PI*2, true)
        @ctx.closePath()
        @ctx.stroke()
        @ctx.fill()
        
    clear: ->
        this.drawRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT, colors.BACKGROUND)
        
    renderBoardSquare: (square) ->
        @ctx.save()      
        xPos = (square.col - 1) * constants.SQUARE_WIDTH + constants.BOARD_LEFT_OFFSET
        yPos = (square.row - 1) * constants.SQUARE_HEIGHT + constants.BOARD_TOP_OFFSET
        this.drawRect(xPos, yPos, constants.SQUARE_WIDTH, constants.SQUARE_HEIGHT, square.color)
        if square.selected
            @ctx.lineWidth = 2
            @ctx.strokeStyle = colors.GREEN
            @ctx.strokeRect(xPos, yPos, constants.SQUARE_WIDTH, constants.SQUARE_HEIGHT)
        if square.piece 
            @ctx.drawImage(@images[square.piece.player][square.piece.appearance], xPos, yPos)
        @ctx.restore()
 
    render: (model) ->
        this.clear()   
        @ctx.save()
        
        for row in model.board
            for square in row
                this.renderBoardSquare(square) 
                
        @ctx.restore()
        
        leftPress = input.mouseHeld[mouseButtons.LEFT]
        if (leftPress)
            @ctx.lineWidth = 1
            @ctx.strokeStyle = colors.GREEN
            @ctx.strokeRect(leftPress.x, leftPress.y, input.mousePos.x - leftPress.x, input.mousePos.y - leftPress.y)