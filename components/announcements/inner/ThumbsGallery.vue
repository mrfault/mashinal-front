<template>
   <div class="inner-thumbs-gallery">
      <div class="swiper-container" v-swiper:thumbsSwiper="swiperOps">
         <div class="swiper-wrapper">
            <div class="swiper-slide" :key="index" v-for="(slide, index) in announcement?.media?.main">
               <div
                  @click="$nuxt.$emit('show-lightbox', index)"
                  @mouseenter="$nuxt.$emit('show-gallery-slide', index)"
                  :class="[
                     'swiper-slide-bg',
                  ]"
                  :style="{backgroundImage: `url('${slide.main_inner}')` }"
                  role="img"
                  aria-label="">

<!--                  <span-->
<!--                     class="image-360-pin"-->
<!--                     v-if="index === 0 && announcement.images_360 && announcement.images_360.length"-->
<!--                  >-->
<!--                     360<sup>&#176;</sup>-->
<!--                  </span>-->
               </div>
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
               slidesPerView: 6.5,
               spaceBetween: 16,
               init: false,
               breakpoints: {
                  1024: {
                     slidesPerView: 5,
                     spaceBetween: 20,
                  },
               },
            }
         }
      },

      methods: {
         // getMediaByKey(media, key) {
         //    console.log('media', media)
         //    console.log('key', key)
         //    key = media.main[key] ? key : Object.keys(media.main)[0];
         //    console.log('sdsd', media.main[key].map(item => this.$withBaseUrl(item)))
         //    return media.main[key] instanceof Array ? media.main[key].map(item => this.$withBaseUrl(item)) : [];
         // }
      },

      computed: {
         ...mapGetters(['announcement']),

         // thumbs() {
         //    let thumbs = [];
         //    if (this.where === 'catalog') {
         //       thumbs = this.getMediaByKey(this.media, 'thumb');
         //    } else if (this.where === 'announcement') {
         //       let media = this.announcement.media;
         //       let yt_video = this.announcement.youtube_id;
         //       if (media.length === 0) return [];
         //       thumbs = this.getMediaByKey(media, 'thumb_inner');
         //       if (yt_video) {
         //          thumbs.splice(1, 0, `https://img.youtube.com/vi/${yt_video}/hqdefault.jpg`);
         //       }
         //
         //       if (this.announcement.images_360 && this.announcement.images_360.length) {
         //          thumbs.splice(0, 0, this.announcement.images_360[0])
         //       }
         //    } else if (this.where === 'salon') {
         //       return this.media;
         //    }
         //    return thumbs;
         // }
      },

      mounted() {
         this.$nextTick(() => {
            setTimeout(() => {
               this.thumbsSwiper.init();
            }, 100);
         });
      }
   }
</script>

<style scoped>
   .image-360-pin {
      color: white;
      position: absolute;
      right: 10px;
      top: 5px;
   }
</style>
