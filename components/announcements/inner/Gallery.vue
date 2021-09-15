<template>
  <div class="inner-gallery">
    <div class="position-relative">
      <div class="swiper-container" v-swiper:gallerySwiper="swiperOps" ref="gallerySwiper" v-if="showSlider">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.main">
            <div @click="currentSlide = index, openLightbox()"
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
            <span class="badge from-border" v-if="announcement.is_autosalon">{{ $t(announcement.title ? 'shop' : 'is_autosalon') }}</span>
            <span class="d-flex">
              <span class="badge squared" v-if="announcement.type[1]">
                <icon name="vip" />
              </span>
              <span class="badge squared" v-if="announcement.type[2]">
                <icon name="premium" />
              </span>
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
              <add-comparison :id="announcement.id_unique" v-if="announcement.car_catalog" />
              <add-favorite :announcement="announcement" />
            </span>
            <add-complaint :announcement="announcement" />
          </template>
          <template v-else>
            <add-comparison :announcement="announcement" v-if="announcement.car_catalog" />
          </template>
        </div>
      </div>
      <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
        <FsLightbox
          :toggler="toggleFsLightbox"
          :sources="slides.main"
          :types="slides.types"
          :slide="currentSlide + 1"
          :key="lightboxKey"
          :onClose="refreshLightbox"
          :onBeforeClose="onBeforeClose"
          :showThumbsOnMount="!isMobileBreakpoint"
          :disableThumbs="isMobileBreakpoint"
          :onSlideChange="changeLightboxSlide"
        />
        <transition-group name="fade">
          <div v-if="showLightbox" class="fslightbox-blur-bg" :key="0">
            <img :src="showYtVideo(currentSlide) ? getYtVideoImage('hq') : $withBaseUrl(slides.main[currentSlide])" alt="" />
          </div>
          <div v-if="showLightbox" class="fslightbox-footer d-lg-none" :key="1">
            <div class="inner-gallery-lightbox-footer">
              <template v-if="where === 'announcement'">
                <h3>{{ getAnnouncementTitle(announcement) }}</h3>
                <h4>{{ announcement.price }}</h4>
                <div class="row">
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
    AddComplaint
  },
  data() {
    return {
      toggleFsLightbox: false,
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
      if (index) this.currentSlide = index;
      this.showLightbox = true;
      this.toggleFsLightbox = !this.toggleFsLightbox;
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
      this.currentSlide = fsBox.stageIndexes.current;
      this.changeSlide(this.currentSlide);
    },
    getMediaByKey(media, key) {
      key = media[key] ? key : Object.keys(media)[0];
      return media[key] instanceof Array ? media[key].map(item => this.$withBaseUrl(item)) : [];
    },
    closeLightbox() {
      if (this.showLightbox) {
        this.toggleFsLightbox = !this.toggleFsLightbox;
      }
    },
    handleSwipeTop() {
      if (document.querySelector('body').classList.contains('zooming')) return;
      this.closeLightbox();
    },
    showYtVideo(index) {
      return this.announcement?.youtube_id && index === 1;
    },
    getYtVideoImage(size) {
      return `https://img.youtube.com/vi/${this.announcement.youtube_id}/${size}default.jpg`;
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
        thumbs = this.getMediaByKey(media, 'main');
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
      this.refreshLightbox();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.showSlider) {
        setTimeout(() => {
          this.gallerySwiper.init();
        }, 0);
      }
      
      if (this.showSlider) this.$nuxt.$on('show-gallery-slide', this.changeSlide);
      this.$nuxt.$on('show-lightbox', this.openLightbox);
    });
  },
  beforeDestroy() {
    if (this.showSlider) this.$nuxt.$off('show-gallery-slide', this.changeSlide);
    this.$nuxt.$off('show-lightbox', this.openLightbox);
  }
}
</script>