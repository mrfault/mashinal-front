<template>
   <div class="vehicle-specs">
      <h4 class="vehicle-specs__title">{{ title }}</h4>
<!--      <pre>{{announcement}}</pre>-->

      <div class="vehicle-specs__inner">
         <ul
            class="vehicle-specs__list"
            v-for="(ul, i) in $chunk(announcementSpecs, Math.ceil(announcementSpecs.length / 3))" :key="i"
         >
            <li
               class="vehicle-specs__list-item"
               v-if="!(announcement.is_external_salon && spec.key === 'customs') && spec.value"
               v-for="spec in ul"
               :key="spec.key" :class="{'is-vin-number': (spec.key === 'vin')}"
            >
               <inline-svg
                  width="32px"
                  height="32px"
                  v-if="spec.icon"
                  :src="spec.icon"
               />

               <div class="vehicle-specs__list-description">
                  <h6>{{ $t(spec.key) }}</h6>
                  <h5>{{ spec.value }}</h5>
               </div>
               <!--            <span>-->
               <!--               {{ $t(spec.key === 'engine' ? 'engine_only' : spec.key) }}-->
               <!--            </span>-->

               <!--            <span v-if="spec.key !== 'vin'">{{ spec.value }}</span>-->

               <!--            <span v-else>-->
               <!--               <p class="mb-0" style="width: calc(100% - 30px)">{{ spec.value }}</p>-->
               <!--            </span>-->
            </li>
         </ul>
      </div>

      <nuxt-link class="vehicle-specs__btn" :to="catalogLink" v-if="catalog">
         <span>{{ $t('catalog_model_specifications') }}</span>

         <inline-svg src="/icons/arrow-right.svg" width="20px" height="20px" />
      </nuxt-link>

<!--      <div v-if="isMobileBreakpoint && announcement.status != 3" class="mt-3 mt-lg-0">-->
<!--         <floating-cta :announcement="announcement"/>-->
<!--      </div>-->
   </div>
</template>

