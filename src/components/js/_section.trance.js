

	import {awaitTimer, onStart} from './../../util.js';

	let

		w = document.querySelector('#wrapper'),
		s = document.querySelector('#avatar'),

	spinoX = async () =>{
		s.style.transition = 'transform 2s linear'
		s.style.transform = 'translateZ(0px) rotateX(359deg)'
		await awaitTimer(2000);
		s.style.transition = ''
		s.style.transform = 'translateZ(0px) rotateX(0deg)'
	},

	spinoY = async () =>{
		s.style.transition = 'transform 2s linear'
		s.style.transform = 'translateZ(0px) rotateY(359deg)'
		await awaitTimer(2000);
		s.style.transition = ''
		s.style.transform = 'translateZ(0px) rotateY(0deg)'
	},

	spino = async () => {

		while (true)
		{
			if(w.scrollTop >= s.offsetTop)
			{
				await awaitTimer(4000);
				spinoY();
				await awaitTimer(4000);
				spinoX();
				await awaitTimer(2000);
			}
			await awaitTimer(1000);
		}
	}

	spino();

	let vids = ["/video/imperia_striked_by_psy.mp4", "/video/love_is.mp4"];
	document.querySelectorAll('video').forEach( (v,i) => v.innerHTML = `<source src="${vids[i]}" type="video/mp4">`);

