(() => {

	const CLAZZ = elu.css ('popup'), SEL = '.' + CLAZZ
	
	elu.Popup = class {
		
		add_header (title) {
		
			if (title == null) return
		
			this.$div.prepend (
			
				$('<form method=dialog>').append (

					$('<header>')

						.append ($('<span>'  ).text (title))

						.append ($('<button>'))

				)
			
			)

		}

		constructor (jq, o = {}) {

			$(document.body).append (

				this.$div = jq
				
				.attr ({class: CLAZZ})

				.css ({width: jq.attr ('width')})
			
			)
			
			this.add_header (o.title || jq.attr ('title'));

			jq.on ('cancel', e => confirm ('Закрыть окно диалога?') ? null : blockEvent (e))

			jq.on ('close',  e => $(e.target).remove ())
			
			jq [0].showModal ()

		}

	}

})();