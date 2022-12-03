


const startItems = [];


export function onStart(fn)
{
	startItems.push(fn);
}

function runStartupItems()
{
	//let CSS_REAL_VH = window.innerHeight * 0.01; // FOR MOBILES, REMOVE BROWSER HEADER HEIGHT
	// if('ontouchstart' in window)
	// {
	//	document.body.style.setProperty('--vh', `${CSS_REAL_VH}px`);
//		alert(`--vh set to ${CSS_REAL_VH}px`);
//}


	for(const i of startItems)
		i();
}


document.readyState === 'complete'
	? setTimeout(() => runStartupItems(), 10)
	: document.addEventListener('readystatechange', (ev) => document.readyState === 'complete'
		? setTimeout(() => runStartupItems(), 10)
		: null
	);


window.addEventListener("beforeunload", (event) => window.scrollTo(0,0));


export const isMobile = () => window.orientation != undefined && 'ontouchstart' in window;

