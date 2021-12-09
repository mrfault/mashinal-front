<template>
  <div class="vehicle-specs mt-4 mt-lg-0">
    <hr />
    <div class="row">
      <div class="col" v-for="(specs, i) in mainSpecs" :key="i">
        <ul>
          <li v-for="(spec, key) in specs" :key="key">
            <span class="w-auto">{{ $t(key) }}</span>
            <span>{{ spec }}</span>
          </li>
        </ul>
      </div>
    </div>
    <hr class="mb-0"/>
    <div class="d-flex justify-content-end mt-2 mt-lg-3">
      <letter-of-attorney-button :car="car" />
    </div>
  </div>
</template>

<script>
import LetterOfAttorneyButton from '~/components/garage/loa/LetterOfAttorneyButton';

export default {
  props: {
    car: {}
  },
  components: { 
    LetterOfAttorneyButton
  },
  computed: {
    mainSpecs() {
      let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

      return this.$dataRows({
        tech_id: this.car.tech_id,
        brand_model: this.car.mark,
        years: this.car.year,
        auth_date: getDate(this.car.created_date),
        auth_end_date: getDate(this.car.end_date),
        tech_exp_date: getDate(this.car.tech_exp_date),
        has_arrest: this.car.has_arrest ? this.$t('have') : this.$t('dont_have')
      }, this.isMobileBreakpoint);
    },
  }
}
</script>