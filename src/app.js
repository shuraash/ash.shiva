import {isMobile, onStart} from './util.js';
import {attachScroll} from './scroll.js';

onStart(() =>
{
 	attachScroll();
	document.body.classList.add('loaded');
	window.scrollTo(0,0);

	let

		isPortrait = () => window.innerWidth < window.innerHeight,

		lastIsPortrait = isPortrait(),

		ots, pts,

		pics = document.querySelectorAll('section[data-key=skills] img'),
		wsect =  document.querySelector('section[data-key=whoiam]'),
		me = document.querySelector('section[data-key=whoiam] .back'),
		figure = document.querySelector('section[data-key=whoiam] figure'),
		mep = me.querySelector('.bk'),

		upMeSizes = () =>
		{
			//wsect.offsetHeigh + wsec.offsetTop
			// and me :)
			let meb = me.parentElement.offsetHeight - (figure.offsetHeight + figure.offsetTop + 32);

			console.log(`meb : ${meb} me.parentElement.offsetHeight : ${me.parentElement.offsetHeight} puk: ${(figure.offsetHeight + figure.offsetTop)}`);

			let mxh = (me.parentElement.offsetWidth - 32) / 0.866;

			if (mxh > 540) mxh = 540;

			me.style.maxHeight = mxh + 'px';

			me.style.height = meb + 'px';

			let mhw = (me.offsetHeight * .866);
			me.style.maxWidth = mhw + 'px';

			// recalc again
			meb = me.parentElement.offsetHeight - (figure.offsetHeight + figure.offsetTop + me.offsetHeight + 32);
			me.style.bottom = meb > 16 ? meb + 'px' : '16px';
		},


		wResize = () =>
		{
			document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
			document.body.style.setProperty('--vhf', `${window.innerHeight}px`);

			if( isMobile() )
			{
				if(ots) clearTimeout(ots);
				// if check immediatelly - have wrong result
				ots = setTimeout( ev =>
				{
					if (isPortrait() && !lastIsPortrait)
					{
						lastIsPortrait = true;
						wResize();
						//requestAnimationFrame( () => simpoScroller.animateTargets() );
					}
					else
 					    lastIsPortrait = isPortrait()



					// const phoneGap = isPortrait() && screen.height - innerHeight > 120;
					//
					// simpoScroller.options.scroller = phoneGap ? document.scrollingElement : document.querySelector('#wrapper');
					//
					// document.querySelector('sd-span').classList.toggle('hidden', !phoneGap);


				}, 123);


					//document.querySelector('sd-span').classList.toggle('hidden', !isPortrait() || screen.height - innerHeight < 120)
			}

			requestAnimationFrame( () => { upMeSizes(); simpoScroller.animateTargets() } );

			// if( isMobile() && simpoScroller.toBody )
			// {
			// 	//&& screen.height - innerHeight > 120)
			// 	document.querySelector('sd-span').classList.toggle('hidden', !(isMobile() && screen.height - innerHeight > 120))
			// }


		};

	// pics.forEach(s => {
	// 	s.style.height = s.offsetHeight + 'px';
	// 	s.style.width = s.offsetWidth + 'px';
	// });

	mep._rotateY = 0;


	document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
	document.body.style.setProperty('--vhf', `${window.innerHeight}px`);

	window.addEventListener('resize', ev => wResize());

	wResize();


	window.addEventListener('contextmenu', ev => {
		ev.preventDefault();
		ev.stopPropagation();
		return false;
	}, {capture: true});

	me.addEventListener('pointerdown', ev =>
	{

			if (ev.x < (innerWidth / 2 - 8) && mep._rotateY > -25)
			{
				mep._rotateY = -25;
				//mep.style.transform = 'rotateX(0deg) rotateY(-12deg)'
			}
			else if (ev.x > (innerWidth / 2 + 8) && mep._rotateY < 25)
			{
				mep._rotateY = 12;
				//mep.style.transform = 'rotateX(0deg) rotateY(12deg)'
			}
			else
			{
				mep._rotateY = 0;
				//mep.style.transform = 'rotateX(0deg) rotateY(0deg)'
			}

			let meprec = mep.getBoundingClientRect();

			if (ev.y < (meprec.top + meprec.height/2 - 8) && mep._rotateX > -25)
			{
				mep._rotateX = 25;
				//mep.style.transform = 'rotateX(0deg) rotateX(-12deg)'
			}
			else if (ev.y > (meprec.top + meprec.height/2 + 8) && mep._rotateX < 25)
			{
				mep._rotateX = -25;
				//mep.style.transform = 'rotateX(0deg) rotateX(12deg)'
			}
			else
			{
				mep._rotateX = 0;
				//mep.style.transform = 'rotateX(0deg) rotateX(0deg)'
			}			

			let t = `rotateX(${mep._rotateX}deg) rotateY(${mep._rotateY}deg)`;

			if (mep.style.transform != t)
			{
				mep.style.transition = 'all 0.6s ease-in-out';
				mep.style.transform = t;
			//	setTimeout(() => mep.style.transition = '', 900);
			}
			
	})

	me.addEventListener('pointerup', ev =>
	{
		if (mep.style.transform != '')
		{
			mep.style.transition = 'all 0.6s ease-in-out';
			mep.style.transform = '';
			//setTimeout(() => mep.style.transition = '', 900);
		}
	});

	me.addEventListener('pointerout', ev =>
	{
		if (mep.style.transform != '')
		{
			mep.style.transition = 'all 0.9s ease-in-out';
			mep.style.transform = '';
			setTimeout(() => mep.style.transition = '', 900);
		}
	});

});