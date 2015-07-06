$(document).ready(function() {
  //Sudoku Grid object
  function SGrid() {
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
  }

  //Sudoku Cell object
  function SCell(num) {
    //attributes
    this.solved = false; //when solved, replaced with a number
    this.sRow = Math.floor(num/9);
    this.sColumn = (num+9)%9;
    this.sBox = 3 * Math.floor(this.sRow/3) + Math.floor(this.sColumn/3);
    this.possibles = [1,2,3,4,5,6,7,8,9];

    //methods
    this.alertGroups = function(value) {};
    this.setValue = function(value) {
      this.solved = value;
      this.possibles = [];
      this.alertGroups(value);
    };

    //html instructions
    var makeStr = "";
    if (this.sBox%2 !== 0) {
      makeStr = "<input id='" + num + "' class='square square-offset' ></input>";
    }
    else {
      makeStr = "<input id='" + num + "' class='square' ></input>";
    }
    $(".board").append(makeStr);

  }
  //Sudoku Row object
  function SRow(num) {
    this.sCells = [];
    for (var i = 0; i < 9; i++) {
      this.sCells.push(num+i);
    }
  }
  //Sudoku sColumn object
  function SColumn(num) {
    this.sCells = [];
    for(var i = 0; i < 9; i++) {
      this.sCells.push(num + 9*i);
    }
  }
  //Sudoku Box object
  function SBox(num) {
    this.sCells = [];
    var firstsCell = 9 * Math.floor(num/3) + 3 * num%3;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this.sCells.push(firstsCell + 9*i + j);
      } 
    }
  }
  
  //initiate puzzle board
  var grid = new SGrid();

  //helps translate between element ids and array indexes.
  var reportInput = function() {
    grid.sCells[$(this).attr("id")].setValue($(this).val());
  };
  $(".board").on("keyup", "input", reportInput);

});