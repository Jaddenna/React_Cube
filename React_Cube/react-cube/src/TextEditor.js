import React, { Component } from 'react';
import './App.css';

export class TextEditor extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			text: 'Hier könnte ihre Werbung stehen!',
			isBold: false,
			isItalic: false
		};
	}

	textChanged(event)
	{
		//this.setState({preview : event.target.innerHTML})
	}

	setSelectionState(event, state, value)
	{
		if (value == undefined)
		{
			document.execCommand(state);
		}
		else
		{
			document.execCommand(state, false, value);
		}
	}

	setBold(event)
	{
		this.setSelectionState(event, 'bold')
		this.queryState(event);
	}
	setItalic(event)
	{
		this.setSelectionState(event, 'italic')
		this.queryState(event);
	}
	setRed(event)
	{
		document.execCommand('styleWithCSS', false, true);
		document.execCommand('foreColor', false, "red");
	}
	queryState(event)
	{
		this.setState({
			isBold: document.queryCommandState('bold'),
			isItalic: document.queryCommandState('italic')
		});		
	}

	render()
	{
		return (
			<div>
				<div contentEditable="true" onMouseUp={this.queryState.bind(this)} onKeyUp={this.textChanged.bind(this)}>
					{this.state.text}
				</div>
				<div className="preview">
					<label htmlFor="BoldCB">B</label>
					<input type="checkbox" id="BoldCB"
						onChange={this.setBold.bind(this)} checked={this.state.isBold} />
					<label htmlFor="ItalicCB">K</label>
					<input type="checkbox" id="ItalicCB"
						onChange={this.setItalic.bind(this)} checked={this.state.isItalic} />
					<label htmlFor="RedCB">K</label>
					<input type="checkbox" id="RedCB"
						onChange={this.setRed.bind(this)} />
				</div>
			</div>
		);
	}
}