<template>
   <div
      :class="[
      'announcements-grid',
      { 'loading-content': pending, paginated: paginate },
    ]"
   >
      <div :class="{ container: hasContainer }">
         <div class="title grid-title" v-if="title && showTitle">
            <h2>
               <icon :name="iconName" v-if="iconName"/>
               <span>{{ title }}</span>
            </h2>
            <nuxt-link v-if="showAll" :to="showAll">
               {{ $t('all') }}
               <icon name="arrow-right"/>
            </nuxt-link>
         </div>
      </div>

      <div :class="{ container: hasContainer }">
         <div class="row mb-n2 mb-lg-n3">
            <!-- <span class="test" ref="scrollToMe"></span> -->
            <template v-for="(announcement, index) in announcements">
               <template v-if="where === 'catalog'">
                  <grid-item
                     :col-class="'col-lg-6 mb-2 mb-lg-4'"
                     :announcement="announcement"
                     :track-views="trackViews"
                     :show-gallery="true"
                     :key="announcement.id_unique"
                  />
               </template>
               <template v-else-if="announcement.type !== 'banner' && announcement.type !== 6">
                  <div
                     v-if="checkSecondTemplate(index) ? !checkItemB(index,announcement): true"
                     :class="[
                         {
                           'col-lg-mid': checkItemIndex(index + 2, announcement) || (announcement.external && !isMobileBreakpoint),
                           'pt-4 mt-1': checkItemTop(index, announcement) || (announcement.external && !isMobileBreakpoint),
                           'pb-4 mb-4': checkItemBottom(index, announcement) || (announcement.external && !isMobileBreakpoint),
                           'col-6 col-xs-12 col-lg-3 col-xl-auto': !isProfilePage,
                           'col-6 col-xs-6 col-lg-3 col-xl-auto': isProfilePage,
                         },
                         checkItemB(index, announcement)
                           ? 'col-b mb-0 pb-2 mb-lg-4 mt-lg-6 pt-lg-4 pb-lg-4'
                           : 'mb-2 mb-lg-3',
                     ]"
                     :key="announcement.id_unique + (escapeDuplicates ? '_' + index : '')"
                  >
                     <grid-item
                        :announcement="announcement"
                        :show-monetization-actions="showMonetizationActions"
                        :show-checkbox="showCheckbox"
                        :show-status="showStatus"
                        :show-phone-count="showPhoneCount"
                        :show-overlay="showOverlay"
                        :clickable="clickable"
                        :track-views="trackViews"
                        :isProfilePage="isProfilePage"
                     />
                  </div>

                  <template v-else-if="checkSecondTemplate(index)">
                     <div class="col-6 mb-4" v-if="index === 20">
                        <site-banner type="in-announcement-list-left"/>
                     </div>
                     <div class="col-6 mb-4" v-if="index === 21">
                        <site-banner type="in-announcement-list-right"/>
                     </div>
                  </template>

                  <template
                     v-if="
                   (checkSecondTemplate(index) ? !checkItemB(index,announcement): true) &&
                    checkItemIndex(index + 1, announcement)"
                  >
                     <div
                        v-if="!isMobileBreakpoint"
                        class="col-6 col-xs-12 col-lg-3 col-xl-auto mb-2 mb-lg-3 align-items-center"
                        :class="{'col-lg-auto mb-lg-4 mt-lg-6 pt-lg-4 pb-lg-4': !showBanner,'d-lg-flex':showBanner }"
                        :key="'banner_' + index"
                     >
                        <site-banner @bannerLoaded="showBanner = true" v-show="showBanner" type="in-part"/>
                        <div
                           v-if="!showBanner && !isMobileBreakpoint"
                           class="announcements-grid_banner d-flex align-items-center justify-content-center"
                           @click="$router.push($localePath(bannerLink))"
                        >
                           <div
                              class="banner-bg"
                              style="background-size: contain; background-repeat: no-repeat"
                              :style="{backgroundImage: `url(${getBannerImage(index + 1)})`}"
                           ></div>
                        </div>
                     </div>
                  </template>
               </template>
               <template v-else-if="announcement.type === 'banner' && announcement.autosalon && !isMobileBreakpoint && announcement.type !== 6">
                  <div class="col-6 col-xs-6 col-lg-3 col-xl-auto mb-1 d-flex align-items-center">
                     <nuxt-link
                        :style="(!isMobileBreakpoint ? 'min-width: 203px;':'min-width: 175px;')+'min-height: 273px;'"
                        tag="div" :to="$localePath('/external-salons/'+announcement.autosalon.slug)"
                        class="index-salon-view cursor-pointer">
                        <img style="width: 150px;"
                             :src="announcement.autosalon.logo || `/img/salon-logo-${colorMode}.jpg`"/>
                     </nuxt-link>
                  </div>
               </template>
               <template v-else-if="announcement.type === 'banner' && isMobileBreakpoint && announcement.type !== 6">
                  <div class="col-6 col-xs-6 col-lg-3 col-xl-auto mb-2 mb-lg-3">
                     <site-banner @bannerLoaded="showBanner = true" v-show="showBanner" type="in-part"/>
                  </div>
               </template>
               <template v-else-if="announcement.type === 6">
                  <div
                     v-if="checkSecondTemplate(index) ? !checkItemB(index, announcement) : true"
                     :class="['registrationMarks-grid',
                         {
                           'active' : (index === 15) || (isMobileBreakpoint && index === 16) ,
                           'not-mt' : (isMobileBreakpoint && (index === 18 || index === 19)),
                           'col-lg-mid': checkItemIndex(index + 2, announcement) || (announcement.type === 6 && !isMobileBreakpoint),
                           'pt-4 mt-1': checkItemTop(index, announcement) || (announcement.external && !isMobileBreakpoint),
                           'pb-4 mb-4': checkItemBottom(index, announcement) || (announcement.external && !isMobileBreakpoint),
                           'col-6 col-xs-12 col-lg-3 col-xl-auto': !isProfilePage,
                           'col-6 col-xs-6 col-lg-3 col-xl-auto': isProfilePage,
                         },
                         checkItemB(index, announcement)
                           ? 'col-b mb-0 pb-2 mb-lg-4 mt-lg-6 pt-lg-4 pb-lg-4'
                           : 'mb-2 mb-lg-3',
                     ]"
                     :key="announcement.id_unique + (escapeDuplicates ? '_' + index : '')"
                  >
