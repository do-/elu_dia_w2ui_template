(($) => {

class Popup {

	unlock () {

		$('.elu_lock').remove ()

	}

	lock () {
	
		this.unlock ()

		$('<div class=elu_lock>').appendTo ($(document.body))

	}

	close () {

		this.$body.off ('keyup', this.keyup)

		this.$div.remove ()

		if ($('.elu_popup').length == 0) this.unlock ()

	}

	confirm_close (e) {

		if (e.keyCode != 27 || e.ctrlKey || e.altKey || !confirm ('Закрыть окно диалога?')) return

		this.close ()

		blockEvent (e)

	}
	
	delta (dim) {
	
		let {$body, $div} = this; return $body [dim] () - $div [dim] ()
	
	}
	
	place (left, top) {
	
		this.$div.css ({left, top, visibility: 'visible'})
	
	}
	
	create_header (text) {

		return $('<header>')
		
			.append ($('<span>'  ).text (text))
		
			.append ($('<button>').click (e => this.close ()))

	}
	
	create_div (jq, o) {
	
		return $('<div class=elu_popup>')

			.css ({width: jq.attr ('width'), visibility: 'hidden'})

			.append (this.create_header (jq.attr ('title')))

			.append (jq)

	}

	constructor (jq, o) {
	
		this.lock ()
	
		this.$div = this.create_div (jq, o).appendTo (this.$body = $(document.body))
	
		this.$body.on ('keyup', this.keyup = e => this.confirm_close (e))

		this.place (this.delta ('width') / 2, this.delta ('height') / 2)

	}

}

$.fn.draw_popup = async function (o) {
	
	return new Popup (this, o)

}

})(jQuery)

1;