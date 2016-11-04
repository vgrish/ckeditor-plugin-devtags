/*
 from https://github.com/ckeditor/ckeditor-dev/blob/master/plugins/codesnippet/plugin.js
 */

'use strict';

(function () {

	if (CKEDITOR.plugins.get('devtags')) {
		return false;
	}

	CKEDITOR.plugins.add('devtags', {
		requires: 'widget,dialog',
		lang: 'en,ru',
		icons: 'devtags',
		hidpi: true,

		onLoad: function () {
			CKEDITOR.dialog.add('devTags', this.path + 'dialogs/devtags.js');
		},

		init: function (editor) {
			editor.addContentsCss(CKEDITOR.plugins.getPath('devtags') + 'css/devtags.css');

			editor.ui.addButton && editor.ui.addButton('DevTags', {
				label: editor.lang.devtags.toolbar,
				command: 'devTags',
				toolbar: 'insert,10'
			});
		},

		afterInit: function (editor) {
			registerWidget(editor);
		}
	});


	function registerWidget(editor) {
		var textarea = new CKEDITOR.dom.element('textarea');

		editor.widgets.add('devTags', {
			allowedContent: 'pre; devtags',
			requiredContent: 'pre',
			styleableElements: 'pre',
			template: '<pre><devtags></devtags></pre>',
			dialog: 'devTags',
			mask: true,

			parts: {
				pre: 'pre',
				code: 'devtags'
			},

			data: function () {
				var newData = this.data,
					oldData = this.oldData;

				if (newData.code)
					this.parts.code.setHtml(CKEDITOR.tools.htmlEncode(newData.code));

				// Save oldData.
				this.oldData = CKEDITOR.tools.copy(newData);
			},

			// Upcasts <pre><devtags>...</devtags></pre>
			upcast: function (el, data) {
				if (el.name != 'pre')
					return;

				var childrenArray = getNonEmptyChildren(el),
					code;

				if (childrenArray.length != 1 || ( code = childrenArray[0] ).name != 'devtags')
					return;

				// Upcast <devtags> with text only: http://dev.ckeditor.com/ticket/11926#comment:4
				if (code.children.length != 1 || code.children[0].type != CKEDITOR.NODE_TEXT)
					return;

				// Use textarea to decode HTML entities (#11926).
				textarea.setHtml(code.getHtml());
				data.code = textarea.getValue();

				return el;
			},

			// Downcasts to <pre><devtags>...</devtags></pre>
			downcast: function (el) {
				var code = el.getFirst('devtags');

				// Remove pretty formatting from <devtags>...</devtags>.
				code.children.length = 0;

				// Set raw text inside <devtags>...</devtags>.
				code.add(new CKEDITOR.htmlParser.text(CKEDITOR.tools.htmlEncode(this.data.code)));

				return el;
			}
		});

		// Returns an **array** of child elements, with whitespace-only text nodes
		// filtered out.
		// @param {CKEDITOR.htmlParser.element} parentElement
		// @return Array - array of CKEDITOR.htmlParser.node
		var whitespaceOnlyRegex = /^[\s\n\r]*$/;

		function getNonEmptyChildren(parentElement) {

			var ret = [],
				preChildrenList = parentElement.children,
				curNode;

			// Filter out empty text nodes.
			for (var i = preChildrenList.length - 1; i >= 0; i--) {
				curNode = preChildrenList[i];

				if (curNode.type != CKEDITOR.NODE_TEXT || !curNode.value.match(whitespaceOnlyRegex))
					ret.push(curNode);
			}

			return ret;
		}
	}
})();
