import React, { Component } from 'react';
import './App.css';

export class ColorPicker extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			previewColor: 'rgb(0,0,0)',
			precision: parseInt(props.precision) || 1,
			baseH: 0,
		};
	}

	colorsSV()
	{
		let rows = [];
		for (let k = 100; k >= 0; k--)
		{
			let colors = [];
			for (let i = 0; i <= 100; i += this.state.precision)
			{
				colors.push(<ColorTD color={{ h: this.state.baseH, s: i, v: k }} mouseOver={this.showPreview.bind(this)} />);
			}
			rows.push(<tr> {colors} </tr>);
		}
		return rows;
	}

	colorsH()
	{
		let colors = [];
		for (let i = 0; i <= 360; i += this.state.precision)
		{
			colors.push(<ColorTD color={{ h: i, s: 100, v: 100 }} mouseOver={this.updateBaseH.bind(this, i)} />);
		}
		return <tr> {colors} </tr>;
	}

	updateBaseH(newH, event)
	{
		this.setState({ baseH: newH });
	}

	showPreview(event)
	{
		console.log(event);
		this.setState({
			previewColor: event.target.style.backgroundColor,
		});
	}

	previewStyle()
	{
		return {
			backgroundColor: this.state.previewColor,
		};
	}

	render()
	{
		return (
			<div>
				<table className="colorPickerSV" >
					{this.colorsSV()}
				</table>
				<table className="colorPickerH">
					{this.colorsH()}
				</table>
				<div style={this.previewStyle()} className="preview"></div>
			</div>
		);
	}
}

export class ColorTD extends Component
{
	constructor(props)
	{
		super(props);
		this.mouseOver = this.props.mouseOver;
	}

	getpqt(V, S, f)
	{
		return {
			p: V * (1 - S),
			q: V * (1 - S * f),
			t: V * (1 - S * (1 - f))
		};
	}

	hsvToRgb(hsvColor)
	{
		let V = hsvColor.v / 100;
		let S = hsvColor.s / 100;
		let h = Math.floor(hsvColor.h / 60);
		let f = hsvColor.h / 60 - h;
		let pqt = this.getpqt(V, S, f);

		let r = 0;
		let g = 0;
		let b = 0;

		switch (h)
		{
			case 0:
			case 6:
				r = V;
				g = pqt.t;
				b = pqt.p;
				break;
			case 1:
				r = pqt.q;
				g = V;
				b = pqt.p;
				break;
			case 2:
				r = pqt.p;
				g = V;
				b = pqt.t;
				break;
			case 3:
				r = pqt.p;
				g = pqt.q;
				b = V;
				break;
			case 4:
				r = pqt.t;
				g = pqt.p;
				b = V;
				break;
			case 5:
				r = V;
				g = pqt.p;
				b = pqt.q;
				break;
		}


		return { r: Math.round(255 * r), g: Math.round(255 * g), b: Math.round(255 * b) };
	}

	getRGB()
	{
		let rgbColor = this.hsvToRgb(this.props.color)
		return 'rgb(' + rgbColor.r + ',' + rgbColor.g + ',' + rgbColor.b + ')';
	}

	style()
	{
		return {
			backgroundColor: this.getRGB()
		}
	}
	render()
	{
		return (
			<td onMouseOver={this.mouseOver} style={this.style()}></td>
		);
	}
}