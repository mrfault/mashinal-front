(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{1525:function(e,t,r){"use strict";r.r(t);var n=r(0),c=r(1);r(32),r(3),r(2),r(42),r(41),r(8),r(7),r(10),r(4),r(11);function o(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function O(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?o(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):o(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f={asyncData:function(e){return Object(c.a)(regeneratorRuntime.mark((function t(){var r,n,c,o,filter,f;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.store,n=e.route,c=n.query,o=c.page,filter=c.filter,f=JSON.parse(filter||"{}"),t.next=5,Promise.all([r.dispatch("getBrands"),r.dispatch("getBodyOptions"),r.dispatch("getModels",n.params.brand),r.dispatch("getGenerations",n.params),r.dispatch("getCatalogSearch",{post:f,page:o,params:O({},n.params)})]);case 5:case"end":return t.stop()}}),t)})))()}},l=r(12),component=Object(l.a)(f,(function(){return(0,this._self._c)("div")}),[],!1,null,null,null);t.default=component.exports}}]);