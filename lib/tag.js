

const uid = (Math.random() * 1e8).toFixed(0);

export default (tag) => {
	window.dataLayer && window.dataLayer.push({
		uid,
		...tag,
	});
};
