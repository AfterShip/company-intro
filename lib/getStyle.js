
const isMobile = require('./isMobile');

const blockMob = `
#style-text, #work-text {
  max-height: 30%;
}
`;

module.exports = (() => {
	if (isMobile()) {
		return {
			bodyPaddingLeftRig: '0',
			preTrans: 'translateX(0)',
			preWidth: '100%',
			maxH: '50%',
			workTxtTrans: 'translateY(-12px)',
			workTxtPos: '',
			styleTxtW: '100%', // full width
			introH: '34%',
			blockMob,
			introMarginTop: '12px',

		};
	}
	return {
		bodyPaddingLeftRig: '12px',
		preTrans: 'translateX(50%)',
		preWidth: '50%',
		maxH: '50%',
		workTxtTrans: 'translateX(100%)',
		workTxtPos: 'position: absolute;',
		styleTxtW: '49%', // for `style text` pre has gap with `work text`
		introH: '50%',
		blockMob: '',
		introMarginTop: '29px',
	};
})();
