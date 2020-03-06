$_DRAW.users = async function (data) {

    $('title').text ('Пользователи системы')
        
    let src = new dhx.LazyDataProxy (dynamicURL ({type: 'users'}), {
	    from: 0,
	    limit: 50,
	    delay: 150,
	})
    
	let grid = new dhx.Grid ("main", {
	
		columns: [
			{ width: 100, resizable: true, id: "label",   header: [{ text: "ФИО" }] },
			{ width: 50,  resizable: true, id: "login",   header: [{ text: "Login" }] },
			{ width: 50,  resizable: true, id: "id_role", header: [{ text: "Роль" }] },
			{ width: 50,  resizable: true, id: "mail",    header: [{ text: "E-mail" }] }
		],
		
		autoWidth:true, 		
		
//		headerRowHeight: 50,
		
//		data: src,
		
	})   
	
	grid.data.load (src)

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