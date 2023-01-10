/**
 * **jsonml** is a library for creating DOM nodes using JsonML, the JSON Markup Language.
 *
 * @example <caption>Creating a document fragment with HTML and SVG elements</caption>
 * import { $comment, $fragment, createNode, svgns } from 'jsonml';
 * document.body.append(createNode([$fragment,
 * 	['h1', { class: 'heading' }, Date.now()],
 * 	['svg', { xmlns: svgns, viewBox: '-1 -1 2 2' },
 * 		[$comment, 'No need to set the `xmlns` attribute'],
 * 		['circle', { r: 1 }],
 * 	],
 * ]));
 *
 * @example <caption>Setting element properties (nonstandard JsonML)</caption>
 * import { createNode } from 'jsonml';
 * document.body.append(createNode(
 * 	['button', {
 * 		type: 'button',
 * 		[Symbol.for('onclick')]: () => console.log(Date.now()),
 * 	}, 'Click me'],
 * ));
 */
declare module 'jsonml' {
	/**
	 * HTML namespace URI. When creating an {@link HTMLElement},
	 * passing this value to the `xmlns` parameter in {@link createNode} or {@link createElement} is optional.
	 */
	export const htmlns = 'http://www.w3.org/1999/xhtml';

	/**
	 * SVG namespace URI. When creating an {@link SVGElement},
	 * passing this value to the `xmlns` parameter in {@link createNode} or {@link createElement} is required
	 * if you do not define an `xmlns` attribute in the element's corresponding {@link JsonMLNamedNodeMap}.
	 */
	export const svgns = 'http://www.w3.org/2000/svg';

	/**
	 * Node name used to identify a {@link JsonMLDocumentFragment}.
	 */
	export const $fragment = '#document-fragment';

	/**
	 * Node name used to identify a {@link JsonMLComment}.
	 */
	export const $comment = '#comment';

	/**
	 * Node name used to identify a {@link JsonMLText}.
	 */
	export const $text = '#text';

	/**
	 * Represents an {@link Element}.
	 *
	 * @example <caption>Line break element</caption>
	 * ['br']
	 *
	 * @example <caption>Section with one child</caption>
	 * ['section', ['p', 'Hello world']]
	 *
	 * @example <caption>Paragraph with multiple children</caption>
	 * ['p', 'Unix time: ', ['code', Date.now()]]
	 *
	 * @example <caption>Setting div attributes</caption>
	 * ['div', { style: 'flex: 1' }]
	 *
	 * @example <caption>Setting button properties (nonstandard JsonML)</caption>
	 * ['button', {
	 * 	type: 'button',
	 * 	[Symbol.for('onclick')]: () => console.log(Date.now()),
	 * }, 'Click me']
	 */
	export type JsonMLElement<TagName = string> = [TagName, ...JsonMLNode[]] | [TagName, JsonMLNamedNodeMap, ...JsonMLNode[]];

	/**
	 * Represents the {@link HTMLElement} subset of {@link Element}.
	 * @see {@link JsonMLHTMLElement}
	 *
	 * @example <caption>Type narrowing</caption>
	 * ```ts
	 * ['div'] as JsonMLHTMLElement<'div'>
	 * ```
	 */
	export type JsonMLHTMLElement<TagName extends keyof HTMLElementTagNameMap> = JsonMLElement<TagName>;

	/**
	 * Represents the {@link SVGElement} subset of {@link Element}.
	 * @see {@link JsonMLHTMLElement}
	 *
	 * @example <caption>Type narrowing</caption>
	 * ```ts
	 * ['rect'] as JsonMLSVGElement<'rect'>
	 * ```
	 */
	export type JsonMLSVGElement<TagName extends keyof SVGElementTagNameMap> = JsonMLElement<TagName>;

	/**
	 * Represents a {@link NamedNodeMap}, an attribute map, but can also contain properties.
	 *
	 * Attribute names are represented by string keys.
	 * Attribute values that are strings, numbers, or bigints are stringified using the {@link String} constructor.
	 * Boolean attributes are set to an empty string if and only if they are `true`.
	 * Attributes with null, undefined, or other types are not set (a no operation).
	 *
	 * Property names are represented by {@link Symbol.description}.
	 * A symbol without a description (`undefined`) is an invalid key.
	 * Property values are assigned as is.
	 *
	 * @example <caption>Empty attribute map</caption>
	 * ({})
	 *
	 * @example <caption>`aria-hidden` is an enumerated attribute and must be `'true'` or `'false'` but not an empty string</caption>
	 * ({ class: 'menu', 'data-hidden': true, 'aria-hidden': String(true) })
	 *
	 * @example <caption>Property map</caption>
	 * ({ [Symbol.for('tabIndex')]: 0 })
	 *
	 * @example <caption>Mixing attributes and properties</caption>
	 * ({ tabindex: 0, [Symbol.for('onclick')]: () => console.log(Date.now()) })
	 */
	export type JsonMLNamedNodeMap = Record<string, JsonMLText> | Record<symbol, unknown>;

