<template>
  <component :is="view === 'screen' ? 'portal' : 'div'" to="mobile-screen">
    <action-bar v-if="view === 'screen'" :title="$t('promoting')" @back="goBack" />
    <div :class="{'mobile-screen': view === 'screen'}">
      <div :class="{'container': view === 'screen'}">
        <div class="promote-announcement" v-show="promotion.id">
          <form-buttons :options="serviceBtns" :group-by="view === 'screen' ? 1 : 3" :value="promotion.id" 
            @input="updatePromotion({key: 'id', value: $event}), selectService()">
              <template #icon="{ button }">
                <icon :name="button.icon" />
              </template>
              <template #badge="{ button }" v-if="shouldActivate">
                <span class="badge circle" v-if="button.count">
                  <span>{{ button.count }}</span>
                </span>
              </template>
          </form-buttons>
          <hr class="dashed"/>
          <h4><icon :name="getServiceIcon(selectedServiceInfo.type)" /> {{ selectedServiceInfo.name }}</h4>
          <form-buttons :options="activeBtns" :group-by="view === 'screen' ? 1 : 3" :value="promotion.optionId" 
            @input="updatePromotion({key: 'optionId', value: $event})" />
          <p v-if="selectedServiceInfo.description">{{ selectedServiceInfo.description }}</p>
          <template v-if="view !== 'card'">
            <h4>{{ $t('payment_method') }}</h4>
            <form-buttons :options="payments" :group-by="view === 'screen' ? 1 : 3" :value="promotion.paymentId" 
              @input="updatePromotion({key: 'paymentId', value: $event})" />
            <div class="promote-payment-info">
              <hr />
              <div class="d-flex justify-content-between align-items-center">
                <span class="price">
                  <span>{{ $t('total')}}</span>
                  <strong>{{ selectedServiceOption ? selectedServiceOption.user_price : 0 }} ₼</strong>
                </span>
                <button class="btn btn--green" @click="activateOrPay"
                  :class="{disabled}">{{ $t(shouldPay ? 'pay' : 'activate') }}</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { ServicesMixin } from '~/mixins/services';

