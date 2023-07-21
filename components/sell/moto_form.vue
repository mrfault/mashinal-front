<template>
   <div class="moto_form">
      <form-select
         :label="$t('type_of_motos')"
         :options="motoOptionsV2"
         :clear-placeholder="true"
         :clear-option="false"
         :new-label="false"
         :object-in-value="true"
         has-search
         v-model="form.type_of_moto"
      />
<!--         @change="onChangeBrand($event)"-->
<!--      <form-select-->
<!--         :label="$t('brand_name')"-->
<!--         :options="this.brands"-->
<!--         :clear-placeholder="true"-->
<!--         :clear-option="false"-->
<!--         :new-label="false"-->
<!--         :object-in-value="true"-->
<!--         has-search-->
<!--         v-model="form.brand"-->
<!--      />-->
<!--         @change="onChangeBrand($event)"-->
<!--      <form-select-->
<!--         v-if="models.length"-->
<!--         :label="$t('model_name')"-->
<!--         :options="models"-->
<!--         :clear-placeholder="true"-->
<!--         :clear-option="false"-->
<!--         :new-label="false"-->
<!--         :object-in-value="true"-->
<!--         v-model="form.model"-->
<!--      />-->
<!--         @change="onChangeModel()"-->
<!--      <form-select-->
<!--         v-if="sellYears.years"-->
<!--         :label="$t('prod_year')"-->
<!--         :options="sellYears?.years?.map((year) => ({name: year}))"-->
<!--         :clear-placeholder="true"-->
<!--         :clear-option="false"-->
<!--         :new-label="false"-->
<!--         v-model="form.year"-->
<!--      />-->
<!--         @change="onChangeYear()"-->
   </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
   computed: {
      ...mapGetters(['motoOptionsV2', 'sellYears']),
   },
 data() {
    return {
form: {
   type_of_moto: "",
   brands: "",
   model: "",
   year: ""
}
    }
 }
}
</script>

<style lang="scss" scoped>

</style>