<script>
   import FloatingCta from '~/components/announcements/inner/FloatingCta';
   import { AnnouncementDataMixin } from '~/mixins/announcement';
   import { mapGetters } from 'vuex';

   export default {
      props: {
         title: {
            type: String
         },
         type: String,
         brief: Boolean
      },

      components: {
         FloatingCta
      },

      mixins: [AnnouncementDataMixin],

      computed: {
         ...mapGetters(['announcement', 'catalog', 'sellOptions', 'motoOptions']),

         announcementSpecs() {
            let gearIcon;

            if (this.gear?.type === 1) {
               gearIcon = 'gearing_back';
            } else if (this.gear?.type === 2) {
               gearIcon = 'gearing_front'
            } else {
               gearIcon = 'gearing_4x4';
            }

            const specs = [
               {
                  key: 'years', value: this.announcement.year,
                  icon: '/icons/calendar-5.svg'
               },
               {
                  key: 'region',
                  value: this.announcement.region?.name[this.locale],
                  icon: '/icons/location.svg'
               },
               {
                  key: 'country',
                  value: this.announcement[`country_name_${this.locale}`],
                  // icon: '/icons/speedometer.svg',
                  for: ['cars', 'commercial', 'moto']
               },
               {
                  key: 'mileage',
                  value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''),
                  icon: '/icons/speedometer.svg',
                  for: ['cars', 'commercial', 'moto']
               },
               {
                  key: 'condition',
                  value: (this.announcement.broken || this.announcement.status_id || this.announcement.beaten) && this.$t('bitie'),
                  // icon: '/icons/car-2.svg'
               },
               {
                  key: 'guaranty',
                  value: (this.announcement.in_garanty || this.announcement.guaranty) && this.$t('in_garanty'),
               },
               {
                  key: 'com_equip_type',
                  value: this.commercialType,
                  for: ['commercial']
               },
               {
                  key: 'carcase',
                  value: this.bodyType, for: ['cars'],
                  icon: '/icons/car-2.svg'
               },
               {
                  key: 'color2',
                  value: this.color,
                  for: ['cars', 'commercial', 'moto'],
                  icon: '/icons/color.svg'
               },
               {
                  key: 'engine',
                  value: this.engineSpecs,
                  icon: '/icons/engine.svg'
               },
               {key: 'the_number_of_measures', value: this.tact, for: ['moto']},
               {key: 'cylinder_block', value: this.cylinderBlock, for: ['moto']},
               {key: 'fuel_type', value: this.fuelType, for: ['moto']},
               {
                  key: 'box',
                  value: this.box,
                  icon: '/icons/box.svg'
               },
               {
                  key: 'privod',
                  value: this.gear?.name,
                  icon: `/icons/${gearIcon}.svg`
               },
               {
                  key: 'condition_2',
                  value: this.announcement.is_new ? this.$t('new_2') : this.$t('with_mileage'),
                  icon: '/icons/search_2.svg'
               },
               {key: 'type_of_brakes', value: this.brakeType, for: ['commercial']},
               {key: 'wheel_formula', value: this.wheelFormula, for: ['commercial']},
               {key: 'loading', value: this.loadingKg, for: ['commercial']},
               {key: 'number_of_axles', value: this.numberOfAxes, for: ['commercial']},
               {key: 'working_hours', value: this.announcement.moto_hours, for: ['commercial']},
               {key: 'com_truck_cabin', value: this.announcement.cabin_type?.name?.[this.locale], for: ['commercial']},
               {key: 'seat_count', value: this.announcement.seats, for: ['commercial']},
               {key: 'exhaust_class', value: this.exhaustClass, for: ['commercial']},
               {key: 'cab_suspension', value: this.cabinSuspension, for: ['commercial']},
               {key: 'chassis_suspension', value: this.chassisSuspension, for: ['commercial']},
               // { key: 'first_owner', value: (parseInt(this.announcement.owner_type || this.announcement.owners || this.announcement.owner)) ? this.$t('no') : this.$t('yes'), for: ['cars', 'commercial', 'moto'] },
               // {
               //    key: 'customs',
               //    value: (this.announcement.customs_clearance || this.announcement.customed_id || this.announcement.customed) ? this.$t('not_cleared') : this.$t('cleared'),
               //    for: ['cars', 'commercial', 'moto']
               // },
               {key: 'product_code', value: this.announcement.product_code, for: ['parts']},
               {key: 'category', value: this.announcement?.category?.name[this.locale], for: ['parts']},
               {key: 'sub_category', value: this.announcement?.sub_category?.name[this.locale], for: ['parts']},
               {key: 'brand_name', value: this.announcement?.brand?.name, for: ['parts']},
               {
                  key: 'vin',
                  value: this.announcement.show_vin && this.announcement.vin,
                  icon: '/icons/vin_3.svg'
               },
               {key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number},
               {
                  key: 'exchange',
                  value: (this.announcement.exchange_possible || this.announcement.tradeable) && this.$t('is_possible')
               },
               {key: 'credit', value: this.announcement.credit && this.$t('is_in_credit')},
               {key: 'condition', value: this.condition, for: ['parts']},
               {key: 'is_original', value: this.announcement.is_original ? this.$t('yes') : this.$t('no'), for: ['parts']},
               {
                  key: 'have_delivery',
                  value: this.announcement.have_delivery ? this.$t('yes') : this.$t('no'),
                  for: ['parts']
               },
               {
                  key: 'have_warranty',
                  value: this.announcement.have_warranty ? this.$t('yes') : this.$t('no'),
                  for: ['parts']
               },
               {key: 'commercial_size', value: this.announcement.commercial_size}

            ];

            if (this.announcement.is_external_salon) {
               let index = specs.findIndex(item => item.key === 'region');
               delete specs[index]
            }
            let mergedKeys = [
               'shine_width', 'diameter', 'height'
            ];
            let mergedValues = {
               shine_width: '',
               height: '',
               diameter: ''
            };

            // Dynamic specs
            if (this.type === 'parts') {
               console.log('ssss', this.announcement)
               Object.keys(this.announcement?.filters)?.forEach(filter => {
                  let value = this.announcement?.filters[filter]

                  if (value) {
                     if (typeof value === 'boolean') {
                        value = value ? this.$t('yes') : this.$t('yes');
                     } else if (typeof value === 'object') {
                        value = this.$t(value.name)
                     }

                     if (mergedKeys.includes(filter)) {
                        mergedValues[filter] = value;
                     } else {
                        specs.push({
                              key: filter.replace('capacity', 'battery_capacity'),
                              value,
                              for: ['parts']
                           }
                        )
                     }

                  }
               })

               if (mergedValues['shine_width'])
                  specs.push({
                     key: 'size',
                     value: mergedValues['shine_width'] + '/' + mergedValues['height'] + 'R' + mergedValues['diameter'],
                     for: ['parts']
                  })
               else if (mergedValues['diameter']) {
                  specs.push({
                     key: 'diameter',
                     value: mergedValues['diameter'],
                     for: ['parts']
                  })
               }
            }

            let filteredSpecs = specs.filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
            return this.brief ? filteredSpecs.slice(0, 5) : filteredSpecs;
         },

         catalogLink() {
            // console.log('this.catalog', this.catalog)
            let path = this.catalog && `/catalog/${this.catalog.brand.slug}/${this.catalog.model.slug}/${this.catalog.generation.id}/${this.catalog.car_type.id}/mod/${this.catalog.id}`;
            return path && this.$localePath(path);
         }
      }
   }
