	//Grid object
	function Grid() {
		this.cells = [];
		this.rows = [];
		this.columns = [];
		this.boxes = [];
		for (var i = 0; i < 81; i++) {
			this.cells.push(new Cell(i));
		}
		for (var i = 0; i < 9; i++) {
			this.rows.push(new Row(i));
			this.columns.push(new Column(i));
			this.boxes.push(new Box(i));
		}
	}

	//Cell object
	function Cell(num) {
		this.row = Math.floor(num/9);
		this.column = (num+9)%9;
		this.box = 3 * Math.floor(this.row/3) + Math.floor(this.column/3);
	}
	//Row object
	function Row(num) {
		this.cells = [];
		for (var i = 0; i < 9; i++) {
			cells.push(num+i);
		}
	}
	//Column object
	function Column(num) {
		this.cells = [];
		for(var i = 0; i < 9; i++) {
			cells.push(num + 9*i);
		}
	}
	//Box object
	function Box(num) {
		this.cells = [];
		var firstCell = 9 * Math.floor(num/3) + 3 * num%3;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.cells.push(firstCell + 9*i + j);
			} 
		}
	}