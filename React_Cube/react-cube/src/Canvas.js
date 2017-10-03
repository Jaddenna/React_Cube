import React, { Component } from 'react';
import './App.css';

export class Canvas extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			ctx: null
		};
		this.Init();
		this.updateCanvas = this.updateCanvas.bind(this);
	}

	Init() { }

	componentDidMount()
	{
		this.state.ctx = this.canEl.getContext('2d');

		this.canEl.width = this.props.width || 800;
		this.canEl.height = this.props.height || 600;

		window.requestAnimationFrame(this.updateCanvas);
		window.addEventListener("resize", this.updateCanvas);
	}
	componentWillUnmount()
	{
		window.removeEventListener("resize", this.updateCanvas);
	}
	updateCanvas()
	{
		let ctx = this.state.ctx;

		this.drawCanvas(ctx);

		window.requestAnimationFrame(this.updateCanvas);
	}
	drawCanvas() { }

	mouseMove(e)
	{
		let boundingRect = this.canEl.getBoundingClientRect();
		this.setState({
			mX: e.clientX - boundingRect.left,
			mY: e.clientY - boundingRect.top
		});
	}
	render()
	{
		return (
			<canvas ref={input => this.canEl = input} className="canvas"
				onMouseMove={this.mouseMove.bind(this)}
			></canvas>
		)
	}
}

export class Graph extends Canvas
{
	constructor(props)
	{
		super(props);
	}
	Init()
	{
		let speed = 1;
		let circles = [];
		for (let i = 0; i < 0; i++)
		{
			let margin = i * 15;
			circles.push({
				a: i * 15,
				d: 1
			});
		}
		this.state = {
			mX: 0,
			mY: 0,
			speed: speed,
			circles: circles
		}
	}
	drawCanvas(ctx)
	{
		let maxAngle = 360 * 2.25;
		let func = Functions.sinEdge();

		//ctx.translate(0, this.canEl.height / 2);
		//ctx.scale(1, -1);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.fillRect(0, 0, this.canEl.width, this.canEl.height);

		ctx.save();

		let translateY = this.canEl.height / 2;
		let translateX = 0;//this.canEl.width / 2;

		ctx.translate(translateX, translateY);
		ctx.scale(1, -1);

		for (let i = 0; i < this.state.circles.length; i++)
		{
			let circle = this.state.circles[i];
			let c = new Circle(func.x(circle.a), func.y(circle.a), 15);
			let style = "rgba(0, 0, 200, 0.5)";
			c.draw(ctx, style);

		}

		this.setState(function (prevState, props)
		{
			let newCircles = [];
			for (let i = 0; i < prevState.circles.length; i++)
			{
				let prevCircle = prevState.circles[i];
				let newA = prevCircle.a + prevCircle.d * this.state.speed;
				let newD = newA > 0 && newA < maxAngle ? prevCircle.d : -1 * prevCircle.d;
				newCircles.push({
					a: newA,
					d: newD
				});
			}
			return { circles: newCircles };
		});

		//let mc2 = new Circle(this.state.mX, this.canEl.height - this.state.mY - translateY, 15);
		//mc2.draw(ctx);

		let path = new FunctionPath(func.x, func.y, [0, maxAngle])
		path.draw(ctx);

		ctx.restore();
	}
	addCircle(e)
	{
		this.setState(function (prevState, props)
		{
			let circles = prevState.circles;
			let i = prevState.circles.length;
			circles.push({
				a: 0,
				d: 1
			});
			return
			{
				circles: circles
			}
		});
	}
	mouseMove(e)
	{
		let boundingRect = this.canEl.getBoundingClientRect();
		this.setState({
			mX: e.clientX - boundingRect.left,
			mY: e.clientY - boundingRect.top
		});
	}
	clear(e)
	{
		this.setState({ circles: [], speed: 1 })
	}
	removeCircle(e)
	{
		this.setState(function (prev, props)
		{
			prev.circles.splice(prev.circles.length - 1);
			return {
				circles: prev.circles
			}
		});
	}
	incSpeed(e)
	{
		this.changeSpeed(0.5);
	}
	decSpeed(e)
	{
		this.changeSpeed(-0.5);
	}
	changeSpeed(dir)
	{
		this.setState((prevstate, props) =>
			({
				speed: prevstate.speed + dir
			}));
	}
	render()
	{
		return (
			<div>
				<div>
					<button id="AddCircle" onClick={this.addCircle.bind(this)}>Kreis hinzufügen</button>
					{' ' + this.state.circles.length + ' '}
					<button id="ClearCircle" onClick={this.removeCircle.bind(this)}>Kreis entfernen</button>
					<button id="ClearCircle" onClick={this.incSpeed.bind(this)}>Schneller</button>
					{' ' + this.state.speed + ' '}
					<button id="ClearCircle" onClick={this.decSpeed.bind(this)}>Langsamer</button>
				</div>
				{super.render()}
				<div>
					<button id="ClearCircle" onClick={this.clear.bind(this)}>Zurücksetzen</button>
				</div>
			</div>
		)
	}
}

