// import './virtualscroll.js';

const isMobile = () => window.orientation != undefined && 'ontouchstart' in window;

class SimpoTarget {

	options = {
		velocity: 1,
		virtualScroll: false
	}

	constructor(owner, el, ops)
	{
		this.el = el;
		Object.assign(this.options, ops);
		this.options.initialRect = el.getBoundingClientRect();
		this.simpoScroller = owner;
		// this.el.style.transition = 'all 0.05s ease-in-out';
	}

	update()
	{
		if(this.options.update)
			this.options.update(this.el, this.simpoScroller.currentY, this);
	}
}

const

	trunc01 = (v) => Math.trunc(v * 10) / 10,
	trunc02 = (v) => Math.trunc(v * 100) / 100,

	rangeVal = (start, end, from, to, val) =>
	{
		if (val <= start) return from;

		if (val >= end) return to;

		let q = (val - start) / (end - start);

		return from + (to - from) * q;
	}




class SimpoScroller {

	state = {

		realY : 0,
		realYSav: 0,
		realDelta: 0.0,

		scrollY: 0,
		srollYSav: 0,
		scrollDelta: 0,
		scrollDeltaSav: 0,

		scrolling: 0, // -1 = up , 1 = down
		scrollingSav: 0,

		targetY: 0,
		targetYSav: 0,

		preRealY: 0,
		preRealYSav: 0,

		pointerX: 0,
		pointerXSav: 0,
		startX: 0,
		curX: 0,
		curXSav: 0,
	}

	options = {
		velocity: 0.66,
		scroller: document.scrollingElement,
		wrapper: document.querySelector('#wrapper')
	}

	targets = []

	constructor(ops)
	{
		Object.assign(this.options, ops);
		//window.addEventListener('resize', ev => this.animateTargets() );
	}

	viewPortFits(el)
	{
		const
			vh = window.innerHeight,
			curY = this.currentY,
			rect = (el.el ? el.el : el).getBoundingClientRect(), // el.el is SimpoTarget or SimpoSnap
			top = rect.top > 0 && rect.top < vh ? rect.top/vh : 0,
			bottom = rect.bottom > 0 && rect.bottom < vh ? rect.bottom/vh : 0,
			middle = (rect.top + rect.height/2) > 0 && (rect.top + rect.height/2) < vh ? (rect.top + rect.height/2)/vh : 0,
			cover = top > 0
				? bottom > 0 ? bottom - top : 1 - top
				: bottom > 0 ? Math.abs(bottom - 1) : 0;

		el.viewPortFits = {
			inView: cover > 0,
			cover: cover,
			top: top,
			bottom: bottom,
			middle: middle,
		}

		return el.viewPortFits;
	}

	get currentY()
	{
		return trunc02(this.state.scrollY);
	}

	run()
	{
		this.calcState();
		this.animateTargets();
		this.saveState();
		requestAnimationFrame( () => this.animateLoop() );
	}


	calcState = () =>
	{
		const
			state = this.state;

		state.realY = this.options.scroller.scrollTop;
		state.realDelta = state.realY - state.realYSav;
		state.scrolling = state.realDelta == 0
			? 0
			: state.realDelta > 0 ? 1 : -1;

		state.scrollY = state.srollYSav + (state.realY - state.srollYSav) * this.options.velocity;

		if(state.scrolling > 0 && state.scrollY > state.realY) state.scrollY = state.realY;
		if(state.scrolling < 0 && state.scrollY < state.realY) state.scrollY = state.realY;

		state.scrollDelta = trunc01( state.scrollY - state.srollYSav );
	}

	saveState()
	{
		const state = this.state;

		if(state.scrolling != state.scrollingSav)
		{
			if(state.scrolling)
				this.scrollStop()
			else
				this.scrollStart()
		}


		if(state.scrollDeltaSav != state.scrollDelta && Math.abs(state.scrollDelta) == 0)
			if(this.options.onSimpoScrollStop) this.options.onSimpoScrollStop(this.currentY);

		state.srollYSav = state.scrollY;
		state.realYSav = state.realY;
		state.scrollingSav = state.scrolling;

		state.scrollDeltaSav = state.scrollDelta;
	}

	scrollStart()
	{

	}


	scrollStop()
	{
		if(this.options.onScrollStop)
			this.options.onScrollStop(this.currentY);
	}

	animateLoop()
	{
		this.calcState();
		if(this.options.onAnimtionFrame)
			this.options.onAnimtionFrame(this.currentY);

		if(this.state.scrollDelta)
		{
			this.animateTargets()
			if(this.options.onscroll)
				this.options.onscroll(this.currentY);
		}

		this.saveState();

		requestAnimationFrame( ()=> this.animateLoop() );
	}

	animateTargets()
	{
		const targets = this.targets.filter( t => this.viewPortFits(t).inView || getComputedStyle(t.el).position == 'fixed' || getComputedStyle(t.el).position == 'absolute');
		for(const t of targets)
		{
			t.update();
		}
	}

	addTarget(t, ops)
	{
		if(!t)
			throw new Error('Invalid target!');

	    this.targets.push( new SimpoTarget(this, t, ops) );
	}

}


export const simpoScroller = new SimpoScroller();

window.simpoScroller = simpoScroller;

