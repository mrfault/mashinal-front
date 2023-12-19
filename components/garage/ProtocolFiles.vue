<template>
   <div class="ma-protocol-files">
      <button :class="['btn btn--light-outline full-width',{'d-none': hideButton }, { pending }]"
              style="min-height: 52px;border-radius: 8px"
              type="button" @click="openFiles">
                  {{ $t('watch_files') }}
      </button>
      <div>
         <template v-if="pending">
            <loader/>
         </template>
         <div v-if="slides.main && !pending" v-touch:swipe.top="handleSwipeTop" class="inner-gallery-lightbox">

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


            <template v-if="!isMobileBreakpoint">
               <transition-group name="fade">
                  <template v-if="showSliderTemplate">

                     <div :key="0" class="blur-bg">
                        <img v-if="slides.types[currentSlide] === 'image'"
                             :src="$withBaseUrl(slides.thumbs[currentSlide])"
                             alt=""/>
                     </div>


                     <!--                  desktop-->
                     <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">
                        <images-slider
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
                        </images-slider>
                     </div>
                  </template>
               </transition-group>
            </template>


         </div>
      </div>
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
               if (!this.isMobileBreakpoint) {
                  this.$emit('mediaOpened', true);
               }
               if (this.isMobileBreakpoint) {
                  this.$emit('mobileMediaOpened')
               }
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
         this.$emit('mobileMediaClosed', true);
         this.onBeforeClose();
         this.lightboxKey++;
      },
      onBeforeClose() {
         this.showLightbox = false;
         this.setBodyOverflow('scroll');
         if (this.isMobileBreakpoint) {
            this.$emit('mobileMediaClosed', true);
         } else {
            this.$emit('mediaClosed', true);
         }
         this.hideButton = false

      },
      changeLightboxSlide(fsBox) {
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         this.hideButton = false;
         this.$emit('mediaClosed', true)
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         }
         if (!this.isMobileBreakpoint) {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }

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

