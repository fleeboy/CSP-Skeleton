import 'babel-polyfill';
import {chan, go, take, put, putAsync, buffers} from 'js-csp';
import {initUpdates, initComplexActions, initRender} from './init';
import * as Updates from './updates';
import * as ComplexActions from './complexActions';

// App config
const loadApp = () => ({
	// Model
	state: {
		words: ['first', 'second', 'last'],
		current: 0,
		loading: false
	},
	// Updates
	updates: {
		channels: {
			view: chan(),
			add: chan(),
			loading: chan()
		},
		consumers: {
			view: Updates.view,
			add: Updates.add,
			loading: Updates.loading
		}
	},
	complexActions: {
		channels: {
			dbInsert: chan()
		},
		consumers: {
			dbInsert: ComplexActions.dbInsert
		}
	},
	// View
	renderCh: chan(buffers.sliding(1))
});

const start = () => {
	let app = loadApp();
	window.app = app; // Debugging only
	
	initUpdates(app);
	initComplexActions(app);
	initRender(app, document.getElementById('main'));
};

start();

// For debugging
window.csp = require('js-csp');