export default {
  props: {
    view: String,
    announcement: {},
    promotionType: {}
  },
  mixins: [ServicesMixin],
  data() {
    return {
      hideStatus: true,
      inProgress: false,
      selectInProgress: false,
      activated: false,
      active: false
    }
  },
  computed: {
    ...mapState(['services', 'myServices', 'myServiceOptions', 'promotion']),

    selectedService() {
      if(!this.promotion.id) return false;
      return (this.myServices.length ? this.myServices : this.services)
        .find(service => service.id == this.promotion.id);
    },
    selectedServiceOption() {
      if(!this.promotion.optionId) return false;
      return (this.activeBtns)
        .find(option => option.id == this.promotion.optionId);
    },
    selectedServiceInfo() {
      if(!this.selectedService) return false;
      return this.services.find(service => service.type == this.selectedService.type);
    },
    serviceBtns() {
      return (this.myServices.length ? this.myServices : this.services)
        .map(service => ({
          ...service,
          icon: this.getServiceIcon(service.type),
          disabled: service.type == 4 ? this.isAlreadyActive(service.type) : false
        }));
    },
    activeBtns() {
      if(!this.promotion.id || this.selectInProgress) return [];
      return (this.myServiceOptions.length && this.shouldActivate)  
        ? this.myServiceOptions
            .map(option => ({
              id: option.id,
              name: `${this.getServiceLabel(option.active, option.active_label)} / x${option.count}`
            }))
        : this.services
            .find(service => service.id == this.promotion.id).actives
            .map(option => ({
              ...option,
              id: option.id,
              name: `${this.getServiceLabel(option.daysOrCount, option.days)} / ${option.user_price} ₼`
            }));
    },
    payments() {
      return [
        { key: 1, name: this.$t('pay_with_card') }
      ]
    },
    showSuccessOrError() {
      return ['true','false'].includes(this.$route.query.success);
    },
    showStatus() {
      return !this.hideStatus && this.showSuccessOrError;
    },
    alreadyActive() {
      return this.selectedService ? this.isAlreadyActive(this.selectedService.type) : false;
    },
    shouldActivate() {
      // activate if own announcement
      return this.loggedIn && this.user.autosalon && this.announcement.user.autosalon
        ? (this.user.autosalon.id == this.announcement.user.autosalon.id)
        : (this.loggedIn ? (this.user.id == this.announcement.user.id) : false);
    },
    shouldPay() {
      // pay if not own announcement or not enough service options left
      return !this.shouldActivate || (this.myServiceOptions.length <= 0);
    },
    status() {
      let title, message, type;
      type = 'success';
      if(this.activated) {
        title = this.$t('success_activate');
        message = this.$t('success_activate_msg');
      } else if (this.$route.query.success === 'true') {
        title = this.$t('success_payment');
        message = this.$t('success_payment_msg');
      } else {
        type = 'error';
        if (this.$route.query.success === 'false') {
          title = this.$t('error_payment');
          message = this.$t('error_payment_msg');
        } else if (this.alreadyActive && this.selectedService.type == 4) {
          type = 'info';
          message = this.$t('info_service_once_in_5_mins', { service: this.selectedService.name });
        }
      }
      return message ? { title, message, type } : false;
    },
    disabled() {
      return !this.promotion.optionId || (this.alreadyActive && this.selectedService.type == 4) || this.inProgress;
    }
  },
  methods: {
    ...mapActions(['getServices', 'getMyServices', 'getMyServiceOptions', 'updatePromotion']), 

    async getServiceData() {
      await this.getServices();
      if(this.loggedIn && this.user.autosalon) 
        await this.getMyServices();
    },
    async selectService() {
      this.active = true;
      this.hideStatus = false;
      if (this.loggedIn) {
        this.activated = false;
        this.updatePromotion({ key: 'optionId', value: ''});
        this.selectInProgress = true;
        try {
          await this.getMyServiceOptions(this.selectedService.type);
          this.selectInProgress = false;
          if(this.activeBtns.length)
            this.updatePromotion({ key: 'optionId', value: this.activeBtns[0].id});
        } catch(err) {
          this.selectInProgress = false;
        }
      } else if(this.activeBtns.length) {
        this.updatePromotion({ key: 'optionId', value: this.activeBtns[0].id});
      }
    },
    selectOption() {
    },
    selectPayment() {
    },
    async purchaseService() {
      try {
        this.inProgress = true;
        // buy service (api returns payment_id and redirect_url)
        const res = await this.$axios.$post('/marketing/buyService', {
          service_active_id: this.promotion.optionId,
          announce_id_unique: this.announcement.id_unique
        });
        // redirect to kapital bank page
        this.$nuxt.$loading.start();
        setTimeout(() => this.$nuxt.$loading.finish(), 500);
        window.location = res.data.redirect_url;
      } catch(err) {
        this.inProgress = false;
      }
    },
    async activateService() {
      try {
        this.inProgress = true;
        // activate service
        await this.$axios.$post('/my/service/use', {
          id_unique: this.announcement.id,
          serviceId: this.promotion.optionId
        });
        // reload services and announcement data
        await this.getServiceData();
        // reset some data
        this.updatePromotion({ key: 'optionId', value: ''});
        this.activated = true;
        this.inProgress = false;
      } catch(err) {
        this.inProgress = false;
      }
    },
    async activateOrPay() {
      if (this.disabled) return;
      if (this.shouldPay) {
        await this.purchaseService();
      } else if (this.shouldActivate) {
        await this.activateService();
      }
    },
    goBack() {
      this.updatePromotion({ key: 'optionId', value: ''});
      this.updatePromotion({ key: 'id', value: ''});
      this.active = false;
      window.scrollTo(0,0);
      this.activated = false;
      this.hideStatus = true;
      this.active = false;
      this.$router.push({ query: null });
      this.$emit('close');
    },
    isAlreadyActive(type) {
      return !!(Object.keys(this.announcement.type).find(key => type == key))
    }
  },
  async fetch() {
    if(this.showSuccessOrError) 
      this.hideStatus = false;
    await this.getServiceData();
    this.updatePromotion({ key: 'id', value: this.serviceBtns.find(service => service.type == this.promotionType).id});
    await this.selectService();
  }
}
</script>