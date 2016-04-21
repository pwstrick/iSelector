(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return factory(root);
		});
	} else if (typeof exports === 'object') {
		module.exports = factory;
	} else {
		root.iSelector = factory(root);
	}
})(this, function(root) {
	var slice = [].slice,
		filter = [].filter,
		map = [].map,
		some = [].some,
		concat = [].concat,
		forEach = [].forEach,
		toString = Object.prototype.toString;

	var isArray = Array.isArray || function(obj) {
		return toString.call(obj) === '[object Array]';
	};

	function iSelector(dom) {
		var i, len = dom ? dom.length : 0;
		for (i = 0; i < len; i++)
			this[i] = dom[i];
		this.length = len;
		//this.selector = 22 || '';
	};

	function isFunction(selector) {
		return typeof selector == 'function';
	}

	function isObject(selector) {
		return typeof selector == 'object';
	}

	function isString(selector) {
		return toString.call(selector) == '[object String]';
	}

	function isDocument(obj) {
		return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	}

	function flatten(elements) {
		return concat.apply([], elements);
	}

	function isiSelector(selector) {
		return selector instanceof iSelector;
	}

	/**
	 * 初始化
	 * @param {String|Array} selector
	 * @param {String|Array} context
	 */
	S = function(selector, context) {
		return S.init(selector, context)
	};
	S.init = function(selector, context) {
		var dom;
		//		if (!selector) 
		//			return new iSelector()
		if (isString(selector)) {
			if (context !== undefined)
				return S(context).find(selector);
			else
				dom = S.qsa(document, selector);
		} else if (isArray(selector)) {
			dom = selector;
		} else if (isiSelector(selector)) {
			return selector;
		} else if (isObject(selector)) {
			//console.log(selector)
			dom = [selector];
		}
		return new iSelector(dom);
	};

	/**
	 * 选择器匹配
	 * @param {Object} element
	 * @param {String} selector
	 */
	S.matches = function(element, selector) {
		if (!selector || !element || element.nodeType !== 1)
			return false;
		var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
			element.oMatchesSelector || element.matchesSelector
		return matchesSelector.call(element, selector);
	};

	/**
	 * 使用最合适的匹配方法
	 * @param {Object} element
	 * @param {String} selector
	 */
	S.qsa = function qsa(element, selector) {
		var found,
			maybeID = selector[0] == '#',
			maybeClass = !maybeID && selector[0] == '.',
			nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
			isSimple = /^[\w-]*$/.test(nameOnly);
		return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
			((found = element.getElementById(nameOnly)) ? [found] : []) :
			(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] : slice.call(
				isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
				maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
				element.getElementsByTagName(selector) : // Or a tag
				element.querySelectorAll(selector) // Or it's not simple, and we need to query all
			);
	};

	/**
	 * 复制参数
	 */
	S.extend = function(target, source) {
		for (key in source) {
			if (source[key] !== undefined && source.hasOwnProperty(key))
				target[key] = source[key];
		}
	};

	/**
	 * 判断是否是子节点
	 */
	S.contains = function(parent, node) {
		if (document.documentElement.contains)
			return parent !== node && parent.contains(node);
		while (node && (node = node.parentNode)) {
			if (node === parent)
				return true;
		}
		return false;
	}

	/**
	 * 查找子元素兼容方法
	 */
	S.children = function(element) {
		if ('children' in element)
			return slice.call(element.children);
		return map.call(element.childNodes, function(node) {
			if (node.nodeType == 1)
				return node;
		});
	}

	/**
	 * map后的数组可能会出现[Array[2],Array[3]]，得扁平化成一维
	 * @param {Object} elements
	 */
	S.map = function(elements, fn) {
		var nodes = map.call(elements, function(element, index) {
			return fn.call(element, element, index);
		});
		//过滤null undefind
		nodes = filter.call(nodes, function(element) {
			return element != null;
		});
		return flatten(nodes);
	}

	S.fn = {
		/**
		 * 遍历
		 */
		each: function(fn) {
			forEach.call(this, function(element, index) {
				fn.call(element, element, index);
			});
			return this;
		},
		/**
		 * 过滤节点
		 * @param {Function|String} selector
		 */
		filter: function(selector) {
			var filters = this;
			if (isFunction(selector)) {
				filters = filter.call(this, function(element, index) {
					return selector.call(element, index);
				});
			} else if (isString(selector)) {
				filters = filter.call(this, function(element) {
					return S.matches(element, selector);
				});
			}
			return S(filters);
		},
		/**
		 * 查找元素的子节点
		 * @param {String} selector
		 */
		find: function(selector) {
			//console.log(this)
			if (this.length == 1)
				results = S.qsa(this[0], selector);
			else {
				//结果可能会出现[Array[2],Array[3]]这样的数组
				results = S.map(this, function() {
					return S.qsa(this, selector);
				});
			}
			return S(results);
		},
		/**
		 * 最先匹配selector的祖先元素
		 * @param {String} selector
		 */
		closest: function(selector) {
			if (!(0 in this)) {
				return null;
			}
			var node = this[0];
			while (node && !S.matches(node, selector))
				node = !isDocument(node) && node.parentNode;
			return S(node);
		},
		/**
		 * 直接子元素
		 * @param {String} selector
		 */
		children: function(selector) {
			var nodes = S.map(this, function() {
				return S.children(this);
			});
			return S(nodes).filter(selector);
		},
		/**
		 * 兄弟元素
		 * @param {String} selector
		 */
		siblings: function(selector) {
			var elements = S.map(this, function(element) {
				//找出此节点的所有兄弟节点
				return filter.call(S.children(element.parentNode), function(child) {
					return child !== element;
				});
			});
			//过滤节点
			return S(elements).filter(selector);
		},
		/**
		 * 上一个元素
		 * @param {String} selector
		 */
		prev: function(selector) {
			var nodes = S.map(this, function() {
				return this['previousElementSibling'];
			});
			return S(nodes).filter(selector);
		},
		/**
		 * 下一个元素
		 * @param {String} selector
		 */
		next: function(selector) {
			var nodes = S.map(this, function() {
				return this['nextElementSibling'];
			});
			return S(nodes).filter(selector);
		},
		/**
		 * 将元素添加到前面
		 * @param {Object} element
		 */
		before: function(element) {
			S.map(this, function() {
				parent = this.parentNode;
				parent != this && parent.insertBefore(element, this);
			});
		},
		/**
		 * 将元素添加到后面
		 * @param {Object} element
		 */
		after: function(element) {
			S.map(this, function() {
				parent = this.parentNode;
				reference = S(this).next();
				reference = reference.length > 0 ? reference[0] : null;
				parent != this && parent.insertBefore(element, reference);
			});
		},
		html: function(html) {
			//赋值
			if (0 in arguments) {
				this.each(function() {
					this.innerHTML = html;
				});
			} else {
				return 0 in this ? this[0].innerHTML : null;
			}
		},
		/**
		 * 设置属性
		 * @param {Object|String} name
		 * @param {String} value
		 */
		attr: function(name, value) {
			//没有value值，并且name是字符串
			if (!(1 in arguments) && isString(name)) {
				return 0 in this ? this[0].getAttribute(name) : null;
			}
			return this.each(function() {
				if (isObject(name)) {
					for (key in name)
						this.setAttribute(key, name[key]);
					return;
				}
				this.setAttribute(name, value);
			});
		},
		removeAttr: function(name) {
			return this.each(function() {
				var element = this;
				name.split(' ').forEach(function(current) {
					element.removeAttribute(current);
				})
			});
		},
		/**
		 * 修改样式名
		 * @param {String|Array} name
		 */
		setClass: function(name, isAdd) {
			isAdd===undefined && (isAdd=true);
			if(isString(name)) {
				name = name.split(/\s+/);
			}
			return this.each(function() {
				var cames = this.className || '', classList = isAdd ? [].concat(name) : [];
				cames.split(/\s+/).forEach(function(came) {
					(name.indexOf(came)==-1 && came.length>0) && classList.push(came);
				});
				this.className = classList.join(' ');
			});
		},
		hasClass: function(name) {
			var regex = new RegExp('(^|\\s)'+name+'(\\s|$)');
			return some.call(this, function(element) {
				return this.test(element.className);
			}, regex);
		}
	};

	iSelector.prototype = S.fn;
	return S;
});
