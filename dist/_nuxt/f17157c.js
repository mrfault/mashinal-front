(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{1581:function(t,e,n){"use strict";n.r(e);var r=n(1),o=(n(35),n(27),n(32),{asyncData:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,o,c,l,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.store,n=t.$axios,r=t.$auth,o=t.route,e.next=3,r.setUserToken("Bearer ".concat(o.query.token));case 3:return e.next=5,n.$get("/user");case 5:if(e.sent.user.is_admin){e.next=8;break}return e.abrupt("return",!1);case 8:return c=o.params.access.split("_"),l=o.params.id,e.next=12,n.$get("/ticket/"+c[0]+"/"+l+"/getAccess");case 12:return data=e.sent,e.abrupt("return",{data:data,announceType:c});case 14:case"end":return e.stop()}}),e)})))()},data:function(){return{timer:5}},mounted:function(){var t=this;if(this.data.access){var e={token:this.$route.query.token};["motoatv","scooter","motorcycle"].includes(this.announceType[0])&&(e.type={motoatv:"moto_atv",scooter:"scooters",motorcycle:"moto"}[this.announceType[0]],this.announceType[0]="moto"),this.$router.push({path:"/moderator/ticket/"+this.announceType[0],query:e})}else setInterval((function(){0===t.timer?location.reload():t.timer--}),1e3)}}),c=n(12),component=Object(c.a)(o,(function(){var t=this,e=t._self._c;return e("div",{staticStyle:{"text-align":"center"}},[e("br"),e("br"),t._v(" "),t.data.access?t._e():e("span",[e("h3",[t._v(t._s(t.$t("".concat(t.data.reason))))]),t._v(" "),e("br"),e("br"),t._v("\n  "+t._s(t.timer)+" : "+t._s(t.$t("after_seconds_auto_reload_with"))+"\n ")])])}),[],!1,null,null,null);e.default=component.exports}}]);