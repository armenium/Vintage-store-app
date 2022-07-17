(function($){
	'use strict';

	jQuery(document).ready(function($){

		const FJS = {
			options: {},
			vars: {
				ww: 0,
				wh: 0,
			},
			labels: {},
			messages: {
				ajax_error: 'SYSTEM TECHNICAL ERROR'
			},
			routes: {
				remove_sale: "sales-remove",
			},
			els: {},
			Core: {
				Init: function(){
					FJS.Uploader.init();
					this.initEvents();
					this.eventResizeWindow();
				},
				initEvents: function(){
					$(window)
						.on('scroll', FJS.Core.eventScrollWindow)
						.on('resize orientationchange deviceorientation', FJS.Core.eventResizeWindow);

					$(document)
						.on('blur', '[data-trigger="js_action_blur"]', FJS.Core.doAction)
						.on('change', '[data-trigger="js_action_change"]', FJS.Core.doAction)
						.on('click', '[data-trigger="js_action_click"]', FJS.Core.doAction)
						.on('submit', '[data-trigger="js_action_submit"]', FJS.Core.doAction);
				},
				eventResizeWindow: function(){
					FJS.vars.ww = $(window).width();
					FJS.vars.wh = $(window).height();
				},
				doAction: function(e){
					const $this = $(this),
						action = $(this).data('action');

					switch(action){
						case "validate_uploader_form":
							FJS.Uploader.validate($this);
							break;
						case "submit_uploader_form":
							FJS.Uploader.submit($this);
							break;
						case "delete_sale":
							FJS.Sales.remove($this);
							break;
						case "copy_to_clipboard":
							FJS.Common.copyToClipboard($this);
							break;
						default:
							break;
					}

					e.preventDefault();
				},
			},
			Common: {
				createAjaxUrl: function(endpoint){
					let baseurl = $('meta[name="baseurl"]').attr('content');

					return baseurl + '/' + endpoint;
				},
				copyToClipboard: function($btn){
					let $source = $($btn.data('source')),
						text = $source.text();

					if(navigator && navigator.clipboard && navigator.clipboard.writeText){
						return navigator.clipboard.writeText(text);
					}else{
						const el = document.createElement('textarea');
						el.value = text;
						el.setAttribute('readonly', '');
						el.style.position = 'absolute';
						el.style.left = '-9999px';
						document.body.appendChild(el);
						el.select();
						document.execCommand('copy');
						document.body.removeChild(el);
					}

					$source.addClass('color-red');
				},
			},
			Uploader: {
				init: function(){
				},
				validate: function($btn){
					let $form = $btn.parents('form'),
						$file_fields = $form.find('input[type="file"]'),
						flag = true;

					$file_fields.each(function(i, el){
						console.log($(el).get(0).files.length);
						if($(el).get(0).files.length === 0){
							flag = false;
						}
					});

					if(flag){
						$form.submit();
					}

					console.log($form.data('validate'));

					return flag;
				},
				submit: function($form){
				},
			},
			Sales: {
				remove: function($btn){
					let entry_id = $btn.data('id'),
						$parent = $($btn.data('parent'));

					$.ajax({
						type: "POST",
						url: FJS.Common.createAjaxUrl(FJS.routes.remove_sale),
						headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
						data: {id: entry_id},
						dataType: "json",
						beforeSend: function(xhr){
							$btn.attr('disabled', true).find('span').text('Removing...');
						}
					}).done(function(response){
						if(response.error == 0){
							$parent.find('ol').addClass('line-through color-gray');
							setTimeout(function(){
								$btn.addClass('hidden');
							}, 1000);
						}
					}).fail(function(){
						$btn.attr('disabled', false).find('span').text('Remove');
						console.log(FJS.messages.ajax_error);
					});

				},
			},
		};

		FJS.Core.Init();
	});

})(jQuery);
