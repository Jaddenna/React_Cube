import React, { Component } from 'react';
import './App.css';

export class Cube extends Component
{
	maxSpeed = 30;

	constructor(props)
	{
		super(props);
		this.state = {
			speed: 13,
			animationTimingFunction : 'linear'
		};
	}

	cubeStyle()
	{
		return {
			animationDuration: this.state.speed + 's',
			animationTimingFunction: this.state.animationTimingFunction
		}
	}

	faster()
	{
		if (this.state.speed < this.maxSpeed)
		{
			this.setState((prevState, props) => ({
				speed: parseInt(prevState.speed) + 1
			}));
		}
	}
	slower()
	{
		if (this.state.speed > 0)
		{
			this.setState((prevState, props) => ({
				speed: parseInt(prevState.speed) - 1
			}));
		}
	}

	textChange(event)
	{
		this.setState({ speed: event.target.value });
	}

	animTimeChange(event)
	{
		this.setState({ animationTimingFunction: event.target.value });
	}

	render()
	{
		return (
			<div className="container">
				<div className="cubeContainer">
					<div className="cube" style={this.cubeStyle()}>
						<div className="square front" ></div>
						<div className="square back"  ></div>
						<div className="square left"  ></div>
						<div className="square right" ></div>
						<div className="square top"   ></div>
						<div className="square bottom"></div>
					</div>
				</div>
				<div className="settings">
					<div>
						<button onClick={this.slower.bind(this)}>-</button>
						<input value={this.state.speed} onChange={this.textChange.bind(this)}
							type="number" max={this.maxSpeed} min="0" />
						<button onClick={this.faster.bind(this)}>+</button>&nbsp;Sekunden
					</div>
					<div>
						<input id="animTimeFunc1" type="radio" name="animTimeFunc" value="linear"
							checked={this.state.animationTimingFunction == 'linear'} onChange={this.animTimeChange.bind(this)} />
						<label htmlFor="animTimeFunc1">linear</label>
						<input id="animTimeFunc2" type="radio" name="animTimeFunc" value="ease"
							checked={this.state.animationTimingFunction == 'ease'} onChange={this.animTimeChange.bind(this)} />
						<label htmlFor="animTimeFunc2">ease</label>
					</div>
				</div>
			</div>
		);
	}
}
