$_DRAW.users = async function (data) {
    
        $('title').text ('Пользователи системы')
        
        $('main').html (await use.html ('users'))

        var loader = new Slick.Data.RemoteModel ({type: 'users'})
 
        var loadingIndicator = null;

        $(function () {
            
            var grid = $("#grid_users").draw_table ({

                headerRowHeight: 30,    
                rowHeight: 30,
                enableCellNavigation: true,
                enableColumnReorder: false,
                forceFitColumns: true,                
                data: loader.data,
                columns: [
                    {field: "label", name: "ФИО", width: 200, sortable: true},
                    {field: "login", name: "Login", width: 50, sortable: true},
                    {field: "mail", name: "E-mail", width: 100, sortable: true},
                    {field: "id_role", name: "Роль", width: 50, voc: data.roles},
                ]

            })

            grid.onViewportChanged.subscribe (function (e, args) {
                var vp = grid.getViewport ()
                loader.ensureData (vp.top, vp.bottom)
            })

            grid.onSort.subscribe (function (e, args) {
                loader.setSort (args.sortCol.field, args.sortAsc ? 1 : -1)
                var vp = grid.getViewport ()
                loader.ensureData (vp.top, vp.bottom)
            })

            grid.onDblClick.subscribe (function (e, a) {
                openTab ('/user/' + a.grid.getDataItem (a.row).uuid)
            })
/*
            loader.onDataLoading.subscribe(function () {
                if (!loadingIndicator) {
                    loadingIndicator = $("<span class='loading-indicator'><label>Buffering...</label></span>").appendTo(document.body);
                    var $g = $("#grid_users");
                    loadingIndicator
                            .css("position", "absolute")
                            .css("top", $g.position().top + $g.height() / 2 - loadingIndicator.height() / 2)
                            .css("left", $g.position().left + $g.width() / 2 - loadingIndicator.width() / 2);
                }
                loadingIndicator.show();
            });
*/
            loader.onDataLoaded.subscribe (function (e, args) {
                for (var i = args.from; i <= args.to; i ++) grid.invalidateRow (i)
                grid.updateRowCount ()
                grid.render ()
//                loadingIndicator.fadeOut();
            });

            $("#q").keyup(function (e) {
                if (e.which == 13) {
                    loader.setSearch($(this).val());
                    var vp = grid.getViewport();
                    loader.ensureData (vp.top, vp.bottom);
                }
            });

            // load the first page

            $(window).on ('resize', function (e) {

                grid.resizeCanvas ()

            })

            grid.onViewportChanged.notify ()

        })

}