<template>
  <div :class="['vehicle-specs card pt-0 pt-lg-4', {'mb-lg-3': !brief}]">
    <ul>
      <li v-for="spec in announcementSpecs" :key="spec.key">
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
    <div class="mt-3 mt-lg-0" v-if="isMobileBreakpoint && announcement.status != 3">
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
      const specs = [
        { key: 'years', value: this.announcement.year, class: 'car-year'},
        { key: 'region', value: this.announcement.region?.name[this.locale] },
        { key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage', for: ['cars', 'commercial', 'moto'] },
        { key: 'condition', value: (this.announcement.broken || this.announcement.status_id || this.announcement.beaten) && this.$t('bitie')  },
        { key: 'guaranty', value: (this.announcement.in_garanty || this.announcement.guaranty) && this.$t('in_garanty') },
        { key: 'com_equip_type', value: this.commercialType, for: ['commercial'] },
        { key: 'carcase', value: this.bodyType, for: ['cars'] },
        { key: 'color2', value: this.color, for: ['cars', 'commercial', 'moto'] },
        { key: 'engine', value: this.engineSpecs },
        { key: 'the_number_of_measures', value: this.tact, for: ['moto'] },
        { key: 'cylinder_block', value: this.cylinderBlock, for: ['moto'] },
        { key: 'fuel_type', value: this.fuelType, for: ['moto'] },
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
       // { key: 'first_owner', value: (parseInt(this.announcement.owner_type || this.announcement.owners || this.announcement.owner)) ? this.$t('no') : this.$t('yes'), for: ['cars', 'commercial', 'moto'] },
        { key: 'customs', value: (this.announcement.customs_clearance || this.announcement.customed_id || this.announcement.customed ) ? this.$t('not_cleared') : this.$t('cleared'), for: ['cars', 'commercial', 'moto'] },
        { key: 'product_code', value: this.announcement.product_code, for: ['parts'] },
        { key: 'category', value: this.announcement?.category?.name[this.locale], for: ['parts'] },
        { key: 'sub_category', value: this.announcement?.sub_category?.name[this.locale], for: ['parts'] },
        { key: 'brand_name', value: this.announcement?.brand?.name, for: ['parts'] },
        { key: 'vin', value: this.announcement.show_vin && this.announcement.vin },
        { key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number },
        { key: 'exchange', value: (this.announcement.exchange_possible || this.announcement.tradeable) && this.$t('is_possible') },
        { key: 'credit', value: this.announcement.credit && this.$t('is_in_credit') },
        { key: 'condition', value: this.condition, for: ['parts'] },
        { key: 'is_original', value: this.announcement.is_original ? this.$t('yes') : this.$t('no'), for: ['parts'] },
        { key: 'have_delivery', value: this.announcement.have_delivery ? this.$t('yes') : this.$t('no'), for: ['parts'] },
        { key: 'have_warranty', value: this.announcement.have_warranty ? this.$t('yes') : this.$t('no'), for: ['parts'] }
      ];

      let mergedKeys = [
        'shine_width','diameter','height'
      ];
      let mergedValues = {};
      // Dynamic specs
      if (this.type === 'parts') {
        Object.keys(this.announcement.filters).forEach(filter => {
          let value = this.announcement.filters[filter]

          if (value) {
            if (typeof value === 'boolean') {
              value = value ? this.$t('yes') : this.$t('yes');
            } else if (typeof value === 'object') {
              value = this.$t(value.name)
            }

            if(mergedKeys.includes(filter)) {
              mergedValues[filter] = value;
            }else {
              specs.push({
                key: filter.replace('capacity', 'battery_capacity'),
                value,
                for: ['parts'] }
              )
            }

          }
        })
        specs.push({
          key: 'size',
          value: mergedValues['shine_width'] +'/'+ mergedValues['height']+'R'+ mergedValues['diameter'],
          for: ['parts']
        })
      }

      let filteredSpecs = specs.filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
      return this.brief ? filteredSpecs.slice(0,5) : filteredSpecs;
    },
    catalogLink() {
      let path = this.catalog && `/catalog/${this.catalog.brand.slug}/${this.catalog.model.slug}/${this.catalog.generation.id}/${this.catalog.car_type.id}/mod/${this.catalog.id}`;
      return path && this.$localePath(path);
    }
  }
}
</script>
