<template>
   <div style="width: calc(50% - 6px)">
      <button :class="['btn btn--light-outline full-width',{'d-none': hideButton }, { pending }]"
              style="min-height: 52px;border-radius: 8px"
              type="button" @click="openFiles">
         {{ $t('watch_files') }}
      </button>
      <template v-if="pending">
         <loader/>
      </template>
      <template v-else>

         <div v-if="slides.main" v-touch:swipe.top="handleSwipeTop" class="inner-gallery-lightbox">

            <!--mobile-->
            <template v-if="isMobileBreakpoint">
               <FsLightbox
                  :key="lightboxKey"
                  :disableThumbs="true"
                  :onBeforeClose="onBeforeClose"
                  :onClose="refreshLightbox"
                  :onSlideChange="changeLightboxSlide"
                  :slide="currentSlide + 1"
                  :sources="slides.main"
                  :toggler="toggleFsLightbox"
                  :types="slides.types"
               />
            </template>


            <transition-group name="fade">
               <template v-if="showSliderTemplate">

                  <div :key="0" class="blur-bg">
                     <img v-if="slides.types[currentSlide] === 'image'" :src="$withBaseUrl(slides.thumbs[currentSlide])"
                          alt=""/>
                  </div>


                  <!--                  desktop-->
                  <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">
                     <protocol-images-slider
                        :current-slide="currentSlide"
                        :has-sidebar="true"
                        :slides="slides"
                        isProtocol
                        @close="closeLightbox"
                        @slide-change="currentSlide = $event"
                     >

                        <template #sidebar>
                           <protocol-slider-info :protocol="protocol"/>
                        </template>
                     </protocol-images-slider>

                  </div>
               </template>
            </transition-group>


         </div>
      </template>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import FsLightbox from 'fslightbox-vue';

import ImagesSlider from '~/components/elements/ImagesSlider';
import ProtocolImagesSlider from "~/components/elements/ProtocolImagesSlider";
import ProtocolSliderInfo from "~/components/garage/ProtocolSliderInfo";

export default {
   props: {
      protocol: Object,
      mediaIsOpen: Boolean,
   },
   components: {
      ProtocolImagesSlider,
      FsLightbox,
      ImagesSlider,
      ProtocolSliderInfo,
   },
   data() {
      return {
         pending: false,
         toggleFsLightbox: false,
         showLightbox: false,
         showImagesSlider: false,
         lightboxKey: 0,
         currentSlide: 0,
         hideButton: false,
      }
   },
   computed: {
      ...mapGetters({
         files: 'garage/protocolFiles'
      }),

      showSliderTemplate() {
         if (this.isMobileBreakpoint) {
            return this.showLightbox
         } else {
            return this.showImagesSlider
         }
      },

      slides() {
         let thumbs = [], main = [], types = [];
         let hasVideo = !this.files.videoError && this.files.video?.url;
         let hasImages = this.files.data?.length > 0;
         if (!hasVideo && !hasImages) return [];
         if (hasVideo) {
            main.push(this.files.video.url);
            thumbs.push(''); // this.files.video.thumbnail
            types.push('video');
         }
         if (hasImages) {
            main = [...main, ...this.files.data.map(img => img.src)];
            thumbs = [...thumbs, ...this.files.data.map(img => img.src)];
            types = [...types, ...this.files.data.map(_ => 'image')];
         }
         return {thumbs, main, types};
      }
   },
   methods: {
      ...mapActions({
         getProtocolFiles: 'garage/getProtocolFiles'
      }),

      async openFiles() {
         this.hideButton = true;
         this.$emit('mediaOpened', true);
         if (this.files.din_id === this.protocol.din_id) {
            this.openLightbox();
            return;
         }
         if (this.pending) return;
         this.pending = true;
         try {
            const res = await this.getProtocolFiles({din_id: this.protocol.din_id});
            this.pending = false;
            if (res.status === 'success') {
               this.openLightbox();
            }

         } catch (err) {
            this.pending = false;
         }
      },
      // lightbox
      openLightbox() {


         this.currentSlide = 0;
         if (this.isMobileBreakpoint) {
            this.showLightbox = true;
            this.toggleFsLightbox = !this.toggleFsLightbox;
         } else {
            this.$emit("closeDetailsWindow", true);
            setTimeout(() => {
               this.showImagesSlider = true;
            }, 1000)
         }
         this.setBodyOverflow('hidden');


      },
      refreshLightbox() {
         console.log("refreshLightbox")
         this.onBeforeClose();
         this.lightboxKey++;
      },
      onBeforeClose() {
         console.log("onBeforeClose")
         this.showLightbox = false;
         this.setBodyOverflow('scroll');
         this.$emit('mediaClosed', true);
         this.hideButton = false

      },
      changeLightboxSlide(fsBox) {
         console.log("changeLightboxSlide")
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         console.log("closeLightbox")
         this.hideButton = false;
         if (this.isMobileBreakpoint) {
            console.log("closeLightbox  s.isMobileBreakpoint")
            if (this.showLightbox) {
               console.log("closeLightbox  showLightbox")
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         } else {
            console.log("closeLightbox  !isMobileBreakpoint")
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }
         this.$emit('mediaClosed', true)
      },
      handleSwipeTop() {
         if (document?.body?.classList.contains('zooming')) return;
         this.closeLightbox();
      },


      restSpecs(protocol) {
         return {
            protocol_took_place: protocol.address,
            protocol_article: protocol.law_item,
         }
      },

   },
   watch: {
      breakpoint() {
         this.showImagesSlider = false;
         if (this.showSlider)
            this.updateTouchEvents();
         this.refreshLightbox();
      }
   }
}
</script>

<style lang="scss" scoped>
.ma-left__content {
   p {
      font: 400 16px/20px 'TTHoves';
   }
}

.ma-penalties__card--body__penalties--item {
   padding-left: 0;
   padding-right: 0;
}
</style>
