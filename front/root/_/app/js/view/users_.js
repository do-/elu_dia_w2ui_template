$_DRAW.users_ = async function (data) {

    $('title').text ('TEST')
    
    let $view = await to_fill ('users_', data, $('main'))
    
    $view = await $('#users_grid').draw_table ({
    
        src: 'users',
        
        limit: 2,

    	on: {    	
    		cell: {    		
    			dblclick: (r) => open_tab (`/user/${r.uuid}`)    		
    		}
    	}
    
    })
   
    return $view


}