!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){(function(t){!function(t,n){n(e)}(0,function(e){"use strict";function n(t,e){if(window.NodeList.prototype.forEach)return t.forEach(e);for(var n=0;n<t.length;n++)e.call(window,t[n],n,t)}(function(t){"Window"in this||"undefined"==typeof WorkerGlobalScope&&"function"!=typeof importScripts&&function(t){t.constructor?t.Window=t.constructor:(t.Window=t.constructor=new Function("return function Window() {}")()).prototype=this}(this)}).call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),function(t){"Document"in this||"undefined"==typeof WorkerGlobalScope&&"function"!=typeof importScripts&&(this.HTMLDocument?this.Document=this.HTMLDocument:(this.Document=this.HTMLDocument=document.constructor=new Function("return function Document() {}")(),this.Document.prototype=document))}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),function(t){"Element"in this&&"HTMLElement"in this||function(){if(!window.Element||window.HTMLElement){window.Element=window.HTMLElement=new Function("return function Element() {}")();var t,e=document.appendChild(document.createElement("body")),n=e.appendChild(document.createElement("iframe")).contentWindow.document,o=Element.prototype=n.appendChild(n.createElement("*")),i={},r=function(t,e){var n,o,a,s=t.childNodes||[],c=-1;if(1===t.nodeType&&t.constructor!==Element)for(n in t.constructor=Element,i)o=i[n],t[n]=o;for(;a=e&&s[++c];)r(a,e);return t},a=document.getElementsByTagName("*"),s=document.createElement,c=100;o.attachEvent("onpropertychange",function(t){for(var e,n=t.propertyName,r=!i.hasOwnProperty(n),s=o[n],c=i[n],u=-1;e=a[++u];)1===e.nodeType&&(r||e[n]===c)&&(e[n]=s);i[n]=s}),o.constructor=Element,o.hasAttribute||(o.hasAttribute=function(t){return null!==this.getAttribute(t)}),u()||(document.onreadystatechange=u,t=setInterval(u,25)),document.createElement=function(t){var e=s(String(t).toLowerCase());return r(e)},document.removeChild(e)}else window.HTMLElement=window.Element;function u(){return c--||clearTimeout(t),!(!document.body||document.body.prototype||!/(complete|interactive)/.test(document.readyState))&&(r(document,!0),t&&document.body.prototype&&clearTimeout(t),!!document.body.prototype)}}()}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),function(t){"defineProperty"in Object&&function(){try{return Object.defineProperty({},"test",{value:42}),!0}catch(t){return!1}}()||function(t){var e=Object.prototype.hasOwnProperty("__defineGetter__"),n="A property cannot both have accessors and be writable or have a value";Object.defineProperty=function(o,i,r){if(t&&(o===window||o===document||o===Element.prototype||o instanceof Element))return t(o,i,r);if(null===o||!(o instanceof Object||"object"==typeof o))throw new TypeError("Object.defineProperty called on non-object");if(!(r instanceof Object))throw new TypeError("Property description must be an object");var a=String(i),s="value"in r||"writable"in r,c="get"in r&&typeof r.get,u="set"in r&&typeof r.set;if(c){if("function"!==c)throw new TypeError("Getter must be a function");if(!e)throw new TypeError("Getters & setters cannot be defined on this javascript engine");if(s)throw new TypeError(n);Object.__defineGetter__.call(o,a,r.get)}else o[a]=r.value;if(u){if("function"!==u)throw new TypeError("Setter must be a function");if(!e)throw new TypeError("Getters & setters cannot be defined on this javascript engine");if(s)throw new TypeError(n);Object.__defineSetter__.call(o,a,r.set)}return"value"in r&&(o[a]=r.value),o}}(Object.defineProperty)}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),function(t){(function(t){if(!("Event"in t))return!1;if("function"==typeof t.Event)return!0;try{return new Event("click"),!0}catch(t){return!1}})(this)||function(){var e={click:1,dblclick:1,keyup:1,keypress:1,keydown:1,mousedown:1,mouseup:1,mousemove:1,mouseover:1,mouseenter:1,mouseleave:1,mouseout:1,storage:1,storagecommit:1,textinput:1};if("undefined"!=typeof document&&"undefined"!=typeof window){var n=window.Event&&window.Event.prototype||null;window.Event=Window.prototype.Event=function(e,n){if(!e)throw new Error("Not enough arguments");var o;if("createEvent"in document){o=document.createEvent("Event");var i=!(!n||n.bubbles===t)&&n.bubbles,r=!(!n||n.cancelable===t)&&n.cancelable;return o.initEvent(e,i,r),o}return(o=document.createEventObject()).type=e,o.bubbles=!(!n||n.bubbles===t)&&n.bubbles,o.cancelable=!(!n||n.cancelable===t)&&n.cancelable,o},n&&Object.defineProperty(window.Event,"prototype",{configurable:!1,enumerable:!1,writable:!0,value:n}),"createEvent"in document||(window.addEventListener=Window.prototype.addEventListener=Document.prototype.addEventListener=Element.prototype.addEventListener=function(){var t=this,n=arguments[0],i=arguments[1];if(t===window&&n in e)throw new Error("In IE8 the event: "+n+" is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.");t._events||(t._events={}),t._events[n]||(t._events[n]=function(e){var n,i=t._events[e.type].list,r=i.slice(),a=-1,s=r.length;for(e.preventDefault=function(){!1!==e.cancelable&&(e.returnValue=!1)},e.stopPropagation=function(){e.cancelBubble=!0},e.stopImmediatePropagation=function(){e.cancelBubble=!0,e.cancelImmediate=!0},e.currentTarget=t,e.relatedTarget=e.fromElement||null,e.target=e.target||e.srcElement||t,e.timeStamp=(new Date).getTime(),e.clientX&&(e.pageX=e.clientX+document.documentElement.scrollLeft,e.pageY=e.clientY+document.documentElement.scrollTop);++a<s&&!e.cancelImmediate;)a in r&&-1!==o(i,n=r[a])&&"function"==typeof n&&n.call(t,e)},t._events[n].list=[],t.attachEvent&&t.attachEvent("on"+n,t._events[n])),t._events[n].list.push(i)},window.removeEventListener=Window.prototype.removeEventListener=Document.prototype.removeEventListener=Element.prototype.removeEventListener=function(){var t,e=arguments[0],n=arguments[1];this._events&&this._events[e]&&this._events[e].list&&-1!==(t=o(this._events[e].list,n))&&(this._events[e].list.splice(t,1),this._events[e].list.length||(this.detachEvent&&this.detachEvent("on"+e,this._events[e]),delete this._events[e]))},window.dispatchEvent=Window.prototype.dispatchEvent=Document.prototype.dispatchEvent=Element.prototype.dispatchEvent=function(t){if(!arguments.length)throw new Error("Not enough arguments");if(!t||"string"!=typeof t.type)throw new Error("DOM Events Exception 0");var e=this,n=t.type;try{if(!t.bubbles){t.cancelBubble=!0;var o=function(t){t.cancelBubble=!0,(e||window).detachEvent("on"+n,o)};this.attachEvent("on"+n,o)}this.fireEvent("on"+n,t)}catch(o){t.target=e;do{t.currentTarget=e,"_events"in e&&"function"==typeof e._events[n]&&e._events[n].call(e,t),"function"==typeof e["on"+n]&&e["on"+n].call(e,t),e=9===e.nodeType?e.parentWindow:e.parentNode}while(e&&!t.cancelBubble)}return!0},document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&document.dispatchEvent(new Event("DOMContentLoaded",{bubbles:!0}))}))}function o(t,e){for(var n=-1,o=t.length;++n<o;)if(n in t&&t[n]===e)return n;return-1}}()}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{});function o(t){this.$module=t}o.prototype.handleKeyDown=function(t){var e=t.target;"button"===e.getAttribute("role")&&32===t.keyCode&&(t.preventDefault(),e.click())},o.prototype.init=function(){this.$module.addEventListener("keydown",this.handleKeyDown)},function(t){"bind"in Function.prototype||Object.defineProperty(Function.prototype,"bind",{value:function(t){var e,n=Array,o=Object,i=o.prototype,r=n.prototype,a=function(){},s=i.toString,c="function"==typeof Symbol&&"symbol"==typeof Symbol.toStringTag,u=Function.prototype.toString;e=function(t){if("function"!=typeof t)return!1;if(c)return function(t){try{return u.call(t),!0}catch(t){return!1}}(t);var e=s.call(t);return"[object Function]"===e||"[object GeneratorFunction]"===e};var l=r.slice,d=r.concat,h=r.push,p=Math.max,f=this;if(!e(f))throw new TypeError("Function.prototype.bind called on incompatible "+f);for(var b,m=l.call(arguments,1),y=p(0,f.length-m.length),v=[],g=0;g<y;g++)h.call(v,"$"+g);return b=Function("binder","return function ("+v.join(",")+"){ return binder.apply(this, arguments); }")(function(){if(this instanceof b){var e=f.apply(this,d.call(m,l.call(arguments)));return o(e)===e?e:this}return f.apply(t,d.call(m,l.call(arguments)))}),f.prototype&&(a.prototype=f.prototype,b.prototype=new a,a.prototype=null),b}})}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{});var i="boolean"==typeof document.createElement("details").open;function r(t){this.$module=t}function a(t){this.$module=t,this.$textarea=t.querySelector(".js-character-count")}function s(t){this.$module=t,this.$inputs=t.querySelectorAll('input[type="checkbox"]')}function c(t){this.$module=t}function u(t){this.$module=t}function l(t){this.$module=t,this.$inputs=t.querySelectorAll('input[type="radio"]')}function d(t){this.$module=t,this.$tabs=t.querySelectorAll(".govuk-tabs__tab"),this.keys={left:37,right:39,up:38,down:40},this.jsHiddenClass="govuk-tabs__panel--hidden"}r.prototype.handleInputs=function(t,e){t.addEventListener("keypress",function(t){var n=t.target;13!==t.keyCode&&32!==t.keyCode||"summary"===n.nodeName.toLowerCase()&&(t.preventDefault(),n.click?n.click():e(t))}),t.addEventListener("keyup",function(t){var e=t.target;32===t.keyCode&&"summary"===e.nodeName.toLowerCase()&&t.preventDefault()}),t.addEventListener("click",e)},r.prototype.init=function(){var t=this.$module;if(t){var e=this.$summary=t.getElementsByTagName("summary").item(0),n=this.$content=t.getElementsByTagName("div").item(0);if(e&&n)n.id||(n.id="details-content-"+function(){var t=(new Date).getTime();return void 0!==window.performance&&"function"==typeof window.performance.now&&(t+=window.performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var n=(t+16*Math.random())%16|0;return t=Math.floor(t/16),("x"===e?n:3&n|8).toString(16)})}()),t.setAttribute("role","group"),e.setAttribute("role","button"),e.setAttribute("aria-controls",n.id),i||(e.tabIndex=0),!0===(null!==t.getAttribute("open"))?(e.setAttribute("aria-expanded","true"),n.setAttribute("aria-hidden","false")):(e.setAttribute("aria-expanded","false"),n.setAttribute("aria-hidden","true"),i||(n.style.display="none")),this.handleInputs(e,this.setAttributes.bind(this))}},r.prototype.setAttributes=function(){var t=this.$module,e=this.$summary,n=this.$content,o="true"===e.getAttribute("aria-expanded"),r="true"===n.getAttribute("aria-hidden");(e.setAttribute("aria-expanded",o?"false":"true"),n.setAttribute("aria-hidden",r?"false":"true"),i)||(n.style.display=o?"none":"",null!==t.getAttribute("open")?t.removeAttribute("open"):t.setAttribute("open","open"));return!0},r.prototype.destroy=function(t){t.removeEventListener("keypress"),t.removeEventListener("keyup"),t.removeEventListener("click")},function(t){"DOMTokenList"in this&&function(t){return!("classList"in t)||!t.classList.toggle("x",!1)&&!t.className}(document.createElement("x"))||function(e){"DOMTokenList"in e&&e.DOMTokenList&&(!document.createElementNS||!document.createElementNS("http://www.w3.org/2000/svg","svg")||document.createElementNS("http://www.w3.org/2000/svg","svg").classList instanceof DOMTokenList)||(e.DOMTokenList=function(){var e=!0,n=function(t,n,o,i){Object.defineProperty?Object.defineProperty(t,n,{configurable:!1===e||!!i,get:o}):t.__defineGetter__(n,o)};try{n({},"support")}catch(t){e=!1}return function(e,o){var i=this,r=[],a={},s=0,c=0,u=function(t){n(i,t,function(){return d(),r[t]},!1)},l=function(){if(s>=c)for(;c<s;++c)u(c)},d=function(){var t,n,i=arguments,c=/\s+/;if(i.length)for(n=0;n<i.length;++n)if(c.test(i[n]))throw(t=new SyntaxError('String "'+i[n]+'" contains an invalid character')).code=5,t.name="InvalidCharacterError",t;for(""===(r="object"==typeof e[o]?(""+e[o].baseVal).replace(/^\s+|\s+$/g,"").split(c):(""+e[o]).replace(/^\s+|\s+$/g,"").split(c))[0]&&(r=[]),a={},n=0;n<r.length;++n)a[r[n]]=!0;s=r.length,l()};return d(),n(i,"length",function(){return d(),s}),i.toLocaleString=i.toString=function(){return d(),r.join(" ")},i.item=function(t){return d(),r[t]},i.contains=function(t){return d(),!!a[t]},i.add=function(){d.apply(i,t=arguments);for(var t,n,c=0,u=t.length;c<u;++c)n=t[c],a[n]||(r.push(n),a[n]=!0);s!==r.length&&(s=r.length>>>0,"object"==typeof e[o]?e[o].baseVal=r.join(" "):e[o]=r.join(" "),l())},i.remove=function(){d.apply(i,t=arguments);for(var t,n={},c=0,u=[];c<t.length;++c)n[t[c]]=!0,delete a[t[c]];for(c=0;c<r.length;++c)n[r[c]]||u.push(r[c]);r=u,s=u.length>>>0,"object"==typeof e[o]?e[o].baseVal=r.join(" "):e[o]=r.join(" "),l()},i.toggle=function(e,n){return d.apply(i,[e]),t!==n?n?(i.add(e),!0):(i.remove(e),!1):a[e]?(i.remove(e),!1):(i.add(e),!0)},i}}()),function(){var e=document.createElement("span");"classList"in e&&(e.classList.toggle("x",!1),e.classList.contains("x")&&(e.classList.constructor.prototype.toggle=function(e){var n=arguments[1];if(n===t){var o=!this.contains(e);return this[o?"add":"remove"](e),o}return this[(n=!!n)?"add":"remove"](e),n}))}(),function(){var t=document.createElement("span");if("classList"in t&&(t.classList.add("a","b"),!t.classList.contains("b"))){var e=t.classList.constructor.prototype.add;t.classList.constructor.prototype.add=function(){for(var t=arguments,n=arguments.length,o=0;o<n;o++)e.call(this,t[o])}}}(),function(){var t=document.createElement("span");if("classList"in t&&(t.classList.add("a"),t.classList.add("b"),t.classList.remove("a","b"),t.classList.contains("b"))){var e=t.classList.constructor.prototype.remove;t.classList.constructor.prototype.remove=function(){for(var t=arguments,n=arguments.length,o=0;o<n;o++)e.call(this,t[o])}}}()}(this)}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),function(t){"document"in this&&"classList"in document.documentElement&&"Element"in this&&"classList"in Element.prototype&&function(){var t=document.createElement("span");return t.classList.add("a","b"),t.classList.contains("b")}()||function(t){var e=!0,n=function(t,n,o,i){Object.defineProperty?Object.defineProperty(t,n,{configurable:!1===e||!!i,get:o}):t.__defineGetter__(n,o)};try{n({},"support")}catch(t){e=!1}var o=function(t,i,r){n(t.prototype,i,function(){var t,a="__defineGetter__DEFINE_PROPERTY"+i;if(this[a])return t;if(this[a]=!0,!1===e){for(var s,c=o.mirror||document.createElement("div"),u=c.childNodes,l=u.length,d=0;d<l;++d)if(u[d]._R===this){s=u[d];break}s||(s=c.appendChild(document.createElement("div"))),t=DOMTokenList.call(s,this,r)}else t=new DOMTokenList(this,r);return n(this,i,function(){return t}),delete this[a],t},!0)};o(t.Element,"classList","className"),o(t.HTMLElement,"classList","className"),o(t.HTMLLinkElement,"relList","rel"),o(t.HTMLAnchorElement,"relList","rel"),o(t.HTMLAreaElement,"relList","rel")}(this)}.call("object"==typeof window&&window||"object"==typeof self&&self||"object"==typeof t&&t||{}),a.prototype.defaults={characterCountAttribute:"data-maxlength",wordCountAttribute:"data-maxwords"},a.prototype.init=function(){var t=this.$module;if(this.$textarea){this.options=this.getDataset(t);var e=this.defaults.characterCountAttribute;if(this.options.maxwords&&(e=this.defaults.wordCountAttribute),this.maxLength=t.getAttribute(e),this.maxLength){var n=this.createCountMessage.bind(this);if(this.countMessage=n(),this.countMessage)t.removeAttribute("maxlength"),this.bindChangeEvents.bind(this)(),this.updateCountMessage.bind(this)()}}},a.prototype.getDataset=function(t){var e={},n=t.attributes;if(n)for(var o=0;o<n.length;o++){var i=n[o],r=i.name.match(/^data-(.+)/);r&&(e[r[1]]=i.value)}return e},a.prototype.count=function(t){var e;this.options.maxwords?e=(t.match(/\S+/g)||[]).length:e=t.length;return e},a.prototype.createCountMessage=function(){var t=this.$textarea,e=t.id,n=document.getElementById(e+"-info");return e&&!n?(t.insertAdjacentHTML("afterend",'<span id="'+e+'-info" class="govuk-hint govuk-character-count__message" aria-live="polite"></span>'),this.describedBy=t.getAttribute("aria-describedby"),this.describedByInfo=this.describedBy+" "+e+"-info",t.setAttribute("aria-describedby",this.describedByInfo),n=document.getElementById(e+"-info")):t.insertAdjacentElement("afterend",n),n},a.prototype.bindChangeEvents=function(){var t=this.$textarea;t.addEventListener("keyup",this.checkIfValueChanged.bind(this)),t.addEventListener("focus",this.handleFocus.bind(this)),t.addEventListener("blur",this.handleBlur.bind(this))},a.prototype.checkIfValueChanged=function(){(this.$textarea.oldValue||(this.$textarea.oldValue=""),this.$textarea.value!==this.$textarea.oldValue)&&(this.$textarea.oldValue=this.$textarea.value,this.updateCountMessage.bind(this)())},a.prototype.updateCountMessage=function(){var t=this.$textarea,e=this.options,n=this.countMessage,o=this.count(t.value),i=this.maxLength,r=i-o;i*(e.threshold?e.threshold:0)/100>o?n.classList.add("govuk-character-count__message--disabled"):n.classList.remove("govuk-character-count__message--disabled"),r<0?(t.classList.add("govuk-textarea--error"),n.classList.remove("govuk-hint"),n.classList.add("govuk-error-message")):(t.classList.remove("govuk-textarea--error"),n.classList.remove("govuk-error-message"),n.classList.add("govuk-hint"));var a,s,c="character";e.maxwords&&(c="word"),c+=-1===r||1===r?"":"s",a=r<0?"too many":"remaining",s=Math.abs(r),n.innerHTML="You have "+s+" "+c+" "+a},a.prototype.handleFocus=function(){this.valueChecker=setInterval(this.checkIfValueChanged.bind(this),1e3)},a.prototype.handleBlur=function(){clearInterval(this.valueChecker)},s.prototype.init=function(){var t=this.$module;n(this.$inputs,function(e){var n=e.getAttribute("data-aria-controls");n&&t.querySelector("#"+n)&&(e.setAttribute("aria-controls",n),e.removeAttribute("data-aria-controls"),this.setAttributes(e))}.bind(this)),t.addEventListener("click",this.handleClick.bind(this))},s.prototype.setAttributes=function(t){var e=t.checked;t.setAttribute("aria-expanded",e),document.querySelector("#"+t.getAttribute("aria-controls")).classList.toggle("govuk-checkboxes__conditional--hidden",!e)},s.prototype.handleClick=function(t){var e=t.target,n="checkbox"===e.getAttribute("type"),o=e.getAttribute("aria-controls");n&&o&&this.setAttributes(e)},c.prototype.init=function(){var t=this.$module;t&&window.addEventListener("load",function(){t.focus()})},u.prototype.init=function(){var t=this.$module;if(t){var e=t.querySelector(".js-header-toggle");e&&e.addEventListener("click",this.handleClick.bind(this))}},u.prototype.toggleClass=function(t,e){t.className.indexOf(e)>0?t.className=t.className.replace(" "+e,""):t.className+=" "+e},u.prototype.handleClick=function(t){var e=this.$module,n=t.target||t.srcElement,o=e.querySelector("#"+n.getAttribute("aria-controls"));n&&o&&(this.toggleClass(o,"govuk-header__navigation--open"),this.toggleClass(n,"govuk-header__menu-button--open"),n.setAttribute("aria-expanded","true"!==n.getAttribute("aria-expanded")),o.setAttribute("aria-hidden","false"===o.getAttribute("aria-hidden")))},l.prototype.init=function(){var t=this.$module;n(this.$inputs,function(e){var n=e.getAttribute("data-aria-controls");n&&t.querySelector("#"+n)&&(e.setAttribute("aria-controls",n),e.removeAttribute("data-aria-controls"),this.setAttributes(e))}.bind(this)),t.addEventListener("click",this.handleClick.bind(this))},l.prototype.setAttributes=function(t){var e=t.checked;t.setAttribute("aria-expanded",e),document.querySelector("#"+t.getAttribute("aria-controls")).classList.toggle("govuk-radios__conditional--hidden",!e)},l.prototype.handleClick=function(t){n(this.$inputs,function(t){var e="radio"===t.getAttribute("type"),n=t.getAttribute("aria-controls");e&&n&&this.setAttributes(t)}.bind(this))},d.prototype.init=function(){"function"==typeof window.matchMedia?this.setupResponsiveChecks():this.setup()},d.prototype.setupResponsiveChecks=function(){this.mql=window.matchMedia("(min-width: 40.0625em)"),this.mql.addListener(this.checkMode.bind(this)),this.checkMode()},d.prototype.checkMode=function(){this.mql.matches?this.setup():this.teardown()},d.prototype.setup=function(){var t=this.$module,e=this.$tabs,o=t.querySelector(".govuk-tabs__list"),i=t.querySelectorAll(".govuk-tabs__list-item");if(e&&o&&i){o.setAttribute("role","tablist"),n(i,function(t){t.setAttribute("role","presentation")}),n(e,function(t){this.setAttributes(t),t.boundTabClick=this.onTabClick.bind(this),t.boundTabKeydown=this.onTabKeydown.bind(this),t.addEventListener("click",t.boundTabClick,!0),t.addEventListener("keydown",t.boundTabKeydown,!0),this.hideTab(t)}.bind(this));var r=this.getTab(window.location.hash)||this.$tabs[0];this.showTab(r),t.boundOnHashChange=this.onHashChange.bind(this),window.addEventListener("hashchange",t.boundOnHashChange,!0)}},d.prototype.teardown=function(){var t=this.$module,e=this.$tabs,o=t.querySelector(".govuk-tabs__list"),i=t.querySelectorAll(".govuk-tabs__list-item");e&&o&&i&&(o.removeAttribute("role"),n(i,function(t){t.removeAttribute("role","presentation")}),n(e,function(t){t.removeEventListener("click",t.boundTabClick,!0),t.removeEventListener("keydown",t.boundTabKeydown,!0),this.unsetAttributes(t)}.bind(this)),window.removeEventListener("hashchange",t.boundOnHashChange,!0))},d.prototype.onHashChange=function(t){var e=window.location.hash;if(this.hasTab(e))if(this.changingHash)this.changingHash=!1;else{var n=this.getCurrentTab(),o=this.getTab(e)||this.$tabs[0];this.hideTab(n),this.showTab(o),o.focus()}},d.prototype.hasTab=function(t){return this.$module.querySelector(t)},d.prototype.hideTab=function(t){this.unhighlightTab(t),this.hidePanel(t)},d.prototype.showTab=function(t){this.highlightTab(t),this.showPanel(t)},d.prototype.getTab=function(t){return this.$module.querySelector('a[role="tab"][href="'+t+'"]')},d.prototype.setAttributes=function(t){var e=this.getHref(t).slice(1);t.setAttribute("id","tab_"+e),t.setAttribute("role","tab"),t.setAttribute("aria-controls",e),t.setAttribute("tabindex","-1");var n=this.getPanel(t);n.setAttribute("role","tabpanel"),n.setAttribute("aria-labelledby",t.id),n.classList.add(this.jsHiddenClass)},d.prototype.unsetAttributes=function(t){t.removeAttribute("id"),t.removeAttribute("role"),t.removeAttribute("aria-controls"),t.removeAttribute("tabindex");var e=this.getPanel(t);e.removeAttribute("role"),e.removeAttribute("aria-labelledby"),e.classList.remove(this.jsHiddenClass)},d.prototype.onTabClick=function(t){t.preventDefault();var e=t.target,n=this.getCurrentTab();this.hideTab(n),this.showTab(e),this.createHistoryEntry(e)},d.prototype.createHistoryEntry=function(t){var e=this.getPanel(t),n=e.id;e.id="",this.changingHash=!0,window.location.hash=this.getHref(t).slice(1),e.id=n},d.prototype.onTabKeydown=function(t){switch(t.keyCode){case this.keys.left:case this.keys.up:this.activatePreviousTab(),t.preventDefault();break;case this.keys.right:case this.keys.down:this.activateNextTab(),t.preventDefault()}},d.prototype.activateNextTab=function(){var t=this.getCurrentTab(),e=t.parentNode.nextElementSibling;if(e)var n=e.firstElementChild;n&&(this.hideTab(t),this.showTab(n),n.focus(),this.createHistoryEntry(n))},d.prototype.activatePreviousTab=function(){var t=this.getCurrentTab(),e=t.parentNode.previousElementSibling;if(e)var n=e.firstElementChild;n&&(this.hideTab(t),this.showTab(n),n.focus(),this.createHistoryEntry(n))},d.prototype.getPanel=function(t){return this.$module.querySelector(this.getHref(t))},d.prototype.showPanel=function(t){this.getPanel(t).classList.remove(this.jsHiddenClass)},d.prototype.hidePanel=function(t){this.getPanel(t).classList.add(this.jsHiddenClass)},d.prototype.unhighlightTab=function(t){t.setAttribute("aria-selected","false"),t.classList.remove("govuk-tabs__tab--selected"),t.setAttribute("tabindex","-1")},d.prototype.highlightTab=function(t){t.setAttribute("aria-selected","true"),t.classList.add("govuk-tabs__tab--selected"),t.setAttribute("tabindex","0")},d.prototype.getCurrentTab=function(){return this.$module.querySelector(".govuk-tabs__tab--selected")},d.prototype.getHref=function(t){var e=t.getAttribute("href");return e.slice(e.indexOf("#"),e.length)},e.initAll=function(){new o(document).init(),n(document.querySelectorAll("details"),function(t){new r(t).init()}),n(document.querySelectorAll('[data-module="character-count"]'),function(t){new a(t).init()}),n(document.querySelectorAll('[data-module="checkboxes"]'),function(t){new s(t).init()}),new c(document.querySelector('[data-module="error-summary"]')).init(),new u(document.querySelector('[data-module="header"]')).init(),n(document.querySelectorAll('[data-module="radios"]'),function(t){new l(t).init()}),n(document.querySelectorAll('[data-module="tabs"]'),function(t){new d(t).init()})},e.Button=o,e.Details=r,e.CharacterCount=a,e.Checkboxes=s,e.ErrorSummary=c,e.Header=u,e.Radios=l,e.Tabs=d})}).call(this,n(1))},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){(function(){"use strict";var t=this;void 0===t.GOVUK&&(t.GOVUK={}),t.GOVUK.cookie=function(e,n,o){return void 0!==n?!1===n||null===n?t.GOVUK.setCookie(e,"",{days:-1}):t.GOVUK.setCookie(e,n,o):t.GOVUK.getCookie(e)},t.GOVUK.setCookie=function(t,e,n){void 0===n&&(n={});var o=t+"="+e+"; path=/";if(n.days){var i=new Date;i.setTime(i.getTime()+24*n.days*60*60*1e3),o=o+"; expires="+i.toGMTString()}"https:"===document.location.protocol&&(o+="; Secure"),document.cookie=o},t.GOVUK.getCookie=function(t){for(var e=t+"=",n=document.cookie.split(";"),o=0,i=n.length;o<i;o++){for(var r=n[o];" "===r.charAt(0);)r=r.substring(1,r.length);if(0===r.indexOf(e))return decodeURIComponent(r.substring(e.length))}return null},t.GOVUK.addCookieMessage=function(){var e=document.querySelector(".js-cookie-banner");e&&null===t.GOVUK.cookie("seen_cookie_message")&&(e.style.display="block",t.GOVUK.cookie("seen_cookie_message","yes",{days:28}))},t.GOVUK&&t.GOVUK.addCookieMessage&&t.GOVUK.addCookieMessage()}).call(window)},function(t,e,n){"use strict";n.r(e);var o=n(0);Object(o.initAll)();n(2)}]);
//# sourceMappingURL=main.js.map