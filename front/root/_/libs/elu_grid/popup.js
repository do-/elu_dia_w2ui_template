(($) => {

$.fn.draw_popup = async function (o) {
	
	let $body = $(document.body)
	
	$('.elu_lock', $body).remove ()
	$('<div class=elu_lock>').appendTo ($body)

	let $div = $('<div class=elu_popup>')
		.css ({width: this.attr ('width')})
	
	let $header = $('<header>').appendTo ($div)
	
	$('<span>').text (this.attr ('title')).appendTo ($header)
	
	let close = () => {

		$div.remove ()

		if ($('.elu_popup').length == 0) $('.elu_lock').remove ()

	}
	
	let confirm_close = (e) => {

		if (e.keyCode != 27 || e.ctrlKey || e.altKey || !confirm ('Закрыть окно диалога?')) return

		close ()
		
		$body.off ('keyup', confirm_close)
		
		blockEvent (e)
	
	}

	$body.on ('keyup', confirm_close)
	
	$('<button>').appendTo ($header).click (close)
	
	$div.append (this).css ({visibility: 'hidden'})

	$div.appendTo ($body)
	
	let gap = k => Math.floor (($body [k] () - $div [k] ()) / 2)

	$div.css ({
		left: gap ('width'),
		top: gap ('height'),
		visibility: 'visible',
	})

}

})(jQuery)

1;