/**
 * LBS Digital 
 * Date: 2015-03-10
 * ==================================
 * opts.el 滚动数字对象的父对象(一个字符串的CSS选择器或者元素对象)
 *** opts.target 目标位置的索引值 有几位就几个 如(8888)
 * opts.distance 每一项的基础值 比如高
 * opts.duration 每一项滚动的持续时间 默认1000(毫秒)
 * opts.interval 每项开始滚动的间隔时间 默认100(毫秒)
 * opts.easing 动画效果 (easeInOutCirc(默认) easeInOutSine)
 *** opts.complete 滚动完成(所有位置的索引到目标值) 执行函数
 * ==================================
 * this.start(num,fn) 开始调用动画
 	num 目标位置的索引值 有几位就几个 如(8888)
 	fn 滚动完成(所有位置的索引到目标值) 执行函数
 * ==================================
 **/

var Digital = function(opts) {
	opts = opts || {};
	if (typeof opts.el === undefined) return;
	this.el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
	this.els = this.el.children;
	this.length = this.els.length;
	this.distance = opts.distance;
	// *** this.target = opts.target;
	// *** this.indexArr = (this.target + '').split('');
	this.duration = opts.duration || 1000;
	this.interval = opts.interval || 100;
	this.easing = (opts.easing && this.tween[opts.easing]) || this.tween.easeInOutCirc;
	// *** this.complete = opts.complete || function(){};
	this.animated = false;
	this.count = 0;
	this.init();
};
Digital.prototype = {
	init: function() {
		this.initSet();
		// this.start();
	},
	initSet: function() {
		for (var i = 0; i < this.length; i++) {
			if (getComputedStyle(this.els[i], null).backgroundRepeat !== 'repeat-y') this.els[i].style.backgroundRepeat = 'repeat-y';
			this.setPos(i, 0);
		}
	},
	start: function(num, fn) {
		this.indexArr = (num + '').split('');
		this.scroll(function() {
			fn && fn();
		});
	},
	scroll: function(fn) {
		if (this.animated) return;
		this.animated = true;
		var _this = this,
			i = 0;
		this.count = 0;
		for (; i < this.length; i++) {
			(function(index) {
				setTimeout(function() {
					_this.animate(index, 0, (_this.distance * 60) - (_this.distance * _this.indexArr[index]), function() {
						fn && fn();
					});
				}, index * _this.interval);
			}(i));
		}
	},
	animate: function(index, start, target, fn) {
		var start = start,
			end = target,
			change = end - start,
			duration = this.duration + index * this.interval,
			startTime = +new Date(),
			ease = this.easing,
			_this = this;
		!function animate() {
			var nowTime = +new Date(),
				timestamp = nowTime - startTime,
				delta = ease(timestamp / duration);
			_this.setPos(index, start + delta * change);
			if (duration <= timestamp) {
				_this.setPos(index, end);
				if (++_this.count === _this.length) {
					_this.animated = false;
					fn && fn();
					// _this.complete && _this.complete();
				}
			} else {
				setTimeout(animate, 17);
			}
		}();
	},
	setPos: function(index, v) {
		// this.els[index].style.backgroundPositionY = v + 'px';
		this.els[index].style.backgroundPosition = '0px ' + v + 'px'; //兼容火狐
	},
	tween: {
		easeInOutSine: function(pos) {
			return (-.5 * (Math.cos(Math.PI * pos) - 1));
		},
		easeInOutCirc: function(pos) {
			if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
			return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
		}
	}
};