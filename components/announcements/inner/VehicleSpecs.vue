<template>
  <div class="vehicle-specs card mb-2 mb-lg-3">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { AnnouncementDataMixin } from '~/mixins/announcement';

export default {
  props: {
    type: String
  },
  mixins: [AnnouncementDataMixin],
  computed: {
    ...mapGetters(['announcement', 'catalog', 'sellOptions']),

    vehicleSpecs() {
      return [
        { key: 'years', value: this.announcement.year, class: 'car-year' },
        { key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage' },
        { key: 'condition', value: this.announcement.broken && this.$t('bitie')  },
        { key: 'guaranty', value: this.announcement.in_garanty && this.$t('in_garanty') },
        { key: 'carcase', value: this.bodyType },
        { key: 'color2', value: this.color },
        { key: 'engine', value: this.engineSpecs },
        { key: 'box', value: this.box },
        { key: 'privod', value: this.gear },
        { key: 'first_owner', value: this.announcement.owner_type ? this.$t('no') : this.$t('yes')  },
        { key: 'customs', value: this.announcement.customs_clearance ? this.$t('not_cleared') : this.$t('cleared') },
        { key: 'region', value: this.region },
        { key: 'vin', value: this.announcement.show_vin && this.announcement.vin },
        { key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number },
        { key: 'exchange', value: this.announcement.exchange_possible && this.$t('is_possible') },
        { key: 'credit', value: this.announcement.credit && this.$t('is_in_credit') }
      ].filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
    },
    catalogLink() {
      return this.catalog && `/catalog/${this.catalog.brand.slug}/${this.catalog.model.slug}/${this.catalog.generation.id}/${this.catalog.car_type.id}/${this.catalog.id}`;
    }
  }
}
</script>