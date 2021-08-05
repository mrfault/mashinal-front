<template>
  <div class="inner-thumbs-gallery">
    <div class="swiper-container" v-swiper:thumbsSwiper="swiperOps">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :key="index" v-for="(slide, index) in thumbs">
          <div @click="$nuxt.$emit('show-lightbox', index)"
            @mouseenter="$nuxt.$emit('show-gallery-slide', index)"
            :class="['swiper-slide-bg', {'yt-play': where === 'announcement' && announcement.youtube_id && index === 1}]" 
            :style="{backgroundImage: `url('${slide}')` }"
            role="img"
            aria-label=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  props: {
    where: {
      type: String,
      default: 'announcement'
    },
    media: {}
  },
  data() {
    return {
      swiperOps: {
        slidesPerView: 'auto',
        spaceBetween: 20,
        init: false
      }
    }
  },
  methods: {
    getMediaByKey(media, key) {
      key = media[key] ? key : Object.keys(media)[0];
      return media[key] instanceof Array ? media[key].map(item => `${this.$env.BASE_URL}${item}`) : [];
    }
  },
  computed: {
    ...mapGetters(['announcement']),

    thumbs() {
      let thumbs = [];
      if (this.where === 'catalog') {
        thumbs = this.getMediaByKey(this.media, 'thumb');
      } else if (this.where === 'announcement') {
        let media = this.announcement.media;
        let yt_video = this.announcement.youtube_id;
        if (media.length === 0) return [];
        thumbs = this.getMediaByKey(media, 'main');
        if (yt_video) {
          thumbs.splice(1, 0, `https://img.youtube.com/vi/${yt_video}/hqdefault.jpg`);
        }
      }
      return thumbs;
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.thumbsSwiper.init();
      }, 0);
    });
  }
}
</script>