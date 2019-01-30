
module.exports = () => {
	const ua = navigator.userAgent.toLowerCase();
	return ua.includes('mobile') && !ua.includes('ipad');
};

