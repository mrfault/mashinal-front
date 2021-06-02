<template>
  <component :is="view === 'screen' ? 'mobile-screen' : 'div'" @back="goBack" :title="$t('promoting')" >
    <loader v-if="!promotion.id" />
    <div :class="['promote-announcement', `is-${view}`]" v-else>
      <template v-if="view !== 'card'">
        <div class="announcement-details d-flex flex-lg-column mb-lg-1">
          <img :src="getAnnouncementImage(this.announcement)" :alt="getAnnouncementTitle(announcement)" />
          <div class="d-flex flex-column flex-lg-row justify-content-lg-between mt-lg-3">
            <h4>{{ getAnnouncementTitle(announcement) }}</h4>
            <div class="price">
              <span>{{ announcement.price }}</span>
              <span><icon name="exchange" /> {{ announcement.price_converted }}</span>
            </div>
          </div>
          <div class="promotion-details" v-if="view === 'screen'">
            <span><icon :name="getServiceIcon(selectedServiceInfo.type)" /> {{ selectedServiceInfo.name }}</span>
            <strong>{{ selectedServiceOption ? selectedServiceOption.user_price : 0 }} ₼</strong>
          </div>
        </div>
        <hr />
      </template>
      <form-buttons :btn-class="view === 'card' ? 'white-outline' : 'pale-red-outline'" :options="serviceBtns" :group-by="view === 'screen' ? 1 : 3" :value="promotion.id" 
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
      <hr class="dashed mt-0 mt-lg-3"/>
      <h4 v-if="view === 'card'" class="mb-lg-2">
        <icon :name="getServiceIcon(selectedServiceInfo.type)" /> {{ selectedServiceInfo.name }}
      </h4>
      <h4 v-else >{{ $t('my_packages') }}</h4>
      <template v-if="view !== 'card' && alreadyActive">
        <p class="info-text"><icon name="alert-circle" /> 
          <span v-if="selectedService.type == 4" v-html="$t('info_service_once_in_5_mins', { 
            service: selectedService.name 
          })"></span>
          <span v-else v-html="$t('info_service_is_already_active', { 
            service: selectedService.name, 
            date: announcement.type.info[selectedService.type] 
          })"></span>
        </p>
      </template>
      <form-buttons :btn-class="view === 'card' ? 'white-outline' : 'pale-red-outline'" :options="activeBtns" :group-by="view === 'screen' ? 1 : 3" :value="promotion.optionId" 
        @input="updatePromotion({key: 'optionId', value: $event}), selectServiceOption()" />
      <p :class="['mt-lg-3', {'mb-lg-0': view === 'card'}]" v-if="selectedServiceInfo.description">{{ selectedServiceInfo.description }}</p>
      <template v-if="view !== 'card'">
        <h4>{{ $t('payment_method') }}</h4>
        <div class="pb-lg-3">
          <form-buttons :options="payments" :group-by="view === 'screen' ? 1 : 3" :value="promotion.paymentId" 
            @input="updatePromotion({key: 'paymentId', value: $event})" />
        </div>
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
      pending: false,
      pendingSelect: false,
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
          name: this.getReplacedName(service.name),
          icon: this.getServiceIcon(service.type),
          disabled: service.type == 4 ? this.isAlreadyActive(service.type) : false
        }));
    },
    activeBtns() {
      if(!this.promotion.id || this.pendingSelect) return [];
      return (this.myServiceOptions.length && this.shouldActivate)  
        ? this.myServiceOptions
            .map(option => ({
              id: option.id,
              name: `${this.getServiceLabel(option.active, option.active_label, this.view === 'card')} / x${option.count}`
            }))
        : this.services
            .find(service => service.id == this.promotion.id).actives
            .map(option => ({
              ...option,
              id: option.id,
              name: `${this.getServiceLabel(option.daysOrCount, option.days, this.view === 'card')} / ${option.user_price} ₼`
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
    disabled() {
      return !this.promotion.optionId || (this.alreadyActive && this.selectedService.type == 4) || this.pending;
    }
  },
  methods: {
    ...mapActions(['getServices', 'getMyServices', 'getMyServiceOptions', 'updatePromotion', 'updateMobileStatus']), 

    async getServiceData() {
      await this.getServices();
      if(this.loggedIn && this.user.autosalon) 
        await this.getMyServices();
    },
    async selectService() {
      this.updatePromotion({ key: 'type', value: this.selectedService.type });
      this.active = true;
      this.hideStatus = false;
      if (this.loggedIn) {
        this.updatePromotion({ key: 'optionId', value: ''});
        this.pendingSelect = true;
        try {
          await this.getMyServiceOptions(this.selectedService.type);
          this.pendingSelect = false;
          if(this.activeBtns.length && this.view !== 'card')
            this.updatePromotion({ key: 'optionId', value: this.activeBtns[0].id});
        } catch(err) {
          this.pendingSelect = false;
        }
      } else if(this.activeBtns.length) {
        this.updatePromotion({ key: 'optionId', value: this.view === 'card' ? '' : this.activeBtns[0].id});
      }
    },
    selectServiceOption() {
      if(this.view === 'card') {
        this.$emit('select-service-option', this.promotion.optionId);
      }
    },
    async purchaseService() {
      this.pending = true;
      try {
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
        this.pending = false;
      }
    },
    async activateService() {
      this.pending = true;
      try {
        // activate service
        await this.$axios.$post('/my/service/use', {
          id_unique: this.announcement.id,
          serviceId: this.promotion.optionId
        });
        // reload services and announcement data
        await this.getServiceData();
        // reset some data
        this.updatePromotion({ key: 'optionId', value: ''});
        this.pending = false;
        this.goBack();
        this.updateMobileStatus({
          type: 'success',
          text: this.$t('success_activate_msg'),
          title: this.$t('success_activate')
        });
      } catch(err) {
        this.pending = false;
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
      this.updatePromotion({ key: 'type', value: '' });
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
    if (this.view === 'popup') return;
    this.updatePromotion({ key: 'id', value: this.serviceBtns.find(service => service.type == this.promotionType).id});
    await this.selectService();
  },
  beforeDestroy() {
    if(this.view === 'popup') {
      this.updatePromotion({ key: 'optionId', value: '' });
    }
  }
}
</script>