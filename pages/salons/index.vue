<template>
  <div :class="['pages-salons', `${view}-view`]">
    <template v-if="view === 'list'">
      <div class="container">
        <breadcrumbs :crumbs="crumbs" />
        <salon-search-form />
        <salon-filters-form :count="salons.length" />
        <div class="salon-card-list row mt-2 mt-lg-3 mb-n2 mb-lg-n3" v-if="salons.length">
          <div class="col-lg-4 mb-2 mb-lg-3" v-for="salon in salons" :key="salon.id">
            <nuxt-link class="keep-colors" :to="$localePath(`/salons/${salon.id}`)">
              <salon-card :salon="salon" />
            </nuxt-link>
          </div>
        </div>
        <no-results v-else />
      </div>
    </template>
    <template v-else-if="view === 'map'">
      <div class="map-fw-container" v-if="!isMobileBreakpoint">
        <div :class="['map-sidebar', { collapse: !disableCollapse && collapse }]">
          <div class="map-sidebar_content">
            <breadcrumbs :crumbs="crumbs" />
            <salon-filters-form :count="salons.length" :short="!isMobileBreakpoint"/>
            <div class="scroll-container" v-if="salons.length">
              <vue-scroll class="white-scroll-bg">
                <div class="salon-card-list" >
                  <div v-for="salon in salons" :key="salon.id">
                    <nuxt-link class="keep-colors" :to="$localePath(`/salons/${salon.id}`)">
                      <salon-card :salon="salon" />
                    </nuxt-link>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <no-results v-else />
          </div>
          <div class="map-sidebar_toggle" @click="collapse = !collapse" v-if="!disableCollapse">
            <icon :name="collapse ? 'chevron-right' : 'chevron-left'" />
          </div>
        </div>
        <div class="map-topbar">
          <div class="container">
            <salon-search-form :short="!isMobileBreakpoint && (!collapse || disableCollapse)" />
          </div>
        </div>
        <clustered-map 
          :margin-left="{ left: 0, top: 0, width: '360px', height: '100%' }"
          :margin-top="{ top: 0, left: 0, width: '100%', height: '150px' }" 
          :use-margin-left="!disableCollapse && !collapse" 
        />
      </div>
    </template>
    <div class="salon-view-btn">
      <button class="btn btn--dark-blue" @click="changeView">
        <template v-if="view === 'list'">
          <icon name="map" /> {{ $t('map') }}
        </template>
        <template v-else-if="view === 'map'">
          <icon name="burger" /> {{ $t('list') }}
        </template>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SalonSearchForm from '~/components/salons/SalonSearchForm';
import SalonFiltersForm from '~/components/salons/SalonFiltersForm';
import SalonCard from '~/components/salons/SalonCard';
import NoResults from '~/components/elements/NoResults';
import ClusteredMap from '~/components/elements/ClusteredMap';

export default {
  name: 'pages-salons',
  components: {
    SalonSearchForm,
    SalonFiltersForm,
    SalonCard,
    NoResults,
    ClusteredMap
  },
  nuxtI18n: {
    paths: {
      az: '/salonlar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('car-showrooms'),
    });
  },
  async asyncData({ store, route }) {
    store.dispatch('setFooterVisibility', false);
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getSalonsList')
    ]);
    return {
      view: 'map',
      collapse: false,
      disableCollapse: true
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered', 'salonsInBounds']),

    crumbs() {
      return [
        { name: this.$t('car-showrooms') }
      ]
    },

    salons() {
      return this.salonsFiltered.filter(salon => this.salonsInBounds ? this.salonsInBounds.includes(salon.id) : true);
    }
  },
  methods: {
    ...mapActions(['setFooterVisibility']),

    changeView() {
      this.view = (this.view === 'list') ? 'map' : 'list';
      this.setFooterVisibility(this.view === 'list');
    }
  },
}
</script>