import React, { Component } from 'react';
import './App.css';

export class GoLTable extends Component
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
				let cell = new Cell(i, k);
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
				cells.push(<CellComponent key={i + '' + k} r={i} c={k}
					onCellClick={this.setCell.bind(this, i, k)}
					cell={cell} />);
			}
			markup.push(<tr key={i}>{cells}</tr>);
		}
		return markup;
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

	updateGrid(e)
	{
		this.setState(function (prev, props)
		{
			let matrix = [];
			for (let i = 0; i < prev.cells.length; i++)
			{
				let row = [];
				for (let k = 0; k < prev.cells[0].length; k++)
				{
					prev.cells[i][k].calcState(prev.cells);
					let newCell = new Cell(i, k);
					newCell.lives = prev.cells[i][k].calcState(prev.cells);
					row.push(newCell);
				}
				matrix.push(row);
			}
			return {
				cells: matrix
			}
		})
	}
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
			<div>
				<input type="text" placeholder="speed" ref={el => this.speedTB = el} />
				<button onClick={this.changeSpeed.bind(this)}>Update Speed</button>
				<button onClick={this.updateTimer.bind(this)}>Timer</button>
				<button ref={el => this.updateButton = el} onClick={this.reset.bind(this)}>Reset</button>
				<table>
					<tbody>
						{this.getTableBody()}
					</tbody>
				</table>
			</div>
		);
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
	className()
	{
		let className = 'cell';
		className += this.props.cell.lives ? ' cellLives' : '';
		className += this.state.isHovered ? ' cellHover' : '';
		return className;
	}
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
