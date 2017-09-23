import React, { Component } from 'react';
import './App.css';

export class Canvas extends Component
{
	constructor(props)
	{
		super(props);
		let circles = [];
		for (let i = 0; i < 20; i++)
		{
			circles.push({
				a: i * 15,
				d: 1
			});
		}
		this.state = {
			mX: 0,
			mY: 0,
			circles: circles,
			ctx : null
		}
		this.updateCanvas = this.updateCanvas.bind(this);
	}
	componentDidMount()
	{
		this.state.ctx = this.canEl.getContext('2d');

		this.canEl.width = 800;
		this.canEl.height = 600;

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

		let maxAngle = 360 * 2.25;
		let a = 1;
		let b = 0.2;
		let c = 0.01;
		let func = Functions.fermat(a, b, c);

		//ctx.translate(0, this.canEl.height / 2);
		//ctx.scale(1, -1);

		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fillRect(0, 0, this.canEl.width, this.canEl.height);

		let mc = new Circle(this.state.mX, this.state.mY, 15);
		mc.draw(ctx);

		//for (let i = 0; i < this.state.circles.length; i++)
		//{
		//	let circle = this.state.circles[i];
		//	let c = new Circle(func.x(circle.a), func.y(circle.a), 15);
		//	let style = "rgba(0, 0, 200, 0.5)";
		//	c.draw(ctx, style);

		//}

		//this.setState(function (prevState, props)
		//{
		//	let newCircles = [];
		//	for (let i = 0; i < prevState.circles.length; i++)
		//	{
		//		let prevCircle = prevState.circles[i];
		//		let newA = prevCircle.a + prevCircle.d;
		//		let newD = newA > 0 && newA < maxAngle ? prevCircle.d : -1 * prevCircle.d;
		//		newCircles.push({
		//			a: newA,
		//			d: newD
		//		});
		//	}
		//	return { circles: newCircles };
		//});
		//let r = new Rect(pathX(posX), pathY(posX), rectW, rectH);
		//let style = r.inBoundaries(this.state.mX, this.state.mY) ? "rgba(200, 0, 0, 0.5)" : "rgba(0, 0, 200, 0.5)";
		//r.draw(ctx, style);

		//let intervall = w / rectW;
		//for (let i = 0; i < intervall; i++)
		//{
		//	let x = i * rectW;
		//	let line = new Line(x, 0, x, h);
		//	line.draw(ctx);
		//}

		//intervall = h / rectH;
		//for (let i = 0; i < intervall; i++)
		//{
		//	let y = i * rectH;
		//	let line = new Line(0, y, w, y);
		//	line.draw(ctx);
		//}

		//let text = new Text(10, 20, this.state.mX + ", " + this.state.mY);
		//text.draw(ctx);
		ctx.save();
		ctx.translate(0, this.canEl.height / 2);
		ctx.scale(1, -1);
		let path = new FunctionPath(func.x, func.y, [0, maxAngle])
		path.draw(ctx);
		ctx.restore();
		window.requestAnimationFrame(this.updateCanvas);
	}
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

class Rect 
{
	constructor(x, y, w, h)
	{
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.dx = x + w;
		this.dy = y + h;
	}
	inBoundaries(x, y)
	{
		let inX = this.x < x && x < this.dx;
		let inY = this.y < y && y < this.dy;
		return inX && inY;
	}
	draw(ctx, style)
	{
		ctx.fillStyle = style;
		ctx.fillRect(this.x, this.y, this.width, this.height);
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
	static archimedes(a, b, c)
	{
		return {
			x: (x) => (a + b * x) * Math.cos(c * x),
			y: (y) => (a + b * y) * Math.sin(c * y)
		}
	}
	static fermat(a, b, c)
	{
		return {
			x: (x) => x,
			y: (y) => 250 * Math.cos(y * 4 * (Math.PI /180))
		}
	}
}
