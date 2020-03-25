var $the_col = null

function resize_move (e) {

	if (!$the_col) return
		
	let grid = $the_col.data ('grid'), {widths} = grid

	widths [$the_col.prevAll ('.resize').length] += (e.pageX - $the_col.offset ().left)

	grid.set_widths (widths)
	
}

function resize_stop (e) {
	
	$the_col.closest ('.elu_grid')
		.off ('mousemove', resize_move)
		.off ('mouseup', resize_stop)

	$the_col = null

}

function resize_start (e) {

	$the_col = $(e.target)

	$the_col.closest ('.elu_grid')
		.on ('mousemove', resize_move)
		.on ('mouseup',   resize_stop)

}

class GridColResizer {

	constructor (grid, left) {
	
		this.grid = grid
		
		this.$div = $('<div class=resize>')
			.css ({left})
			.data ('grid', grid)
			.on ('mousedown', resize_start)		
			
	}

}

1;