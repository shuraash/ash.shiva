/* just some utilites */

const startUpItems = [];

document.readyState === 'interactive'

	? setTimeout(() =>  startUpItems.forEach( sif => sif() ), 10)

	: document.addEventListener('readystatechange', (ev) => document.readyState === 'interactive'
			? setTimeout(() =>  startUpItems.forEach( sif => sif() ), 10)
			: null
	  );

export const

	isMobile = () => window.orientation != undefined && 'ontouchstart' in window,

	awaitTimer = (ms) => new Promise( (resolve, reject) => setTimeout( () => resolve(), ms) ),

	rangeVal = (start, end, from, to, val) =>
	{
		if(val <= start) return from;
		if(val >= end) return to;
		let q = (val - start) / (end - start);

		return from + (to - from) * q;
	},

	inViewPort = (rect, dy = 0, h = innerHeight) =>
	{
		let {top, bottom} = rect;
		top += dy;
		bottom += dy;
		return  top < h && bottom > 0
			?  ((bottom >= h ? h : bottom) - (top >= 0 ? top : 0)) / h
			: false;
	},

	trunc01 = (v) => Math.trunc(v * 10) / 10,

	trunc02 = (v) => Math.trunc(v * 100) / 100,

	isPortrait = () => innerWidth < innerHeight,

	onStart = fn => startUpItems.push(fn);
