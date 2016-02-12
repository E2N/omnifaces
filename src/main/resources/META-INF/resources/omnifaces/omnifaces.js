var OmniFaces=OmniFaces||{};
OmniFaces.Util={addOnloadListener:function(n){if("complete"===document.readyState)setTimeout(n);else if(window.addEventListener)window.addEventListener("load",n,!1);else if(window.attachEvent)window.attachEvent("onload",n);else if("function"==typeof window.onload){var o=window.onload;window.onload=function(){o(),n()}}else window.onload=n},resolveFunction:function(n){return"function"!=typeof n&&(n=window[n]||function(){}),n}};
OmniFaces.Highlight=function(e){function n(){for(var n=e.getElementsByTagName("LABEL"),t={},a=0;a<n.length;a++){var r=n[a],l=r.htmlFor;l&&(t[l]=r)}return t}function t(n){var t=e.getElementById(n);if(!t){var a=e.getElementsByName(n);a&&a.length&&(t=a[0])}return t}var a={};return a.apply=function(e,a,r){for(var l=n(),i=0;i<e.length;i++){var m=t(e[i]);if(m){m.className+=" "+a;var c=l[m.id];c&&(c.className+=" "+a),r&&(m.focus(),r=!1)}}},a}(document);
OmniFaces.DeferredScript=function(e,n){function r(e){if(!(0>e||e>=t.length)){var o=t[e],c=n.createElement("script"),a=n.head||n.documentElement;c.async=!0,c.src=o.url,c.onerror=function(){o.error()},c.onload=c.onreadystatechange=function(n,t){(t||!c.readyState||/loaded|complete/.test(c.readyState))&&(c.onload=c.onreadystatechange=null,t?c.onerror():o.success(),c=null,r(e+1))},o.begin(),a.insertBefore(c,null)}}var t=[],o={};return o.add=function(n,o,c,a){t.push({url:n,begin:e.resolveFunction(o),success:e.resolveFunction(c),error:e.resolveFunction(a)}),1==t.length&&e.addOnloadListener(function(){r(0)})},o}(OmniFaces.Util,document);
OmniFaces.Unload=function(n,e){function t(){for(var n=0;n<e.forms.length;n++){var t=e.forms[n][i];if(t)return t.value}return null}function a(n,e,t){n.addEventListener?n.addEventListener(e,t,!1):n.attachEvent&&n.attachEvent("on"+e,t)}var i="javax.faces.ViewState",o=!1,r={};return r.init=function(c){if(n.XMLHttpRequest){var u=t();u&&(a(n,"beforeunload",function(){if(o)return void(o=!1);try{var e=new XMLHttpRequest;e.open("POST",n.location.href.split(/[?#;]/)[0],!1),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send("omnifaces.event=unload&id="+c+"&"+i+"="+encodeURIComponent(u))}catch(t){}}),a(e,"submit",function(){r.disable()}))}},r.disable=function(){o=!0},r}(window,document);
OmniFaces.Push=function(n,o){function e(n,o,e,t){var i,c,r=this;r.open=function(){i&&1==i.readyState||(i=new WebSocket(n),i.onopen=function(n){c=0},i.onmessage=function(n){e(JSON.parse(n.data),o,n)},i.onclose=function(n){!i||1008==n.code||null==c||c>=s?t(n.code,o,n):setTimeout(r.open,a*c++)})},r.close=function(){if(i){var n=i;i=null,n.close()}}}function t(n){n=n||"";var e=n&&0!=n.indexOf("/")?0==n.indexOf(":")?o.location.hostname+n:n:o.location.host+n;return c+e+r+"/"}function i(n){var o=u[n];if(o)return o;throw new Error("Unknown channel: "+n)}var c=o.location.protocol.replace("http","ws")+"//",r="/omnifaces.push",a=500,s=25,u={},l={};return l.init=function(i,c,r,a,s){a=n.resolveFunction(a);var f=c.split(/\?/)[0];return o.WebSocket?(u[f]||(u[f]=new e(t(i)+c,f,n.resolveFunction(r),a)),void(s&&l.open(f))):void a(-1,f)},l.open=function(n){i(n).open()},l.close=function(n){i(n).close()},l}(OmniFaces.Util,window);