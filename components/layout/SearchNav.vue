<template>
  <div class="search-nav">
    <nav class="mt-n2">
      <div class="search-types">
        <div class="container">
          <ul>
            <li v-for="menu in searchMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)" :class="{'active': menu.title === activeType }">
                {{ $t(menu.title).replace(' Avtomobillər', '') }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-categories" v-if="activeMenu.children">
        <div class="container">
          <ul v-if="activeMenu.children.length < 5">
            <li v-for="submenu in activeMenu.children" :key="submenu.title">
              <nuxt-link :to="$localePath(submenu.route)" exact :class="{'active': checkActive(submenu.route)}">
                <icon :name="submenu.icon" />
                {{ $t(submenu.title) }}
              </nuxt-link>
            </li>
          </ul>
          <div class="swiper-container" v-swiper:searchNavSwiper="swiperOps" v-else>
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="submenu in activeMenu.children" :key="submenu.title">
                <nuxt-link :to="$localePath(submenu.route)" exact :class="{'active': checkActive(submenu.route), 'category-link': activeType === 'parts'}">
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
        centeredSlides: true,
        centeredSlidesBounds: true,
        slideToClickedSlide: true,
        roundLengths: true
      }
    }
  },
  computed: {
    activeType() {
      if (this.routeName.includes('moto')) return 'moto';
      else if (this.routeName.includes('commercial')) return 'commercial';
      else if (this.routeName.includes('parts')) return 'parts';
      return 'cars';
    },
    activeMenu() {
      return this.searchMenus.find(menu => menu.title === this.activeType);
    },
    activeSlide() {
      return this.activeMenu?.children?.findIndex(menu => {
        let routeMatches = this.$localePath(menu.route) === this.$route.path;
        if (menu.route.includes(this.$t('slug_tyres'))) 
          return routeMatches || this.$localePath(menu.route.replace(this.$t('slug_tyres'), this.$t('slug_rims'))) === this.$route.path;
        return routeMatches;
      });
    }
  },
  methods: {
    slideToCategory() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (!['commercial','commercial-commercial','parts','parts-category'].includes(this.routeName)) return false;
          if (typeof this.activeSlide === 'number') 
            this.searchNavSwiper?.slideTo(this.activeSlide);
        }, 0);
      });
    },
    checkActive(route) {
      if (route === '/parts' && this.routeName !== 'parts') 
        return false;
      if (route.includes(this.$t('slug_tyres')) && this.$route.path.includes(this.$t('slug_rims'))) 
        return true;
      return this.$route.fullPath.includes(this.$localePath(route));
    }
  },
  mounted() {
    this.slideToCategory();
  },
  updated() {
    this.slideToCategory();
  }
}
</script>
