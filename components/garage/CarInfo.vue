<template>
  <div class="vehicle-specs">
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
  </div>
</template>

<script>
export default {
  props: {
    car: {}
  },
  computed: {
    mainSpecs() {
      let firstCol = {
        tech_id: this.car.tech_id,
        brand_model: this.car.mark,
        years: this.car.year
      };
      let secondCol = {
        auth_date: this.$moment(this.car.created_date).format('DD.MM.YYYY'),
        tech_exp_date: this.$moment(this.car.tech_exp_date).format('DD.MM.YYYY'),
        has_arrest: this.car.has_arrest ? this.$t('have') : this.$t('dont_have')
      };
      return this.isMobileBreakpoint 
        ? [{...firstCol, ...secondCol}]
        : [firstCol, secondCol];
    },
  }
}
</script>