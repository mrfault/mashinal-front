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
              <button @click="openDateChangeModal = true" v-if="key ==='insurance_end_date'" class="ml-1 btn btn-new-blue">{{ $t('change_it') }}</button>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <hr class="mb-0"/>
    <div v-if="$env.DEV" class="d-flex justify-content-end mt-2 mt-lg-3">
      <letter-of-attorney-button :car="car"/>
    </div>
    <modal-popup
      :toggle="openDateChangeModal"
      :title="$t('insurance_end_date')"
      @close="openDateChangeModal = false"
    >
      <form-select
        :allow-clear="false"
        class="mb-2"
        :clear-option="false"
        :label="$t('insurance_company')"
        v-model="form.company"
        :options="companies"
      />
      <span>{{ $t('date') }}</span>
      <form-text-input
        date-type="date"
        inline
        value-type="date"
        date-format="DD.MM.YYYY"
        v-model="form.insurance_date"
        :placeholder="$t('announcement_end_date')"
        input-date
      />
      <button @click="confirmInsurance" :class="{ pending }" class="btn btn--green mt-2 w-100">{{
          $t('confirm')
        }}
      </button>
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
      pending: false,
      form: {
        insurance_date: this.$moment(this.car.insurance_end_date).format('DD.MM.YYYY'),
        company: this.car.insurance_company_id
      },
      companies: [
        {key: 1, name:'Azsığorta'},
        {key: 2, name:'Ata Sığorta'},
        {key: 3, name:'Atəşgah Sığorta'},
        {key: 4, name:'A-qroup sığorta'},
        {key: 5, name:'AzRe Təkrarsığorta'},
        {key: 6, name:'Azərbaycan Sənaye Sığorta'},
        {key: 7, name:'Azərbaycan Dövlət Sığorta'},
        {key: 8, name:'Bakı Sığorta'},
        {key: 9, name:'Günay Sığorta'},
        {key: 10, name:'Xalq Sığorta'},
        {key: 11, name:'İpək Yolu Sığorta'},
        {key: 12, name:'Qala Sığorta'},
        {key: 13, name:'Meqa Sığorta'},
        {key: 14, name:'Naxçıvan sığorta'},
        {key: 15, name:'Paşa Sığorta'},
      ]
    }
  },
  methods: {
    async confirmInsurance() {
      this.pending = true;
      try {
        await this.$axios.$post('/garage/insurance/set-enddate', {
          car_id: this.car.id,
          end_date: this.form.insurance_date,
          insurance_company_id: this.form.company
        })
        this.$nuxt.refresh();
        this.openDateChangeModal = false;
      }catch (e){}
      this.pending = false;
    },
    getInsuranceText(id) {
      return this.companies.find(item => item.key == id)?.name
    }
  },
  computed: {
    mainSpecs() {
      let getDate = (date) => date && this.$moment((date)).format('DD.MM.YYYY');

      return this.$dataRows({
        tech_id: this.car.tech_id,
        brand_model: this.car.mark,
        years: this.car.year,
        insurance_company: this.getInsuranceText(this.car.insurance_company_id),
       // has_insurance: this.car.insurance_id ? this.$t('have') : this.$t('dont_have'),
        insurance_end_date: this.car.insurance_end_date ? this.$moment(this.car.insurance_end_date).format('DD.MM.YYYY') : '00.00.0000',
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
