import React, { Component } from 'react';
import { Cube } from './Cube';
import { TextEditor } from './TextEditor';
import { ColorPicker } from './ColorPicker';
import { Calculator } from './Calculator';
import { Canvas } from './Canvas';
import './App.css';

class App extends Component {
  render() {
	  return (
		  <Canvas />
    );
  }
}

export default App;
