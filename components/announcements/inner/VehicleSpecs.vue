<template>
  <div class="vehicle-specs card pt-0 pt-lg-4 mb-lg-3">
    <ul>
      <li v-for="spec in vehicleSpecs" :key="spec.key">
        <span>
          <icon name="barter" v-if="spec.key === 'exchange'" />
          <icon name="percent" v-else-if="spec.key === 'credit'" />
          {{ $t(spec.key) }}
        </span>
        <span>
          {{ spec.value }}
        </span>
      </li>
    </ul>
    <div class="mt-2 mt-lg-3" v-if="catalog">
      <nuxt-link :to="catalogLink" :class="['btn full-width', isDarkMode ? 'btn--pale-red' : 'btn--pale-green' ]">
        {{ $t('catalog_model_specifications') }}
      </nuxt-link>
    </div>
    <div class="mt-3 mt-lg-0" v-if="isMobileBreakpoint">
      <floating-cta :announcement="announcement" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { AnnouncementDataMixin } from '~/mixins/announcement';

import FloatingCta from '~/components/announcements/inner/FloatingCta';

export default {
  props: {
    type: String
  },
  components: {
    FloatingCta
  },
  mixins: [AnnouncementDataMixin],
  computed: {
    ...mapGetters(['announcement', 'catalog', 'sellOptions', 'motoOptions']),
    
    vehicleSpecs() {
      return [
        { key: 'years', value: this.announcement.year, class: 'car-year' },
        { key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage' },
        { key: 'condition', value: (this.announcement.broken || this.announcement.status_id || this.announcement.beaten) && this.$t('bitie')  },
        { key: 'guaranty', value: (this.announcement.in_garanty || this.announcement.guaranty) && this.$t('in_garanty') },
        { key: 'com_equip_type', value: this.commercialType, for: ['commercial'] },
        { key: 'carcase', value: this.bodyType, for: ['cars'] },
        { key: 'color2', value: this.color },
        { key: 'engine', value: this.engineSpecs },
        { key: 'the_number_of_measures', value: this.tact, for: ['moto'] },
        { key: 'cylinder_block', value: this.cylinderBlock, for: ['moto'] },
        { key: 'cylinder_location', value: this.cylinderPlacement, for: ['moto'] },
        { key: 'box', value: this.box },
        { key: 'privod', value: this.gear },
        { key: 'type_of_brakes', value: this.brakeType, for: ['commercial'] },
        { key: 'wheel_formula', value: this.wheelFormula, for: ['commercial'] },
        { key: 'loading', value: this.loadingKg, for: ['commercial'] },
        { key: 'number_of_axles', value: this.numberOfAxes, for: ['commercial'] },
        { key: 'working_hours', value: this.announcement.moto_hours, for: ['commercial'] },
        { key: 'com_truck_cabin', value: this.announcement.cabin_type?.name?.[this.locale], for: ['commercial'] },
        { key: 'seat_count', value: this.announcement.seats, for: ['commercial'] },
        { key: 'exhaust_class', value: this.exhaustClass, for: ['commercial'] },
        { key: 'cab_suspension', value: this.cabinSuspension, for: ['commercial'] },
        { key: 'chassis_suspension', value: this.chassisSuspension, for: ['commercial'] },
        { key: 'first_owner', value: (this.announcement.owner_type || this.announcement.owners) ? this.$t('no') : this.$t('yes')  },
        { key: 'customs', value: (this.announcement.customs_clearance || this.announcement.customed_id || this.announcement.customed ) ? this.$t('not_cleared') : this.$t('cleared') },
        { key: 'region', value: this.region },
        { key: 'vin', value: this.announcement.show_vin && this.announcement.vin },
        { key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number },
        { key: 'exchange', value: (this.announcement.exchange_possible || this.announcement.tradeable) && this.$t('is_possible') },
        { key: 'credit', value: this.announcement.credit && this.$t('is_in_credit') }
      ].filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
    },
    catalogLink() {
      let path = this.catalog && `/catalog/${this.catalog.brand.slug}/${this.catalog.model.slug}/${this.catalog.generation.id}/${this.catalog.car_type.id}/mod/${this.catalog.id}`;
      return path && this.$localePath(path);
    }
  }
}
</script>