
////////////////////////////////////////////////////////////////////////////////

$_DRAW._grid_filter_checkboxes = async function (data, done) {

	let $view = await to_fill ('_grid_filter_checkboxes', data)
	
	await $('#_grid_filter_checkboxes_grid', $view).draw_table ({})

    $view.w2uppop ({})

    $view = $('#w2ui-popup')

	$('button', $view).data ('done', done)    
    
    return $view

}