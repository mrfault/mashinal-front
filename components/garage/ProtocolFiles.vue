<template>
   <div style="width: calc(50% - 6px)">
      <button :class="['btn btn--green-outline full-width', { pending }]" type="button" @click="openFiles">
         {{ $t('watch_files') }}
      </button>
      <div v-if="slides.main" v-touch:swipe.top="handleSwipeTop" class="inner-gallery-lightbox">
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
            <template v-if="(showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && showImagesSlider)">
               <div :key="0" class="blur-bg">
                  <img v-if="slides.types[currentSlide] === 'image'" :src="$withBaseUrl(slides.thumbs[currentSlide])"
                       alt=""/>
               </div>
               <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">
                  <images-slider
                     :current-slide="currentSlide"
                     :has-sidebar="true"
                     :slides="slides"
                     @close="closeLightbox"
                     @slide-change="currentSlide = $event"
                  >
                     <template #sidebar>
                        <slot/>
                     </template>
                  </images-slider>
               </div>
            </template>
         </transition-group>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import FsLightbox from 'fslightbox-vue';

import ImagesSlider from '~/components/elements/ImagesSlider';

export default {
   props: {
      protocol: {}
   },
   components: {
      FsLightbox,
      ImagesSlider
   },
   data() {
      return {
         pending: false,
         toggleFsLightbox: false,
         showLightbox: false,
         showImagesSlider: false,
         lightboxKey: 0,
         currentSlide: 0,
      }
   },
   computed: {
      ...mapGetters({
         files: 'garage/protocolFiles'
      }),

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
         this.onBeforeClose();
         this.lightboxKey++;
      },
      onBeforeClose() {
         this.showLightbox = false;
         this.setBodyOverflow('scroll');
      },
      changeLightboxSlide(fsBox) {
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         } else {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }
      },
      handleSwipeTop() {
         if (document?.body?.classList.contains('zooming')) return;
         this.closeLightbox();
      }
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
