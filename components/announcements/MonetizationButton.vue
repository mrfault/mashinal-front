<template>
  <component :is="tag"
    :class="classes ? classes : `btn btn--${className} full-width`"
    @click.stop="openPaymentModal()"
  >
    {{ $t('featured_ads_2') }}

    <modal-popup
      :toggle="showPaymentModal"
      :title="$t('featured_ads_2')"
      :modal-class="'larger monetization-popup'"
      @close="showPaymentModal = false"
    >


      <div class="ads_statics p-5">
        <div>
           <span  v-if="announcement.monetization && announcement.monetization.end_at">{{$t('announcement_monetization_is_paid',{date:getOnlyDate(announcement.monetization.end_at)})}} <br></span>
        {{$t('ads_title')}}</div>

      </div>

      <hr />

      <div class="radio-items">

        <label class="radio-container" v-for="(priceItem,index) in priceList">

           {{priceItem.days}} {{$t('ads_day')}} - {{ priceItem.price }} AZN
          <input type="radio" :checked="index==0 ? 'checked' : null" name="package" @change="selectPackage(priceItem.days,priceItem.price)">
          <span class="checkmark"></span>
        </label>
      </div>



      <hr>
      <h4 class="paymentMethods mt-5 mb-3">{{ $t('payment_method') }}</h4>

       <div class="d-flex">
          <label class="radio-container" style="width: 50%;">
             {{$t('pay_with_card')}}
             <input type="radio"   name="payment_type" :checked="paymentMethod=='card'" @change="paymentMethod='card'">
             <span class="checkmark"></span>
          </label>


          <label class="radio-container" v-if="this.$auth.loggedIn && this.user.balance > minimumPrice  && this.user.balance>this.price.value">
             {{$t('balans')}}
             <input type="radio"   name="payment_type" :checked="paymentMethod=='balance'" @change="paymentMethod='balance'">
             <span class="checkmark"></span>
          </label>
       </div>

      <hr/>
      <div class="row terminal-section">
        <div class="col-md-5">
          <terminal-info-button popup-name="monetization-popup" />
        </div>
        <div class="col-md-7">
          <p class="description">{{$t('ad_can_be_paused')}}</p>


        </div>
      </div>

      <div class="modal-sticky-bottom">
        <hr />
        <div class="row">

          <div class="col-12 col-lg-12 mt-2 mt-lg-0">
            <button :class="['btn btn--green full-width', { pending }]" @click="getAnAd" >
              {{ $t('pay') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="monetization-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
  </component>
</template>

<script>
import { PaymentMixin } from '~/mixins/payment'
import { mapGetters } from 'vuex'

export default {
  props: {
    className: {
      default: 'red',
    },
    multipleAnnouncements: {
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    classes: {
      default: '',
    },
    tag:{
      default: 'button',
      type: String
    },
    announcement: {},
  },
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false,
      priceList: [],
       minimumPrice:null,
      day: {
        value: 7,
        min: 1,
        max: 30,
      },
      price: {
        value: 0,
        min: 0.5,
        max: 1,
      },

    }
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters({
    }),
    totalBalance() {
      let balance = this.user ? this.user.balance : 0;
      if(this.user && this.user?.id === this.announcement?.user_id) {
        if (this.announcement.is_autosalon)
          return this.$sum(balance, this.announcement.user.autosalon.balance)
        else if (this.announcement.is_part_salon)
          return this.$sum(balance, this.announcement.user.part_salon.balance)
        else if (this.announcement.is_external_salon)
          return this.$sum(balance, this.announcement.user.external_salon.balance)
        return balance
      }else {
        if (this.user.autosalon)
          return this.$sum(balance, this.user.autosalon.balance)
        else if (this.user.part_salon)
          return this.$sum(balance, this.user.part_salon.balance)
        else if (this.user.external_salon)
          return this.$sum(balance, this.user.external_salon.balance)
        return balance
      }

    },
    pricesForPlan() {
      return this.priceList.map((item) => parseFloat(item.price))
    },
    availablePlans() {
      return (
        this.priceList.find(
          (item) => item.price == this.price.value,
        )?.prices || []
      )
    },
    daysForPlan() {
      return this.availablePlans.map((item) => item.days)
    },
    selectedPlan() {
      return (
        this.priceList.find((item) => item.days === this.day.value) || {}
      )
    },
    haveBalanceToPay() {
      return parseFloat(this.selectedPlan.price) <= this.totalBalance
    },
  },
  methods: {

   getOnlyDate(dateTime){
      let date = new Date(dateTime);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return  day + '-' + month + '-' + year;
   },

    selectPackage(day,price){
    this.day.value=day
    this.price.value=price

       if (this.user.balance < price && this.paymentMethod=='balance'){
          this.paymentMethod='card'
       }



    },
    async getAnAd() {
      if (this.pending) return
      this.pending = true
      if (!this.haveBalanceToPay) {
        this.paymentMethod = 'card'
      }

      let form = {
        id_unique: this.announcement.id_unique,
        monetize_id: this.selectedPlan.id,
        type: this.paymentMethod,
      };

      if(this.multiple) {
        delete form.id_unique;
        form['announcements'] = this.multipleAnnouncements.map(item => ({ id_unique: item.id_unique}))
      }
      const res = await this.$axios.$post(
        `/monetization/start?is_mobile=${
          this.isMobileBreakpoint ? 'true' : 'false'
        }`,
        form,
      )
      if (this.paymentMethod === 'card') {
        if (!res?.data?.redirect_url) {
          await this.$nuxt.refresh();
          this.updatePaidStatus({
            type: 'success',
            text: this.$t('ad_started'),
            title: this.$t('success_payment')
          });
          this.pending = false;
        }else {
          this.pending = false
          this.showPaymentModal = false
          this.$nuxt.$emit('refresh-my-announcements')
          this.handlePayment(res, false, this.$t('ad_started'))
        }
      } else {
        await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
        this.pending = false
        this.showPaymentModal = false
        this.$nuxt.$emit('refresh-my-announcements')
        this.updatePaidStatus({
          type: 'success',
          text: this.$t('ad_started'),
          title: this.$t('success_payment'),
        })
      }
    },
    openPaymentModal() {
       this.showPaymentModal = true
    },
  },
  beforeCreate() {
    this.$axios.$get('/monetization/price/list').then((res) => {

      this.priceList = res

       this.minimumPrice=this.priceList[0].price
       for (let i = 1; i < this.priceList.length; i++) {
          const price = parseFloat(this.priceList[i].price);

          if (price < this.minimumPrice) {

             this.minimumPrice = price;
          }
       }



       this.price.value=res[0].price
       this.day.value=res[0].days

/*      this.price.min = this.pricesForPlan[0]
      this.price.value = this.pricesForPlan[2]
      this.price.max = this.pricesForPlan[this.pricesForPlan.length - 1]*/
    })
  },
}
</script>
