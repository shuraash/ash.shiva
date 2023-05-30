


	import {simpoScroller} from './../../simposcrol.js';
	import {rangeVal} from './../../util.js';

	const

			wrapPoint = 640,

			me = document.querySelector('section[data-key=whoiam] .back'),
			figure = document.querySelector('section[data-key=whoiam] figure'),
			mep = me.querySelector('.bk'),

			upMyPicSizes = () =>
			{
				//wsect.offsetHeigh + wsec.offsetTop
				// and me :)
				let meb = me.parentElement.offsetHeight - (figure.offsetHeight + figure.offsetTop + 32);

				//	console.log(`meb : ${meb} me.parentElement.offsetHeight : ${me.parentElement.offsetHeight} puk: ${(figure.offsetHeight + figure.offsetTop)}`);

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


			mePDown = (x,y) => {

				if (x < (innerWidth / 2 - 8) && mep._rotateY > -25)
				{
					mep._rotateY = -25;
					//mep.style.transform = 'rotateX(0deg) rotateY(-12deg)'
				}
				else if (x > (innerWidth / 2 + 8) && mep._rotateY < 25)
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

				if (y < (meprec.top + meprec.height/2 - 8) && mep._rotateX > -25)
				{
					mep._rotateX = 25;
					//mep.style.transform = 'rotateX(0deg) rotateX(-12deg)'
				}
				else if (y > (meprec.top + meprec.height/2 + 8) && mep._rotateX < 25)
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

			},


			mePUp = (ts = false) => {

				if (mep.style.transform != '')
				{
					mep.style.transition = 'all 0.6s ease-in-out';
					mep.style.transform = '';
					//    if(ts) setTimeout(() => mep.style.transition = '', 900);
				}
			};


	mep._rotateY = 0;

	me.addEventListener('pointerdown', ev =>
	{
		mePDown(ev.x, ev.y);
	})

	me.addEventListener('pointerup', ev => mePUp())

	me.addEventListener('pointerout', ev =>  mePUp(1));

	simpoScroller.addTarget(me, (curY, vprc) =>
	{
		const
				//	meorg = me.offsetHeight / 1540,

				bs =  rangeVal(0,86, me.offsetHeight*.22, 0, vprc),

				//	bp =  rangeVal(0, 86,  60, 0, vprc),

				bp =  rangeVal(0, 86,  bs/2, 0, vprc),

				sfx = rangeVal(0,99, 1, 0.22, vprc),

				//sfy = rangeVal(0,70, 1, 0.4, vprc),

				ra =  rangeVal( 0, 90, 0, 40, vprc),

				transition = '',

				backgroundSize = `auto calc(100% + ${bs}px)`,

				backgroundPosition = `center calc(50% + ${bp}px)`,

				scale = sfx,

				transform = `rotateX(${ra}deg)`;

		Object.assign(me.style, {transition: transition, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition, scale: scale, transform: transform });

		//console.log(qy * 100, target.style.scale);
	});


	export const upMeSizes = upMyPicSizes;

	let
			randomMovesTimer = 0,
			randomMovesUpTimer = 0;

	function randomMoves()
	{

		const
				rx = Math.random() *  mep.offsetWidth + mep.getBoundingClientRect().x,
				ry =  Math.random() *  mep.offsetHeight + mep.getBoundingClientRect().y,
				rUp = 500 + Math.random() * 500,
				rRnd = rUp + Math.random() * 3000;

		mePDown(rx, ry);

		randomMovesUpTimer = setTimeout( () => { mePUp() }, rUp);

		randomMovesTimer = setTimeout( () => { randomMoves() }, rRnd);

	};


	window.addEventListener('inactivityStart', ev =>
	{
		document.querySelector('#finger').classList.add('active');
	//	randomMoves();
	});
	window.addEventListener('inactivityEnd', ev =>
	{
		document.querySelector('#finger').classList.remove('active');
		// clearTimeout(randomMovesUpTimer);
		// clearTimeout(randomMovesTimer);
		// mePUp();
	});


