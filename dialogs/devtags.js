'use strict';

( function () {
	CKEDITOR.dialog.add('devTags', function (editor) {
		var lang = editor.lang.devtags,
			clientHeight = document.documentElement.clientHeight;

		// Size adjustments.
		var size = CKEDITOR.document.getWindow().getViewPaneSize(),
		// Make it maximum 800px wide, but still fully visible in the viewport.
			width = Math.min(size.width - 70, 800),
		// Make it use 2/3 of the viewport height.
			height = size.height / 1.5;

		// Low resolution settings.
		if (clientHeight < 650) {
			height = clientHeight - 220;
		}

		return {
			title: lang.code,
			minHeight: 200,
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,
			contents: [
				{
					id: 'info',
					elements: [
						{
							id: 'code',
							type: 'textarea',
							label: '',
							setup: function (widget) {
								this.setValue(widget.data.code);
							},
							commit: function (widget) {
								widget.setData('code', this.getValue());
							},
							required: true,
							validate: CKEDITOR.dialog.validate.notEmpty(lang.empty),
							inputStyle: 'cursor:auto;' +
							'width:' + width + 'px;' +
							'height:' + height + 'px;' +
							'tab-size:4;' +
							'text-align:left;',
							'class': 'cke_source'
						}
					]
				}
			]
		};
	});
}() );