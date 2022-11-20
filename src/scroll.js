import lax from 'lax.js'

const
	wrapper = document.querySelector('.wrapper'),
	sects = [...wrapper.querySelectorAll('section')];


let priorY = 0, isSnapping = true, lastDir = '';

const

	sectionsIVP = (y) =>
	{
		const
			sh = document.body.offsetHeight, // height: 100vh
			curY = wrapper.scrollTop;

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

			if(s.inView >= 0.5) return s;
		}
	},

	snapTo = (y) =>
	{
		if(isSnapping) return;

		isSnapping = true;
		wrapper.classList.add('no-scroll');
		wrapper.scrollTo({left: 0, top: y, behavior: 'smooth'});
		setTimeout(()=>
		{
			isSnapping = false;
			wrapper.classList.remove('no-scroll');
		}, 666);
	},

	YSnapDriver = () =>
	{
		const
			curY = wrapper.scrollTop,
			toUp = priorY > curY,
			toDown = priorY < curY;
			//curDir = toDown ? 'down' : toUp ? 'up' : '';


		//if(Math.abs(priorY - curY) > 2)
		priorY = curY;

		const sh = document.body.offsetHeight; // height: 100vh

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
			if(curY >= sh/4*3 && curY < sh)
			{
				console.log(`SNAPUJU! ${curY}`);
				snapTo(sh);
			}
			else if( curY > sh && (curY + sh) - (s.offsetTop + s.offsetHeight)  > 10 )
			{
				const n = sects[sects.indexOf(s) + 1];
				if(n) snapTo(n.offsetTop);
			}
		}

		if(toUp && curY > sh/3)
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

		scrollY: {

			perspective: [
				[0],
				[1000],
			],

			rotateX: [
				["elCenterY - 100", "elOutY"],
				[0, 33],
				{
						easing: 'easeOutCubic'
				}
			],

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

				"background-size": [
					["elCenterY - 0", "elOutY"],
					[20, 0],
					{
						easing: 'easeOutCubic',
						cssFn: (val) => {
							// console.log(`val ${val}`);
							return `auto calc(100% + ${val}%`;
						}
					}
				],
				"background-position-y": [
					["elCenterY - 0", "elOutY"],
					[0.0, -19],
					{
						easing: 'easeOutCubic',
						cssFn: (val) => {
							// console.log(`val ${val}`);
							return val + '%';
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

		const smenu = wrapper.querySelector('.start ol.menu');

		smenu.parentElement.style.height = smenu.offsetHeight + 'px';
		smenu.style.position = 'fixed';

		lax.addElement(smenu, {

			scrollY: {

				translateY: [
					["elCenterY", "elOutY-elHeight", "elOutY+elHeight*2"],
					[0, 0,  "-elHeight" ],
					{
						//cssUnit: '%', // ! NOT WORK!
						// easing: 'easeOutQuad'
						// cssFn: (val) => {
						// 	console.log(`val ${val}`);
						// 	return `(${val}%)`;
						// }
					}
				],
			},
		},

		{
			//
			// onUpdate: (d, el) =>
			// {
			// 	if(document.body.offsetHeight >= d.scrollY[0])
			// 	{
			// 		const ofs = -(el.offsetHeight + 50) * (1 - (document.body.offsetHeight - d.scrollY[0])/document.body.offsetHeight);
			// 		//el.style.top = `calc(${ofs}% - 60px)`;
			// 		el.style.top = `${ofs}px`;
			// 	//	el.style.top = `calc(${ofs}px + 50px)`;
			// 	//	el.style.transform = `translateY(-100%)`;
			// 	}
			//
			// 	//console.log('ou', a.scrollY[0]);
			// }

		});


	};


export const attachScroll = bindScroll;


