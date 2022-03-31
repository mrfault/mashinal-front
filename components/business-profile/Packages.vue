<template>
  <div class="business-profile__packages" ref="packages">
    <form @submit.prevent="submit">
      <div :class="{'text-center': !isMobileBreakpoint}">
        <h2 :class="['section-title heading-dots', {'heading-dots--left': isMobileBreakpoint}]">
          {{ $t('business_profile_packages') }}
        </h2>
      </div>
      <div class="row packages">
        <div class="col-6 col-lg-2 mb-2 mb-lg-0" v-for="item in salonPackages" :key="item.id">
          <div :class="['package card',{'package--active': selected === item.id}]" @click="selected = item.id">
            <div :class="['package__radio', {'package__radio--checked': selected === item.id}]"></div>
            <div class="package__price">{{ item.price }} ₼</div>
            <div class="package__name" :style="item.color ? ('color: ' + item.color) : ''">
              {{ item.name[locale] }}
            </div>
            <hr />
            <div class="package__details">
              <p class="mx-0 mt-1 text-with-check">
                <icon name="check" :style="item.color ? ('color: ' + item.color) : ''" />
                {{ $t('announcement_count') }} - {{ item.unlimited ? $t('limitless') : item.announce_count }}
              </p>
              <p class="mx-0 mt-1 text-with-check">
                <icon name="check" :style="item.color ? ('color: ' + item.color) : ''" />
                <icon name="wallet" />
                - {{ item.service_price }} ALM
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button type="submit" :class="['btn btn--green', { 'pending': downgradePlan && pending, 'disabled': activePackage && activePackage.id == selected && !shouldBuy  }]">
          {{ $t((shouldBuy) ? 'to_buy_package' : 'to_change_package') }}
        </button>
      </div>
    </form>
    <modal-popup
      :toggle="showPaymentModal"
      :title="`${$t('package')} - ${getPackageName(selectedPackage)}`"
      @close="showPaymentModal = false, $v.$reset()"
    >
      <form-text-input
        v-if="!hasSalon"
        :maxlength="30"
        :placeholder="$t('salon_name')"
        :invalid="$v.form.name.$error"
        v-model="form.name"
        class="mb-2 mb-lg-3"
      />
      <p class="mb-2 mb-lg-3">
        {{ $t(hasSalon ? 'business_profile_package_change_info' : 'business_profile_payment_info') }}
      </p>
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
      <terminal-info-button popup-name="packages-popup" />
      <div class="modal-sticky-bottom">
        <hr/>
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ calculatedPrice }} ₼</p>
          </div>
          <div class="col-6">
            <button :class="['btn btn--green full-width', { pending }]" @click="getBusinessProfile">
              {{ $t('go_further') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="packages-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
    <modal-popup
      :toggle="showMyAnnouncements"
      :title="`${$t('package')} - ${getPackageName(selectedPackage)}`"
      @close="showMyAnnouncements = false, deselectAnnouncements()"
      :modal-class="'announcements-popup' + (isMobileBreakpoint ? ' larger' : '')"
    >
      <p v-html="$t('you_should_deactivate_announcements', {
        package1: getPackageName(user.autosalon.current_package),
        package2: getPackageName(selectedPackage),
        n: selectedPackage.announce_count
      })" v-if="user.autosalon"></p>
      <grid
        :announcements="salonAnnouncements.items"
        :show-title="false"
        :show-phone-count="true"
        :show-checkbox="true"
        :show-overlay="false"
        :clickable="false"
      />
      <div class="modal-sticky-bottom">
        <hr/>
        <div class="row">
          <div class="col-6 col-lg-1-5">
            <div class="form-info text-red">{{ $t('from_possible_left') }}: {{ leftToDeactivate }}</div>
          </div>
          <div class="d-none d-lg-block col-lg-3-5"></div>
          <div class="col-6 col-lg-1-5 mt-0">
            <button :class="['btn btn--green full-width', { pending, disabled: leftToDeactivate !== 0 }]" @click="deactivateAnouncement">
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { PaymentMixin } from '~/mixins/payment';

import { required } from 'vuelidate/lib/validators';

import Grid from '~/components/announcements/Grid';

