import 'classlist-polyfill';
import Promise from 'bluebird';

import {default as writeChar, writeSimpleChar, handleChar} from './lib/writeChar';

import styleValues from './lib/getStyle';

// template
import headerHTML from 'raw-loader!./header.html';
import preStyles from 'raw-loader!./prestyles.css';
import replaceURLs from './lib/replaceURLs';

let workText = [0, 1].map(function (i) {return require('raw-loader!./work' + i + '.md');});

const matchStyleVariable = /\'\$(\w+)\'/g;
let styleText = [0, 1, 2, 3, 4, 5].map(function (i) {
	const txt = require('raw-loader!./styles' + i + '.css');
	return txt.replace(matchStyleVariable, function(match, name){
		if(styleValues[name]){
			return styleValues[name];
		}
		return match;
	});

});

import getPrefix from './lib/getPrefix';
import isMoblie from './lib/isMobile';
import getMd from './lib/getMd';

import {introImgs} from './lib/imgs';

// Vars that will help us get er done
const isDev = window.location.hostname === 'localhost';
const speed = isDev ? 0 : 16;
const PAGE_PADDING = 12;
let style, styleEl, workEl, introEl, skipAnimationEl, pauseEl;
let animationSkipped = false, done = false, paused = false;
let browserPrefix;
// Wait for load to get started.
document.addEventListener("DOMContentLoaded", function () {
	preSetStyle();
	getBrowserPrefix();
	populateHeader();
	getEls();
	createEventHandlers();
	startAnimation();
});

async function startAnimation() {
	try {
		await writeTo(styleEl, styleText[0], 0, speed*2, true, 1); // introduction
		await writeTo(styleEl, styleText[1], 0, speed/2, true, 1); // initial styling
		await writeTo(workEl, workText[0], 0, speed, false, 2);    // md of company introduction
		await writeTo(styleEl, styleText[2], 0, speed/2, true, 1); // prepare to convert md
		createWorkBox();	// convert md
		await Promise.delay(1000);

		await writeTo(styleEl, styleText[3], 0, speed/2, true, 1); // md styling, prepare to show CEO introduction
		await writeTo(introEl, workText[1], 0, speed*2, false, 1);    // CEO introduction
		createIntroBox(); // convert md
		await writeTo(styleEl, styleText[4], 0, speed/2, true, 1); // nothing
		await writeTo(styleEl, styleText[5], 0, speed/2, true, 1); // end
	}
	// Flow control straight from the ghettos of Milwaukee
	catch (e) {
		if (e.message === "SKIP IT") {
			surprisinglyShortAttentionSpan();
		} else {
			throw e;
		}
	}
}

// Skips all the animations.
async function surprisinglyShortAttentionSpan() {
	if (done) return;
	done = true;
	let txt = styleText.join('\n');

	// The work-text animations are rough
	style.textContent = "#work-text * { " + browserPrefix + "transition: none; }";
	style.textContent += txt;
	let styleHTML = "";
	for (let i = 0; i < txt.length; i++) {
		styleHTML = handleChar(styleHTML, txt[i]);
	}
	styleEl.innerHTML = styleHTML;
	createWorkBox();
	createIntroBox()

	// There's a bit of a scroll problem with this thing
	let start = Date.now();
	while (Date.now() - 1000 > start) {
		workEl.scrollTop = Infinity;
		styleEl.scrollTop = Infinity;
		await Promise.delay(16);
	}
}


/**
 * Helpers
 */

let endOfSentence = /[\.\?\!]\s$/;
let comma = /\D[\,]\s$/;
let endOfBlock = /[^\/]\n\n$/;

