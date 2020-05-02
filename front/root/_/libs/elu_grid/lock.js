(() => {

	const CLAZZ = elu.css ('lock'), SEL = '.' + CLAZZ

	elu.unlock = () => {$(SEL).remove ()}

	elu.lock = () => {

		elu.unlock ()

		$(document.body).append ($('<div>').attr ('class', CLAZZ).css ('z-index', elu.z_index ++))

	}

})();