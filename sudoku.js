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
    for (var i = 0; i < 81; i++) {
      this.sCells.push(new SCell(i));
    }
    for (var i = 0; i < 9; i++) {
      this.sRows.push(new SRow(i));
      this.sColumns.push(new SColumn(i));
      this.sBoxes.push(new SBox(i));
    }
    this.sGroups = [].concat(this.sRows).concat(this.sColumns).concat(this.sBoxes);

    /*GRID METHODS************/
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
    this.alertGroups = function(value) {};

    /*setValue() gives this cell a solved value, removes all possibles from
    and calls alertGroups to notify parent groups of the solve.*/
    this.setValue = function(value) {
      this.solved = value;
      this.possibles = [];
      this.alertGroups(value);
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

  /*ROWS**********************/
  function SRow(num) {
    this.sCells = [];
    for (var i = 0; i < 9; i++) {
      this.sCells.push(grid.sCells[num+i]);
    }
  }
  /*COLUMNS*******************/
  function SColumn(num) {
    this.sCells = [];
    for(var i = 0; i < 9; i++) {
      this.sCells.push(grid.sCells[num + 9*i]);
    }
  }
  /*BOXES*********************/
  function SBox(num) {
    this.sCells = [];
    var firstsCell = 9 * Math.floor(num/3) + 3 * num%3;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this.sCells.push(grid.sCells[firstsCell + 9*i + j]);
      } 
    }
  }
  
  //initiate puzzle board
  var grid = new SGrid();

  //helps translate between element ids and array indexes.
  var reportInput = function() {
    grid.sCells[$(this).attr("id")].setValue($(this).val());
  };
  //listing for user inputs
  $(".board").on("keyup", "input", reportInput);

});