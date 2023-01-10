# jsonml

**jsonml** is a library for creating DOM nodes using JsonML, the JSON Markup Language.

## Import Map

```html
<script type="importmap">
	{
		"imports": {
			"jsonml": "/path/to/jsonml/index.js"
		}
	}
</script>
```

## Example

Input

```js
import { $comment, $fragment, createNode, svgns } from 'jsonml';

document.body.append(createNode([$fragment,
	['h1', { class: 'heading' }, 'JsonML'],
	['svg', { xmlns: svgns, viewBox: '-1 -1 2 2' },
		[$comment, 'No need to set the `xmlns` attribute'],
		['circle', { r: 1, [Symbol.for('onclick')]:
			() => console.log("I'm a property, not an attribute"),
		}],
	],
]));
```

Output

```html
<body>
	<h1 class="heading">JsonML</h1>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2">
		<!--No need to set the `xmlns` attribute-->
		<circle r="1" />
	</svg>
</body>
```
