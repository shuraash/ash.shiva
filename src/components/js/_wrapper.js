

	import {simpoScroller} from './../../simposcrol.js';
	import {rangeVal, inViewPort} from './../../util.js';

	const
			wrapPoint = 640,
			wrapperEl =  document.querySelector('#wrapper'),
			sectEls = [...document.querySelectorAll('section')];

	export const sectos = {

		get active()
		{
			return sectEls
				.filter(s => (s._vp_prc = inViewPort( s.getBoundingClientRect(), parseFloat(wrapper.style.marginTop) || 0 )) )
				.sort( (a,b) => b._vp_prc - a._vp_prc)[0]
		},

		set active(key)
		{
			const ds = wrapper.querySelector(`section[data-key="${key}"]`);
			if(ds)
				wrapperEl.scrollTo({left: 0, top: ds.offsetTop, behavior: 'smooth'});
		}
	}


	simpoScroller.addTarget(wrapperEl, (curY, vprc) =>
	{
		const wmt =  rangeVal(90, 100,   (innerWidth >= wrapPoint) ? -110 : -90, 0,  vprc);
		if(curY < innerHeight)
			wrapper.style.translate = '0 ' + wmt + 'px';
		else
			wrapper.style.translate = '';
	});


	window.sectos = sectos;



import './_section.whoiam.js';
import './_section.trance.js';