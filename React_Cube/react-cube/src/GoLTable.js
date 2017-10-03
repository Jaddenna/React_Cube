import React, { Component } from 'react';
import './App.css';

export class CellularMachine extends Component
{
	constructor(props)
	{
		super(props);
		this.rows = props.rows || 20;
		this.cols = props.cols || 20;
		this.state = {
			cells: this.getCells(),
			updateRow: 0,
			updateCol: 0
		};
		this.markup = this.getTableBody();
		this.intervall = null;
		this.defaultSpeed = 500;
		this.speed = this.defaultSpeed;
	}

	getCells() { }

	setCell(r, c) { }

	getCellType(r, c) { }

	getCells()
	{
		let rows = this.rows;
		let cols = this.cols;
		let markup = [];
		for (let i = 0; i < rows; i++)
		{
			let cells = []
			for (let k = 0; k < cols; k++)
			{
				let cell = this.getCellType(i, k);
				cells.push(cell);
			}
			markup.push(cells);
		}
		return markup;
	}

	getTableBody()
	{
		let markup = [];
		for (let i = 0; i < this.state.cells.length; i++)
		{
			let cells = []
			for (let k = 0; k < this.state.cells[0].length; k++)
			{
				let cell = this.state.cells[i][k];
				cells.push(this.cellMarkup(i, k, cell));
			}
			markup.push(<tr key={i}>{cells}</tr>);
		}
		return markup;
	}
	cellMarkup(r, c, cell) { }

	changeSpeed(e)
	{
		this.speed = parseInt(this.speedTB.value);
		if (this.intervall != null)
		{
			//Wenn Timer schon läuft zurücksetzen
			this.updateTimer();
		}
		this.updateTimer();
	}

	updateGrid(e) { }

	updateTimer(e)
	{
		if (this.intervall == null)
		{

			let ref = this;
			this.intervall = setInterval(function ()
			{
				ref.updateGrid(e);
			}, ref.speed)
		}
		else
		{
			clearInterval(this.intervall);
			this.intervall = null;
		}
	}
	reset()
	{
		if (this.intervall != null)
		{
			this.updateTimer();
		}
		this.speed = this.defaultSpeed;
		this.setState({ cells: this.getCells() });

	}

	render()
	{

		return (
			<div className="golContainer">
				<div className="golSettings">
					<input type="text" placeholder="speed" ref={el => this.speedTB = el} />
					<button onClick={this.changeSpeed.bind(this)}>Update Speed</button>
					<button onClick={this.updateTimer.bind(this)}>{this.timer == null ? 'Start' : 'Stop'}</button>
					<button ref={el => this.updateButton = el} onClick={this.reset.bind(this)}>Reset</button>
				</div>
				<table className="golTable">
					<tbody>
						{this.getTableBody()}
					</tbody>
				</table>
			</div>
		);
	}
}

export class GoLTable extends CellularMachine
{
	getCellType(r, c)
	{
		return new GoLCell(r, c);
	}
	setCell(r, c)
	{
		this.setState(function (prev, props)
		{
			prev.cells[r][c].lives = !prev.cells[r][c].lives;
			return {
				cells: prev.cells
			}
		})
	}
	updateGrid(e)
	{
		let ref = this;
		this.setState(function (prev, props)
		{
			let matrix = [];
			for (let i = 0; i < prev.cells.length; i++)
			{
				let row = [];
				for (let k = 0; k < prev.cells[0].length; k++)
				{
					let newCell = new GoLCell(k, i);
					newCell.lives = matrix[k][i].calcState(matrix);
					row.push(newCell);
				}
				matrix.push(row);
			}
			return {
				cells: matrix
			}
		})
	}

	cellMarkup(r, c, cell)
	{
		return <GolCellComponent key={r + '' + c} r={r} c={c}
			onCellClick={this.setCell.bind(this, r, c)}
			cell={cell} />;
	}
}

export class AntTable extends CellularMachine
{
	constructor(props)
	{
		super(props);
		this.currentAntPosition = { r: -1, c: -1 };
		this.currentAntDirection = AntCell.antdirection.top;
	}
	getCellType(r, c)
	{
		return new AntCell(r, c);
	}
	setCell(r, c)
	{
		this.setState(function (prev, props)
		{
			prev.cells[r][c].lives = !prev.cells[r][c].lives;
			this.currentAntPosition = { r: r, c: c };
			this.currentAntDirection = AntCell.antdirection.top;
			return {
				cells: prev.cells
			}
		})
	}
	updateGrid(e)
	{
		let ref = this;
		this.setState(function (prev, props)
		{
			let ap = ref.currentAntPosition;
			let nextPos = prev.cells[ap.r][ap.c].nextCell(ap, prev.cells, ref.currentAntDirection);
			if (nextPos.r > 0 && nextPos.c > 0)
			{
				prev.cells[ap.r][ap.c].lives = prev.cells[ap.r][ap.c].calcState(prev.cells);
				ref.currentAntPosition = { r: nextPos.r, c: nextPos.c };
				ref.currentAntDirection = nextPos.dir;
			}
			else
			{
				ref.updateTimer();
			}

			return {
				cells: prev.cells
			}
		})
	}
	reset()
	{
		super.reset();
		this.currentAntPosition = { r: -1, c: -1 };
		this.currentAntDirection = AntCell.antdirection.top;
	}
	cellMarkup(r, c, cell)
	{
		return <AntCellComponent key={r + '' + c} r={r} c={c}
			onCellClick={this.setCell.bind(this, r, c)}
			cell={cell} />;
	}
}

