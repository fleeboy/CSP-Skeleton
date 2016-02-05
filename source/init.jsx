import {chan, go, take, put, putAsync, buffers} from 'js-csp';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';

export const initUpdates = app => {
	
	Object.keys(app.updates.consumers).forEach(k => {
		
		const updateFn = app.updates.consumers[k];
		const ch = app.updates.channels[k];
		
		go(function* () {
			// Process will go on forever...
			while(true) {
				// The process will pause waiting for a value to be put in the channel
				const value = yield take(ch);
				
				// Logging
				console.log(`On update channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
				
				// Update the state
				app.state = updateFn(app.state, value);
				
				// Put new state in Render channel
				yield put(app.renderCh, app.state);
			}
		});
	});
	
};

export const initComplexActions = app => {
	
  Object.keys(app.complexActions.consumers).forEach(k => {
	  
		const complexActionFn = app.complexActions.consumers[k];
		const ch = app.complexActions.channels[k];
		
		go(function* () {
			while (true) {
				const value = yield take(ch);
				console.log(`On complex action channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
				complexActionFn(app.updates.channels, value);
			}
		});
  });
};

export const initRender = (app, element) => {
	
	// Render initial state
	putAsync(app.renderCh, app.state);
	
	go(function* () {
		while(true) {
			const state = yield take(app.renderCh);
			
			// Little trick to "synchronize" async functions
			const finishRender = chan();
			
			// Render passing state and channels, so
			// the user can trigger updates and
			// complex actions from the interface
			ReactDOM.render(
				
				// Main component
				<Main
					appState = {app.state}
					updateChannels = {app.updates.channels}
					complexActionsChannels = {app.complexActions.channels} />,
					
				// DOM element
				element,
				
				// Callback to rendering
				() => window.requestAnimationFrame(() => putAsync(finishRender, {})));
				
			// wait for a value in the finishRender channel
			yield take(finishRender);
		}
	});
};

export const initHistory = app => {
  // a nav channel could handle
  // the state transformations
  // caused by changing the route.
  //
  // hash changes => nav channel
  window.addEventListener('hashchange', () => {
    const screen = window.location.hash.slice(2);
    const current = get(app.state, 'screen');
    if (screen !== current) {
      putAsync(app.updates.channels.nav, screen);
    }
  });
};
