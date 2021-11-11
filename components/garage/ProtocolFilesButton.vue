<template>
  <div>
    <button type="button" :class="['btn btn--green-outline full-width', { pending }]" @click="openFiles">
      {{ $t('watch_files') }}
    </button>
    <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop" v-if="slides.main">
      <template v-if="isMobileBreakpoint">
        <FsLightbox
          :toggler="toggleFsLightbox"
          :sources="slides.main"
          :types="slides.types"
          :slide="currentSlide + 1"
          :key="lightboxKey"
          :onClose="refreshLightbox"
          :onBeforeClose="onBeforeClose"
          :disableThumbs="true"
          :onSlideChange="changeLightboxSlide"
        />
      </template>
      <transition-group name="fade">
        <template v-if="(showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && showImagesSlider)">
          <div class="blur-bg" :key="0">
            <img :src="$withBaseUrl(slides.thumbs[currentSlide])" alt="" v-if="slides.types[currentSlide] === 'image'" />
          </div>
          <div class="blur-bg_slider" :key="1" v-if="!isMobileBreakpoint">
            <images-slider 
              :current-slide="currentSlide"
              :slides="slides" 
              :has-sidebar="true"
              @close="closeLightbox"
              @slide-change="currentSlide = $event" 
            >
              <template #sidebar>
                <slot />
              </template>
            </images-slider>
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
      return { thumbs, main, types };
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
        const res = await this.getProtocolFiles({ din_id: this.protocol.din_id });
        this.pending = false;
        if (res.status === 'success') {
          this.openLightbox();
        }
      } catch(err) {
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
        this.showImagesSlider = true;
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