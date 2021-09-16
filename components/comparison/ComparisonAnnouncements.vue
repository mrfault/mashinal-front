<template>
  <div>
    <!-- Announcements -->
    <div class="comparison__items" v-if="announcements.length">
        <div
          class="comparison__item"
          v-for="announcement in announcements"
          :key="announcement.id_unique"
        >
          <div
            class="comparison__item__image"
            :style="`background-image: url(${getAnnouncementImage(announcement)})`"
          >
            <div class="comparison__item__image--close" @click="removeItem(announcement.id_unique)">
              <icon name="cross" />
            </div>
          </div>
          <div class="comparison__item__title">{{ getAnnouncementTitle(announcement) }}</div>
          <div class="comparison__item__price">{{ announcement.price }}</div>
          <call-button
            class="comparison__item__phone"
            :phone="getAnnouncementContact(announcement)"
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
        >
          <div v-for="(specification, sindex) in filteredSpecs(collapse.items)" :key="sindex">
            <h4 class="collapse-content__title">
              {{ specification.title }}
            </h4>

            <div class="collapse-content__columns" >
              <div v-for="(announcement, aIndex) in announcements" :key="announcement.id_unique" class="collapse-content__column" >
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
import NotFound from '~/components/elements/NotFound';

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
          title: 'Elan',
          defaultCollapsed: true,
          items: [
            {
              title: 'Modifikasiya və təchizat',
              values: this.announcements.map(a => this.getModificationAndSupply(a.car_catalog)),
            },
            {
              title: 'Buraxılış ili',
              values: this.announcements.map(a => this.getYear(a.car_catalog)),
            },
            {
              title: 'Yürüş',
              values: this.announcements.map(a => this.getMileage(a.car_catalog)),
            },
            {
              title: 'Rəng',
              values: this.announcements.map(a => this.getColor(a.car_catalog)),
            },
            {
              title: 'Gömrük',
              values: this.announcements.map(a => this.getCustomsClearance(a.car_catalog)),
            },
            {
              title: 'İlk sahibi',
              values: this.announcements.map(a => this.getOwnerType(a.car_catalog)),
            },
          ]
        },
        {
          title: 'İşlənmə göstəriciləri',
          defaultCollapsed: false,
          items: [
            {
              title: 'Maksimal sürət',
              values: this.announcements.map(a => this.getMaxSpeed(a.car_catalog)),
            },
            {
              title: 'Sürətlənmə 100 km/saat,s',
              values: this.announcements.map(a => this.getAcceleration100(a.car_catalog)),
            },
            {
              title: 'Yanacaq sərfiyyatı, şəhər',
              values: this.announcements.map(a => this.getFuelConsumptionCity(a.car_catalog)),
            },
            {
              title: 'Yanacaq sərfiyyatı, magistral',
              values: this.announcements.map(a => this.getFuelConsumptionTrack(a.car_catalog)),
            },
            {
              title: 'Yanacaq sərfiyyatı, qarışıq',
              values: this.announcements.map(a => this.getFuelConsumptionMixed(a.car_catalog)),
            },
            {
              title: 'Yanacaq markası',
              values: this.announcements.map(a => this.getFuelBrand(a.car_catalog)),
            },
            {
              title: 'Ekoloji sinif',
              values: this.announcements.map(a => this.getEcoClass(a.car_catalog)),
            },
          ]
        },
        {
          title: 'Mühərrik',
          defaultCollapsed: true,
          items: [
            {
              title: 'Mühərrik növü',
              values: this.announcements.map(a => this.getEngineType(a.car_catalog)),
            },
            {
              title: 'At gücü / Maksimal at gücü',
              values: this.announcements.map(a => this.getHorsePower(a.car_catalog)),
            },
            {
              title: 'Maksimum fırlanma anı',
              values: this.announcements.map(a => this.getTorque(a.car_catalog)),
            },
          ]
        },
        {
          title: 'Ölçülər',
          defaultCollapsed: true,
          items: [
            {
              title: 'Uzunluq',
              values: this.announcements.map(a => this.getLength(a.car_catalog)),
            },
            {
              title: 'Eni',
              values: this.announcements.map(a => this.getWidth(a.car_catalog)),
            },
            {
              title: 'Hündürlük',
              values: this.announcements.map(a => this.getHeight(a.car_catalog)),
            },
            {
              title: 'Təkər bazası',
              values: this.announcements.map(a => this.getWheelBase(a.car_catalog)),
            },
            {
              title: 'Ön izin eni',
              values: this.announcements.map(a => this.getFrontWheelWidth(a.car_catalog)),
            },
            {
              title: 'Arxa izin eni',
              values: this.announcements.map(a => this.getRearWheelWidth(a.car_catalog)),
            },
          ]
        },
      ]
    },
  }
}
</script>