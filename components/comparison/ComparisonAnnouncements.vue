<template>
   <div>
      <div class="comparison__items" v-if="announcements.length">
         <div
            class="comparison__item "
            v-for="announcement in announcements"
            :key="announcement.id_unique"
         >
            <grid-item
               :announcement="announcement"
               :clickable="false"
               :showOverlay="true"
               :isComparisonPage="true"
               @removeItem="removeItem"
            />
<!--            <div class="comparison__item__image">-->
<!--               <img :src="getAnnouncementImage(announcement)" :alt="getAnnouncementTitle(announcement)">-->
<!--               <div class="action-button action-button&#45;&#45;close" @click="removeItem(announcement.id_unique)">-->
<!--                  <icon name="cross"/>-->
<!--                  &lt;!&ndash; <inline-svg src="/icons/cross.svg" /> &ndash;&gt;-->
<!--               </div>-->
<!--            </div>-->
<!--            <div class="comparison__item__title">{{ getAnnouncementTitle(announcement) }}</div>-->
<!--            <div class="comparison__item__price">{{ announcement.price }}</div>-->
<!--            <call-button-->
<!--               class="comparison__item__phone"-->
<!--               :phone="getAnnouncementContact(announcement).phone"-->
<!--               :announcementId="announcement.id_unique"-->
<!--            />-->
         </div>
      </div>

      <div class="comparison__specifications" v-if="announcements.length">
         <template v-for="(collapse, cIndex) in collapses">
            <collapse-content
               :key="cIndex"
               :first-collapsed="collapse.defaultCollapsed"
               @click.native="$nuxt.$emit('update-comparison-scroll-events')"
            >
               <div
                  class="collapse-content__element"
                  v-for="(specification, sindex) in filteredSpecs(collapse.items)"
                  :key="sindex"
               >
                  <div class="collapse-content__columns">
                     <div
                        class="collapse-content__column"
                        v-for="(announcement, aIndex) in announcements"
                        :key="announcement.id_unique"
                     >
                        <h2 v-if="sindex === 0">{{ collapse.title }}</h2>
                        <h3>{{ specification.title }}</h3>
                        <p>{{ specification.values[aIndex] }}</p>
                     </div>
                  </div>
               </div>
            </collapse-content>
         </template>
      </div>
   </div>
</template>

