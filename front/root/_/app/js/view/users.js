$_DRAW.users = async function (data) {

    $('title').text ('Пользователи системы')
        
    let src = new dhx.LazyDataProxy (dynamicURL ({type: 'users'}), {
	    from: 0,
	    limit: 50,
	    delay: 150,
	})
    
	let grid = new dhx.Grid ("main", {
	
		columns: [
			{ width: 100, resizable: true, id: "label",      header: [{ text: "ФИО" }] },
			{ width: 50,  resizable: true, id: "login",      header: [{ text: "Login" }] },
			{ width: 50,  resizable: true, id: "role.label", header: [{ text: "Роль" }] },
			{ width: 50,  resizable: true, id: "mail",       header: [{ text: "E-mail" }] }
		],
		
		autoWidth:true, 		
				
	})   

	grid.data.load (src)

}