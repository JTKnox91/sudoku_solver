$(document).ready(function() {


  /****************************
  Sudoku Grid Object
  ****************************/
  
  function SGrid() {

    /*GRID ATTRIBUTES*********/

    this.sCells = [];
    this.sRows = [];
    this.sColumns = [];
    this.sBoxes = [];

    /*Construct all cells.*/
    for (var i = 0; i < 81; i++) {
      this.sCells.push(new SCell(i));
    }

    /*Construct all groups*/
    for (var i = 0; i < 9; i++) {
      this.sRows.push(new SRow(i));
      this.sColumns.push(new SColumn(i));
      this.sBoxes.push(new SBox(i));
    }
    /*Consolidate groups into a single array for convenience*/
    this.sGroups = [].concat(this.sRows).concat(this.sColumns).concat(this.sBoxes);

    /*In cells, replace index numbers for groups with pointers to the actual group objects.
    (Could not do this in constructor because cells with made before groups.)*/
    this.sCells.forEach(function(thisCell) {
      thisCell.sRow = grid.sRows[thisCell.sRow];
      thisCell.sColumn = grid.sColumns[thisCell.sColumn];
      thisCell.sBox = grid.sBoxes[thisCell.sBox];
    });

    /*GRID METHODS************/

    /*updateBoard() is effectively a screen refresh. Any cell with a
    solved value will have its value entered on the board.*/
    this.updateBoard = function() {
      this.sCells.forEach(function(cell) {
        $("#" + cell.cellId).val(cell.solved || "");
      });
    };
  }


  /****************************
  Sudoku Cell Object
  ****************************/
  
  function SCell(num) {
    
    /*CELL ATTRIBUTES*********/

    this.cellId = num;
    this.solved = false; //when solved, replaced with a number
    this.sRow = Math.floor(num/9);
    this.sColumn = (num+9)%9;
    this.sBox = 3 * Math.floor(this.sRow/3) + Math.floor(this.sColumn/3);
    this.possibles = [1,2,3,4,5,6,7,8,9];

    /*CELL METHODS************/

    /*alertGroups() informs groups that this cell belongs to that this cell value
    has been solved, and other cells in the groups should remove that value
    from their possibilties.*/
    this.alertGroups = function(value) {
      this.sRow.removeAllPossibles();
      this.sColumn.removeAllPossibles();
      this.sBox.removeAllPossibles();
    };

    /*setValue() gives this cell a solved value, removes all possibles from
    and calls alertGroups to notify parent groups of the solve.*/
    this.setValue = function(value) {
      this.solved = value;
      this.possibles = [];
      this.alertGroups(value);
    };

    /*removePossible() removes a value from this cells array of possible values*/
    this.removePossible = function(value) {
      this.possibles = this.possibles.filter(function(possible) {
        return possible !== value;
      });
    };

    /*HTML CONSTRUCTION*******/

    /*This makes an <input> element with the ID of num, and class of 'square',
    and appends it to the board.
    If the cell belongs to one of the 4 side boxes, andadditional class of
    'square-offset' is added to help distinguish the 3x3 boxes*/
    var makeStr = "<input id='" + num + "' class='square' ></input>";
    $(".board").append(makeStr);
    if (this.sBox%2 !== 0) {
      $("#" + num).addClass("square-offset");
    }
  }


  /****************************
  Sudoku Group Objects
  ****************************/
  function SGroup(cellArr) {
    /*GROUP ATTRIBUTES********/
    this.sCells = cellArr;

    /*GROUP METHODS***********/
    this.removeAllPossibles = function(value) {};

  }

  /*ROWS**********************/
  function SRow(num) {
    var myCells = [];
    for (var i = 0; i < 9; i++) {
      myCells.push(grid.sCells[num+i]);
    }
    return new SGroup(myCells);
  }
  /*COLUMNS*******************/
  function SColumn(num) {
    var myCells = [];
    for(var i = 0; i < 9; i++) {
      myCells.push(grid.sCells[num + 9*i]);
    }
    return new SGroup(myCells);
  }
  /*BOXES*********************/
  function SBox(num) {
    var myCells = [];
    var firstCell = 9 * Math.floor(num/3) + 3 * num%3;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        myCells.push(grid.sCells[firstCell + 9*i + j]);
      } 
    }
    return new SGroup(myCells);
  }


  /****************************
  Initiallizing and Listening
  ****************************/
  var grid = new SGrid();

  /*reportInput() will be called from within the board event listener.
  It calls the the .setValue() of a cell after its corresponding html element
  has be modified.*/
  var reportInput = function() {
    grid.sCells[$(this).attr("id")].setValue($(this).val());
  };
  /*Listen for any input in a sudoku square*/
  $(".board").on("keyup", "input", reportInput);

  /****************************
  Actual Solving
  ****************************/

});