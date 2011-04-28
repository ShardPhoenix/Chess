
#owner, controller, should be seperate from color

class Piece
    constructor: (color) ->
        @color = color
        
    canMoveTo: (board, currentCoord, targetCoord) ->
        return false
        
    #checks if an orthogonal path is clear of pieces, not counting the start and end squares
    isOrthogonalPathClear: (board, currentCoord, targetCoord) ->
        currentCol = currentCoord.col
        currentRow = currentCoord.row
        while !(currentCol == targetCoord.col and currentRow == targetCoord.row) #stop at target square
            #don't care about start square
            if !(currentCol == currentCoord.col and currentRow == currentCoord.row) and board[currentCol][currentRow].piece
                return false
            
            if targetCoord.col > currentCoord.col
                currentCol += 1
            else if targetCoord.col < currentCoord.col
                currentCol -= 1
            if targetCoord.row > currentCoord.row
                currentRow += 1
            else if targetCoord.row < currentCoord.row
                currentRow -= 1
                
        return true
    
class King extends Piece
    canMoveTo: (board, currentCoord, targetCoord) ->
        vert = utils.abs(currentCoord.row - targetCoord.row)
        horiz = utils.abs(currentCoord.col - targetCoord.col)
        return (vert == 1 and horiz == 1) or (vert == 0 and horiz == 1) or (vert == 1 and horiz == 0)
        
class Rook extends Piece 
    canMoveTo: (board, currentCoord, targetCoord) ->
        vert = utils.abs(currentCoord.row - targetCoord.row)
        horiz = utils.abs(currentCoord.col - targetCoord.col)
        if (vert == 0 and horiz != 0) or (vert != 0 and horiz == 0)
            return Piece::isOrthogonalPathClear(board, currentCoord, targetCoord)
        else
            return false
        
class Bishop extends Piece
    canMoveTo: (board, currentCoord, targetCoord) ->
        vert = utils.abs(currentCoord.row - targetCoord.row)
        horiz = utils.abs(currentCoord.col - targetCoord.col)
        if vert != horiz or vert == 0 or horiz == 0
            return false                
        return Piece::isOrthogonalPathClear(board, currentCoord, targetCoord)
        
class Queen extends Piece
    canMoveTo: (board, currentCoord, targetCoord) ->
        vert = utils.abs(currentCoord.row - targetCoord.row)
        horiz = utils.abs(currentCoord.col - targetCoord.col)
        if (vert == horiz and (vert != 0 and horiz != 0)) or (horiz == 0 and vert != 0) or (vert == 0 and horiz != 0)
            return Piece::isOrthogonalPathClear(board, currentCoord, targetCoord)
        else
            return false
        
class Knight extends Piece
    canMoveTo: (board, currentCoord, targetCoord) ->
        vert = utils.abs(currentCoord.row - targetCoord.row)
        horiz = utils.abs(currentCoord.col - targetCoord.col)
        return (vert == 2 and horiz == 1) or (vert == 1 and horiz == 2)

class BoardSquare
    constructor: (color, col, row) ->
        @color = color
        @piece = null
        @row = row
        @col = col
        @selected = false  
        @piece = null

#class GameBoard
        
class GameModel
    constructor: ->       
        @board = []
        for col in [0..constants.BOARD_WIDTH-1]
            rowToAdd = []
            for row in [0..constants.BOARD_HEIGHT-1]
                squareNum = (col * (constants.BOARD_WIDTH - 1)) + row
                color = (if squareNum % 2 != 0 then colors.BLACK else colors.WHITE)
                rowToAdd.push(new BoardSquare(color, col, row))
            @board.push(rowToAdd)     
            
        #fill in a few pieces
        @board[2][2].piece = new King(colors.WHITE)
        @board[5][6].piece = new Rook(colors.BLACK)
        @board[4][4].piece = new Knight(colors.WHITE)
        @board[2][6].piece = new Bishop(colors.BLACK)
        @board[3][3].piece = new Queen(colors.WHITE)

        @model =
            board: @board
            
    boardCoord: (screenCoord) ->
        if (screenCoord.x < (constants.BOARD_LEFT_OFFSET - constants.SQUARE_WIDTH) or screenCoord.x > constants.BOARD_LEFT_OFFSET + constants.SQUARE_WIDTH * constants.BOARD_WIDTH or screenCoord.y < (constants.BOARD_TOP_OFFSET - constants.SQUARE_HEIGHT) or screenCoord.y > constants.BOARD_TOP_OFFSET + constants.SQUARE_HEIGHT * constants.BOARD_HEIGHT)
            return false
        else
            col = Math.round((screenCoord.x - constants.BOARD_LEFT_OFFSET) / constants.SQUARE_WIDTH + 0.5)
            row = Math.round((screenCoord.y - constants.BOARD_TOP_OFFSET) / constants.SQUARE_HEIGHT + 0.5)
            return {col: col, row: row}
        
            
    update: (dt) ->   
        #TODO: controls stuff should be in controller, constructing an object with commands in gamespace coords that is passed into here     
            
        rightClick = input.mouseClicked[mouseButtons.RIGHT]
        if rightClick? and !rightClick.handled
            rightClick.handled = true
   
        leftClick = input.mouseClicked[mouseButtons.LEFT]
        if leftClick? and !leftClick.handled
            realCoord = this.boardCoord(leftClick.coord)
            if realCoord
                $("#debug").text("Selected col: " + realCoord.col + " row: " + realCoord.row)
                alreadySelected = null          
                #deselect all then select the one that was clicked
                for col in @model.board
                    for square in col
                        if square.selected
                            alreadySelected = square
                            square.selected = false
                newSelected = @model.board[realCoord.col][realCoord.row]
                newSelected.selected = true
                
                #should be in a GameBoard object that encapsulates the array  
                #handle moves and captures
                if alreadySelected and alreadySelected.piece 
                    if alreadySelected.piece.canMoveTo(@board, {col: alreadySelected.col, row: alreadySelected.row}, {col: newSelected.col, row: newSelected.row})
                        newSelected.piece = alreadySelected.piece
                        alreadySelected.piece = null

                        #todo: handle captures
                    else if !newSelected.piece
                        newSelected.selected = false
                        alreadySelected.selected = true #stay selected if we failed to move and didn't select another piece
            leftClick.handled = true