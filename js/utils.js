//缩放
function scalePage(o) {
	var o = typeof o === 'string' ? document.querySelector(o) : o,
		h = o.offsetHeight,
		timer = null,
		w = 0,
		s = 0;

	function on(el, types, handler) {
		for (var i = 0, l = types.length; i < l; i++) el.addEventListener(types[i], handler, false);
	}

	function update() {
		w = document.documentElement.clientWidth;
		w > 640 && (w = 640);
		s = (w / 640);
		o.style.webkitTransformOrigin = o.style.MozTransformOrigin = o.style.msTransformOrigin = o.style.oTransformOrigin = o.style.transformOrigin = '0px 0px 0px';
		o.style.webkitTransform = o.style.MozTransform = o.style.msTransform = o.style.oTransform = o.style.transform = 'scale(' + s + ')';
		o.style.height = h * s + 'px';
	}

	update();

	on(window, ['resize', 'orientationchange'], function(e) {
		timer && clearTimeout(timer);
		timer = setTimeout(function() {
			update();
		}, 60);
	});
}
//scalePage('#wx_wrap');

//点击
function touchClick(o, fn) {
	var o = typeof o === 'string' ? document.querySelector(o) : o,
		touchs = {};
	o.addEventListener('touchstart', function(e) {
		touchs.x = e.touches[0].pageX;
		touchs.y = e.touches[0].pageY;
		touchs.X = 0;
		touchs.Y = 0;
		touchs.t = new Date() - 0;
	}, false);
	o.addEventListener('touchmove', function(e) {
		touchs.X = e.touches[0].pageX - touchs.x;
		touchs.Y = e.touches[0].pageY - touchs.y;
	}, false);
	o.addEventListener('touchend', function(e) {
		if (+new Date() - touchs.t <= 200 && Math.abs(touchs.X) < 5 && Math.abs(touchs.Y) < 5) {
			fn.call(o);
		}
	}, false);
}
