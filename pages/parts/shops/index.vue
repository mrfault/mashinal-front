<template>
  <div :class="['pages-parts-shops', `${mapView ? 'map' : 'list'}-view`]">
    <mobile-screen
      @back="showSearch = false"
      :bar-title="$t('search_part_salon')"
      v-if="showSearch && isMobileBreakpoint"
    >
      <div class="flex-stretch-chilren pt-4">
        <div class="full-width">
          <form-buttons
            :options="searchFormTypeOptions"
            :group-by="2"
            v-model="searchFormType"
          />
        </div>
        <salon-search-form v-show="searchFormType === 1" where="parts" />
        <salon-filters-form
          v-show="searchFormType === 0"
          where="parts"
          @filter="showSearch = false"
          :count="(!mapView ? salonsFiltered : salonsInView).length"
        />
      </div>
    </mobile-screen>
    <template v-if="!mapView">
      <div class="container">
        <breadcrumbs :crumbs="crumbs" />
        <template v-if="!isMobileBreakpoint">
          <salon-search-form where="parts" />
          <salon-filters-form where="parts" :count="salonsFiltered.length" />
        </template>
        <banners type="2" class="mt-2 mt-lg-5" reverse />
        <div class="title grid-title mt-2" v-if="isMobileBreakpoint">
          <h2>
            <span>{{ $t('shops') }}</span>
          </h2>
        </div>
        <div
          class="salon-card-list row mt-2 mt-lg-3 mb-n2 mb-lg-n3"
          v-if="salonsFiltered.length"
        >
          <div
            class="col-lg-4 mb-2 mb-lg-3"
            v-for="salon in salonsFiltered"
            :key="salon.id"
          >
            <nuxt-link
              class="keep-colors"
              :to="$localePath(`/parts/shops/${salon.id}`)"
            >
              <salon-card :salon="salon" />
            </nuxt-link>
          </div>
        </div>
        <no-results type="part" v-else />
      </div>
    </template>
    <div
      class="map-on-salons"
      :class="`map-${isMobileBreakpoint ? 'fh' : 'fw'}-container`"
      v-if="mapView"
    >
      <template v-if="!isMobileBreakpoint">
        <template v-if="mapView">
          <!-- ././././././././././ -->
          <!-- ././././././././././ -->
          <!-- ././././././././././ -->
          <!-- ././././././././././ -->
          <div
            :class="['map-sidebar', { collapse: !disableCollapse && collapse }]"
          >
            <div class="map-sidebar_content">
              <breadcrumbs :crumbs="crumbs" />
              <salon-filters-form
                where="parts"
                :count="salonsInView.length"
                :short="!isMobileBreakpoint"
              />
              <div class="salon-card-list" v-if="salonsInView.length">
                <div
                  class="salon-card-list__item"
                  v-for="salon in salonsInView"
                  :key="salon.id"
                >
                  <nuxt-link
                    class="keep-colors"
                    :to="$localePath(`/salons/${salon.id}`)"
                  >
                    <salon-card :salon="salon" />
                  </nuxt-link>
                </div>
              </div>
              <no-results type="part" v-else />
            </div>
            <!-- ././././././././././ -->
            <!-- ././././././././././ -->
            <!-- ././././././././././ -->
            <!-- ././././././././././ -->
            <div
              class="map-sidebar_toggle"
              @click="collapse = !collapse"
              v-if="!disableCollapse"
            >
              <!-- <icon :name="collapse ? 'chevron-right' : 'chevron-left'" /> -->
              <inline-svg
                src="/icons/chevron-right.svg"
                :height="14"
                v-if="collapse"
              />
              <inline-svg src="/icons/chevron-left.svg" :height="14" v-else />
            </div>
          </div>
          <div class="map-topbar">
            <div class="container">
              <salon-search-form
                where="parts"
                :short="!isMobileBreakpoint && (!collapse || disableCollapse)"
              />
            </div>
          </div>
        </template>
        <clustered-map
          :key="'desktop-map_' + mapKey"
          :margin-left="{ left: 0, top: 0, width: '360px', height: '100%' }"
          :margin-top="{ top: 0, left: 0, width: '100%', height: '150px' }"
          :use-margin-left="!disableCollapse && !collapse"
          @balloon-click="$router.push($localePath(`/parts/shops/${$event}`))"
        />
      </template>
      <template v-else>
        <clustered-map
          :key="'mobile-map_' + mapKey"
          @balloon-click="$router.push($localePath(`/parts/shops/${$event}`))"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import SalonSearchForm from '~/components/salons/SalonSearchForm'
import SalonFiltersForm from '~/components/salons/SalonFiltersForm'
import SalonCard from '~/components/salons/SalonCard'
import NoResults from '~/components/elements/NoResults'
import ClusteredMap from '~/components/elements/ClusteredMap'
import Banners from '~/components/parts/Banners'

export default {
  name: 'pages-parts-shops',
  components: {
    SalonSearchForm,
    SalonFiltersForm,
    SalonCard,
    NoResults,
    ClusteredMap,
    Banners,
  },
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/magazalar',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('parts_shops'),
    })
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getSalonsList', { type: 2, params: '?part=true' }),
    ])
    return {
      collapse: false,
      disableCollapse: true,
      showSearch: false,
      searchFormType: 0,
      mapKey: 0,
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered', 'salonsInBounds', 'mapView']),

    crumbs() {
      return [
        { name: this.$t('parts'), route: '/parts' },
        { name: this.$t('shops') },
      ]
    },

    salonsInView() {
      return this.salonsFiltered.filter((salon) => {
        return this.salonsInBounds
          ? this.salonsInBounds.includes(salon.id)
          : true
      })
    },
    searchFormTypeOptions() {
      return [
        { key: 0, name: this.$t('search_by_shop') },
        { key: 1, name: this.$t('search_by_part') },
      ]
    },
  },
  methods: {
    ...mapActions([
      'setFooterVisibility',
      'setMapView',
      'updateSalonsInBounds',
      'updateSalonsSearchFilters',
      'updateSalonsFilters',
    ]),

    toggleSearch() {
      this.showSearch = !this.showSearch
    },
  },
  watch: {
    mapView(visible) {
      this.mapKey = 1
      this.setFooterVisibility(!visible)
    },
  },
  created() {
    this.$nuxt.$on('search-icon-click', this.toggleSearch)
  },
  beforeDestroy() {
    this.setMapView(false)
    this.setFooterVisibility(true)
    this.updateSalonsFilters({})
    this.updateSalonsSearchFilters({})
    this.$nuxt.$off('search-icon-click', this.toggleSearch)
  },
}
</script>
