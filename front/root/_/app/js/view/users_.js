$_DRAW.users_ = async function (data) {

    $('title').text ('TEST')
    
    let $view = await to_fill ('users_', data, $('main'))
    
    $view = await $view.draw_table ({
    
    	on: {    	
    		cell: {    		
    			dblclick: (r) => open_tab (`/user/${r.uuid}`)    		
    		}    	
    	}
    
    })
    
    return $view
    
/*
    $('main').w2regrid ({ 
    
        name: 'usersGrid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },            

        columns: [                
            {field: 'label',   caption: 'ФИО',    size: 100, sortable: true},
            {field: 'login',   caption: 'Login',  size: 50,  sortable: true},
            {field: 'id_role', caption: 'Роль',   size: 50,  voc: data.roles},
            {field: 'mail',    caption: 'E-mail', size: 50,  sortable: true},
        ],
                    
        url: '_back/?type=users',

        onAdd:      ( ) => show_block ('user_new'),
        onDblClick: (e) => open_tab   (`/user/${e.recid}`),

    }).refresh ();
    
    $('#grid_usersGrid_search_all').focus ()
*/
}