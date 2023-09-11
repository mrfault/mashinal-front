<template>
   <div :class="['pages-salons', `${mapView ? 'map' : 'list'}-view`]">
      <div class="container">
         <Banner
            class="mb-5"
            :bg="'/img/salon-bg.png'"
            :title="$t('external_salon')"
         >
            <template #content>
               <breadcrumbs class="light-color" :crumbs="crumbs"/>
            </template>
         </Banner>

         <salon-filters-form v-if="nonOfficialSalons.length" :count="salonsFiltered.length" />

         <no-results v-else />

         <div
            class="mb-lg-0 mb-n2 mt-2 row salon-card-list"
            v-if="nonOfficialSalons.length"
         >
            <div
               class="col-lg-4 mb-2 mb-lg-3"
               v-for="salon in nonOfficialSalons"
               :key="salon.id"
            >
               <nuxt-link
                  class="keep-colors"
                  :to="$localePath(`/external-salons/${salon.slug}`)"
               >
                  <salon-card :salon="salon"/>
               </nuxt-link>
            </div>
         </div>

         <no-results v-else-if="!officialSalons.length"/>
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
   import Banner from "~/components/elements/Banner.vue";

   export default {
      name: 'pages-salons',

      components: {
         SalonSearchForm,
         SalonFiltersForm,
         SalonCard,
         NoResults,
         ClusteredMap,
         Banners,
         Banner
      },

      nuxtI18n: {
         paths: {
            az: '/xarici-avto',
         },
      },

      head() {
         return this.$headMeta({
            title: this.$t('salons'),
         })
      },

      async asyncData({store}) {
         await Promise.all([
            store.dispatch('getBrands'),
            store.dispatch('getSalonsList', {type: 3}),
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

         nonOfficialSalons() {
            return this.salonsFiltered.filter(item => item.announcement_count > 0).filter(item => !item.is_official);
         },

         officialSalons() {
            return this.salonsFiltered.filter(item => item.announcement_count > 0).filter(item => item.is_official).sort((a, b) => a.name.localeCompare(b.name));
         },

         crumbs() {
            return [{name: this.$t('external-salons')}]
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
               {key: 0, name: this.$t('search_by_salon')},
               {key: 1, name: this.$t('search_by_auto')},
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

<style lang="scss">


   .salon-count {
      padding-left: 25px;
      margin-right: 25px;
      padding-right: 15px !important;
   }

   .text-with-line {
      h2.title-with-line {
         span {
            background-color: #f3f7fc;
         }
      }
   }

   img {
      -webkit-backface-visibility: hidden;
      -ms-transform: translateZ(0); /* IE 9 */
      -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */
      transform: translateZ(0);
   }


</style>
