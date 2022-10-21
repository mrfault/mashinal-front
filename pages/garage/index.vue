<template>
  <div class="pages-garage-index pt-5">
    <div class="container">
      <no-ssr>
        <breadcrumbs :crumbs="crumbs" />
        <template v-if="cars.data && cars.data.length">
          <garage-nav
            v-show="showNav || !isMobileBreakpoint"
            :tab="tab"
            @change-tab="tab = $event"
            @filterCarNumber="filterCarNumber"
          />
          <cars-list :filter_car_number="car_number" v-if="tab === 'cars'" @show-nav="showNav = $event" />
          <cars-list key="history_key" :filter_car_number="car_number" history v-if="tab === 'penalty_history'" @show-nav="showNav = $event" />
          <check-driver-points
            v-show="tab === 'check-points'"
            @show-nav="showNav = $event"
          />
          <list-of-attorneys
            :attorneys="attorneys"
            v-show="tab === 'attorney-list'"
            @show-nav="showNav = $event"
          />
        </template>
        <template v-else>
          <garage-empty :default-vehicle-list="vehicleList" />
        </template>
        <template v-if="false">
          <template v-if="tab === 'cars' && (showNav || !isMobileBreakpoint)">
            <div
              :class="[
                'card profile-links-card with-margins',
                { 'mt-3': !cars.data || !cars.data.length },
              ]"
              v-if="isMobileBreakpoint"
            >
              <div
                class="link-block"
                v-for="menu in userMenus.filter((menu) => menu.showOnCard)"
                :key="menu.title"
              >
                <nuxt-link :to="$localePath(menu.route)">
                  <icon :name="menu.icon" />
                  {{ $t(menu.title) }}
                  <icon name="chevron-right" />
                  <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" /> -->
                </nuxt-link>
                <hr />
              </div>
            </div>
          </template>
        </template>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { UserDataMixin } from '~/mixins/user-data'
import { MenusDataMixin } from '~/mixins/menus-data'

import GarageNav from '~/components/garage/GarageNav'
import GarageEmpty from '~/components/garage/GarageEmpty'
import CarsList from '~/components/garage/CarsList'
import CheckDriverPoints from '~/components/garage/CheckDriverPoints'
import ListOfAttorneys from '~/components/garage/loa/ListOfAttorneys'

export default {
  name: 'pages-garage-index',
  mixins: [UserDataMixin, MenusDataMixin],
  components: {
    ListOfAttorneys,
    GarageNav,
    GarageEmpty,
    CarsList,
    CheckDriverPoints,
  },
  middleware: ['auth_general'],
  nuxtI18n: {
    paths: {
      az: '/qaraj',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('garage'),
    })
  },
  async asyncData({ store,$cookies,$axios }) {
    await Promise.all([
      store.dispatch('garage/getCarList', {}),
      //store.dispatch('garage/getAttorneyList'),
      store.dispatch('bankingCards/getBankingCards')
    ])
    let vehicleList = {}

    if($cookies.get('asan_token')) {
      try {
       vehicleList = await $axios.$get('/attorney/get_vehicle_list/false')
      }catch (e) {
      }
    }

    return {
      vehicleList: vehicleList,
      tab: 'cars',
      showNav: true,
      car_number: '',
    }
  },
  mounted() {

    if(this.$route.query.tab)
       this.tab = this.$route.query.tab;
  },
  methods: {
    filterCarNumber(car_number) {
      this.car_number = car_number;
      this.$nuxt.$emit('select-car')

    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars',
      attorneys: 'garage/attorneys',
    }),

    crumbs() {
      return [{ name: this.$t('garage') }]
    },
  },
}
</script>
