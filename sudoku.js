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
      this.sRows.push(new SRow(i, this));
      this.sColumns.push(new SColumn(i, this));
      this.sBoxes.push(new SBox(i, this));
    }
    /*Consolidate groups into a single array for convenience*/
    this.sGroups = [].concat(this.sRows).concat(this.sColumns).concat(this.sBoxes);

    /*In cells, replace index numbers for groups with pointers to the actual group objects.
    (Could not do this in constructor because cells with made before groups.)*/
    this.sCells.forEach(function(thisCell) {
      thisCell.sRow = this.sRows[thisCell.sRow];
      thisCell.sColumn = this.sColumns[thisCell.sColumn];
      thisCell.sBox = this.sBoxes[thisCell.sBox];
    }, this);

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
      this.sRow.removeAllPossibles(value);
      this.sColumn.removeAllPossibles(value);
      this.sBox.removeAllPossibles(value);
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
    If the cell belongs to one of the 4 side boxes, and additional class of
    'square-offset' is added to help distinguish the 3x3 boxes*/
    var makeStr = "<input id='" + num + "' class='square'></input>";
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
    /*This should be called from a child cell that recently solved value.
    Will inform all cells in the group to remove 'value" from their list
    of possible values*/
    this.removeAllPossibles = function(value) {
      this.sCells.forEach(function(thisCell) {
        thisCell.removePossible(value);
      });
    };

    /*Returns an objects with keys 1-9, with each key holding the cells
    that still have that key as a possible value.
    Useful for solving puzzle, specifically finding a cell that can be 
    the only remaining holder a certain possible value*/
    this.getAllPossibles = function() {
      var cellsInGroup = this.sCells;
      var allPossibles = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': []
      };

      //for each possible value in 'allPossibles'...
      _.each(allPossibles, function(possCellsArr, possValue) {
        //for each cell in the group...
        _.each(cellsInGroup, function(thisCell) {
          //if the cell has the current possible value in its known possible values...
          if (_.contains(thisCell.possibles, Number(possValue))) {
            //at the cell to the list of possible cells for that value
            possCellsArr.push(thisCell);
          }
        });
      });

      return allPossibles;
    };

  }

  /*ROWS**********************/
  function SRow(num, parentGrid) {
    var myCells = [];
    for (var i = 0; i < 9; i++) {
      myCells.push(parentGrid.sCells[(num * 9) +i]);
    }
    return new SGroup(myCells);
  }
  /*COLUMNS*******************/
  function SColumn(num, parentGrid) {
    var myCells = [];
    for(var i = 0; i < 9; i++) {
      myCells.push(parentGrid.sCells[num + 9*i]);
    }
    return new SGroup(myCells);
  }
  /*BOXES*********************/
  function SBox(num, parentGrid) {
    var myCells = [];
    var firstCell = 27 * Math.floor(num/3) + 3 * (num%3);
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        myCells.push(parentGrid.sCells[firstCell + 9*i + j]);
      } 
    }
    return new SGroup(myCells);
  }


  /****************************
  Initiallizing
  ****************************/
  grid = new SGrid();

  /****************************
  Actual Solving
  ****************************/
  //a way to track whether a change was made during a solving step
  SGrid.prototype.hasChanged = false;

  /*ONLY ONE POSSIBILITY IN CELL*/
  SGrid.prototype.onlyPossInCell = function() {
    //for each cell in the grid...
    _.each(this.sCells, function(thisCell) {
      //if the cell only knows of one possible value for itself...
      if (thisCell.possibles.length === 1) {
        this.hasChanged = true;
        //become solved at that value.
        thisCell.setValue(thisCell.possibles[0]);
      }
    }, this);
  };

  /*ONLY ONE POSSIBILITY IN GROUP*/
  SGrid.prototype.onlyPossInGroup = function() {
    //for each row, col, or box in the grid...
    _.each(this.sGroups, function(thisGroup) {
      //get a list for each value of all cells in the group that can possibly hold that value.
      var possibles = thisGroup.getAllPossibles();
      //for each possible value...
      for (var value in possibles) {
        //if only one cell can hold that value...
        if (possibles[value].length === 1) {
          this.hasChanged = true;
          //solve that cell at that value
          possibles[value][0].setValue(value);
        }
      }
    }, this);
  };

  /*OVERLAPPING PARENTS FOR ONE TYPE OF POSSIBLE*/
  //tba

  /*TWINS (AND TRIPLETS, ETC...)*/
  //tba

  /*GUESS AND CHECK*/
  //tba

  SGrid.prototype.solve = function() {
    //note the recursive calls, they are there to avoid running the expensive solving methods more than needed
    this.onlyPossInCell();
    if (this.hasChanged) {
      this.hasChanged = false;
      this.updateBoard();
      this.solve();
    }
    else {
      this.onlyPossInGroup();
      if (this.hasChanged) {
        this.hasChanged = false;
        this.updateBoard();
        this.solve();
      }
      else {
        //call the overlapping parents step;
          //call the twins step
           //call the guess and check step
            return;
      }
    }
  };

  /****************************
  Event listeners
  ****************************/
  var reportInput = function(jSquare) {
    if (jSquare.val()) {
      grid.sCells[jSquare.attr("id")].setValue(Number(jSquare.val()));
    }
  };

  $("#solve").click(function() {
    for (var i = 0; i < 81; i++) {
      reportInput($('#'+i));
    }
    grid.solve.bind(grid)();});

});