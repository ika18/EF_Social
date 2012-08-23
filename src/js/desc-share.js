

var descshare = (function($){
	//valid the input textare
// 	1:register the describe event handler
// 
// 
// 
// 
// 
// 
// 
// `
// 	
	var maxDescrLength = 20;
	var leastDescrLength = 10
	// var keyReserved = [8,64,9,37,38,39,,40,46];
	var defaultDescrInstruction = 'EXAMPLE';
	var $descr = $('.ets-describe-text textarea:first');
	var $descrHolder = $('.ets-describe-area');	
	var $descrLeftChars = $('.ets-describe-text .ets-helper strong');
	var descrLeftChars;

	var register = function(){
		var currentDescr,currentDescrLength;

		$descr.focusin(function(event) {	
			//init input area waiting user input	
			if($descr.hasClass('ets-placeholder')){
				$descr.val('');
				$descr.removeClass('ets-placeholder');
			}
		})
		.focusout(function(event) {
			currentDescr = $descr.val();
			currentDescrLength = currentDescr.length;
			if(currentDescrLength == 0){
				$descrHolder.removeClass('ets-valid');
				$descr.addClass('ets-placeholder');
				$descr.val(defaultDescrInstruction);
			}
		})
		// this is limited inputs alternative solution
		// .keydown(function(event) {
		// 	currentDescr = $descr.val();
		// 	currentDescrLength = currentDescr.length;
		// 	//limited the textare
		// 	var keycode = event.charCode ? event.charCode : event.keyCode;
		// 	if($.inArray(keycode,keyReserved) < 0 ){
		// 		if(maxDescrLength <= currentDescrLength){					
		// 			event.preventDefault();
		// 		}	
		// 	}
		// })
		.keyup(function(event) {

			currentDescr = $descr.val();
			currentDescrLength = currentDescr.length;

			//valid the descr
			if(currentDescrLength >= leastDescrLength){
				$descrHolder.addClass('ets-valid');
			}else{
				$descrHolder.removeClass('ets-valid');
			}

			//valid the descr result 
			descrLeftChars = maxDescrLength - currentDescrLength;
			$descrLeftChars.text(descrLeftChars);
			if(descrLeftChars >= 0){
				$descrLeftChars.removeClass('charas-num-overflow');
			}else{
				$descrLeftChars.addClass('charas-num-overflow');
				$descrHolder.removeClass('ets-valid');
			}


		});;
	};


	$(document).ready(function($) {
		register();
	});	
}(jQuery));


