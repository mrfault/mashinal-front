<template>
   <div class="pages-announcement-edit">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <car_form isEdit :announcement="announcement" :isReady="isReady"
                            :preview="previewForm"
                            @getForm="getCarForm($event)"/>
                  <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
                     {{ $t("place_announcement") }}
                  </button>
               </form>
               <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
                  <client-only>
                     <grid-item :announcement="previewForm"/>
                  </client-only>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import SellLastStep from '~/components/sell/SellLastStep';
import SellPreview from '~/components/sell/SellPreview';
import Car_form from "~/components/sell/car_form.vue";
import GridItem from "~/components/announcements/GridItem.vue";

export default {
   name: 'pages-moto-announcement-edit',
   middleware: 'auth_general',
   components: {
      GridItem,
      Car_form,
      SellLastStep,
      SellPreview
   },
   nuxtI18n: {
      paths: {
         az: '/masinlar/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('your_announcements')
      });
   },
   data() {
      return {
         previewForm: {
            image: "",
            show_vin: true,
            has_360: true,
            price: "0 AZN",
            tradeable: false,
            credit: false,
            brand: "Marka",
            model: "Model",
            year: "0000",
            mileage: 0,
            car_catalog: {capacity: "0"},
            created_at: ""
         },
         isReady: false
      }
   },
   async asyncData({store, route, app}) {
      store.dispatch('setSellPreviewData', {value: {}});
      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
         store.dispatch('getAllOtherOptions'),
         store.dispatch('getPopularOptions'),
         store.dispatch('getMyAnnouncement', route.params.id)
      ]);
      const announcement = store.state.myAnnouncement;
      const catalog = announcement.car_catalog;

      return {
         lastStepKey: 0,
         form: {
            car_catalog_id: announcement.car_catalog_id,
            brand: announcement?.brand?.slug,
            model: announcement?.model?.slug,
            generation_id: catalog.generation_id,
            car_body_type: catalog.car_type.id,
            gearing: catalog.main['  ']['engine'], // engines
            modification: catalog.main[' ']['box'], // transmissions/box
            transmission: catalog.main[' ']['type_of_drive'], // gearing
            capacity: catalog.capacity,
            power: catalog.power,
            year: announcement.year,
            auction: announcement.auction,
            end_date: app.$moment(announcement.end_date).format('DD.MM.YYYY HH:mm'),
            country_id: announcement.country_id,
            youtube: {
               id: announcement.youtube_link,
               thumb: `https://img.youtube.com/vi/${announcement.youtube_link}/hqdefault.jpg`
            },
            selectedColor: announcement.colors,
            is_matte: announcement.is_matte,
            mileage: parseInt(announcement.mileage || 0),
            mileage_measure: announcement.mileage_measure || 1,
            region_id: announcement.region_id || 1,
            address: announcement.address,
            lat: parseFloat(announcement.latitude || 0),
            lng: parseFloat(announcement.longitude || 0),
            vin: announcement.vin,
            price: announcement.price_int || '',
            owner_type: parseInt(announcement.owner_type || 0),
            currency: announcement.currency_id || 1,
            car_number: announcement.car_number,
            show_car_number: announcement.show_car_number,
            show_vin: announcement.show_vin,
            part: announcement.car_body_health ? JSON.parse(announcement.car_body_health.options) : {},
            all_options: app.$clone(announcement.options),
            badges: announcement.stickers?.map(item => item.id),
            new_badges: [],
            comment: announcement.comment || '',
            is_new: announcement.is_new,
            beaten: announcement.broken,
            customs_clearance: announcement.customs_clearance,
            tradeable: announcement.exchange_possible,
            credit: announcement.credit,
            guaranty: announcement.in_garanty,
            saved_images: announcement.mediaIds
         }
      }
   },
   computed: {
      ...mapGetters({
         announcement: 'myAnnouncement'
      }),

      crumbs() {
         return [
            {name: this.$t('my_announces'), route: `/profile/announcements`},
            {name: `#${this.announcement.id_unique}`, route: `/cars/announcement/${this.$route.params.id}`},
            {name: this.$t('edit_ad')}
         ]
      }
   },
   methods: {
      ...mapActions(['carEdit']),
      async getCarForm(form) {
         const formData = new FormData()
         formData.append('data', JSON.stringify(form))
         try {
            await this.carEdit({
               id: this.$route.params.id.slice(0, -1),
               isMobile: this.isMobileBreakpoint,
               form: formData
            })
            this.$router.push(this.$localePath('/profile/announcements'))
         } catch (e) {
         }
      },
      getCurrencyName() {
         switch(this.announcement.currency_id) {
            case 1:
               return 'AZN';
            case 2:
               return 'USD';
            case 3:
               return 'EUR';
            default:
               return 'AZN'
         }
      },
      onClick() {
         this.isReady = !this.isReady
      },
   },
   mounted() {
      this.previewForm = {
         image: this.announcement.media[0],
         show_vin: this.announcement.show_vin,
         has_360: true,
         price: this.announcement.price_int + ' ' + this.getCurrencyName(),
         tradeable: this.announcement.exchange_possible,
         credit: this.announcement.credit,
         brand: this.announcement.brand.name,
         model: this.announcement.model.name,
         year: this.announcement.year,
         mileage: this.announcement.mileage,
         car_catalog: {capacity: this.announcement.car_catalog.capacity},
         created_at: this.$formatDate(this.announcement.created_at, 'D.MM.YYYY')[this.locale]
      }
   },
}
</script>

