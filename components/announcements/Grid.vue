<template>
   <div :class="['announcements-grid', { 'loading-content': pending, paginated: paginate }]">
      <div :class="{'container' : hasContainer}" v-if="title">
         <slot name="cap" />

         <div class="announcements-grid__inner" :class="{'my-announcements-grid__inner': myAnnouncementsPage}">
            <grid-item
               v-for="(announcement, index) in announcements"
               :key="announcement.id_unique + (escapeDuplicates ? '_' + index : '')"
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

            <div v-if="announcementsBanner" :style="{ background: `url('${bannerLogo}') center center / cover no-repeat` }"></div>
         </div>
      </div>

      <pagination
         v-if="paginate && paginate.total_pages > 1"
         :page-count="paginate.total_pages"
         :value="paginate.current_page"
         @change-page="changePage"
      />
   </div>
</template>

<script>
   import GridItem from '~/components/announcements/GridItem';
   import SiteBanner from "~/components/banners/SiteBanner";
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import PlatesGridItem from "~/components/announcements/PlatesGridItem.vue";

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
         title: {
            type: Boolean,
            default: true
         },
         numberOfAds: [Number, String],
         iconName: String,
         showAll: String,
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
         hasContainer: {
            type: Boolean,
            default: true
         },
         banner: String,
         bannerPlace: Number,
         bannerCount: Number,
         bannerFor: String,
         // bannerLink: String,
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
         myAnnouncementsPage: Boolean,
         announcementsBanner: {
            type: Object,
            default() { return{} }
         },
      },

      components: {
         SiteBanner,
         GridItem,
         PlatesGrid,
         PlatesGridItem
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
         },

         bannerLogo() {
            return this.announcementsBanner?.logo ? this.announcementsBanner?.logo : `/img/parts_banner_${this.locale}.jpg`
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
      }
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
