export const JsonMLSymbol = Symbol.for('JsonML');
export const htmlns = 'http://www.w3.org/1999/xhtml';
export const svgns = 'http://www.w3.org/2000/svg';
export const $fragment = '#document-fragment';
export const $comment = '#comment';
export const $text = '#text';

export function createNode(jsonml, xmlns) {
	if (Array.isArray(jsonml)) {
		switch (jsonml[0]) {
			case $fragment:
				return createDocumentFragment(jsonml, xmlns);
			case $comment:
				return createComment(jsonml);
			default:
				return createElement(jsonml, xmlns);
		}
	}
	else {
		return createTextNode(jsonml);
	}
}

export function createElement(jsonml, xmlns = htmlns) {
	let attrs;
	let i = 1;
	if (isNamedNodeMap(jsonml[1])) {
		attrs = jsonml[1];
		i = 2;
		if (typeof attrs.xmlns === 'string' || attrs.xmlns === null) {
			xmlns = attrs.xmlns;
		}
	}
	const element = document.createElementNS(xmlns, jsonml[0]);
	if (attrs) {
		for (const key of Reflect.ownKeys(attrs)) {
			const value = attrs[key];
			if (typeof key === 'string') {
				switch (typeof value) {
					case 'string':
						element.setAttribute(key, value);
						break;
					case 'number':
					case 'bigint':
						element.setAttribute(key, String(value));
						break;
					case 'boolean':
						element.toggleAttribute(key, value);
						break;
				}
			}
			else if (typeof key.description === 'string') {
				element[key.description] = value;
			}
		}
	}
	for (; i < jsonml.length;) {
		element.append(createNode(jsonml[i++], xmlns));
	}
	return element;
}

export const createTextNode = jsonml => document.createTextNode(nodeValueOf(jsonml));
export const createComment = jsonml => document.createComment(nodeValueOf(jsonml[1]));

export function createDocumentFragment(jsonml, xmlns) {
	const fragment = document.createDocumentFragment();
	for (let i = 1; i < jsonml.length;) {
		fragment.append(createNode(jsonml[i++], xmlns));
	}
	return fragment;
}

export const isDocumentFragment = jsonml => Array.isArray(jsonml) && jsonml[0] === $fragment;
export const isNamedNodeMap = jsonml => typeof jsonml === 'object' && jsonml !== null && !Array.isArray(jsonml);
export const nodeNameOf = jsonml => Array.isArray(jsonml) ? jsonml[0] : $text;

export function nodeValueOf(jsonml) {
	switch (typeof jsonml) {
		case 'string':
			return jsonml;
		case 'number':
		case 'bigint':
		case 'boolean':
			return String(jsonml);
		default:
			return '';
	}
}
