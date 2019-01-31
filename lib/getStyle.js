
const isMobile = require('./isMobile');

const secondStageMob = `
#style-text, #work-text {
  max-height: 30%;
}
`;

const secondStageBigScreen = `
#style-text, #work-text {
  max-height: 50%;
}
`;

module.exports = (() => {
	if (isMobile()) {
		return {
			bodyPaddingLeftRig: '0',
			preTrans: 'translateX(0)',
			preWidth: '100%',
			firstStagePreMaxH: '50%',
			workTxtTrans: 'translateY(-12px)',
			workTxtPos: '',
			styleTxtW: '100%', // full width
			introH: '34%',
			secondStageBlockWorkAndStyle: secondStageMob,
			introMarginTop: '12px',

		};
	}
	return {
		bodyPaddingLeftRig: '12px',
		preTrans: 'translateX(50%)',
		preWidth: '50%',
		firstStagePreMaxH: '62%',
		workTxtTrans: 'translateX(100%)',
		workTxtPos: 'position: absolute;',
		styleTxtW: '49%', // for `style text` pre has gap with `work text`
		introH: '50%',
		secondStageBlockWorkAndStyle: secondStageBigScreen,
		introMarginTop: '29px',
	};
})();
