(window.webpackJsonp=window.webpackJsonp||[]).push([[118],{1008:function(e,t,r){"use strict";var n={props:{title:String,firstCollapsed:Boolean,titleWithLine:Boolean,titleWithHr:Boolean,animate:Boolean},data:function(){return{collapsed:this.firstCollapsed}},beforeDestroy:function(){this.collapsed=!1}},o=r(12),component=Object(o.a)(n,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"collapse-content"},[t(e.titleWithLine||e.titleWithHr?"h2":"h3",{tag:"component",class:{"title-with-line":e.titleWithLine},on:{click:function(t){e.collapsed=!e.collapsed}}},[t("span",[e._v(e._s(e.title))]),e._v(" "),t("icon",{staticClass:"cursor-pointer",attrs:{name:"chevron-".concat(e.collapsed?"down":"up")}})],1),e._v(" "),t(e.animate?"transition-expand":"div",{tag:"component"},[e.collapsed?e._e():t("div",[e.titleWithHr?t("hr"):e._e(),e._v(" "),e._t("default")],2)])],1)}),[],!1,null,null,null);t.a=component.exports},1090:function(e,t,r){"use strict";r.d(t,"a",(function(){return f}));var n=r(25),o=(r(20),r(2),r(15),r(1039)),c=r.n(o),l=r(1044),f={data:function(){return{showLightbox:!1,showImagesSlider:!1,toggleFsLightbox:!1,lightboxKey:0,currentSlide:0,sendingMessage:!1}},components:{FsLightbox:c.a,ImagesSlider:l.a},methods:{closeLightbox:function(){this.isMobileBreakpoint?this.showLightbox&&(this.toggleFsLightbox=!this.toggleFsLightbox):(this.setBodyOverflow("scroll"),this.showImagesSlider=!1)},handleSwipeTop:function(){var e,t;null!==(e=document)&&void 0!==e&&null!==(t=e.body)&&void 0!==t&&t.classList.contains("zooming")||this.closeLightbox()},refreshLightbox:function(){this.onBeforeClose(),this.lightboxKey++},onBeforeClose:function(){this.showLightbox=!1,this.setBodyOverflow("scroll")},changeLightboxSlide:function(e){this.currentSlide=e.stageIndexes.current},openLightbox:function(e){var t=this.attachments.indexOf(e);-1!==t&&(this.currentSlide=t),this.isMobileBreakpoint?(this.showLightbox=!0,this.toggleFsLightbox=!this.toggleFsLightbox):this.showImagesSlider=!0,this.setBodyOverflow("hidden")}},computed:{attachments:function(){var e=this;return this.offerMessages.reduce((function(e,t){return[].concat(Object(n.a)(e),Object(n.a)(t.files||[]))}),[]).map((function(t){return e.$withBaseUrl(t)}))}}}},1101:function(e,t,r){"use strict";r(8),r(20),r(74),r(42),r(27),r(48),r(2),r(41),r(586),r(221);var n={props:{value:{},disabled:Boolean,blocked:Boolean,sending:Boolean,sendButtonDisabled:Boolean,message:{}},data:function(){return{attachments:{},loaded:{},fileKey:0,hasError:!1}},computed:{messageValue:{get:function(){return this.value},set:function(e){this.$emit("input",this.disabled||this.value.length>1e3?this.value:e)}},attachmentsLength:function(){return Object.keys(this.attachments).length}},methods:{handleKeyDown:function(e){this.$emit("type",e);var t=e.which||e.keyCode;13===t&&e.shiftKey&&(e.target.value||e.preventDefault()),13!==t||e.shiftKey||(this.$emit("send",e),this.messageValue="",e.preventDefault())},attachFiles:function(e){if(!this.disabled){var t=["jpg","jpeg","png","webp"].map((function(e){return"image/"+e})),r=Array.from(e.target.files||e.dataTransfer.files);this.hasError=!1,this.$refs.input.value=null;for(var i=0;i<r.length;i++){var n=r[i].size/1024/1024,o=r[i].type;if(this.attachmentsLength>=4){this.$toasted.error(this.$t("max_file_upload_error",{max:4})),this.hasError=!0;break}t.includes(o)?n>25?(this.$toasted.error(this.$t("max_file_size_error",{size:25})),this.hasError=!0):(this.$set(this.attachments,this.fileKey,r[i]),this.fileKey++):(this.$toasted.error(this.$t("image_mimes_error")),this.hasError=!0)}this.$nextTick(this.updateFiles)}},removeFile:function(e){this.sending||(this.$delete(this.attachments,e),this.updateFiles())},previewAttachments:function(){for(var e in this.attachments)this.$refs["attachment-"+e][0].src=URL.createObjectURL(this.attachments[e]),this.$set(this.loaded,e,!0)},updateFiles:function(){var e=this;this.previewAttachments(),this.$emit("attach",Object.keys(this.attachments).map((function(t){return e.attachments[t]})))}},mounted:function(){var e=this;this.$nuxt.$on("clear-message-attachments",(function(){e.$set(e,"attachments",{}),e.$emit("attach",[])}))},beforeDestroy:function(){this.$nuxt.$off("clear-message-attachments"),this.$emit("attach",[])},messageNotNull:function(){return this.sendButtonDisabled}},o=r(12),component=Object(o.a)(n,(function(){var e=this,t=e._self._c;return t("form",{staticClass:"form",on:{submit:function(t){return t.preventDefault(),e.$emit("send",t)}}},[t("div",{staticClass:"message-textarea",class:{disabled:e.disabled}},[t("div",{staticClass:"textarea-attach"},[t("span",{staticClass:"cursor-pointer"},[t("icon",{attrs:{name:"attachment"}})],1),e._v(" "),t("input",{ref:"input",attrs:{type:"file",accept:"image/*",multiple:""},on:{change:e.attachFiles}})]),e._v(" "),t("div",{staticClass:"textarea-text"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.messageValue,expression:"messageValue"}],attrs:{id:"textarea",maxlength:1e3,disabled:e.disabled,placeholder:"Təklifinizi verin"},domProps:{value:e.messageValue},on:{keydown:e.handleKeyDown,input:function(t){t.target.composing||(e.messageValue=t.target.value)}}}),e._v(" "),e.message?t("span",{staticClass:"textarea-message text-dark-blue-3"},[e.blocked?t("icon",{attrs:{name:"block"}}):e._e(),e._v("\n        "+e._s(e.message)+"\n      ")],1):e._e()]),e._v(" "),t("div",{staticClass:"textarea-submit"},[t("button",{staticClass:"btn-reset",attrs:{type:"submit",disabled:e.sendButtonDisabled}},[t("icon",{attrs:{name:"send"}})],1)])]),e._v(" "),e.attachmentsLength?t("div",{staticClass:"message-attachment-preview"},e._l(e.attachments,(function(r,n){return t("div",{key:n,staticClass:"preview",class:{hide:!e.loaded[n],loading:e.sending}},[e.sending?t("div",{staticClass:"image-preloader"}):e._e(),e._v(" "),t("button",{staticClass:"btn-sq btn-sq--color-red",on:{click:function(t){return e.removeFile(n)}}},[t("icon",{attrs:{name:"garbage"}})],1),e._v(" "),t("img",{ref:"attachment-"+n,refInFor:!0,attrs:{src:"",alt:""}})])})),0):e._e()])}),[],!1,null,null,null);t.a=component.exports},1102:function(e,t,r){"use strict";r(17);var n={name:"offerItems",props:{offer_items:[]},data:function(){return{selected_offer_item:0}},methods:{selectOfferItem:function(e){this.selected_offer_item=e}}},o=r(12),component=Object(o.a)(n,(function(){var e=this,t=e._self._c;return t("div",[t("div",{staticClass:"offer_items"},e._l(e.offer_items,(function(r,n){return t("div",{staticClass:"offer_item",class:e.selected_offer_item==n?"active":null,on:{click:function(t){return e.selectOfferItem(n)}}},[t("img",{attrs:{src:r.generations[0].img,alt:""}}),e._v(" "),t("div",{staticClass:"offer_item_detail pl-1"},[t("div",{staticClass:"d-flex"},[r.minPrice?t("div",{staticClass:"offer_price"},[e._v(e._s(r.minPrice)+" - ")]):e._e(),e._v(" "),t("div",{staticClass:"offer_price"},[e._v(e._s(r.maxPrice)+" ₼")])]),e._v(" "),t("div",{staticClass:"offer_brand_model"},[e._v(e._s(r.brand)+" "+e._s(r.model))]),e._v(" "),t("span",[e._v(e._s(r.generations[0].end_year)+"  ")])])])})),0),e._v(" "),t("div",[t("div",{staticClass:"offerDetailContent"},[t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Brand")]),e._v(" "),t("span",[e._v(e._s(e.offer_items[e.selected_offer_item].brand))])]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Model ")]),e._v(" "),t("span",[e._v(e._s(e.offer_items[e.selected_offer_item].model)+" ")])]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Nəsil ")]),e._v(" "),t("div",e._l(e.offer_items[e.selected_offer_item].generations,(function(r,n){return t("div",[e._v(" "+e._s(r.name)+"\n            "),n!=e.offer_items[e.selected_offer_item].generations.length-1?t("div",[e._v(",")]):e._e()])})),0)]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Sürətlər qutusu ")]),e._v(" "),t("div",e._l(e.offer_items[e.selected_offer_item].gear_boxes,(function(r,n){return t("div",[e._v("\n                             "+e._s(e.$t("box_values")[r.gear_box_key])+"\n\n                "),n!=e.offer_items[e.selected_offer_item].gear_boxes.length-1?t("div",[e._v(",")]):e._e()])})),0)]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Yanacaq növü ")]),e._v(" "),t("div",e._l(e.offer_items[e.selected_offer_item].fuel_types,(function(r,n){return t("div",[e._v("\n\n                "+e._s(e.$t("engine_values")[r.fuel_type_key])+" "),n!=e.offer_items[e.selected_offer_item].fuel_types.length-1?t("div",[e._v(",")]):e._e()])})),0)]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Alış şərti")]),e._v(" "),t("div",[t("div",[t("span",[e._v(" "+e._s("cash"==e.offer_items[e.selected_offer_item].buy_type?"Nağd":"Kredit"))])])])]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Rəng ")]),e._v(" "),t("div",e._l(e.offer_items[e.selected_offer_item].colors,(function(e,r){return t("div",[t("span",{staticClass:"color-box",style:"background-color:".concat(e.code)})])})),0)]),e._v(" "),t("div",{staticClass:"offerDetailItem"},[t("p",[e._v("Salon Rəngi ")]),e._v(" "),t("div",[t("div",["other"!=e.offer_items[e.selected_offer_item].interior_color?t("span",{staticClass:"color-box",style:"background-color:".concat(e.offer_items[e.selected_offer_item].interior_color)}):t("span",{staticClass:"color-box color",style:"background:url(/images/offer/other-color.png);background-size:cover"})])])]),e._v(" "),t("div",[t("p",{staticClass:"offerComment"},[e._v("\n          "+e._s(e.offer_items[e.selected_offer_item].comment)+"\n        ")])])])])])}),[],!1,null,"72329fe3",null);t.a=component.exports},1576:function(e,t,r){"use strict";r.r(t);var n=r(0),o=r(1),c=(r(2),r(42),r(41),r(20),r(35),r(8),r(7),r(3),r(10),r(4),r(11),r(32),r(1101)),l=r(1008),f=r(16),d=r(275),m=r(1102),h=r(1090);function _(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?_(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):_(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var x={name:"salon-offer-detail",components:{OfferItems:m.a,CollapseContent:l.a,OfferMessage:c.a},asyncData:function(e){return Object(o.a)(regeneratorRuntime.mark((function t(){var r,n,o,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.store,n=e.route,o=e.$axios,t.next=3,r.dispatch("getOffer",{id:n.params.id,type:"user"});case 3:return t.next=5,o.$post("/offer/salon/offer/check/"+n.params.id);case 5:return c=t.sent,r.commit("setOfferMessages",c.messages),t.abrupt("return",{user_is_accepted:c.status,auto_salon_deleted:null!=c.auto_salon_deleted_at,user_deleted:null!=c.user_deleted_at});case 8:case"end":return t.stop()}}),t)})))()},head:function(){return this.$headMeta({title:this.$t("Super teklif")})},mixins:[d.a,h.a],nuxtI18n:{paths:{az:"/salonlar/offer/:id"}},data:function(){return{chat:{text:""},search:"",IsAccepted:!1,files:[],auto_salon_offer_id:null,user_deleted:!0,auto_salon_deleted:!0}},methods:{addFavorite:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("offerAddFavorite",e);case 2:t.$store.dispatch("getAllOffers",t.$route.query);case 3:case"end":return r.stop()}}),r)})))()},isMyMessage:function(e){return this.user.id===e.sender.id},handleTyping:function(){},handleFiles:function(e){this.$set(this,"files",e)},submitMessage:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(r=new FormData).append("recipient_id",e.offer.user.id),r.append("message",e.chat.text),r.append("offer_id",e.offer.id),r.append("auto_salon_offer_id",e.auto_salon_offer_id),t.next=7,Promise.all(e.files.map(function(){var t=Object(o.a)(regeneratorRuntime.mark((function t(n){var o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getResizedImage(n);case 2:o=t.sent,r.append("files[]",o);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()));case 7:e.$axios.$post("/offer/messages/send",r).then((function(t){if(e.$store.commit("appendOfferMessage",t.data.message),t.data.message.files.length>1){setTimeout((function(){e.scrollTo(".my:last-child >.message-files:last-child >.message-file",300,500,".offerDetail")}),1e3)}else e.scrollTo(".message:last-child",0,500,".offerDetail");e.chat.text="",e.$nuxt.$emit("clear-message-attachments"),e.checkAccepted(e.$route.params.id)}));case 8:case"end":return t.stop()}}),t)})))()},checkAccepted:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,t.$axios.$post("/offer/salon/offer/check/"+e).then((function(e){t.auto_salon_deleted=null!=e.auto_salon_deleted_at,t.user_deleted=null!=e.user_deleted_at,t.IsAccepted=e.status,t.auto_salon_offer_id=e.auto_salon_offer_id,t.$store.commit("setOfferMessages",e.messages)}));case 2:case"end":return r.stop()}}),r)})))()},accept:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,t.$store.dispatch("salonAcceptOffer",{id:e});case 2:t.checkAccepted(e);case 3:case"end":return r.stop()}}),r)})))()},getMessages:function(e){return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})))()},deleteUserAutoSalonOffer:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t.$axios.delete("/offer/salon/offer/delete/"+e),r.next=3,t.$store.dispatch("OffersAcceptedByAutoSalon");case 3:t.IsAccepted=!1,t.isMobileBreakpoint&&t.$router.back();case 5:case"end":return r.stop()}}),r)})))()}},computed:v(v({},Object(f.c)({offerMessages:"getOfferMessages"})),{},{offer:function(){var e=this.$store.getters.getOffer;return e.data}}),created:function(){this.checkAccepted(this.$route.params.id)}},C=x,y=r(12),component=Object(y.a)(C,(function(){var e=this,t=e._self._c;return t("div",[t("div",{staticClass:"container"},[t("div",{staticClass:"d-flex align-items-center user userBar mt-3 mb-3"},[t("span",{on:{click:function(t){return e.$router.back()}}},[t("a",[t("icon",{staticClass:"m-1",attrs:{name:"chevron-left "}})],1)]),e._v(" "),t("div",{staticClass:"userImg",style:"background-image: url("+(e.offer.user.img?e.offer.user.img:"/img/user.jpg")+")"}),e._v(" "),t("p",{staticClass:"mt-2 ml-2 text-bold"},[e._v("\n        "+e._s(e.offer.user.full_name)+"\n      ")]),e._v(" "),e.IsAccepted?t("div",{staticClass:"actions m-1 d-flex"},[e.offer.deleted?e._e():t("span",{class:e.offer.isFavorite?"isFavorite":"favorite",on:{click:function(t){return e.addFavorite(e.offer.id)}}},[t("icon",{attrs:{name:"star"}})],1),e._v(" "),!e.offer.auto_salon_deleted_at||this.IsAccepted?t("span",{on:{click:function(t){return e.deleteUserAutoSalonOffer(e.offer.id)}}},[t("icon",{attrs:{name:"garbage"}})],1):e._e()]):e._e()])]),e._v(" "),t("div",{staticClass:"container"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col col-md-12 col-12 col-xs-12 col-sm-12"},[e.offer?t("div",{staticClass:"offerDetail"},[t("collapse-content",{attrs:{title:"Təklif"}},[t("offer-items",{attrs:{offer_items:e.offer.offer_items}})],1),e._v(" "),t("div",{staticClass:"messages"},e._l(e.offerMessages,(function(r){return t("div",{staticClass:"message",class:e.isMyMessage(r)?"my":"his"},[r.files.length>0?t("div",{staticClass:"message-files"},[e._l(r.files,(function(r){return t("div",{staticClass:"message-file"},[t("img",{staticClass:"p-1",attrs:{src:r,width:"100%"},on:{click:function(t){return e.openLightbox(r)}}})])})),e._v(" "),r.files.length>0?t("div",{staticClass:"div m-1"},[e._v("\n                    "+e._s(r.message)+" "),t("span",{staticClass:"time"},[e._v("17:30")])]):e._e()],2):e._e(),e._v(" "),!r.files.length>0?t("span",[e._v("\n                  "+e._s(r.message)+" "),t("span",{staticClass:"time"},[e._v("17:30")])]):e._e()])})),0)],1):e._e(),e._v(" "),t("div",{staticClass:"col-md-12"},[e.user_deleted?t("div",{staticClass:"offer-alert",attrs:{role:"alert"}},[e._v("\n            İstifadəçi təklifi silmişdir.\n          ")]):e._e()]),e._v(" "),e.auto_salon_deleted||e.user_deleted?e._e():t("div",{staticClass:"addons"},[t("offer-message",{attrs:{sending:!1,message:!1,"send-button-disabled":e.chat.text.length<1},on:{type:e.handleTyping,attach:e.handleFiles,send:e.submitMessage},model:{value:e.chat.text,callback:function(t){e.$set(e.chat,"text",t)},expression:"chat.text"}}),e._v(" "),t("img",{ref:"attachment-"+e.key,attrs:{src:"",alt:""}}),e._v(" "),t("div",{staticClass:"addLink"})],1)])])]),e._v(" "),t("div",{directives:[{name:"touch",rawName:"v-touch:swipe.top",value:e.handleSwipeTop,expression:"handleSwipeTop",arg:"swipe",modifiers:{top:!0}}],staticClass:"inner-gallery-lightbox"},[e.isMobileBreakpoint?[t("FsLightbox",{key:e.lightboxKey,attrs:{toggler:e.toggleFsLightbox,sources:e.attachments,slide:e.currentSlide+1,onClose:e.refreshLightbox,onBeforeClose:e.onBeforeClose,disableThumbs:!0,onSlideChange:e.changeLightboxSlide}})]:e._e(),e._v(" "),t("transition-group",{attrs:{name:"fade"}},[e.showLightbox&&e.isMobileBreakpoint||!e.isMobileBreakpoint&&e.showImagesSlider?[t("div",{key:0,staticClass:"blur-bg"},[t("img",{attrs:{src:e.$withBaseUrl(e.attachments[e.currentSlide]),alt:""}})]),e._v(" "),e.isMobileBreakpoint?e._e():t("div",{key:1,staticClass:"blur-bg_slider"},[t("images-slider",{attrs:{"current-slide":e.currentSlide,slides:{main:e.attachments}},on:{close:e.closeLightbox,"slide-change":function(t){e.currentSlide=t}}})],1)]:e._e()],2)],2)])}),[],!1,null,"7902fbbf",null);t.default=component.exports}}]);