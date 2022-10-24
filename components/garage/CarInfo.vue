<template>
  <div class="vehicle-specs mt-4 mt-lg-0">
    <hr/>
    <div class="row">
      <div class="col" v-for="(specs, i) in mainSpecs" :key="i">
        <ul>
          <li v-for="(spec, key) in specs" :key="key">
            <span v-html="$t(key)" class="w-auto"></span>
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
      modal-class="car-info-modal"
      :overflow-hidden="false"
      :toggle="openDateChangeModal"
      :title="$t('insurance_end_date_text')"
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
      <div class="d-flex">
        <form-select
          class="mr-1"
          :allow-clear="false"
          :clear-option="false"
          :label="$t('year_first_letter')"
          :options="years"
          v-model="form.year"
        />
        <form-select
          class="mr-1"
          :clear-option="false"
          :allow-clear="false"
          :label="capitalizeFirstLetter($t('plural_forms_month')[0])"
          :options="months"
          v-model="form.month"
        />
        <form-select
          :clear-option="false"
          :allow-clear="false"
          :label="$t('day')"
          :options="days"
          v-model="form.day"
        />
      </div>

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
        day: Number(this.$moment(this.car.insurance_end_date).format('DD')),
        month: "",
        year: Number(this.$moment(this.car.insurance_end_date).format('YYYY')),
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
  mounted() {
    this.form.month = this.months.find(item =>
      item.name === this.capitalizeFirstLetter(
        this.$moment(this.car.insurance_end_date).format('MMMM')
      )).key
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async confirmInsurance() {
      this.pending = true;
      try {
        await this.$axios.$post('/garage/insurance/set-enddate', {
          car_id: this.car.id,
          end_date: `${this.form.year}-${this.form.month}-${this.form.day}`,
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
    days() {
      let days = Array.from({length: 31}, (v, i) => 31 - i).reverse();
      return days.map((item) => {
        return {
          name: item,
          key: item
        }
      });
    },
    months() {
      this.$moment.locale(this.locale)
      return this.$moment.months().map((item,code) => {
        return {
          name: this.capitalizeFirstLetter(item),
          key: code+1
        }
      });
    },
    years() {
      const years = (back) => {
        const year = new Date().getFullYear();
        return Array.from({length: back}, (v, i) => year - back + i + 1).reverse();
      }
      return years(50).map(item => {
        return {
          name: item,
          key: item
        }
      })
    },
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
.car-info-modal {
  width: 450px;
}
.btn-new-blue {
  background: #D0E8FF;
  color: #246EB2;
  font-size: 14px;
  font-weight: 500;
}
</style>
