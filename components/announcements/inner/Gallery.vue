<template>
  <div class="inner-gallery">
    <div class="position-relative">
      <div class="swiper-container" v-swiper:gallerySwiper="swiperOps" ref="gallerySwiper" v-if="showSlider">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.main">
            <div
              :class="['swiper-slide-bg swiper-lazy', {'yt-play': showYtVideo(index)}]" 
              :data-background="showYtVideo(index) ? getYtVideoImage('hq') : slide"
            >
              <loader />
            </div>
          </div>
        </div>
      </div>
      <div class="gallery-overlay" v-if="showSlider">
        <div class="gallery-overlay_top d-flex">
          <template v-if="where === 'announcement'">
            <span class="badge from-border" v-if="announcement.is_autosalon || announcement.is_part_salon">
              {{ $t(announcement.is_part_salon ? 'shop' : 'is_autosalon') }}
            </span>
            <span class="d-flex">
              <!-- here badges can be placed -->
            </span>
          </template>
        </div>
        <div class="gallery-overlay_middle">
          <span class="d-flex justify-content-between">
            <button id="gallery-prev" class="btn-sq" @click.stop="slidePrev">
              <icon name="chevron-left" />
            </button>
            <button id="gallery-next" class="btn-sq" @click.stop="slideNext">
              <icon name="chevron-right" />
            </button>
          </span>
        </div>
        <div class="gallery-overlay_bottom d-flex">
          <template v-if="where === 'announcement'">
            <span class="d-flex">
              <template v-if="announcement.status == 1">
                <add-comparison :id="announcement.id_unique" v-if="announcement.car_catalog" />
                <add-favorite :announcement="announcement" />
              </template>
            </span>
            <add-complaint :announcement="announcement" />
          </template>
          <template v-else>
            <add-comparison :id="announcement.id_unique" v-if="announcement.car_catalog" />
          </template>
        </div>
      </div>
      <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
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
              <img :src="showYtVideo(currentSlide) ? getYtVideoImage('hq') : $withBaseUrl(slides.main[currentSlide])" alt="" />
            </div>
            <div class="blur-bg_announcement-info" :key="1" v-if="isMobileBreakpoint">
              <div class="inner-gallery-lightbox-footer">
                <template v-if="where === 'announcement'">
                  <h3>{{ getAnnouncementTitle(announcement) }}</h3>
                  <h4>{{ announcement.price }}</h4>
                  <div class="row" v-if="announcement.status != 3">
                    <div class="col" v-if="canSendMessage(announcement)">
                      <chat-button :announcement="announcement" :className="'white-outline'" />
                    </div>
                    <div class="col">
                      <call-button :phone="announcement.user.phone" />
                    </div>
                  </div>
                </template>
                <template v-else-if="where === 'catalog'">
                  <h3 v-html="title"></h3>
                  <h4 v-html="subtitle"></h4>
                </template>
              </div>
            </div>
            <div class="blur-bg_slider" :key="2" v-else>
              <images-slider 
                :current-slide="currentSlide"
                :slides="slides" 
                :has-sidebar="where === 'announcement'"
                @close="closeLightbox"
                @slide-change="currentSlide = $event" 
              >
                <template #sidebar v-if="where === 'announcement'" >
                  <slot />
                </template>
              </images-slider>
            </div>
          </template> 
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import FsLightbox from 'fslightbox-vue';
import CallButton from '~/components/announcements/CallButton';
import ChatButton from '~/components/announcements/ChatButton';
import AddFavorite from '~/components/announcements/AddFavorite';
import AddComparison from '~/components/announcements/AddComparison';
import AddComplaint from '~/components/announcements/AddComplaint';
import ImagesSlider from '~/components/elements/ImagesSlider';

