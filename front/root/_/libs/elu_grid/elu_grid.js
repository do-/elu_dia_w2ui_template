(($) => {

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

let Grid = class {

	///////////////////////////////////////////////////////////////////////////////

	create_colgroup ($tr) {

		let cols = '<colgroup>'

		$('th, td', $tr).each (function () {
			let colspan = parseInt ($(this).attr ('colspan')) || 1
			for (let i = 0; i < colspan; i ++) cols += '<col />'
		})

		return cols += '</colgroup>'

	}
	
	///////////////////////////////////////////////////////////////////////////////

	create_header_table () {
	
		let {$table} = this
		
		let $thead = $('thead', $table); if (!$thead.length) return		
	
		let height = $thead.height ()

		let $header_table = this.$header_table = $table.clone ()
		$('tbody', $header_table).remove ()
		$header_table.prependTo ($table.parent ()).wrap ('<header />').parent ().css ({height})

		$thead.remove ()
		$table.wrap ('<main />')		
	
	}

	///////////////////////////////////////////////////////////////////////////////

	get_widths ($tr) {
	
		let a = []
	
		$('th, td', $tr).each (function () {
			a.push ($(this).width ())
		})	
		
		return a
	
	}

	///////////////////////////////////////////////////////////////////////////////

	set_widths (w) {
	
		this.widths = w
			
		for (let k of ['$header_table', '$table']) this.set_table_col_widths (this [k], w)
		
		let left = 0; for (let i = 0; i < this.resizers.length; i ++) {
		
			left += w [i]
			
			this.resizers [i].css ({left})
			
		}
	
	}

	///////////////////////////////////////////////////////////////////////////////

	set_table_col_widths ($table, a) {
	
		if (!$table) return
	
		let i = 0

		$('col', $table).each (function () {
			$(this).css ({width: a [i ++]})
		})

		$table.css ('table-layout', 'fixed')
	
	}

	///////////////////////////////////////////////////////////////////////////////

	add_resizers () {

		let grid = this, {$table} = grid, $div = $table.closest ('.elu_grid'), left = 0

		let $span = $('<span />').prependTo ($div)

		$('col', $table).each (function () {
		
			let {width} = this.style; if (!width) return
			
			left += parseInt (width.replace ('px', ''))
					
			grid.resizers.push ($('<div class=resize>')
				.css ({left})
				.data ('grid', grid)
				.on ('mousedown', resize_start)
				.appendTo ($span)
			)
			
		})
		
		$('div', $span).unwrap ()
	
	}
	
	///////////////////////////////////////////////////////////////////////////////
	
	copy_widths () {
	
		let {$table} = this, cnt = $('col', $table).length
		
		for (let $tr of $('tr', $table).toArray ()) {
		
			let w = this.get_widths ($tr)
			
			if (w.length != cnt || !w [0]) continue
			
			w.pop ()
			
			this.set_widths (w)
			
			break

		}
		
	}	

	///////////////////////////////////////////////////////////////////////////////

	constructor ($table, o) {
	
		if ($table.length != 1) throw new Error (`The length must be 1 (actually ${$table.length})`)

		let {tagName} = $table.get (0); if (tagName != 'TABLE') throw new Error (`Root element must be a TABLE (actually ${tagName})`)
		
		this.widths = []
		this.resizers = []
		
		this.$table = $table

		$('colgroup', $table).remove ()
		$('col', $table).remove ()

		$table.wrap ('<div class=elu_grid>')

		let $tr = $('tr:first', $table); if ($tr.length) $(this.create_colgroup ($tr)).prependTo ($table)
					
	}

}

$.fn.draw_table = async function (o) {

	let grid = new Grid (this, o)
			
	grid.copy_widths ()
	grid.add_resizers ()
	grid.create_header_table ()

	this.data ('grid', grid)
	
	return this

}

})(jQuery)

1;