<template>
  <div class="salon-filters-form form">
    <div :class="`card mt-2 mt-lg-${short ? '0' : '3'}`">
      <div class="row mb-n2 mb-lg-n3">
        <div :class="[`col-12 ${short ? '' : 'col-lg-1-5'} mb-2 mb-lg-3`, {'order-lg-3': short}]">
          <form-text-input 
            v-model="search" 
            icon-name="search" 
            block-class="placeholder-lighter"
            :placeholder="$t('salon_name')"
            @change="filterAutosalons" 
          />
        </div>
        <div :class="[`col-12 ${short ? '' : 'col-lg-2-5'} mb-2 mb-lg-3`, {'order-lg-4': short}]">
          <div class="row no-gutters checkbox-row bg-greyish-blue-2 round-4">
            <div class="col-auto">
              <form-checkbox :label="$t('cars')" v-model="haveCar" input-name="haveCar" 
                @change="filterAutosalons" />
            </div>
            <div class="col-auto">
              <form-checkbox :label="$t('moto')" v-model="haveMoto" input-name="haveMoto" 
                @change="filterAutosalons" />
            </div>
            <div class="col-auto">
              <form-checkbox :label="$t('commercial')" v-model="haveCommercial" input-name="haveCommercial" 
                @change="filterAutosalons" />
            </div>
          </div>
        </div>
        <div :class="[`col-6 ${short ? '' : 'col-lg-1-5'} mb-2 mb-lg-3`, {'order-lg-2': short}]">
          <form-checkbox :label="$t('only_official')" v-model="officialOnly" input-name="officialOnly" 
            @change="filterAutosalons" />
        </div>
        <div :class="[`col-6 ${short ? '' : 'col-lg-1-5'} mb-2 mb-lg-3`, {'order-lg-1': short}]">
          <div class="form-info text-green">
            {{ $readPlural(salonsFiltered.length, $t('plural_forms_salons')) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    short: Boolean
  },
  data() {
    return {
      pending: false,
      search: '',
      officialOnly: false,
      haveCar: false,
      haveMoto: false,
      haveCommercial: false
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered', 'salonsList']),
  },
  methods: {
    ...mapActions(['updateSalonsFiltered']),

    async filterAutosalons() {
      let list = this.salonsList.filter((salon) => {
        let matches = true;
        if (this.search) matches &= this.$search(salon.name, this.search);
        if (this.officialOnly) matches &= salon.is_official;
        if (this.haveCar) matches &= salon.have_car;
        if (this.haveMoto) matches &= salon.have_moto;
        if (this.haveCommercial) matches &= salon.have_commercial;
        return matches;
      });
      this.updateSalonsFiltered(list);
      this.$nuxt.$emit('filter-salons');
    }
  },
  created() {
    this.$nuxt.$on('search-salons', this.filterAutosalons);
  },
  beforeDestroy() {
    this.$nuxt.$off('search-salons', this.filterAutosalons);
  }
}
</script>