export default {
  mixins: [PaymentMixin],
  components: {
    Grid
  },
  data() {
    return {
      pending: false,
      selected: '',
      showMyAnnouncements: false,
      selectedAnnouncements: [],
      hasSalon: !!this.$store.state.auth.user?.autosalon,
      contractEnded: this.$store.state.auth.user?.autosalon?.status === 0,
      form: {
        name: this.$store.state.auth.user?.part_salon?.name || this.$store.state.auth.user?.autosalon?.name || ''
      }
    }
  },
  validations: {
    form: {
      name: { required }
    }
  },
  computed: {
    ...mapGetters({
      salonPackages: 'packages/salonPackages',
      salonAnnouncements: 'packages/salonAnnouncements'
    }),
    priceDifference() {
      if (this.shouldBuy || this.downgradePlan) return 0;
      let diff = this.$substract(parseFloat(this.selectedPackage.price), parseFloat((this.user.autosalon.current_package?.price || 0)));
      return diff > 0 ? diff : 0;
    },
    calculatedPrice() {
      if (!this.selectedPackage) return 0;
      return this.priceDifference || parseFloat(this.selectedPackage.price);
    },
    haveBalanceToPay() {
      if (!this.selected || !this.loggedIn) return false;
      return this.calculatedPrice <= this.user.balance;
    },
    downgradePlan() {
      if (this.shouldBuy) return false;
      return parseFloat(this.selectedPackage.price) < parseFloat((this.user.autosalon.current_package?.price || 0));
    },
    selectedPackage() {
      return this.salonPackages.find(p => p.id === this.selected);
    },
    shouldBuy() {
      return !this.hasSalon || this.contractEnded;
    },
    activePackage() {
      if (!this.hasSalon) return null;
      return this.salonPackages.find(item => item.id === this.user.autosalon.current_package?.id) || null
    },
    leftToDeactivate() {
      if (!this.user.autosalon || !this.downgradePlan) return 0;
      let left = (this.user.autosalon.current_package?.announce_count || 0) - this.user.announce_left_car - this.selectedPackage.announce_count - this.selectedAnnouncements.length;
      return left < 0 ? 0 : left;
    }
  },
  methods: {
    ...mapActions({
      getSalonAnnouncements: 'packages/getSalonAnnouncements',
      deactivateMyAnnounement: 'deactivateMyAnnounement'
    }),
    async submit() {
      if (!this.loggedIn) this.$nuxt.$emit('login-popup', 'salon-package');
      else if (!this.downgradePlan) this.showPaymentModal = true;
      else await this.getBusinessProfile();
    },
    async getBusinessProfile() {
      if (this.pending) return;
      if (!this.hasSalon) {
        this.$v.$touch();
        if (this.$v.$error) return;
      }
      this.pending = true;
      try {
        let res;
        if (this.shouldBuy) {
          res = await this.$axios.$post(`/payment/package?is_mobile=${this.isMobileBreakpoint}`, {
            name: this.form.name,
            package_id: this.selected,
            type: this.paymentMethod
          });
        } else {
          res = await this.$axios.$post(`/payment/change-package?is_mobile=${this.isMobileBreakpoint}`, {
            autosalon_id: this.user.autosalon.id,
            package_id: this.selected,
            type: this.paymentMethod
          });
        }
        if (this.downgradePlan) {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.$router.push(this.$localePath('/dashboard/1'+(this.hasSalon ? '' : '/settings')), () => {
            this.updatePaidStatus({
              type: 'success',
              text: this.$t('change_package'),
              title: this.$t('success_payment')
            });
          });
        } else if (this.paymentMethod === 'card') {
          this.pending = false;
          this.showPaymentModal = false;
          this.handlePayment(res, [this.$localePath('/dashboard/1'+(this.hasSalon ? '' : '/settings')), false], this.$t(this.shouldBuy ? 'package_bought' : 'change_package'));
        } else {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.showPaymentModal = false;
          this.$router.push(this.$localePath('/dashboard/1'+(this.hasSalon ? '' : '/settings')), () => {
            this.updatePaidStatus({
              type: 'success',
              text: this.$t(this.shouldBuy ? 'package_bought' : 'change_package'),
              title: this.$t('success_payment')
            });
          });
        }
      } catch (err) {
        this.pending = false;
        // give salon opportunity to deactivate announcements
        if (err.response.status === 433) {
          this.showMyAnnouncements = true;
        }
      }
    },
    handleAfterLogin(key) {
      if (key === 'salon-package') {
        this.hasSalon = !!this.user?.autosalon;
        this.contractEnded = this.user?.autosalon?.status === 0;
        this.form.name = this.user.part_salon?.name || '';
        this.showPaymentModal = true;
      }
    },
    getPackageName(item) {
      if (!item) return ''
      return `<span style='${item.color ? ('color: ' + item.color) : ''}'>${item.name?.[this.locale]}</span>`;
    },
    selectAnnouncement(id, value, controls = false) {
      if (!controls) return;

      this.$set(this, 'selectedAnnouncements', value
        ? (this.selectedAnnouncements.includes(id) ? [...this.selectedAnnouncements] : [...this.selectedAnnouncements, id])
        : this.selectedAnnouncements.filter(selected_id => selected_id != id)
      );
    },
    deselectAnnouncements() {
      this.$set(this, 'selectedAnnouncements', []);
    },
    async deactivateAnouncement() {
      if (this.pending) return;
      this.pending = true;
      try {
        await Promise.all(this.selectedAnnouncements.map(this.deactivateMyAnnounement));
        await this.$nuxt.refresh();
        this.pending = false;
        this.showMyAnnouncements = false;
        await this.getBusinessProfile();
      } catch (err) {
        this.pending = false;
      }
    },
  },
  created() {
    this.selected = this.salonPackages.find(item => item.announce_count == 20).id;
    if (this.hasSalon) {
      // `current_package` may include a package which is not in the list anymore
      if (this.activePackage) this.selected = this.activePackage.id;
      this.getSalonAnnouncements();
    }
  },
  mounted() {
    this.$nuxt.$on('after-login', this.handleAfterLogin);
    this.$nuxt.$on('select-announcement', this.selectAnnouncement);

    this.$nextTick(() => {
      if (this.$route.query.scrollto) {
        let ref = this.$refs[this.$route.query.scrollto];
        this.$router.replace({ query: { type: 1 } });
        if (ref) setTimeout(() => {
          this.scrollTo(ref);
        }, 300);
      }
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('after-login', this.handleAfterLogin);
    this.$nuxt.$off('select-announcement', this.selectAnnouncement);
  }
}
</script>
