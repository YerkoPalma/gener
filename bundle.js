(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = (tpl, data) => {
	if (typeof tpl !== 'string') {
		throw new TypeError(`Expected a string in the first argument, got ${typeof tpl}`);
	}

	if (typeof data !== 'object') {
		throw new TypeError(`Expected an Object/Array in the second argument, got ${typeof data}`);
	}

	const re = /{(.*?)}/g;

	if (Array.isArray(data) && tpl.indexOf('{this}') > 0) {
		return data.reduce((acc, item) => {
			return acc + tpl.replace(/{this}/g, item);
		}, '');
	}

	return tpl.replace(re, (_, key) => {
		let ret = data;

		for (const prop of key.split('.')) {
			ret = ret ? ret[prop] : '';
		}

		return ret || '';
	});
};

},{}],2:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],3:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RouterSingleton=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";function _interopDefault(ex){return ex&&typeof ex==="object"&&"default"in ex?ex["default"]:ex}var UrlPattern=_interopDefault(require("url-pattern"));var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var RouterSingleton=function(){function RouterSingleton(){_classCallCheck(this,RouterSingleton)}_createClass(RouterSingleton,null,[{key:"getRouter",value:function getRouter(options){if(typeof window.RouterInstance_!=="undefined"){return window.RouterInstance_}window.RouterInstance_=new Router(options);return window.RouterInstance_}}]);return RouterSingleton}();var Router=function(){function Router(options){var _this=this;_classCallCheck(this,Router);this.routes={};this.currentPath=null;this.previousPath=null;this.currentRoute=null;this.previousRoute=null;this.root=null;this.rootEl=null;this.store=null;this.default=null;this.onRender=options&&options.onRender?options.onRender:null;this.onNavClick=options&&options.onNavClick?options.onNavClick:null;window.addEventListener("popstate",function(e){_this.onPopState(e)});var links=document.querySelectorAll("[data-route]");Array.prototype.forEach.call(links,function(link){link.addEventListener("click",function(event){event.preventDefault();link.setAttribute("data-bind",+new Date);_this.goToPath(link.getAttribute("data-route"));if(typeof _this.onNavClick==="function")_this.onNavClick(link.getAttribute("data-route"),link)})})}_createClass(Router,[{key:"setStore",value:function setStore(store){this.store=store}},{key:"addRoute",value:function addRoute(pattern,view,cb){this.routes[pattern]=new Route(pattern,view,cb)}},{key:"setRoot",value:function setRoot(path){this.root=this.getRoute(path)||new Route("/",function(){return document.createElement("div")})}},{key:"start",value:function start(selector){this.rootEl=document.querySelector(selector)||document.body;this.requestStateUpdate()}},{key:"onPopState",value:function onPopState(e){e.preventDefault();this.requestStateUpdate(e)}},{key:"getRoute",value:function getRoute(path){for(var pattern in this.routes){if(this.routes.hasOwnProperty(pattern)){if(this.routes[pattern]._urlPattern.match(path)!==null)return this.routes[pattern]}}}},{key:"notFound",value:function notFound(notFoundView){this.default=new Route(null,notFoundView)}},{key:"goToPath",value:function goToPath(path){var _this2=this;var title=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;this.previousPath=window.location.pathname;if(path===window.location.pathname){return}this.currentPath=path;this.previousRoute=this.currentRoute||this.root;this.currentRoute=this.getRoute(this.currentPath);window.history.pushState(undefined,title,path);window.requestAnimationFrame(function(){_this2.manageState()})}},{key:"manageState",value:function manageState(){var self=this;if(this.currentPath===this.previousPath)return;if(!this.currentRoute&&this.default)this.currentRoute=this.default;var currentView=this.currentRoute.onStart(this.store);if(!this.rootEl.hasChildNodes(currentView)){this.rootEl.appendChild(currentView)}else if(!this.onRender||typeof this.onRender!=="function"){var child=this.rootEl.firstChild;this.rootEl.replaceChild(currentView,child)}else{var _child=this.rootEl.firstChild;this.onRender(currentView,_child)}var links=document.querySelectorAll("a[data-route]");Array.prototype.forEach.call(links,function(link){link.addEventListener("click",function(e){e.preventDefault();if(!link.getAttribute("data-bind"))self.goToPath(link.getAttribute("data-route"));if(typeof self.onNavClick==="function")self.onNavClick(link.getAttribute("data-route"),link)})});if(typeof this.currentRoute.cb==="function"){try{this.currentRoute.cb()}catch(ex){console.error(ex)}}}},{key:"requestStateUpdate",value:function requestStateUpdate(e){var _this3=this;this.previousPath=this.currentPath;this.currentPath=window.location.pathname;this.currentRoute=this.getRoute(e&&e.target!==window?e.target.getAttribute("data-route"):window.location.pathname);window.requestAnimationFrame(function(){_this3.manageState()})}}]);return Router}();var Route=function(){function Route(pattern,view,cb){_classCallCheck(this,Route);this.pattern=pattern;this.cb=cb;this._urlPattern=pattern?new UrlPattern(pattern):null;this.view=view;this.params=null;this.path=null}_createClass(Route,[{key:"getParams",value:function getParams(){if(!this.path)return false;return this.params}},{key:"setParams",value:function setParams(){if(!this.path)return false;this.params=this._urlPattern?this._urlPattern.match(this.path):null}},{key:"onStart",value:function onStart(store){this.path=window.location.pathname;this.params=this._urlPattern?this._urlPattern.match(this.path):null;return this.view(this.params,store)}}]);return Route}();var index_js=RouterSingleton.getRouter;module.exports=index_js},{"url-pattern":2}],2:[function(require,module,exports){var slice=[].slice;(function(root,factory){if("function"===typeof define&&define.amd!=null){return define([],factory)}else if(typeof exports!=="undefined"&&exports!==null){return module.exports=factory()}else{return root.UrlPattern=factory()}})(this,function(){var P,UrlPattern,astNodeContainsSegmentsForProvidedParams,astNodeToNames,astNodeToRegexString,baseAstNodeToRegexString,concatMap,defaultOptions,escapeForRegex,getParam,keysAndValuesToObject,newParser,regexGroupCount,stringConcatMap,stringify;escapeForRegex=function(string){return string.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")};concatMap=function(array,f){var i,length,results;results=[];i=-1;length=array.length;while(++i<length){results=results.concat(f(array[i]))}return results};stringConcatMap=function(array,f){var i,length,result;result="";i=-1;length=array.length;while(++i<length){result+=f(array[i])}return result};regexGroupCount=function(regex){return new RegExp(regex.toString()+"|").exec("").length-1};keysAndValuesToObject=function(keys,values){var i,key,length,object,value;object={};i=-1;length=keys.length;while(++i<length){key=keys[i];value=values[i];if(value==null){continue}if(object[key]!=null){if(!Array.isArray(object[key])){object[key]=[object[key]]}object[key].push(value)}else{object[key]=value}}return object};P={};P.Result=function(value,rest){this.value=value;this.rest=rest};P.Tagged=function(tag,value){this.tag=tag;this.value=value};P.tag=function(tag,parser){return function(input){var result,tagged;result=parser(input);if(result==null){return}tagged=new P.Tagged(tag,result.value);return new P.Result(tagged,result.rest)}};P.regex=function(regex){return function(input){var matches,result;matches=regex.exec(input);if(matches==null){return}result=matches[0];return new P.Result(result,input.slice(result.length))}};P.sequence=function(){var parsers;parsers=1<=arguments.length?slice.call(arguments,0):[];return function(input){var i,length,parser,rest,result,values;i=-1;length=parsers.length;values=[];rest=input;while(++i<length){parser=parsers[i];result=parser(rest);if(result==null){return}values.push(result.value);rest=result.rest}return new P.Result(values,rest)}};P.pick=function(){var indexes,parsers;indexes=arguments[0],parsers=2<=arguments.length?slice.call(arguments,1):[];return function(input){var array,result;result=P.sequence.apply(P,parsers)(input);if(result==null){return}array=result.value;result.value=array[indexes];return result}};P.string=function(string){var length;length=string.length;return function(input){if(input.slice(0,length)===string){return new P.Result(string,input.slice(length))}}};P.lazy=function(fn){var cached;cached=null;return function(input){if(cached==null){cached=fn()}return cached(input)}};P.baseMany=function(parser,end,stringResult,atLeastOneResultRequired,input){var endResult,parserResult,rest,results;rest=input;results=stringResult?"":[];while(true){if(end!=null){endResult=end(rest);if(endResult!=null){break}}parserResult=parser(rest);if(parserResult==null){break}if(stringResult){results+=parserResult.value}else{results.push(parserResult.value)}rest=parserResult.rest}if(atLeastOneResultRequired&&results.length===0){return}return new P.Result(results,rest)};P.many1=function(parser){return function(input){return P.baseMany(parser,null,false,true,input)}};P.concatMany1Till=function(parser,end){return function(input){return P.baseMany(parser,end,true,true,input)}};P.firstChoice=function(){var parsers;parsers=1<=arguments.length?slice.call(arguments,0):[];return function(input){var i,length,parser,result;i=-1;length=parsers.length;while(++i<length){parser=parsers[i];result=parser(input);if(result!=null){return result}}}};newParser=function(options){var U;U={};U.wildcard=P.tag("wildcard",P.string(options.wildcardChar));U.optional=P.tag("optional",P.pick(1,P.string(options.optionalSegmentStartChar),P.lazy(function(){return U.pattern}),P.string(options.optionalSegmentEndChar)));U.name=P.regex(new RegExp("^["+options.segmentNameCharset+"]+"));U.named=P.tag("named",P.pick(1,P.string(options.segmentNameStartChar),P.lazy(function(){return U.name})));U.escapedChar=P.pick(1,P.string(options.escapeChar),P.regex(/^./));U["static"]=P.tag("static",P.concatMany1Till(P.firstChoice(P.lazy(function(){return U.escapedChar}),P.regex(/^./)),P.firstChoice(P.string(options.segmentNameStartChar),P.string(options.optionalSegmentStartChar),P.string(options.optionalSegmentEndChar),U.wildcard)));U.token=P.lazy(function(){return P.firstChoice(U.wildcard,U.optional,U.named,U["static"])});U.pattern=P.many1(P.lazy(function(){return U.token}));return U};defaultOptions={escapeChar:"\\",segmentNameStartChar:":",segmentValueCharset:"a-zA-Z0-9-_~ %",segmentNameCharset:"a-zA-Z0-9",optionalSegmentStartChar:"(",optionalSegmentEndChar:")",wildcardChar:"*"};baseAstNodeToRegexString=function(astNode,segmentValueCharset){if(Array.isArray(astNode)){return stringConcatMap(astNode,function(node){return baseAstNodeToRegexString(node,segmentValueCharset)})}switch(astNode.tag){case"wildcard":return"(.*?)";case"named":return"(["+segmentValueCharset+"]+)";case"static":return escapeForRegex(astNode.value);case"optional":return"(?:"+baseAstNodeToRegexString(astNode.value,segmentValueCharset)+")?"}};astNodeToRegexString=function(astNode,segmentValueCharset){if(segmentValueCharset==null){segmentValueCharset=defaultOptions.segmentValueCharset}return"^"+baseAstNodeToRegexString(astNode,segmentValueCharset)+"$"};astNodeToNames=function(astNode){if(Array.isArray(astNode)){return concatMap(astNode,astNodeToNames)}switch(astNode.tag){case"wildcard":return["_"];case"named":return[astNode.value];case"static":return[];case"optional":return astNodeToNames(astNode.value)}};getParam=function(params,key,nextIndexes,sideEffects){var index,maxIndex,result,value;if(sideEffects==null){sideEffects=false}value=params[key];if(value==null){if(sideEffects){throw new Error("no values provided for key `"+key+"`")}else{return}}index=nextIndexes[key]||0;maxIndex=Array.isArray(value)?value.length-1:0;if(index>maxIndex){if(sideEffects){throw new Error("too few values provided for key `"+key+"`")}else{return}}result=Array.isArray(value)?value[index]:value;if(sideEffects){nextIndexes[key]=index+1}return result};astNodeContainsSegmentsForProvidedParams=function(astNode,params,nextIndexes){var i,length;if(Array.isArray(astNode)){i=-1;length=astNode.length;while(++i<length){if(astNodeContainsSegmentsForProvidedParams(astNode[i],params,nextIndexes)){return true}}return false}switch(astNode.tag){case"wildcard":return getParam(params,"_",nextIndexes,false)!=null;case"named":return getParam(params,astNode.value,nextIndexes,false)!=null;case"static":return false;case"optional":return astNodeContainsSegmentsForProvidedParams(astNode.value,params,nextIndexes)}};stringify=function(astNode,params,nextIndexes){if(Array.isArray(astNode)){return stringConcatMap(astNode,function(node){return stringify(node,params,nextIndexes)})}switch(astNode.tag){case"wildcard":return getParam(params,"_",nextIndexes,true);case"named":return getParam(params,astNode.value,nextIndexes,true);case"static":return astNode.value;case"optional":if(astNodeContainsSegmentsForProvidedParams(astNode.value,params,nextIndexes)){return stringify(astNode.value,params,nextIndexes)}else{return""}}};UrlPattern=function(arg1,arg2){var groupCount,options,parsed,parser,withoutWhitespace;if(arg1 instanceof UrlPattern){this.isRegex=arg1.isRegex;this.regex=arg1.regex;this.ast=arg1.ast;this.names=arg1.names;return}this.isRegex=arg1 instanceof RegExp;if(!("string"===typeof arg1||this.isRegex)){throw new TypeError("argument must be a regex or a string")}if(this.isRegex){this.regex=arg1;if(arg2!=null){if(!Array.isArray(arg2)){throw new Error("if first argument is a regex the second argument may be an array of group names but you provided something else")}groupCount=regexGroupCount(this.regex);if(arg2.length!==groupCount){throw new Error("regex contains "+groupCount+" groups but array of group names contains "+arg2.length)}this.names=arg2}return}if(arg1===""){throw new Error("argument must not be the empty string")}withoutWhitespace=arg1.replace(/\s+/g,"");if(withoutWhitespace!==arg1){throw new Error("argument must not contain whitespace")}options={escapeChar:(arg2!=null?arg2.escapeChar:void 0)||defaultOptions.escapeChar,segmentNameStartChar:(arg2!=null?arg2.segmentNameStartChar:void 0)||defaultOptions.segmentNameStartChar,segmentNameCharset:(arg2!=null?arg2.segmentNameCharset:void 0)||defaultOptions.segmentNameCharset,segmentValueCharset:(arg2!=null?arg2.segmentValueCharset:void 0)||defaultOptions.segmentValueCharset,optionalSegmentStartChar:(arg2!=null?arg2.optionalSegmentStartChar:void 0)||defaultOptions.optionalSegmentStartChar,optionalSegmentEndChar:(arg2!=null?arg2.optionalSegmentEndChar:void 0)||defaultOptions.optionalSegmentEndChar,wildcardChar:(arg2!=null?arg2.wildcardChar:void 0)||defaultOptions.wildcardChar};parser=newParser(options);parsed=parser.pattern(arg1);if(parsed==null){throw new Error("couldn't parse pattern")}if(parsed.rest!==""){throw new Error("could only partially parse pattern")}this.ast=parsed.value;this.regex=new RegExp(astNodeToRegexString(this.ast,options.segmentValueCharset));this.names=astNodeToNames(this.ast)};UrlPattern.prototype.match=function(url){var groups,match;match=this.regex.exec(url);if(match==null){return null}groups=match.slice(1);if(this.names){return keysAndValuesToObject(this.names,groups)}else{return groups}};UrlPattern.prototype.stringify=function(params){if(params==null){params={}}if(this.isRegex){throw new Error("can't stringify patterns generated from a regex")}if(params!==Object(params)){throw new Error("argument must be an object or undefined")}return stringify(this.ast,params,{})};UrlPattern.escapeForRegex=escapeForRegex;UrlPattern.concatMap=concatMap;UrlPattern.stringConcatMap=stringConcatMap;UrlPattern.regexGroupCount=regexGroupCount;UrlPattern.keysAndValuesToObject=keysAndValuesToObject;UrlPattern.P=P;UrlPattern.newParser=newParser;UrlPattern.defaultOptions=defaultOptions;UrlPattern.astNodeToRegexString=astNodeToRegexString;UrlPattern.astNodeToNames=astNodeToNames;UrlPattern.getParam=getParam;UrlPattern.astNodeContainsSegmentsForProvidedParams=astNodeContainsSegmentsForProvidedParams;UrlPattern.stringify=stringify;return UrlPattern})},{}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"url-pattern":4}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
var slice = [].slice;

