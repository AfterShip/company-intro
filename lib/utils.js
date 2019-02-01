
export const getBodyMargin = () => {
	try {
		return window.getComputedStyle(document.body).margin.replace('px', '') * 2;
	} catch (e) {
		return 0;
	}
};

