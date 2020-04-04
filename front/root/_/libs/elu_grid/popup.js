(($) => {

class Popup {

	unlock () {

		$('.elu_lock').remove ()

	}

	lock () {
	
		this.unlock ()

		$('<div class=elu_lock>').appendTo ($(document.body))

	}

	events (cb) {
	
		for (let [event, handler] of this.event_handlers) cb (this.$body, event, handler)

	}

	keep (e) {
	
		this.x = e.screenX
		
		this.y = e.screenY

	}
	
	start (e) {
	
		this.keep (e)
		
		this.events (($body, event, handler) => $body.on (event, handler))

	}
	
	move (e) {
	
		let {screenX, screenY} = e, {x, y} = this
	
		let gap = k => parseInt (this.$div.css (k).replace (/\D/g, ''))
	
		this.place (gap ('left') + screenX - x, gap ('top') + screenY - y)

		this.keep (e)
	
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
		
		let half = x => Math.floor (x / 2)

		this.place (half (this.delta ('width')), half (this.delta ('height')))

		this.event_handlers = Object.entries ({
			mousemove : e => this.move (e),
			mouseup   : e => this.events (($body, event, handler) => $body.off (event, handler)),
		})
		
		$('header', this.$div).on ('mousedown', e => this.start (e))

	}

}

$.fn.draw_popup = async function (o) {
	
	return new Popup (this, o)

}

})(jQuery)

1;