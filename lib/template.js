
const matchStyleVariable = /\${(\w+)}/g;
export default function (txt, data) {
	return txt.replace(matchStyleVariable, function (match, name) {
		if (typeof data[name] !== 'undefined') {
			return data[name];
		}
		return match;
	});
}