(function(root, factory) {
  if (('function' === typeof define) && (define.amd != null)) {
    return define([], factory);
  } else if (typeof exports !== "undefined" && exports !== null) {
    return module.exports = factory();
  } else {
    return root.UrlPattern = factory();
  }
})(this, function() {
  var P, UrlPattern, astNodeContainsSegmentsForProvidedParams, astNodeToNames, astNodeToRegexString, baseAstNodeToRegexString, concatMap, defaultOptions, escapeForRegex, getParam, keysAndValuesToObject, newParser, regexGroupCount, stringConcatMap, stringify;
  escapeForRegex = function(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };
  concatMap = function(array, f) {
    var i, length, results;
    results = [];
    i = -1;
    length = array.length;
    while (++i < length) {
      results = results.concat(f(array[i]));
    }
    return results;
  };
  stringConcatMap = function(array, f) {
    var i, length, result;
    result = '';
    i = -1;
    length = array.length;
    while (++i < length) {
      result += f(array[i]);
    }
    return result;
  };
  regexGroupCount = function(regex) {
    return (new RegExp(regex.toString() + '|')).exec('').length - 1;
  };
  keysAndValuesToObject = function(keys, values) {
    var i, key, length, object, value;
    object = {};
    i = -1;
    length = keys.length;
    while (++i < length) {
      key = keys[i];
      value = values[i];
      if (value == null) {
        continue;
      }
      if (object[key] != null) {
        if (!Array.isArray(object[key])) {
          object[key] = [object[key]];
        }
        object[key].push(value);
      } else {
        object[key] = value;
      }
    }
    return object;
  };
  P = {};
  P.Result = function(value, rest) {
    this.value = value;
    this.rest = rest;
  };
  P.Tagged = function(tag, value) {
    this.tag = tag;
    this.value = value;
  };
  P.tag = function(tag, parser) {
    return function(input) {
      var result, tagged;
      result = parser(input);
      if (result == null) {
        return;
      }
      tagged = new P.Tagged(tag, result.value);
      return new P.Result(tagged, result.rest);
    };
  };
  P.regex = function(regex) {
    return function(input) {
      var matches, result;
      matches = regex.exec(input);
      if (matches == null) {
        return;
      }
      result = matches[0];
      return new P.Result(result, input.slice(result.length));
    };
  };
  P.sequence = function() {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function(input) {
      var i, length, parser, rest, result, values;
      i = -1;
      length = parsers.length;
      values = [];
      rest = input;
      while (++i < length) {
        parser = parsers[i];
        result = parser(rest);
        if (result == null) {
          return;
        }
        values.push(result.value);
        rest = result.rest;
      }
      return new P.Result(values, rest);
    };
  };
  P.pick = function() {
    var indexes, parsers;
    indexes = arguments[0], parsers = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return function(input) {
      var array, result;
      result = P.sequence.apply(P, parsers)(input);
      if (result == null) {
        return;
      }
      array = result.value;
      result.value = array[indexes];
      return result;
    };
  };
  P.string = function(string) {
    var length;
    length = string.length;
    return function(input) {
      if (input.slice(0, length) === string) {
        return new P.Result(string, input.slice(length));
      }
    };
  };
  P.lazy = function(fn) {
    var cached;
    cached = null;
    return function(input) {
      if (cached == null) {
        cached = fn();
      }
      return cached(input);
    };
  };
  P.baseMany = function(parser, end, stringResult, atLeastOneResultRequired, input) {
    var endResult, parserResult, rest, results;
    rest = input;
    results = stringResult ? '' : [];
    while (true) {
      if (end != null) {
        endResult = end(rest);
        if (endResult != null) {
          break;
        }
      }
      parserResult = parser(rest);
      if (parserResult == null) {
        break;
      }
      if (stringResult) {
        results += parserResult.value;
      } else {
        results.push(parserResult.value);
      }
      rest = parserResult.rest;
    }
    if (atLeastOneResultRequired && results.length === 0) {
      return;
    }
    return new P.Result(results, rest);
  };
  P.many1 = function(parser) {
    return function(input) {
      return P.baseMany(parser, null, false, true, input);
    };
  };
  P.concatMany1Till = function(parser, end) {
    return function(input) {
      return P.baseMany(parser, end, true, true, input);
    };
  };
  P.firstChoice = function() {
    var parsers;
    parsers = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return function(input) {
      var i, length, parser, result;
      i = -1;
      length = parsers.length;
      while (++i < length) {
        parser = parsers[i];
        result = parser(input);
        if (result != null) {
          return result;
        }
      }
    };
  };
  newParser = function(options) {
    var U;
    U = {};
    U.wildcard = P.tag('wildcard', P.string(options.wildcardChar));
    U.optional = P.tag('optional', P.pick(1, P.string(options.optionalSegmentStartChar), P.lazy(function() {
      return U.pattern;
    }), P.string(options.optionalSegmentEndChar)));
    U.name = P.regex(new RegExp("^[" + options.segmentNameCharset + "]+"));
    U.named = P.tag('named', P.pick(1, P.string(options.segmentNameStartChar), P.lazy(function() {
      return U.name;
    })));
    U.escapedChar = P.pick(1, P.string(options.escapeChar), P.regex(/^./));
    U["static"] = P.tag('static', P.concatMany1Till(P.firstChoice(P.lazy(function() {
      return U.escapedChar;
    }), P.regex(/^./)), P.firstChoice(P.string(options.segmentNameStartChar), P.string(options.optionalSegmentStartChar), P.string(options.optionalSegmentEndChar), U.wildcard)));
    U.token = P.lazy(function() {
      return P.firstChoice(U.wildcard, U.optional, U.named, U["static"]);
    });
    U.pattern = P.many1(P.lazy(function() {
      return U.token;
    }));
    return U;
  };
  defaultOptions = {
    escapeChar: '\\',
    segmentNameStartChar: ':',
    segmentValueCharset: 'a-zA-Z0-9-_~ %',
    segmentNameCharset: 'a-zA-Z0-9',
    optionalSegmentStartChar: '(',
    optionalSegmentEndChar: ')',
    wildcardChar: '*'
  };
  baseAstNodeToRegexString = function(astNode, segmentValueCharset) {
    if (Array.isArray(astNode)) {
      return stringConcatMap(astNode, function(node) {
        return baseAstNodeToRegexString(node, segmentValueCharset);
      });
    }
    switch (astNode.tag) {
      case 'wildcard':
        return '(.*?)';
      case 'named':
        return "([" + segmentValueCharset + "]+)";
      case 'static':
        return escapeForRegex(astNode.value);
      case 'optional':
        return '(?:' + baseAstNodeToRegexString(astNode.value, segmentValueCharset) + ')?';
    }
  };
  astNodeToRegexString = function(astNode, segmentValueCharset) {
    if (segmentValueCharset == null) {
      segmentValueCharset = defaultOptions.segmentValueCharset;
    }
    return '^' + baseAstNodeToRegexString(astNode, segmentValueCharset) + '$';
  };
  astNodeToNames = function(astNode) {
    if (Array.isArray(astNode)) {
      return concatMap(astNode, astNodeToNames);
    }
    switch (astNode.tag) {
      case 'wildcard':
        return ['_'];
      case 'named':
        return [astNode.value];
      case 'static':
        return [];
      case 'optional':
        return astNodeToNames(astNode.value);
    }
  };
  getParam = function(params, key, nextIndexes, sideEffects) {
    var index, maxIndex, result, value;
    if (sideEffects == null) {
      sideEffects = false;
    }
    value = params[key];
    if (value == null) {
      if (sideEffects) {
        throw new Error("no values provided for key `" + key + "`");
      } else {
        return;
      }
    }
    index = nextIndexes[key] || 0;
    maxIndex = Array.isArray(value) ? value.length - 1 : 0;
    if (index > maxIndex) {
      if (sideEffects) {
        throw new Error("too few values provided for key `" + key + "`");
      } else {
        return;
      }
    }
    result = Array.isArray(value) ? value[index] : value;
    if (sideEffects) {
      nextIndexes[key] = index + 1;
    }
    return result;
  };
  astNodeContainsSegmentsForProvidedParams = function(astNode, params, nextIndexes) {
    var i, length;
    if (Array.isArray(astNode)) {
      i = -1;
      length = astNode.length;
      while (++i < length) {
        if (astNodeContainsSegmentsForProvidedParams(astNode[i], params, nextIndexes)) {
          return true;
        }
      }
      return false;
    }
    switch (astNode.tag) {
      case 'wildcard':
        return getParam(params, '_', nextIndexes, false) != null;
      case 'named':
        return getParam(params, astNode.value, nextIndexes, false) != null;
      case 'static':
        return false;
      case 'optional':
        return astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes);
    }
  };
  stringify = function(astNode, params, nextIndexes) {
    if (Array.isArray(astNode)) {
      return stringConcatMap(astNode, function(node) {
        return stringify(node, params, nextIndexes);
      });
    }
    switch (astNode.tag) {
      case 'wildcard':
        return getParam(params, '_', nextIndexes, true);
      case 'named':
        return getParam(params, astNode.value, nextIndexes, true);
      case 'static':
        return astNode.value;
      case 'optional':
        if (astNodeContainsSegmentsForProvidedParams(astNode.value, params, nextIndexes)) {
          return stringify(astNode.value, params, nextIndexes);
        } else {
          return '';
        }
    }
  };
  UrlPattern = function(arg1, arg2) {
    var groupCount, options, parsed, parser, withoutWhitespace;
    if (arg1 instanceof UrlPattern) {
      this.isRegex = arg1.isRegex;
      this.regex = arg1.regex;
      this.ast = arg1.ast;
      this.names = arg1.names;
      return;
    }
    this.isRegex = arg1 instanceof RegExp;
    if (!(('string' === typeof arg1) || this.isRegex)) {
      throw new TypeError('argument must be a regex or a string');
    }
    if (this.isRegex) {
      this.regex = arg1;
      if (arg2 != null) {
        if (!Array.isArray(arg2)) {
          throw new Error('if first argument is a regex the second argument may be an array of group names but you provided something else');
        }
        groupCount = regexGroupCount(this.regex);
        if (arg2.length !== groupCount) {
          throw new Error("regex contains " + groupCount + " groups but array of group names contains " + arg2.length);
        }
        this.names = arg2;
      }
      return;
    }
    if (arg1 === '') {
      throw new Error('argument must not be the empty string');
    }
    withoutWhitespace = arg1.replace(/\s+/g, '');
    if (withoutWhitespace !== arg1) {
      throw new Error('argument must not contain whitespace');
    }
    options = {
      escapeChar: (arg2 != null ? arg2.escapeChar : void 0) || defaultOptions.escapeChar,
      segmentNameStartChar: (arg2 != null ? arg2.segmentNameStartChar : void 0) || defaultOptions.segmentNameStartChar,
      segmentNameCharset: (arg2 != null ? arg2.segmentNameCharset : void 0) || defaultOptions.segmentNameCharset,
      segmentValueCharset: (arg2 != null ? arg2.segmentValueCharset : void 0) || defaultOptions.segmentValueCharset,
      optionalSegmentStartChar: (arg2 != null ? arg2.optionalSegmentStartChar : void 0) || defaultOptions.optionalSegmentStartChar,
      optionalSegmentEndChar: (arg2 != null ? arg2.optionalSegmentEndChar : void 0) || defaultOptions.optionalSegmentEndChar,
      wildcardChar: (arg2 != null ? arg2.wildcardChar : void 0) || defaultOptions.wildcardChar
    };
    parser = newParser(options);
    parsed = parser.pattern(arg1);
    if (parsed == null) {
      throw new Error("couldn't parse pattern");
    }
    if (parsed.rest !== '') {
      throw new Error("could only partially parse pattern");
    }
    this.ast = parsed.value;
    this.regex = new RegExp(astNodeToRegexString(this.ast, options.segmentValueCharset));
    this.names = astNodeToNames(this.ast);
  };
  UrlPattern.prototype.match = function(url) {
    var groups, match;
    match = this.regex.exec(url);
    if (match == null) {
      return null;
    }
    groups = match.slice(1);
    if (this.names) {
      return keysAndValuesToObject(this.names, groups);
    } else {
      return groups;
    }
  };
  UrlPattern.prototype.stringify = function(params) {
    if (params == null) {
      params = {};
    }
    if (this.isRegex) {
      throw new Error("can't stringify patterns generated from a regex");
    }
    if (params !== Object(params)) {
      throw new Error("argument must be an object or undefined");
    }
    return stringify(this.ast, params, {});
  };
  UrlPattern.escapeForRegex = escapeForRegex;
  UrlPattern.concatMap = concatMap;
  UrlPattern.stringConcatMap = stringConcatMap;
  UrlPattern.regexGroupCount = regexGroupCount;
  UrlPattern.keysAndValuesToObject = keysAndValuesToObject;
  UrlPattern.P = P;
  UrlPattern.newParser = newParser;
  UrlPattern.defaultOptions = defaultOptions;
  UrlPattern.astNodeToRegexString = astNodeToRegexString;
  UrlPattern.astNodeToNames = astNodeToNames;
  UrlPattern.getParam = getParam;
  UrlPattern.astNodeContainsSegmentsForProvidedParams = astNodeContainsSegmentsForProvidedParams;
  UrlPattern.stringify = stringify;
  return UrlPattern;
});

},{}],5:[function(require,module,exports){
module.exports=function(){var e=document.getElementById("search"),t=e.parentNode;e.querySelector("input").style.width="0px",t.style.transition="all .25s ease",t.style.WebkitTransition="all .25s ease",t.style.MozTransition="all .25s ease",e.addEventListener("click",function(t){t.stopPropagation(),e.querySelector("input").style.width="195px",e.parentNode.classList.remove("w4"),e.parentNode.classList.add("w5")}),window.addEventListener("click",function(t){t.stopPropagation();var s=t.target;console.log(e.contains(s)),s===e&&e.contains(s)||(e.querySelector("input").style.width="0px",e.parentNode.classList.add("w4"),e.parentNode.classList.remove("w5"))})};
},{}],6:[function(require,module,exports){
const SingletonRouter=require("singleton-router"),PostsView=require("./views/posts"),PostView=require("./views/post"),router=SingletonRouter();var event=new Event("rendered");router.addRoute("/",PostsView,function(){window.dispatchEvent(event)}),router.addRoute("/:post",PostView,function(){window.dispatchEvent(event)}),router.setRoot("/"),router.start("#app"),window.addEventListener("rendered",function(e){require("./defaults/_scripts.js")()},!1);
},{"./defaults/_scripts.js":5,"./views/post":10,"./views/posts":11,"singleton-router":3}],7:[function(require,module,exports){
function compile(l,e){return l+pupa('<article class="mb3 ba b--black-10 bg-white tc pv2 flex flex-row flex-wrap items-center"><div class="w-100 db flex flex-row flex-wrap items-top"><svg class="dib ml3 mb2" idth="21" height="21" viewBox="0 0 21 21"><path d="M4.662 8.72l-1.23 1.23a1.753 1.753 0 0 0 .004 2.477l5.135 5.135c.7.693 1.8.688 2.48.005l1.23-1.23 5.35-5.346c.31-.31.54-.92.51-1.36l-.32-4.29c-.09-1.09-1.05-2.06-2.15-2.14l-4.3-.33c-.43-.03-1.05.2-1.36.51l-.79.8-2.27 2.28-2.28 2.27zm9.826-.98a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" fill-rule="evenodd"></path></svg> '+pupa('<a href="#" class="underline-hover link f5 ph2 silver tl">{this}</a>',e.tags)+'</div><div class="w-100 db flex flex-row flex-wrap"><div class="tc dib ml2"><img src="http://tachyons.io/img/logo.jpg" class="br-100 pa1 ba b--black-10 h2 w2" alt="avatar"></div><div class="tl ml2 dib"><p class="mb0 mt2 f6 light-silver v-mid"><a class="link green" href="#">{author.name}</a></p><p class="fw1 mb2 mt0 f6 light-silver v-mid"><a class="light-silver link dim" href="">4 days ago</a> · 2 mins read</p></div></div><a data-route="{slug}" href="#" class="link f5 pa3 silver tl"><h3 class="mt1 mb3 f2 black-80 db w-100 tl">{title}</h3><img class="w-100 mw-100" alt="{featuredImageDescription}" src="{featuredImage}"> Read more...</a></article>',e)}const pupa=require("@yerkopalma/pupa");module.exports=function(l){return'<div class="mw9 center ph3-ns"><nav class="flex items-center justify-between flex-wrap flex-column bb b--black-10 bg-white db dt-l w-100 border-box ph3 pt3 ph6-l"><div class="w-100 mb3 flex items-center justify-between flex-wrap flex-row"><a data-route="/" class="w2 ml5 v-mid mid-gray link tc tl-l mb2 mb0-l" href="#" title="Home"><img src="http://tachyons.io/img/logo.jpg" class="dib w2 h2 br-100" alt="Site Name"></a><div class="db dtc-l v-mid tc tr-l w4"><label id="search" class="flex items-center"><span class="dim pointer self-center"><svg class="self-center" width="25" height="25" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg></span><input class="ml2 outline-0 bn self-center" type="text" placeholder="Search blog..."></label></div></div><ul class="ml5 pl0 mt3 mb2 list mb1 w-75 flex items-start justify-start flex-wrap flex-row"><li class="mr3"><a data-route="/" class="black-80 link dim pointer" href="">Home</a></li><li class="mr3"><a class="black-80 link dim pointer" href="">Tags</a></li><li class="mr3"><a class="black-80 link dim pointer" href="">About</a></li></ul></nav><div class="ph2-ns mt4 flex flex-row flex-wrap justify-center"><section class="pa2 fl w-80 w-50-l">'+l.reduce(compile,"")+"</section>  </div></div> "};
},{"@yerkopalma/pupa":1}],8:[function(require,module,exports){
module.exports={"nra.json":'{"author":{"name":"Andrew Gillum","social":{"twiiter":"https://twitter.com/AndrewGillum"}},"date":{"year":2017,"month":1,"day":5},"title":"How to Fight the NRA","tags":["politics","guns","LGBTQ","Gun control","Inmigration"]}',"nra.md":'<p class="black-80 fw1 lh-copy georgia f4">I’m being personally sued by the gun lobby.</p><p class="black-80 fw1 lh-copy georgia f4">In 2014, as a Tallahassee City Commissioner, my colleagues and I refused to repeal ordinances that prevent shooting guns in a public park.</p><p class="black-80 fw1 lh-copy georgia f4">Because of our actions that day, and our commitment to the safety of our citizens, my fellow locally elected officials and I are facing fines of $5,000 per vote, damages up to $100,000, and the potential to be removed from our elected jobs by the Governor of Florida. We have also been forced to find our own lawyers to defend us in Court.</p><p class="black-80 fw1 lh-copy georgia f4">Although nobody should be against these types of common sense laws, this lawsuit isn’t about guns. It’s about huge special interests, in this case the National Rifle Association (NRA), spending big money to take away local voices and local control, using tactics called preemption and super-preemption.</p><p class="black-80 fw1 lh-copy georgia f4">It’s also about how these special interests and corporations, after getting their way with state government, are trying to intimidate and bully local communities by filing damaging lawsuits against officials like me. Like your local commissioners. Like your local councilmembers. Like your Mayor. And like you.</p><p class="black-80 fw1 lh-copy georgia f4">It’s wrong, it’s cowardly, and unfortunately, it seems to be getting worse; especially in places with far-right conservative state governments.</p><p class="black-80 fw1 lh-copy georgia f4"><a href="http://defendlocal.com/" class="link underline black-80"><strong class="b">But we are fighting back in Florida.</strong></a></p><p class="black-80 fw1 lh-copy georgia f4">At trial, we have challenged the constitutionality of the laws that are being used to attack our local communities and officials. We have carried that fight to the First District Court of Appeals of Florida, and are set to hear Oral Argument on January 10, 2017.</p><p class="black-80 fw1 lh-copy georgia f4">We have had great support in this effort from state and national partners, and we hope to set a precedent for challenging these “super-preemption” overreaches. Our partners recognize that if these threats are deployed today by the gun lobby, there’s nothing stopping special interests from coming after protections for immigrants, the LGBT community, the environment, and others.</p><p class="black-80 fw1 lh-copy georgia f4">We want to stand up to these bullies everywhere they show up.</p><p class="black-80 fw1 lh-copy georgia f4">That’s why I am officially launching a nonpartisan, grassroots effort to bring together individuals, organizations, and elected officials concerned about the erosion of local rights.</p><p class="black-80 fw1 lh-copy georgia f4">This effort, the <strong class="b">Campaign to Defend Local Solutions</strong>, will send a message to state lawmakers, and give citizens around the country the tools to push back against special interest groups and large corporations, and maintain their right to put forward local solutions to the issues facing their community.</p><p class="black-80 fw1 lh-copy georgia f4">We will hold events to rise against looming threats on issues like minimum wage and health benefits, the environment, local hiring practices, and water quality.</p><p class="black-80 fw1 lh-copy georgia f4">We will help bring awareness and support to similar fights being undertaken by local officials across the country that are fighting to defend local solutions.</p><p class="black-80 fw1 lh-copy georgia f4">And we will elevate the voices and narratives of these efforts, so that no attempt to bully or intimidate local communities around the country will ever be tolerated. </p><p class="black-80 fw1 lh-copy georgia f4">I am calling on you to help defend your vote, defend your rights, and to help us <a href="http://defendlocal.com/" class="link underline black-80">#DefendLocal</a> at <a href="http://defendlocal.com/" class="link underline black-80">DefendLocal.com</a>. This is how we fight and win against bullies like the NRA.</p>',"/nra":'<div class="mw9 center ph3-ns"><nav class="flex items-center justify-between flex-wrap flex-column bb b--black-10 bg-white db dt-l w-100 border-box ph3 pt3 ph6-l"><div class="w-100 mb3 flex items-center justify-between flex-wrap flex-row"><a data-route="/" class="w2 ml5 v-mid mid-gray link tc tl-l mb2 mb0-l" href="#" title="Home"><img src="http://tachyons.io/img/logo.jpg" class="dib w2 h2 br-100" alt="Site Name"></a><div class="db dtc-l v-mid tc tr-l w4"><label id="search" class="flex items-center"><span class="dim pointer self-center"><svg class="self-center" width="25" height="25" viewBox="0 0 25 25"><path d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path></svg></span><input class="ml2 outline-0 bn self-center" type="text" placeholder="Search blog..."></label></div></div><ul class="ml5 pl0 mt3 mb2 list mb1 w-75 flex items-start justify-start flex-wrap flex-row"><li class="mr3"><a data-route="/" class="black-80 link dim pointer" href="">Home</a></li><li class="mr3"><a class="black-80 link dim pointer" href="">Tags</a></li><li class="mr3"><a class="black-80 link dim pointer" href="">About</a></li></ul></nav><div class="ph2-ns mt4 flex flex-row flex-wrap justify-center"><article class="w-90 w-two-thirds-l w-75-ns"><div class="mt4 w-100 db flex flex-row flex-wrap"><div class="tc dib ml2"><img src="http://tachyons.io/img/logo.jpg" class="br-100 pa1 ba b--black-10 h3 w3" alt="avatar"></div><div class="tl ml3 dib"><p class="mb1 mt2 f6 light-silver v-mid"><a class="link gray" href="#">Andrew Gillum</a></p><p class="fw1 mb1 mt0 f6 light-silver v-mid">Freelance web developer</p><p class="fw1 mb2 mt0 f6 light-silver v-mid">5 January, 2017</p></div></div><h1 class="f2 mb2 black-80" id="title">How to Fight the NRA</h1><p class="black-80 fw1 lh-copy georgia f4">I’m being personally sued by the gun lobby.</p><p class="black-80 fw1 lh-copy georgia f4">In 2014, as a Tallahassee City Commissioner, my colleagues and I refused to repeal ordinances that prevent shooting guns in a public park.</p><p class="black-80 fw1 lh-copy georgia f4">Because of our actions that day, and our commitment to the safety of our citizens, my fellow locally elected officials and I are facing fines of $5,000 per vote, damages up to $100,000, and the potential to be removed from our elected jobs by the Governor of Florida. We have also been forced to find our own lawyers to defend us in Court.</p><p class="black-80 fw1 lh-copy georgia f4">Although nobody should be against these types of common sense laws, this lawsuit isn’t about guns. It’s about huge special interests, in this case the National Rifle Association (NRA), spending big money to take away local voices and local control, using tactics called preemption and super-preemption.</p><p class="black-80 fw1 lh-copy georgia f4">It’s also about how these special interests and corporations, after getting their way with state government, are trying to intimidate and bully local communities by filing damaging lawsuits against officials like me. Like your local commissioners. Like your local councilmembers. Like your Mayor. And like you.</p><p class="black-80 fw1 lh-copy georgia f4">It’s wrong, it’s cowardly, and unfortunately, it seems to be getting worse; especially in places with far-right conservative state governments.</p><p class="black-80 fw1 lh-copy georgia f4"><a href="http://defendlocal.com/" class="link underline black-80"><strong class="b">But we are fighting back in Florida.</strong></a></p><p class="black-80 fw1 lh-copy georgia f4">At trial, we have challenged the constitutionality of the laws that are being used to attack our local communities and officials. We have carried that fight to the First District Court of Appeals of Florida, and are set to hear Oral Argument on January 10, 2017.</p><p class="black-80 fw1 lh-copy georgia f4">We have had great support in this effort from state and national partners, and we hope to set a precedent for challenging these “super-preemption” overreaches. Our partners recognize that if these threats are deployed today by the gun lobby, there’s nothing stopping special interests from coming after protections for immigrants, the LGBT community, the environment, and others.</p><p class="black-80 fw1 lh-copy georgia f4">We want to stand up to these bullies everywhere they show up.</p><p class="black-80 fw1 lh-copy georgia f4">That’s why I am officially launching a nonpartisan, grassroots effort to bring together individuals, organizations, and elected officials concerned about the erosion of local rights.</p><p class="black-80 fw1 lh-copy georgia f4">This effort, the <strong class="b">Campaign to Defend Local Solutions</strong>, will send a message to state lawmakers, and give citizens around the country the tools to push back against special interest groups and large corporations, and maintain their right to put forward local solutions to the issues facing their community.</p><p class="black-80 fw1 lh-copy georgia f4">We will hold events to rise against looming threats on issues like minimum wage and health benefits, the environment, local hiring practices, and water quality.</p><p class="black-80 fw1 lh-copy georgia f4">We will help bring awareness and support to similar fights being undertaken by local officials across the country that are fighting to defend local solutions.</p><p class="black-80 fw1 lh-copy georgia f4">And we will elevate the voices and narratives of these efforts, so that no attempt to bully or intimidate local communities around the country will ever be tolerated.</p><p class="black-80 fw1 lh-copy georgia f4">I am calling on you to help defend your vote, defend your rights, and to help us <a href="http://defendlocal.com/" class="link underline black-80">#DefendLocal</a> at <a href="http://defendlocal.com/" class="link underline black-80">DefendLocal.com</a>. This is how we fight and win against bullies like the NRA.</p><div class="w-100 flex flex-row flex-wrap justify-start content-between mb3"><a class="link pointer bg-black-05 pa2 black-60 hover-bg-moon-gray br1">politics</a> <a class="link pointer bg-black-05 pa2 black-60 hover-bg-moon-gray br1">guns</a> <a class="link pointer bg-black-05 pa2 black-60 hover-bg-moon-gray br1">LGBTQ</a> <a class="link pointer bg-black-05 pa2 black-60 hover-bg-moon-gray br1">Gun control</a> <a class="link pointer bg-black-05 pa2 black-60 hover-bg-moon-gray br1">Inmigration</a></div></article></div></div>'};
},{}],9:[function(require,module,exports){
module.exports=[{slug:"/nra",featuredImage:"http://placehold.it/550x150",featuredImageDescription:"",author:{name:"Andrew Gillum",social:{twiiter:"https://twitter.com/AndrewGillum"}},date:{year:2017,month:1,day:5},title:"How to Fight the NRA",tags:["politics","guns","LGBTQ","Gun control","Inmigration"]}];
},{}],10:[function(require,module,exports){
const posts=require("./data.js"),domify=require("domify");module.exports=function(o){const s=posts["/"+o.post];return domify(s)};
},{"./data.js":8,"domify":2}],11:[function(require,module,exports){
const posts=require("./data-posts"),domify=require("domify");module.exports=function(t){var e=require("./meta");return t&&t.tag&&(e=e.filter(function(e){return e.tags&&e.tags.indexOf(t.tag)>-1})),domify(posts(e))};
},{"./data-posts":7,"./meta":9,"domify":2}]},{},[6]);