export class Cell
{
	constructor(r, c)
	{
		this.lives = false;
		this.r = r;
		this.c = c;
	};

	calcState(matrix) { }
}

export class GoLCell extends Cell
{
	calcState(matrix)
	{
		let living = 0;
		let lives = this.lives;
		let r = this.r;
		let c = this.c;
		//Reihe drüber
		if (r > 0)
		{
			living += c > 0 && matrix[r - 1][c - 1].lives ? 1 : 0;
			living += matrix[r - 1][c].lives ? 1 : 0;
			living += c < matrix[0].length - 1 && matrix[r - 1][c + 1].lives ? 1 : 0;
		}
		//eigene Reihe
		living += c > 0 && matrix[r][c - 1].lives ? 1 : 0;
		living += c < matrix[0].length - 1 && matrix[r][c + 1].lives ? 1 : 0;

		//untere Reihe
		if (r < matrix.length - 1)
		{
			living += c > 0 && matrix[r + 1][c - 1].lives ? 1 : 0;
			living += matrix[r + 1][c].lives ? 1 : 0;
			living += c < matrix[0].length - 1 && matrix[r + 1][c + 1].lives ? 1 : 0;
		}

		if (lives)
		{
			if (living < 2 || 3 < living)
			{
				lives = false;
			}
		}
		else
		{
			if (living == 3)
			{
				lives = true;
			}
		}

		return lives;
	}
}

export class AntCell extends Cell
{
	static antdirection = {
		top: 1, right: 2, bottom: 3, left: 4
	}

	calcState(matrix)
	{
		let lives = !this.lives;

		return lives;
	}

	nextCell(currPos, matrix, currDir)
	{
		let aimPos = { r: currPos.r, c: currPos.c, dir: currDir };
		let maxRow = matrix.length - 1;
		let maxCol = matrix[0].length - 1
		if (this.lives)
		{
			switch (currDir)
			{
				case AntCell.antdirection.top:
					aimPos.c = currPos.c > 0 ? currPos.c - 1 : -1;
					aimPos.dir = AntCell.antdirection.left;
					break;
				case AntCell.antdirection.right:
					aimPos.r = currPos.r > 0 ? currPos.r - 1 : -1;
					aimPos.dir = AntCell.antdirection.top;
					break;
				case AntCell.antdirection.bottom:
					aimPos.c = currPos.c < maxCol ? currPos.c + 1 : -1;
					aimPos.dir = AntCell.antdirection.right;
					break;
				case AntCell.antdirection.left:
					aimPos.r = currPos.r < maxRow ? currPos.r + 1 : -1;
					aimPos.dir = AntCell.antdirection.bottom;
					break;
			}
		}
		else
		{
			switch (currDir)
			{
				case AntCell.antdirection.top:
					aimPos.c = currPos.c < maxCol ? currPos.c + 1 : -1;
					aimPos.dir = AntCell.antdirection.right;
					break;
				case AntCell.antdirection.right:
					aimPos.r = currPos.r < maxRow ? currPos.r + 1 : -1;
					aimPos.dir = AntCell.antdirection.bottom;
					break;
				case AntCell.antdirection.bottom:
					aimPos.c = currPos.c > 0 ? currPos.c - 1 : -1;
					aimPos.dir = AntCell.antdirection.left;
					break;
				case AntCell.antdirection.left:
					aimPos.r = currPos.r > 0 ? currPos.r - 1 : -1;
					aimPos.dir = AntCell.antdirection.top;
					break;
			}
		}
		return aimPos;
	}
}

export class CellComponent extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			isHovered: false
		}
	}
	markHover(isHovered, e)
	{
		this.setState({ isHovered: isHovered });
	}
	markClick(e)
	{
		if (this.props.onCellClick)
		{
			this.props.onCellClick();
		}
	}
	className() { }

	render()
	{
		return (
			<td className={this.className()}
				onMouseEnter={this.markHover.bind(this, true)}
				onMouseOut={this.markHover.bind(this, false)}
				onClick={this.markClick.bind(this)}
			></td>
		);
	}
}

export class GolCellComponent extends CellComponent
{
	className()
	{
		let className = 'cell';
		className += this.props.cell.lives ? ' cellLives' : '';
		className += this.state.isHovered ? ' cellHover' : '';
		return className;
	}
}

export class AntCellComponent extends CellComponent
{
	className()
	{
		let className = 'cell';
		className += this.props.cell.lives ? ' cellLives' : '';
		className += this.state.isHovered ? ' cellHover' : '';
		return className;
	}
}
