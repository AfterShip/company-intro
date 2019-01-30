export default function () {
	// prevent right click menu
	document.addEventListener('contextmenu', event => event.preventDefault());

	// prevent open development tool by shotcut
	let preCode;
	let prePreCode;
	const comboKey = [18, 91];
	document.addEventListener('keydown', ({keyCode}) => {
		// f12
		if (keyCode === 123) {
			event.preventDefault();
			return;
		}

		// option + command + i
		if (
			keyCode === 73
			&& comboKey.includes(preCode)
			&& comboKey.includes(prePreCode)
		) {
			event.preventDefault();
			return;
		}

		prePreCode = preCode;
		preCode = keyCode;
	});
}
