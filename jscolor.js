From: <Saved by Blink>
Snapshot-Content-Location: https://vembrabo.alphi.media/banner/jscolor.js
Subject: 
Date: Sat, 26 Nov 2022 09:50:40 -0000
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--2QYK6ZAeOtLUmWhnHFCLHnXYNUolw0EwRLt2w8t3ix----"


------MultipartBoundary--2QYK6ZAeOtLUmWhnHFCLHnXYNUolw0EwRLt2w8t3ix----
Content-Type: text/html
Content-ID: <frame-135BF980666481D675CF2A8113A134B7@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: https://vembrabo.alphi.media/banner/jscolor.js

<html><head><meta http-equiv=3D"Content-Type" content=3D"text/html; charset=
=3Dwindows-1252"></head><body><pre style=3D"word-wrap: break-word; white-sp=
ace: pre-wrap;">/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko - East Desire
 * @version 2.4.3
 *
 * See usage examples at http://jscolor.com/examples/
 */


(function (global, factory) {

	'use strict';

	if (typeof module =3D=3D=3D 'object' &amp;&amp; typeof module.exports =3D=
=3D=3D 'object') {
		// Export jscolor as a module
		module.exports =3D global.document ?
			factory (global) :
			function (win) {
				if (!win.document) {
					throw new Error('jscolor needs a window with document');
				}
				return factory(win);
			}
		return;
	}

	// Default use (no module export)
	factory(global);

})(typeof window !=3D=3D 'undefined' ? window : this, function (window) { /=
/ BEGIN factory

// BEGIN jscolor code


'use strict';


var jscolor =3D (function () { // BEGIN jscolor

var jsc =3D {


	initialized : false,

	instances : [], // created instances of jscolor

	readyQueue : [], // functions waiting to be called after init


	register : function () {
		if (typeof window !=3D=3D 'undefined' &amp;&amp; window.document) {
			window.document.addEventListener('DOMContentLoaded', jsc.pub.init, false=
);
		}
	},


	installBySelector : function (selector, rootNode) {
		rootNode =3D rootNode ? jsc.node(rootNode) : window.document;
		if (!rootNode) {
			throw new Error('Missing root node');
		}

		var elms =3D rootNode.querySelectorAll(selector);

		// for backward compatibility with DEPRECATED installation/configuration =
using className
		var matchClass =3D new RegExp('(^|\\s)(' + jsc.pub.lookupClass + ')(\\s*(=
\\{[^}]*\\})|\\s|$)', 'i');

		for (var i =3D 0; i &lt; elms.length; i +=3D 1) {

			if (elms[i].jscolor &amp;&amp; elms[i].jscolor instanceof jsc.pub) {
				continue; // jscolor already installed on this element
			}

			if (elms[i].type !=3D=3D undefined &amp;&amp; elms[i].type.toLowerCase()=
 =3D=3D 'color' &amp;&amp; jsc.isColorAttrSupported) {
				continue; // skips inputs of type 'color' if supported by the browser
			}

			var dataOpts, m;

			if (
				(dataOpts =3D jsc.getDataAttr(elms[i], 'jscolor')) !=3D=3D null ||
				(elms[i].className &amp;&amp; (m =3D elms[i].className.match(matchClass=
))) // installation using className (DEPRECATED)
			) {
				var targetElm =3D elms[i];

				var optsStr =3D '';
				if (dataOpts !=3D=3D null) {
					optsStr =3D dataOpts;

				} else if (m) { // installation using className (DEPRECATED)
					console.warn('Installation using class name is DEPRECATED. Use data-js=
color=3D"" attribute instead.' + jsc.docsRef);
					if (m[4]) {
						optsStr =3D m[4];
					}
				}

				var opts =3D null;
				if (optsStr.trim()) {
					try {
						opts =3D jsc.parseOptionsStr(optsStr);
					} catch (e) {
						console.warn(e + '\n' + optsStr);
					}
				}

				try {
					new jsc.pub(targetElm, opts);
				} catch (e) {
					console.warn(e);
				}
			}
		}
	},


	parseOptionsStr : function (str) {
		var opts =3D null;

		try {
			opts =3D JSON.parse(str);

		} catch (eParse) {
			if (!jsc.pub.looseJSON) {
				throw new Error('Could not parse jscolor options as JSON: ' + eParse);
			} else {
				// loose JSON syntax is enabled -&gt; try to evaluate the options strin=
g as JavaScript object
				try {
					opts =3D (new Function ('var opts =3D (' + str + '); return typeof opt=
s =3D=3D=3D "object" ? opts : {};'))();
				} catch (eEval) {
					throw new Error('Could not evaluate jscolor options: ' + eEval);
				}
			}
		}
		return opts;
	},


	getInstances : function () {
		var inst =3D [];
		for (var i =3D 0; i &lt; jsc.instances.length; i +=3D 1) {
			// if the targetElement still exists, the instance is considered "alive"
			if (jsc.instances[i] &amp;&amp; jsc.instances[i].targetElement) {
				inst.push(jsc.instances[i]);
			}
		}
		return inst;
	},


	createEl : function (tagName) {
		var el =3D window.document.createElement(tagName);
		jsc.setData(el, 'gui', true);
		return el;
	},


	node : function (nodeOrSelector) {
		if (!nodeOrSelector) {
			return null;
		}

		if (typeof nodeOrSelector =3D=3D=3D 'string') {
			// query selector
			var sel =3D nodeOrSelector;
			var el =3D null;
			try {
				el =3D window.document.querySelector(sel);
			} catch (e) {
				console.warn(e);
				return null;
			}
			if (!el) {
				console.warn('No element matches the selector: %s', sel);
			}
			return el;
		}

		if (jsc.isNode(nodeOrSelector)) {
			// DOM node
			return nodeOrSelector;
		}

		console.warn('Invalid node of type %s: %s', typeof nodeOrSelector, nodeOr=
Selector);
		return null;
	},


	// See https://stackoverflow.com/questions/384286/
	isNode : function (val) {
		if (typeof Node =3D=3D=3D 'object') {
			return val instanceof Node;
		}
		return val &amp;&amp; typeof val =3D=3D=3D 'object' &amp;&amp; typeof val=
.nodeType =3D=3D=3D 'number' &amp;&amp; typeof val.nodeName =3D=3D=3D 'stri=
ng';
	},


	nodeName : function (node) {
		if (node &amp;&amp; node.nodeName) {
			return node.nodeName.toLowerCase();
		}
		return false;
	},


	removeChildren : function (node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},


	isTextInput : function (el) {
		return el &amp;&amp; jsc.nodeName(el) =3D=3D=3D 'input' &amp;&amp; el.typ=
e.toLowerCase() =3D=3D=3D 'text';
	},


	isButton : function (el) {
		if (!el) {
			return false;
		}
		var n =3D jsc.nodeName(el);
		return (
			(n =3D=3D=3D 'button') ||
			(n =3D=3D=3D 'input' &amp;&amp; ['button', 'submit', 'reset'].indexOf(el=
.type.toLowerCase()) &gt; -1)
		);
	},


	isButtonEmpty : function (el) {
		switch (jsc.nodeName(el)) {
			case 'input': return (!el.value || el.value.trim() =3D=3D=3D '');
			case 'button': return (el.textContent.trim() =3D=3D=3D '');
		}
		return null; // could not determine element's text
	},


	// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explaine=
r.md
	isPassiveEventSupported : (function () {
		var supported =3D false;

		try {
			var opts =3D Object.defineProperty({}, 'passive', {
				get: function () { supported =3D true; }
			});
			window.addEventListener('testPassive', null, opts);
			window.removeEventListener('testPassive', null, opts);
		} catch (e) {}

		return supported;
	})(),


	isColorAttrSupported : (function () {
		var elm =3D window.document.createElement('input');
		if (elm.setAttribute) {
			elm.setAttribute('type', 'color');
			if (elm.type.toLowerCase() =3D=3D 'color') {
				return true;
			}
		}
		return false;
	})(),


	dataProp : '_data_jscolor',


	// usage:
	//   setData(obj, prop, value)
	//   setData(obj, {prop:value, ...})
	//
	setData : function () {
		var obj =3D arguments[0];

		if (arguments.length =3D=3D=3D 3) {
			// setting a single property
			var data =3D obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj=
[jsc.dataProp] =3D {});
			var prop =3D arguments[1];
			var value =3D arguments[2];

			data[prop] =3D value;
			return true;

		} else if (arguments.length =3D=3D=3D 2 &amp;&amp; typeof arguments[1] =
=3D=3D=3D 'object') {
			// setting multiple properties
			var data =3D obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj=
[jsc.dataProp] =3D {});
			var map =3D arguments[1];

			for (var prop in map) {
				if (map.hasOwnProperty(prop)) {
					data[prop] =3D map[prop];
				}
			}
			return true;
		}

		throw new Error('Invalid arguments');
	},


	// usage:
	//   removeData(obj, prop, [prop...])
	//
	removeData : function () {
		var obj =3D arguments[0];
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			return true; // data object does not exist
		}
		for (var i =3D 1; i &lt; arguments.length; i +=3D 1) {
			var prop =3D arguments[i];
			delete obj[jsc.dataProp][prop];
		}
		return true;
	},


	getData : function (obj, prop, setDefault) {
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			// data object does not exist
			if (setDefault !=3D=3D undefined) {
				obj[jsc.dataProp] =3D {}; // create data object
			} else {
				return undefined; // no value to return
			}
		}
		var data =3D obj[jsc.dataProp];

		if (!data.hasOwnProperty(prop) &amp;&amp; setDefault !=3D=3D undefined) {
			data[prop] =3D setDefault;
		}
		return data[prop];
	},


	getDataAttr : function (el, name) {
		var attrName =3D 'data-' + name;
		var attrValue =3D el.getAttribute(attrName);
		return attrValue;
	},


	setDataAttr : function (el, name, value) {
		var attrName =3D 'data-' + name;
		el.setAttribute(attrName, value);
	},


	_attachedGroupEvents : {},


	attachGroupEvent : function (groupName, el, evnt, func) {
		if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			jsc._attachedGroupEvents[groupName] =3D [];
		}
		jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
		el.addEventListener(evnt, func, false);
	},


	detachGroupEvents : function (groupName) {
		if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			for (var i =3D 0; i &lt; jsc._attachedGroupEvents[groupName].length; i +=
=3D 1) {
				var evt =3D jsc._attachedGroupEvents[groupName][i];
				evt[0].removeEventListener(evt[1], evt[2], false);
			}
			delete jsc._attachedGroupEvents[groupName];
		}
	},


	preventDefault : function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue =3D false;
	},


	captureTarget : function (target) {
		// IE
		if (target.setCapture) {
			jsc._capturedTarget =3D target;
			jsc._capturedTarget.setCapture();
		}
	},


	releaseTarget : function () {
		// IE
		if (jsc._capturedTarget) {
			jsc._capturedTarget.releaseCapture();
			jsc._capturedTarget =3D null;
		}
	},


	triggerEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}

		var ev =3D null;

		if (typeof Event =3D=3D=3D 'function') {
			ev =3D new Event(eventName, {
				bubbles: bubbles,
				cancelable: cancelable
			});
		} else {
			// IE
			ev =3D window.document.createEvent('Event');
			ev.initEvent(eventName, bubbles, cancelable);
		}

		if (!ev) {
			return false;
		}

		// so that we know that the event was triggered internally
		jsc.setData(ev, 'internal', true);

		el.dispatchEvent(ev);
		return true;
	},


	triggerInputEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}
		if (jsc.isTextInput(el)) {
			jsc.triggerEvent(el, eventName, bubbles, cancelable);
		}
	},


	eventKey : function (ev) {
		var keys =3D {
			9: 'Tab',
			13: 'Enter',
			27: 'Escape',
		};
		if (typeof ev.code =3D=3D=3D 'string') {
			return ev.code;
		} else if (ev.keyCode !=3D=3D undefined &amp;&amp; keys.hasOwnProperty(ev=
.keyCode)) {
			return keys[ev.keyCode];
		}
		return null;
	},


	strList : function (str) {
		if (!str) {
			return [];
		}
		return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	},


	// The className parameter (str) can only contain a single class name
	hasClass : function (elm, className) {
		if (!className) {
			return false;
		}
		if (elm.classList !=3D=3D undefined) {
			return elm.classList.contains(className);
		}
		// polyfill
		return -1 !=3D (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf('=
 ' + className + ' ');
	},


	// The className parameter (str) can contain multiple class names separate=
d by whitespace
	addClass : function (elm, className) {
		var classNames =3D jsc.strList(className);

		if (elm.classList !=3D=3D undefined) {
			for (var i =3D 0; i &lt; classNames.length; i +=3D 1) {
				elm.classList.add(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i =3D 0; i &lt; classNames.length; i +=3D 1) {
			if (!jsc.hasClass(elm, classNames[i])) {
				elm.className +=3D (elm.className ? ' ' : '') + classNames[i];
			}
		}
	},


	// The className parameter (str) can contain multiple class names separate=
d by whitespace
	removeClass : function (elm, className) {
		var classNames =3D jsc.strList(className);

		if (elm.classList !=3D=3D undefined) {
			for (var i =3D 0; i &lt; classNames.length; i +=3D 1) {
				elm.classList.remove(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i =3D 0; i &lt; classNames.length; i +=3D 1) {
			var repl =3D new RegExp(
				'^\\s*' + classNames[i] + '\\s*|' +
				'\\s*' + classNames[i] + '\\s*$|' +
				'\\s+' + classNames[i] + '(\\s+)',
				'g'
			);
			elm.className =3D elm.className.replace(repl, '$1');
		}
	},


	getCompStyle : function (elm) {
		var compStyle =3D window.getComputedStyle ? window.getComputedStyle(elm) =
: elm.currentStyle;

		// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
		// that's why we need to check if the returned value is non-empty
		if (!compStyle) {
			return {};
		}
		return compStyle;
	},


	// Note:
	//   Setting a property to NULL reverts it to the state before it was firs=
t set
	//   with the 'reversible' flag enabled
	//
	setStyle : function (elm, styles, important, reversible) {
		// using '' for standard priority (IE10 apparently doesn't like value und=
efined)
		var priority =3D important ? 'important' : '';
		var origStyle =3D null;

		for (var prop in styles) {
			if (styles.hasOwnProperty(prop)) {
				var setVal =3D null;

				if (styles[prop] =3D=3D=3D null) {
					// reverting a property value

					if (!origStyle) {
						// get the original style object, but dont't try to create it if it d=
oesn't exist
						origStyle =3D jsc.getData(elm, 'origStyle');
					}
					if (origStyle &amp;&amp; origStyle.hasOwnProperty(prop)) {
						// we have property's original value -&gt; use it
						setVal =3D origStyle[prop];
					}

				} else {
					// setting a property value

					if (reversible) {
						if (!origStyle) {
							// get the original style object and if it doesn't exist, create it
							origStyle =3D jsc.getData(elm, 'origStyle', {});
						}
						if (!origStyle.hasOwnProperty(prop)) {
							// original property value not yet stored -&gt; store it
							origStyle[prop] =3D elm.style[prop];
						}
					}
					setVal =3D styles[prop];
				}

				if (setVal !=3D=3D null) {
					elm.style.setProperty(prop, setVal, priority);
				}
			}
		}
	},


	hexColor : function (r, g, b) {
		return '#' + (
			('0' + Math.round(r).toString(16)).substr(-2) +
			('0' + Math.round(g).toString(16)).substr(-2) +
			('0' + Math.round(b).toString(16)).substr(-2)
		).toUpperCase();
	},


	rgbColor : function (r, g, b) {
		return 'rgb(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) +
		')';
	},


	rgbaColor : function (r, g, b, a) {
		return 'rgba(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) + ',' +
			(Math.round((a=3D=3D=3Dundefined || a=3D=3D=3Dnull ? 1 : a) * 100) / 100=
) +
		')';
	},


	linearGradient : (function () {

		function getFuncName () {
			var stdName =3D 'linear-gradient';
			var prefixes =3D ['', '-webkit-', '-moz-', '-o-', '-ms-'];
			var helper =3D window.document.createElement('div');

			for (var i =3D 0; i &lt; prefixes.length; i +=3D 1) {
				var tryFunc =3D prefixes[i] + stdName;
				var tryVal =3D tryFunc + '(to right, rgba(0,0,0,0), rgba(0,0,0,0))';

				helper.style.background =3D tryVal;
				if (helper.style.background) { // CSS background successfully set -&gt;=
 function name is supported
					return tryFunc;
				}
			}
			return stdName; // fallback to standard 'linear-gradient' without vendor=
 prefix
		}

		var funcName =3D getFuncName();

		return function () {
			return funcName + '(' + Array.prototype.join.call(arguments, ', ') + ')'=
;
		};

	})(),


	setBorderRadius : function (elm, value) {
		jsc.setStyle(elm, {'border-radius' : value || '0'});
	},


	setBoxShadow : function (elm, value) {
		jsc.setStyle(elm, {'box-shadow': value || 'none'});
	},


	getElementPos : function (e, relativeToViewport) {
		var x=3D0, y=3D0;
		var rect =3D e.getBoundingClientRect();
		x =3D rect.left;
		y =3D rect.top;
		if (!relativeToViewport) {
			var viewPos =3D jsc.getViewPos();
			x +=3D viewPos[0];
			y +=3D viewPos[1];
		}
		return [x, y];
	},


	getElementSize : function (e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	// get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos : function (e) {
		var x =3D 0, y =3D 0;
		if (typeof e.changedTouches !=3D=3D 'undefined' &amp;&amp; e.changedTouch=
es.length) {
			// touch devices
			x =3D e.changedTouches[0].clientX;
			y =3D e.changedTouches[0].clientY;
		} else if (typeof e.clientX =3D=3D=3D 'number') {
			x =3D e.clientX;
			y =3D e.clientY;
		}
		return { x: x, y: y };
	},


	// get pointer's X/Y coordinates relative to target element
	getRelPointerPos : function (e) {
		var target =3D e.target || e.srcElement;
		var targetRect =3D target.getBoundingClientRect();

		var x =3D 0, y =3D 0;

		var clientX =3D 0, clientY =3D 0;
		if (typeof e.changedTouches !=3D=3D 'undefined' &amp;&amp; e.changedTouch=
es.length) {
			// touch devices
			clientX =3D e.changedTouches[0].clientX;
			clientY =3D e.changedTouches[0].clientY;
		} else if (typeof e.clientX =3D=3D=3D 'number') {
			clientX =3D e.clientX;
			clientY =3D e.clientY;
		}

		x =3D clientX - targetRect.left;
		y =3D clientY - targetRect.top;
		return { x: x, y: y };
	},


	getViewPos : function () {
		var doc =3D window.document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	},


	getViewSize : function () {
		var doc =3D window.document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	},


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	// returns: [ 0-360, 0-100, 0-100 ]
	//
	RGB_HSV : function (r, g, b) {
		r /=3D 255;
		g /=3D 255;
		b /=3D 255;
		var n =3D Math.min(Math.min(r,g),b);
		var v =3D Math.max(Math.max(r,g),b);
		var m =3D v - n;
		if (m =3D=3D=3D 0) { return [ null, 0, 100 * v ]; }
		var h =3D r=3D=3D=3Dn ? 3+(b-g)/m : (g=3D=3D=3Dn ? 5+(r-b)/m : 1+(g-r)/m)=
;
		return [
			60 * (h=3D=3D=3D6?0:h),
			100 * (m/v),
			100 * v
		];
	},


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	// returns: [ 0-255, 0-255, 0-255 ]
	//
	HSV_RGB : function (h, s, v) {
		var u =3D 255 * (v / 100);

		if (h =3D=3D=3D null) {
			return [ u, u, u ];
		}

		h /=3D 60;
		s /=3D 100;

		var i =3D Math.floor(h);
		var f =3D i%2 ? h-i : 1-(h-i);
		var m =3D u * (1 - s);
		var n =3D u * (1 - s * f);
		switch (i) {
			case 6:
			case 0: return [u,n,m];
			case 1: return [n,u,m];
			case 2: return [m,u,n];
			case 3: return [m,n,u];
			case 4: return [n,m,u];
			case 5: return [u,m,n];
		}
	},


	parseColorString : function (str) {
		var ret =3D {
			rgba: null,
			format: null // 'hex' | 'rgb' | 'rgba'
		};

		var m;
		if (m =3D str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
			// HEX notation

			ret.format =3D 'hex';

			if (m[1].length =3D=3D=3D 6) {
				// 6-char notation
				ret.rgba =3D [
					parseInt(m[1].substr(0,2),16),
					parseInt(m[1].substr(2,2),16),
					parseInt(m[1].substr(4,2),16),
					null
				];
			} else {
				// 3-char notation
				ret.rgba =3D [
					parseInt(m[1].charAt(0) + m[1].charAt(0),16),
					parseInt(m[1].charAt(1) + m[1].charAt(1),16),
					parseInt(m[1].charAt(2) + m[1].charAt(2),16),
					null
				];
			}
			return ret;

		} else if (m =3D str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
			// rgb(...) or rgba(...) notation

			var params =3D m[1].split(',');
			var re =3D /^\s*(\d+|\d*\.\d+|\d+\.\d*)\s*$/;
			var mR, mG, mB, mA;
			if (
				params.length &gt;=3D 3 &amp;&amp;
				(mR =3D params[0].match(re)) &amp;&amp;
				(mG =3D params[1].match(re)) &amp;&amp;
				(mB =3D params[2].match(re))
			) {
				ret.format =3D 'rgb';
				ret.rgba =3D [
					parseFloat(mR[1]) || 0,
					parseFloat(mG[1]) || 0,
					parseFloat(mB[1]) || 0,
					null
				];

				if (
					params.length &gt;=3D 4 &amp;&amp;
					(mA =3D params[3].match(re))
				) {
					ret.format =3D 'rgba';
					ret.rgba[3] =3D parseFloat(mA[1]) || 0;
				}
				return ret;
			}
		}

		return false;
	},


	parsePaletteValue : function (mixed) {
		var vals =3D [];

		if (typeof mixed =3D=3D=3D 'string') { // input is a string of space sepa=
rated color values
			// rgb() and rgba() may contain spaces too, so let's find all color valu=
es by regex
			mixed.replace(/#[0-9A-F]{3}([0-9A-F]{3})?|rgba?\(([^)]*)\)/ig, function =
(val) {
				vals.push(val);
			});
		} else if (Array.isArray(mixed)) { // input is an array of color values
			vals =3D mixed;
		}

		// convert all values into uniform color format

		var colors =3D [];

		for (var i =3D 0; i &lt; vals.length; i++) {
			var color =3D jsc.parseColorString(vals[i]);
			if (color) {
				colors.push(color);
			}
		}

		return colors;
	},


	containsTranparentColor : function (colors) {
		for (var i =3D 0; i &lt; colors.length; i++) {
			var a =3D colors[i].rgba[3];
			if (a !=3D=3D null &amp;&amp; a &lt; 1.0) {
				return true;
			}
		}
		return false;
	},


	// Canvas scaling for retina displays
	//
	// adapted from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
	//
	scaleCanvasForHighDPR : function (canvas) {
		var dpr =3D window.devicePixelRatio || 1;
		canvas.width *=3D dpr;
		canvas.height *=3D dpr;
		var ctx =3D canvas.getContext('2d');
		ctx.scale(dpr, dpr);
	},


	genColorPreviewCanvas : function (color, separatorPos, specWidth, scaleFor=
HighDPR) {

		var sepW =3D Math.round(jsc.pub.previewSeparator.length);
		var sqSize =3D jsc.pub.chessboardSize;
		var sqColor1 =3D jsc.pub.chessboardColor1;
		var sqColor2 =3D jsc.pub.chessboardColor2;

		var cWidth =3D specWidth ? specWidth : sqSize * 2;
		var cHeight =3D sqSize * 2;

		var canvas =3D jsc.createEl('canvas');
		var ctx =3D canvas.getContext('2d');

		canvas.width =3D cWidth;
		canvas.height =3D cHeight;
		if (scaleForHighDPR) {
			jsc.scaleCanvasForHighDPR(canvas);
		}

		// transparency chessboard - background
		ctx.fillStyle =3D sqColor1;
		ctx.fillRect(0, 0, cWidth, cHeight);

		// transparency chessboard - squares
		ctx.fillStyle =3D sqColor2;
		for (var x =3D 0; x &lt; cWidth; x +=3D sqSize * 2) {
			ctx.fillRect(x, 0, sqSize, sqSize);
			ctx.fillRect(x + sqSize, sqSize, sqSize, sqSize);
		}

		if (color) {
			// actual color in foreground
			ctx.fillStyle =3D color;
			ctx.fillRect(0, 0, cWidth, cHeight);
		}

		var start =3D null;
		switch (separatorPos) {
			case 'left':
				start =3D 0;
				ctx.clearRect(0, 0, sepW/2, cHeight);
				break;
			case 'right':
				start =3D cWidth - sepW;
				ctx.clearRect(cWidth - (sepW/2), 0, sepW/2, cHeight);
				break;
		}
		if (start !=3D=3D null) {
			ctx.lineWidth =3D 1;
			for (var i =3D 0; i &lt; jsc.pub.previewSeparator.length; i +=3D 1) {
				ctx.beginPath();
				ctx.strokeStyle =3D jsc.pub.previewSeparator[i];
				ctx.moveTo(0.5 + start + i, 0);
				ctx.lineTo(0.5 + start + i, cHeight);
				ctx.stroke();
			}
		}

		return {
			canvas: canvas,
			width: cWidth,
			height: cHeight,
		};
	},


	// if position or width is not set =3D&gt; fill the entire element (0%-100=
%)
	genColorPreviewGradient : function (color, position, width) {
		var params =3D [];

		if (position &amp;&amp; width) {
			params =3D [
				'to ' + {'left':'right', 'right':'left'}[position],
				color + ' 0%',
				color + ' ' + width + 'px',
				'rgba(0,0,0,0) ' + (width + 1) + 'px',
				'rgba(0,0,0,0) 100%',
			];
		} else {
			params =3D [
				'to right',
				color + ' 0%',
				color + ' 100%',
			];
		}

		return jsc.linearGradient.apply(this, params);
	},


	redrawPosition : function () {

		if (jsc.picker &amp;&amp; jsc.picker.owner) {
			var thisObj =3D jsc.picker.owner;

			var tp, vp;

			if (thisObj.fixed) {
				// Fixed elements are positioned relative to viewport,
				// therefore we can ignore the scroll offset
				tp =3D jsc.getElementPos(thisObj.targetElement, true); // target pos
				vp =3D [0, 0]; // view pos
			} else {
				tp =3D jsc.getElementPos(thisObj.targetElement); // target pos
				vp =3D jsc.getViewPos(); // view pos
			}

			var ts =3D jsc.getElementSize(thisObj.targetElement); // target size
			var vs =3D jsc.getViewSize(); // view size
			var pd =3D jsc.getPickerDims(thisObj);
			var ps =3D [pd.borderW, pd.borderH]; // picker outer size
			var a, b, c;
			switch (thisObj.position.toLowerCase()) {
				case 'left': a=3D1; b=3D0; c=3D-1; break;
				case 'right':a=3D1; b=3D0; c=3D1; break;
				case 'top':  a=3D0; b=3D1; c=3D-1; break;
				default:     a=3D0; b=3D1; c=3D1; break;
			}
			var l =3D (ts[b]+ps[b])/2;

			// compute picker position
			if (!thisObj.smartPosition) {
				var pp =3D [
					tp[a],
					tp[b]+ts[b]-l+l*c
				];
			} else {
				var pp =3D [
					-vp[a]+tp[a]+ps[a] &gt; vs[a] ?
						(-vp[a]+tp[a]+ts[a]/2 &gt; vs[a]/2 &amp;&amp; tp[a]+ts[a]-ps[a] &gt;=
=3D 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
						tp[a],
					-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c &gt; vs[b] ?
						(-vp[b]+tp[b]+ts[b]/2 &gt; vs[b]/2 &amp;&amp; tp[b]+ts[b]-l-l*c &gt;=
=3D 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
						(tp[b]+ts[b]-l+l*c &gt;=3D 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
				];
			}

			var x =3D pp[a];
			var y =3D pp[b];
			var positionValue =3D thisObj.fixed ? 'fixed' : 'absolute';
			var contractShadow =3D
				(pp[0] + ps[0] &gt; tp[0] || pp[0] &lt; tp[0] + ts[0]) &amp;&amp;
				(pp[1] + ps[1] &lt; tp[1] + ts[1]);

			jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);
		}
	},


	_drawPosition : function (thisObj, x, y, positionValue, contractShadow) {
		var vShadow =3D contractShadow ? 0 : thisObj.shadowBlur; // px

		jsc.picker.wrap.style.position =3D positionValue;
		jsc.picker.wrap.style.left =3D x + 'px';
		jsc.picker.wrap.style.top =3D y + 'px';

		jsc.setBoxShadow(
			jsc.picker.boxS,
			thisObj.shadow ?
				new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColo=
r) :
				null);
	},


	getPickerDims : function (thisObj) {
		var w =3D 2 * thisObj.controlBorderWidth + thisObj.width;
		var h =3D 2 * thisObj.controlBorderWidth + thisObj.height;

		var sliderSpace =3D 2 * thisObj.controlBorderWidth + 2 * jsc.getControlPa=
dding(thisObj) + thisObj.sliderSize;

		if (jsc.getSliderChannel(thisObj)) {
			w +=3D sliderSpace;
		}
		if (thisObj.hasAlphaChannel()) {
			w +=3D sliderSpace;
		}

		var pal =3D jsc.getPaletteDims(thisObj, w);

		if (pal.height) {
			h +=3D pal.height + thisObj.padding;
		}
		if (thisObj.closeButton) {
			h +=3D 2 * thisObj.controlBorderWidth + thisObj.padding + thisObj.button=
Height;
		}

		var pW =3D w + (2 * thisObj.padding);
		var pH =3D h + (2 * thisObj.padding);

		return {
			contentW: w,
			contentH: h,
			paddedW: pW,
			paddedH: pH,
			borderW: pW + (2 * thisObj.borderWidth),
			borderH: pH + (2 * thisObj.borderWidth),
			palette: pal,
		};
	},


	getPaletteDims : function (thisObj, width) {
		var cols =3D 0, rows =3D 0, cellW =3D 0, cellH =3D 0, height =3D 0;
		var sampleCount =3D thisObj._palette ? thisObj._palette.length : 0;

		if (sampleCount) {
			cols =3D thisObj.paletteCols;
			rows =3D cols &gt; 0 ? Math.ceil(sampleCount / cols) : 0;

			// color sample's dimensions (includes border)
			cellW =3D Math.max(1, Math.floor((width - ((cols - 1) * thisObj.paletteS=
pacing)) / cols));
			cellH =3D thisObj.paletteHeight ? Math.min(thisObj.paletteHeight, cellW)=
 : cellW;
		}

		if (rows) {
			height =3D
				rows * cellH +
				(rows - 1) * thisObj.paletteSpacing;
		}

		return {
			cols: cols,
			rows: rows,
			cellW: cellW,
			cellH: cellH,
			width: width,
			height: height,
		};
	},


	getControlPadding : function (thisObj) {
		return Math.max(
			thisObj.padding / 2,
			(2 * thisObj.pointerBorderWidth + thisObj.pointerThickness) - thisObj.co=
ntrolBorderWidth
		);
	},


	getPadYChannel : function (thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v': return 'v'; break;
		}
		return 's';
	},


	getSliderChannel : function (thisObj) {
		if (thisObj.mode.length &gt; 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's': return 's'; break;
				case 'v': return 'v'; break;
			}
		}
		return null;
	},


	// calls function specified in picker's property
	triggerCallback : function (thisObj, prop) {
		if (!thisObj[prop]) {
			return; // callback func not specified
		}
		var callback =3D null;

		if (typeof thisObj[prop] =3D=3D=3D 'string') {
			// string with code
			try {
				callback =3D new Function (thisObj[prop]);
			} catch (e) {
				console.error(e);
			}
		} else {
			// function
			callback =3D thisObj[prop];
		}

		if (callback) {
			callback.call(thisObj);
		}
	},


	// Triggers a color change related event(s) on all picker instances.
	// It is possible to specify multiple events separated with a space.
	triggerGlobal : function (eventNames) {
		var inst =3D jsc.getInstances();
		for (var i =3D 0; i &lt; inst.length; i +=3D 1) {
			inst[i].trigger(eventNames);
		}
	},


	_pointerMoveEvent : {
		mouse: 'mousemove',
		touch: 'touchmove'
	},
	_pointerEndEvent : {
		mouse: 'mouseup',
		touch: 'touchend'
	},


	_pointerOrigin : null,
	_capturedTarget : null,


	onDocumentKeyUp : function (e) {
		if (['Tab', 'Escape'].indexOf(jsc.eventKey(e)) !=3D=3D -1) {
			if (jsc.picker &amp;&amp; jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onWindowResize : function (e) {
		jsc.redrawPosition();
	},


	onParentScroll : function (e) {
		// hide the picker when one of the parent elements is scrolled
		if (jsc.picker &amp;&amp; jsc.picker.owner) {
			jsc.picker.owner.tryHide();
		}
	},


	onDocumentMouseDown : function (e) {
		var target =3D e.target || e.srcElement;

		if (target.jscolor &amp;&amp; target.jscolor instanceof jsc.pub) { // cli=
cked targetElement -&gt; show picker
			if (target.jscolor.showOnClick &amp;&amp; !target.disabled) {
				target.jscolor.show();
			}
		} else if (jsc.getData(target, 'gui')) { // clicked jscolor's GUI element
			var control =3D jsc.getData(target, 'control');
			if (control) {
				// jscolor's control
				jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'm=
ouse');
			}
		} else {
			// mouse is outside the picker's controls -&gt; hide the color picker!
			if (jsc.picker &amp;&amp; jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onPickerTouchStart : function (e) {
		var target =3D e.target || e.srcElement;

		if (jsc.getData(target, 'control')) {
			jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'to=
uch');
		}
	},


	onControlPointerStart : function (e, target, controlName, pointerType) {
		var thisObj =3D jsc.getData(target, 'instance');

		jsc.preventDefault(e);
		jsc.captureTarget(target);

		var registerDragEvents =3D function (doc, offset) {
			jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType],
				jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset))=
;
			jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType],
				jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(window.document, [0, 0]);

		if (window.parent &amp;&amp; window.frameElement) {
			var rect =3D window.frameElement.getBoundingClientRect();
			var ofs =3D [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs =3D jsc.getAbsPointerPos(e);
		var rel =3D jsc.getRelPointerPos(e);
		jsc._pointerOrigin =3D {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
		case 'pad':
			// if the value slider is at the bottom, move it up
			if (jsc.getSliderChannel(thisObj) =3D=3D=3D 'v' &amp;&amp; thisObj.chann=
els.v =3D=3D=3D 0) {
				thisObj.fromHSVA(null, null, 100, null);
			}
			jsc.setPad(thisObj, e, 0, 0);
			break;

		case 'sld':
			jsc.setSld(thisObj, e, 0);
			break;

		case 'asld':
			jsc.setASld(thisObj, e, 0);
			break;
		}
		thisObj.trigger('input');
	},


	onDocumentPointerMove : function (e, target, controlName, pointerType, off=
set) {
		return function (e) {
			var thisObj =3D jsc.getData(target, 'instance');
			switch (controlName) {
			case 'pad':
				jsc.setPad(thisObj, e, offset[0], offset[1]);
				break;

			case 'sld':
				jsc.setSld(thisObj, e, offset[1]);
				break;

			case 'asld':
				jsc.setASld(thisObj, e, offset[1]);
				break;
			}
			thisObj.trigger('input');
		}
	},


	onDocumentPointerEnd : function (e, target, controlName, pointerType) {
		return function (e) {
			var thisObj =3D jsc.getData(target, 'instance');
			jsc.detachGroupEvents('drag');
			jsc.releaseTarget();

			// Always trigger changes AFTER detaching outstanding mouse handlers,
			// in case some color change that occured in user-defined onChange/onInp=
ut handler
			// intruded into current mouse events
			thisObj.trigger('input');
			thisObj.trigger('change');
		};
	},


	onPaletteSampleClick : function (e) {
		var target =3D e.currentTarget;
		var thisObj =3D jsc.getData(target, 'instance');
		var color =3D jsc.getData(target, 'color');

		// when format is flexible, use the original format of this color sample
		if (thisObj.format.toLowerCase() =3D=3D=3D 'any') {
			thisObj._setFormat(color.format); // adapt format
			if (thisObj.getFormat() !=3D=3D 'rgba') {
				color.rgba[3] =3D 1.0; // when switching to a format that doesn't suppo=
rt alpha, set full opacity
			}
		}

		// if this color doesn't specify alpha, use alpha of 1.0 (if applicable)
		if (color.rgba[3] =3D=3D=3D null) {
			if (thisObj.paletteSetsAlpha =3D=3D=3D true || (thisObj.paletteSetsAlpha=
 =3D=3D=3D 'auto' &amp;&amp; thisObj._paletteHasTransparency)) {
				color.rgba[3] =3D 1.0;
			}
		}

		thisObj.fromRGBA.apply(thisObj, color.rgba);

		thisObj.trigger('input');
		thisObj.trigger('change');

		if (thisObj.hideOnPaletteClick) {
			thisObj.hide();
		}
	},


	setPad : function (thisObj, e, ofsX, ofsY) {
		var pointerAbs =3D jsc.getAbsPointerPos(e);
		var x =3D ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - =
thisObj.controlBorderWidth;
		var y =3D ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - =
thisObj.controlBorderWidth;

		var xVal =3D x * (360 / (thisObj.width - 1));
		var yVal =3D 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getPadYChannel(thisObj)) {
		case 's': thisObj.fromHSVA(xVal, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(xVal, null, yVal, null); break;
		}
	},


	setSld : function (thisObj, e, ofsY) {
		var pointerAbs =3D jsc.getAbsPointerPos(e);
		var y =3D ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - =
thisObj.controlBorderWidth;
		var yVal =3D 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getSliderChannel(thisObj)) {
		case 's': thisObj.fromHSVA(null, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(null, null, yVal, null); break;
		}
	},


	setASld : function (thisObj, e, ofsY) {
		var pointerAbs =3D jsc.getAbsPointerPos(e);
		var y =3D ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - =
thisObj.controlBorderWidth;
		var yVal =3D 1.0 - (y * (1.0 / (thisObj.height - 1)));

		if (yVal &lt; 1.0) {
			// if format is flexible and the current format doesn't support alpha, s=
witch to a suitable one
			if (thisObj.format.toLowerCase() =3D=3D=3D 'any' &amp;&amp; thisObj.getF=
ormat() !=3D=3D 'rgba') {
				thisObj._setFormat('rgba');
			}
		}

		thisObj.fromHSVA(null, null, null, yVal);
	},


	createPadCanvas : function () {

		var ret =3D {
			elm: null,
			draw: null
		};

		var canvas =3D jsc.createEl('canvas');
		var ctx =3D canvas.getContext('2d');

		var drawFunc =3D function (width, height, type) {
			canvas.width =3D width;
			canvas.height =3D height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var hGrad =3D ctx.createLinearGradient(0, 0, canvas.width, 0);
			hGrad.addColorStop(0 / 6, '#F00');
			hGrad.addColorStop(1 / 6, '#FF0');
			hGrad.addColorStop(2 / 6, '#0F0');
			hGrad.addColorStop(3 / 6, '#0FF');
			hGrad.addColorStop(4 / 6, '#00F');
			hGrad.addColorStop(5 / 6, '#F0F');
			hGrad.addColorStop(6 / 6, '#F00');

			ctx.fillStyle =3D hGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			var vGrad =3D ctx.createLinearGradient(0, 0, 0, canvas.height);
			switch (type.toLowerCase()) {
			case 's':
				vGrad.addColorStop(0, 'rgba(255,255,255,0)');
				vGrad.addColorStop(1, 'rgba(255,255,255,1)');
				break;
			case 'v':
				vGrad.addColorStop(0, 'rgba(0,0,0,0)');
				vGrad.addColorStop(1, 'rgba(0,0,0,1)');
				break;
			}
			ctx.fillStyle =3D vGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm =3D canvas;
		ret.draw =3D drawFunc;

		return ret;
	},


	createSliderGradient : function () {

		var ret =3D {
			elm: null,
			draw: null
		};

		var canvas =3D jsc.createEl('canvas');
		var ctx =3D canvas.getContext('2d');

		var drawFunc =3D function (width, height, color1, color2) {
			canvas.width =3D width;
			canvas.height =3D height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var grad =3D ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color1);
			grad.addColorStop(1, color2);

			ctx.fillStyle =3D grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm =3D canvas;
		ret.draw =3D drawFunc;

		return ret;
	},


	createASliderGradient : function () {

		var ret =3D {
			elm: null,
			draw: null
		};

		var canvas =3D jsc.createEl('canvas');
		var ctx =3D canvas.getContext('2d');

		var drawFunc =3D function (width, height, color) {
			canvas.width =3D width;
			canvas.height =3D height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var sqSize =3D canvas.width / 2;
			var sqColor1 =3D jsc.pub.chessboardColor1;
			var sqColor2 =3D jsc.pub.chessboardColor2;

			// dark gray background
			ctx.fillStyle =3D sqColor1;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			if (sqSize &gt; 0) { // to avoid infinite loop
				for (var y =3D 0; y &lt; canvas.height; y +=3D sqSize * 2) {
					// light gray squares
					ctx.fillStyle =3D sqColor2;
					ctx.fillRect(0, y, sqSize, sqSize);
					ctx.fillRect(sqSize, y + sqSize, sqSize, sqSize);
				}
			}

			var grad =3D ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color);
			grad.addColorStop(1, 'rgba(0,0,0,0)');

			ctx.fillStyle =3D grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm =3D canvas;
		ret.draw =3D drawFunc;

		return ret;
	},


	BoxShadow : (function () {
		var BoxShadow =3D function (hShadow, vShadow, blur, spread, color, inset)=
 {
			this.hShadow =3D hShadow;
			this.vShadow =3D vShadow;
			this.blur =3D blur;
			this.spread =3D spread;
			this.color =3D color;
			this.inset =3D !!inset;
		};

		BoxShadow.prototype.toString =3D function () {
			var vals =3D [
				Math.round(this.hShadow) + 'px',
				Math.round(this.vShadow) + 'px',
				Math.round(this.blur) + 'px',
				Math.round(this.spread) + 'px',
				this.color
			];
			if (this.inset) {
				vals.push('inset');
			}
			return vals.join(' ');
		};

		return BoxShadow;
	})(),


	flags : {
		leaveValue : 1 &lt;&lt; 0,
		leaveAlpha : 1 &lt;&lt; 1,
		leavePreview : 1 &lt;&lt; 2,
	},


	enumOpts : {
		format: ['auto', 'any', 'hex', 'rgb', 'rgba'],
		previewPosition: ['left', 'right'],
		mode: ['hsv', 'hvs', 'hs', 'hv'],
		position: ['left', 'right', 'top', 'bottom'],
		alphaChannel: ['auto', true, false],
		paletteSetsAlpha: ['auto', true, false],
	},


	deprecatedOpts : {
		// &lt;old_option&gt;: &lt;new_option&gt;  (&lt;new_option&gt; can be nul=
l)
		'styleElement': 'previewElement',
		'onFineChange': 'onInput',
		'overwriteImportant': 'forceStyle',
		'closable': 'closeButton',
		'insetWidth': 'controlBorderWidth',
		'insetColor': 'controlBorderColor',
		'refine': null,
	},


	docsRef : ' ' + 'See https://jscolor.com/docs/',


	//
	// Usage:
	// var myPicker =3D new JSColor(&lt;targetElement&gt; [, &lt;options&gt;])
	//
	// (constructor is accessible via both 'jscolor' and 'JSColor' name)
	//

	pub : function (targetElement, opts) {

		var THIS =3D this;

		if (!opts) {
			opts =3D {};
		}

		this.channels =3D {
			r: 255, // red [0-255]
			g: 255, // green [0-255]
			b: 255, // blue [0-255]
			h: 0, // hue [0-360]
			s: 0, // saturation [0-100]
			v: 100, // value (brightness) [0-100]
			a: 1.0, // alpha (opacity) [0.0 - 1.0]
		};

		// General options
		//
		this.format =3D 'auto'; // 'auto' | 'any' | 'hex' | 'rgb' | 'rgba' - Form=
at of the input/output value
		this.value =3D undefined; // INITIAL color value in any supported format.=
 To change it later, use method fromString(), fromHSVA(), fromRGBA() or cha=
nnel()
		this.alpha =3D undefined; // INITIAL alpha value. To change it later, cal=
l method channel('A', &lt;value&gt;)
		this.onChange =3D undefined; // called when color changes. Value can be e=
ither a function or a string with JS code.
		this.onInput =3D undefined; // called repeatedly as the color is being ch=
anged, e.g. while dragging a slider. Value can be either a function or a st=
ring with JS code.
		this.valueElement =3D undefined; // element that will be used to display =
and input the color value
		this.alphaElement =3D undefined; // element that will be used to display =
and input the alpha (opacity) value
		this.previewElement =3D undefined; // element that will preview the picke=
d color using CSS background
		this.previewPosition =3D 'left'; // 'left' | 'right' - position of the co=
lor preview in previewElement
		this.previewSize =3D 32; // (px) width of the color preview displayed in =
previewElement
		this.previewPadding =3D 8; // (px) space between color preview and conten=
t of the previewElement
		this.required =3D true; // whether the associated text input must always =
contain a color value. If false, the input can be left empty.
		this.hash =3D true; // whether to prefix the HEX color code with # symbol=
 (only applicable for HEX format)
		this.uppercase =3D true; // whether to show the HEX color code in upper c=
ase (only applicable for HEX format)
		this.forceStyle =3D true; // whether to overwrite CSS style of the previe=
wElement using !important flag

		// Color Picker options
		//
		this.width =3D 181; // width of the color spectrum (in px)
		this.height =3D 101; // height of the color spectrum (in px)
		this.mode =3D 'HSV'; // 'HSV' | 'HVS' | 'HS' | 'HV' - layout of the color=
 picker controls
		this.alphaChannel =3D 'auto'; // 'auto' | true | false - if alpha channel=
 is enabled, the alpha slider will be visible. If 'auto', it will be determ=
ined according to color format
		this.position =3D 'bottom'; // 'left' | 'right' | 'top' | 'bottom' - posi=
tion relative to the target element
		this.smartPosition =3D true; // automatically change picker position when=
 there is not enough space for it
		this.showOnClick =3D true; // whether to show the picker when user clicks=
 its target element
		this.hideOnLeave =3D true; // whether to automatically hide the picker wh=
en user leaves its target element (e.g. upon clicking the document)
		this.palette =3D []; // colors to be displayed in the palette, specified =
as an array or a string of space separated color values (in any supported f=
ormat)
		this.paletteCols =3D 10; // number of columns in the palette
		this.paletteSetsAlpha =3D 'auto'; // 'auto' | true | false - if true, pal=
ette colors that don't specify alpha will set alpha to 1.0
		this.paletteHeight =3D 16; // maximum height (px) of a row in the palette
		this.paletteSpacing =3D 4; // distance (px) between color samples in the =
palette
		this.hideOnPaletteClick =3D false; // when set to true, clicking the pale=
tte will also hide the color picker
		this.sliderSize =3D 16; // px
		this.crossSize =3D 8; // px
		this.closeButton =3D false; // whether to display the Close button
		this.closeText =3D 'Close';
		this.buttonColor =3D 'rgba(0,0,0,1)'; // CSS color
		this.buttonHeight =3D 18; // px
		this.padding =3D 12; // px
		this.backgroundColor =3D 'rgba(255,255,255,1)'; // CSS color
		this.borderWidth =3D 1; // px
		this.borderColor =3D 'rgba(187,187,187,1)'; // CSS color
		this.borderRadius =3D 8; // px
		this.controlBorderWidth =3D 1; // px
		this.controlBorderColor =3D 'rgba(187,187,187,1)'; // CSS color
		this.shadow =3D true; // whether to display a shadow
		this.shadowBlur =3D 15; // px
		this.shadowColor =3D 'rgba(0,0,0,0.2)'; // CSS color
		this.pointerColor =3D 'rgba(76,76,76,1)'; // CSS color
		this.pointerBorderWidth =3D 1; // px
		this.pointerBorderColor =3D 'rgba(255,255,255,1)'; // CSS color
		this.pointerThickness =3D 2; // px
		this.zIndex =3D 5000;
		this.container =3D undefined; // where to append the color picker (BODY e=
lement by default)

		// Experimental
		//
		this.minS =3D 0; // min allowed saturation (0 - 100)
		this.maxS =3D 100; // max allowed saturation (0 - 100)
		this.minV =3D 0; // min allowed value (brightness) (0 - 100)
		this.maxV =3D 100; // max allowed value (brightness) (0 - 100)
		this.minA =3D 0.0; // min allowed alpha (opacity) (0.0 - 1.0)
		this.maxA =3D 1.0; // max allowed alpha (opacity) (0.0 - 1.0)


		// Getter: option(name)
		// Setter: option(name, value)
		//         option({name:value, ...})
		//
		this.option =3D function () {
			if (!arguments.length) {
				throw new Error('No option specified');
			}

			if (arguments.length =3D=3D=3D 1 &amp;&amp; typeof arguments[0] =3D=3D=
=3D 'string') {
				// getting a single option
				try {
					return getOption(arguments[0]);
				} catch (e) {
					console.warn(e);
				}
				return false;

			} else if (arguments.length &gt;=3D 2 &amp;&amp; typeof arguments[0] =3D=
=3D=3D 'string') {
				// setting a single option
				try {
					if (!setOption(arguments[0], arguments[1])) {
						return false;
					}
				} catch (e) {
					console.warn(e);
					return false;
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related o=
ption was changed
				return true;

			} else if (arguments.length =3D=3D=3D 1 &amp;&amp; typeof arguments[0] =
=3D=3D=3D 'object') {
				// setting multiple options
				var opts =3D arguments[0];
				var success =3D true;
				for (var opt in opts) {
					if (opts.hasOwnProperty(opt)) {
						try {
							if (!setOption(opt, opts[opt])) {
								success =3D false;
							}
						} catch (e) {
							console.warn(e);
							success =3D false;
						}
					}
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related o=
ption was changed
				return success;
			}

			throw new Error('Invalid arguments');
		}


		// Getter: channel(name)
		// Setter: channel(name, value)
		//
		this.channel =3D function (name, value) {
			if (typeof name !=3D=3D 'string') {
				throw new Error('Invalid value for channel name: ' + name);
			}

			if (value =3D=3D=3D undefined) {
				// getting channel value
				if (!this.channels.hasOwnProperty(name.toLowerCase())) {
					console.warn('Getting unknown channel: ' + name);
					return false;
				}
				return this.channels[name.toLowerCase()];

			} else {
				// setting channel value
				var res =3D false;
				switch (name.toLowerCase()) {
					case 'r': res =3D this.fromRGBA(value, null, null, null); break;
					case 'g': res =3D this.fromRGBA(null, value, null, null); break;
					case 'b': res =3D this.fromRGBA(null, null, value, null); break;
					case 'h': res =3D this.fromHSVA(value, null, null, null); break;
					case 's': res =3D this.fromHSVA(null, value, null, null); break;
					case 'v': res =3D this.fromHSVA(null, null, value, null); break;
					case 'a': res =3D this.fromHSVA(null, null, null, value); break;
					default:
						console.warn('Setting unknown channel: ' + name);
						return false;
				}
				if (res) {
					this.redraw(); // immediately redraws the picker, if it's displayed
					return true;
				}
			}

			return false;
		}


		// Triggers given input event(s) by:
		// - executing on&lt;Event&gt; callback specified as picker's option
		// - triggering standard DOM event listeners attached to the value elemen=
t
		//
		// It is possible to specify multiple events separated with a space.
		//
		this.trigger =3D function (eventNames) {
			var evs =3D jsc.strList(eventNames);
			for (var i =3D 0; i &lt; evs.length; i +=3D 1) {
				var ev =3D evs[i].toLowerCase();

				// trigger a callback
				var callbackProp =3D null;
				switch (ev) {
					case 'input': callbackProp =3D 'onInput'; break;
					case 'change': callbackProp =3D 'onChange'; break;
				}
				if (callbackProp) {
					jsc.triggerCallback(this, callbackProp);
				}

				// trigger standard DOM event listeners on the value element
				jsc.triggerInputEvent(this.valueElement, ev, true, true);
			}
		};


		// h: 0-360
		// s: 0-100
		// v: 0-100
		// a: 0.0-1.0
		//
		this.fromHSVA =3D function (h, s, v, a, flags) { // null =3D don't change
			if (h =3D=3D=3D undefined) { h =3D null; }
			if (s =3D=3D=3D undefined) { s =3D null; }
			if (v =3D=3D=3D undefined) { v =3D null; }
			if (a =3D=3D=3D undefined) { a =3D null; }

			if (h !=3D=3D null) {
				if (isNaN(h)) { return false; }
				this.channels.h =3D Math.max(0, Math.min(360, h));
			}
			if (s !=3D=3D null) {
				if (isNaN(s)) { return false; }
				this.channels.s =3D Math.max(0, Math.min(100, this.maxS, s), this.minS)=
;
			}
			if (v !=3D=3D null) {
				if (isNaN(v)) { return false; }
				this.channels.v =3D Math.max(0, Math.min(100, this.maxV, v), this.minV)=
;
			}
			if (a !=3D=3D null) {
				if (isNaN(a)) { return false; }
				this.channels.a =3D this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaqu=
e
			}

			var rgb =3D jsc.HSV_RGB(
				this.channels.h,
				this.channels.s,
				this.channels.v
			);
			this.channels.r =3D rgb[0];
			this.channels.g =3D rgb[1];
			this.channels.b =3D rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// r: 0-255
		// g: 0-255
		// b: 0-255
		// a: 0.0-1.0
		//
		this.fromRGBA =3D function (r, g, b, a, flags) { // null =3D don't change
			if (r =3D=3D=3D undefined) { r =3D null; }
			if (g =3D=3D=3D undefined) { g =3D null; }
			if (b =3D=3D=3D undefined) { b =3D null; }
			if (a =3D=3D=3D undefined) { a =3D null; }

			if (r !=3D=3D null) {
				if (isNaN(r)) { return false; }
				r =3D Math.max(0, Math.min(255, r));
			}
			if (g !=3D=3D null) {
				if (isNaN(g)) { return false; }
				g =3D Math.max(0, Math.min(255, g));
			}
			if (b !=3D=3D null) {
				if (isNaN(b)) { return false; }
				b =3D Math.max(0, Math.min(255, b));
			}
			if (a !=3D=3D null) {
				if (isNaN(a)) { return false; }
				this.channels.a =3D this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaqu=
e
			}

			var hsv =3D jsc.RGB_HSV(
				r=3D=3D=3Dnull ? this.channels.r : r,
				g=3D=3D=3Dnull ? this.channels.g : g,
				b=3D=3D=3Dnull ? this.channels.b : b
			);
			if (hsv[0] !=3D=3D null) {
				this.channels.h =3D Math.max(0, Math.min(360, hsv[0]));
			}
			if (hsv[2] !=3D=3D 0) { // fully black color stays black through entire =
saturation range, so let's not change saturation
				this.channels.s =3D Math.max(0, this.minS, Math.min(100, this.maxS, hsv=
[1]));
			}
			this.channels.v =3D Math.max(0, this.minV, Math.min(100, this.maxV, hsv[=
2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb =3D jsc.HSV_RGB(this.channels.h, this.channels.s, this.channels.=
v);
			this.channels.r =3D rgb[0];
			this.channels.g =3D rgb[1];
			this.channels.b =3D rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// DEPRECATED. Use .fromHSVA() instead
		//
		this.fromHSV =3D function (h, s, v, flags) {
			console.warn('fromHSV() method is DEPRECATED. Using fromHSVA() instead.'=
 + jsc.docsRef);
			return this.fromHSVA(h, s, v, null, flags);
		};


		// DEPRECATED. Use .fromRGBA() instead
		//
		this.fromRGB =3D function (r, g, b, flags) {
			console.warn('fromRGB() method is DEPRECATED. Using fromRGBA() instead.'=
 + jsc.docsRef);
			return this.fromRGBA(r, g, b, null, flags);
		};


		this.fromString =3D function (str, flags) {
			if (!this.required &amp;&amp; str.trim() =3D=3D=3D '') {
				// setting empty string to an optional color input
				this.setPreviewElementBg(null);
				this.setValueElementValue('');
				return true;
			}

			var color =3D jsc.parseColorString(str);
			if (!color) {
				return false; // could not parse
			}
			if (this.format.toLowerCase() =3D=3D=3D 'any') {
				this._setFormat(color.format); // adapt format
				if (this.getFormat() !=3D=3D 'rgba') {
					color.rgba[3] =3D 1.0; // when switching to a format that doesn't supp=
ort alpha, set full opacity
				}
			}
			this.fromRGBA(
				color.rgba[0],
				color.rgba[1],
				color.rgba[2],
				color.rgba[3],
				flags
			);
			return true;
		};


		this.toString =3D function (format) {
			if (format =3D=3D=3D undefined) {
				format =3D this.getFormat(); // format not specified -&gt; use the curr=
ent format
			}
			switch (format.toLowerCase()) {
				case 'hex': return this.toHEXString(); break;
				case 'rgb': return this.toRGBString(); break;
				case 'rgba': return this.toRGBAString(); break;
			}
			return false;
		};


		this.toHEXString =3D function () {
			return jsc.hexColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toRGBString =3D function () {
			return jsc.rgbColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toRGBAString =3D function () {
			return jsc.rgbaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toGrayscale =3D function () {
			return (
				0.213 * this.channels.r +
				0.715 * this.channels.g +
				0.072 * this.channels.b
			);
		};


		this.toCanvas =3D function () {
			return jsc.genColorPreviewCanvas(this.toRGBAString()).canvas;
		};


		this.toDataURL =3D function () {
			return this.toCanvas().toDataURL();
		};


		this.toBackground =3D function () {
			return jsc.pub.background(this.toRGBAString());
		};


		this.isLight =3D function () {
			return this.toGrayscale() &gt; 255 / 2;
		};


		this.hide =3D function () {
			if (isPickerOwner()) {
				detachPicker();
			}
		};


		this.show =3D function () {
			drawPicker();
		};


		this.redraw =3D function () {
			if (isPickerOwner()) {
				drawPicker();
			}
		};


		this.getFormat =3D function () {
			return this._currentFormat;
		};


		this._setFormat =3D function (format) {
			this._currentFormat =3D format.toLowerCase();
		};


		this.hasAlphaChannel =3D function () {
			if (this.alphaChannel =3D=3D=3D 'auto') {
				return (
					this.format.toLowerCase() =3D=3D=3D 'any' || // format can change on t=
he fly (e.g. from hex to rgba), so let's consider the alpha channel enabled
					this.getFormat() =3D=3D=3D 'rgba' || // the current format supports al=
pha channel
					this.alpha !=3D=3D undefined || // initial alpha value is set, so we'r=
e working with alpha channel
					this.alphaElement !=3D=3D undefined // the alpha value is redirected, =
so we're working with alpha channel
				);
			}

			return this.alphaChannel; // the alpha channel is explicitly set
		};


		this.processValueInput =3D function (str) {
			if (!this.fromString(str)) {
				// could not parse the color value - let's just expose the current colo=
r
				this.exposeColor();
			}
		};


		this.processAlphaInput =3D function (str) {
			if (!this.fromHSVA(null, null, null, parseFloat(str))) {
				// could not parse the alpha value - let's just expose the current colo=
r
				this.exposeColor();
			}
		};


		this.exposeColor =3D function (flags) {
			var colorStr =3D this.toString();

			// reflect current color in data- attribute
			jsc.setDataAttr(this.targetElement, 'current-color', colorStr);

			if (!(flags &amp; jsc.flags.leaveValue) &amp;&amp; this.valueElement) {
				if (this.getFormat() =3D=3D=3D 'hex') {
					if (!this.uppercase) { colorStr =3D colorStr.toLowerCase(); }
					if (!this.hash) { colorStr =3D colorStr.replace(/^#/, ''); }
				}
				this.setValueElementValue(colorStr);
			}

			if (!(flags &amp; jsc.flags.leaveAlpha) &amp;&amp; this.alphaElement) {
				var alphaVal =3D Math.round(this.channels.a * 100) / 100;
				this.setAlphaElementValue(alphaVal);
			}

			if (!(flags &amp; jsc.flags.leavePreview) &amp;&amp; this.previewElement=
) {
				var previewPos =3D null; // 'left' | 'right' (null -&gt; fill the entir=
e element)

				if (
					jsc.isTextInput(this.previewElement) || // text input
					(jsc.isButton(this.previewElement) &amp;&amp; !jsc.isButtonEmpty(this.=
previewElement)) // button with text
				) {
					previewPos =3D this.previewPosition;
				}

				this.setPreviewElementBg(this.toRGBAString());
			}

			if (isPickerOwner()) {
				redrawPad();
				redrawSld();
				redrawASld();
			}
		};


		this.setPreviewElementBg =3D function (color) {
			if (!this.previewElement) {
				return;
			}

			var position =3D null; // color preview position:  null | 'left' | 'righ=
t'
			var width =3D null; // color preview width:  px | null =3D fill the enti=
re element
			if (
				jsc.isTextInput(this.previewElement) || // text input
				(jsc.isButton(this.previewElement) &amp;&amp; !jsc.isButtonEmpty(this.p=
reviewElement)) // button with text
			) {
				position =3D this.previewPosition;
				width =3D this.previewSize;
			}

			var backgrounds =3D [];

			if (!color) {
				// there is no color preview to display -&gt; let's remove any previous=
 background image
				backgrounds.push({
					image: 'none',
					position: 'left top',
					size: 'auto',
					repeat: 'no-repeat',
					origin: 'padding-box',
				});
			} else {
				// CSS gradient for background color preview
				backgrounds.push({
					image: jsc.genColorPreviewGradient(
						color,
						position,
						width ? width - jsc.pub.previewSeparator.length : null
					),
					position: 'left top',
					size: 'auto',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});

				// data URL of generated PNG image with a gray transparency chessboard
				var preview =3D jsc.genColorPreviewCanvas(
					'rgba(0,0,0,0)',
					position ? {'left':'right', 'right':'left'}[position] : null,
					width,
					true
				);
				backgrounds.push({
					image: 'url(\'' + preview.canvas.toDataURL() + '\')',
					position: (position || 'left') + ' top',
					size: preview.width + 'px ' + preview.height + 'px',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});
			}

			var bg =3D {
				image: [],
				position: [],
				size: [],
				repeat: [],
				origin: [],
			};
			for (var i =3D 0; i &lt; backgrounds.length; i +=3D 1) {
				bg.image.push(backgrounds[i].image);
				bg.position.push(backgrounds[i].position);
				bg.size.push(backgrounds[i].size);
				bg.repeat.push(backgrounds[i].repeat);
				bg.origin.push(backgrounds[i].origin);
			}

			// set previewElement's background-images
			var sty =3D {
				'background-image': bg.image.join(', '),
				'background-position': bg.position.join(', '),
				'background-size': bg.size.join(', '),
				'background-repeat': bg.repeat.join(', '),
				'background-origin': bg.origin.join(', '),
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle);


			// set/restore previewElement's padding
			var padding =3D {
				left: null,
				right: null,
			};
			if (position) {
				padding[position] =3D (this.previewSize + this.previewPadding) + 'px';
			}

			var sty =3D {
				'padding-left': padding.left,
				'padding-right': padding.right,
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle, true);
		};


		this.setValueElementValue =3D function (str) {
			if (this.valueElement) {
				if (jsc.nodeName(this.valueElement) =3D=3D=3D 'input') {
					this.valueElement.value =3D str;
				} else {
					this.valueElement.innerHTML =3D str;
				}
			}
		};


		this.setAlphaElementValue =3D function (str) {
			if (this.alphaElement) {
				if (jsc.nodeName(this.alphaElement) =3D=3D=3D 'input') {
					this.alphaElement.value =3D str;
				} else {
					this.alphaElement.innerHTML =3D str;
				}
			}
		};


		this._processParentElementsInDOM =3D function () {
			if (this._parentElementsProcessed) { return; }
			this._parentElementsProcessed =3D true;

			var elm =3D this.targetElement;
			do {
				// If the target element or one of its parent nodes has fixed position,
				// then use fixed positioning instead
				var compStyle =3D jsc.getCompStyle(elm);
				if (compStyle.position &amp;&amp; compStyle.position.toLowerCase() =3D=
=3D=3D 'fixed') {
					this.fixed =3D true;
				}

				if (elm !=3D=3D this.targetElement) {
					// Ensure to attach onParentScroll only once to each parent element
					// (multiple targetElements can share the same parent nodes)
					//
					// Note: It's not just offsetParents that can be scrollable,
					// that's why we loop through all parent nodes
					if (!jsc.getData(elm, 'hasScrollListener')) {
						elm.addEventListener('scroll', jsc.onParentScroll, false);
						jsc.setData(elm, 'hasScrollListener', true);
					}
				}
			} while ((elm =3D elm.parentNode) &amp;&amp; jsc.nodeName(elm) !=3D=3D '=
body');
		};


		this.tryHide =3D function () {
			if (this.hideOnLeave) {
				this.hide();
			}
		};


		this.set__palette =3D function (val) {
			this.palette =3D val;
			this._palette =3D jsc.parsePaletteValue(val);
			this._paletteHasTransparency =3D jsc.containsTranparentColor(this._palet=
te);
		};


		function setOption (option, value) {
			if (typeof option !=3D=3D 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// enum option
			if (jsc.enumOpts.hasOwnProperty(option)) {
				if (typeof value =3D=3D=3D 'string') { // enum string values are case i=
nsensitive
					value =3D value.toLowerCase();
				}
				if (jsc.enumOpts[option].indexOf(value) =3D=3D=3D -1) {
					throw new Error('Option \'' + option + '\' has invalid value: ' + valu=
e);
				}
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt =3D option;
				var newOpt =3D jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use =
the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + js=
c.docsRef, oldOpt, newOpt);
					option =3D newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var setter =3D 'set__' + option;

			if (typeof THIS[setter] =3D=3D=3D 'function') { // a setter exists for t=
his option
				THIS[setter](value);
				return true;

			} else if (option in THIS) { // option exists as a property
				THIS[option] =3D value;
				return true;
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function getOption (option) {
			if (typeof option !=3D=3D 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt =3D option;
				var newOpt =3D jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use =
the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + js=
c.docsRef, oldOpt, newOpt);
					option =3D newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var getter =3D 'get__' + option;

			if (typeof THIS[getter] =3D=3D=3D 'function') { // a getter exists for t=
his option
				return THIS[getter](value);

			} else if (option in THIS) { // option exists as a property
				return THIS[option];
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function detachPicker () {
			jsc.removeClass(THIS.targetElement, jsc.pub.activeClassName);
			jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
			delete jsc.picker.owner;
		}


		function drawPicker () {

			// At this point, when drawing the picker, we know what the parent eleme=
nts are
			// and we can do all related DOM operations, such as registering events =
on them
			// or checking their positioning
			THIS._processParentElementsInDOM();

			if (!jsc.picker) {
				jsc.picker =3D {
					owner: null, // owner picker instance
					wrap : jsc.createEl('div'),
					box : jsc.createEl('div'),
					boxS : jsc.createEl('div'), // shadow area
					boxB : jsc.createEl('div'), // border
					pad : jsc.createEl('div'),
					padB : jsc.createEl('div'), // border
					padM : jsc.createEl('div'), // mouse/touch area
					padCanvas : jsc.createPadCanvas(),
					cross : jsc.createEl('div'),
					crossBY : jsc.createEl('div'), // border Y
					crossBX : jsc.createEl('div'), // border X
					crossLY : jsc.createEl('div'), // line Y
					crossLX : jsc.createEl('div'), // line X
					sld : jsc.createEl('div'), // slider
					sldB : jsc.createEl('div'), // border
					sldM : jsc.createEl('div'), // mouse/touch area
					sldGrad : jsc.createSliderGradient(),
					sldPtrS : jsc.createEl('div'), // slider pointer spacer
					sldPtrIB : jsc.createEl('div'), // slider pointer inner border
					sldPtrMB : jsc.createEl('div'), // slider pointer middle border
					sldPtrOB : jsc.createEl('div'), // slider pointer outer border
					asld : jsc.createEl('div'), // alpha slider
					asldB : jsc.createEl('div'), // border
					asldM : jsc.createEl('div'), // mouse/touch area
					asldGrad : jsc.createASliderGradient(),
					asldPtrS : jsc.createEl('div'), // slider pointer spacer
					asldPtrIB : jsc.createEl('div'), // slider pointer inner border
					asldPtrMB : jsc.createEl('div'), // slider pointer middle border
					asldPtrOB : jsc.createEl('div'), // slider pointer outer border
					pal : jsc.createEl('div'), // palette
					btn : jsc.createEl('div'),
					btnT : jsc.createEl('span'), // text
				};

				jsc.picker.pad.appendChild(jsc.picker.padCanvas.elm);
				jsc.picker.padB.appendChild(jsc.picker.pad);
				jsc.picker.cross.appendChild(jsc.picker.crossBY);
				jsc.picker.cross.appendChild(jsc.picker.crossBX);
				jsc.picker.cross.appendChild(jsc.picker.crossLY);
				jsc.picker.cross.appendChild(jsc.picker.crossLX);
				jsc.picker.padB.appendChild(jsc.picker.cross);
				jsc.picker.box.appendChild(jsc.picker.padB);
				jsc.picker.box.appendChild(jsc.picker.padM);

				jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
				jsc.picker.sldB.appendChild(jsc.picker.sld);
				jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
				jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
				jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
				jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
				jsc.picker.box.appendChild(jsc.picker.sldB);
				jsc.picker.box.appendChild(jsc.picker.sldM);

				jsc.picker.asld.appendChild(jsc.picker.asldGrad.elm);
				jsc.picker.asldB.appendChild(jsc.picker.asld);
				jsc.picker.asldB.appendChild(jsc.picker.asldPtrOB);
				jsc.picker.asldPtrOB.appendChild(jsc.picker.asldPtrMB);
				jsc.picker.asldPtrMB.appendChild(jsc.picker.asldPtrIB);
				jsc.picker.asldPtrIB.appendChild(jsc.picker.asldPtrS);
				jsc.picker.box.appendChild(jsc.picker.asldB);
				jsc.picker.box.appendChild(jsc.picker.asldM);

				jsc.picker.box.appendChild(jsc.picker.pal);

				jsc.picker.btn.appendChild(jsc.picker.btnT);
				jsc.picker.box.appendChild(jsc.picker.btn);

				jsc.picker.boxB.appendChild(jsc.picker.box);
				jsc.picker.wrap.appendChild(jsc.picker.boxS);
				jsc.picker.wrap.appendChild(jsc.picker.boxB);

				jsc.picker.wrap.addEventListener('touchstart', jsc.onPickerTouchStart,
					jsc.isPassiveEventSupported ? {passive: false} : false);
			}

			var p =3D jsc.picker;

			var displaySlider =3D !!jsc.getSliderChannel(THIS);
			var displayAlphaSlider =3D THIS.hasAlphaChannel();
			var pickerDims =3D jsc.getPickerDims(THIS);
			var crossOuterSize =3D (2 * THIS.pointerBorderWidth + THIS.pointerThickn=
ess + 2 * THIS.crossSize);
			var controlPadding =3D jsc.getControlPadding(THIS);
			var borderRadius =3D Math.min(
				THIS.borderRadius,
				Math.round(THIS.padding * Math.PI)); // px
			var padCursor =3D 'crosshair';

			// wrap
			p.wrap.className =3D 'jscolor-picker-wrap';
			p.wrap.style.clear =3D 'both';
			p.wrap.style.width =3D pickerDims.borderW + 'px';
			p.wrap.style.height =3D pickerDims.borderH + 'px';
			p.wrap.style.zIndex =3D THIS.zIndex;

			// picker
			p.box.className =3D 'jscolor-picker';
			p.box.style.width =3D pickerDims.paddedW + 'px';
			p.box.style.height =3D pickerDims.paddedH + 'px';
			p.box.style.position =3D 'relative';

			// picker shadow
			p.boxS.className =3D 'jscolor-picker-shadow';
			p.boxS.style.position =3D 'absolute';
			p.boxS.style.left =3D '0';
			p.boxS.style.top =3D '0';
			p.boxS.style.width =3D '100%';
			p.boxS.style.height =3D '100%';
			jsc.setBorderRadius(p.boxS, borderRadius + 'px');

			// picker border
			p.boxB.className =3D 'jscolor-picker-border';
			p.boxB.style.position =3D 'relative';
			p.boxB.style.border =3D THIS.borderWidth + 'px solid';
			p.boxB.style.borderColor =3D THIS.borderColor;
			p.boxB.style.background =3D THIS.backgroundColor;
			jsc.setBorderRadius(p.boxB, borderRadius + 'px');

			// IE hack:
			// If the element is transparent, IE will trigger the event on the eleme=
nts under it,
			// e.g. on Canvas or on elements with border
			p.padM.style.background =3D 'rgba(255,0,0,.2)';
			p.sldM.style.background =3D 'rgba(0,255,0,.2)';
			p.asldM.style.background =3D 'rgba(0,0,255,.2)';

			p.padM.style.opacity =3D
			p.sldM.style.opacity =3D
			p.asldM.style.opacity =3D
				'0';

			// pad
			p.pad.style.position =3D 'relative';
			p.pad.style.width =3D THIS.width + 'px';
			p.pad.style.height =3D THIS.height + 'px';

			// pad - color spectrum (HSV and HVS)
			p.padCanvas.draw(THIS.width, THIS.height, jsc.getPadYChannel(THIS));

			// pad border
			p.padB.style.position =3D 'absolute';
			p.padB.style.left =3D THIS.padding + 'px';
			p.padB.style.top =3D THIS.padding + 'px';
			p.padB.style.border =3D THIS.controlBorderWidth + 'px solid';
			p.padB.style.borderColor =3D THIS.controlBorderColor;

			// pad mouse area
			p.padM.style.position =3D 'absolute';
			p.padM.style.left =3D 0 + 'px';
			p.padM.style.top =3D 0 + 'px';
			p.padM.style.width =3D (THIS.padding + 2 * THIS.controlBorderWidth + THI=
S.width + controlPadding) + 'px';
			p.padM.style.height =3D (2 * THIS.controlBorderWidth + 2 * THIS.padding =
+ THIS.height) + 'px';
			p.padM.style.cursor =3D padCursor;
			jsc.setData(p.padM, {
				instance: THIS,
				control: 'pad',
			})

			// pad cross
			p.cross.style.position =3D 'absolute';
			p.cross.style.left =3D
			p.cross.style.top =3D
				'0';
			p.cross.style.width =3D
			p.cross.style.height =3D
				crossOuterSize + 'px';

			// pad cross border Y and X
			p.crossBY.style.position =3D
			p.crossBX.style.position =3D
				'absolute';
			p.crossBY.style.background =3D
			p.crossBX.style.background =3D
				THIS.pointerBorderColor;
			p.crossBY.style.width =3D
			p.crossBX.style.height =3D
				(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.crossBY.style.height =3D
			p.crossBX.style.width =3D
				crossOuterSize + 'px';
			p.crossBY.style.left =3D
			p.crossBX.style.top =3D
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)=
 - THIS.pointerBorderWidth) + 'px';
			p.crossBY.style.top =3D
			p.crossBX.style.left =3D
				'0';

			// pad cross line Y and X
			p.crossLY.style.position =3D
			p.crossLX.style.position =3D
				'absolute';
			p.crossLY.style.background =3D
			p.crossLX.style.background =3D
				THIS.pointerColor;
			p.crossLY.style.height =3D
			p.crossLX.style.width =3D
				(crossOuterSize - 2 * THIS.pointerBorderWidth) + 'px';
			p.crossLY.style.width =3D
			p.crossLX.style.height =3D
				THIS.pointerThickness + 'px';
			p.crossLY.style.left =3D
			p.crossLX.style.top =3D
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)=
) + 'px';
			p.crossLY.style.top =3D
			p.crossLX.style.left =3D
				THIS.pointerBorderWidth + 'px';


			// slider
			p.sld.style.overflow =3D 'hidden';
			p.sld.style.width =3D THIS.sliderSize + 'px';
			p.sld.style.height =3D THIS.height + 'px';

			// slider gradient
			p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

			// slider border
			p.sldB.style.display =3D displaySlider ? 'block' : 'none';
			p.sldB.style.position =3D 'absolute';
			p.sldB.style.left =3D (THIS.padding + THIS.width + 2 * THIS.controlBorde=
rWidth + 2 * controlPadding) + 'px';
			p.sldB.style.top =3D THIS.padding + 'px';
			p.sldB.style.border =3D THIS.controlBorderWidth + 'px solid';
			p.sldB.style.borderColor =3D THIS.controlBorderColor;

			// slider mouse area
			p.sldM.style.display =3D displaySlider ? 'block' : 'none';
			p.sldM.style.position =3D 'absolute';
			p.sldM.style.left =3D (THIS.padding + THIS.width + 2 * THIS.controlBorde=
rWidth + controlPadding) + 'px';
			p.sldM.style.top =3D 0 + 'px';
			p.sldM.style.width =3D (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					(displayAlphaSlider ? 0 : Math.max(0, THIS.padding - controlPadding)) =
// remaining padding to the right edge
				) + 'px';
			p.sldM.style.height =3D (2 * THIS.controlBorderWidth + 2 * THIS.padding =
+ THIS.height) + 'px';
			p.sldM.style.cursor =3D 'default';
			jsc.setData(p.sldM, {
				instance: THIS,
				control: 'sld',
			});

			// slider pointer inner and outer border
			p.sldPtrIB.style.border =3D
			p.sldPtrOB.style.border =3D
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// slider pointer outer border
			p.sldPtrOB.style.position =3D 'absolute';
			p.sldPtrOB.style.left =3D -(2 * THIS.pointerBorderWidth + THIS.pointerTh=
ickness) + 'px';
			p.sldPtrOB.style.top =3D '0';

			// slider pointer middle border
			p.sldPtrMB.style.border =3D THIS.pointerThickness + 'px solid ' + THIS.p=
ointerColor;

			// slider pointer spacer
			p.sldPtrS.style.width =3D THIS.sliderSize + 'px';
			p.sldPtrS.style.height =3D jsc.pub.sliderInnerSpace + 'px';


			// alpha slider
			p.asld.style.overflow =3D 'hidden';
			p.asld.style.width =3D THIS.sliderSize + 'px';
			p.asld.style.height =3D THIS.height + 'px';

			// alpha slider gradient
			p.asldGrad.draw(THIS.sliderSize, THIS.height, '#000');

			// alpha slider border
			p.asldB.style.display =3D displayAlphaSlider ? 'block' : 'none';
			p.asldB.style.position =3D 'absolute';
			p.asldB.style.left =3D (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadd=
ing) +
					(displaySlider ? (THIS.sliderSize + 3 * controlPadding + 2 * THIS.cont=
rolBorderWidth) : 0)
				) + 'px';
			p.asldB.style.top =3D THIS.padding + 'px';
			p.asldB.style.border =3D THIS.controlBorderWidth + 'px solid';
			p.asldB.style.borderColor =3D THIS.controlBorderColor;

			// alpha slider mouse area
			p.asldM.style.display =3D displayAlphaSlider ? 'block' : 'none';
			p.asldM.style.position =3D 'absolute';
			p.asldM.style.left =3D (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadd=
ing) +
					(displaySlider ? (THIS.sliderSize + 2 * controlPadding + 2 * THIS.cont=
rolBorderWidth) : 0)
				) + 'px';
			p.asldM.style.top =3D 0 + 'px';
			p.asldM.style.width =3D (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					Math.max(0, THIS.padding - controlPadding) // remaining padding to the=
 right edge
				) + 'px';
			p.asldM.style.height =3D (2 * THIS.controlBorderWidth + 2 * THIS.padding=
 + THIS.height) + 'px';
			p.asldM.style.cursor =3D 'default';
			jsc.setData(p.asldM, {
				instance: THIS,
				control: 'asld',
			})

			// alpha slider pointer inner and outer border
			p.asldPtrIB.style.border =3D
			p.asldPtrOB.style.border =3D
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// alpha slider pointer outer border
			p.asldPtrOB.style.position =3D 'absolute';
			p.asldPtrOB.style.left =3D -(2 * THIS.pointerBorderWidth + THIS.pointerT=
hickness) + 'px';
			p.asldPtrOB.style.top =3D '0';

			// alpha slider pointer middle border
			p.asldPtrMB.style.border =3D THIS.pointerThickness + 'px solid ' + THIS.=
pointerColor;

			// alpha slider pointer spacer
			p.asldPtrS.style.width =3D THIS.sliderSize + 'px';
			p.asldPtrS.style.height =3D jsc.pub.sliderInnerSpace + 'px';


			// palette
			p.pal.className =3D 'jscolor-palette';
			p.pal.style.display =3D pickerDims.palette.rows ? 'block' : 'none';
			p.pal.style.position =3D 'absolute';
			p.pal.style.left =3D THIS.padding + 'px';
			p.pal.style.top =3D (2 * THIS.controlBorderWidth + 2 * THIS.padding + TH=
IS.height) + 'px';

			// palette's color samples

			p.pal.innerHTML =3D '';

			var chessboard =3D jsc.genColorPreviewCanvas('rgba(0,0,0,0)');

			var si =3D 0; // color sample's index
			for (var r =3D 0; r &lt; pickerDims.palette.rows; r++) {
				for (var c =3D 0; c &lt; pickerDims.palette.cols &amp;&amp; si &lt; THI=
S._palette.length; c++, si++) {
					var sampleColor =3D THIS._palette[si];
					var sampleCssColor =3D jsc.rgbaColor.apply(null, sampleColor.rgba);

					var sc =3D jsc.createEl('div'); // color sample's color
					sc.style.width =3D (pickerDims.palette.cellW - 2 * THIS.controlBorderW=
idth) + 'px';
					sc.style.height =3D (pickerDims.palette.cellH - 2 * THIS.controlBorder=
Width) + 'px';
					sc.style.backgroundColor =3D sampleCssColor;

					var sw =3D jsc.createEl('div'); // color sample's wrap
					sw.className =3D 'jscolor-palette-sample';
					sw.style.display =3D 'block';
					sw.style.position =3D 'absolute';
					sw.style.left =3D (
							pickerDims.palette.cols &lt;=3D 1 ? 0 :
							Math.round(10 * (c * ((pickerDims.contentW - pickerDims.palette.cell=
W) / (pickerDims.palette.cols - 1)))) / 10
						) + 'px';
					sw.style.top =3D (r * (pickerDims.palette.cellH + THIS.paletteSpacing)=
) + 'px';
					sw.style.border =3D THIS.controlBorderWidth + 'px solid';
					sw.style.borderColor =3D THIS.controlBorderColor;
					sw.style.cursor =3D 'pointer';
					if (sampleColor.rgba[3] !=3D=3D null &amp;&amp; sampleColor.rgba[3] &l=
t; 1.0) { // only create chessboard background if the sample has transparen=
cy
						sw.style.backgroundImage =3D 'url(\'' + chessboard.canvas.toDataURL()=
 + '\')';
						sw.style.backgroundRepeat =3D 'repeat';
						sw.style.backgroundPosition =3D 'center center';
					}
					jsc.setData(sw, {
						instance: THIS,
						control: 'palette-sample',
						color: sampleColor,
					})
					sw.addEventListener('click', jsc.onPaletteSampleClick, false);
					sw.appendChild(sc);
					p.pal.appendChild(sw);
				}
			}


			// the Close button
			function setBtnBorder () {
				var insetColors =3D THIS.controlBorderColor.split(/\s+/);
				var outsetColor =3D insetColors.length &lt; 2 ? insetColors[0] : insetC=
olors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[=
1];
				p.btn.style.borderColor =3D outsetColor;
			}
			var btnPadding =3D 15; // px
			p.btn.className =3D 'jscolor-btn-close';
			p.btn.style.display =3D THIS.closeButton ? 'block' : 'none';
			p.btn.style.position =3D 'absolute';
			p.btn.style.left =3D THIS.padding + 'px';
			p.btn.style.bottom =3D THIS.padding + 'px';
			p.btn.style.padding =3D '0 ' + btnPadding + 'px';
			p.btn.style.maxWidth =3D (pickerDims.contentW - 2 * THIS.controlBorderWi=
dth - 2 * btnPadding) + 'px';
			p.btn.style.overflow =3D 'hidden';
			p.btn.style.height =3D THIS.buttonHeight + 'px';
			p.btn.style.whiteSpace =3D 'nowrap';
			p.btn.style.border =3D THIS.controlBorderWidth + 'px solid';
			setBtnBorder();
			p.btn.style.color =3D THIS.buttonColor;
			p.btn.style.font =3D '12px sans-serif';
			p.btn.style.textAlign =3D 'center';
			p.btn.style.cursor =3D 'pointer';
			p.btn.onmousedown =3D function () {
				THIS.hide();
			};
			p.btnT.style.lineHeight =3D THIS.buttonHeight + 'px';
			p.btnT.innerHTML =3D '';
			p.btnT.appendChild(window.document.createTextNode(THIS.closeText));

			// reposition the pointers
			redrawPad();
			redrawSld();
			redrawASld();

			// If we are changing the owner without first closing the picker,
			// make sure to first deal with the old owner
			if (jsc.picker.owner &amp;&amp; jsc.picker.owner !=3D=3D THIS) {
				jsc.removeClass(jsc.picker.owner.targetElement, jsc.pub.activeClassName=
);
			}

			// Set a new picker owner
			jsc.picker.owner =3D THIS;

			// The redrawPosition() method needs picker.owner to be set, that's why =
we call it here,
			// after setting the owner
			if (THIS.container =3D=3D=3D window.document.body) {
				jsc.redrawPosition();
			} else {
				jsc._drawPosition(THIS, 0, 0, 'relative', false);
			}

			if (p.wrap.parentNode !=3D=3D THIS.container) {
				THIS.container.appendChild(p.wrap);
			}

			jsc.addClass(THIS.targetElement, jsc.pub.activeClassName);
		}


		function redrawPad () {
			// redraw the pad pointer
			var yChannel =3D jsc.getPadYChannel(THIS);
			var x =3D Math.round((THIS.channels.h / 360) * (THIS.width - 1));
			var y =3D Math.round((1 - THIS.channels[yChannel] / 100) * (THIS.height =
- 1));
			var crossOuterSize =3D (2 * THIS.pointerBorderWidth + THIS.pointerThickn=
ess + 2 * THIS.crossSize);
			var ofs =3D -Math.floor(crossOuterSize / 2);
			jsc.picker.cross.style.left =3D (x + ofs) + 'px';
			jsc.picker.cross.style.top =3D (y + ofs) + 'px';

			// redraw the slider
			switch (jsc.getSliderChannel(THIS)) {
			case 's':
				var rgb1 =3D jsc.HSV_RGB(THIS.channels.h, 100, THIS.channels.v);
				var rgb2 =3D jsc.HSV_RGB(THIS.channels.h, 0, THIS.channels.v);
				var color1 =3D 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				var color2 =3D 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			case 'v':
				var rgb =3D jsc.HSV_RGB(THIS.channels.h, THIS.channels.s, 100);
				var color1 =3D 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				var color2 =3D '#000';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString(=
));
		}


		function redrawSld () {
			var sldChannel =3D jsc.getSliderChannel(THIS);
			if (sldChannel) {
				// redraw the slider pointer
				var y =3D Math.round((1 - THIS.channels[sldChannel] / 100) * (THIS.heig=
ht - 1));
				jsc.picker.sldPtrOB.style.top =3D (y - (2 * THIS.pointerBorderWidth + T=
HIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString(=
));
		}


		function redrawASld () {
			var y =3D Math.round((1 - THIS.channels.a) * (THIS.height - 1));
			jsc.picker.asldPtrOB.style.top =3D (y - (2 * THIS.pointerBorderWidth + T=
HIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
		}


		function isPickerOwner () {
			return jsc.picker &amp;&amp; jsc.picker.owner =3D=3D=3D THIS;
		}


		function onValueKeyDown (ev) {
			if (jsc.eventKey(ev) =3D=3D=3D 'Enter') {
				if (THIS.valueElement) {
					THIS.processValueInput(THIS.valueElement.value);
				}
				THIS.tryHide();
			}
		}


		function onAlphaKeyDown (ev) {
			if (jsc.eventKey(ev) =3D=3D=3D 'Enter') {
				if (THIS.alphaElement) {
					THIS.processAlphaInput(THIS.alphaElement.value);
				}
				THIS.tryHide();
			}
		}


		function onValueChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal =3D THIS.valueElement.value;

			THIS.processValueInput(THIS.valueElement.value); // this might change th=
e value

			jsc.triggerCallback(THIS, 'onChange');

			if (THIS.valueElement.value !=3D=3D oldVal) {
				// value was additionally changed -&gt; let's trigger the change event =
again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);
			}
		}


		function onAlphaChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal =3D THIS.alphaElement.value;

			THIS.processAlphaInput(THIS.alphaElement.value); // this might change th=
e value

			jsc.triggerCallback(THIS, 'onChange');

			// triggering valueElement's onChange (because changing alpha changes th=
e entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);

			if (THIS.alphaElement.value !=3D=3D oldVal) {
				// value was additionally changed -&gt; let's trigger the change event =
again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.alphaElement, 'change', true, true);
			}
		}


		function onValueInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.valueElement) {
				THIS.fromString(THIS.valueElement.value, jsc.flags.leaveValue);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput
			// (not needed, it was dispatched normally by the browser)
		}


		function onAlphaInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.alphaElement) {
				THIS.fromHSVA(null, null, null, parseFloat(THIS.alphaElement.value), js=
c.flags.leaveAlpha);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput (because changing alpha changes the=
 entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'input', true, true);
		}


		// let's process the DEPRECATED 'options' property (this will be later re=
moved)
		if (jsc.pub.options) {
			// let's set custom default options, if specified
			for (var opt in jsc.pub.options) {
				if (jsc.pub.options.hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.options[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's apply configuration presets
		//
		var presetsArr =3D [];

		if (opts.preset) {
			if (typeof opts.preset =3D=3D=3D 'string') {
				presetsArr =3D opts.preset.split(/\s+/);
			} else if (Array.isArray(opts.preset)) {
				presetsArr =3D opts.preset.slice(); // slice() to clone
			} else {
				console.warn('Unrecognized preset value');
			}
		}

		// always use the 'default' preset. If it's not listed, append it to the =
end.
		if (presetsArr.indexOf('default') =3D=3D=3D -1) {
			presetsArr.push('default');
		}

		// let's apply the presets in reverse order, so that should there be any =
overlapping options,
		// the formerly listed preset will override the latter
		for (var i =3D presetsArr.length - 1; i &gt;=3D 0; i -=3D 1) {
			var pres =3D presetsArr[i];
			if (!pres) {
				continue; // preset is empty string
			}
			if (!jsc.pub.presets.hasOwnProperty(pres)) {
				console.warn('Unknown preset: %s', pres);
				continue;
			}
			for (var opt in jsc.pub.presets[pres]) {
				if (jsc.pub.presets[pres].hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.presets[pres][opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's set specific options for this color picker
		var nonProperties =3D [
			// these options won't be set as instance properties
			'preset',
		];
		for (var opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				if (nonProperties.indexOf(opt) =3D=3D=3D -1) {
					try {
						setOption(opt, opts[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		//
		// Install the color picker on chosen element(s)
		//


		// Determine picker's container element
		if (this.container =3D=3D=3D undefined) {
			this.container =3D window.document.body; // default container is BODY el=
ement

		} else { // explicitly set to custom element
			this.container =3D jsc.node(this.container);
		}

		if (!this.container) {
			throw new Error('Cannot instantiate color picker without a container ele=
ment');
		}


		// Fetch the target element
		this.targetElement =3D jsc.node(targetElement);

		if (!this.targetElement) {
			// temporarily customized error message to help with migrating from vers=
ions prior to 2.2
			if (typeof targetElement =3D=3D=3D 'string' &amp;&amp; /^[a-zA-Z][\w:.-]=
*$/.test(targetElement)) {
				// targetElement looks like valid ID
				var possiblyId =3D targetElement;
				throw new Error('If \'' + possiblyId + '\' is supposed to be an ID, ple=
ase use \'#' + possiblyId + '\' or any valid CSS selector.');
			}

			throw new Error('Cannot instantiate color picker without a target elemen=
t');
		}

		if (this.targetElement.jscolor &amp;&amp; this.targetElement.jscolor inst=
anceof jsc.pub) {
			throw new Error('Color picker already installed on this element');
		}


		// link this instance with the target element
		this.targetElement.jscolor =3D this;
		jsc.addClass(this.targetElement, jsc.pub.className);

		// register this instance
		jsc.instances.push(this);


		// if target is BUTTON
		if (jsc.isButton(this.targetElement)) {

			if (this.targetElement.type.toLowerCase() !=3D=3D 'button') {
				// on buttons, always force type to be 'button', e.g. in situations the=
 target &lt;button&gt; has no type
				// and thus defaults to 'submit' and would submit the form when clicked
				this.targetElement.type =3D 'button';
			}

			if (jsc.isButtonEmpty(this.targetElement)) { // empty button
				// it is important to clear element's contents first.
				// if we're re-instantiating color pickers on DOM that has been modifie=
d by changing page's innerHTML,
				// we would keep adding more non-breaking spaces to element's content (=
because element's contents survive
				// innerHTML changes, but picker instances don't)
				jsc.removeChildren(this.targetElement);

				// let's insert a non-breaking space
				this.targetElement.appendChild(window.document.createTextNode('\xa0'));

				// set min-width =3D previewSize, if not already greater
				var compStyle =3D jsc.getCompStyle(this.targetElement);
				var currMinWidth =3D parseFloat(compStyle['min-width']) || 0;
				if (currMinWidth &lt; this.previewSize) {
					jsc.setStyle(this.targetElement, {
						'min-width': this.previewSize + 'px',
					}, this.forceStyle);
				}
			}
		}

		// Determine the value element
		if (this.valueElement =3D=3D=3D undefined) {
			if (jsc.isTextInput(this.targetElement)) {
				// for text inputs, default valueElement is targetElement
				this.valueElement =3D this.targetElement;
			} else {
				// leave it undefined
			}

		} else if (this.valueElement =3D=3D=3D null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.valueElement =3D jsc.node(this.valueElement);
		}

		// Determine the alpha element
		if (this.alphaElement) {
			this.alphaElement =3D jsc.node(this.alphaElement);
		}

		// Determine the preview element
		if (this.previewElement =3D=3D=3D undefined) {
			this.previewElement =3D this.targetElement; // default previewElement is=
 targetElement

		} else if (this.previewElement =3D=3D=3D null) { // explicitly set to nul=
l
			// leave it null

		} else { // explicitly set to custom element
			this.previewElement =3D jsc.node(this.previewElement);
		}

		// valueElement
		if (this.valueElement &amp;&amp; jsc.isTextInput(this.valueElement)) {

			// If the value element has onInput event already set, we need to detach=
 it and attach AFTER our listener.
			// otherwise the picker instance would still contain the old color when =
accessed from the onInput handler.
			var valueElementOrigEvents =3D {
				onInput: this.valueElement.oninput
			};
			this.valueElement.oninput =3D null;

			this.valueElement.addEventListener('keydown', onValueKeyDown, false);
			this.valueElement.addEventListener('change', onValueChange, false);
			this.valueElement.addEventListener('input', onValueInput, false);
			// the original event listener must be attached AFTER our handler (to le=
t it first set picker's color)
			if (valueElementOrigEvents.onInput) {
				this.valueElement.addEventListener('input', valueElementOrigEvents.onIn=
put, false);
			}

			this.valueElement.setAttribute('autocomplete', 'off');
			this.valueElement.setAttribute('autocorrect', 'off');
			this.valueElement.setAttribute('autocapitalize', 'off');
			this.valueElement.setAttribute('spellcheck', false);
		}

		// alphaElement
		if (this.alphaElement &amp;&amp; jsc.isTextInput(this.alphaElement)) {
			this.alphaElement.addEventListener('keydown', onAlphaKeyDown, false);
			this.alphaElement.addEventListener('change', onAlphaChange, false);
			this.alphaElement.addEventListener('input', onAlphaInput, false);

			this.alphaElement.setAttribute('autocomplete', 'off');
			this.alphaElement.setAttribute('autocorrect', 'off');
			this.alphaElement.setAttribute('autocapitalize', 'off');
			this.alphaElement.setAttribute('spellcheck', false);
		}

		// determine initial color value
		//
		var initValue =3D 'FFFFFF';

		if (this.value !=3D=3D undefined) {
			initValue =3D this.value; // get initial color from the 'value' property
		} else if (this.valueElement &amp;&amp; this.valueElement.value !=3D=3D u=
ndefined) {
			initValue =3D this.valueElement.value; // get initial color from valueEl=
ement's value
		}

		// determine initial alpha value
		//
		var initAlpha =3D undefined;

		if (this.alpha !=3D=3D undefined) {
			initAlpha =3D (''+this.alpha); // get initial alpha value from the 'alph=
a' property
		} else if (this.alphaElement &amp;&amp; this.alphaElement.value !=3D=3D u=
ndefined) {
			initAlpha =3D this.alphaElement.value; // get initial color from alphaEl=
ement's value
		}

		// determine current format based on the initial color value
		//
		this._currentFormat =3D null;

		if (['auto', 'any'].indexOf(this.format.toLowerCase()) &gt; -1) {
			// format is 'auto' or 'any' -&gt; let's auto-detect current format
			var color =3D jsc.parseColorString(initValue);
			this._currentFormat =3D color ? color.format : 'hex';
		} else {
			// format is specified
			this._currentFormat =3D this.format.toLowerCase();
		}


		// let's parse the initial color value and expose color's preview
		this.processValueInput(initValue);

		// let's also parse and expose the initial alpha value, if any
		//
		// Note: If the initial color value contains alpha value in it (e.g. in r=
gba format),
		// this will overwrite it. So we should only process alpha input if there=
 was any initial
		// alpha explicitly set, otherwise we could needlessly lose initial value=
's alpha
		if (initAlpha !=3D=3D undefined) {
			this.processAlphaInput(initAlpha);
		}

	}

};


//=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=
=3D=3D=3D=3D=3D=3D=3D=3D
// Public properties and methods
//=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=
=3D=3D=3D=3D=3D=3D=3D=3D

//
// These will be publicly available via jscolor.&lt;name&gt; and JSColor.&l=
t;name&gt;
//


// class that will be set to elements having jscolor installed on them
jsc.pub.className =3D 'jscolor';


// class that will be set to elements having jscolor active on them
jsc.pub.activeClassName =3D 'jscolor-active';


// whether to try to parse the options string by evaluating it using 'new F=
unction()'
// in case it could not be parsed with JSON.parse()
jsc.pub.looseJSON =3D true;


// presets
jsc.pub.presets =3D {};

// built-in presets
jsc.pub.presets['default'] =3D {}; // baseline for customization

jsc.pub.presets['light'] =3D { // default color scheme
	backgroundColor: 'rgba(255,255,255,1)',
	controlBorderColor: 'rgba(187,187,187,1)',
	buttonColor: 'rgba(0,0,0,1)',
};
jsc.pub.presets['dark'] =3D {
	backgroundColor: 'rgba(51,51,51,1)',
	controlBorderColor: 'rgba(153,153,153,1)',
	buttonColor: 'rgba(240,240,240,1)',
};

jsc.pub.presets['small'] =3D { width:101, height:101, padding:10, sliderSiz=
e:14, paletteCols:8 };
jsc.pub.presets['medium'] =3D { width:181, height:101, padding:12, sliderSi=
ze:16, paletteCols:10 }; // default size
jsc.pub.presets['large'] =3D { width:271, height:151, padding:12, sliderSiz=
e:24, paletteCols:15 };

jsc.pub.presets['thin'] =3D { borderWidth:1, controlBorderWidth:1, pointerB=
orderWidth:1 }; // default thickness
jsc.pub.presets['thick'] =3D { borderWidth:2, controlBorderWidth:2, pointer=
BorderWidth:2 };


// size of space in the sliders
jsc.pub.sliderInnerSpace =3D 3; // px

// transparency chessboard
jsc.pub.chessboardSize =3D 8; // px
jsc.pub.chessboardColor1 =3D '#666666';
jsc.pub.chessboardColor2 =3D '#999999';

// preview separator
jsc.pub.previewSeparator =3D ['rgba(255,255,255,.65)', 'rgba(128,128,128,.6=
5)'];


// Initializes jscolor
jsc.pub.init =3D function () {
	if (jsc.initialized) {
		return;
	}

	// attach some necessary handlers
	window.document.addEventListener('mousedown', jsc.onDocumentMouseDown, fal=
se);
	window.document.addEventListener('keyup', jsc.onDocumentKeyUp, false);
	window.addEventListener('resize', jsc.onWindowResize, false);

	// install jscolor on current DOM
	jsc.pub.install();

	jsc.initialized =3D true;

	// call functions waiting in the queue
	while (jsc.readyQueue.length) {
		var func =3D jsc.readyQueue.shift();
		func();
	}
};


// Installs jscolor on current DOM tree
jsc.pub.install =3D function (rootNode) {
	var success =3D true;

	try {
		jsc.installBySelector('[data-jscolor]', rootNode);
	} catch (e) {
		success =3D false;
		console.warn(e);
	}

	// for backward compatibility with DEPRECATED installation using class nam=
e
	if (jsc.pub.lookupClass) {
		try {
			jsc.installBySelector(
				(
					'input.' + jsc.pub.lookupClass + ', ' +
					'button.' + jsc.pub.lookupClass
				),
				rootNode
			);
		} catch (e) {}
	}

	return success;
};


// Registers function to be called as soon as jscolor is initialized (or im=
mediately, if it already is).
//
jsc.pub.ready =3D function (func) {
	if (typeof func !=3D=3D 'function') {
		console.warn('Passed value is not a function');
		return false;
	}

	if (jsc.initialized) {
		func();
	} else {
		jsc.readyQueue.push(func);
	}
	return true;
};


// Triggers given input event(s) (e.g. 'input' or 'change') on all color pi=
ckers.
//
// It is possible to specify multiple events separated with a space.
// If called before jscolor is initialized, then the events will be trigger=
ed after initialization.
//
jsc.pub.trigger =3D function (eventNames) {
	var triggerNow =3D function () {
		jsc.triggerGlobal(eventNames);
	};

	if (jsc.initialized) {
		triggerNow();
	} else {
		jsc.pub.ready(triggerNow);
	}
};


// Hides current color picker box
jsc.pub.hide =3D function () {
	if (jsc.picker &amp;&amp; jsc.picker.owner) {
		jsc.picker.owner.hide();
	}
};


// Returns a data URL of a gray chessboard image that indicates transparenc=
y
jsc.pub.chessboard =3D function (color) {
	if (!color) {
		color =3D 'rgba(0,0,0,0)';
	}
	var preview =3D jsc.genColorPreviewCanvas(color);
	return preview.canvas.toDataURL();
};


// Returns a data URL of a gray chessboard image that indicates transparenc=
y
jsc.pub.background =3D function (color) {
	var backgrounds =3D [];

	// CSS gradient for background color preview
	backgrounds.push(jsc.genColorPreviewGradient(color));

	// data URL of generated PNG image with a gray transparency chessboard
	var preview =3D jsc.genColorPreviewCanvas();
	backgrounds.push([
		'url(\'' + preview.canvas.toDataURL() + '\')',
		'left top',
		'repeat',
	].join(' '));

	return backgrounds.join(', ');
};


//
// DEPRECATED properties and methods
//


// DEPRECATED. Use jscolor.presets.default instead.
//
// Custom default options for all color pickers, e.g. { hash: true, width: =
300 }
jsc.pub.options =3D {};


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor o=
n given element.
//
// By default, we'll search for all elements with class=3D"jscolor" and ins=
tall a color picker on them.
//
// You can change what class name will be looked for by setting the propert=
y jscolor.lookupClass
// anywhere in your HTML document. To completely disable the automatic look=
up, set it to null.
//
jsc.pub.lookupClass =3D 'jscolor';


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor o=
n given element.
//
// Install jscolor on all elements that have the specified class name
jsc.pub.installByClassName =3D function () {
	console.error('jscolor.installByClassName() is DEPRECATED. Use data-jscolo=
r=3D"" attribute instead of a class name.' + jsc.docsRef);
	return false;
};


jsc.register();


return jsc.pub;


})(); // END jscolor


if (typeof window.jscolor =3D=3D=3D 'undefined') {
	window.jscolor =3D window.JSColor =3D jscolor;
}


// END jscolor code

return jscolor;

}); // END factory
</pre></body></html>
------MultipartBoundary--2QYK6ZAeOtLUmWhnHFCLHnXYNUolw0EwRLt2w8t3ix------
