module.exports = function (grunt) {

  require('jit-grunt')(grunt);
  
  grunt.initConfig ({
  
    copy: {

      index: {
        src: "root/index.html.template",
        dest: "root/index.html",
        options: {

          process: function(content, srcpath) {

            let git       = p => grunt.file.read ("../.git/" + p)

            let [, head]  = git ("HEAD").replace (/\s/gm, "").split (":")
            let ver       = new Date ().toJSON ().replace (/\D/g, "_") + git (head).slice (0, 7)

            let templates = ''
            
            function add_template (path, id) {

            	let html = grunt.file.read (path + '/' + id).
            	
					replace (/<([a-z]+)(.*?)\/>/gm, (m, tag, attr) => {

						switch (tag.toUpperCase ()) {
							case 'DIV':
							case 'SPAN':
								return `<${tag}${attr}></${tag}>`
							default:
								return m
						}

					})

            	templates += `\n<template id="${id}">${html}</template>`

            }

            add_template ('root/_/app', 'html/login.html')
            
            for (let path of grunt.file.expand ('../slices/*/front/root/_/app/html/*.html')) {
            
            	let parts = path.split ('/')
            	
            	let fn = parts.pop (), d = parts.pop ()

	            add_template (parts.join ('/'), `${d}/${fn}`)

            }

			return content.replace ("${ver}", ver).replace ("${templates}", templates)

          }

        }
      }
    },  
   
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          relativeUrls: true,
          optimization: 2
        },
        files: {
          "root/_/libs/elu_dia_w2ui_template/elu_dia_w2ui_template.css": "root/_/libs/elu_dia_w2ui_template/elu_dia_w2ui_template.less"
        }
      }
    },
                
    concat: {
        options: {
            stripBanners: true,
        },
        js: {
            src: [
                'root/_/libs/jquery/jquery-3.1.1.min.js', 
                'root/_/libs/w2ui/w2ui-1.5.rc1.min.js',
                'root/_/libs/elu/elu.js',
                'root/_/libs/elu_w2ui/elu_w2ui.js',
                'root/_/app/handler.js',
                'root/_/app/js/data/*.js',
                'root/_/app/js/view/*.js',

                '../slices/*/front/root/_/app/js/data/*.js',
                '../slices/*/front/root/_/app/js/view/*.js',

            ],
            dest: 'root/_/app/js/_.js',
        },
    },    

    compress: {
      xslt: {
        options: {mode: 'gzip'},
        expand: true,
        cwd: 'root/_/app/xslt',
        ext: '.xsl.gz',
        src: ['*.xsl'],
        dest: 'root/_/app/xslt'
      },
      js: {
        options: {mode: 'gzip'},
        expand: true,
        cwd: 'root/_/app/js',
        ext: '.js.gz',
        src: ['*.js'],
        dest: 'root/_/app/js'
      },
    },
    
    clean: {
      gz: ['root/_/app/**/*.gz']
    },

    watch: {

      styles: {
        files: ['root/_/libs/elu_dia_w2ui_template/*.less'],
        tasks: ['less'],
        options: {nospawn: true}
      },

      js: {
        files: [
        	'root/_/app/js/data/*.js', 
        	'root/_/app/js/view/*.js', 
        	'root/_/app/handler.js'
        ],
        tasks: ['copy:index', 'concat:js'],
        options: {nospawn: true}
      },

      general: {
        files: [
        	'root/_/app/html/*.html',
			'../slices/*/front/root/_/app/html/*.html',
        ],
        tasks: ['copy:index'],
        options: {nospawn: true}
      },

    }

  })
  
  grunt.loadNpmTasks ('grunt-contrib-copy')
  grunt.loadNpmTasks ('grunt-contrib-compress')

  grunt.registerTask ('default', ['watch'])
  grunt.registerTask ('build', ['copy:index', 'less', 'concat', 'compress'])

}