<!--                     <pre>{{index }} {{isMobileBreakpoint}}</pre>-->

                     <div class="registrationMarks__title">
                        <div class="divider">
                           <span>{{ $t('registration_badges_2') }}</span>

                           <inline-svg :src="'/icons/new_badge_3.svg'" />
                        </div>

                        <div class="divider">
                           <nuxt-link :to="$localePath('/registration-marks')">
                              <span>{{ $t('see_all') }}</span>

                              <inline-svg :src="'/icons/arrow-right.svg'" :width="'15px'" />
                           </nuxt-link>
                        </div>
                     </div>

                     <RegistrationMarksGridItem
                        :item="announcement"
                        :showFavoriteBtn="true"
                     />
                  </div>
               </template>
            </template>
         </div>
      </div>

      <pagination
         v-if="paginate && paginate.last_page > 1"
         :page-count="paginate.last_page"
         :value="paginate.current_page"
         @change-page="changePage"
      />
   </div>
</template>

<script>
import GridItem from '~/components/announcements/GridItem';
import SiteBanner from "~/components/banners/SiteBanner";
import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";
import RegistrationMarksGridItem from "~/components/announcements/RegistrationMarksGridItem.vue";

export default {
   props: {
      showMonetizationActions: {
         type: Boolean,
         default: true,
      },
      announcements: {
         type: Array,
         default: () => [],
      },
      title: String,
      iconName: String,
      showAll: String,
      showTitle: {
         type: Boolean,
         default: true,
      },
      trackViews: {
         type: Boolean,
         default: true,
      },
      pushIntoRouter: {
         type: Boolean,
         default: true,
      },
      showStatus: Boolean,
      showCheckbox: Boolean,
      showPhoneCount: Boolean,
      paginate: {},
      pending: Boolean,
      watchRoute: Boolean,
      escapeDuplicates: Boolean,
      hasContainer: Boolean,
      banner: String,
      bannerPlace: Number,
      bannerCount: Number,
      bannerFor: String,
      bannerLink: String,
      where: String,
      showOverlay: {
         type: Boolean,
         default: true,
      },
      clickable: {
         type: Boolean,
         default: true,
      },
      isProfilePage: Boolean,
      needAutoScroll: Boolean,
   },

   components: {
      SiteBanner,
      GridItem,
      RegistrationMarksGrid,
      RegistrationMarksGridItem
   },

   data() {
      return {
         showBanner: false,
      }
   },

   methods: {
      changePage(page) {
         if (this.showAll) {
            this.$emit('pending')
            this.$router.push({path: this.showAll, query: {page}}, () => {
               this.scrollTo('.announcements-grid', [-15, -20])
            })
         } else {
            if (!this.pushIntoRouter) {
               this.$emit('change-page', page)
            } else {
               this.$router.push({query: {...this.$route.query, page}}, () => {
                  this.$emit('change-page', page)
               })
            }
         }
      },
      checkItemIndex(index, item) {
         if (this.getAnnouncementType(item) !== this.bannerFor) return false
         return this.banner && index % this.bannerPlace === 0
      },
      checkItemB(index, item) {
         return (
            this.checkItemIndex(index + 1, item) ||
            this.checkItemIndex(index + 2, item) ||
            this.checkItemIndex(index + 3, item) ||
            this.checkItemIndex(index + 4, item)
         )
      },
      switchSecondTemplate() {
         this.$cookies.set('show_bn', !this.$cookies.get('show_bn'));
      },
      checkSecondTemplate(index) {
         return [20, 21, 22, 23].includes(index) && this.$cookies.get('show_bn') && !this.isMobileBreakpoint;
      },
      checkItemTop(index, item) {
         return (
            this.checkItemIndex(index + 3, item) ||
            this.checkItemIndex(index + 4, item)
         )
      },
      checkItemBottom(index, item) {
         return (
            this.checkItemIndex(index + 1, item) ||
            this.checkItemIndex(index + 2, item)
         )
      },
      getBannerImage(index) {
         let count = (index / this.bannerPlace) % this.bannerCount
         count = count === 0 ? this.bannerCount : count
         console.log(count,'banner count');
         return this.banner
            .replace('{count}', count)
            .replace('{locale}', this.locale)
      },
      scrollFunc() {
         setTimeout(() => {
            const el = this.$refs.scrollToMe
            if (el) {
               el.scrollIntoView({behavior: 'smooth', block: 'start'})
            }
         }, 1000)
      },
   },

   computed: {
      registrationMarks() {
         return this.announcements.filter(item => item.type === 6);
      }
   },

   watch: {
      '$route.query.page'(page) {
         if (this.watchRoute) this.changePage(page)
      },
   },

   mounted() {
      this.switchSecondTemplate();
      if (this.needAutoScroll) {
         this.scrollFunc()
      }
   },
}
</script>

