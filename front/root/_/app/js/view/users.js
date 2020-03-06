$_DRAW.users = async function (data) {

    $('title').text ('Пользователи системы')
    
    let layout = new dhx.Layout ("layout", {
    
		rows: [
			{
				id: "toolbar",
				html: "Header",
				gravity: false,
				height: "60px"
			}, 
			{
				id: "grid",
				html: "Grid",
				gravity: false,
			}, 
		]
		
    })
    
	let toolbar = new dhx.Toolbar ()    
	
	toolbar.data.parse ([
		{
			type: "button",
			id: "create",
			icon: "dxi-plus",
			value: "Добавить"
		},	
	])

	toolbar.events.on ("Click", id => $_DO [id + '_users'] ())

	layout.cell ("toolbar").attach (toolbar)	

    let src = new dhx.LazyDataProxy (dynamicURL ({type: 'users'}), {
	    from: 0,
	    limit: 50,
	    delay: 150,
	})

	let grid = new dhx.Grid (null, {
	
		columns: [
			{ width: 100, resizable: true, id: "label",      header: [{ text: "ФИО" }] },
			{ width: 50,  resizable: true, id: "login",      header: [{ text: "Login" }] },
			{ width: 50,  resizable: true, id: "role.label", header: [{ text: "Роль" }] },
			{ width: 50,  resizable: true, id: "mail",       header: [{ text: "E-mail" }] }
		],
		
		autoWidth:true, 		
				
	})   

	grid.data.load (src)
	
	grid.events.on ("CellDblClick", r => open_tab (`/user/${r.uuid}`))
	
	layout.cell ("grid").attach (grid)
	
}