export class GoL extends Canvas
{
	constructor(props)
	{
		super(props);
	}
	Init()
	{
		this.state = {
			squareSize : 20
		}
	}

	drawCanvas(ctx)
	{
		let columns = this.canEl.width / this.state.squareSize;
		let rows = this.canEl.height / this.state.squareSize;
		let size = this.state.squareSize;
		let filledNormal = 'rgba(200, 200, 200, 0.8)';
		let filledHover = 'rgba(100, 100, 100, 0.1)';
		let hoverRow = Math.trunc(this.state.mY / size);
		let hoverCol = Math.trunc(this.state.mX / size);
		for (let i = 0; i < rows; i++)
		{
			let posY = i * size;
			for (let k = 0; k < columns; k++)
			{
				let posX = k * size;
				let r = new Rect(ctx, posX, posY)
					.dimensions(size, size)
					.fill(i == hoverRow && k == hoverCol ? filledHover : filledNormal)
					.outline('rgb(0, 0, 0)', 1);
			}
		}
	}
}
class Shape
{
	constructor(ctx, x, y)
	{
		this.ctx = ctx;
		this.x = x;
		this.y = y;
	}
}
class Rect extends Shape
{
	dimensions(w, h)
	{
		this.width = w;
		this.height = h;
		this.dx = this.x + w;
		this.dy = this.y + h;
		return this;
	}
	inBoundaries(x, y)
	{
		let inX = this.x < x && x < this.dx;
		let inY = this.y < y && y < this.dy;
		return inX && inY;
	}

	fill(fillStyle)
	{
		this.ctx.fillStyle = fillStyle;
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
		return this;
	}

	outline(strokeStyle, lineWidth)
	{
		this.ctx.lineWidth = lineWidth;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.strokeRect(this.x, this.y, this.width, this.height);
		return this;
	}
}

class Line
{
	constructor(x, y, dx, dy)
	{
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}
	draw(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.dx, this.dy);
		ctx.stroke();
	}
}

class Text
{
	constructor(x, y, text)
	{
		this.x = x;
		this.y = y;
		this.text = text;
	}
	draw(ctx)
	{
		ctx.strokeText(this.text, this.x, this.y);
	}
}

class Circle
{
	constructor(x, y, r, gradS, gradE)
	{
		this.x = x;
		this.y = y;
		this.r = r;
		this.gradS = gradS || 0;
		this.gradE = gradE || 2 * Math.PI;
	}
	inBoundaries(x, y)
	{
		let distX = this.x - x;
		let distY = this.y - y;
		distX = Math.pow(distX, 2);
		distY = Math.pow(distY, 2);
		return Math.round(Math.sqrt(distX + distY)) <= this.r;
	}
	draw(ctx, style)
	{
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, this.gradS, this.gradE);
		ctx.closePath();
		ctx.fillStyle = style || "rgba(0, 0, 200, 0.5)";
		ctx.fill();
		ctx.stroke();
	}
}

class FunctionPath
{
	constructor(x, y, interval)
	{
		this.fx = x;
		this.fy = y;
		this.s = interval[0];
		this.e = interval[1];
	}
	draw(ctx)
	{
		ctx.beginPath();
		ctx.moveTo(this.fx(this.s), this.fy(this.s));
		for (let i = ++this.s; i <= this.e; i++)
		{
			ctx.lineTo(this.fx(i), this.fy(i));
		}
		ctx.stroke();
	}
}

class Functions
{
	static archimedes()
	{
		return {
			x: (x) => (1 + 0.3 * x) * Math.cos(0.1 * x),
			y: (y) => (1 + 0.3 * y) * Math.sin(0.1 * y)
		}
	}
	static cosinus()
	{
		return {
			x: (x) => x,
			y: (y) => 250 * Math.cos(y * 4 * (Math.PI / 180))
		}
	}
	static sinus()
	{
		return {
			x: (x) => x,
			y: (y) => 250 * Math.sin(y * 4 * (Math.PI / 180))
		}
	}
	static sinEdge()
	{
		return {
			x: (x) => x,
			y: function (y)
			{
				let resY = Math.sin(y * 4 * (Math.PI / 180));
				return resY < 0 ? -250 : 250;
			}
		}
	}
}

class CustomPath 
{
	constructor(d)
	{
		this.d = d;
	}
	draw(ctx)
	{
		let dPath = new Path2D(this.d);
		ctx.stroke(dPath);
	}
}
