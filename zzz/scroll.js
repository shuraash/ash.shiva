import {simpoScroller} from './simposcrol.js'
import {isMobile} from './util.js';

const
	wrapper =  document.querySelector('#wrapper'),
	sects = [...document.querySelectorAll('section')],
	menu = document.querySelector ('#menu');

menu._current = 'whoiam';

const
	//
	// rangeVal = (start, end, from, to, val) =>
	// {
	// 	if(val <= start) return from;
	// 	if(val >= end) return to;
	// 	let q = (val - start) / (end - start);
	//
	// 	return from + (to - from) * q;
	// },
	//
	// inViewPort = (rect, dy = 0, h = innerHeight) =>
	// {
	// 	let {top, bottom} = rect;
	// 	top += dy;
	// 	bottom += dy;
	// 	return  top < h && bottom > 0
	// 		? ((bottom >= h ? h : bottom) - (top >= 0 ? top : 0)) / h
	// 		: false;
	// },


	// inViewPort2 = (rect, y = 0, h = innerHeight, ofs = 0) => rect.top < innerHeight && rect.bottom > 0
	// 	? ((rect.bottom >= innerHeight ? innerHeight : rect.bottom) - (rect.top >= 0 ? rect.top : 0)) / innerHeight
	// 	: false,

	activeSect = () => sects
		.filter(s => (s._vp_prc = inViewPort( s.getBoundingClientRect(), parseFloat(wrapper.style.marginTop) || 0 )) )
		.sort( (a,b) => b._vp_prc - a._vp_prc)[0],


	menuSetCurrent = (key) =>
	{
		let cur = menu.querySelector('.current');

		if( !(cur && cur.dataset.key == key) )
		{
			if(cur) cur.classList.remove('current');
			cur = menu.querySelector(`li[data-key="${key}"]`);
			if(cur) cur.classList.add('current');

			if(cur == 'whoiam' && 'onwheel' in window) bounceWheelShit();
		}

		// if(menu._current != key)
		// {
		// 	menu.querySelectorAll('li').forEach(li => li.classList.toggle('current', key == li.dataset.key));
		// 	menu._current = key;
		// }
	},

	scrollToSect = (key) =>
	{
		wrapper.scrollTo({left: 0, top: wrapper.querySelector(`section[data-key="${key}"]`).offsetTop, behavior: 'smooth'});
	},

	bindMenu = () =>
	{
		menu.querySelectorAll('li').forEach(li => li.addEventListener('click', ev =>
		{
			menuSetCurrent( li.dataset.key );
			scrollToSect( li.dataset.key );
		}));
	},

	bindScroll = () =>
	{
		bindMenu();

		// simpoScroller.options.scroller = isMobile() && window.innerWidth < window.innerHeight
		// 		? document.scrollingElement
		// 		: wrapper;

		simpoScroller.options.scroller  = wrapper;

		//simpoScroller.options.onSimpoScrollStop = () => menuSetCurrent( activeSect().dataset.key );
		simpoScroller.options.onscroll = () => menuSetCurrent( activeSect().dataset.key );

		const me = wrapper.querySelector('[data-key="whoiam"] div.bk');


		simpoScroller.addTarget(me, {

				update: (target, curY, ops) =>
				{
					const
						meorg = me.offsetHeight / 1540,

						qy = (curY / window.innerHeight) - Math.trunc(curY / window.innerHeight ),
						qp = qy * 100,

						bs =  rangeVal(0,86, me.offsetHeight*.22, 0, qp),

					//	bp =  rangeVal(0, 86,  60, 0, qp),

						bp =  rangeVal(0, 86,  bs/2, 0, qp),

						sfx = rangeVal(0,99, 1, 0.22, qp),

						//sfy = rangeVal(0,70, 1, 0.4, qp),

						ra =  rangeVal( 0, 90, 0, 40, qp);

					target.style.transition = '';

					target.style.backgroundSize = `auto calc(100% + ${bs}px)`;

				     target.style.backgroundPosition = `center calc(50% + ${bp}px)`;

					 target.style.scale = sfx; //`${sfx} ${sfy}`;

					 target.style.transform = `rotateX(${ra}deg)`;

				 	 //console.log(qy * 100, target.style.scale);
				}
			});


		simpoScroller.addTarget( document.querySelector('#menu'),
	{
				update: (target, curY, ops) =>
				{
					const
						qy = (curY / innerHeight) - Math.trunc(curY / innerHeight ),
						qp = qy * 100,
						px =  rangeVal(0,83,  innerWidth < 640 ? 74 : 116, 0, qp),
						//wmt =  rangeVal(90, 100,  (innerWidth >= 640) ? 20 : 0, (innerWidth >= 640) ? 126 : 90, qp),
						wmt =  rangeVal(90, 100,   (innerWidth >= 640) ? -110 : -90, 0,  qp),
						br =  rangeVal(80, 100,   0, (innerWidth >= 640) ? 16 : 0, qp);


				//	target.classList.toggle('at-start', simpoScroller.options.scroller.scrollTop < window.innerHeight - 16);

					// if(curY < innerHeight)
					// 	wrapper.style.marginTop = wmt + 'px';
					// else
					// 	wrapper.style.marginTop = '';

					if(curY < innerHeight)
						wrapper.style.translate = '0 ' + wmt + 'px';
					else
						wrapper.style.translate = '';
					//ranslate: 0 -110px;



					target.style.transform =  curY < window.innerHeight
						? `translateY( ${px}px )` //- ${px}px)
						: '';


					target.style.borderRadius = curY <  window.innerHeight  // curY <  window.innerHeight * 0.8
						? innerWidth >= 640 ? `${br}px` : ''
						: innerWidth >= 640 ? '16px' : '';


				//	target.querySelector('[data-key=whoiam]').classList.toggle('active', document.scrollingElement.scrollTop > window.innerHeight/2 )

				//	console.log(`curY: ${curY}, px: ${px}, wmt: ${wmt}, targ.transf: ${target.style.transform}, wrpmt: ${wrapper.style.marginTop}`);
				}
			});

		// sects.forEach( (s, i) => i < 0
		// 	? simpoScroller.addSnap(s, {toDown: 0.5, durIn: 0.6})
		// 	: simpoScroller.addSnap(s)
		// );

		simpoScroller.run();

	};


export const attachScroll = bindScroll;

window.activeSect = activeSect;
window.menuSetCurrent = menuSetCurrent;
window.scrollToSect = scrollToSect;
window.inViewPort = inViewPort;