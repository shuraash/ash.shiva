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

// class SimpoSnap {
//
// 	constructor(owner, el, prev = 0.1, next = 0.1)
// 	{
// 		this.el = el;
// 		this.prev = prev;
// 		this.next = next;
// 		Object.assign(this.options, ops);
// 		this.options.initialRect = el.getBoundingClientRect();
// 		this.simpoScroller = owner;
// 		// this.el.style.transition = 'all 0.05s ease-in-out';
// 	}
// }

const
	def_snap_ops = {
		  toDown: 0.45,
		  toUp: 0.45,
		  durOut: 0.2, // * distance / window height
		  durIn: 0.2
	},


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
	snaps = []

	snapping = false

	constructor(ops)
	{
		Object.assign(this.options, ops);

		if(this.options.virtualScroll)
		{
			this.options.scroller.classList.add('no-scroll');
			document.addEventListener('touchmove', e => e.preventDefault(), {passive: false});

			this.virtualScroll = new virtualScroll();
			this.virtualScroll.on((e) => {
				this.state.targetY += e.deltaY;
				if (this.targetY > this.options.scroller.scrollHeight) this.state.targetY = this.options.scroller.scrollHeight;
				if (this.targetY < 0) this.state.targetY = 0;
			});
		}

		if(false && isMobile())
		{
			// document.querySelector('html').style.height = `calc(var(--vh, 1vh) * 100 + 1px)`;
			// document.body.style.height = `calc(var(--vh, 1vh) * 100 + 1px)`;
			//document.querySelector('html').classList.add('mobile-body');
		//	document.body.classList.add('mobile-body');


			this.options.wrapper.addEventListener('scroll', console.log(`${Date.now()}\twindow RY: ${scrollY} wrapper RY: ${this.options.wrapper.scrollTop}`));

			let muha = false, s2wTimer = 0;


			const
				sce2wrapper = () =>
				{
					let y = muha
					muha = 0;

					console.log(`switch scroll to wrapper at ${y}`);

					this.options.wrapper.sukaSwitched = true;

					//	document.scrollingElement.style.overflowY = 'hidden';
					this.options.wrapper.style.height = (window.innerHeight + 1) + 'px';


					setTimeout( () =>
					{
						// this.options.wrapper.style.transition = '';
						// this.options.wrapper.style.transform = '';
						this.options.wrapper.style = `height: ${window.innerHeight + 1}px`;
						this.options.wrapper.scrollTo(0, y);
						console.log(`wrapper set for w at ${y}`);

					}, 50);

					// this.options.wrapper.style.transition = `all 0.1s easy-in`
					// this.options.wrapper.style.transform = `translateY(${-y}px)`;
					this.options.wrapper.style = `transition = all 0.1s easy-in; transform: translateY(${-y}px); height: ${window.innerHeight + 1}px`;


					// this.options.wrapper.scrollTo(0, muha);
					document.body.style.translate = '';
					document.scrollingElement.scrollTo(0, 1);

				}


			document.addEventListener('scroll', (ev) =>
			{
				if(muha)
				{
					//nuda.push(scrollY);

					if(scrollY > muha)
					{
						console.log(`synscrol to ${scrollY}`);

						muha = scrollY;

						document.body.style.translate = `0 ${scrollY}px`;
						// this.options.wrapper.scrollTo(0, scrollY);
						// this.options.wrapper.style.transform = `translateY(${-scrollY}px)`;
					}
					else
					{
						clearTimeout(s2wTimer);
						sce2wrapper();
					}

					return
				}

				if(scrollY > 0 && !this.options.wrapper.sukaSwitched && !muha)
				{
					muha = scrollY;
					s2wTimer = setTimeout( () => sce2wrapper(), 100);

				}
				else if(scrollY < 1 && this.options.wrapper.style.height)
				{
					console.log(`switch scroll to doc`);
					this.options.wrapper.sukaSwitched = false;
					this.options.wrapper.style.height = '';
					//this.options.wrapper.style.transform = ''; //translateY(${-document.scrollingElement.scrollTop}px)`;
					this.options.wrapper.scrollTo(0,0);
					document.scrollingElement.scrollTo(0, 0);
					document.scrollingElement.style.overflowY = 'auto';
					//window.scrollTo(0, 0);
				}

			})

		}

	//	this.attachXPnt();

		addEventListener('resize', ev => this.animateTargets() );
		addEventListener('orientationchange', ev => this.animateTargets() );
	}

	// makeFixed(elements, toAbsolute = false)
	// {
	// 	// elm.classList.add('fa123fa321');
	// 	// const elements = [...document.querySelectorAll('.fa123fa321 > *')];
	// 	// elm.classList.remove('fa123fa321');
	//
	// 	elements.map( e =>
	// 	{
	// 		const
	// 			{position, top, left, width, height} = e.style;
	// 			return {
	// 				el: e,
	// 				rect: e.getBoundingClientRect(),
	// 				saved: {
	// 					position: position,
	// 					top: top,
	// 					left: left,
	// 					width: width,
	// 					height: height
	// 				}
	// 			}
	// 	})
	// 	.forEach( e =>
	// 	{
	// 		const cs = getComputedStyle(e.el);
	// 		e.el.style.top = scrollY + e.rect.top + 'px'; //- parseFloat(cs.marginTop)
	// 		e.el.style.left = scrollX + e.rect.left + 'px';
	// 		e.el.style.height = e.rect.height + 'px';
	// 		e.el.style.width = e.rect.width + 'px';
	// 		e.el.style.position = 'fixed';
	//
	//
	// 		e.el.parentElement.addEventListener('resize', ev =>
	// 		{
	// 			e.el.style.top = scrollY + e.rect.top + 'px';
	// 			e.el.style.left = scrollX + e.rect.left + 'px';
	// 			e.el.style.height = e.rect.height + 'px';
	// 			e.el.style.width = e.rect.width + 'px';
	// 			e.style.position = 'fixed';
	//
	// 			this.makeFixed([e.elm]);
	// 		});
	//
	//
	// 	});
	//
	//
	//
	// }


	// setScroller(s)
	// {
	// 	this.options.scroller = s;
	// }


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
		// if(this.snaps.length > 2)
		// {
		// 	this.snaps.slice(2).forEach(s => s.el.style.display = 'none');
		// }

		//document.body.classList.add('snap');
		this.calcState();
		this.animateTargets();
		this.saveState();
		requestAnimationFrame( () => this.animateLoop() );
	}


	calcX()
	{
		const
		    state = this.state;

		if(state.pointerXSav != state.pointerX)
		{
			state.curX = state.curXSav + (state.pointerX - state.pointerXSav) * this.options.velocity;
			state.xDelta = state.curX - state.startX;
			state.pointerXSav = state.pointerX;
			state.curXSav = state.curX;

			console.log(`x delta ${state.xDelta}`);

		}
	}

	calcState = () =>
	{
		const
			state = this.state;

		this.calcX();

// ----- for VirtualScroll
		if(this.options.virtualScroll)
		{
			if (-state.targetY > this.options.scroller.scrollHeight) state.targetY = -this.options.scroller.scrollHeight;
			if (-state.targetY < 0) state.targetY = 0;

			state.targetDelta = Math.trunc((-state.targetY - (-state.preRealYSav)) * 10) / 10;

		//	if (this.snaps.length && state.targetDelta > 0 && -state.targetY > this.snapNext.el.offsetTop) state.targetY = -this.snapNext.el.offsetTop;
			if( this.snapping && ((this.snapDelta > 0 && -state.targetY > this.snapStop) || (this.snapDelta < 0 && -state.targetY < this.snapStop) || (!this.snapDelta  && -state.targetY != this.snapStop)) )
				state.targetY = -this.snapStop;

			//if(!this.snapping && state.scrolling) this.snapCheck();

			state.preRealY = state.preRealYSav + (state.targetY - state.preRealYSav) * this.options.velocity;

			if (state.targetDelta > 0 && state.preRealY < state.targetY) state.preRealY = state.targetY;
			if (state.targetDelta < 0 && state.preRealY > state.targetY) state.preRealY = state.targetY;
			if (state.targetDelta == 0 && state.targetY == 0) state.preRealY = 0;
			if (state.targetDelta == 0 && state.targetY == -this.options.scroller.scrollHeight) state.preRealY = -this.options.scroller.scrollHeight;

			// if(-state.preRealY > this.options.scroller.scrollHeight) state.preRealY = -this.options.scroller.scrollHeight;
			// if(-state.preRealY < 0) state.preRealY = 0;

			console.log(`targetDelta ${state.targetDelta} targetY ${state.targetY} preRealY ${state.preRealY}`);

			this.options.scroller.scrollTo(0, -state.preRealY);
		}
// ----- for VirtualScroll end


		// state.preRealY = this.snapping
		// 		? -this.options.wrapper.getBoundingClientRect().top
		// 		: this.options.scroller.scrollTop;
		//
		// if(state.preRealY < 0) state.preRealY = 0;
		// if(state.preRealY > this.options.scroller.scrollHeight) state.preRealY = this.options.scroller.scrollHeight;
		//
		// state.realY = state.preRealYSav + (state.preRealY - state.preRealYSav) * this.options.velocity;
		//
		//
		// if( this.snapping && ((this.snapDelta > 0 && state.realY > this.snapStop) || (this.snapDelta < 0 && state.realY < this.snapStop) || (!this.snapDelta  && state.realY != this.snapStop)) )
		// 	state.realY = this.snapStop;
		//
		// state.realDelta = state.preRealY - state.preRealYSav;

		state.realY = this.options.scroller.scrollTop;

		state.realDelta = state.realY - state.realYSav;
		state.scrolling = state.realDelta == 0
			? 0
			: state.realDelta > 0 ? 1 : -1;
	//	if(!this.options.virtualScroll && !this.snapping && state.scrolling) this.snapCheck();

		// const sd = Math.trunc((state.realY - state.scrollY)*10)/10;
		// state.scrollY += sd ? sd * this.options.velocity : 0;

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

		// state.targetYSav = state.targetY;
		// state.preRealYSav = state.preRealY;
	}

	scrollStart()
	{

	}


	scrollStop()
	{
		if(this.options.onScrollStop) this.options.onScrollStop(this.currentY);
		// check snaps
		//if(!this.options.virtualScroll && !this.snapping && state.scrolling)
		// console.log(`scroll stop ${this.state.scrollY} kuda: ${this.state.scrolling}`);
		// this.snapCheck();
	}

	animateLoop()
	{
		this.calcState();

	//	this.snapCheck();
	// 	if(this.isMobile && this.state.scrolling)
	// 	{
	// 		if(this.state.scrolling > 0 && document.querySelector('html').scrollTop < 1)
	// 		{
	// 			window.scrollTo(0, 1);
	// 			//document.body.scrollTo(0, 1);
	// 		}
	// 		else if(this.state.scrolling < 0 && document.querySelector('html').scrollTop > 0)
	// 		{
	// 			window.scrollTo(0, 0);
	// 			//document.body.querySelector('html').scrollTo(0, 0);
	// 		}
	// 	}

		if(this.options.onAnimtionFrame) this.options.onAnimtionFrame(this.currentY);


		if(this.state.scrollDelta && !this.state.delayAnimtions)
		{
			this.animateTargets()

			if(this.options.onscroll) this.options.onscroll(this.currentY);
		}

		this.saveState();

		requestAnimationFrame( ()=> this.animateLoop() );
	}

	animateTargets()
	{
		const targets = this.targets.filter( t => this.viewPortFits(t).inView || getComputedStyle(t.el).position == 'fixed' || getComputedStyle(t.el).position == 'absolute');
		for(const t of targets)
		{
			// if(this.state.scrolling != this.state.scrollingSav)
			// {
			// 	t.el.style.transition = this.state.scrolling
			// 		? 'all 0.3s ease-out'
			// 		: 'all 0.3s ease-in'
			// }
			// else t.el.style.transition = '';
			//Math.trunc(this.state.scrollY * 10) / 10

			t.update();
		}
	}

	addTarget(t, ops)
	{
		if(!t)
			throw new Error('Invalid target!');

	    this.targets.push( new SimpoTarget(this, t, ops) );
	}

	addSnap(t, ops = {})
	{
		if(!t)
			throw new Error('Invalid target!');

		const snap = {el: t, ...def_snap_ops, ...ops}

		this.snaps.push( snap );
		this.snaps.sort((a,b) => b.el.offsetTop - a.el.offsetTop < 0 ? 1 : -1 );
	}

	// get snapXNext()
	// {
	// 	if(this.state.scrolling < 0)
	// 	{
	// 		for(let i=this.snaps.length-1; i > 0; i--)
	// 		{
	// 			if(this.snaps[i].el.offsetTop < this.state.realYSav)
	// 				return this.snaps[i].el.offsetTop;
	// 		}
	// 		return 0;
	// 	}
	//
	// 	if(this.state.scrolling > 0)
	// 	{
	// 		for (let i = 1; i < this.snaps.length - 1; i++)
	// 		{
	// 			if (this.snaps[i].el.offsetTop > this.state.realYSav) return this.snaps[i].el.offsetTop;
	// 		}
	// 		return this.options.scroller.scrollHeight;
	// 	}
	// }

	get snapNext()
	{
		const currentY = this.options.virtualScroll ? this.state.targetYSav : this.state.realYSav;
		if(currentY > this.snaps[this.snaps.length-1].el.offsetTop)
			return this.snaps[this.snaps.length-1];

		for (let i = 1; i < this.snaps.length-1; i++)
		{
			if (this.snaps[i].el.offsetTop > currentY)
				return this.snaps[i] //.el.offsetTop;
		}

		// impossible but happens
		return this.snaps[this.snaps.length-1];
	}

	get snapPrev()
	{
		const currentY = this.options.virtualScroll ? this.state.targetYSav : this.state.realYSav;
		if(currentY <= this.snaps[0].el.offsetTop + this.snaps[0].el.offsetHeight)
			return this.snaps[0];

		for(let i=this.snaps.length-1; i > 0; i--)
		{
			if(this.snaps[i].el.offsetTop < currentY)
				return this.snaps[i]; //.el.offsetTop;
		}


		// impossible but happens
		return this.snaps[0];
	}

	// snapCheckz()
	// {
	// 	if (this.snapping || !this.snaps.length) return;
	// 	const
	// 		scrolling = this.options.virtualScroll ? this.state.targetDelta : this.state.scrolling,
	// 		currentY =  this.options.virtualScroll ? -this.state.targetY : this.state.realY,
	// 		curSnap =  this.snaps[this.snaps.indexOf(this.snapPrev)+1],
	// 		i = this.snaps.indexOf(curSnap);
	//
	// 	const curvis = this.snaps.filter(s => s.el.style.display != 'none');
	//
	// 	if(!curvis.length) return; // wtf
	//
	// 	let idx = this.snaps.indexOf(curvis[0])
	//
	// 	if(currentY == 0 && idx > 0)
	// 	{
	// 		this.options.scroller.classList.add('no-scroll');
	// 		this.snaps[idx-1].el.style.display = 'block';
	// 		this.options.scroller.scrollTo(0, this.snaps[idx-1].el.offsetHeight + currentY);
	//
	// 		this.snaps.slice(idx+2).forEach(s => s.el.style.display = 'none');
	//
	// 		this.options.scroller.classList.remove('no-scroll');
	// 		return;
	// 	}
	//
	// 	idx = this.snaps.indexOf(curvis[curvis.length - 1]);
	//
	// 	if( idx < this.snaps.length - 1 && currentY >= (this.options.scroller.scrollHeight - this.snaps[idx+1].el.offsetHeight - window.innerHeight)-10)
	// 	{
	// 		this.options.scroller.classList.add('no-scroll');
	// 		this.snaps[idx+1].el.style.display = 'block';
	// 		this.snaps.slice(0, idx-1).forEach(s => s.el.style.display = 'none');
	// 		//this.options.scroller.scrollTo(0, currentY - this.snaps[idx+1].el.offsetHeight);
	//
	// 		this.snaps.slice(0, idx-1).forEach(s => s.el.style.display = 'none');
	//
	// 		this.options.scroller.classList.remove('no-scroll');
	// 		return;
	// 	}
	//
	// 	// const btm = curvis[curvis.length - 1].el.offsetTop + curvis[curvis.length - 1].el.offsetHeight;
	// 	//
	// 	// curSnap.el.getBoundingClientRect().top == 0
	// 	// this.snaps.slice(0, i-1).forEach(s => s.el.style.display = 'none');
	// 	// this.snaps.slice(i+2).forEach(s => s.el.style.display = 'none');
	// }


	snapCheck()
	{
		return;

		if(this.snapping || !this.snaps.length) return;

		const
			scrolling = this.options.virtualScroll ? this.state.targetDelta : this.state.scrolling,
			currentY =  this.options.virtualScroll ? -this.state.targetY : this.state.realY,
			snap = scrolling < 0 ? this.snapPrev : this.snapNext;

		// if( (scrolling > 0 && currentY > snap.el.offsetTop) || (scrolling < 0 && currentY < snap.el.offsetTop) )
		// {
		// 	if( this.options.virtualScroll )
		// 		this.state.targetY = -snap.el.offsetTop;
		// 	else
		// 		this.state.realY = snap.el.offsetTop;
		//
		// 	this.snapDelay(snap.el.offsetTop, 0.2);
		//
		// 	if( (scrolling > 0 && this.options.scroller.scrollTop > currentY) || (scrolling < 0 && this.options.scroller.scrollTop < currentY) )
		// 		this.options.scroller.scrollTo(0, currentY);
		// 	return
		// }



		if(scrolling > 0)
		{
			const cursnap = this.snaps[ this.snaps.indexOf(snap) - 1 ];

			if(cursnap)
			{
				const rct = cursnap.el.getBoundingClientRect();
				if(rct.bottom >= window.innerHeight/3 && rct.bottom < window.innerHeight)
				{
					const ofs = (window.innerHeight - rct.bottom) / window.innerHeight;
					if(ofs >= cursnap.toDown)
					{
						this.snapTo(snap.el.offsetTop, Math.max(cursnap.durOut, snap.durIn))
					}
				}
			}

			// for(let i = 0; i < this.snaps.length - 1; i++)
			// {
			// 	const rct = this.snaps[i].el.getBoundingClientRect();
			// 	if(rct.bottom >= window.innerHeight/3 && rct.bottom < window.innerHeight)
			// 	{
			// 		const ofs = (window.innerHeight - rct.bottom) / window.innerHeight;
			// 		if(ofs >= this.snaps[i].toDown)
			// 		{
			// 			this.snapTo(this.snaps[i+1].el.offsetTop, Math.max(this.snaps[i].durOut, this.snaps[i+1].durIn))
			// 		}
			// 	}
			// }
		}
		else if(scrolling < 0)
		{
			const cursnap = this.snaps[ this.snaps.indexOf(snap) + 1 ];
			if(cursnap)
			{
				const rct = cursnap.el.getBoundingClientRect();
				const ofs = rct.top / window.innerHeight;
				if (ofs >= cursnap.toUp)
				{
					this.snapTo(snap.el.offsetTop, Math.max(cursnap.durOut, snap.durIn))
				}
			}

			// for(let i = this.snaps.length - 1; i > 0; i--)
			// {
			// 	const rct = this.snaps[i].el.getBoundingClientRect();
			// 	if (rct.top > 0 && rct.top <= window.innerHeight / 2)
			// 	{
			// 		const ofs = rct.top / window.innerHeight;
			// 		if (ofs >= this.snaps[i].toUp)
			// 		{
			// 			console.log(`snap UP sect#${i}  ofs: ${ofs}  to: ${this.snaps[i-1].el.offsetTop}`);
			// 			this.snapTo(this.snaps[i-1].el.offsetTop, Math.max(this.snaps[i].durOut, this.snaps[i-1].durIn));
			// 			break;
			// 		}
			// 	}
			// }
		}
	}

	snapDelay(y, dur = 0.2)
	{
		this.snapping = true;
		this.snapStop = y;
		this.snapDelta = y - this.state.realY;
		this.options.scroller.classList.add('no-scroll');
		this.options.scroller.classList.add('scroll-delay');

		setTimeout(() =>
		{
			//this.options.scroller.style.overflowY = savOY;
			this.options.scroller.classList.remove('no-scroll');
			this.options.scroller.classList.remove('scroll-delay');
			this.options.scroller.scrollTo(0, y);
			this.options.wrapper.style = '';

			this.state.targetY = -y;
			this.state.targetYSav = -y;
			this.state.preRealY = -y;
			this.state.preRealYSav = -y;

			this.state.realY = y;
			this.state.realYSav = y;
			this.state.scrolling = 0;
			this.state.scrollingSav = 0;
			this.snapping = false;

			this.snapStop = 0;
			this.snapDelta = 0;
			//setTimeout( () => this.snapping = false, 100);

			console.log(`snap stop at ${y}`);

		}, dur*1000 + 500 );
	}

	snapTo( y, dur = 0.2 )
	{
		//if(Math.abs(y - this.state.realY) < 1) return;

		// this.snapping = true;
		// this.snapStop = y;
		// this.snapDelta = y - this.state.realY;

		const
			sy = -(y - this.state.realY),
			sdur = dur + dur * Math.trunc( Math.abs(this.snapDelta)/window.innerHeight );

		console.log(`snap start from ${this.state.realY} to ${y} sy: ${sy} dur ${dur} sdur ${sdur}`);

		this.snapDelay(y, sdur);

		this.options.wrapper.style = `transition: all ${sdur}s ease-out; transform: translateY(${sy}px)`;
	}

}


export const simpoScroller = new SimpoScroller();

window.simpoScroller = simpoScroller;

