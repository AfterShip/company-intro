import Markdown from 'markdown';

const md = Markdown.markdown.toHTML;

const matchVariable = /\$(\w+)/g;

export default function (txt, imgs) {
	// cause parsed html is inside pre element. so need to remove the space
	return md(txt).replace(/\n/g, '').replace(matchVariable, function (match, name) {
		if (imgs[name]) {
			return imgs[name];
		}
		return match;
	});
}
