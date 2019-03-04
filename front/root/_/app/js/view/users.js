define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Пользователи системы')

        fill (view, data, $('main'))        

        var loader = new Slick.Data.RemoteModel ({type: 'users'})

        var columns = [
            {id: "label", name: "ФИО", field: "label", width: 200, sortable: true},
            {id: "login", name: "Login", field: "login", width: 50, sortable: true},
            {id: "mail", name: "E-mail", field: "mail", width: 100, sortable: true},
            {id: "id_role", name: "Роль", field: "id_role", width: 50, formatter: function (row, cell, value, columnDef, dataContext) {
                return data.roles [value]
            }},
        ]

        var options = {
            headerRowHeight: 30,    
            rowHeight: 30,
            enableCellNavigation: true,
            enableColumnReorder: false,
            forceFitColumns: true,
        };

        var loadingIndicator = null;

        $(function () {

            var grid = new Slick.Grid ("#grid_users", loader.data, columns, options);

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
                    var $g = $("#grid_users");
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

            $("#q").keyup(function (e) {
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