(window.webpackJsonp=window.webpackJsonp||[]).push([[92],{1244:function(t,e,r){var content=r(1382);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(39).default)("e6d6ecc4",content,!0,{sourceMap:!1})},1381:function(t,e,r){"use strict";r(1244)},1382:function(t,e,r){var o=r(38)((function(i){return i[1]}));o.push([t.i,".pages-parts-shops[data-v-6c23f48e]{margin-top:32px;padding-bottom:100px}",""]),o.locals={},t.exports=o},1546:function(t,e,r){"use strict";r.r(e);r(8),r(7),r(10),r(4),r(11);var o=r(0),n=r(1),l=(r(32),r(2),r(42),r(41),r(3),r(27),r(48),r(16)),c=r(1159),h=r(1160),m=r(1146),d=r(995),f=r(1161),v=r(1099),w=r(1084);function y(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function _(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?y(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):y(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var k={name:"pages-parts-shops",components:{SalonSearchForm:c.a,SalonFiltersForm:h.a,SalonCard:m.a,NoResults:d.a,ClusteredMap:f.a,Banners:v.a,Banner:w.a},nuxtI18n:{paths:{az:"/ehtiyat-hisseleri/magazalar"}},head:function(){return this.$headMeta({title:this.$t("parts_shops")})},asyncData:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.store,e.next=3,Promise.all([r.dispatch("getBrands"),r.dispatch("getSalonsList",{type:2,params:"?part=true"})]);case 3:return e.abrupt("return",{collapse:!1,disableCollapse:!0,showSearch:!1,searchFormType:0,mapKey:0});case 4:case"end":return e.stop()}}),e)})))()},computed:_(_({},Object(l.c)(["salonsFiltered","salonsInBounds","mapView"])),{},{crumbs:function(){return[{name:this.$t("parts"),route:"/parts"},{name:this.$t("shops")}]},salonsInView:function(){var t=this;return this.salonsFiltered.filter((function(e){return!t.salonsInBounds||t.salonsInBounds.includes(e.id)}))},searchFormTypeOptions:function(){return[{key:0,name:this.$t("search_by_shop")},{key:1,name:this.$t("search_by_part")}]}}),methods:_(_({},Object(l.b)(["setFooterVisibility","setMapView","updateSalonsInBounds","updateSalonsSearchFilters","updateSalonsFilters"])),{},{toggleSearch:function(){this.showSearch=!this.showSearch}}),watch:{mapView:function(t){this.mapKey=1,this.setFooterVisibility(!t)}},created:function(){this.$nuxt.$on("search-icon-click",this.toggleSearch)},beforeDestroy:function(){this.setMapView(!1),this.setFooterVisibility(!0),this.updateSalonsFilters({}),this.updateSalonsSearchFilters({}),this.$nuxt.$off("search-icon-click",this.toggleSearch)}},F=(r(1381),r(12)),component=Object(F.a)(k,(function(){var t=this,e=t._self._c;return e("div",{class:["pages-parts-shops","".concat(t.mapView?"map":"list","-view")]},[t.showSearch&&t.isMobileBreakpoint?e("mobile-screen",{attrs:{"bar-title":t.$t("search_part_salon")},on:{back:function(e){t.showSearch=!1}}},[e("div",{staticClass:"flex-stretch-chilren pt-4"},[e("div",{staticClass:"full-width"},[e("form-buttons",{attrs:{options:t.searchFormTypeOptions,"group-by":2},model:{value:t.searchFormType,callback:function(e){t.searchFormType=e},expression:"searchFormType"}})],1),t._v(" "),e("salon-search-form",{directives:[{name:"show",rawName:"v-show",value:1===t.searchFormType,expression:"searchFormType === 1"}],attrs:{where:"parts"}}),t._v(" "),e("salon-filters-form",{directives:[{name:"show",rawName:"v-show",value:0===t.searchFormType,expression:"searchFormType === 0"}],attrs:{where:"parts",count:(t.mapView?t.salonsInView:t.salonsFiltered).length},on:{filter:function(e){t.showSearch=!1}}})],1)]):t._e(),t._v(" "),t.mapView?t._e():[e("div",{staticClass:"container"},[e("Banner",{attrs:{bg:"/img/salon-bg.png",title:t.$t("shops")},scopedSlots:t._u([{key:"content",fn:function(){return[e("breadcrumbs",{staticClass:"light-color",attrs:{crumbs:t.crumbs}})]},proxy:!0}],null,!1,2534459051)}),t._v(" "),t.salonsFiltered.length?e("div",{staticClass:"salon-card-list row mt-2 mt-lg-3 mb-n2 mb-lg-n3"},t._l(t.salonsFiltered,(function(r){return r.announcement_count?e("div",{key:r.id,staticClass:"col-12 col-md-6 col-lg-4 mb-2 mb-lg-3"},[e("nuxt-link",{staticClass:"keep-colors",attrs:{to:t.$localePath("/parts/shops/".concat(r.slug))}},[e("salon-card",{attrs:{salon:r}})],1)],1):t._e()})),0):e("no-results",{attrs:{type:"part"}})],1)],t._v(" "),t.mapView?e("div",{staticClass:"map-on-salons",class:"map-".concat(t.isMobileBreakpoint?"fh":"fw","-container")},[t.isMobileBreakpoint?[e("clustered-map",{key:"mobile-map_"+t.mapKey,on:{"balloon-click":function(e){t.$router.push(t.$localePath("/parts/shops/".concat(e)))}}})]:[t.mapView?[e("div",{class:["map-sidebar",{collapse:!t.disableCollapse&&t.collapse}]},[e("div",{staticClass:"map-sidebar_content"},[e("breadcrumbs",{attrs:{crumbs:t.crumbs}}),t._v(" "),e("salon-filters-form",{attrs:{where:"parts",count:t.salonsInView.length,short:!t.isMobileBreakpoint}}),t._v(" "),t.salonsInView.length?e("div",{staticClass:"salon-card-list"},t._l(t.salonsInView,(function(r){return e("div",{key:r.id,staticClass:"salon-card-list__item"},[e("nuxt-link",{staticClass:"keep-colors",attrs:{to:t.$localePath("/salons/".concat(r.slug))}},[e("salon-card",{attrs:{salon:r}})],1)],1)})),0):e("no-results",{attrs:{type:"part"}})],1),t._v(" "),t.disableCollapse?t._e():e("div",{staticClass:"map-sidebar_toggle",on:{click:function(e){t.collapse=!t.collapse}}},[t.collapse?e("inline-svg",{attrs:{src:"/icons/chevron-right.svg",height:14}}):e("inline-svg",{attrs:{src:"/icons/chevron-left.svg",height:14}})],1)]),t._v(" "),e("div",{staticClass:"map-topbar"},[e("div",{staticClass:"container"},[e("salon-search-form",{attrs:{where:"parts",short:!t.isMobileBreakpoint&&(!t.collapse||t.disableCollapse)}})],1)])]:t._e(),t._v(" "),e("clustered-map",{key:"desktop-map_"+t.mapKey,attrs:{"margin-left":{left:0,top:0,width:"360px",height:"100%"},"margin-top":{top:0,left:0,width:"100%",height:"150px"},"use-margin-left":!t.disableCollapse&&!t.collapse},on:{"balloon-click":function(e){t.$router.push(t.$localePath("/parts/shops/".concat(e)))}}})]],2):t._e()],2)}),[],!1,null,"6c23f48e",null);e.default=component.exports}}]);