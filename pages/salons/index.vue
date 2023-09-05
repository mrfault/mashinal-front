<template>
   <div class="pages-salons-wrapper">
      <Banner
         class="mt-0 d-sm-none"
         :bg="'/img/salon-bg.png'"
         :title="$t('auto_salons')"
      >
         <template #content>
            <breadcrumbs class="light-color" :crumbs="crumbs" />
         </template>
      </Banner>

      <div class="container-fluid p-0">
         <div
            :class="['pages-salons', `${showMapsView ? 'map' : 'list'}-view`]"
            style="background-color: #EEF2F6"
         >
            <div class="container">
               <Banner
                  class="d-none d-sm-block"
                  :bg="'/img/salon-bg.png'"
                  :title="$t('auto_salons')">
                  <template #content>
                     <breadcrumbs class="light-color" :crumbs="crumbs" />
                  </template>
               </Banner>

               <salon-filters-form
                  v-show="searchFormType === 0"
                  @filter="salonFilter"
                  :count="(!mapView ? salonsFiltered : salonsInView).length"
               />
            </div>

            <div class="container officialDealerships" v-if="!showMapsView">
               <div class="row">
                  <div class="col-md-12">
                     <Cap>
                        <template #left>
                           <h3>{{ $t('official_salons_3') }} ({{ officialSalons.length }})</h3>
                        </template>

                        <template #right>
                           <p
                              class="d-flex align-items-center"
                              @click="setView()"
                              v-if="salonsFiltered.filter(item => item.announcement_count > 0).filter(a => a.is_official).length"
                           >
                              <span v-if="!isMobileBreakpoint">{{ $t('show_on_map') }}</span>
                              <span v-else>{{ $t('map') }}</span>
                              <inline-svg :src="'/icons/location_2.svg'"/>
                           </p>
                        </template>
                     </Cap>
                  </div>

                  <div class="col-md-12">
                     <div class="mb-lg-5 mt-4 mt-lg-5 row salon-card-list" v-if="officialSalons.length">
                        <div
                           class="col-12 col-md-6 col-lg-4 mb-2 mb-lg-3"
                           v-for="salon in officialSalons"
                           :key="salon.id"
                           v-if="salon.announcement_count"
                        >
                           <nuxt-link
                              class="keep-colors"
                              :to="$localePath(`/salons/${salon.id}`)"
                           >
                              <salon-card :salon="salon"/>
                           </nuxt-link>
                        </div>
                     </div>

                     <no-results v-else-if="!officialSalons.length"/>
                  </div>
               </div>
            </div>

            <div class="container mt-5" v-else>
               <div class="row">
                  <div class="col-md-12">
                     <Cap>
                        <template #left>
                           <h3 v-if="!showMapsView">{{ $t('auto_salons') }} ({{ salonsFiltered.filter(item => item.announcement_count > 0).filter(a => a.is_official).length }})</h3>
                           <h3 v-else>{{ $t('auto_salons') }} ({{ salonsInView.length }})</h3>
                        </template>

                        <template #right>
                           <p class="d-flex align-items-center" @click="setView()">
                              <span v-if="!isMobileBreakpoint">{{ $t('show_on_list') }}</span>
                              <span v-else>{{ $t('list') }}</span>
                              <inline-svg :src="'/icons/list1.svg'"/>
                           </p>
                        </template>
                     </Cap>
                  </div>

                  <div class="col-md-12 mt-5 mb-5">
                     <div class="row flex-column-reverse flex-lg-row">
                        <div class="col-md-4">
                           <div class="salon-card-list maps-list" v-if="salonsInView.length">
                              <div class="salon-card-list__item" v-for="salon in salonsInView" :key="salon.id">
                                 <nuxt-link class="keep-colors" :to="$localePath(`/salons/${salon.slug}`)">
                                    <salon-card :salon="salon"/>
                                 </nuxt-link>
                              </div>
                           </div>
                        </div>

                        <div class="col-md-8 mb-lg-0 mb-2">
                           <div class="map-viewer">
                              <div v-if="!isMobileBreakpoint">
                                 <clustered-map
                                    :key="'desktop-map_' + mapKey"
                                    :margin-left="{ left: 0, top: 0, width: '360px', height: '100%' }"
                                    :margin-top="{ top: 0, left: 0, width: '100%', height: '150px' }"
                                    :use-margin-left="!disableCollapse && !collapse"
                                    @balloon-click="$router.push($localePath(`/salons/${$event}`))"
                                 />
                              </div>

                              <template v-else>
                                 <div>
                                    <clustered-map
                                       :key="'mobile-map_' + mapKey"
                                       @balloon-click="$router.push($localePath(`/salons/${$event}`))"
                                    />
                                 </div>
                              </template>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div :class="['pages-salons autosalon list-view bg-silver']" v-if="!showMapsView">
            <div class="container">
               <div class="row">
                  <div class="col-md-12">
                     <Cap>
                        <template #left>
                           <h3>{{ $t('auto_salons') }} ({{ salonsFiltered.filter(item => item.announcement_count > 0).filter(a => !a.is_official).length }})</h3>
                        </template>
                        <template #right>
                           <p
                              class="d-flex align-items-center"
                              @click="setView()"
                              v-if="salonsFiltered.filter(item => item.announcement_count > 0).filter(a => !a.is_official).length"
                           >
                              <span v-if="!isMobileBreakpoint">{{ $t('show_on_map') }}</span>
                              <span v-else>{{ $t('map') }}</span>
                              <inline-svg :src="'/icons/location_2.svg'" />
                           </p>
                        </template>
                     </Cap>
                  </div>
                  <div class="col-md-12">
                     <div class="mb-lg-0 mb-n2 mt-4 mt-lg-5 row salon-card-list" v-if="nonOfficialSalons.length">
                        <div class="col-12 col-md-6 col-lg-4 mb-4"
                             v-for="salon in nonOfficialSalons"
                             :key="salon.id"
                             v-if="salon.announcement_count"
                        >
                           <nuxt-link
                              class="keep-colors border"
                              :to="$localePath(`/salons/${salon.slug}`)">
                              <salon-card :salon="salon"/>
                           </nuxt-link>
                        </div>
                     </div>
                     <no-results v-else-if="!officialSalons.length"/>
                  </div>
               </div>
            </div>
         </div>
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
import Cap from "~/components/elements/Cap.vue";

