<template>
  <div class="pages-garage-index pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <template v-if="cars.data && cars.data.length">
        <garage-nav 
          v-show="showNav || !isMobileBreakpoint" 
          :tab="tab" 
          @change-tab="tab = $event" 
        />
        <cars-list 
          v-show="tab === 'cars'" 
          @show-nav="showNav = $event"
        />
        <check-driver-points 
          v-show="tab === 'check-points'" 
          @show-nav="showNav = $event"
        />
      </template>
      <template v-else>
        <garage-empty />
      </template>
      <template v-if="tab === 'cars' && isMobileBreakpoint">
        <div :class="['card profile-links-card with-margins', { 'mt-3': !cars.data || !cars.data.length }]" v-if="isMobileBreakpoint">
          <div class="link-block" v-for="menu in userMenus.filter(menu => menu.showOnCard)" :key="menu.title">
            <nuxt-link :to="$localePath(menu.route)">
              <icon :name="menu.icon" />
              {{ $t(menu.title) }}
              <icon name="chevron-right" />
            </nuxt-link>
            <hr />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { UserDataMixin } from '~/mixins/user-data';
import { MenusDataMixin } from '~/mixins/menus-data';

import GarageNav from '~/components/garage/GarageNav';
import GarageEmpty from '~/components/garage/GarageEmpty';
import CarsList from '~/components/garage/CarsList';
import CheckDriverPoints from '~/components/garage/CheckDriverPoints';

export default {
  name: 'pages-garage-index',
  mixins: [UserDataMixin, MenusDataMixin],
  components: {
    GarageNav,
    GarageEmpty,
    CarsList,
    CheckDriverPoints
  },
  middleware: ['auth_general'],
  nuxtI18n: {
    paths: {
      az: '/qaraj'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('garage')
    });
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('garage/getCarList', {})
    ]);
    return {
      tab: 'cars',
      showNav: true
    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars'
    }),

    crumbs() {
      return [
        { name: this.$t('garage') }
      ]
    }
  }
}
</script>