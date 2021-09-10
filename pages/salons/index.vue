<template>
  <div :class="['pages-salons', `${view}-view`]">
    <mobile-screen @back="showSearch = false" :bar-title="$t('search_salon')" v-if="showSearch && isMobileBreakpoint">
      <div class="flex-stretch-chilren pt-2">
        <div class="full-width">
          <form-buttons :options="searchFormTypeOptions" :group-by="2" v-model="searchFormType" />
        </div>
        <salon-search-form v-show="searchFormType === 1" />
        <salon-filters-form v-show="searchFormType === 0" @filter="showSearch = false"
          :count="(view === 'list' ? salonsFiltered : salonsInView).length" /> 
      </div>
    </mobile-screen>
    <template v-if="view === 'list'">
      <div class="container">
        <breadcrumbs :crumbs="crumbs" />
        <div class="title grid-title mt-2" v-if="isMobileBreakpoint">
          <h2><span>{{ $t('salons') }}</span></h2>
        </div>
        <template v-else>
          <salon-search-form />
          <salon-filters-form :count="salonsFiltered.length" />
        </template>
        <div class="salon-card-list row mt-2 mt-lg-3 mb-n2 mb-lg-n3" v-if="salonsFiltered.length">
          <div class="col-lg-4 mb-2 mb-lg-3" v-for="salon in salonsFiltered" :key="salon.id">
            <nuxt-link class="keep-colors" :to="$localePath(`/salons/${salon.id}`)">
              <salon-card :salon="salon" />
            </nuxt-link>
          </div>
        </div>
        <no-results v-else />
      </div>
    </template>
    <div :class="`map-${isMobileBreakpoint ? 'fh' : 'fw'}-container`" v-show="view === 'map'">
      <template v-if="!isMobileBreakpoint">
        <template v-if="view === 'map'">
          <div :class="['map-sidebar', { collapse: !disableCollapse && collapse }]">
            <div class="map-sidebar_content">
              <breadcrumbs :crumbs="crumbs" />
              <salon-filters-form :count="salonsInView.length" :short="!isMobileBreakpoint"/>
              <div class="scroll-container" v-if="salonsInView.length">
                <vue-scroll class="white-scroll-bg">
                  <div class="salon-card-list" >
                    <div v-for="salon in salonsInView" :key="salon.id">
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
        </template>
        <clustered-map 
          key="desktop-map"
          :margin-left="{ left: 0, top: 0, width: '360px', height: '100%' }"
          :margin-top="{ top: 0, left: 0, width: '100%', height: '150px' }" 
          :use-margin-left="!disableCollapse && !collapse" 
        />
      </template>
      <template v-else>
        <clustered-map 
          key="mobile-map"
        />
      </template>
    </div>
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
      title: this.$t('salons'),
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getSalonsList')
    ]);
    return {
      view: 'map',
      collapse: false,
      disableCollapse: true,
      showSearch: false,
      searchFormType: 0
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered', 'salonsInBounds']),

    crumbs() {
      return [
        { name: this.$t('salons') }
      ]
    },

    salonsInView() {
      return this.salonsFiltered.filter(salon => {
        return this.salonsInBounds ? this.salonsInBounds.includes(salon.id) : true;
      });
    },
    searchFormTypeOptions() {
      return [
        { key: 0, name: this.$t('search_by_salon') },
        { key: 1, name: this.$t('search_by_auto') }
      ]
    }
  },
  methods: {
    ...mapActions(['setFooterVisibility', 'updateSalonsInBounds', 'updateSalonsSearchFilters', 'updateSalonsFilters']),

    changeView() {
      this.view = (this.view === 'list') ? 'map' : 'list';
      this.setFooterVisibility(this.view === 'list');
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
    }
  },
  created() {
    this.setFooterVisibility(false);
    this.$nuxt.$on('search-icon-click', this.toggleSearch);
  },
  beforeDestroy() {
    this.setFooterVisibility(true);
    this.updateSalonsFilters({});
    this.updateSalonsSearchFilters({});
    this.$nuxt.$off('search-icon-click', this.toggleSearch);
  }
}
</script>