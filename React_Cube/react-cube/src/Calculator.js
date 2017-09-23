import React, { Component } from 'react';
import './App.css';

export class Calculator extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			text: "",
			currentResult: 0,
			currentOperator: false,
			prevText: ""
		}
	}
	appendNumber(number)
	{
		this.setState((prevState, props) => ({
			text: prevState.text + number,
			prevText: prevState.prevText + number
		}));
	}
	addNumber()
	{
		this.updateResult();
		this.updateOperator(function (a, b) { return a + b; }, "+");
	}
	subNumber()
	{
		this.updateResult();
		this.updateOperator(function (a, b) { return a - b; }, "-");
	}
	multNumber()
	{
		this.updateResult();
		this.updateOperator(function (a, b) { return a * b; }, "*");
	}
	divNumber()
	{
		this.updateResult();
		this.updateOperator(function (a, b) { return a / b; }, "/");
	}
	calcNumber()
	{
		this.updateResult();
		this.setState({ currentOperator: false, prevText: "" });
	}
	updateOperator(newOperator, preview)
	{
		this.setState((prevState, props) => ({
			currentOperator: newOperator,
			prevText: prevState.prevText + " " + preview + " "
		}));
	}
	resetNumber()
	{
		this.setState({
			currentResult: 0,
			text: "",
			currentOperator: false,
			prevText: ""
		});
	}
	updateResult()
	{
		if (this.state.text != "")
		{
			let valueToUse = parseInt(this.state.text);
			this.setState((prevState, props) => ({
				currentResult: prevState.currentOperator == false ? valueToUse
					: prevState.currentOperator(prevState.currentResult, valueToUse),
				text: ""
			}));
		}
	}
	render()
	{
		return (
			<div className="calculatorContainer">
				<div className="calcRow resultRow">
					<div className="calcColumn calcColumn-4">
						<div>
							<span className="previewVal">{this.state.prevText}</span>
							<span className="result">{this.state.currentResult}</span>
						</div>
					</div>
				</div>
				<div className="calcRow">
					<div className="calcColumn calcColumn-1">
						<InputButton value="1" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="2" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="3" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="+" onButtonClick={this.addNumber.bind(this)} />
					</div>
				</div>
				<div className="calcRow">
					<div className="calcColumn calcColumn-1">
						<InputButton value="4" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="5" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="6" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="-" onButtonClick={this.subNumber.bind(this)} />
					</div>
				</div>
				<div className="calcRow">
					<div className="calcColumn calcColumn-1">
						<InputButton value="7" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="8" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="9" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="*" onButtonClick={this.multNumber.bind(this)} />
					</div>
				</div>
				<div className="calcRow">
					<div className="calcColumn calcColumn-1">
						<InputButton value="=" onButtonClick={this.calcNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="0" onButtonClick={this.appendNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="C" onButtonClick={this.resetNumber.bind(this)} />
					</div>
					<div className="calcColumn calcColumn-1">
						<InputButton value="/" onButtonClick={this.divNumber.bind(this)} />
					</div>
				</div>
			</div>
		)
	}
}

export class InputButton extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			value: props.value,
			mousedown: false
		}
	}

	onButtonClick(event)
	{
		if (this.props.onButtonClick)
		{
			this.props.onButtonClick(this.state.value);
		}
	}
	toggleMouseDown(value)
	{
		this.setState({ mousedown: value })
	}
	render()
	{
		var cssClass = this.state.mousedown ? 'mousedown' : ''
		return (
			<div id={'Input' + this.state.value} className={cssClass} onClick={this.onButtonClick.bind(this)}
				onMouseDown={this.toggleMouseDown.bind(this, true)}
				onMouseOut={this.toggleMouseDown.bind(this, false)}
				onMouseUp={this.toggleMouseDown.bind(this, false)}>
				<span>{this.state.value}</span>
			</div>
		)
	}
}