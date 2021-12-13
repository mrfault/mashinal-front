<template>
  <div class="steps-summary">
    <div class="row">
      <div class="col-6" v-for="(user, i) in users" :key="i">
        <div class="card-bordered">
          <div class="img">
            <img :src="user.img || `/img/user.${isDarkMode ? 'jpg' : 'svg'}`" alt="" />
          </div>
          <h4><span :class="{'empty': !user.name}">{{ user.name || '----- ---' }}</span></h4>
          <p class="text-dark-blue-3">{{ $t('letter_' + (i === 0 ? 'sender' : 'recepient')) }}</p>
        </div>
      </div>
      <div class="col-12">
        <div class="card-bordered">
          <vue-scroll>
            <div class="card-bordered_scrollview">
              <div class="vehicle-specs">
                <div class="row">
                  <div class="col col-12">
                    <ul>
                      <li v-for="(spec, key) in specs[0]" :key="key">
                        <span class="wider">{{ $t(key) }}</span>
                        <span>{{ spec }}</span>
                      </li>
                    </ul>
                    <hr v-if="currentRealStep > 2" />
                  </div>
                  <div class="col" v-for="(specs, i) in specs[1]" :key="i">
                    <ul>
                      <li v-for="(spec, key) in specs" :key="key">
                        <span class="wider">{{ $t(key) }}</span>
                        <span>{{ spec }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="col col-12" v-if="currentRealStep > 4">
                    <hr />
                    <ul>
                      <li v-for="(spec, key) in specs[2]" :key="key">
                        <span class="wider">{{ $t(key) }}</span>
                        <span>{{ spec }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    car: {}
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepReceivedData', 'stepSendData', 'currentRealStep', 'hasGeneralPower']),

    users() {
      return [
        { name: this.stepReceivedData.senderFullName }, 
        { name: this.stepReceivedData.recepientFullName }
      ];
    },
    specs() {
      let specs = [{}, {}, {}];
      specs[0].transport_mark = this.car.mark;
      specs[0].transport_registered_sign = this.car.car_number.replace(/([A-Z]{1,2})/, ' $1 ');
      if (this.currentRealStep > 1) {
        specs[0].letter_type = this.$t('letter_type_options')[this.stepSendData.letterType - 1];
        if (this.currentRealStep > 2) {
          specs[1].birth_date = this.stepSendData.birthDate;
          specs[1].gender = this.stepSendData.gender === 1 ? this.$t('male') : this.$t('female');
          specs[1].id_expiry_date = this.stepSendData.idExpiryDate;
          if (this.currentRealStep > 3) {
            specs[1].driver_license_serial_number = this.stepSendData.driverLicenseNumber;
            specs[1].driver_license_given_date = this.stepSendData.driverLicenseGivenDate;
            specs[1].driver_license_expiry_date = this.stepSendData.driverLicenseExpiryDate;
          }
          specs[1] = this.$dataRows(specs[1], this.isMobileBreakpoint);
          if (this.currentRealStep > 4) {
            specs[2].transport_registered_number = this.stepSendData.transportNumber;
            specs[2].transport_registered_given_date = this.stepSendData.transportGivenDate;
            if (this.currentRealStep > 5) {
              if (this.hasGeneralPower) {
                specs[2].recepient_id_serial_number = this.stepSendData.idSerialNumberB;
                specs[2].recepient_id_fin_code = this.stepSendData.idFinCodeB;
              } else {
                specs[2].recepient_driver_license_serial_number = this.stepSendData.driverLicenseNumberB;
              }
            }
          }
        }
      }
      return specs;
    }
  }
}
</script>