<template>
  <div>
    <!-- Announcements -->
    <div class="comparison__items row" v-if="announcements.length">
        <div
          class="comparison__item col-auto col-lg-1-5"
          v-for="announcement in announcements"
          :key="announcement.id_unique"
        >
          <div
            class="comparison__item__image"
          >
            <img :src="getAnnouncementImage(announcement)" :alt="getAnnouncementTitle(announcement)">
            <div class="action-button action-button--close" @click="removeItem(announcement.id_unique)">
              <icon name="cross" />
            </div>
          </div>
          <div class="comparison__item__title">{{ getAnnouncementTitle(announcement) }}</div>
          <div class="comparison__item__price">{{ announcement.price }}</div>
          <call-button
            class="comparison__item__phone"
            :phone="getAnnouncementContact(announcement).phone"
            :announcementId="announcement.id_unique"
          />
        </div>
    </div>

    <!-- Specifications -->
    <div class="comparison__specifications" v-if="announcements.length">
      <h2 class="title-with-line full-width">
        <span>{{ $t('characteristics') }}</span>
      </h2>

      <template v-for="(collapse, cIndex) in collapses">
        <collapse-content
          :key="cIndex"
          :title="collapse.title"
          :first-collapsed="collapse.defaultCollapsed"
          @click.native="$nuxt.$emit('update-comparison-scroll-events')"
        >
          <div v-for="(specification, sindex) in filteredSpecs(collapse.items)" :key="sindex">
            <h4 class="collapse-content__title">
              {{ specification.title }}
            </h4>

            <div class="collapse-content__columns row" >
              <div v-for="(announcement, aIndex) in announcements" :key="announcement.id_unique" class="collapse-content__column col-auto col-lg-1-5" >
                <p>{{ specification.values[aIndex] }}</p>
              </div>
            </div>
            <hr v-if="sindex < filteredSpecs(collapse.items).length - 1" :key="'hr'+sindex">
          </div>

        </collapse-content>
        <hr v-if="cIndex < collapses.length - 1" :key="'hr'+cIndex">
      </template>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ComparisonMixin } from '~/mixins/comparison'
import CallButton from '~/components/announcements/CallButton';
import CollapseContent from '~/components/elements/CollapseContent';

export default {
  mixins: [ComparisonMixin],
  components:{
    CallButton,
    CollapseContent
  },
  methods: {
    removeItem(id) {
      this.$store.dispatch('comparison/removeAnnouncement', id)
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
          title: this.$t('announcement'),
          defaultCollapsed: false,
          items: [
            {
              title: this.$t('modification_and_supply'),
              values: this.announcements.map(a => this.getModificationAndSupply(a.car_catalog)),
            },
            {
              title: this.$t('years'),
              values: this.announcements.map(a => this.getYear(a.car_catalog)),
            },
            {
              title: this.$t('mileage'),
              values: this.announcements.map(a => this.getMileage(a.car_catalog)),
            },
            {
              title: this.$t('color'),
              values: this.announcements.map(a => this.getColor(a.car_catalog)),
            },
            {
              title: this.$t('customs'),
              values: this.announcements.map(a => this.getCustomsClearance(a.car_catalog)),
            },
            {
              title: this.$t('first_owner'),
              values: this.announcements.map(a => this.getOwnerType(a.car_catalog)),
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
    },
  }
}
</script>