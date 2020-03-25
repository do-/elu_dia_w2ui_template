(($) => {

function more (l) {

	let e = l [0]; if (!e.isIntersecting) return 

	$(e.target.parentElement.parentElement.parentElement).data ('grid').more ()
	
}

function sort (e) {

	let {ctrlKey, target} = e

	let $th = $(target), field = $th.attr ('data-sort')		
	
	let grid = $th.closest ('header').nextAll ('main').children ().data ('grid')
	
	let sort = ctrlKey ? (grid.data.sort || []).filter (i => i.field != field) : []
		
	sort.push ({field, direction: !ctrlKey && $th.attr ('data-order') == 'asc' ? 'desc' : 'asc'})

	grid.sort (sort)

}

function filter (e) {

	let {target} = e, $input = $(target), field = target.name
	
	let grid = $input.closest ('header').nextAll ('main').children ().data ('grid')

	let search = (grid.data.search || []).filter (i => i.field != field)
	
	let value = $input.val (); if (value) search.push ({
		field, 
		value,
		type: 'text', 
		operator: target.getAttribute ('data-op') || 'begins', 
	})

	grid.search (search)

}

let Grid = class {

	///////////////////////////////////////////////////////////////////////////////

	async search (search) {

		this.data.search = search
		
		this.data.searchLogic = 'AND'
				
		return this.reload ()
	
	}

	///////////////////////////////////////////////////////////////////////////////

	async sort (sort) {

		this.data.sort = sort
		
		let {$header_table} = this; if ($header_table) {
		
			$('th', $header_table).removeAttr ('data-order')
			
			for (let {field, direction} of sort) $(`th[data-sort=${field}]`, $header_table).attr ('data-order', direction)
		
		}
		
		return this.reload ()
	
	}

	///////////////////////////////////////////////////////////////////////////////

	async more () {
	
		$('td[data-more]', this.$table).parent ().remove ()
	
		this.offset += this.limit

		return this.load ()

	}	
	
	///////////////////////////////////////////////////////////////////////////////
	
	check_colspan () {
	
		if (this.colspan) return
		
		let $tr = $('tr:first', this.$table); if (!$tr.length) return
		
		this.colspan = $('th, td', $tr).toArray ().reduce ((a, t) => a += parseInt ($(t).attr ('colspan')) || 1, 0)
	
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

	}
	
	///////////////////////////////////////////////////////////////////////////////

	wrap_body_table () {
	
		let {$table} = this
		
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

		let grid = this, {$table} = grid, s = 0

		$table.closest ('.elu_grid').prepend (
		
			grid.resizers = $('col', $table).toArray ()
			
				.map (col => parseInt ((col.style.width || '0').replace ('px', '')))
				
				.map (width => new GridColResizer (grid, s += width).$div)
				
/*			
				.map (width => $('<div class=resize>')
					.css ({left: s += width})
					.data ('grid', grid)
					.on ('mousedown', resize_start)
				)
*/				
		)

	}
	
	///////////////////////////////////////////////////////////////////////////////
	
	clear_widths ($jq) {
	
		if ($jq) $('td, th', $jq).each ((i, t) => {
		
			const k = 'width'
		
			if (t.attributes [k]) t.removeAttribute (k)

			if (t.style [k]) t.style [k] = null

		})
	
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

		this.clear_widths ($table)
		this.clear_widths (this.$header_table)
		
	}	

	///////////////////////////////////////////////////////////////////////////////

	setup_head_event_handlers () {
	
		let {$header_table} = this; if (!$header_table) return

		$('th[data-sort]', $header_table).click (sort)

		$('input', $header_table).on ('search', filter)

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
		
		this.setup_head_event_handlers ()
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

		if ('total' in this && this.total == this.cnt) return

		let {offset, limit} = this

		await this.lock ()
				
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

			this.check_colspan ()

			let $tr = $(`<tr><td colspan=${this.colspan} data-more>...</td></tr>`).appendTo ($tbody)

			this.observe ()

		}
		
		this.clear_widths ($($template [0].content).children ())
		
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
		this.cnt = 0
		
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
		$table.wrap ('<div class=elu_grid>')


	}
	
	init_cols () {
	
		let {$table} = this
	
		$('colgroup', $table).remove ()
		$('col', $table).remove ()

		let $tr = $('tr:first', $table); if (!$tr.length) return
		
		this.check_colspan ()
		
		$('<colgroup>' + '<col>'.repeat (this.colspan) + '</colgroup>').prependTo ($table)

	}

}

$.fn.draw_table = async function (o) {

	let grid = new Grid (this, o)
	
	if (o.src) await grid.load ()

	grid.init_cols ()			
	grid.copy_widths ()
	grid.add_resizers ()
	grid.create_header_table ()
	grid.wrap_body_table ()
	grid.setup_event_handlers ()

	this.data ('grid', grid)
	
	grid.observe ()
	
	return this

}

})(jQuery)

1;