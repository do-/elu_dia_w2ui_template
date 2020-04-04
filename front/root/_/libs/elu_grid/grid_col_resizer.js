class GridColResizer {
	
	events (cb) {
	
		let $top_div = this.$div.closest ('.elu_grid')

		for (let [event, handler] of this.event_handlers) cb ($top_div, event, handler)

	}

	move (e) {

		let {grid, $div} = this, {widths} = grid

		widths [$div.prevAll ('.resize').length] += (e.pageX - $div.offset ().left)

		grid.set_widths (widths)

	}

	constructor (grid, left) {

		this.grid = grid

		this.event_handlers = Object.entries ({
			mousemove : e => this.move (e),
			mouseup   : e => this.events (($div, event, handler) => $div.off (event, handler)),
		})

		this.$div = $('<div class=resize>')
			.css ({left})
			.data ('grid', grid)
			.on ('mousedown', e => this.events (($div, event, handler) => $div.on (event, handler)))

	}

}

1;