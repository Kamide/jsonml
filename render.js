import { $comment, $fragment, createDocumentFragment, createElement, createNode, isDocumentFragment, isNamedNodeMap, JsonMLSymbol, nodeNameOf, nodeValueOf, svgns } from './index.js';

export function render(jsonml, root) {
	patchElement([root.nodeName, jsonml], root);
}

const whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT;
export function patchElement(jsonml, root) {
	if (sameNodeName(jsonml, root)) {
		const treeWalker = document.createTreeWalker(root, whatToShow);
		let currentNode = treeWalker.firstChild();
		if (currentNode) {
			for (let i = isNamedNodeMap(jsonml[1]) ? 2 : 1; i < jsonml.length;) {
				const currentJsonML = jsonml[i++];
				if (currentNode) {
					let nextSibling = treeWalker.nextSibling();
					if (Array.isArray(currentJsonML)) {
						switch (currentJsonML[0]) {
							case $fragment:
								patchDocumentFragment(currentJsonML, currentNode, treeWalker);
								if (treeWalker.currentNode.nextSibling) {
									nextSibling = treeWalker.currentNode;
								}
								else {
									nextSibling = null;
								}
								break;
							case $comment:
								patchNode(currentJsonML, currentNode);
								break;
							default:
								patchElement(currentJsonML, currentNode);
								break;
						}
					}
					else {
						patchNode(currentJsonML, currentNode);
					}
					currentNode = nextSibling;
				}
				else {
					root.appendChild(createDelimitedNode(currentJsonML, root.namespaceURI));
				}
			}
			while (currentNode) {
				const nextSibling = currentNode.nextSibling;
				root.removeChild(currentNode);
				currentNode = nextSibling;
			}
		}
		else {
			root.appendChild(createDocumentFragment(jsonml, root.namespaceURI));
		}
	}
	else {
		root.replaceWith(createElement(jsonml));
	}
}

export function patchDocumentFragment(jsonml, delimiter, treeWalker) {
	if (delimiter instanceof JsonMLDelimiter) {
		let currentNode = treeWalker.currentNode;
		const root = treeWalker.root;
		for (let i = isNamedNodeMap(jsonml[1]) ? 2 : 1; i < jsonml.length;) {
			const currentJsonML = jsonml[i++];
			if (currentNode) {
				let nextSibling = treeWalker.nextSibling();
				if (Array.isArray(currentJsonML)) {
					switch (currentJsonML[0]) {
						case $fragment:
							patchDocumentFragment(currentJsonML, currentNode, treeWalker);
							if (treeWalker.currentNode.nextSibling) {
								nextSibling = treeWalker.currentNode;
							}
							else {
								nextSibling = null;
							}
							break;
						case $comment:
							patchNode(currentJsonML, currentNode);
							break;
						default:
							patchElement(currentJsonML, currentNode);
							break;
					}
				}
				else {
					patchNode(currentJsonML, currentNode);
				}
				currentNode = nextSibling;
			}
			else {
				const node = createDelimitedNode(currentJsonML);
				root.appendChild(node);
				treeWalker.nextnext = treeWalker.nextSibling() ?? treeWalker.nextnext;
			}
		}
	}
	else {
		const fragment = createDelimitedDocumentFragment(jsonml);
		delimiter.replaceWith(fragment);
	}
}

export function patchNode(jsonml, node) {
	if (sameNodeName(jsonml, node)) {
		const nodeValue = nodeValueOf(jsonml);
		if (node.nodeValue !== nodeValue) {
			node.nodeValue = nodeValue;
		}
	}
	else {
		node.replaceWith(createDelimitedNode(jsonml, node.namespaceURI, true));
	}
}

export function sameNodeName(jsonml, node) {
	if (node.namespaceURI === svgns) {
		return node.nodeName === nodeNameOf(jsonml);
	}
	else {
		return node.nodeName.toLowerCase() === nodeNameOf(jsonml).toLowerCase();
	}
}

export const createDelimitedNode = (jsonml, xmlns) => isDocumentFragment(jsonml) ? createDelimitedDocumentFragment(jsonml, xmlns) : createNode(jsonml, xmlns);

export function createDelimitedDocumentFragment(jsonml, xmlns) {
	const fragment = document.createDocumentFragment();
	fragment.append(new JsonMLDelimiter());
	for (let i = 1; i < jsonml.length;) {
		fragment.append(createNode(jsonml[i++], xmlns));
	}
	return fragment;
}

export class JsonMLDelimiter extends Comment {
	[JsonMLSymbol];

	static [Symbol.hasInstance](instance) {
		return instance instanceof Comment && JsonMLSymbol in instance;
	}
}
