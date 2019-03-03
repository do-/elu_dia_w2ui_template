define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Пользователи системы')
        
        fill (view, data, $('main'))        

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
                {field: 'id_role', caption: 'Роль',   size: 50,  render: function (i) {return data.roles [i.id_role]}},
                {field: 'mail',    caption: 'E-mail', size: 50,  sortable: true},
            ],
                        
            url: '_back/?type=users',

            onAdd: function (e) {use.block ('users_new')},

        }).refresh ();
        
        $('#grid_usersGrid_search_all').focus ()
*/

    var grid, s;
    
    var loader = new Slick.Data.RemoteModel ({type: 'users'})
    
    var mpnFormatter = function (row, cell, value, columnDef, dataContext) {
        s ="<a href='" + dataContext.octopart_url + "' target=_blank>" + dataContext.mpn + "</a>";
        return s;
    };
    var brandFormatter = function (row, cell, value, columnDef, dataContext) {
        return dataContext.brand.name;
    };
    var columns = [
//        {id: "mpn", name: "MPN", field: "mpn", formatter: mpnFormatter, width: 100, sortable: true },
//        {id: "brand", name: "Brand", field: "brand.name", formatter: brandFormatter, width: 100, sortable: true },
        {id: "label", name: "ФИО", field: "label", width: 200, sortable: true},
        {id: "login", name: "Login", field: "login", width: 50, sortable: true},
        {id: "mail", name: "E-mail", field: "mail", width: 100, sortable: true},
//                {field: 'id_role', caption: 'Роль',   size: 50,  render: function (i) {return data.roles [i.id_role]}},
    ]
    
    var options = {
        rowHeight: 21,
        editable: false,
        enableAddRow: false,
        enableCellNavigation: false,
        enableColumnReorder: false,
        forceFitColumns: true,
    };
    
    var loadingIndicator = null;
    
    $(function () {
    
        grid = new Slick.Grid ("#myGrid", loader.data, columns, options);
        
        grid.onViewportChanged.subscribe(function (e, args) {
            var vp = grid.getViewport();
            loader.ensureData(vp.top, vp.bottom);
        });
        
        grid.onSort.subscribe(function (e, args) {
            loader.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
            var vp = grid.getViewport();
            loader.ensureData(vp.top, vp.bottom);
        });
        
        grid.onDblClick.subscribe (function (e, a) {
            openTab ('/users/' + a.grid.getDataItem (a.row).uuid)
        })
        
        loader.onDataLoading.subscribe(function () {
            if (!loadingIndicator) {
                loadingIndicator = $("<span class='loading-indicator'><label>Buffering...</label></span>").appendTo(document.body);
                var $g = $("#myGrid");
                loadingIndicator
                        .css("position", "absolute")
                        .css("top", $g.position().top + $g.height() / 2 - loadingIndicator.height() / 2)
                        .css("left", $g.position().left + $g.width() / 2 - loadingIndicator.width() / 2);
            }
            loadingIndicator.show();
        });
        
        loader.onDataLoaded.subscribe(function (e, args) {
            for (var i = args.from; i <= args.to; i++) {
                grid.invalidateRow(i);
            }
            grid.updateRowCount();
            grid.render();
            loadingIndicator.fadeOut();
        });
        
        $("#txtSearch").keyup(function (e) {
            if (e.which == 13) {
                loader.setSearch($(this).val());
                var vp = grid.getViewport();
                loader.ensureData(vp.top, vp.bottom);
            }
        });
                
        // load the first page
        
        $(window).on ('resize', function (e) {
        
            grid.resizeCanvas ()
                
        })
        
        grid.onViewportChanged.notify ()
        
    })


    }

})