	/**
	 * Represents a {@link Text} node.
	 * Nonstring values are stringified using {@link nodeValueOf}.
	 */
	export type JsonMLText = string | number | bigint | boolean | null | undefined;

	/**
	 * Represents a {@link Comment} node.
	 *
	 * @example <caption>A comment with an empty string</caption>
	 * [$comment]
	 *
	 * @example <caption>A comment with `'Hello world'`</caption>
	 * [$comment, 'Hello world']
	 */
	export type JsonMLComment = [typeof $comment] | [typeof $comment, JsonMLText];

	/**
	 * Represents a {@link DocumentFragment}.
	 *
	 * @example <caption>An empty document fragment</caption>
	 * [$fragment]
	 *
	 * @example <caption>A document fragment with one child</caption>
	 * [$fragment,
	 * 	['p',
	 * 		'My parent is a ',
	 * 		['code', '<p>'],
	 * 		' element',
	 * 	],
	 * ]
	 *
	 * @example <caption>A document fragment with multiple children</caption>
	 * [$fragment,
	 * 	'First Name: ',
	 * 	['span', 'John'],
	 * 	['br'],
	 * 	'Last Name: ',
	 * 	['span', 'Doe'],
	 * ]
	 */
	export type JsonMLDocumentFragment = [typeof $fragment, ...JsonMLNode[]];

	/**
	 * Represents a {@link Node}.
	 * @see {@link JsonMLElement}, {@link JsonMLText}, {@link JsonMLComment}, {@link JsonMLDocumentFragment}
	 */
	export type JsonMLNode = JsonMLElement | JsonMLText | JsonMLComment | JsonMLDocumentFragment;

	/**
	 * Polymorphic function that creates a {@link Element}, {@link Text}, {@link Comment}, or {@link DocumentFragment},
	 * all of which fall under the {@link Node} interface, depending on the JsonML format.
	 * @see {@link createElement}, {@link createTextNode}, {@link createComment}, {@link createDocumentFragment}
	 *
	 * @example <caption>Document fragment with HTML elements, SVG elements, text nodes, and comment nodes</caption>
	 * ```ts
	 * createNode([$fragment,
	 * 	['h1', { class: 'heading' }, Date.now() as JsonMLText] as JsonMLHTMLElement<'h1'>,
	 * 	['svg', { xmlns: svgns, viewBox: '-1 -1 2 2' },
	 * 		[$comment, 'No need to set the `xmlns` attribute'] as JsonMLComment,
	 * 		['circle', { r: 1 }] as JsonMLSVGElement<'circle'>,
	 * 	] as JsonMLSVGElement<'svg'>,
	 * ] as JsonMLDocumentFragment) as DocumentFragment;
	 * ```
	 */
	export function createNode<TagName extends keyof HTMLElementTagNameMap>(jsonml: JsonMLHTMLElement<TagName>, xmlns?: typeof htmlns): HTMLElementTagNameMap[TagName];
	export function createNode<TagName extends keyof SVGElementTagNameMap>(jsonml: JsonMLSVGElement<TagName>, xmlns?: typeof svgns): SVGElementTagNameMap[TagName];
	export function createNode<TagName extends keyof HTMLElementTagNameMap>(jsonml: JsonMLHTMLElement<TagName>, xmlns?: string): HTMLElementTagNameMap[TagName];
	export function createNode<TagName extends keyof SVGElementTagNameMap>(jsonml: JsonMLSVGElement<TagName>, xmlns?: string): SVGElementTagNameMap[TagName];
	export function createNode(jsonml: JsonMLText, xmlns?: string): Text;
	export function createNode(jsonml: JsonMLComment, xmlns?: string): Comment;
	export function createNode(jsonml: JsonMLDocumentFragment, xmlns?: string): DocumentFragment;
	export function createNode(jsonml: JsonMLElement, xmlns?: typeof htmlns): HTMLUnknownElement;
	export function createNode(jsonml: JsonMLElement, xmlns?: typeof svgns): SVGElement;
	export function createNode(jsonml: JsonMLElement, xmlns?: string): HTMLUnknownElement;
	export function createNode(jsonml: JsonMLNode): HTMLUnknownElement | SVGElement | Text | Comment | DocumentFragment;

