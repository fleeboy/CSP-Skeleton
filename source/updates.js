import {assoc, append} from './utilities';

export const loading = (state, loadingState) => assoc(state, 'loading', loadingState);

export const view = (state, direction) => {
	const nextCurrent = direction === 'next' ?
		Math.min(state.current + 1, state.words.length - 1) :
		Math.max(state.current - 1, 0);
		
	return assoc(state, 'current', nextCurrent);
}

export const add = (state, newWord) => assoc(state, 'words', append(state.words, newWord));