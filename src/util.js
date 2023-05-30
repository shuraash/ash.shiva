/* just some utilites */

const startUpItems = [];

document.readyState === 'interactive'

	? setTimeout(() =>  startUpItems.forEach( sif => sif() ), 10)

	: document.addEventListener('readystatechange', (ev) => document.readyState === 'interactive'
			? setTimeout(() =>  startUpItems.forEach( sif => sif() ), 10)
			: null);

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


window.isPortrait = isPortrait;


window.addEventListener('pointerdown', ev => resetInactivityTimer());
window.addEventListener('pointerup', ev => resetInactivityTimer());
window.addEventListener('pointercancel', ev => resetInactivityTimer());
window.addEventListener('pointermove', ev => resetInactivityTimer());
window.addEventListener('keydown', ev => resetInactivityTimer());
window.addEventListener('scrollStart', ev => resetInactivityTimer());

let
	inactivityTimer = 0;

const
	inactivityStart = new Event("inactivityStart"),
	inactivityEnd = new Event("inactivityEnd");

function resetInactivityTimer()
{
	if(inactivityTimer)
	{
		if(inactivityTimer != -1)
			clearTimeout(inactivityTimer);
		else
			window.dispatchEvent(inactivityEnd);
	}
	inactivityTimer = setTimeout(()=>
	{
		inactivityTimer = -1;
		window.dispatchEvent(inactivityStart);
	}, 7777);
}


resetInactivityTimer();