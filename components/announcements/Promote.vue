<template>
  <component :is="isScreen ? 'mobile-screen' : 'div'" @back="goBack" :bar-title="$t('promoting')" >
    <loader v-if="!promotion.id" />
    <div :class="['promote-announcement', `is-${view}`]" v-else>
      <template v-if="view !== 'card'">
        <div class="announcement-details d-flex mb-lg-3">
          <img :src="getAnnouncementImage(this.announcement)" :alt="getAnnouncementTitle(announcement)" />
          <div class="d-flex flex-column ml-lg-3 mt-lg-1">
            <h4>{{ getAnnouncementTitle(announcement) }}</h4>
            <div class="price">
              <span>{{ announcement.price }}</span>
              <span><icon name="exchange" /> {{ announcement.price_converted }}</span>
            </div>
          </div>
          <div class="promotion-details" v-if="isScreen">
            <span><icon :name="getServiceIcon(selectedServiceInfo.type)" /> {{ selectedServiceInfo.name }}</span>
            <strong>{{ selectedServiceOption ? selectedServiceOption.user_price : 0 }} ₼</strong>
          </div>
        </div>
        <hr />
      </template>
      <form-buttons :btn-class="isCard ? 'white-outline' : 'pale-red-outline'" :options="serviceBtns" :group-by="isScreen ? 1 : 3" :value="promotion.id" 
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
      <h4 v-if="isCard" class="mb-lg-2">
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
      <div style="height: 34px" v-if="!serviceOptionBtns.length"></div>
      <form-buttons :btn-class="isCard ? 'white-outline' : 'pale-red-outline'" :options="serviceOptionBtns" :group-by="isScreen ? 1 : 3" :value="promotion.optionId" 
        @input="updatePromotion({key: 'optionId', value: $event}), selectServiceOption()" />
      <p :class="['mt-lg-3', {'mb-lg-0': isCard}]" v-if="selectedServiceInfo.description">{{ selectedServiceInfo.description }}</p>
      <template v-if="view !== 'card'">
        <h4>{{ $t('payment_method') }}</h4>
        <div class="pb-lg-3">
          <form-buttons :options="payments" :group-by="isScreen ? 1 : 3" :value="promotion.paymentId" 
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
import { SocketMixin } from '~/mixins/socket';

export default {
  props: {
    view: String,
    announcement: {},
    promotionType: {}
  },
  mixins: [ServicesMixin, SocketMixin],
  data() {
    return {
      isPopup: this.view === 'popup',
      isScreen: this.view === 'screen',
      isCard: this.view === 'card',
      pending: false,
      pendingSelect: false,
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
      return (this.serviceOptionBtns)
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
    serviceOptionBtns() {
      if(!this.promotion.id || this.pendingSelect) return [];
      return (this.myServiceOptions.length && this.shouldActivate)  
        ? this.myServiceOptions
            .map(option => ({
              id: option.id,
              name: `${this.getServiceLabel(option.active, option.active_label, this.isCard)} / x${option.count}`
            }))
        : this.services
            .find(service => service.id == this.promotion.id).actives
            .map(option => ({
              ...option,
              id: option.id,
              name: `${this.getServiceLabel(option.daysOrCount, option.days, this.isCard)} / ${option.user_price} ₼`
            }));
    },
    payments() {
      return [
        { key: 1, name: this.$t('pay_with_card') }
      ]
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
    ...mapActions(['getServices', 'getMyServices', 'getMyServiceOptions', 'updatePromotion', 'updatePaidStatus', 'getAnnouncementInner']), 

    async getServiceData() {
      await this.getServices();
      if(this.loggedIn && this.user.autosalon) 
        await this.getMyServices();
    },
    async selectService() {
      this.updatePromotion({ key: 'type', value: this.selectedService.type });
      if (this.loggedIn) {
        this.updatePromotion({ key: 'optionId', value: ''});
        this.pendingSelect = true;
        try {
          await this.getMyServiceOptions(this.selectedService.type);
          this.pendingSelect = false;
          if(this.serviceOptionBtns.length && this.view !== 'card')
            this.updatePromotion({ key: 'optionId', value: this.serviceOptionBtns[0].id});
        } catch(err) {
          this.pendingSelect = false;
        }
      } else if(this.serviceOptionBtns.length) {
        this.updatePromotion({ key: 'optionId', value: this.isCard ? '' : this.serviceOptionBtns[0].id});
      }
    },
    selectServiceOption() {
      if(this.isCard) {
        this.$emit('select-service-option', this.promotion.optionId);
      }
    },
    async purchaseService() {
      this.pending = true;
      try {
        const res = await this.$axios.$post(this.$env.API_BASE_URL + '/marketing/buyService', {
          service_active_id: this.promotion.optionId,
          announce_id_unique: this.announcement.id_unique
        });
        this.pending = false;
        if (this.isPopup) {
          window.open(res.data.redirect_url, 'purchaseservice', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=494,height=718');
          this.connectEcho(`purchase.${res.data.payment_id}`, false).listen('PurchaseInitiated', async (data) => {
            const paid = data.payment.status === 1;
            if (paid) await this.fetchAnnouncementData();
            let type = paid ? 'success' : 'error';
            this.updatePaidStatus({
              type,
              text: this.$t(`${type}_payment_msg`),
              title: this.$t(`${type}_payment`)
            });
          });
        } else {
          // redirect to kapital bank page
          this.$nuxt.$loading.start();
          setTimeout(() => this.$nuxt.$loading.finish(), 500);
          window.location = res.data.redirect_url;
        }
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
        await this.fetchAnnouncementData();
        // reset some data
        this.updatePromotion({ key: 'optionId', value: ''});
        this.pending = false;
        this.goBack();
        this.updatePaidStatus({
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
    async fetchAnnouncementData() {
      if (this.$route.params.id)
        await this.getAnnouncementInner(this.$route.params.id);
    },
    goBack() {
      this.updatePromotion({ key: 'optionId', value: ''});
      this.updatePromotion({ key: 'id', value: ''});
      this.updatePromotion({ key: 'type', value: '' });
      this.$emit('close');
    },
    isAlreadyActive(type) {
      return !!(Object.keys(this.announcement.type).find(key => type == key))
    }
  },
  async fetch() {
    await this.getServiceData();
    if (this.isPopup) return;
    this.updatePromotion({ key: 'id', value: this.serviceBtns.find(service => service.type == this.promotionType).id});
    await this.selectService();
  },
  beforeDestroy() {
    if(this.isPopup) {
      this.updatePromotion({ key: 'optionId', value: '' });
    }
  }
}
</script>