<template>
  <div class="vehicle-specs mt-4 mt-lg-0">
    <hr/>
    <div class="row">
      <div class="col" v-for="(specs, i) in mainSpecs" :key="i">
        <ul>
          <li v-for="(spec, key) in specs" :key="key">
            <span class="w-auto">{{ $t(key) }}</span>
            <span>{{ spec }}<button v-if="key ==='has_insurance'" @click="$nuxt.refresh()"
                                    class="ml-1 btn btn-new-blue">Yenilə</button>
              <button @click="openDateChangeModal = true" v-if="key ==='insurance_date'" class="ml-1 btn btn-new-blue">Dəyiş</button>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <hr class="mb-0"/>
    <div v-if="$env.DEV" class="d-flex justify-content-end mt-2 mt-lg-3">
      <letter-of-attorney-button :car="car"/>
    </div>
    <modal-popup :toggle="openDateChangeModal" @close="openDateChangeModal = false">
      <form-select
        :allow-clear="false"
        class="mb-2"
        :label="$t('company')"
        v-model="form.company"
        :options="companyOptions"
      />
      <form-select
        :allow-clear="false"
        :label="$t('date')"
        :options="[{key:0,name:'elebele'}]"
        readonly
      />
      <form-text-input
        date-type="date"
        inline
        value-type="date"
        date-format="DD.MM.YYYY"
        v-model="form.insurance_date"
        :placeholder="$t('announcement_end_date')"
        input-date
      />
    </modal-popup>
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
  data() {
    return {
      openDateChangeModal: false,
      form: {
        insurance_date: '',
        company: 0
      }
    }
  },
  methods: {
    getInsuranceText(id) {
      return ['Sigorta'][id]
    }
  },
  computed: {
    companyOptions() {
      return [
        {key: 0, name: 'Azersigorta'},
        {key: 1, name: 'Ehmedrsigorta'},
      ]
    },
    mainSpecs() {
      let getDate = (date) => date && this.$moment((date)).format('DD.MM.YYYY');

      return this.$dataRows({
        tech_id: this.car.tech_id,
        brand_model: this.car.mark,
        years: this.car.year,
        insurance: this.getInsuranceText(this.car.insurance_id || 0),
        has_insurance: this.car.insurance_id ? this.$t('have') : this.$t('dont_have'),
        insurance_date: this.car.insurance_date || '20.20.2022',
        auth_date: getDate(this.car.created_date),
        auth_end_date: getDate(this.car.end_date),
        tech_exp_date: getDate(this.car.tech_exp_date),
        has_arrest: this.car.has_arrest ? this.$t('have') : this.$t('dont_have')
      }, this.isMobileBreakpoint);
    },
  }
}
</script>
<style>
.btn-new-blue {
  background: #D0E8FF;
  color: #246EB2;
  font-size: 14px;
  font-weight: 500;
}
</style>
