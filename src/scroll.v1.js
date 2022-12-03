import './lax.js'

const
	wrapper = document.querySelector('.wrapper'),
	sects = [...wrapper.querySelectorAll('section')];


let priorY = false, isSnapping = false, lastDir = '';

const

	isTouchDevice = () =>
		 (  ('ontouchstart' in window)     ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0)
		 ),


	scrollRoot = document.scrollingElement,

	sectionsIVP = (log = false) =>
	{
		const
			// 150 menu margin
			sh = window.innerHeight  , // height: 100vh
			curY = scrollRoot.scrollTop ; //window.scrollY;

		let ret;

		for(const s of sects)
		{
			s.inView = !(s.offsetTop >= curY + sh) && !(s.offsetTop + s.offsetHeight < curY)

			if(s.inView)
			{
				const
					dt = s.offsetTop - curY,
					db = (curY + sh) - (s.offsetTop + s.offsetHeight);

				s.inView = ( sh - ( dt > 0 ? dt : db > 0 ? db : 0) ) / sh;
			}

			if(s.inView >= 0.5) ret = s; //return s;

			if(log) console.log(s.inView, s);
		}

		return ret;
	},


	snapTo = (y) =>
	{
		if(isSnapping) return;

		console.log(`snapnul to ${y}`);
		// y -= 150;

		isSnapping = true;
		document.body.classList.add('no-scroll');

		//scrollRoot.scrollTo({left: 0, top: y, behavior: 'smooth'});
		// animDriver.from = scrollRoot.scrollTop;
		// animDriver.cur = scrollRoot.scrollTop;
		// animDriver.to = y;
		console.log(`transition: top 0.33s ease-in-out; top: ${y - scrollRoot.scrollTop}px`);
		wrapper.style = `transition: top 0s ease-in-out; top: 0px`
		requestAnimationFrame( () => wrapper.style = `transition: top 0.77s ease-in-out; top: ${-1*(y - scrollRoot.scrollTop)}px` );

		setTimeout(()=>
		{
			console.log(`end snappo`);
			isSnapping = false;
			wrapper.style = ` top: 0`;
			scrollRoot.scrollTo(0, y);
			document.body.classList.remove('no-scroll');
		}, 666);
	},

	YSnapDriver = () =>
	{
		// if(priorY === false && isTouchDevice() && wrapper.scrollTop)
		// {
		// 	window.scrollTo(0,1)
		// }
		// if(isSnapping)
		// {
		// 	animDriver.cur +=  (animDriver.to - animDriver.from) / ( animDriver.dur / ( 1000/60 ) );
		// 	scrollRoot.scrollTo(0, animDriver.cur);
		// }

		const
			curY = isSnapping ? parseInt(getComputedStyle(wrapper).top) + scrollRoot.scrollTop : scrollRoot.scrollTop, //window.scrollY, // wrapper.scrollTop,
			toUp = priorY > curY,
			toDown = priorY < curY;
			//curDir = toDown ? 'down' : toUp ? 'up' : '';


		//if(Math.abs(priorY - curY) > 2)
		priorY = curY;

		const sh = window.innerHeight; // height: 100vh

		if(isSnapping) return curY;

		const s = sectionsIVP();

		// if(lastDir != curDir)
		// {
		// 	if(curDir) console.log(`hujachim ${curDir} y: ${curY}`);
		// 	lastDir = curDir;
		// }

		if(toDown)
		{
			// 1st screen is special
			// if(curY >= sh/2*1 && curY < sh)
			// {
			// 	console.log(`SNAPUJU! ${curY}`);
			// 	snapTo(sh);
			// }
			//else
			if( curY > sh && (curY + sh) - (s.offsetTop + s.offsetHeight)  > 10 )
			{
				const n = sects[sects.indexOf(s) + 1];
				if(n) snapTo(n.offsetTop);
			}
		}

		if(toUp && curY > sh/3 && curY > sh)
		{
			//	if( (curY+sh) - (s.offsetTop + s.offsetHeight) >= 10 && curY > s.offsetTop)
			if( curY - s.offsetTop < -10 )
			{
				const p = sects[sects.indexOf(s) - 1];
				if(p) snapTo(p.offsetTop);
			}
		}

		return curY;
	},


	transforms = {
//transform: translateY(-120px) perspective(1000px) rotateX(33deg) scale(0.7);
		scrollY: {

			perspective: [
				[0],
				[1000],
			],

			rotateX: [
				["0", "elOutY+150"],
				[0, 33],
				{
						// easing: 'easeOutCubic'
				}
			],

			scale: [
				["0", "elCenterY", "elOutY+150"],
				[1, 1, 0.2],
				{
						// easing: 'easeOutCubic'
				}
			],
			transition: [
				[0],
				[0], {
					cssFn: (val) => {
						return 'all 0.07s linear'
					}
				}

			],
//{style: 'transition:  all 0.1s ease-in'}
				// transform: [
				// 	["elInY", "elCenterY", "elOutY"],
				// 	[0, 0, 30],
				// 	{
				// 		cssFn: (val) => {
				// 			console.log(`val ${val}`);
				// 			return '50%'
				// 		}
				// 	}
				// ],

				// translateY: [
				// 	["elCenterY", "elOutY"],
				// 	[0, -30],
				// 	{
				// 		// easing: 'easeOutQuad'
				// 	}
				// ],
//background-size: auto calc(100% + 120px);
				"background-size": [
					["0", "elOutY+150"],
					[120, 0],
					{
						easing: 'easeOutCubic',
						cssFn: (val) => {
							// console.log(`val ${val}`);
							return `auto calc(100% + ${val}px`;
						}
					}
				],

			//background-position: c calc(50% + 60px)
				"background-position": [
					["0",   "elOutY+150"],
					[60, 0],
					{
						easing: 'easeOutCubic',
						cssFn: (val) => {
							// console.log(`val ${val}`);
							return `center calc(50% + ${val}px)`;
						}
					}
				],

				// scale: [
				// 	["elCenterY - 100", "elOutY"],
				// 	[1 , 1],
				// 	{
				// 		easing: 'easeOutCubic'
				// 	//	inertia: 0.5,
				// 	}
				// ]
		}
	},

	bindScroll = () =>
	{
		lax.init();
		lax.addDriver('scrollY', YSnapDriver);
		lax.addElement(wrapper.querySelector('.start div.bk'), transforms);

		//const smenu = wrapper.querySelector('.start ol.menu');
		// smenu.parentElement.style.height = smenu.offsetHeight + 'px';
		// smenu.style.position = 'fixed';

		lax.addElement( document.querySelector('ol.menu'), {},

		{
			//
			onUpdate: (d, el) =>
			{
				if(d.scrollY[0] >= -100 && d.scrollY[0] < window.innerHeight/2)
				{
					const
						ty =  40 * (1-(d.scrollY[0]/(window.innerHeight/2))) ,
						tp = 150 * (1-(d.scrollY[0]/(window.innerHeight/2))) ;

					 el.style.transform = `translateY( calc(${ty}vh - ${tp}px) )`;
					//el.style.transform = `${ofs}px`;
				//	el.style.top = `calc(${ofs}px + 50px)`;
				//el.style.transform = '';


				//	console.log(el.style.transform);
				}
				else  el.style.transform = '';


				//console.log('ou', a.scrollY[0]);
			}

		});


	};

window.sectionsIVP = sectionsIVP;
window.snapTo = snapTo;

export const attachScroll = bindScroll;