</script>

<style lang="scss">
   .vehicle-specs {
      padding: 32px 24px;
      border-radius: 12px;
      border: 1px solid #E3E8EF;

      &__title {
         font-size: 24px;
         font-weight: 600;
         line-height: 28px;
         color: #1B2434;
      }

      &__inner {
         display: flex;
         justify-content: space-between;
      }

      &__list {
         position: relative;
         margin-top: 24px;
         width: 100%;

         &:not(:first-child) {
            &:before {
               content: '';
               position: absolute;
               top: 0;
               left: -24px;
               width: 1px;
               height: 100%;
               background-color: #E3E8EF;
            }
         }

         &-item {
            display: flex;
            align-items: center;

            &:not(:first-child) {
               margin-top: 24px;
            }

            svg {
               min-width: 32px;
            }
         }

         &-description {
            margin-left: 12px;

            h5 {
               font-size: 15px;
               font-weight: 500;
               line-height: 18px;
               color: #364152;
            }

            h6 {
               font-size: 14px;
               font-weight: 400;
               line-height: 16px;
               color: #697586;
            }
         }
      }

      &__btn {
         display: inline-flex;
         align-items: center;
         margin-top: 24px;
         border-radius: 8px;
         padding: 15px 20px;
         background-color: #FFF;
         border: 1px solid #CDD5DF;
         transition: all .3s;

         span {
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            color: #1B2434;
            white-space: nowrap;
            margin-right: 13px;
         }

         &:hover {
            border-color: #84ADFF;
         }
      }
   }

   .dark-mode {
      .vehicle-specs {
         border-color: #1B2434;
         background-color: #1B2434;

         &__title {
            color: #EEF2F6;
         }

         &__list {
            &-description {
               h6 {
                  color: #9AA4B2;
               }

               h5 {
                  color: #EEF2F6;
               }
            }

            &:not(:first-child) {
               &:before {
                  background-color: #4B5565;
               }
            }
         }

         &__btn {
            border-color: #E3E8EF;
            background-color: transparent;

            &:hover {
               border-color: #4B5565;
            }

            span {
               color: #EEF2F6 !important;
            }

            svg {
               path {
                  fill: #EEF2F6;
               }
            }
         }
      }
   }

   @media (max-width: 1150px) {
      .vehicle-specs {
         //&__inner {
         //   flex-direction: column;
         //}

         &__list {
            &:not(:first-child) {
               &:before {
                  display: none;
               }
            }
         }
      }
   }

   @media (max-width: 385px) {
      .vehicle-specs {
         padding: 16px;

         &__btn {
            padding: 14px;

            span {
               font-size: 14px;
            }
         }
      }
   }
</style>
