<template>
  <div class="part-categories card">
    <div class="swiper-container" v-swiper:thumbsSwiper="swiperOps">
      <div class="part-categories__wrapper swiper-wrapper">
        <div
          v-for="category in categories"
          :key="category.title"
          class="category swiper-slide"
          :class="{'active': isActive(category)}"
        >
          <nuxt-link :to="$localePath(category.route)">
            <icon :name="category.icon" />
            {{ $t(category.title) }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RoutesMixin } from '~/mixins/routes'

export default {
  mixins: [RoutesMixin],
  data() {
    return {
      swiperOps: {
        slidesPerView: 5.8,
        spaceBetween: 20,
        freeMode: true,
        init: false
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.thumbsSwiper.init();
      }, 0);
    });
  },
  methods: {
    isActive(category) {
      let route = this.$route.path;
      const activeCategory = this.partsRoutes.find(c => this.$localePath(c.route) === route)

      if (activeCategory)  {
        if (activeCategory.title === category.title) {
          return true
        } else if (category.title === 'tyres_and_rims') {
          return ['rims', 'tyres'].includes(activeCategory.title)
        }
      }
      return false
    }
  },
  computed: {
    categories() {
      return this.partsRoutes.filter(r => r.showOnMenu)
    }
  }
}
</script>