export default {
  props: {
    where: {
      type: String,
      default: 'announcement'
    },
    media: {},
    title: String,
    subtitle: String,
    showSlider: {
      type: Boolean,
      default: true
    }
  },
  components: {
    FsLightbox,
    CallButton,
    ChatButton,
    AddFavorite,
    AddComparison,
    AddComplaint,
    ImagesSlider
  },
  data() {
    return {
      toggleFsLightbox: false,
      showImagesSlider: false,
      showLightbox: false,
      lightboxKey: 0,
      currentSlide: 0,
      swiperOps: {
        init: false,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader'
        }
      }
    }
  },
  methods: {
    openLightbox(index) {
      if (index || index === 0) {
        this.currentSlide = index;
      }
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
    changeSlide(index) {
      if (!this.showSlider) return;
      this.gallerySwiper.slideTo(index + 1, 0);
    },
    slidePrev() {
      if (!this.showSlider) return;
      this.gallerySwiper.slidePrev();
    },
    slideNext() {
      if (!this.showSlider) return;
      this.gallerySwiper.slideNext();
    },
    changeLightboxSlide(fsBox) {
      if (!this.showLightbox) return;
      this.currentSlide = fsBox.stageIndexes.current;
      this.changeSlide(this.currentSlide);
    },
    getMediaByKey(media, key) {
      key = media[key] ? key : Object.keys(media)[0];
      return media[key] instanceof Array ? media[key].map(item => this.$withBaseUrl(item)) : [];
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
      if (document.body.classList.contains('zooming')) return;
      this.closeLightbox();
    },
    showYtVideo(index) {
      return this.announcement?.youtube_id && index === 1;
    },
    getYtVideoImage(size) {
      return `https://img.youtube.com/vi/${this.announcement.youtube_id}/${size}default.jpg`;
    },
    updateTouchEvents() {
      this.gallerySwiper.simulateTouch = this.isMobileBreakpoint;
      this.gallerySwiper.allowTouchMove = this.isMobileBreakpoint;
    }
  },
  computed: {
    ...mapGetters(['announcement']),

    slides() {
      let thumbs = [], main = [], types = [], hasVideo = false;
      if (this.where === 'catalog') {
        thumbs = this.getMediaByKey(this.media, 'thumb');
        main = this.getMediaByKey(this.media, 'main');
      } else if (this.where === 'announcement') {
        let media = this.announcement.media;
        if (media.length === 0) return [];
        thumbs = this.getMediaByKey(media, 'thumb_inner');
        main = this.getMediaByKey(media, 'main_inner');
        if (this.announcement.youtube_id) {
          hasVideo = true;
          thumbs.splice(1, 0, this.getYtVideoImage('hq'));
          main.splice(1, 0, `https://www.youtube.com/watch?v=${this.announcement.youtube_id}`);
        }
      } else if (this.where === 'salon') {
        thumbs = this.media[1];
        main = this.media[0];
      }
      types = main.map(_ => 'image');
      if (hasVideo) types.splice(1, 0, 'youtube');
      return { thumbs, main, types };
    }
  },
  watch: {
    breakpoint() {
      this.showImagesSlider = false;
      if (this.showSlider) 
        this.updateTouchEvents();
      this.refreshLightbox();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.showSlider) {
        setTimeout(() => {
          this.gallerySwiper.init();
          this.gallerySwiper.on('slideChange', () => {
            this.currentSlide = this.gallerySwiper.realIndex;
          });
          this.gallerySwiper.on(this.isMobileBreakpoint ? 'click': 'click tap touchEnd', () => {
            this.openLightbox(this.currentSlide);
          });
          this.updateTouchEvents();
        }, 100);
      }
      
      if (this.showSlider) this.$nuxt.$on('show-gallery-slide', this.changeSlide);
      this.$nuxt.$on('show-lightbox', this.openLightbox);
    });
  },
  beforeDestroy() {
    if (this.showSlider) this.$nuxt.$off('show-gallery-slide', this.changeSlide);
    if (this.showImagesSlider || this.showLightbox) this.closeLightbox();
    this.$nuxt.$off('show-lightbox', this.openLightbox);
  }
}
</script>