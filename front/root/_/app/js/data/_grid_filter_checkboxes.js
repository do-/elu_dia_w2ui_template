////////////////////////////////////////////////////////////////////////////////

$_DO.update__grid_filter_checkboxes = function (e) {

	w2popup.close ()

	$(e.target).data ('done') (1)
	
}

////////////////////////////////////////////////////////////////////////////////

$_GET._grid_filter_checkboxes = async function (data) {

	let 
		
		{name} = data.$id [0],
		
		template = $('template', data.grid.$table) [0].content,
		
		$col = $(`td[data-text=${name}]`, template), 
		
		voc = $col.attr ('data-voc')

	data.voc = data.grid.$table.data ('data') [voc]

	return data

}