async function writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
	if (animationSkipped) {
		// Lol who needs proper flow control
		throw new Error('SKIP IT');
	}
	// Write a character or multiple characters to the buffer.
	let chars = message.slice(index, index + charsPerInterval);
	index += charsPerInterval;

	// Ensure we stay scrolled to the bottom.
	el.scrollTop = el.scrollHeight;

	// If this is going to <style> it's more complex; otherwise, just write.
	if (mirrorToStyle) {
		writeChar(el, chars, style);
	} else {
		writeSimpleChar(el, chars);
	}

	// Schedule another write.
	if (index < message.length) {
		let thisInterval = interval;
		let thisSlice = message.slice(index - 2, index + 1);
		if (comma.test(thisSlice)) thisInterval = interval * 30;
		if (endOfBlock.test(thisSlice)) thisInterval = interval * 50;
		if (endOfSentence.test(thisSlice)) thisInterval = interval * 70;

		do {
			await Promise.delay(thisInterval);
		} while (paused);

		return writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval);
	}
}

async function fastWriteStyle(el, message){
	writeChar(el, message, style);
}


function preSetStyle(){
	const h = document.documentElement.clientHeight;
	document.getElementById('content').style.height = (h - PAGE_PADDING * 2) + 'px';
}

//
// Older versions of major browsers (like Android) still use prefixes. So we figure out what that prefix is
// and use it.
//
function getBrowserPrefix() {
	// Ghetto per-browser prefixing
	browserPrefix = getPrefix(); // could be empty string, which is fine
	styleText = styleText.map(function (text) {
		return text.replace(/-webkit-/g, browserPrefix);
	});
}

//
// Put els into the module scope.
//
function getEls() {
	// We're cheating a bit on styles.
	let preStyleEl = document.createElement('style');
	preStyleEl.textContent = preStyles;
	document.head.insertBefore(preStyleEl, document.getElementsByTagName('style')[0]);

	// El refs
	style = document.getElementById('style-tag');
	styleEl = document.getElementById('style-text');
	workEl = document.getElementById('work-text');
	introEl = document.getElementById('intro-text');
	skipAnimationEl = document.getElementById('skip-animation');
	pauseEl = document.getElementById('pause-resume');
}

//
// Create links in header (now footer).
//
function populateHeader() {
	let header = document.getElementById('header');
	header.innerHTML = headerHTML;
}

//
// Create basic event handlers for user input.
//
function createEventHandlers() {
	// Mirror user edits back to the style element.
	styleEl.addEventListener('input', function () {
		style.textContent = styleEl.textContent;
	});

	// Skip anim on click to skipAnimation
	skipAnimationEl.addEventListener('click', function (e) {
		e.preventDefault();
		animationSkipped = true;
	});

	pauseEl.addEventListener('click', function (e) {
		e.preventDefault();
		if (paused) {
			pauseEl.textContent = "暂停 ||";
			paused = false;
		} else {
			pauseEl.textContent = "继续 >>";
			paused = true;
		}
	});
}


function getWorkContentWithMd(txt) {
	return '<div class="text">' + replaceURLs(txt) + '</div>' +
		'<div class="md">' + replaceURLs(getMd(txt)) + '<div>';
}
//
// Fire a listener when scrolling the 'work' box.
//
function createWorkBox() {
	if (workEl.classList.contains('flipped')) return;
	workEl.innerHTML = getWorkContentWithMd(workText[0]);
	workEl.scrollTop = 9999;
	workEl.classList.add('flipped');


	// flippy floppy
	let flipping = 0;
	require('mouse-wheel')(workEl, async function (dx, dy) {
		if (flipping) return;
		let flipped = workEl.classList.contains('flipped');
		let half = (workEl.scrollHeight - workEl.clientHeight) / 2;
		let pastHalf = flipped ? workEl.scrollTop < half : workEl.scrollTop > half;

		// If we're past half, flip the el.
		if (pastHalf) {
			workEl.classList.toggle('flipped');
			flipping = true;
			await Promise.delay(500);
			workEl.scrollTop = flipped ? 0 : 99999;
			flipping = false;
		}

		// Scroll. If we've flipped, flip the scroll direction.
		workEl.scrollTop += (dy * (flipped ? -1 : 1));
	}, true);
}

function createIntroBox(){
	introEl.innerHTML = '<div class="md">' + replaceURLs(getMd(workText[1], introImgs)) + '<div>';
}