/* eslint no-console: "off" */
/* eslint no-alert: "off" */

export default function () {
	// prevent right click menu
	document.addEventListener('contextmenu', event => event.preventDefault());

	// prevent open development tool by shotcut
	let preCode;
	let prePreCode;
	const comboKey = [18, 91, 93];
	const doAlert = () => alert('哈, 快捷键被我屏蔽了, 找找其他方法吧 🧐');

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
			console.log('%c🛣 原来我们的捷径通道可以直接通往CEO的邮箱!', `${color('#1f1e63')} ${fs(30)} ${fontFamily}`);
			console.log('%cexpresschannel@aftership.com', `${color('#ffa000')} ${fs(50)} ${fontFamily}`);
			console.log('%c 赶紧联系他吧! 🤓', `${color('#1f1e63')} ${fs(30)} ${fontFamily}`);

			return 'get_express_channel';
		},
	});

	console.log('%cHello AfterShip ~', `${color('#ffa000')} ${fs(80)} ${fontFamily}`);
	console.log('%c哇, 你发现了一条秘密通道 🤪', `${color('#1f1e63')} ${fs(30)} ${fontFamily}`);
	console.log('%c输入 get_express_channel 可获得进入秘密通道的钥匙 🔑 哦', `${color('#ffa000')} ${fs(24)} ${fontFamily}`);
}