	/**
	 * Creates an {@link Element} from its JsonML representation, corresponds to {@link document.createElement}.
	 * @see {@link JsonMLElement}, {@link JsonMLHTMLElement}, {@link JsonMLSVGElement}
	 *
	 * @example <caption>Inferring HTML namespace</caption>
	 * ```ts
	 * const span: HTMLSpanElement = createElement(['span', "Type assertions are provided for clarity and are optional."] as JsonMLHTMLElement<'span'>);
	 * ```
	 *
	 * @example <caption>Inferring SVG namespace</caption>
	 * ```ts
	 * const text: SVGTextElement = createElement(['text', "Type assertions are provided for clarity and are optional."] as JsonMLSVGElement<'text'>);
	 * ```
	 *
	 * @example <caption>Disambiguating tag names with namespaces</caption>
	 * ```ts
	 * const htmlStyle: HTMLStyleElement = createElement(['style']);
	 * const svgStyle: SVGStyleElement = createElement(['style'], svgns);
	 * ```
	 */
	export function createElement<TagName extends keyof HTMLElementTagNameMap>(jsonml: JsonMLHTMLElement<TagName>, xmlns?: typeof htmlns): HTMLElementTagNameMap[TagName];
	export function createElement<TagName extends keyof SVGElementTagNameMap>(jsonml: JsonMLSVGElement<TagName>, xmlns?: typeof svgns): SVGElementTagNameMap[TagName];
	export function createElement<TagName extends keyof HTMLElementTagNameMap>(jsonml: JsonMLHTMLElement<TagName>, xmlns?: string): HTMLElementTagNameMap[TagName];
	export function createElement<TagName extends keyof SVGElementTagNameMap>(jsonml: JsonMLSVGElement<TagName>, xmlns?: string): SVGElementTagNameMap[TagName];
	export function createElement(jsonml: JsonMLElement, xmlns?: typeof htmlns): HTMLUnknownElement;
	export function createElement(jsonml: JsonMLElement, xmlns?: typeof svgns): SVGElement;
	export function createElement(jsonml: JsonMLElement, xmlns?: string): HTMLUnknownElement;

	/**
	 * Creates a {@link Text} node from its JsonML representation, corresponds to {@link document.createTextNode}.
	 * @see {@link JsonMLText}
	 */
	export function createTextNode(jsonml: JsonMLText): Text;

	/**
	 * Creates a {@link Comment} node from its JsonML representation, corresponds to {@link document.createComment}.
	 * @see {@link JsonMLComment}
	 */
	export function createComment(jsonml: JsonMLComment): Comment;

	/**
	 * Creates a {@link Comment} node from its JsonML representation, corresponds to {@link document.createDocumentFragment}.
	 * @see {@link JsonMLDocumentFragment}
	 */
	export function createDocumentFragment(jsonml: JsonMLDocumentFragment): DocumentFragment;

	/**
	 * @see {@link JsonMLNamedNodeMap}
	 */
	export function isNamedNodeMap(jsonml: unknown): jsonml is NamedNodeMap;

	/**
	 * Corresponds to {@link Node.nodeName}.
	 * Elements will return their tag name.
	 * Text nodes will return {@link $text}.
	 * Comment nodes will return {@link $comment}.
	 * Document fragments will return {@link $fragment}.
	 */
	export function nodeNameOf(jsonml: JsonMLNode): string;

	/**
	 * Stringifies a {@link JsonMLText}. Strings are unmodified.
	 * Numbers, bigints, and booleans are stringified using the {@link String} constructor.
	 * Null, undefined, and other types are converted into an empty string.
	 *
	 * | Argument            | Return Value         |
	 * | ------------------- | -------------------- |
	 * | `'Hello world'`     | `'Hello world'`      |
	 * | `123`               | `'123'`              |
	 * | `9007199254740992n` | `'9007199254740992'` |
	 * | `true`              | `'true'`             |
	 * | `false`             | `'false'`            |
	 * | `null`              | `''`                 |
	 * | `undefined`         | `''`                 |
	 * | `[]`                | `''`                 |
	 * | `{}`                | `''`                 |
	 */
	export function nodeValueOf(jsonml: JsonMLText): string;
}
