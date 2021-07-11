$_DRAW.users = async function (data) {

    $('title').text ('Пользователи системы')

	$('main').dxDataGrid ({
	
		allowColumnResizing: true,
		rowAlternationEnabled: true,
		
		filterRow: {
			visible: true,
		},

		paging: {
			enabled: true,
			pageSize: 100,
		},

		pager: {
			visible: true,
			showInfo: true,
			showNavigationButtons: false,
		},
		
		scrolling: {
			mode: 'virtual',
			rowRenderingMode: 'virtual',
		},
		
		headerFilter: {
//			visible: true,
		},

		searchPanel: {
			visible: true,
		},

		editing: {
			allowAdding: true,
		},

        columns: [
        	{dataField: 'label', caption: 'ФИО'}, 
        	{dataField: 'login', caption: 'Login'}, 
        	{dataField: 'id_role', caption: 'Роль', allowSorting: false,
				lookup: {
					dataSource: {
						store: {
							type: 'array',
							data: data.roles.items,
							key: "id"
						},
					},
					valueExpr: 'id', 
					displayExpr: 'text',
				}
        	}, 
        	{dataField: 'mail',  caption: 'E-mail'},
        ],
        
        dataSource: new DevExpress.data.ODataStore ({
			url: "/_back/users",
			key: "uuid",
			version: 4,
		}),
		
		onRowDblClick: e => open_tab (`/user/${e.key._value}`),
				
		onToolbarPreparing: e => {
		
			let addRowButton = e.toolbarOptions.items.find (i => i.name == 'addRowButton')
			
			addRowButton.location = 'before'
			
			addRowButton.options.onClick = () => show_block ('user_new')

		},
		        
	})

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