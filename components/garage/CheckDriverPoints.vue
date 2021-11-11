<template>
  <div class="driver-points-check">
    <div class="card with-margins" v-show="!isMobileBreakpoint || !protocolsChecked">
      <div class="info-text full-width mb-3"><icon name="alert-circle" /> 
        <span>{{ $t('fill_form_to_check_driver_points') }}</span>
      </div>
      <form class="form" @submit.prevent="submit" novalidate>
        <div class="row">
          <div class="col-lg-3 mb-2 mb-lg-0">
            <form-text-input 
              v-model="form.series" 
              :mask="$maskAlphaNumeric('*{+}', ' ')" 
              :placeholder="$t('serial_number')" 
              :invalid="$v.form.series.$error"
            />
          </div>
          <div class="col-lg-3 mb-2 mb-lg-0">
            <form-text-input input-date
              v-model="form.birth" 
              :placeholder="$t('date_birth')" 
              :invalid="$v.form.birth.$error"
            />
          </div>
          <div class="col-lg-3 mb-2 mb-lg-0">
            <form-text-input input-date 
              v-model="form.expire" 
              :placeholder="$t('date_till')" 
              :invalid="$v.form.expire.$error"
            />
          </div>
          <div class="col-lg-3">
            <button type="submit" :class="['btn btn--green full-width', { pending }]">
              {{ $t('check') }}
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="garage_go-back card with-margins mb-2 mb-lg-0" v-show="isMobileBreakpoint && protocolsChecked">
      <div class="d-flex align-items-center justify-content-between">
        <icon name="chevron-left" @click.native.stop="showForm" class="cursor-pointer" />
        <span>{{ form.series }}</span>
      </div>
    </div>
    <div class="card with-margins mt-2 mt-lg-3" v-show="!isMobileBreakpoint || protocolsChecked" v-if="driverLicensePoints.point_protocols">
      <div class="d-flex flex-column flex-lg-row justify-content-between">
        <div class="garage_check-points-nav">
          <div class="row">
            <div class="col-6 col-lg-auto" v-for="tabKey in ['point_protocols','unpaid_protocols']" :key="tabKey">
              <button 
                :class="['btn btn--pale-red-outline', {'active': tab === tabKey, 'full-width': isMobileBreakpoint}]" 
                @click="tab = tabKey"
                v-html="$t(tabKey)"
              />
            </div>
          </div>
        </div>
        <h3 class="garage_check-points-text mb-0 mt-3 mt-lg-0">{{ $t('your_points') }}: {{ driverLicensePoints.point || 0 }}</h3>
      </div>
      <protocols-list :protocols="driverLicensePoints[tab]" :tab="tab" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { required } from 'vuelidate/lib/validators';

import ProtocolsList from '~/components/garage/ProtocolsList';

export default {
  components: {
    ProtocolsList
  },
  data() {
    return {
      form: {
        series: '',
        expire: '',
        birth: ''
      },
      pending: false,
      tab: 'point_protocols',
      protocolsChecked: false
    }
  },
  validations: {
    form: {
      series: { required },
      expire: { required },
      birth: { required }
    }
  },
  computed: {
    ...mapGetters({
      driverLicensePoints: 'garage/driverLicensePoints'
    })
  },
  methods: {
    ...mapActions({
      checkDriverPoints: 'garage/checkDriverPoints'
    }),

    async submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$pending || this.$v.$error) return;
      this.pending = true;
      try {
        const res = await this.checkDriverPoints(this.form);
        if (res.status === 'success') {
          this.$v.$reset();
          this.form.series = '';
          this.form.expire = '';
          this.form.birth = '';
          this.protocolsChecked = true;
          this.$emit('show-nav', false);
        }
        this.pending = false;
      } catch(error) {
        this.pending = false;
      }
    },
    showForm() {
      this.protocolsChecked = false;
      this.$emit('show-nav', true);
    }
  }
}
</script>