// const clone = obj => JSON.parse(JSON.stringify(obj)); // Change to use Immutable JS

export const assoc = (obj, prop, value) => {
	// const cl = clone(obj); // Use ES6 spread operator?
	// const cl = {...obj, prop}
	// cl[prop] = value;
	// return cl;
	return {...obj, [prop]: value};
}

export const append = (array, value) => {
	 return [...array, value];
}
