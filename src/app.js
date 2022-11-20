import {onStart} from './util.js';
import {attachScroll} from './scroll';

onStart(() =>
{
	attachScroll();
	document.body.classList.add('loaded');

});