<script>
   import {mapGetters} from 'vuex';
   import {ComparisonMixin} from '~/mixins/comparison'
   import CallButton from '~/components/announcements/CallButton';
   import CollapseContent from '~/components/elements/CollapseContent';
   import GridItem from "~/components/announcements/GridItem.vue";

   export default {
      mixins: [ComparisonMixin],

      components: {
         CallButton,
         CollapseContent,
         GridItem
      },

      methods: {
         removeItem(id) {
            this.$store.dispatch('comparison/removeAnnouncement', id);
         },
      },

      computed: {
         ...mapGetters({
            announcements: 'comparison/announcementsList',
            filter: 'comparison/filter',
         }),

         collapses() {
            return [
               {
                  title: this.$t('announcement_info'),
                  defaultCollapsed: false,
                  items: [
                     {
                        title: this.$t('modification_and_supply'),
                        values: this.announcements.map(a => this.getModificationAndSupply(a.car_catalog)),
                     },
                     {
                        title: this.$t('years'),
                        values: this.announcements.map(a => this.getYear(a)),
                     },
                     {
                        title: this.$t('mileage'),
                        values: this.announcements.map(a => this.getMileage(a)),
                     },
                     {
                        title: this.$t('color'),
                        values: this.announcements.map(a => this.getColor(a)),
                     },
                     {
                        title: this.$t('customs'),
                        values: this.announcements.map(a => this.getCustomsClearance(a)),
                     },
                     {
                        title: this.$t('first_owner'),
                        values: this.announcements.map(a => this.getOwnerType(a)),
                     },
                  ]
               },
               {
                  title: this.$t('ekspluatatsionnye-pokazateli'),
                  defaultCollapsed: false,
                  items: [
                     {
                        title: this.$t('max_speed'),
                        values: this.announcements.map(a => this.getMaxSpeed(a.car_catalog)),
                     },
                     {
                        title: this.$t('razgon-do-100-kmch-s'),
                        values: this.announcements.map(a => this.getAcceleration100(a.car_catalog)),
                     },
                     {
                        title: this.$t('fuel_consumption_city'),
                        values: this.announcements.map(a => this.getFuelConsumptionCity(a.car_catalog)),
                     },
                     {
                        title: this.$t('fuel_consumption_highway'),
                        values: this.announcements.map(a => this.getFuelConsumptionTrack(a.car_catalog)),
                     },
                     {
                        title: this.$t('fuel_consumption_mixed'),
                        values: this.announcements.map(a => this.getFuelConsumptionMixed(a.car_catalog)),
                     },
                     {
                        title: this.$t('fuel_type'),
                        values: this.announcements.map(a => this.getFuelBrand(a.car_catalog)),
                     },
                     {
                        title: this.$t('ekologicheskiy-klass'),
                        values: this.announcements.map(a => this.getEcoClass(a.car_catalog)),
                     },
                  ]
               },
               {
                  title: this.$t('dvigatel'),
                  defaultCollapsed: false,
                  items: [
                     {
                        title: this.$t('fuel'),
                        values: this.announcements.map(a => this.getEngineType(a.car_catalog)),
                     },
                     {
                        title: this.$t('horse_power') + '/' + this.$t('max_horse_power'),
                        values: this.announcements.map(a => this.getHorsePower(a.car_catalog)),
                     },
                     {
                        title: this.$t('maksimalnyy-krutyashchiy-moment'),
                        values: this.announcements.map(a => this.getTorque(a.car_catalog)),
                     },
                  ]
               },
               {
                  title: this.$t('dimensions'),
                  defaultCollapsed: false,
                  items: [
                     {
                        title: this.$t('length'),
                        values: this.announcements.map(a => this.getLength(a.car_catalog)),
                     },
                     {
                        title: this.$t('width'),
                        values: this.announcements.map(a => this.getWidth(a.car_catalog)),
                     },
                     {
                        title: this.$t('height'),
                        values: this.announcements.map(a => this.getHeight(a.car_catalog)),
                     },
                     {
                        title: this.$t('kolesnaya-baza'),
                        values: this.announcements.map(a => this.getWheelBase(a.car_catalog)),
                     },
                     {
                        title: this.$t('shirina-peredney-kolei'),
                        values: this.announcements.map(a => this.getFrontWheelWidth(a.car_catalog)),
                     },
                     {
                        title: this.$t('shirina-zadney-kolei'),
                        values: this.announcements.map(a => this.getRearWheelWidth(a.car_catalog)),
                     },
                  ]
               },
            ]
         }
      }
   }
</script>

<style lang="scss">
   .comparison {
      padding-bottom: 40px;

      &__specifications {
         margin-top: 32px;

         .title-with-line {
            width: 200%;
         }

         .collapse-content {
            &__column {
               h2 {
                  color: #121926;
                  font-size: 18px;
                  font-weight: 600;
                  line-height: 22px;
                  margin-bottom: 24px;
               }

               h3 {
                  color: #4B5565;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 16px;
                  margin-bottom: 8px;
                  cursor: default;
               }

               p {
                  color: #121926;
                  font-size: 16px;
                  font-weight: 500;
                  line-height: 20px;
               }
            }

            & > div {
               & > div {
                  .collapse-content__element {
                     &:not(:last-child) {
                        .collapse-content__column {
                           margin-bottom: 16px;
                           padding-bottom: 16px;
                           border-bottom: 1px solid #E3E8EF;
                        }
                     }
                  }
               }
            }

            &:not(:first-child) {
               margin-top: 40px;
            }
         }
      }
   }
</style>
