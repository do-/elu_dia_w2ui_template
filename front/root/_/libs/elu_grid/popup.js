elu.Popup = class {

	keep (e) {
	
		this.x = e.screenX
		
		this.y = e.screenY

	}
	
	start (e) {
	
		this.keep (e)
		
		this.$body.on (this.move_handlers)

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

		if ($('.elu_popup').length == 0) elu.unlock ()

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
	
		elu.lock ()
	
		this.$div = this.create_div (this.$src = jq, o).appendTo (this.$body = $(document.body))
	
		this.$body.on ('keyup', this.keyup = e => this.confirm_close (e))
		
		let half = x => Math.floor (x / 2)

		this.place (half (this.delta ('width')), half (this.delta ('height')))

		this.move_handlers = {
			mousemove : e => this.move (e),
			mouseup   : e => this.$body.off (this.move_handlers)
		}
		
		$('header', this.$div).on ('mousedown', e => this.start (e))

	}

};