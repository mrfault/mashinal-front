(window.webpackJsonp=window.webpackJsonp||[]).push([[106],{1253:function(e,t,n){var content=n(1402);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(39).default)("105749e9",content,!0,{sourceMap:!1})},1401:function(e,t,n){"use strict";n(1253)},1402:function(e,t,n){var r=n(38)((function(i){return i[1]}));r.push([e.i,'.pages-profile-messages .registrationMarks__number{align-items:center;border:3px solid #000;border-radius:5px;display:flex;height:42px;margin-right:20px;padding:0 8px}.pages-profile-messages .registrationMarks__number .divider{border:initial;height:auto;margin:0}.pages-profile-messages .registrationMarks__number .divider img{border-radius:0;border-radius:initial;height:auto;margin:0;width:20px}.pages-profile-messages .registrationMarks__number .divider:first-child{margin-right:7px}.pages-profile-messages .registrationMarks__number h3{color:#1b2434;font-family:"DinMittelschriftgepraegt",sans-serif;font-size:35px;font-weight:400;letter-spacing:-1px;line-height:44px;margin:0}@media (max-width:1250px){.pages-profile-messages .registrationMarks__number{height:40px}.pages-profile-messages .registrationMarks__number .divider img{width:17px}.pages-profile-messages .registrationMarks__number h3{font-size:30px}}',""]),r.locals={},e.exports=r},1502:function(e,t,n){"use strict";n.r(t);n(27),n(48),n(8),n(7),n(10),n(4),n(11);var r=n(25),o=n(0),c=n(1),l=(n(32),n(2),n(42),n(41),n(3),n(20),n(63),n(15),n(14),n(21),n(35),n(16)),h=n(274),d=n(333),m={props:{group:{},blocked:Boolean,active:Boolean},computed:{notRead:function(){return!!this.group.last_message&&(!this.group.is_read&&this.group.last_message.sender_id!=this.user.id)},notReadCount:function(){var e,t,n,r;return null!==(e=this.group)&&void 0!==e&&null!==(t=e.last_message)&&void 0!==t&&t.is_read?0:(null===(n=this.group)||void 0===n||null===(r=n.messages)||void 0===r?void 0:r.filter((function(e){return!e.is_read})).length)||0},chatAnnouncement:function(){return this.group.announce||{}},chatUser:function(){return this.group.sender_id==this.user.id?this.group.recipient:this.group.sender},chatAvatar:function(){var e,t,n=this.group.sender_id==this.user.id,r=n?null===(e=this.chatAnnouncement.media)||void 0===e||null===(t=e.thumb_100x100)||void 0===t?void 0:t[0]:this.group.sender.avatar;return r?this.$withBaseUrl("".concat(n?"":"/storage/").concat(r)):"/img/user.jpg"},isOnline:function(){return!this.isChatBot&&this.chatUser.is_online},isChatBot:function(){return 3==this.chatUser.id},lastMessage:function(){return this.group.messages&&this.group.messages.length?this.group.messages[this.group.messages.length-1]:this.group.last_message||!1}},methods:{}},v=n(12),f=Object(v.a)(m,(function(){var e=this,t=e._self._c;return t("div",{class:["chat-item pt-0",{active:e.active}],on:{click:function(t){return e.$emit("select-group",e.group.id)}}},[t("hr",{staticClass:"mt-0"}),e._v(" "),t("div",{staticClass:"d-flex"},[t("div",{class:{"is-online":e.isOnline}},[t("img",{staticClass:"chat-avatar",attrs:{src:e.chatAvatar,alt:""}})]),e._v(" "),t("div",{staticClass:"chat-info"},[t("div",{staticClass:"chat-first-line"},[t("span",{staticClass:"text-medium text-truncate"},[e._v(e._s(e.chatUser.full_name))]),e._v(" "),t("span",{staticClass:"text-dark-blue-3"},[e._v(e._s(e.lastMessage?e.$moment(e.lastMessage.created_at).format("HH:mm"):""))]),e._v(" "),!e.isChatBot&&e.isMobileBreakpoint?t("span",{staticClass:"dots",on:{click:function(t){return t.stopPropagation(),e.$emit("show-modal",e.group)}}},e._l(3,(function(i){return t("i",{key:i})})),0):e._e()]),e._v(" "),t("div",{staticClass:"chat-announcement"},[e.isChatBot?t("span",[e._v(e._s(e.$t("bot")))]):t("span",{staticClass:"text-truncate"},[e._v(e._s(e.getAnnouncementTitle(e.chatAnnouncement)||e.chatAnnouncement.car_number))]),e._v(" "),t("span",{staticClass:"text-dark-blue-2"},[e.chatAnnouncement.is_negotiable?t("icon",{attrs:{name:"handshake"}}):[e._v(e._s(e.chatAnnouncement.price||""))]],2),e._v(" "),e.notReadCount?t("span",{staticClass:"text-right"},[t("span",{staticClass:"badge-counter"},[e._v(e._s(e.notReadCount))])]):e._e()]),e._v(" "),t("div",{staticClass:"chat-details text-dark-blue-3"},[e.lastMessage&&(e.lastMessage.text||e.lastMessage.attachments.length)?[e.lastMessage.sender_id==e.user.id?t("span",{class:["delivery-info",{"text-dark-blue-2":e.lastMessage.is_seen}]},[t("icon",{attrs:{name:"check1"}})],1):e._e(),e._v(" "),e.isChatBot&&e.lastMessage.text?t("span",{staticClass:"text-truncate",domProps:{innerHTML:e._s(e.lastMessage.text.split("<br>")[0])}}):e.lastMessage.text?t("span",{staticClass:"text-truncate"},[e._v(e._s(e.lastMessage.text))]):e.lastMessage.attachments.length?t("span",{staticClass:"attachment-info d-flex"},[t("inline-svg",{staticStyle:{"margin-right":"5px",height:"12px"},attrs:{src:"/icons/camera.svg",height:14}}),e._v("\n            "+e._s(e.$t("image"))+"\n          ")],1):e._e()]:e._e()],2)])])])}),[],!1,null,null,null).exports,_=(n(91),n(275)),k=n(1039),x=n.n(k),y={props:{message:{},rawHtml:Boolean},computed:{sentByMe:function(){return this.message.sender_id==this.user.id}}},C=Object(v.a)(y,(function(){var e=this,t=e._self._c;return t("div",{class:["message-item",{"pull-right":e.sentByMe}],attrs:{id:"message-".concat(e.message.id)}},[t("div",{class:["message-content",{"sent-by-me":e.sentByMe}]},[e.message.attachments.length?t("div",{staticClass:"message-attachments"},e._l(e.message.attachments,(function(image,i){return t("div",{key:image.src,class:{"half-width":!(e.message.attachments.length%2==1&&i===e.message.attachments.length-1)}},[t("img",{attrs:{src:e.$withBaseUrl(image.thumb),alt:""},on:{click:function(t){e.$emit("show-image",e.$withBaseUrl(image.src))}}}),e._v(" "),t("span",{staticClass:"message-time"},[e._v("\n          "+e._s(e.$moment(e.message.created_at).format("HH:mm"))+"\n        ")])])})),0):e._e(),e._v(" "),e.message.text?t("div",{staticClass:"message-text_wrapper"},[t("span",{staticClass:"message-text"},[e.rawHtml?t("span",{domProps:{innerHTML:e._s(e.message.text||"")}}):t("span",[e._v(e._s(e.message.text||""))])]),e._v(" "),t("span",{class:["message-time",{"text-dark-blue-3":!e.sentByMe}]},[e.sentByMe?t("icon",{attrs:{name:"check1"}}):e._e(),e._v("\n        "+e._s(e.$moment(e.message.created_at).format("HH:mm"))+"\n      ")],1)]):e._e()])])}),[],!1,null,null,null).exports,w=(n(74),n(586),n(221),{props:{value:{},disabled:Boolean,blocked:Boolean,sending:Boolean,message:{}},data:function(){return{attachments:{},loaded:{},fileKey:0,hasError:!1}},computed:{messageValue:{get:function(){return this.value},set:function(e){var t;this.$emit("input",this.disabled||(null===(t=this.value)||void 0===t?void 0:t.length)>1e3?this.value:e)}},attachmentsLength:function(){return Object.keys(this.attachments).length}},methods:{handleKeyDown:function(e){this.$emit("type",e);var t=e.which||e.keyCode;13===t&&e.shiftKey&&(e.target.value||e.preventDefault()),13!==t||e.shiftKey||(this.$emit("send",e),this.messageValue=null,e.preventDefault())},attachFiles:function(e){if(!this.disabled){var t=["jpg","jpeg","png","webp"].map((function(e){return"image/"+e})),n=Array.from(e.target.files||e.dataTransfer.files);this.hasError=!1,this.$refs.input.value=null;for(var i=0;i<n.length;i++){var r=n[i].size/1024/1024,o=n[i].type;if(this.attachmentsLength>=4){this.$toasted.error(this.$t("max_file_upload_error",{max:4})),this.hasError=!0;break}t.includes(o)?r>25?(this.$toasted.error(this.$t("max_file_size_error",{size:25})),this.hasError=!0):(this.$set(this.attachments,this.fileKey,n[i]),this.fileKey++):(this.$toasted.error(this.$t("image_mimes_error")),this.hasError=!0)}this.$nextTick(this.updateFiles)}},removeFile:function(e){this.sending||(this.$delete(this.attachments,e),this.updateFiles())},previewAttachments:function(){for(var e in this.attachments)this.$refs["attachment-"+e][0].src=URL.createObjectURL(this.attachments[e]),this.$set(this.loaded,e,!0)},updateFiles:function(){var e=this;this.previewAttachments(),this.$emit("attach",Object.keys(this.attachments).map((function(t){return e.attachments[t]})))}},mounted:function(){var e=this;this.$nuxt.$on("clear-message-attachments",(function(){e.$set(e,"attachments",{}),e.$emit("attach",[])}))},beforeDestroy:function(){this.$nuxt.$off("clear-message-attachments"),this.$emit("attach",[])}}),M=Object(v.a)(w,(function(){var e=this,t=e._self._c;return t("form",{staticClass:"form",on:{submit:function(t){return t.preventDefault(),e.$emit("send",t)}}},[t("div",{staticClass:"message-textarea",class:{disabled:e.disabled}},[t("div",{staticClass:"textarea-attach"},[t("span",{staticClass:"cursor-pointer"},[t("icon",{attrs:{name:"attachment"}})],1),e._v(" "),t("input",{ref:"input",attrs:{type:"file",accept:"image/*",multiple:""},on:{change:e.attachFiles}})]),e._v(" "),t("div",{staticClass:"textarea-text"},[t("vue-scroll",[t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.messageValue,expression:"messageValue"}],attrs:{id:"textarea",maxlength:1e3,disabled:e.disabled,placeholder:e.message?"":e.$t("write")},domProps:{value:e.messageValue},on:{keydown:e.handleKeyDown,input:function(t){t.target.composing||(e.messageValue=t.target.value)}}})]),e._v(" "),e.message?t("span",{staticClass:"textarea-message text-dark-blue-3"},[e.blocked?t("icon",{attrs:{name:"block"}}):e._e(),e._v("\n        "+e._s(e.message)+"\n      ")],1):e._e()],1),e._v(" "),t("div",{staticClass:"textarea-submit"},[t("button",{staticClass:"btn-reset",attrs:{type:"submit"}},[t("icon",{attrs:{name:"send"}})],1)])]),e._v(" "),e.attachmentsLength?t("div",{staticClass:"message-attachment-preview"},e._l(e.attachments,(function(n,r){return t("div",{key:r,staticClass:"preview",class:{hide:!e.loaded[r],loading:e.sending}},[e.sending?t("div",{staticClass:"image-preloader"}):e._e(),e._v(" "),t("button",{staticClass:"btn-sq btn-sq--color-red",on:{click:function(t){return e.removeFile(r)}}},[t("icon",{attrs:{name:"garbage"}})],1),e._v(" "),t("img",{ref:"attachment-"+r,refInFor:!0,attrs:{src:"",alt:""}})])})),0):e._e()])}),[],!1,null,null,null).exports,$=n(1044);function B(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function O(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?B(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):B(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var G={props:{group:{},chatUser:{},blocked:{},blockedBy:{},messagePin:{}},mixins:[h.a,_.a],components:{FsLightbox:x.a,MessageItem:C,MessageSend:M,ImagesSlider:$.a},data:function(){return{pending:!1,showRemoveModal:!1,removeItem:null,text:"",files:[],typing:!1,sending:!1,timeout:-1,sendingFiles:!1,toggleFsLightbox:!1,showLightbox:!1,showImagesSlider:!1,lightboxKey:0,currentSlide:0,sendingMessage:!1}},computed:O(O({},Object(l.c)(["suggestedMessages","messagesByDate"])),{},{chatAvatar:function(){return this.chatUser.avatar?this.$withBaseUrl("/storage/".concat(this.chatUser.avatar)):"/img/user.jpg"},chatAnnouncementThumb:function(){var e,t;return null===(e=this.chatAnnouncement.media)||void 0===e||null===(t=e.thumb_100x100)||void 0===t?void 0:t[0]},chatAnnouncement:function(){return this.group.announce||{}},isOnline:function(){return!this.isChatBot&&this.chatUser.is_online},isChatBot:function(){return 3==this.chatUser.id},filteredSuggestedMessages:function(){var e=this;return this.suggestedMessages.filter((function(t){return t.title[e.locale]})).map((function(t){return t.title[e.locale]}))},showSuggestedMessages:function(){var e;return!this.blocked&&!this.blockedBy&&(!this.group.messages.length&&1===(null===(e=this.group.announce)||void 0===e?void 0:e.status)&&this.filteredSuggestedMessages.length&&!this.isChatBot)},attachments:function(){var e=this;return this.group.messages.reduce((function(e,t){return[].concat(Object(r.a)(e),Object(r.a)(t.attachments||[]))}),[]).map((function(t){return e.$withBaseUrl(t.src)}))},messageLinks:function(){var e;return null===(e=document)||void 0===e?void 0:e.querySelectorAll(".message-text a")},announcementNotFound:function(){return 1!==this.chatAnnouncement.status},disabledTexting:function(){return this.blocked||this.blockedBy||this.announcementNotFound||this.sendingFiles||this.isChatBot},textareaMessage:function(){return this.blocked?this.$t("you_blocked_this_user"):this.blockedBy?this.$t("you_were_blocked_by_this_user"):!!this.announcementNotFound&&this.$t("announcement_not_found")}}),methods:O(O({},Object(l.b)(["markAsRead","sendMessage"])),{},{deleteGroup:function(){this.$emit("delete-chat",this.removeItem)},checkIfRead:function(){var e=this.group.last_message;null===e||null!=e&&e.is_read||this.markAsRead(this.group.id)},goBack:function(){this.$route.query.group&&this.$router.replace({query:null}),this.$emit("go-back")},toggleTypingStatus:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.connectEcho("typing."+this.chatUser.id).whisper("typing",JSON.stringify({typing:e,userId:this.user.id,sendingAttachment:t,announceId:this.group.announce_id}))},toggleSendingStatus:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.sendingFiles=e,this.toggleTypingStatus(e,!0)},updateEventListenerList:function(e,t,n){for(var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=0;i<e.length;i++)r?e[i].removeEventListener(t,n,!1):e[i].addEventListener(t,n,!1)},handleScrollToMessage:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300;this.$nextTick((function(){setTimeout((function(){var r,o;!1!==t?null===(r=e.$refs.chat)||void 0===r||r.scrollIntoView("#message-".concat(e.messagePin),n,"easeInQuad"):null===(o=e.$refs.chat)||void 0===o||o.scrollTo({y:"100%"},n,"easeInQuad")}),0)}))},handleMessageLinkClick:function(e){e.preventDefault(),this.$router.push(this.$localePath(e.srcElement.pathname+e.srcElement.search))},handleTyping:function(){this.toggleTypingStatus()},handleFiles:function(e){this.$set(this,"files",e)},useSuggestedMessage:function(text){var e=this;return Object(c.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.$set(e,"text",text),t.next=3,e.submitMessage();case 3:case"end":return t.stop()}}),t)})))()},submitMessage:function(){var e=this;return Object(c.a)(regeneratorRuntime.mark((function t(){var n,r,o,data;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.disabledTexting&&!e.sendingMessage){t.next=2;break}return t.abrupt("return");case 2:if(e.sendingMessage=!0,t.prev=3,!((n=e.files.length>0)||e.text&&""!==e.text.replace(/\s/g,""))){t.next=33;break}return(r=new FormData).append("recipient_id",e.chatUser.id),r.append("group_id",e.group.id),r.append("text",e.text),t.next=12,Promise.all(e.files.map(function(){var t=Object(c.a)(regeneratorRuntime.mark((function t(n){var o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getResizedImage(n);case 2:o=t.sent,r.append("files[]",o);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()));case 12:return n?e.toggleSendingStatus(!0):e.text="",o=function(){n?(e.text="",e.$nuxt.$emit("clear-message-attachments"),e.toggleSendingStatus(!1)):(e.toggleTypingStatus(!0),e.toggleTypingStatus(!1))},t.prev=14,t.next=17,e.sendMessage({form:r,activeGroup:e.group});case 17:e.sendingMessage=!1,e.markAsRead(e.group.id),o(),e.lightboxKey++,t.next=31;break;case 23:if(t.prev=23,t.t0=t.catch(14),data=t.t0.response.data.data,e.sendingMessage=!1,2!==data.type){t.next=30;break}return t.next=30,e.$auth.fetchUser();case 30:o();case 31:t.next=34;break;case 33:e.sendingMessage=!1;case 34:t.next=39;break;case 36:t.prev=36,t.t1=t.catch(3),e.sendingMessage=!1;case 39:case"end":return t.stop()}}),t,null,[[3,36],[14,23]])})))()},openLightbox:function(e){var t=this.attachments.indexOf(e);-1!==t&&(this.currentSlide=t),this.isMobileBreakpoint?(this.showLightbox=!0,this.toggleFsLightbox=!this.toggleFsLightbox):this.showImagesSlider=!0,this.setBodyOverflow("hidden")},refreshLightbox:function(){this.onBeforeClose(),this.lightboxKey++},onBeforeClose:function(){this.showLightbox=!1,this.setBodyOverflow("scroll")},changeLightboxSlide:function(e){this.currentSlide=e.stageIndexes.current},closeLightbox:function(){this.isMobileBreakpoint?this.showLightbox&&(this.toggleFsLightbox=!this.toggleFsLightbox):(this.setBodyOverflow("scroll"),this.showImagesSlider=!1)},handleSwipeTop:function(){var e,t;null!==(e=document)&&void 0!==e&&null!==(t=e.body)&&void 0!==t&&t.classList.contains("zooming")||this.closeLightbox()}}),watch:{"$route.query.group":function(){this.checkIfRead(),this.handleScrollToMessage(this.messagePin,0)},"files.length":function(e,t){1===e&&0===t&&this.handleScrollToMessage(!1)},"group.messages.length":function(e){this.handleScrollToMessage(!1)},breakpoint:function(){this.refreshLightbox()}},mounted:function(){var e=this;this.checkIfRead(),this.handleScrollToMessage(this.messagePin,!1),this.$nextTick((function(){e.updateEventListenerList(e.messageLinks,"click",e.handleMessageLinkClick),e.connectEcho("typing."+e.user.id).listenForWhisper("typing",(function(data){if((!data.announceId||data.announceId===e.group.announce_id)&&data.userId==e.chatUser.id){if(data.sendingAttachment)return void(e.sending=data.typing);e.typing=data.typing,clearTimeout(e.timeout),e.typing&&(e.timeout=setTimeout((function(){e.typing=!1}),1e3))}}))}))},beforeDestroy:function(){this.connectEcho("typing."+this.user.id).stopListeningForWhisper("typing"),this.updateEventListenerList(this.messageLinks,"click",this.handleMessageLinkClick,!0)}},I=G,j=Object(v.a)(I,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"chat-messages"},[t("div",{staticClass:"d-flex"},[t("div",{staticClass:"chat-inner-info"},[t("div",{class:{"is-online":e.isOnline}},[t("img",{staticClass:"chat-avatar",attrs:{src:e.chatAvatar,alt:""}})]),e._v(" "),t("span",{staticClass:"username"},[t("span",[e._v(e._s(e.chatUser.full_name))]),e._v(" "),e.sending||e.typing?t("span",{staticClass:"typing-status text-dark-blue-3"},[e.sending?[e._v(e._s(e.$t("is_sending")))]:e.typing?[e._v(e._s(e.$t("is_typing")))]:e._e()],2):e._e(),e._v(" "),e.isMobileBreakpoint?[t("br"),e._v(" "),t("span",{staticClass:"username-subtitle",on:{click:function(t){return t.stopPropagation(),e.$emit("go-to-announcement",e.group)}}},[t("span",{staticClass:"text-truncate"},[e._v(e._s(e.getAnnouncementTitle(e.chatAnnouncement)))]),e._v(" "),t("span",{staticClass:"text-dark-blue-2"},[e._v(e._s(e.chatAnnouncement.price||""))])])]:e._e()],2),e._v(" "),e.isChatBot?e._e():[t("span",{staticClass:"cursor-pointer text-dark-blue-2",on:{click:function(t){return t.stopPropagation(),e.$emit("block-chat",e.group)}}},[t("icon",{attrs:{name:e.blocked?"unblock":"block"}})],1),e._v(" "),t("span",{staticClass:"cursor-pointer text-red",on:{click:function(t){t.stopPropagation(),e.removeItem=e.group,e.showRemoveModal=!0}}},[t("icon",{attrs:{name:"garbage"}})],1)]],2),e._v(" "),e.isMobileBreakpoint||e.isChatBot||!e.group.announce?e._e():[t("span",{staticClass:"divider"}),e._v(" "),t("div",{staticClass:"chat-inner-announcement user-select-none"},[6!==e.group.announce.type?t("img",{staticClass:"cursor-pointer",attrs:{src:e.chatAnnouncementThumb,alt:"img"},on:{click:function(t){return t.stopPropagation(),e.$emit("go-to-announcement",e.group)}}}):e._e(),e._v(" "),t("span",{class:["cursor-pointer",{"d-flex align-items-center":6===e.group.announce.type}],on:{click:function(t){return t.stopPropagation(),e.$emit("go-to-announcement",e.group)}}},[6!==e.group.announce.type?t("span",[e._v(e._s(e.getAnnouncementTitle(e.chatAnnouncement)))]):e._e(),e._v(" "),6!==e.group.announce.type?t("br"):e._e(),e._v(" "),6===e.group.announce.type?t("div",{staticClass:"registrationMarks__number"},[e._m(0),e._v(" "),t("div",{staticClass:"divider"},[t("h3",[e._v(e._s(e.group.announce.car_number.replace(/\s/g,"")))])])]):e._e(),e._v(" "),t("span",{class:["text-dark-blue-2",{style:6===e.group.announce.type}],staticStyle:{"white-space":"nowrap"}},[e._v(e._s(e.chatAnnouncement.price||""))])])])]],2),e._v(" "),t("hr",{staticClass:"mt-0 mb-0"}),e._v(" "),t("div",{staticClass:"messages_msg-list"},[t("div",{class:["messages-list",{"attachments-preview-active":!!Object.keys(e.files).length}]},[t("div",{staticClass:"scroll-container"},[t("client-only",[t("vue-scroll",{ref:"chat",staticClass:"white-scroll-bg"},[t("div",{staticClass:"messages-list-items"},e._l(e.messagesByDate(e.group.id),(function(n,r){return t("div",{key:r,staticClass:"messages-list-items_group"},[t("div",{staticClass:"text-center"},[t("span",{staticClass:"btn btn--grey pointer-events-none"},[e._v("\n                   "+e._s(e.$formatDate(r,"[day], D MMM",e.$t("days-short"),!0)[e.locale])+"\n                 ")])]),e._v(" "),e._l(n,(function(n){return t("message-item",{key:n.id,attrs:{message:n,"raw-html":e.isChatBot},on:{"show-image":e.openLightbox}})}))],2)})),0)])],1)],1),e._v(" "),t("div",{directives:[{name:"touch",rawName:"v-touch:swipe.top",value:e.handleSwipeTop,expression:"handleSwipeTop",arg:"swipe",modifiers:{top:!0}}],staticClass:"inner-gallery-lightbox"},[e.isMobileBreakpoint?[t("FsLightbox",{key:e.lightboxKey,attrs:{toggler:e.toggleFsLightbox,sources:e.attachments,slide:e.currentSlide+1,onClose:e.refreshLightbox,onBeforeClose:e.onBeforeClose,disableThumbs:!0,onSlideChange:e.changeLightboxSlide}})]:e._e(),e._v(" "),t("transition-group",{attrs:{name:"fade"}},[e.showLightbox&&e.isMobileBreakpoint||!e.isMobileBreakpoint&&e.showImagesSlider?[t("div",{key:0,staticClass:"blur-bg"},[t("img",{attrs:{src:e.$withBaseUrl(e.attachments[e.currentSlide]),alt:""}})]),e._v(" "),e.isMobileBreakpoint?e._e():t("div",{key:1,staticClass:"blur-bg_slider"},[t("images-slider",{attrs:{"current-slide":e.currentSlide,slides:{main:e.attachments}},on:{close:e.closeLightbox,"slide-change":function(t){e.currentSlide=t}}})],1)]:e._e()],2)],2),e._v(" "),e.isChatBot?e._e():t("div",{staticClass:"messages-list-send"},[t("hr",{staticClass:"mb-0 mt-0"}),e._v(" "),t("message-send",{attrs:{disabled:e.disabledTexting,sending:e.sendingFiles,blocked:e.blocked||e.blockedBy,message:e.textareaMessage},on:{type:e.handleTyping,attach:e.handleFiles,send:e.submitMessage},model:{value:e.text,callback:function(t){e.text=t},expression:"text"}})],1)]),e._v(" "),e.showSuggestedMessages?t("div",{staticClass:"suggested-messages"},e._l(e.filteredSuggestedMessages,(function(title,i){return t("button",{key:i,staticClass:"btn btn--primary-outline",domProps:{innerHTML:e._s(title)},on:{click:function(t){return e.useSuggestedMessage(title)}}})})),0):e._e()]),e._v(" "),t("modal-popup",{attrs:{toggle:e.showRemoveModal,title:e.$t("are_you_sure_you_want_to_delete_the_message")},on:{close:function(t){e.showRemoveModal=!1}}},[t("form",{staticClass:"form",attrs:{novalidate:""},on:{submit:function(t){return t.preventDefault(),e.deleteGroup.apply(null,arguments)}}},[t("button",{class:["btn btn--green full-width",{pending:e.pending}],attrs:{type:"submit"}},[e._v("\n            "+e._s(e.$t("confirm"))+"\n         ")])])])],1)}),[function(){var e=this._self._c;return e("div",{staticClass:"divider"},[e("img",{attrs:{src:"/icons/registrationMarks_icons.svg",alt:"icons"}})])}],!1,null,null,null),S=j.exports;function L(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function T(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?L(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):L(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var A={name:"pages-profile-messages",middleware:"auth_general",mixins:[h.a,d.a],components:{ChatItem:f,ChatMessages:S},nuxtI18n:{paths:{az:"/profil/mesajlar"}},head:function(){return this.$headMeta({title:this.$t("messages")})},asyncData:function(e){return Object(c.a)(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.store,r=e.route,t.next=3,Promise.all([n.dispatch("getMessages",r.query.group),n.dispatch("getSuggestedMessages")]);case 3:if(!n.state.messages.length){t.next=6;break}return t.next=6,n.dispatch("getGroupMessages",n.state.messages[0].id);case 6:return t.abrupt("return",{activeGroupId:r.query.group||!1,activeMessage:!1,activeModalGroup:!1,showBlockedGroups:!1,searchValue:"",showControlsModal:!1,showDeleteModal:!1,showBlockModal:!1,pending:!1});case 7:case"end":return t.stop()}}),t)})))()},computed:T(T({},Object(l.c)(["messages","messagesByGroup"])),{},{crumbs:function(){return[{name:this.$t("messages")}]},filteredGroups:function(){var e=this;return this.messages.filter((function(t){return e.filterByBlock(t)&&(!e.searchValue.length||e.filterByGroupName(t).length)}))},activeGroupInterlocutor:function(){var e=this.messagesByGroup(this.activeGroupId);return e?e.sender_id==this.user.id?e.recipient:e.sender:{}},getBlockedUserIds:function(){var e;return(null===(e=this.user.blocked_users)||void 0===e?void 0:e.map((function(u){return u.block_to})))||[]},getBlockedByUserIds:function(){var e;return(null===(e=this.user.blocked_by_users)||void 0===e?void 0:e.map((function(u){return u.blocked_by})))||[]},getUserBlock:function(){return!!this.activeModalGroup&&(this.getBlockedUserIds.includes(this.getInterlocutor(this.activeModalGroup).id)?"unblock":"block")}}),methods:T(T({},Object(l.b)(["getGroupMessages","removeMessageGroup","blockUser"])),{},{filterByMessageText:function(e){var t=this;return this.searchValue.length?this.messages.find((function(t){return t.id==e})).messages.filter((function(e){return t.$search(e.text,t.searchValue)})).reverse().filter((function(e,i){return i<5})):[]},filterByGroupName:function(e){var t=this;return this.searchValue.length?[this.getInterlocutor(e).full_name,this.getAnnouncementTitle(e.announce||{})].filter((function(e){return t.$search(e,t.searchValue)})):[]},filterByBlock:function(e,t){void 0===t&&(t=this.showBlockedGroups);var n=this.getBlockedUserIds.includes(this.getInterlocutor(e).id);return t?n:!n},countGroups:function(){var e=this,t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this.messages.filter((function(n){return e.filterByBlock(n,t)&&(!e.searchValue.length||e.filterByGroupName(n).length)})).length},selectActiveGroup:function(e){var t=arguments,n=this;return Object(c.a)(regeneratorRuntime.mark((function r(){var o;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return o=t.length>1&&void 0!==t[1]&&t[1],r.next=3,n.getGroupMessages(e);case 3:n.$router.push({query:{group:e}}),n.activeMessage=o;case 5:case"end":return r.stop()}}),r)})))()},isBlocked:function(e){return[].concat(Object(r.a)(this.getBlockedUserIds),Object(r.a)(this.getBlockedByUserIds)).includes(this.getInterlocutor(e).id)},goToAnnouncement:function(e){var t=e.announce;if(1===t.status){var n=e.announce_type.replace("App\\","").toLowerCase();"announcement"===n?n="cars":["motorcycle","scooter","motoatv"].includes(n)?n="moto":"commercial"===n?n="commercial":"part"===n&&(n="parts"),6===e.announce.type?(n="registration-marks",this.$router.push(this.$localePath("/".concat(n,"/").concat(t.id_unique)))):this.$router.push(this.$localePath("/".concat(n,"/announcement/").concat(t.id_unique)))}},deleteChat:function(e){var t=this;return Object(c.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e&&(t.activeModalGroup=e),!t.pending){n.next=3;break}return n.abrupt("return");case 3:return t.pending=!0,n.prev=4,n.next=7,t.removeMessageGroup(t.activeModalGroup.id);case 7:t.activeGroupId&&t.$router.push({query:null}),t.setActiveFirstGroup(),t.$toasted.success(t.$t("message_removed")),t.showControlsModal=!1,t.pending=!1,n.next=17;break;case 14:n.prev=14,n.t0=n.catch(4),t.pending=!1;case 17:case"end":return n.stop()}}),n,null,[[4,14]])})))()},blockChat:function(e){var t=this;return Object(c.a)(regeneratorRuntime.mark((function n(){var r,o;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e&&(t.activeModalGroup=e),!t.pending){n.next=3;break}return n.abrupt("return");case 3:return t.pending=!0,n.prev=4,r=t.getInterlocutor(t.activeModalGroup).id,o=t.$t("you_".concat(t.getUserBlock,"ed_this_user")),n.next=9,t.blockUser({id:r});case 9:return n.next=11,t.$auth.fetchUser();case 11:t.showControlsModal=!1,t.connectEcho("user."+r).whisper("action",{userId:t.user.id,action:t.getUserBlock}),t.$toasted.success(o),t.pending=!1,n.next=20;break;case 17:n.prev=17,n.t0=n.catch(4),t.pending=!1;case 20:case"end":return n.stop()}}),n,null,[[4,17]])})))()},setActiveFirstGroup:function(){var e=this;setTimeout((function(){e.isMobileBreakpoint||!e.messages.length||e.activeGroupId||(e.activeGroupId=e.messages[0].id||!1)}),0)}}),watch:{$route:function(e){this.activeGroupId=e.query.group||!1}},mounted:function(){var e=this;this.$nextTick((function(){setTimeout((function(){e.connectEcho().listenForWhisper("action",(function(data){data.userId!=e.user.id&&e.$auth.fetchUser()})),e.isMobileBreakpoint||e.setActiveFirstGroup()}),0)}))}},U=A,P=(n(1401),Object(v.a)(U,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"pages-profile-messages pt-0 pt-lg-5 pb-0 pb-lg-5"},[t("div",{staticClass:"container"},[t("breadcrumbs",{attrs:{crumbs:e.crumbs}}),e._v(" "),t("div",{class:["messages",{empty:!e.messages.length,"no-send-input":3==e.activeGroupInterlocutor.id}]},[t("div",{staticClass:"row flex-lg-nowrap"},[e.isMobileBreakpoint&&!1!==e.activeGroupId?e._e():t("div",{staticClass:"col-auto"},[t("div",{staticClass:"card messages-card"},[e.messages.length?[t("div",{staticClass:"pl-3 pr-3 pt-2 pb-2 pl-lg-4 pr-lg-4 pt-lg-3 pb-lg-3"},[t("form-text-input",{attrs:{"icon-name":"search","block-class":"placeholder-lighter",placeholder:e.$t("message_or_name")},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}})],1),e._v(" "),t("hr",{staticClass:"mt-0 mb-0"})]:e._e(),e._v(" "),t("div",{staticClass:"messages_chat-list"},[t("client-only",[t("vue-scroll",{staticClass:"white-scroll-bg"},[t("div",{staticClass:"chat-list-switch cursor-pointer",on:{click:function(t){e.showBlockedGroups=!e.showBlockedGroups}}},[e.showBlockedGroups?[t("span",{staticClass:"switch-icon"},[t("icon",{attrs:{name:"chat"}})],1),e._v(" "),t("span",{staticClass:"switch-text"},[e._v(e._s(e.$t("chat_list")))]),e._v(" "),t("span",{staticClass:"switch-count text-dark-blue-3"},[e._v(e._s(e.countGroups(!1)))])]:[t("span",{staticClass:"switch-icon text-dark-blue-2"},[t("icon",{attrs:{name:"block"}})],1),e._v(" "),t("span",{staticClass:"switch-text text-dark-blue-2"},[e._v(e._s(e.$t("blocked_users")))]),e._v(" "),t("span",{staticClass:"switch-count text-dark-blue-3"},[e._v(e._s(e.countGroups(!0)))])]],2),e._v(" "),t("div",{staticClass:"chat-list-items"},[e.messages.length?[e._l(e.filteredGroups,(function(n){return t("chat-item",{key:n.id,attrs:{group:e.messagesByGroup(n.id),blocked:e.isBlocked(n),active:e.activeGroupId==n.id},on:{"select-group":e.selectActiveGroup,"show-modal":function(t){e.activeModalGroup=n,e.showControlsModal=!0}}})})),e._v(" "),e.filteredGroups.length?e._e():[t("div",{staticClass:"pl-4 pr-1"},[t("hr",{staticClass:"mt-0"}),e._v(" "),t("p",{staticClass:"text-center mt-2"},[e._v("\n                                          "+e._s(e.searchValue?e.$t("no_results_found"):e.$t("no_blocked_users"))+"\n                                       ")])])]]:[t("nuxt-link",{staticClass:"chat-item d-block",attrs:{to:e.$localePath("/")}},[t("div",{staticClass:"d-flex"},[t("img",{staticClass:"chat-avatar",attrs:{src:"/img/user.jpg",alt:e.$t("no_messages")}}),e._v(" "),t("div",{staticClass:"chat-info"},[t("div",{staticClass:"chat-first-line"},[t("span",{staticClass:"text-medium"},[e._v(e._s(e.$t("no_messages")))])]),e._v(" "),t("div",{staticClass:"chat-details"},[t("span",[e._v(e._s(e.$t("start_conversation_from_announcement")))])])])])])]],2)])],1)],1)],2)]),e._v(" "),e.isMobileBreakpoint&&!1===e.activeGroupId?e._e():t("div",{staticClass:"col-auto"},[t("div",{staticClass:"card messages-card"},[e.messages.length&&!1!==e.activeGroupId&&e.messagesByGroup(e.activeGroupId)?t("chat-messages",{attrs:{group:e.messagesByGroup(e.activeGroupId),"chat-user":e.activeGroupInterlocutor,blocked:e.getBlockedUserIds.includes(e.activeGroupInterlocutor.id),"blocked-by":e.getBlockedByUserIds.includes(e.activeGroupInterlocutor.id),"message-pin":e.activeMessage},on:{"go-back":function(t){e.activeGroupId=!1},"go-to-announcement":e.goToAnnouncement,"block-chat":e.blockChat,"delete-chat":e.deleteChat}}):e._e()],1)])]),e._v(" "),e.getInterlocutor(e.activeModalGroup)?t("modal-popup",{attrs:{toggle:e.showControlsModal,title:e.getInterlocutor(e.activeModalGroup).full_name},on:{close:function(t){e.showControlsModal=!1}}},[t("ul",{staticClass:"list-line-separated"},[t("li",{key:"block",staticClass:"cursor-pointer",on:{click:function(t){return e.blockChat()}}},[t("icon",{staticClass:"text-dark-blue-2",attrs:{name:e.getUserBlock}}),e._v("\n                  "+e._s(e.$t(e.getUserBlock+"_user"))+"\n               ")],1),e._v(" "),t("li",{key:"clear",staticClass:"cursor-pointer",on:{click:function(t){return e.deleteChat()}}},[t("icon",{attrs:{name:"garbage"}}),e._v(" "),e._v("\n                  "+e._s(e.$t("clear_chat"))+"\n               ")],1)])]):e._e()],1)],1)])}),[],!1,null,null,null));t.default=P.exports}}]);