export default {
   name: 'pages-salons',

   transition: 'fade-y-20',

   components: {
      Banner,
      SalonSearchForm,
      SalonFiltersForm,
      SalonCard,
      NoResults,
      ClusteredMap,
      Banners,
      Cap
   },

   nuxtI18n: {
      paths: {
         az: '/salonlar',
      },
   },

   head() {
      return this.$headMeta({
         title: this.$t('salons'),
      })
   },

   data() {
      return {
         showMapsView: false
      }
   },

   async asyncData({store}) {
      await Promise.all([
         store.dispatch('getBrands'),
         store.dispatch('getSalonsList', {type: 1}),
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
         return this.salonsFiltered.filter(item => !item.is_official && item.announcement_count);
      },
      officialSalons() {
         return this.salonsFiltered.filter(item => item.is_official).sort((a, b) => a.name.localeCompare(b.name));
      },
      crumbs() {
         return [{ name: this.$t('auto_salons') }]
      },

      salonsInView() {
         let salons = this.salonsFiltered.filter(item => item.announcement_count > 0);

         return salons.filter((salon) => {
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
         'setMapView'
      ]),

      setView() {
         this.showMapsView = !this.showMapsView;
      },

      toggleSearch() {
         this.showSearch = !this.showSearch
      },

      callEvent() {
         this.$nextTick(() => {
            this.$nuxt.$emit('showMapEvent', this.mapView)
            window.dispatchEvent(new Event('scroll'));
         });
      },

      salonFilter() {
         setTimeout(() => {
            if (this.officialSalons?.length) {
               this.scrollTo('.officialDealerships', [-40, -90]);
            } else if (this.salonsFiltered?.filter(item => item.announcement_count > 0)?.filter(a => !a.is_official)?.length) {
               this.scrollTo('.autosalon', [-40, -70]);
            } else {
               this.scrollTo('.salon-filters-form', [-50, -10]);
            }
         }, 200);

         this.showSearch = false
      }
   },

   watch: {
      mapView(visible) {
         this.mapKey = 1
         this.setFooterVisibility(!visible)
      },
   },

   created() {
      this.$nuxt.$on('search-icon-click', this.toggleSearch);
   },

   beforeDestroy() {
      this.setMapView(false)
      this.setFooterVisibility(true)
      this.updateSalonsFilters({})
      this.updateSalonsSearchFilters({})
      this.$nuxt.$off('search-icon-click', this.toggleSearch);
   }
}
</script>

<style lang="scss">
   .pages-salons-wrapper {
      overflow: hidden;

      .pages-salons {
         &.list-view {
            .container {
               &:last-child {
                  padding-top: 56px;
               }
            }
         }
      }
   }

   .keep-colors {
      &.border {
         .salon-card {
            border: 1px solid #CDD5DF
         }
      }
   }

   .map-viewer{
      width: 100%;
      height: 624px;
      flex-shrink: 0;
      border-radius: 12px;
      border: 1px solid var(--gray-300, #CDD5DF);
      background: lightgray 50% / cover no-repeat;
   }
   .salon-card-list.maps-list{
      height: 624px;
      max-height: 624px;
      overflow-y: auto;
      overflow-x: hidden;
      margin-top: 0!important;
   }
   .salon-card-list.maps-list .salon-card-list__item{
      margin-bottom: 10px;
   }
   .salon-card-list__item:last-child{
      margin-bottom: 0;
   }
   .salon-card-list.maps-list:not(.row) > div:not(:last-child) .salon-card::after{
      border: 0!important;
   }
   .salon-card-list.maps-list .salon-card-list__item{
      border-radius: 12px;
      border: 1px solid var(--gray-300, #CDD5DF);
      background: #FFF;
   }
   .map-view{
      background-color: #FFF;
   }
   .ymaps-2-1-79-map,
   .ymaps-2-1-79-inner-panes,
   .ymaps-2-1-79-events-pane {
      border-radius: 12px!important;
   }
   .ymaps-2-1-79-balloon__tail{
      display: none!important;
   }
   .ymaps-2-1-79-balloon__content .salon-announce{
      display: none!important;
   }
   .ymaps-2-1-79-balloon__layout{
      border-radius: 8px!important;
   }
   .ymaps-2-1-79-balloon__content .salon-card .salon-info {
      width: calc(100% - 143px)!important;
   }
   .ymaps-2-1-79-balloon__content .balloon-content .salon-card .d-flex{
      align-items: center!important;
   }
   .ymaps-2-1-79-balloon__content .balloon-content .salon-card:hover{
      border: 1px solid transparent!important;
      border-radius: 8px!important;
   }
   .ymaps-2-1-79-balloon__content{
      padding: 0!important;
      border-radius: 8px!important;
   }

   .dark-mode{
      .map-view{
         background-color: var(--gray-900, #121926);
      }
      .ymaps-2-1-79-balloon__close-button{
         color: #FFF!important;
      }
      .cap svg path {
         stroke: #FFF!important;
         fill: #FFF!important;
      }

      .pages-salons-wrapper {
         .pages-salons {
            &:first-child {
               background-color: #121926 !important;
            }


            &.autosalon {
               .no-results {
                  background-color: transparent;
               }
            }
         }
      }
   }

   @media (max-width: 600px) {
      .pages-salons-wrapper {
         overflow: hidden;

         .pages-salons {
            &.list-view {
               //padding-bottom: 32px;

               .container {
                  &:last-child {
                     padding-top: 32px;
                  }
               }
            }
         }
      }
   }
</style>
