

const timingFuncSet = {
	// t: curent time; b: initial value; c: varity; d: duration
	easeInOut(_t, b, c, d) {
		let t = _t / d / 2;
		if (t < 1) {
			return c / 2 * t * t * t + b;
		}
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	},
};

/**
 * translate
 * @param {object} {
 *	from: number,
 *	to: number,
 *	duration: number,
 *	timingFunc: string
 * }
 * @param {function} frameCallback every frame callback
 */
export const translate = function ({
	from, to, duration = 500, timingFunc: timingFuncName = 'easeInOut',
}, frameCallback) {
	return new Promise(resolve => {
		let num = from;

		const frame = 1000 / 60;
		const b = from;
		const c = to - from;
		const d = duration;
		let t = 0;

		const timingFunc = timingFuncSet[timingFuncName];

		let chkDone;
		if (Math.abs(from) > Math.abs(to)) {
			chkDone = () => Math.abs(num) > Math.abs(to);
		} else {
			chkDone = () => Math.abs(num) < Math.abs(to);
		}

		const run = () => {
			num = timingFunc(t, b, c, d);
			t += frame;
			window.requestAnimationFrame(() => {
				const res = frameCallback(num);

				if (res === false) {
					resolve();
					return;
				}

				if (chkDone()) {
					run();
				} else {
					resolve();
				}
			});
		};
		run();
	});
};

/**
 * browser element scroll animation.
 * @param {element|string} _scrollElement scroll element or 'root'
 * @param {number|string} _from scroll animation start from.
 * @param {number|string} _to scroll animation end to.
 * @param {number} duration scroll duration
 */
/* eslint-disable max-params */
export const runScroll = (_scrollElement, _from, _to, duration, frameCb) => {
	let scrollElement;
	if (_scrollElement === 'root') {
		scrollElement = document.scrollingElement || document.documentElement;
	} else {
		scrollElement = _scrollElement;
	}

	const mapPos = (type) => {
		switch (type) {
			case 'top':
				return 0;
			case 'cur':
				return scrollElement.scrollTop;
			default:
				return type;
		}
	};

	const from = mapPos(_from);
	const to = mapPos(_to);

	return translate(
		{
			from,
			to,
			duration,
		},
		num => {
			scrollElement.scrollTop = num;
			return frameCb && frameCb();
		},
	);
};