<style lang="scss">
   .announcements-grid {
      .registrationMarks-grid {
         .registrationMarksGridItem {
            width: 214px;
            margin: 0 0 1.5rem 0 !important;

            &__head {
               h3 {
                  font-size: 35px;
               }
            }

            &__main {
               .divider {
                  &.info {
                     p {
                        span {
                           text-overflow: ellipsis;
                           overflow: hidden;
                           white-space: nowrap;
                        }
                     }
                  }
               }
            }
         }

         .registrationMarks__title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 1185px;
            visibility: hidden;
            margin: 52px 0 40px 0;

            .divider {
               display: flex;
               align-items: center;

               &:first-child {
                  span {
                     margin-top: -5px;
                     font-weight: 700;
                     font-size: 32px;
                     line-height: 40px;
                     color: #000000;
                     margin-right: 12px;
                  }
               }

               a {
                  display: flex;
                  align-items: center;
                  font-weight: 600;
                  font-size: 18px;
                  line-height: 20px;
                  text-decoration-line: underline;
                  color: #121926;
                  z-index: 5;

                  svg {
                     margin-left: 9px;
                  }
               }
            }
         }

         &.active {
            .registrationMarks__title {
               visibility: visible;
            }
         }

         &.not-mt {
            .registrationMarks__title {
               display: none;
            }
         }
      }
   }

   .index-salon-view {
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      padding: 35px 6px;
      background-size: contain;
      border-radius: 6px;
   }

   .dark-mode {
      .index-salon-view {
         background: #1C1C1E;
      }
   }

   @media (max-width: 1250px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               width: 900px;
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               width: 490px;

               .divider {
                  &:first-child {
                     text-overflow: ellipsis;
                     overflow: hidden;
                     white-space: nowrap;

                     span {
                        font-size: 20px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                     }

                     svg {
                        display: none;
                     }
                  }

                  a {
                     font-size: 16px;
                     span {
                        white-space: nowrap;
                     }
                  }
               }
            }

            .registrationMarksGridItem {
               width: 238px;

               &__head {
                  h3 {
                     font-size: 38px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 520px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               width: 205%;

               .divider {
                  &:first-child {
                     span {
                        margin-top: 1px;
                     }
                  }
               }
            }

            .registrationMarksGridItem {
               width: 100%;

               &__head {
                  h3 {
                     font-size: 35px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 460px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               //width: 205%;

               .divider {
                  &:first-child {
                     span {
                        //margin-top: 1px;
                        //font-size: 22px;
                     }

                     svg {
                        //display: none;
                     }
                  }
               }
            }

            .registrationMarksGridItem {
               //width: 100%;

               &__head {
                  h3 {
                     font-size: 32px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 430px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               //width: 205%;

               .divider {
                  &:first-child {
                     span {
                        //margin-top: 1px;
                        //font-size: 22px;
                     }

                     svg {
                        //display: none;
                     }
                  }
               }
            }

            .registrationMarksGridItem {
               //width: 100%;

               &__head {
                  h3 {
                     font-size: 29px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 400px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               //width: 205%;

               .divider {
                  a {
                     font-size: 16px;
                  }
               }
            }

            .registrationMarksGridItem {
               //width: 100%;

               &__head {
                  img {
                     width: 17px;
                  }

                  h3 {
                     font-size: 27px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 375px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               //width: 205%;

               .divider {
                  &:first-child {
                     span {
                        font-size: 20px;
                     }
                  }
                  a {
                     font-size: 14px;
                  }
               }
            }

            .registrationMarksGridItem {
               //width: 100%;

               &__head {
                  img {
                     width: 15px;
                  }

                  h3 {
                     font-size: 25px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 355px) {
      .announcements-grid {
         .registrationMarks-grid {
            .registrationMarks__title {
               //width: 205%;

               .divider {
                  &:first-child {
                     span {
                        //font-size: 20px;
                     }
                  }
                  a {
                     //font-size: 14px;
                  }
               }
            }

            .registrationMarksGridItem {
               //width: 100%;

               &__head {
                  height: 60px;
                  padding: 0 12px;

                  img {
                     width: 30px;
                  }

                  h3 {
                     font-size: 50px;
                  }
               }
            }
         }
      }
   }

   @media (min-width: 1025px) {
      .announcements-grid .col-lg-auto {
         width: 20%;
      }

      .dark-mode {
         .index-salon-view {
            background: #242426;
         }
      }
   }
</style>
