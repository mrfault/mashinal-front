(window.webpackJsonp=window.webpackJsonp||[]).push([[102],{1010:function(t,e,n){var content=n(1026);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("59c956cd",content,!0,{sourceMap:!1})},1025:function(t,e,n){"use strict";n(1010)},1026:function(t,e,n){var r=n(38)((function(i){return i[1]}));r.push([t.i,".comeBack[data-v-ef9a5fea]{align-items:center;background-color:#fff;border-radius:4px;display:flex;height:58px;margin:20px 0;padding:0 20px;width:100%}.comeBack i[data-v-ef9a5fea]:before{font-size:15px}.comeBack__text[data-v-ef9a5fea]{color:#081a3e;font-size:15px;font-weight:500;line-height:18px;margin:0 22px}.comeBack__line[data-v-ef9a5fea]{background-color:#081a3e;border-radius:100px;height:1px;width:100%}.dark-mode .comeBack[data-v-ef9a5fea]{background-color:#242426}.dark-mode .comeBack__text[data-v-ef9a5fea]{color:#fff}.dark-mode .comeBack__line[data-v-ef9a5fea]{background-color:#fff}",""]),r.locals={},t.exports=r},1028:function(t,e,n){"use strict";var r={props:{text:{type:String,default:"Text"}}},o=(n(1025),n(12)),component=Object(o.a)(r,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"comeBack",on:{click:function(e){return t.$router.go(-1)}}},[e("icon",{attrs:{name:"chevron-left"}}),t._v(" "),e("span",{staticClass:"comeBack__text"},[t._v(t._s(t.text))]),t._v(" "),e("span",{staticClass:"comeBack__line"})],1)}),[],!1,null,"ef9a5fea",null);e.a=component.exports},1250:function(t,e,n){var content=n(1396);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("0963e422",content,!0,{sourceMap:!1})},1395:function(t,e,n){"use strict";n(1250)},1396:function(t,e,n){var r=n(38)((function(i){return i[1]}));r.push([t.i,".btn-custom-border{border:1px solid rgba(36,110,178,.2)}",""]),r.locals={},t.exports=r},1554:function(t,e,n){"use strict";n.r(e);n(27),n(8),n(7),n(3),n(10),n(4),n(11);var r=n(0),o=n(1),c=(n(32),n(2),n(42),n(41),n(35),n(14),n(21),n(16)),l=n(1197),_=n(990),m=n(1028);function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var f={name:"pages-profile-balance",middleware:"auth_general",mixins:[_.a],layout:"garageLayout",components:{ComeBack:m.a,BankingCards:l.a},nuxtI18n:{paths:{az:"/profil/balans-old"}},beforeDestroy:function(){this.mutate({property:"temporaryLazyData",value:{}})},head:function(){return this.$headMeta({title:this.$t("balans")})},data:function(){return{activeFilter:0,refreshInfinity:0}},asyncData:function(t){return Object(o.a)(regeneratorRuntime.mark((function e(){var n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.store,r=t.app,o=t.$auth,e.next=3,Promise.all([n.dispatch("getMyBalanceHistory"),n.dispatch("bankingCards/getBankingCards"),o.fetchUser()]);case 3:return e.abrupt("return",{pending:!1,minAmount:r.$env.DEV?.01:1,form:{money:""}});case 4:case"end":return e.stop()}}),e)})))()},computed:v(v(v({},Object(c.e)(["balanceHasAnimation"])),Object(c.c)(["myBalanceHistory"])),{},{crumbs:function(){return[{name:this.$t("dashboard"),route:"".concat(this.user.autosalon?"/dashboard/1":"/garage-services")},{name:this.$t("balans")}]},totalBalance:function(){var t,e,n;return this.$sum(this.user.balance,(null===(t=this.user.autosalon)||void 0===t?void 0:t.balance)||0,(null===(e=this.user.part_salon)||void 0===e?void 0:e.balance)||0,(null===(n=this.user.external_salon)||void 0===n?void 0:n.balance)||0)}}),methods:{filterHistory:function(t){this.activeFilter=t,this.mutate({property:"temporaryLazyData",value:{}}),this.refreshInfinity++,this.$store.dispatch("getMyBalanceHistory",{page:1,type:t})},increaseBalance:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t.pending||t.form.money<t.minAmount)){e.next=2;break}return e.abrupt("return");case 2:return t.pending=!0,e.prev=3,e.next=6,t.$axios.$post("/payment/addBalance?is_mobile=".concat(t.isMobileBreakpoint),v(v({},t.form),{},{card_id:t.bankingCard}));case 6:if(null!=(r=e.sent)&&null!==(n=r.data)&&void 0!==n&&n.redirect_url){e.next=14;break}return e.next=10,t.$nuxt.refresh();case 10:t.updatePaidStatus({type:"success",text:t.$t("balance_increased"),title:t.$t("success_payment")}),t.pending=!1,e.next=17;break;case 14:t.pending=!1,t.form.money="",t.handlePayment(r,!1,t.$t("balance_increased"));case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(3),t.pending=!1;case 22:case"end":return e.stop()}}),e,null,[[3,19]])})))()},removeAnimationbalanceIncrement:function(){var t=this;setTimeout((function(){t.$store.commit("mutate",{property:"balanceHasAnimation",value:!1})}),1e3)}},mounted:function(){var t=this;this.$nextTick((function(){if(t.$route.query.scrollto){var e=t.$refs[t.$route.query.scrollto];t.$router.replace({query:null}),e&&setTimeout((function(){var n,r;t.scrollTo(e,[-15,-20]),e.classList.add("underline"),setTimeout((function(){e.classList.remove("underline")}),2e3),null===(n=t.$el)||void 0===n||null===(r=n.querySelector(".text-input input"))||void 0===r||r.focus()}),300)}})),this.removeAnimationbalanceIncrement()}},h=(n(1395),n(12)),component=Object(h.a)(f,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"pages-profile-balance"},[e("div",{staticClass:"container"},[e("portal",{attrs:{to:"breadcrumbs"}},[e("breadcrumbs",{attrs:{crumbs:t.crumbs}})],1),t._v(" "),e(t.isMobileBreakpoint?"mobile-screen":"div",{tag:"component",attrs:{"bar-title":t.$t("my_balance"),"height-auto":""},on:{back:function(e){t.$router.push(t.pageRef||t.$localePath("/profile/balance"))}}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-lg-4"},[e("div",{staticClass:"card mb-2 mb-lg-3"},[t.isMobileBreakpoint?e("h2",{staticClass:"title-with-line mt-n1 mb-n1"},[e("span",[t._v(t._s(t.$t("wallet_balance")))])]):t._e(),t._v(" "),e("div",{staticClass:"increase-balance-info"},[e("icon",{staticClass:"mb-2",attrs:{name:"wallet"}}),t._v(" "),e("strong",{staticClass:"mb-1"},[t._v("\n                        "+t._s(t.$readNumber(t.totalBalance))+" ALManat\n                     ")]),t._v(" "),t.isMobileBreakpoint?t._e():e("p",[t._v(t._s(t.$t("wallet_balance")))]),t._v(" "),t.user.autosalon||t.user.part_salon||t.user.external_salon?[e("hr"),t._v(" "),e("div",{staticClass:"row justify-content-center"},[e("div",{staticClass:"col-12 text-medium mb-1"},[t._v("\n                              "+t._s(t.$t("is_main"))+": "+t._s(t.$readNumber(t.user.balance))+" ALM\n                           ")]),t._v(" "),t.user.autosalon?e("div",{staticClass:"col-auto text-medium"},[t._v("\n                              "+t._s(t.$t("salon"))+":\n                              "+t._s(t.$readNumber(t.user.autosalon.balance))+" ALM\n                           ")]):t._e(),t._v(" "),t.user.part_salon?e("div",{staticClass:"col-auto text-medium"},[t._v("\n                              "+t._s(t.$t("shop"))+":\n                              "+t._s(t.$readNumber(t.user.part_salon.balance))+" ALM\n                           ")]):t._e(),t._v(" "),t.user.external_salon?e("div",{staticClass:"col-auto text-medium"},[t._v("\n                              "+t._s(t.$t("salon"))+":\n                              "+t._s(t.$readNumber(t.user.external_salon.balance))+" ALM\n                           ")]):t._e()])]:t._e()],2)]),t._v(" "),e("div",{ref:"increase",staticClass:"mb-2 mb-lg-0",attrs:{id:"increasebalance"}},[e("div",{staticClass:"card increase-balance-form",class:{"increase-balance-animation":t.balanceHasAnimation}},[e("form",{staticClass:"form",attrs:{novalidate:""},on:{submit:function(e){return e.preventDefault(),t.increaseBalance.apply(null,arguments)}}},[e("h2",{staticClass:"title-with-line"},[e("span",[t._v(t._s(t.$t("replenishment")))])]),t._v(" "),e("div",{staticClass:"mb-2 mb-lg-3"},[e("form-text-input",{attrs:{type:"number",placeholder:t.$t("payment_amount")},model:{value:t.form.money,callback:function(e){t.$set(t.form,"money",e)},expression:"form.money"}}),t._v(" "),t.bankingCards.length?e("select-banking-card",{staticClass:"mt-2 mt-lg-3",attrs:{"show-card-image":!1,value:t.bankingCard},on:{input:function(e){t.bankingCard=e}}}):t._e()],1),t._v(" "),e("p",[t._v("* "+t._s(t.$t("enter_the_amount_in_azn",{min:t.minAmount})))]),t._v(" "),e("hr"),t._v(" "),e("button",{class:["btn btn--green full-width",{pending:t.pending,disabled:t.form.money<this.minAmount}],attrs:{type:"submit"}},[t._v("\n                           "+t._s(t.$t("replenish"))+"\n                        ")])])]),t._v(" "),e("div",[e("banking-cards")],1)])]),t._v(" "),e("div",{staticClass:"col-lg-8"},[t.isMobileBreakpoint?t._e():e("div",{staticClass:"card mb-2 mb-lg-3"},[e("div",{staticClass:"payment-history-rows"},[e("div",{staticClass:"row less-cols head justify-content-between flex-nowrap"},[e("span",{staticClass:"payment-service"},[e("span",[t._v(t._s(t.$t("transaction")))])]),t._v(" "),e("span",{staticClass:"payment-price"},[e("span",[t._v(t._s(t.$t("payment_amount")))])]),t._v(" "),e("span",{staticClass:"payment-date"},[e("span",[t._v(t._s(t.$t("date")))])])])])]),t._v(" "),e("div",{staticClass:"card"},[e("div",{staticClass:"payment-history-rows"},[e("div",{key:0,class:["payment-history-info",{"mb-2 mb-lg-4":t.myBalanceHistory.data.length}]},[t.isMobileBreakpoint?t._e():[t.myBalanceHistory.data.length?e("button",{staticClass:"btn btn--grey pointer-events-none"},[e("icon",{attrs:{name:"refresh"}}),t._v("\n                              "+t._s(t.$moment(t.myBalanceHistory.data[0].created_at).format("DD.MM.YYYY"))+"\n                           ")],1):t._e(),t._v(" "),e("div",{staticClass:"mt-2"},[e("button",{staticClass:"btn btn-custom-border mr-2",class:{"btn--dark-blue-2":0===t.activeFilter,"btn--dark-blue-2-outline":0!==t.activeFilter},on:{click:function(e){return t.filterHistory(0)}}},[t._v("\n                                 "+t._s(t.$t("all"))+"\n                              ")]),t._v(" "),e("button",{staticClass:"btn btn-custom-border mr-2",class:{"btn--dark-blue-2":1===t.activeFilter,"btn--dark-blue-2-outline":1!==t.activeFilter},on:{click:function(e){return t.filterHistory(1)}}},[t._v("\n                                 "+t._s(t.$t("last_one_week"))+"\n                              ")]),t._v(" "),e("button",{staticClass:"btn btn-custom-border mr-2",class:{"btn--dark-blue-2":2===t.activeFilter,"btn--dark-blue-2-outline":2!==t.activeFilter},on:{click:function(e){return t.filterHistory(2)}}},[t._v("\n                                 "+t._s(t.$t("last_month"))+"\n                              ")]),t._v(" "),e("button",{staticClass:"btn btn-custom-border",class:{"btn--dark-blue-2":3===t.activeFilter,"btn--dark-blue-2-outline":3!==t.activeFilter},on:{click:function(e){return t.filterHistory(3)}}},[t._v("\n                                 "+t._s(t.$t("last_6_month"))+"\n                              ")])])],t._v(" "),t.myBalanceHistory.data.length?t._e():[e("div",{staticClass:"not-found",staticStyle:{padding:"215px 0"}},[e("img",{attrs:{src:"/img/no_transactions.png"}}),t._v(" "),e("span",{staticClass:"d-block text-left mt-2 mb-3 mb-lg-0"},[t._v("\n                               "+t._s(t.$t("no_payments_yet"))+"\n                              ")])])]],2),t._v(" "),t._l(t.myBalanceHistory.data,(function(n,i){return e("div",{key:i+1,staticClass:"row less-cols justify-content-between flex-nowrap"},[e("span",{staticClass:"payment-service"},[e("span",[t._v(t._s(t.$t(n.operation_key))+" ")]),t._v(" \n                           "),n.what_bought&&"App\\GarageCar"===n.what_bought_type&&"plate_announce_key"!==n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/garage?id="+n.what_bought_id)}},[t._v(t._s(n.what_bought.car_number))]),t._v(" )\n                           ")]:n.what_bought&&["App\\Announcement"].includes(n.what_bought_type)&&"plate_announce_key"!==n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/cars/announcement/"+n.what_bought.id_unique)}},[t._v(t._s(n.what_bought.id_unique))]),t._v(" )\n                           ")]:n.what_bought&&["App\\Motorcycle","App\\Scooter","App\\MotoAtv"].includes(n.what_bought_type)&&"plate_announce_key"!==n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/moto/announcement/"+n.what_bought.id_unique)}},[t._v(t._s(n.what_bought.id_unique))]),t._v(" )\n                           ")]:n.what_bought&&"App\\Commercial"===n.what_bought_type&&"plate_announce_key"!==n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/commercial/announcement/"+n.what_bought.id_unique)}},[t._v(t._s(n.what_bought.id_unique))]),t._v(" )\n                           ")]:n.what_bought&&"App\\Part"===n.what_bought_type&&"plate_announce_key"!==n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/parts/announcement/"+n.what_bought.id_unique)}},[t._v(t._s(n.what_bought.id_unique))]),t._v(" )\n                           ")]:t._e(),t._v(" "),"plate_announce_key"===n.operation_key?[t._v("\n                              ( "),e("nuxt-link",{attrs:{to:t.$localePath("/plates/"+n.what_bought.id_unique)}},[t._v(" "+t._s(n.what_bought.id_unique))]),t._v(" )\n                           ")]:t._e()],2),t._v(" "),e("span",{staticClass:"payment-price"},[e("span",{class:"+"===n.operation_type?"text-green":"text-red"},[t._v("\n                             "+t._s(n.operation_type)+"\n                             "+t._s(n.price)+"\n                             "+t._s("balance"===n.provider||"ad_stopped"===n.operation_key?"ALM":"₼")+"\n                           ")])]),t._v(" "),e("span",{staticClass:"payment-date"},[e("span",[t._v("\n                             "+t._s(t.$moment(n.created_at).format(t.isMobileBreakpoint?"DD.MM":"HH:mm | DD.MM.YYYY"))+"\n                           ")])])])}))],2)]),t._v(" "),e("infinite-loading",{key:t.refreshInfinity,attrs:{type:t.activeFilter,action:"getMyBalanceHistoryWithoutMutate",getter:"myBalanceHistory","class-name":"mt-3 mt-lg-4","per-page":10}})],1)])])],1)])}),[],!1,null,null,null);e.default=component.exports}}]);