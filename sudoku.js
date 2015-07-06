	//Sudoku Grid object
	function SGrid() {
		this.sCells = [];
		this.sRows = [];
		this.sColumns = [];
		this.boxes = [];
		for (var i = 0; i < 81; i++) {
			this.sCells.push(new SCell(i));
		}
		for (var i = 0; i < 9; i++) {
			this.sRows.push(new SRow(i));
			this.sColumns.push(new SColumn(i));
			this.boxes.push(new SBox(i));
		}
	}

	//Sudoku Cell object
	function SCell(num) {
		this.sRow = Math.floor(num/9);
		this.sColumn = (num+9)%9;
		this.box = 3 * Math.floor(this.sRow/3) + Math.floor(this.sColumn/3);
	}
	//Sudoku Row object
	function SRow(num) {
		this.sCells = [];
		for (var i = 0; i < 9; i++) {
			sCells.push(num+i);
		}
	}
	//Sudoku sColumn object
	function SColumn(num) {
		this.sCells = [];
		for(var i = 0; i < 9; i++) {
			sCells.push(num + 9*i);
		}
	}
	//Sudoku Box object
	function Box(num) {
		this.sCells = [];
		var firstsCell = 9 * Math.floor(num/3) + 3 * num%3;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.sCells.push(firstsCell + 9*i + j);
			} 
		}
	}