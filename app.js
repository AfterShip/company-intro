/* eslint max-params: "off" */
/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import 'classlist-polyfill';
// eslint-disable-next-line
import Promise from 'bluebird';

import writeChar, {
	writeSimpleChar, handleChar, writeTerminal,
} from './lib/writeChar';

// template
import headerHTML from './header.html';
import whyJoinUsHTML from './whyJoinUs.html';
import preStyles from './prestyles.css';
import replaceURLs from './lib/replaceURLs';
import insetStyleVariable from './lib/insetStyleVariable';
import {runScroll} from './lib/animate';

import getPrefix from './lib/getPrefix';
// import isMoblie from './lib/isMobile';
import getMd from './lib/getMd';

import {workImgs, introImgs} from './lib/imgs';

const workText = [0].map(function (i) {
	return require('./work' + i + '.md');
});
const introText = [0, 1].map(function (i) {
	return require('./intro' + i + '.md');
});

// image element
const aftershipTitle = '<header>AfterShip</header>';

let styleText = [0, 1, 2, 3, 4, 5, 6].map(function (i) {
	const txt = require('./styles' + i + '.css');
	return insetStyleVariable(txt);
});

// Vars that will help us get er done
const isDev = window.location.hostname === 'localhost';
const speed = isDev ? 0 : 16;
const PAGE_PADDING = 12;
let style;
let styleEl;
let workEl;
let introEl;
let skipAnimationEl;
let	pauseEl;
let animationSkipped = false;
let done = false;
let	paused = false;
let browserPrefix;
// Wait for load to get started.
document.addEventListener('DOMContentLoaded', function () {
	preSetStyle();
	getBrowserPrefix();
	populateHeader();
	getEls();
	createEventHandlers();
	startAnimation();
});

async function startAnimation() {
	try {
		await writeTo(styleEl, styleText[0], 0, speed * 1.5, true, 1); // introduction
		await writeTo(styleEl, styleText[1], 0, speed / 2, true, 1); // initial styling
		await fastWrite(workEl, aftershipTitle); // md of company introduction
		await writeTo(workEl, workText[0], 0, speed, false, 2); // md of company introduction
		await writeTo(styleEl, styleText[2], 0, speed / 2, true, 1); // prepare to convert md
		createWorkBox();	// convert md
		await Promise.delay(1000);

		await scrollToMdBottom(workEl); // scroll to the badge
		await writeTo(styleEl, styleText[3], 0, speed / 2, true, 1); // continue to add work text
		await addMoreWorkIntro(workEl, whyJoinUsHTML); // add more text
		await writeTo(styleEl, styleText[6], 0, speed / 2, true, 1); // md styling, prepare to show CEO introduction
		await writeTo(introEl, introText[0], 0, speed, false, 1); // CEO title
		createIntroBox(); // convert md
		await writeTo(styleEl, styleText[4], 0, speed / 2, true, 1); // nothing
		await writeTo(introEl, introText[1], 0, speed * 1.5, 'terminal', 1); // CEO introduction
		await writeTo(styleEl, styleText[5], 0, speed / 2, true, 1); // end
	} catch (e) {
		// Flow control straight from the ghettos of Milwaukee
		if (e.message === 'SKIP IT') {
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
	const txt = styleText.join('\n');

	// The work-text animations are rough
	style.textContent = '#work-text * { ' + browserPrefix + 'transition: none; }';
	style.textContent += txt;
	let styleHTML = '';
	for (let i = 0; i < txt.length; i++) {
		styleHTML = handleChar(styleHTML, txt[i]);
	}
	styleEl.innerHTML = styleHTML;

	createWorkBox();

	createIntroBox();
	introEl.innerHTML += introText[1];

	await addMoreWorkIntro(workEl, whyJoinUsHTML);

	// There's a bit of a scroll problem with this thing
	const start = Date.now();
	while (Date.now() - 1000 > start) {
		workEl.scrollTop = Infinity;
		styleEl.scrollTop = Infinity;
		await Promise.delay(16);
	}
}


/**
 * Helpers
 */

const endOfSentence = /[?!]\s$/;
const comma = /\D[,。]\s$/;
const endOfBlock = /[^/]\n\n$/;

async function writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval) {
	if (animationSkipped) {
		// Lol who needs proper flow control
		throw new Error('SKIP IT');
	}
	// Write a character or multiple characters to the buffer.
	const chars = message.slice(index, index + charsPerInterval);
	index += charsPerInterval;

	// Ensure we stay scrolled to the bottom.
	el.scrollTop = el.scrollHeight;

	// If this is going to <style> it's more complex; otherwise, just write.
	if (mirrorToStyle === 'terminal') {
		writeTerminal(el, chars);
	} else if (mirrorToStyle) {
		writeChar(el, chars, style);
	} else {
		writeSimpleChar(el, chars);
	}

	// Schedule another write.
	if (index < message.length) {
		let thisInterval = interval;
		const thisSlice = message.slice(index - 2, index + 1);
		if (comma.test(thisSlice)) thisInterval = interval * 3;
		if (endOfBlock.test(thisSlice)) thisInterval = interval * 15;
		if (endOfSentence.test(thisSlice)) thisInterval = interval * 30;

		do {
			await Promise.delay(thisInterval);
		} while (paused);

		return writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval);
	}
}

async function fastWrite(el, message) {
	el.innerHTML += message;
}

async function addMoreWorkIntro(el, html) {
	const htmlWrapper = el.querySelector('.md');
	addHtmlToFlippyElement(htmlWrapper, html, el);
}

async function scrollToMdBottom(el, timing = 300) {
	const gap = 800;
	const mdWrapper = el.querySelector('.text');
	const hMd = mdWrapper.offsetHeight;

	// scroll
	await runScroll(el, 'cur', hMd + gap, timing);
	await Promise.delay(300);
}
async function addHtmlToFlippyElement(el, html, scrollParent) {
	const originalH = el.offsetHeight;
	el.innerHTML += html.replace(/\n/g, '').replace(/(\s\s|\t)+/g, '');
	// jump to original view position
	scrollParent.scrollTop += el.offsetHeight - originalH;
	// animate scroll
	await scrollToMdBottom(scrollParent, 500);
}


function preSetStyle() {
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
	const preStyleEl = document.createElement('style');
	preStyleEl.textContent = insetStyleVariable(preStyles);
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
	const header = document.getElementById('header');
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
			pauseEl.textContent = '暂停 ||';
			paused = false;
		} else {
			pauseEl.textContent = '继续 >>';
			paused = true;
		}
	});
}


function getWorkContentWithMd() {
	const [txt] = workText;
	return '<div class="text">' + replaceURLs(txt) + '</div>'
		+ '<div class="md">' + aftershipTitle + replaceURLs(getMd(txt, workImgs)) + '<div>';
}
//
// Fire a listener when scrolling the 'work' box.
//
function createWorkBox() {
	if (workEl.classList.contains('flipped')) return;
	workEl.innerHTML = getWorkContentWithMd();
	workEl.scrollTop = 9999;
	workEl.classList.add('flipped');


	// flippy floppy
	let flipping = 0;
	require('mouse-wheel')(workEl, async function (dx, dy) {
		if (flipping) return;
		const flipped = workEl.classList.contains('flipped');
		const half = (workEl.scrollHeight - workEl.clientHeight) / 2;
		const pastHalf = flipped ? workEl.scrollTop < half : workEl.scrollTop > half;

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

function createIntroBox() {
	introEl.innerHTML = '<div class="md">' + replaceURLs(getMd(introText[0], introImgs)) + '<div>';
}
