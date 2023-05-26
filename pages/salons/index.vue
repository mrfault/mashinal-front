<template>
    <div :class="['pages-salons ', `${mapView ? 'map' : 'list'}-view`]">
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
                <SalonBanner
                    :bg="'/img/salon-bg.png'"
                    :title="'Avtosalonlar'"
                >
                    <template #content>
                        <breadcrumbs :crumbs="crumbs"/>
                    </template>
                </SalonBanner>

               <Cap>
                  <template #left>
                     <h3>{{ $t('official_salons') }}</h3>
                     <h3 class="salons-count d-none">({{ officialSalons.length }})</h3>
                  </template>

                  <template #right>
                     <nuxt-link to="">
                        <span>{{ officialSalons.length }}</span>
                        <span>{{ $t('official_salons_2') }}</span>
                     </nuxt-link>
                  </template>
               </Cap>

<!--                <banners type="2" class="mt-5" />-->

                <div class="mb-lg-4 mt-2 mt-lg-3 row salon-card-list" v-if="officialSalons.length">
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

<!--                <div class="text-with-line" v-if="nonOfficialSalons.length">-->
<!--                    <h2 class="title-with-line d-flex full-width align-items-center">-->
<!--                        <span>{{ $t('auto_salons') }}</span>-->
<!--                        <span class="salon-count ml-auto">{{ nonOfficialSalons.length }} {{ $t('autosalon') }}</span>-->
<!--                    </h2>-->
<!--                </div>-->

               <Cap>
                  <template #left>
                     <h3>{{ $t('auto_salons') }}</h3>
                     <h3 class="salons-count d-none">({{ nonOfficialSalons.length }})</h3>
                  </template>

                  <template #right>
                     <nuxt-link to="">
                        <span>{{ nonOfficialSalons.length }}</span>
                        <span>{{ $t('autosalon') }}</span>
                     </nuxt-link>
                  </template>
               </Cap>

                <div class="mb-lg-0 mb-n2 mt-2 mt-lg-3 row salon-card-list" v-if="nonOfficialSalons.length">
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

                <no-results v-else-if="!officialSalons.length" />
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
</template>

<script>
   import {mapGetters, mapActions} from 'vuex'
   import SalonSearchForm from '~/components/salons/SalonSearchForm'
   import SalonFiltersForm from '~/components/salons/SalonFiltersForm'
   import SalonCard from '~/components/salons/SalonCard'
   import NoResults from '~/components/elements/NoResults'
   import ClusteredMap from '~/components/elements/ClusteredMap'
   import Banners from '~/components/parts/Banners'
   import SalonBanner from "~/components/salons/SalonBanner.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
       name: 'pages-salons',

       components: {
           SalonBanner,
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
      .cap {
         margin: 56px 0 32px 0;

         .divider {
            &:first-child {
               display: flex;
               align-items: center;
            }

            .salons-count {
               margin-left: 5px;
            }
         }
      }
   }

   @media (max-width: 600px) {
      .pages-salons {
         .cap {
            margin: 32px 0 20px 0;

            .salons-count {
               display: inline-block !important;
            }

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
               font-size: 20px;
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
