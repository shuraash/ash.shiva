import lax from 'lax.js'
import {onStart} from './util.js';


onStart(() => {

	const
		wrapper = document.querySelector('.wrapper'),
		sects = [...wrapper.querySelectorAll('section')];

	window.sects = sects;

	let priorY = 0, isSnapping = false, lastDir = '';

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
				toDown = priorY < curY,
				curDir = toDown ? 'down' : toUp ? 'up' : '';


			//if(Math.abs(priorY - curY) > 2)
				priorY = curY;

			const sh = document.body.offsetHeight; // height: 100vh

			if(isSnapping) return curY;

			const s = sectionsIVP();

			if(lastDir != curDir)
			{
				if(curDir) console.log(`hujachim ${curDir} y: ${curY}`);
				lastDir = curDir;
			}

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
		}

	window.sectionsIVP = sectionsIVP;


	lax.init()

	lax.addDriver('scrollY', YSnapDriver)

	// // Add animation bindings to elements
	// lax.addElement(wrapper,
	//
	// 	{
	// 		scrollY: {
	// 			// translateX: [
	// 			//  ["elInY", "elCenterY", "elOutY"],
	// 			//  [0, 'screenWidth/2', 'screenWidth'],]
	// 			translateX: [
	// 				["elInY", "elCenterY", "elOutY"],
	// 				[0,0,0]
	// 			],
	// 			translateY: [
	// 				["elInY", "elCenterY", "elOutY"],
	// 				[0,0,0]
	// 			],
	// 			translateZ: [
	// 				["elInY", "elCenterY", "elOutY"],
	// 				[0,0,0]
	// 			],
	// 		},
	// 	},
	//
	// 	{
	// 		onUpdate: function (driverValues, domElement)
	// 				  {
	// 					  console.log(driverValues.scrollY);
	// 					  // domElement.style.transform = ``;
	// 				  }
	// 	}
	// );

	lax.addElement(wrapper.querySelector('.start div'),

		{
			scrollY: {
				perspective: [
					[0],
					[1000],
				],

				rotateX: [
					["elCenterY", "elOutY"],
					[0, 30],
					{
						easing: 'easeOutQuad'
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

				translateY: [
					["elCenterY", "elOutY"],
					[0, -30],
					{
						easing: 'easeOutQuad'
					}
				],

				scale: [
					["elInY", "elCenterY", "elOutY"],
					[1.1, 1.1 , 0.9],
					// {
					// 	easing: 'easeOutBack'
					// }
				]
			}
		},

		// {
		// 	cssUnit: '%'
		// }
	)

	document.body.classList.add('loaded');

});