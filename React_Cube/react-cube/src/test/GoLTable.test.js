import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils, { Simulate } from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import { AntCell, AntTable, AntCellComponent, GoLCell, GoLTable, GolCellComponent } from '../GoLTable';

describe('GolTable', function ()
{
	it('born again', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][11].lives = true;
		matrix[11][12].lives = true;
		matrix[11][13].lives = true;
		expect(matrix[10][12].calcState(matrix)).toBe(true);
	});
	it('dies from lonelyness', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][11].lives = true;
		expect(matrix[10][12].calcState(matrix)).toBe(false);
	});
	it('keeps living', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][11].lives = true;
		matrix[11][12].lives = true;
		matrix[11][13].lives = true;
		matrix[10][12].lives = true;
		expect(matrix[10][12].calcState(matrix)).toBe(true);
	});
	it('dies because too many neighbours', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][11].lives = true;
		matrix[11][12].lives = true;
		matrix[11][13].lives = true;
		matrix[10][11].lives = true;
		matrix[10][12].lives = true;
		expect(matrix[10][12].calcState(matrix)).toBe(false);
	});

	it('first row lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[0][11].lives = true;
		matrix[0][12].lives = true;
		matrix[0][13].lives = true;
		expect(matrix[0][12].calcState(matrix)).toBe(true);
	});

	it('first row dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[0][11].lives = true;
		matrix[0][12].lives = true;
		matrix[0][13].lives = true;
		matrix[1][11].lives = true;
		matrix[1][12].lives = true;
		expect(matrix[0][12].calcState(matrix)).toBe(false);
	});

	it('last row lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lasRow = matrix.length - 1;
		matrix[lasRow][11].lives = true;
		matrix[lasRow][13].lives = true;
		matrix[lasRow - 1][11].lives = true;
		expect(matrix[lasRow][12].calcState(matrix)).toBe(true);
	});

	it('last row dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lasRow = matrix.length - 1;
		matrix[lasRow][11].lives = true;
		matrix[lasRow][12].lives = true;
		expect(matrix[lasRow][12].calcState(matrix)).toBe(false);
	});

	it('first col lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][1].lives = true;
		matrix[12][1].lives = true;
		matrix[13][1].lives = true;
		matrix[12][0].lives = true;
		expect(matrix[12][0].calcState(matrix)).toBe(true);
	});

	it('first col dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[11][1].lives = true;
		matrix[12][1].lives = true;
		matrix[13][1].lives = true;
		matrix[12][0].lives = true;
		matrix[13][0].lives = true;
		expect(matrix[12][0].calcState(matrix)).toBe(false);
	});

	it('last col lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		matrix[11][lastCol - 1].lives = true;
		matrix[12][lastCol - 1].lives = true;
		matrix[12][lastCol].lives = true;
		expect(matrix[12][lastCol].calcState(matrix)).toBe(true);
	});

	it('last col dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		matrix[11][lastCol - 1].lives = true;
		matrix[12][lastCol].lives = true;
		expect(matrix[12][lastCol].calcState(matrix)).toBe(false);
	});

	it('top left edge lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[0][0].lives = true;
		matrix[0][1].lives = true;
		matrix[1][1].lives = true;
		expect(matrix[0][0].calcState(matrix)).toBe(true);
	});
	it('top left edge dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		matrix[0][0].lives = true;
		matrix[1][1].lives = true;
		expect(matrix[0][0].calcState(matrix)).toBe(false);
	});

	it('top right edge lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		matrix[0][lastCol - 1].lives = true;
		matrix[1][lastCol - 1].lives = true;
		matrix[1][lastCol].lives = true;
		expect(matrix[0][lastCol].calcState(matrix)).toBe(true);
	});

	it('top right edge dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		matrix[0][lastCol - 1].lives = true;
		expect(matrix[0][lastCol].calcState(matrix)).toBe(false);
	});

	it('bottom left edge lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastRow = matrix.length - 1;
		matrix[lastRow][0].lives = true;
		matrix[lastRow][1].lives = true;
		matrix[lastRow - 1][0].lives = true;
		expect(matrix[lastRow][0].calcState(matrix)).toBe(true);
	});

	it('bottom left edge dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastRow = matrix.length - 1;
		matrix[lastRow][0].lives = true;
		expect(matrix[lastRow][0].calcState(matrix)).toBe(false);
	});

	it('bottom right edge lives', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		let lastRow = matrix.length - 1;
		matrix[lastRow - 1][lastCol - 1].lives = true;
		matrix[lastRow - 1][lastCol].lives = true;
		matrix[lastRow][lastCol - 1].lives = true;
		expect(matrix[lastRow][lastCol].calcState(matrix)).toBe(true);
	});

	it('bottom right edge dies', function ()
	{
		const testRenderer = TestRenderer.create(<GoLTable />).getInstance();
		let matrix = testRenderer.state.cells;
		let lastCol = matrix[0].length - 1;
		let lastRow = matrix.length - 1;
		matrix[lastRow][lastCol - 1].lives = true;
		matrix[lastRow][lastCol].lives = true;
		expect(matrix[lastRow][lastCol].calcState(matrix)).toBe(false);
	});

	it('updateGrid', function ()
	{
		const element = ReactTestUtils.renderIntoDocument(<GoLTable />);
		Simulate.click(element.updateButton);
	});


});

describe('AntTable', function ()
{
	it('position ccw', function ()
	{
		const testRenderer = TestRenderer.create(<AntTable />).getInstance();
		let matrix = testRenderer.state.cells;
		testRenderer.setCell(13, 13);
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.top))).toBe(JSON.stringify({ r: 13, c: 12, dir: AntCell.antdirection.left }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.left))).toBe(JSON.stringify({ r: 14, c: 13, dir: AntCell.antdirection.bottom }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.bottom))).toBe(JSON.stringify({ r: 13, c: 14, dir: AntCell.antdirection.right }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.right))).toBe(JSON.stringify({ r: 12, c: 13, dir: AntCell.antdirection.top }));
	});
	it('position cw', function ()
	{
		const testRenderer = TestRenderer.create(<AntTable />).getInstance();
		let matrix = testRenderer.state.cells;
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.top))).toBe(JSON.stringify({ r: 13, c: 14, dir: AntCell.antdirection.right }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.right))).toBe(JSON.stringify({ r: 14, c: 13, dir: AntCell.antdirection.bottom }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.bottom))).toBe(JSON.stringify({ r: 13, c: 12, dir: AntCell.antdirection.left }));
		expect(JSON.stringify(matrix[13][13].nextCell({ r: 13, c: 13 }, matrix, AntCell.antdirection.left))).toBe(JSON.stringify({ r: 12, c: 13, dir: AntCell.antdirection.top }));
	});

})