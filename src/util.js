


const startItems = [];


export function onStart(fn)
{
	startItems.push(fn);
}

function runStartupItems()
{
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