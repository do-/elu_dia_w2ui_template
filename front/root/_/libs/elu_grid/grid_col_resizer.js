(() => {

const CLAZZ = elu.css ('resize'), SEL = '.' + CLAZZ

elu.GridColResizer = class {

	move (e) {

		let {grid, $div} = this, {widths} = grid

		widths [$div.prevAll (SEL).length] += (e.pageX - $div.offset ().left)

		grid.set_widths (widths)

	}

	constructor (grid, left) {

		this.grid = grid

		this.move_handlers = {
		
			mousemove : e => this.move (e),
		
			mouseup   : e => this.grid.$div.off (this.move_handlers)
		
		}

		this.$div = $('<div>')
			.attr ('class', CLAZZ)
			.css  ({left})
			.data ('grid', grid)
			.on   ('mousedown', e => this.grid.$div.on (this.move_handlers))

	}

}

})();
