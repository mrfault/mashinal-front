<template>
   <div class="pages-salons-wrapper">
      <div :class="['pages-salons', `${mapView ? 'map' : 'list'}-view`]">
         <!--        <mobile-screen-->
         <!--            @back="showSearch = false"-->
         <!--            :bar-title="$t('search_salon')"-->
         <!--            v-if="showSearch && isMobileBreakpoint"-->
         <!--        >-->
         <!--            <div class="flex-stretch-chilren pt-4">-->
         <!--                <div class="full-width">-->
         <!--                    <form-buttons-->
         <!--                        :options="searchFormTypeOptions"-->
         <!--                        :group-by="2"-->
         <!--                        v-model="searchFormType"-->
         <!--                    />-->
         <!--                </div>-->
         <!--                <salon-search-form v-show="searchFormType === 1"/>-->
         <!--                <salon-filters-form-->
         <!--                    v-show="searchFormType === 0"-->
         <!--                    @filter="showSearch = false"-->
         <!--                    :count="(!mapView ? salonsFiltered : salonsInView).length"-->
         <!--                />-->
         <!--            </div>-->
         <!--        </mobile-screen>-->

         <template v-if="!mapView">
            <div class="container">
               <Banner
                  :bg="'/img/salon-bg.png'"
                  :title="$t('auto_salons')"
               >
                  <template #content>
                     <breadcrumbs :crumbs="crumbs"/>
                  </template>
               </Banner>

               <Cap>
                  <template #left>
                     <h3>{{ $t('official_salons_3') }} ({{ officialSalons.length }})</h3>
                     <!--                  <h3 class="salons-count">({{ officialSalons.length }})</h3>-->
                  </template>

                  <template #right>
                     <p class="d-flex align-items-center" @click="setMapView(!mapView), callEvent()">
                        <span v-if="!isMobileBreakpoint">{{ $t('show_on_map') }}</span>
                        <span v-else>{{ $t('map') }}</span>

                        <inline-svg :src="'/icons/location_2.svg'" />
                     </p>
                  </template>
               </Cap>

               <div class="mb-lg-4 mt-4 mt-lg-5 row salon-card-list" v-if="officialSalons.length">
                  <div
                     class="col-12 col-md-6 col-lg-4 mb-2 mb-lg-3"
                     v-for="salon in officialSalons"
                     :key="salon.id"
                     v-if="salon.announcement_count"
                  >
                     <nuxt-link
                        class="keep-colors"
                        :to="$localePath(`/salons/${salon.slug}`)"
                     >
                        <salon-card :salon="salon"/>
                     </nuxt-link>
                  </div>
               </div>

               <no-results v-else-if="!officialSalons.length"/>
            </div>
         </template>

         <div
            :class="`map-${isMobileBreakpoint ? 'fh' : 'fw'}-container`"
            v-show="mapView"
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
                        <breadcrumbs :crumbs="crumbs"/>
                        <salon-filters-form
                           :count="salonsInView.length"
                           :short="!isMobileBreakpoint"
                        />
                        <div class="salon-card-list" v-if="salonsInView.length">
                           <div class="salon-card-list__item" v-for="salon in salonsInView" :key="salon.id">
                              <nuxt-link
                                 class="keep-colors"
                                 :to="$localePath(`/salons/${salon.slug}`)"
                              >
                                 <salon-card :salon="salon"/>
                              </nuxt-link>
                           </div>
                        </div>
                        <no-results v-else/>
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
                        <icon :name="collapse ? 'chevron-right' : 'chevron-left'"/>
                     </div>
                  </div>

                  <div class="map-topbar">
                     <div class="container">
                        <salon-search-form
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
                  @balloon-click="$router.push($localePath(`/salons/${$event}`))"
               />
            </template>
            <template v-else>
               <clustered-map
                  :key="'mobile-map_' + mapKey"
                  @balloon-click="$router.push($localePath(`/salons/${$event}`))"
               />
            </template>
         </div>
      </div>

      <div :class="['pages-salons autosalon', `${mapView ? 'map' : 'list'}-view`]">
         <template v-if="!mapView">
            <div class="container">
               <Cap>
                  <template #left>
                     <h3>{{ $t('auto_salons') }} ({{ nonOfficialSalons.length }})</h3>
                     <!--                  <h3 class="salons-count">({{ nonOfficialSalons.length }}) {{ nonOfficialSalons.length }}</h3>-->
                  </template>

                  <template #right>
                     <p class="d-flex align-items-center" @click="setMapView(!mapView), callEvent()">
                        <span v-if="!isMobileBreakpoint">{{ $t('show_on_map') }}</span>
                        <span v-else>{{ $t('map') }}</span>

                        <inline-svg :src="'/icons/location_2.svg'" />
                     </p>
                  </template>
               </Cap>

               <div class="mb-lg-0 mb-n2 mt-4 mt-lg-5 row salon-card-list" v-if="nonOfficialSalons.length">
                  <div
                     class="col-12 col-md-6 col-lg-4 mb-2 mb-lg-3"
                     v-for="salon in nonOfficialSalons"
                     :key="salon.id"
                     v-if="salon.announcement_count"
                  >
                     <nuxt-link
                        class="keep-colors"
                        :to="$localePath(`/salons/${salon.slug}`)"
                     >
                        <salon-card :salon="salon"/>
                     </nuxt-link>
                  </div>
               </div>

               <no-results v-else-if="!officialSalons.length"/>
            </div>
         </template>

         <div
            :class="`map-${isMobileBreakpoint ? 'fh' : 'fw'}-container`"
            v-show="mapView"
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
                        <breadcrumbs :crumbs="crumbs"/>
                        <salon-filters-form
                           :count="salonsInView.length"
                           :short="!isMobileBreakpoint"
                        />
                        <div class="salon-card-list" v-if="salonsInView.length">
                           <div class="salon-card-list__item" v-for="salon in salonsInView" :key="salon.id">
                              <nuxt-link
                                 class="keep-colors"
                                 :to="$localePath(`/salons/${salon.slug}`)"
                              >
                                 <salon-card :salon="salon"/>
                              </nuxt-link>
                           </div>
                        </div>
                        <no-results v-else/>
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
                        <icon :name="collapse ? 'chevron-right' : 'chevron-left'"/>
                     </div>
                  </div>

                  <div class="map-topbar">
                     <div class="container">
                        <salon-search-form
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
                  @balloon-click="$router.push($localePath(`/salons/${$event}`))"
               />
            </template>
            <template v-else>
               <clustered-map
                  :key="'mobile-map_' + mapKey"
                  @balloon-click="$router.push($localePath(`/salons/${$event}`))"
               />
            </template>
         </div>
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex'
   import SalonSearchForm from '~/components/salons/SalonSearchForm'
   import SalonFiltersForm from '~/components/salons/SalonFiltersForm'
   import SalonCard from '~/components/salons/SalonCard'
   import NoResults from '~/components/elements/NoResults'
   import ClusteredMap from '~/components/elements/ClusteredMap'
   import Banners from '~/components/parts/Banners'
   import Banner from "~/components/elements/Banner.vue";
   import Cap from "~/components/elements/Cap.vue";
   import is from "vue2-datepicker/locale/es/is";

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
         is() {
            return is
         },
         ...mapGetters(['salonsFiltered', 'salonsInBounds', 'mapView']),
         nonOfficialSalons() {
            return this.salonsFiltered.filter(item => !item.is_official);
         },
         officialSalons() {
            return this.salonsFiltered.filter(item => item.is_official).sort((a, b) => a.name.localeCompare(b.name));
         },
         crumbs() {
            return [{name: this.$t('auto_salons')}]
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

         callEvent() {
            this.$nextTick(() => {
               this.$nuxt.$emit('showMapEvent', this.mapView)
               // fix floating button position by calling
               // scroll handler in layout mixin
               window.dispatchEvent(new Event('scroll'));
            });
         }
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
   .pages-salons {
      &.autosalon {
         padding-top: 56px;
         padding-bottom: 120px;
         background-color: #FFFFFF;
         margin-bottom: -112px;

         .salon-card {
            border-color: #CDD5DF;

            &:hover {
               background-color: #F8FAFC;
            }
         }
      }

      .banner {
         margin-bottom: 56px;
      }

      .cap {
         .divider {
            &:first-child {
               display: flex;
               align-items: center;
            }

            h3 {
               padding-right: unset;
            }
         }
      }
   }

   .dark-mode {
      .pages-salons {
         &.autosalon {
            background-color: #1C1C1E;

            .salon-card {
               border-color: transparent;

               &:hover {
                  background-color: unset;
               }
            }
         }
      }
   }

   @media (max-width: 1150px) {
      .pages-salons {
         padding-bottom: 50px;
      }
   }

   @media (max-width: 992px) {
      .pages-salons {
         .banner {
            margin-bottom: 30px;
         }
      }
   }

   @media (max-width: 600px) {
      .pages-salons {
         &.autosalon {
            padding-top: 5px;
         }

         .banner {
            margin-bottom: 20px;
         }

         .cap {
            margin: 32px 0 20px 0 !important;

            a {
               display: none;
            }
         }
      }
   }

   @media (max-width: 460px) {
      .pages-salons {
         .cap {
            h3 {
               font-weight: 600;
               font-size: 18px;
               line-height: 24px;
            }
         }
      }
   }

   img {
      -webkit-backface-visibility: hidden;
      -ms-transform: translateZ(0); /* IE 9 */
      -webkit-transform: translateZ(0); /* Chrome, Safari, Opera */
      transform: translateZ(0);
   }

   //.dark-mode {
   //   .text-with-line {
   //      background-color: #1C1C1EFF;
   //
   //      h2.title-with-line {
   //         background: #1c1c1e;
   //
   //         span {
   //            background: #1c1c1e;
   //         }
   //      }
   //   }
   //}
</style>
