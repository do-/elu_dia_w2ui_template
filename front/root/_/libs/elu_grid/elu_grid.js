(($) => {

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

	create_header_table ($thead) {
	
		let {$table} = this
	
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

	set_widths ($table, a) {
	
		let i = 0

		$('col', $table).each (function () {
			$(this).css ({width: a [i ++]})
		})

		$table.css ('table-layout', 'fixed')
	
	}


	///////////////////////////////////////////////////////////////////////////////

	add_resizers () {
	
		let {$table} = this, $div = $table.closest ('.elu_grid'), left = 0
		
		$('col', $table).each (function () {
		
			let {width} = this.style; if (!width) return
			
			left += parseInt (width.replace ('px', ''))
					
			$('<div class=resize>').css ({left}).prependTo ($div)
			
		})
	
	}

	///////////////////////////////////////////////////////////////////////////////

	constructor ($table, o) {
	
		if ($table.length != 1) throw new Error (`The length must be 1 (actually ${$table.length})`)

		let {tagName} = $table.get (0); if (tagName != 'TABLE') throw new Error (`Root element must be a TABLE (actually ${tagName})`)
		
		this.$table = $table

		$('colgroup', $table).remove ()
		$('col', $table).remove ()

		$table.wrap ('<div class=elu_grid>')

		let $tr = $('tr:first', $table); if ($tr.length) $(this.create_colgroup ($tr)).prependTo ($table)

		let $thead = $('thead', $table); if ($thead.length) this.create_header_table ($thead)
		
		let w = this.get_widths ($('tr:first', $table)); w.pop ()
		
		this.set_widths (this.$header_table, w)
		this.set_widths (this.$table, w)
		
		this.add_resizers ()
			
	}

}

$.fn.draw_table = function (o) {

	this.data ('grid', new Grid (this, o))

}

})(jQuery)

1;