/**
 * 选择器匹配
 */
function matches(element, selector) {
	if (!selector || !element || element.nodeType !== 1)
		return false;
	var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
		element.oMatchesSelector || element.matchesSelector
	return matchesSelector.call(element, selector);
}

/**
 * 使用最合适的匹配方法
 */
function qsa(element, selector) {
	var found,
		maybeID = selector[0] == '#',
		maybeClass = !maybeID && selector[0] == '.',
		nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
		isSimple = /^[\w-]*$/.test(nameOnly);
	return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
		((found = element.getElementById(nameOnly)) ? [found] : []) :
		(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] : [].slice.call(
			isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
			maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
			element.getElementsByTagName(selector) : // Or a tag
			element.querySelectorAll(selector) // Or it's not simple, and we need to query all
		);
}

/**
 * 复制参数
 */
function extend(target, source) {
	for (key in source) {
		if (source[key] !== undefined && source.hasOwnProperty(key))
			target[key] = source[key];
	}
}

/**
 * 判断是否是子节点
 */
function contains(parent, node) {
	if (document.documentElement.contains)
		return parent !== node && parent.contains(node);
	while (node && (node = node.parentNode)) {
		if (node === parent)
			return true;
	}
	return false;
}

/**
 * 过滤节点
 */
function filter(nodes, selector) {
	var results = [];
	if (typeof selector == 'function') {
		nodes.forEach(function(node, index) {
			if (selector.call(node, index)) {
				results.push(node);
			}
		});
		return results;
	}
	return [].filter.call(nodes, function(node) {
		return matches(element, selector);
	});
}