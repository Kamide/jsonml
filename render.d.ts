import { htmlns, JsonMLComment, JsonMLDocumentFragment, JsonMLElement, JsonMLNode, JsonMLSymbol, JsonMLText, svgns } from 'jsonml';

declare module 'jsonml/render.js' {
	export function render(jsonml: JsonMLNode, root: Element): void;

	export function patchElement(jsonml: JsonMLElement, root: Element): void;

	export function patchDocumentFragment(jsonml: JsonMLDocumentFragment, delimiter: JsonMLDelimiter, treeWalker: TreeWalker): void;

	export function patchNode(jsonml: JsonMLText | JsonMLComment, node: Text | Comment): void;

	export function sameNodeName(jsonml: JsonMLNode, node: Node): boolean;

	export function createDelimitedNode(jsonml: JsonMLNode, xmlns?: typeof htmlns): Node;
	export function createDelimitedNode(jsonml: JsonMLNode, xmlns?: typeof svgns): Node;
	export function createDelimitedNode(jsonml: JsonMLNode, xmlns?: string): Node;

	export function createDelimitedDocumentFragment(jsonml: JsonMLDocumentFragment, xmlns?: string): DocumentFragment;

	export class JsonMLDelimiter extends Comment {
		[JsonMLSymbol]: any;
		static [Symbol.hasInstance](instance: unknown): instance is JsonMLDelimiter;
	}
}
