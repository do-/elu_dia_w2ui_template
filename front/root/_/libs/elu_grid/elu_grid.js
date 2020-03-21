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

function more (l) {

	let e = l [0]; if (!e.isIntersecting) return 

	$(e.target.parentElement.parentElement.parentElement).data ('grid').more ()
	
}

let Grid = class {

	///////////////////////////////////////////////////////////////////////////////

	async more () {
	
		$('td[data-more]', this.$table).parent ().remove ()
	
		this.offset += this.limit

		return this.load ()

	}	
	
	///////////////////////////////////////////////////////////////////////////////

	create_colgroup ($tr) {

		let cols = '<colgroup>', grid = this
		
		grid.colspan = 0

		$('th, td', $tr).each (function () {

			let colspan = parseInt ($(this).attr ('colspan')) || 1

			grid.colspan += colspan

			for (let i = 0; i < colspan; i ++) cols += '<col />'

		})

		return cols += '</colgroup>'

	}
	
	///////////////////////////////////////////////////////////////////////////////

	create_header_table () {
	
		let {$table} = this
		
		let $thead = $('thead', $table); if (!$thead.length) return		
	
		let height = $thead.height ()

		let $header_table = this.$header_table = $table.clone ().removeAttr ('id')
		$('tbody', $header_table).remove ()
		$header_table.prependTo ($table.parent ()).wrap ('<header />').parent ().css ({height})

		$thead.remove ()
		$table.wrap ('<main />')
		
		if (this.tia) this.observer = new IntersectionObserver (more, {
			root: $table.parent [0],
			rootMargin: '0px',
			threshold: 0,
		})

	}

	///////////////////////////////////////////////////////////////////////////////

	get_widths ($tr) {
		
		return $('th, td', $tr).map ((i, e) => e.offsetWidth).toArray ()
	
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

	setup_cell_event_handlers (cell) {
	
		if (!cell) return
		
		for (let k of ['click', 'dblclick']) {
		
			let h = cell [k]; if (!h) continue

			this.$table.on (k, e => {

				let {target} = e; if (target.tagName != 'TD') return

				let $t = $(target); if ($t.is ('[data-more]')) return
				
				h ($t.parent ().data ().data, $t.attr ('data-text'), e)

			})

		}		
	
	}

	///////////////////////////////////////////////////////////////////////////////

	setup_event_handlers () {
	
		let {on} = this.o; if (!on) return
		
		this.setup_cell_event_handlers (on.cell)
	
	}

	///////////////////////////////////////////////////////////////////////////////

	async reload () {
	
		this.clear ()
		
		return this.load ()
	
	}

	///////////////////////////////////////////////////////////////////////////////

	async lock () {
	
		await new Promise (ok => {
		
			if (!this.is_locked) return ok ()

			let t = setInterval (() => this.is_locked ? 0 : ok (clearInterval (t)), 10)

		})
		
		this.is_locked = true
	
		let {$table} = this
		
		let {tHead} = $table [0], {offsetHeight} = tHead || {offsetHeight: 0}

		$('<div class=progress>').css ({
			top: offsetHeight, 
			height: 'calc(100% - ' + offsetHeight + 'px)'}
		)
		
		.appendTo ($table.parent ())
		
		.show ()
		
	}

	///////////////////////////////////////////////////////////////////////////////

	unlock () {
	
		let {$table} = this
		
		$('.progress', $table.parent ())
		
		.hide ()
		
		.remove ()
		
		delete this.is_locked
		
	}
	
	///////////////////////////////////////////////////////////////////////////////

	async load () {

		let {offset, limit} = this
		
		await this.lock ()
		
		if (this.cnt == this.total) return

		let cnt_all = await response (this.tia, {offset, limit, ...this.data})

		let cnt = parseInt (cnt_all.cnt)
		
		if (!('total' in this)) {

			this.total = cnt

		}
		else if (this.total != cnt) {

			alert ('Данные на сервере изменились')

			return await this.reload ()
			
		}

		let [list] = Object.values (cnt_all).filter (Array.isArray)
		
		let $template = $('tbody>template', this.$table)
		
		let data = clone (this.$table.data ('data'))
		
		let key = $template.attr ('data-list')
		
		data [key] = list
		
		this.cnt += list.length
		
		let $tbody = $('tbody', this.$table)
		
		let $t = $('<tbody>').append ($template.clone ())
				
		let $trs = fill ($t, data).children ('tr')

		$trs.appendTo ($tbody)
		
		if (this.cnt < this.total) {
		
			let $tr = $(`<tr><td colspan=${this.colspan} data-more>...</td></tr>`).appendTo ($tbody)
			
			this.observe ()

		}

		this.unlock ()

	}
	
	///////////////////////////////////////////////////////////////////////////////
	
	observe () {
	
		let {observer, $table} = this; if (!observer) return
		
		let td = $('td[data-more]', $table) [0]; if (!td) return
		
		observer.observe (td)
	
	}
	
	///////////////////////////////////////////////////////////////////////////////
	
	clear () {
	
		delete this.total
		delete this.cnt
		
		this.offset = 0
		
		$('tbody>tr', this.$table).remove ()
	
	}
	
	///////////////////////////////////////////////////////////////////////////////

	constructor ($table, o = {}) {
	
		if ($table.length != 1) throw new Error (`The length must be 1 (actually ${$table.length})`)

		let {tagName} = $table.get (0); if (tagName != 'TABLE') throw new Error (`Root element must be a TABLE (actually ${tagName})`)

		let {src} = o; if (src) {
		
			if (!Array.isArray (src)) src = [src]

			let [tp, body] = src
		
			let [type, part] = tp.split ('.')
						
			this.tia  = {type, part, id: null}
			this.data = {...{search: []}, ...(body || {})}

		}

		this.o = o
		this.widths = []
		this.resizers = []
		this.offset = 0
		this.cnt = 0
		this.limit = o.limit || 50
		
		this.$table = $table

		$('colgroup', $table).remove ()
		$('col', $table).remove ()

		$table.wrap ('<div class=elu_grid>')

		let $tr = $('tr:first', $table); if ($tr.length) $(this.create_colgroup ($tr)).prependTo ($table)

	}

}

$.fn.draw_table = async function (o) {

	let grid = new Grid (this, o)
	
	if (o.src) await grid.load ()
			
	grid.copy_widths ()
	grid.add_resizers ()
	grid.create_header_table ()
	grid.setup_event_handlers ()

	this.data ('grid', grid)
	
	grid.observe ()
	
	return this

}

})(jQuery)

1;