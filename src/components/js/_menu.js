

 	import {simpoScroller} from './../../simposcrol.js';
	import {rangeVal} from './../../util.js';

	import {sectos} from './_wrapper.js';

	const
		wrapPoint = 640,
		elMenu = document.querySelector('#menu');

	class Menu{

		constructor()
		{
			elMenu.querySelectorAll('li').forEach(li => li.addEventListener('click', ev => {
				this.current = li.dataset.key;
				sectos.active = li.dataset.key;
			}));

			this.aniUpdate = this.aniUpdate.bind( this );
			simpoScroller.addTarget( elMenu, this.aniUpdate );

			simpoScroller.options.onscroll = () => this.current = sectos.active.dataset.key;
		}

		aniUpdate(curY, vprc)
		{
			const
				px =  rangeVal(0,83,  innerWidth < wrapPoint ? 74 : 116, 0, vprc),
				br =  rangeVal(80, 100,   0, (innerWidth >= wrapPoint) ? 16 : 0, vprc),
				trans = curY < innerHeight
						? `translateY( ${px}px )` //- ${px}px)
						: '',
				bor = curY <  innerHeight
						? innerWidth >= wrapPoint ? `${br}px` : ''
						: innerWidth >= wrapPoint ? '16px' : '';

			Object.assign(elMenu.style, {transform: trans, borderRadius: bor});
		}


		get current()
		{
			return elMenu.querySelector('.current');
		}

		set current(key)
		{
			let cur;
			if(this.current.dataset.key != key && (cur = elMenu.querySelector(`li[data-key="${key}"]`)))
			{
				this.current.classList.remove('current');
				cur.classList.add('current');
			}
		}
	}

    export const menu = new Menu();

