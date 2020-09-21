
////////////////////////////////////////////////////////////////////////////////

$_DRAW._grid_filter_checkboxes = async function (data, done) {

	let $view = await to_fill ('_grid_filter_checkboxes', data)
	
    $view.w2uppop ({}, async function () {

		await $('#_grid_filter_checkboxes_grid').draw_table ({

//			src: 'users',

//			limit: 2,
/*
			on: {    	
				cell: {    		
					dblclick: (r) => open_tab (`/user/${r.uuid}`)    		
				}
			}
*/
		})

    
    })
    
    $view = $('#w2ui-popup')

	$('button', $view).data ('done', done)    
    
    return $view

}