import {isMobile, onStart} from './util.js';
import {attachScroll} from './scroll.js';

onStart(() =>
{
 	attachScroll();
	document.body.classList.add('loaded');
	window.scrollTo(0,0);

//	alert(`--vh set to ${CSS_REAL_VH}px`);

	const
		wResize = () =>
		{
			document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
			document.body.style.setProperty('--vhf', `${window.innerHeight}px`);

			// if( isMobile() && simpoScroller.toBody )
			// {
			// 	//&& screen.height - innerHeight > 120)
			// 	document.querySelector('sd-span').classList.toggle('hidden', !(isMobile() && screen.height - innerHeight > 120))
			// }
		};

	window.addEventListener('resize', wResize);

	wResize();

  let pp0, pp1 = 0;


	// document.addEventListener('touchstart', e =>
	// {
	// 	pp0 = e.changedTouches[0].clientY;
	// });
	//
	// document.addEventListener('touchmove', e =>
	// {
	// 	const d = e.changedTouches[0].clientY - pp0;
	// 	if(Math.abs(d) > 50)
	// 	{
	// 		e.changedTouches[0].clientY = e.changedTouches[0].clientY + pp0;
	// 		e.targetTouches[0].clientY = e.changedTouches[0].clientY + pp0;
	// 		e.touches[0].clientY = e.changedTouches[0].clientY + pp0;
	// 	}
	// }, {passive: false});

});