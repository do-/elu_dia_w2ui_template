const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = class {

    constructor (docroot) {
        this.map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };
        this.docroot = docroot
    }

    async run (req, res) {

        const parsedUrl = url.parse(req.url);

        const map = this.map

        let pathname = parsedUrl.pathname.replace (/^\/__\w+\/(.*)$/, '/_/$1')

        if (pathname == parsedUrl.pathname) {
            pathname = pathname.replace (/^\/[a-z].*?$/, '/index.html');
        }

        pathname = this.docroot + pathname

        const ext = path.parse(pathname).ext || '.html';

        fs.exists(pathname, function (exist) {
            if(!exist) {
              res.statusCode = 404;
              res.end(`File ${pathname} not found!`);
              return;
            }

        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

            fs.readFile(pathname, function(err, data){
              if(err){
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
              } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', (map[ext] || 'text/plain') + '; charset=utf-8');
                res.end(data);
              }

            });
        });

    }

}