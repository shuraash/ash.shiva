import {isMobile, onStart, isPortrait, rangeVal} from './util.js';
import {simpoScroller} from './simposcrol.js';
import {upMeSizes} from './components/js/_section.whoiam.js';
import './_index.js';

window.addEventListener("beforeunload", (event) => window.scrollTo(0,0));

const wrapPoint = 640;

onStart(() =>
{

	document.body.classList.add('loaded');
	window.scrollTo(0,0);

	simpoScroller.options.scroller  = wrapper;
	simpoScroller.run();

	let
		lastIsPortrait = isPortrait(),
		ots,
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

	window.addEventListener('resize', ev => wResize());

	wResize();

	window.addEventListener('contextmenu', ev => {
		ev.preventDefault();
		ev.stopPropagation();
		return false;
	}, {capture: true});



});