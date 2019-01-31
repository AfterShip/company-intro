import Markdown from 'markdown';

const md = Markdown.markdown.toHTML;

// ![alt text](http://url/to/img.png)
// const matchVariable = /!\[[^\]]+\]\([^)]+\)/g;

// match <img /> tag
const matchImgTag = /<img [^>]*alt="([^"]+)"[^>]*\/>/g;

export default function (txt, imgs) {
	// cause parsed html is inside pre element. so need to remove the space
	return md(txt).replace(/\n/g, '').replace(matchImgTag, function (match, name) {
		if (imgs[name]) {
			return imgs[name];
		}
		return match;
	});
}
