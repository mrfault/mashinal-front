(window.webpackJsonp=window.webpackJsonp||[]).push([[133],{1278:function(t,e,o){var content=o(1457);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(39).default)("52c92ce1",content,!0,{sourceMap:!1})},1456:function(t,e,o){"use strict";o(1278)},1457:function(t,e,o){var n=o(38)((function(i){return i[1]}));n.push([t.i,".pnlm-container *{box-sizing:border-box}.pnlm-ui .pnlm-about-msg{display:none!important}.pnlm-lmsg{display:none}.pnlm-load-box{background-color:rgba(0,0,0,.7);border-radius:3px;color:#fff;display:none;font-size:20px;height:80px;left:50%;margin:auto;position:absolute;text-align:center;top:50%;transform:translate(-50%,-50%);width:170px}.pnlm-lbar{border:1px solid #fff;height:6px;margin:0 auto;width:100px}.pnlm-load-box p{font-size:13px;margin:17px 0}.pnlm-ui .pnlm-orientation-button{display:none!important}.vue-pannellum{position:relative}.default-slot{bottom:0;left:0;position:absolute;z-index:2}",""]),n.locals={},t.exports=n},1599:function(t,e,o){"use strict";o.r(e);o(8),o(7),o(3),o(2),o(10),o(4),o(11);var n=o(0),r=o(28),l=(o(52),o(1452),o(1453),o(1455));function h(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(object);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,o)}return e}var c={props:{onFsLightBox:{type:Boolean,default:!1},debug:{type:Boolean,default:!1},src:{type:[String,Object],required:!0},preview:{type:String,default:""},autoLoad:{type:Boolean,default:!0},autoRotate:{type:[Number,Boolean],default:0},orientation:{type:Boolean,default:!1},draggable:{type:Boolean,default:!0},mouseZoom:{type:Boolean,default:!0},doubleClickZoom:{type:Boolean,default:!0},showInfo:{type:Boolean,default:!1},showZoom:{type:Boolean,default:!1},showFullscreen:{type:Boolean,default:!1},compass:{type:Boolean,default:!1},hotSpots:{type:Array,default:function(){return[]}},hfov:{type:Number,default:75},minHfov:{type:Number,default:30},maxHfov:{type:Number,default:120},yaw:{type:Number,default:0},pitch:{type:Number,default:0},crossOrigin:{type:String,default:"anonymous"}},data:function(){return{viewer:null,info:"",rafId:-1}},computed:{srcOption:function(){if("string"==typeof this.src)return{type:"equirectangular",panorama:this.src,hotSpots:this.hotSpots};if("object"===Object(r.a)(this.src)){if(this.src.px&&this.src.ny)return{type:"cubemap",cubeMap:[this.src.pz,this.src.px,this.src.nz,this.src.nx,this.src.py,this.src.ny],hotSpots:this.hotSpots};if(this.src.scenes)return{default:this.src.default,scenes:this.src.scenes};console.error("[vue-pannellum] Unknown src type")}else console.error("[vue-pannellum] Unknown src type: "+Object(r.a)(this.src))}},watch:{src:function(t){this.$el.innerHTML="",this.$nextTick(this.load)},hfov:function(t){this.viewer&&this.viewer.setHfov(t,!1)},yaw:function(t){this.viewer&&this.viewer.setYaw(t,!1)},pitch:function(t){this.viewer&&this.viewer.setPitch(t,!1)},maxHfov:function(t){this.viewer&&this.viewer.setHfovBounds([this.minHfov,this.maxHfov])},minHfov:function(t){this.viewer&&this.viewer.setHfovBounds([this.minHfov,this.maxHfov])},autoRotate:function(t){t?this.viewer.startAutoRotate():(this.viewer.stopAutoRotate(),this.orientation&&this.viewer.startOrientation())},orientation:function(t){t?this.viewer.startOrientation():(this.viewer.stopOrientation(),this.autoRotate&&this.viewer.startAutoRotate())}},mounted:function(){this.load(),this.rafId=window.requestAnimationFrame(this.loop)},beforeDestroy:function(){this.viewer.destroy(),window.cancelAnimationFrame(this.rafId)},methods:{load:function(){var t=this,e=function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?h(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):h(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({strings:{loadButtonLabel:"Click to<br>Load<br>Panorama",loadingLabel:this.$t("Loading"),bylineLabel:"by %s",noPanoramaError:"No panorama image was specified.",fileAccessError:"The file %s could not be accessed.",malformedURLError:"There is something wrong with the panorama URL.",iOS8WebGLError:"Due to iOS 8's broken WebGL implementation, only progressive encoded JPEGs work for your device (this panorama uses standard encoding).",genericWebGLError:"Your browser does not have the necessary WebGL support to display this panorama.",textureSizeError:"This panorama is too big for your device! It's %spx wide, but your device only supports images up to %spx wide. Try another device. (If you're the author, try scaling down the image.)",unknownError:"Unknown error. Check developer console."},autoLoad:this.autoLoad,autoRotate:!0===this.autoRotate?-2:0,orientationOnByDefault:this.orientation,draggable:this.draggable,mouseZoom:this.mouseZoom,doubleClickZoom:this.doubleClickZoom,compass:this.compass,preview:this.preview,hfov:this.hfov,yaw:this.yaw,pitch:this.pitch,minHfov:this.minHfov,maxHfov:this.maxHfov,crossOrigin:this.crossOrigin},this.srcOption);if(this.viewer=window.pannellum.viewer(this.$el,e),this.viewer.on("load",(function(){t.$emit("load")})),this.viewer.on("error",(function(e){t.$emit("error",e)})),!1===this.showInfo){var o=this.$el.querySelector(".pnlm-panorama-info");o&&(o.style.visibility="hidden")}if(!1===this.showZoom){var r=this.$el.querySelector(".pnlm-zoom-controls");r&&(r.style.display="none")}if(!1===this.showFullscreen){var l=this.$el.querySelector(".pnlm-fullscreen-toggle-button");l&&(l.style.display="none")}},loop:function(){this.rafId=window.requestAnimationFrame(this.loop);var t=this.viewer.getHfov(),e=this.viewer.getYaw(),o=this.viewer.getPitch();o>90?o=90:o<-90&&(o=-90),t!=this.hfov&&this.$emit("update:hfov",t),e!=this.yaw&&this.$emit("update:yaw",e),o!=this.pitch&&this.$emit("update:pitch",o)},onMouseUp:function(){this.debug&&(this.info+=" mu"),this.debounceRotate()},onTouchMove:function(){this.debug&&(this.info+=" tm")},onTouchEnd:function(){this.debug&&(this.info+=" te"),this.debounceRotate()},debounceRotate:o.n(l)()((function(){this.orientation?this.viewer.startOrientation():this.autoRotate&&this.viewer.startAutoRotate()}),3e3)}},f=c,d=(o(1456),o(12)),component=Object(d.a)(f,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"vue-pannellum",staticStyle:{background:"none",width:"100%",height:"100vh","max-height":"493px"},on:{mouseup:t.onMouseUp,touchmove:t.onTouchMove,touchend:t.onTouchEnd}},[e("div",{staticClass:"default-slot"},[t._t("default")],2)])}),[],!1,null,null,null);e.default=component.exports}}]);