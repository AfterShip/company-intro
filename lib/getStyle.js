
const isMobile = require('./isMobile');


module.exports = (() => {

	if (isMobile()) {
		return {
			preTrans: 'translateX(0)',
			preWidth: '100%',
			maxH: '50%',
			workTxtTrans: 'translateY(100%)',
			styleTxtW: '100%'
		}
	}
	return {
		preTrans: 'translateX(95%)',
		preWidth: '50%',
		maxH: '61.5%',
		workTxtTrans: 'translateX(100%)',
		styleTxtW: '49%',
	}
})();