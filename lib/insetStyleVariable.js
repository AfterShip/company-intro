import styleValues from './getStyle';

const matchStyleVariable = /\'\$(\w+)\'/g;
export default function(txt){
	return txt.replace(matchStyleVariable, function(match, name){
		if(typeof styleValues[name] !== 'undefined'){
			return styleValues[name];
		}
		return match;
	});
}