<style lang="scss">
.pages-announcement-edit {
   padding-bottom: 80px;

   .btn {
      height: 52px;
   }

   .announce_container {
      display: flex;
      column-gap: 16px;

      .card {
         flex-grow: 3;
         display: flex;
         gap: 20px;

         &_title {
            font-size: 24px;
            font-weight: 600;
         }

         .add_announce_info {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
            background-color: #EEF2F6;
            border-radius: 12px;


            &_svg {
               min-width: 32px;
               min-height: 32px;
               color: #155EEF;
            }
         }

         .add_announce_form {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 20px;

            .divider {
               display: grid;
               grid-template-columns: repeat(2, calc(50% - 8px));
               gap: 16px;

               .mileage_types {
                  display: flex;
                  gap: 16px;
               }

               .map_btn {
                  width: 24px;
                  height: 24px;
                  color: #155eef;
               }

               .price_types {
                  .price_item {
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     height: 52px;
                     padding: 0 8px;
                  }
               }

               .car_number_suffix {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  right: 16px;
               }
            }


            .contacts {
               display: flex;
               flex-direction: column;
               gap: 16px;
               margin-top: 24px;

               svg {
                  min-width: 24px;
                  min-height: 24px;
               }

               h2 {
                  margin-bottom: 24px;
               }

               &_info {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  padding: 12px 16px;
                  background-color: #EEF2F6;
                  border-radius: 8px;
               }

               .service_packages {
                  display: flex;
                  gap: 16px;

                  .package {
                     position: relative;
                     flex-grow: 1;
                     display: flex;
                     flex-direction: column;
                     gap: 16px;
                     padding: 20px 16px;
                     border: 1px solid #CDD5DF;
                     border-radius: 12px;
                     overflow: hidden;
                     cursor: pointer;

                     .title {

                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #CDD5DF;


                        p {
                           font-size: 16px;
                           font-weight: 700;
                        }

                        .stars_svg {
                           width: 24px;
                           height: 24px;
                           color: #0A77E8;
                        }
                     }

                     .sale_effect {
                        width: 100%;
                        position: absolute;
                        top: 14px;
                        left: 74px;
                        background-color: #D1E0FF;
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        justify-content: center;
                        transform: rotate(45deg);
                        padding: 2px 0;

                        p {
                           font-size: 17px;
                           font-weight: 600;
                        }

                        span {
                           line-height: 13px;
                           font-size: 11px;
                           font-weight: 600;
                        }
                     }

                     .content {

                        &_list {
                           padding: 20px 0;
                           display: flex;
                           align-items: center;
                           gap: 12px;

                           .check_svg {
                              color: #CDD5DF;

                           }

                           .active {
                              color: #12B76A;
                           }
                        }
                     }

                     .package_price {
                        position: relative;
                        padding: 4px 8px;
                        height: 56px;
                        margin-top: auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 8px;
                        background-color: #D1E0FF;
                        font-size: 15px;
                        font-weight: 700;
                        text-align: center;

                        span {
                           display: block;
                           font-size: 11px;
                           font-weight: 500;
                        }

                        .badge {
                           position: absolute;
                           top: -21px;
                           right: 8px;
                           background-color: #F81734;
                           padding: 4px 6px;
                           border-radius: 6px;
                           color: #fff;
                           font-size: 13px;
                           font-weight: 600;
                        }
                     }

                     &.selected {
                        border-color: #004EEB;

                        .package_price {
                           background-color: #004EEB;
                           color: #fff;
                        }

                        .sale_effect {
                           background-color: #004EEB;
                           color: #fff;
                        }
                     }
                  }
               }
            }
         }

         .vehicle_card_info {
            position: sticky;
            top: 128px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            height: min-content;
            width: 260px;
            min-width: 260px;

            &_description {
               background-color: #EEF2F6;
               border-radius: 8px;
               padding: 10px;
               text-align: center;
            }

            &_help {
               display: flex;
               padding: 16px 12px;
               flex-direction: column;
               gap: 16px;
               border-radius: 12px;
               border: 1px solid #CDD5DF;
               background-color: #F8FAFC;

               &_inner {
                  display: flex;
                  align-items: center;
                  gap: 10px;

                  svg {
                     min-width: 24px;
                     min-height: 24px;
                  }
               }
            }

            .item-bg {
               background-repeat: no-repeat;
               background-size: inherit;
            }
         }


      }


      .beaten_suffix {
         position: relative;
         z-index: 1;
         margin-left: auto;
         cursor: progress;
      }

      .comment {
         &_info {
            display: flex;
            align-items: center;
            gap: 10px;
         }
      }
   }
}

.dark-mode {
   .pages-announcement-edit {
      .btn {
         height: 52px;
      }

      .announce_container {


         .card {


            .add_announce_form {
               .info_svg {
                  color: #4B5565 !important;
               }

               .checkbox-input input:checked ~ label {
                  background-color: #121926 !important;

                  .checkbox {
                     background: #121926 !important;
                  }
               }


               .contacts {

                  &_info {
                     background-color: #364152;
                  }
               }
            }

            .vehicle_card_info {
               &_description {
                  background-color: #00359E;
               }

               &_help {
                  background-color: #364152;
               }
            }


         }
      }
   }
}

@media (max-width: 1150px) {
   .form_navigation {
      display: none;
   }
}

@media (max-width: 485px) {
   .pages-announcement-edit {
      padding: 24px 0 32px 0;

      &_title {
         font-size: 24px;
         font-weight: 700;
         margin-bottom: 16px;
      }

      .announce_container {
         .divider {

            &.mobile-column {
               display: flex !important;
               flex-direction: column;
            }
         }

         .card {
            &_title {
               font-size: 20px;
            }

            &_container {
               .add_announce_form {
                  .contacts {
                     .service_packages {
                        flex-direction: column;
                     }
                  }
               }
            }

         }
      }
   }
}
</style>
