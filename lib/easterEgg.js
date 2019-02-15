/* eslint no-console: "off" */
/* eslint no-alert: "off" */
import tag from './tag';

export default function () {
	const doAlert = () => alert('哈, 你要看代码, 找找其他方法吧 🧐');

	// prevent right click menu
	document.addEventListener('contextmenu', event => {
		event.preventDefault();
		doAlert();
	});

	// prevent open development tool by shotcut
	let preCode;
	let prePreCode;
	const comboKey = [18, 91, 93];

	document.addEventListener('keydown', ({keyCode}) => {
		// f12
		if (keyCode === 123) {
			event.preventDefault();
			doAlert();
			return;
		}

		// option + command + i | j
		if (
			(keyCode === 73 || keyCode === 74)
			&& comboKey.includes(preCode)
			&& comboKey.includes(prePreCode)
		) {
			event.preventDefault();
			doAlert();
			return;
		}

		prePreCode = preCode;
		preCode = keyCode;
	});

	// some log

	if (typeof console === 'undefined' || !console.log) {
		return;
	}

	const fontFamily = 'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;';
	const fs = num => `font-size: ${num}px;`;
	const color = str => `color: ${str};`;

	Object.defineProperty(window, 'get_express_channel', {
		get() {
			console.log('%c🛣 恭喜你! 请把你的简历投到邮箱去吧! 🤓', `${color('#1f1e63')} ${fs(30)} ${fontFamily}`);
			console.log('%cfastpass@aftership.com', `${color('#ffa000')} ${fs(30)} ${fontFamily}`);

			tag({event: 'logContact'});

			return 'get_express_channel';
		},
	});

	console.log('%cHello AfterShip ~', `${color('#ffa000')} ${fs(60)} ${fontFamily}`);
	console.log('%c哇, 你发现了一条秘密通道 🤪', `${color('#1f1e63')} ${fs(30)} ${fontFamily}`);
	console.log('%c你要特快面试通道, 想办法解密: Z2V0X2V4cHJlc3NfY2hhbm5lbA==', `${color('#ffa000')} ${fs(24)} ${fontFamily}`);
}
