const conf = new (require ('./Config.js'));

(async function () {

    try {
        await conf.init ()
    }
    catch (x) {
        return darn (['Initialization failed', x])
    }

    let webUiFrontend;

    if (conf.docroot) {
        webUiFrontend = new (require ('./Content/Handler/WebUiFrontend.js')) (conf.docroot)
    }

    require ('http').createServer (

        (request, response) => {

            webUiFrontend && request.url.substring (0, 6) != '/_back' ?

                webUiFrontend.run (request, response) :

                new (require ('./Content/Handler/WebUiBackend.js')) ({

                    conf,

                    pools: conf.pools,

                    http: {request, response}

                }).run ()
        }

    ).listen (conf.listen, function () {darn ('default app is listening to HTTP at ' + this._connectionKey)})

}) ()