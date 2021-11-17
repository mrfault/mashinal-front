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
  </div>
</template>

<script>
export default {
  props: {
    car: {}
  },
  computed: {
    mainSpecs() {
      let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

      let data = {
        tech_id: this.car.tech_id,
        brand_model: this.car.mark,
        years: this.car.year,
        auth_date: getDate(this.car.created_date),
        tech_exp_date: getDate(this.car.tech_exp_date),
        has_arrest: this.car.has_arrest ? this.$t('have') : this.$t('dont_have')
      };

      let dataKeys = Object.keys(data).filter(k => ![null,undefined].includes(data[k]));
      let middleIndex = Math.ceil(dataKeys.length / 2);
      let dataCols = this.$chunk(dataKeys, middleIndex); 

      let getData = (keys) => keys.reduce((a, b) => ({...a, [b]: data[b]}), {});

      return this.isMobileBreakpoint ? [getData(dataKeys)] : [getData(dataCols[0]), getData(dataCols[1])];
    },
  }
}
</script>