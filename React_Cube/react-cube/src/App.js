import React, { Component } from 'react';
import { Cube } from './Cube';
import { TextEditor } from './TextEditor';
import { ColorPicker } from './ColorPicker';
import './App.css';

class App extends Component {
  render() {
	  return (
		  <ColorPicker precision="3"/>
    );
  }
}

export default App;
