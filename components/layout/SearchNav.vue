<template>
  <div class="search-nav">
    <nav class="mt-n2">
      <div class="search-types">
        <div class="container">
          <ul>
            <li v-for="menu in searchMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)" :class="{'active': menu.title === activeType }">
                {{ $t(menu.title) }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-categories" v-if="activeMenu.children">
        <div class="container">
          <ul v-if="activeMenu.children.length < 4">
            <li v-for="submenu in activeMenu.children" :key="submenu.title">
              <nuxt-link :to="$localePath(submenu.route)">
                <icon :name="submenu.icon" />
                {{ $t(submenu.title) }}
              </nuxt-link>
            </li>
          </ul>
          <div class="swiper-container" v-swiper:searchNavSwiper="swiperOps" v-else>
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="submenu in activeMenu.children" :key="submenu.title">
                <nuxt-link :to="$localePath(submenu.route)">
                  <icon :name="submenu.icon" />
                  {{ $t(submenu.title) }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { MenusDataMixin } from '~/mixins/menus-data';

export default {
  mixins: [MenusDataMixin],
  data() {
    return {
      swiperOps: {
        slidesPerView: 'auto',
        roundLengths: true,
        centeredSlides: true,
        centeredSlidesBounds: true
      }
    }
  },
  fetch() {
    // if (this.activeSlide) 
    //   this.swiperOps.initialSlide = this.activeSlide;
  },
  computed: {
    activeType() {
      if (this.routeName.includes('moto')) return 'moto';
      else if (this.routeName.includes('commercial')) return 'commercial';
      return 'cars';
    },
    activeMenu() {
      return this.searchMenus.find(menu => menu.title === this.activeType);
    },
    activeSlide() {
      return this.activeMenu?.children?.findIndex(menu => this.$localePath(menu.route) === this.$route.path);
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.searchNavSwiper?.slideTo(this.activeSlide);
      })
        
    }
  },
  mounted() {
    this.searchNavSwiper?.slideTo(this.activeSlide);
  }
}
</script>