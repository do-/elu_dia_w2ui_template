const odata = require ('./Content/Handler/ODataBackend.js')
const back  = require ('./Content/Handler/WebUiBackend.js')
const front = require ('./Ext/Dia/Content/Handler/HTTP/EluStatic.js')

module.exports = class extends require ('./Ext/Dia/Content/Handler/HTTP/Router.js') {

	create_http_handler (http) {
	
		let {conf} = this, {pools} = conf, {headers, url} = http.request

		if (/\bodata=/.test (headers.accept)) return new odata ({conf, pools, http})
darn ({url})
		if (url.match (/^\/(\?|_back)?/)) return new back ({conf, pools, http})

		return new front ({conf, http})

	}
		
}