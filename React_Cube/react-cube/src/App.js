import React, { Component } from 'react';
import { Cube } from './Cube';
import { TextEditor } from './TextEditor';
import { ColorPicker } from './ColorPicker';
import { Calculator } from './Calculator';
import { Canvas, Graph, GoL } from './Canvas';
import { GoLTable, AntTable } from './GoLTable';
import './App.css';

class App extends Component {
  render() {
	  return (
		  <AntTable rows="40" cols="60" />
    );
  }
}

export default App;