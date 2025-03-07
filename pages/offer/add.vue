<template>
  <div>
    <OfferSlider/>
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>
    </div>
    <div class="container">
      <div class="col-md-12 background-white offer-add-section p-5">
        <sell-progress :form="form"/>

        <offer-collapse :first-collapsed="offerAnnouncementItem.collapsed"
                        v-for="(offerAnnouncementItem,index) in offerAnnouncementsCount" :index="index">

          <template #title class="offer-collapse-title">
            <div class="offer-brand">
              <div v-if="offerSelectedModels[index]" class="d-flex align-items-center">
                <img :src="offerSelectedModels[index].img" style="height: 50px;" v-if="offerSelectedModels[index].img">
                <img :src="offerSelectedModels[index].logo" style="height: 50px;"
                     v-else-if="offerSelectedModels[index].logo">

                <span class="ml-2 offerSelectedBrandName">
                  {{ getOfferSelectedModel(index).brand + ' ' + getOfferSelectedModel(index).model }}
                </span>
                <span class="maxPrice" v-if="offerSelectedModels[index].price">
                  {{ getOfferSelectedModel(index).price }} ₼
                </span>
              </div>
            </div>
            <div class="offer-add-delete ml-auto">
              <button @click="deleteOfferAnnouncement(index)" class="btn btn--red-outline"
                      v-if="offerAnnouncementsCount.length && index!=0>1">Sorğunu sil
              </button>
            </div>
          </template>
          <offer-add :key="offerAnnouncementItem.key" :index="index"/>
        </offer-collapse>
      </div>
    </div>
    <modal-popup
      :toggle="showPaymentModalOption"
      :title="'Super təklif'"
      @close="paymentModalClose"
      :modal-class="'offer-payment-modal'"
      :closeable="true"
    >
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="offer-selected-box">
            <div class="offer-selected-item" v-for="offerSelectedModel in offerSelectedModels"
                 v-if="offerSelectedModel.model && offerSelectedModel.price">
              <div class="item-img">
                <img :src="offerSelectedModel.img" alt="">
              </div>
              <div class="item-detail">
                <h4>{{ offerSelectedModel.model }} - {{ offerSelectedModel.price }} ₼</h4>
                <p>{{ offerSelectedModel.brand }} {{ offerSelectedModel.model }} <br>
                  <span>{{ offerSelectedModel.year }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-12">
          <div class="offer-payment-modal-body">
            <h3 class="mb-2">Ödəniş üsulu</h3>
            <div class="d-flex col-6 active flex-column">
              <div class="form-group flex-grow-1 d-flex flex-column">
                <button type="button" class="btn full-width btn--pale-red-outline active" style="cursor: unset"><span>Bank kartı</span>
                </button>
              </div>
            </div>
            <div class="hr"></div>
            <p class="mt-5">
              72 saat ərzində təklifləri görəcəksiniz. Biz evdən çıxmadan cəmi bir saat ərzində eksklüziv ucuz qiymətə
              yeni avtomobil almağa imkan verən innovativ onlayn sistem yaratdıq. Biz sizin üçün təhlükəsiz və rahat
              əməliyyata zəmanət veririk.
            </p>
          </div>

        </div>
        <div class="col-12">
          <div class="hr mt-5"></div>
          <div class="d-flex justify-content-between">
            <div class="text-left "> Cəmi <br> <span
              class="offer-amount">{{ 10 * $store.state.offer_announcements.length }} ₼ </span></div>
            <div class="text-right">
              <button class=" btn  btn--green" @click="pay">Təsdiqlə</button>
            </div>
          </div>
        </div>
      </div>

    </modal-popup>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import OfferSlider from "~/components/offer/OfferSlider";
import SellProgress from "~/components/sell/SellProgress";
import SellPreview from "~/components/sell/SellPreview";
import OfferCollapse from "~/components/offer/OfferCollapse";
import OfferAdd from "~/components/offer/OfferAdd";
import {PaymentMixin} from "~/mixins/payment";
import uuid from 'uuid'

export default {
  name: "add.vue",
  components: {
    OfferAdd,
    OfferCollapse,
    SellPreview,
    SellProgress,
    OfferSlider,
  },
  mixins: [ToastErrorsMixin, PaymentMixin],
  data() {
    return {
      showPaymentModalOption: false,
      refresh: 0,
      isLoader: false,
      form: {}

    }
  },
  async asyncData({store, app, route}) {

    await store.dispatch('getColors')
    await store.dispatch('getBrands')
    await store.dispatch('getModels', app.$parseSlug(route.query.brand))

    await store.dispatch('getGenerations', {
      brand: route.query.brand,
      model: route.query.model
    })
  },
  computed: {
    ...mapGetters(['brands', 'models', 'generations', 'offerAnnouncementsCount', 'offerSelectedModels', 'showOfferPaymentModal']),
    paymentMethodOptions() {
      return [
        {key: 'card', name: this.$t('pay_with_card')},
      ]
    },
    crumbs() {
      return [
        {name: 'Super təklif', route: '/offer'},
        {name: this.$t('cars')}
      ]
    },
  },
  beforeDestroy() {
    this.$store.commit('resetOfferState')
  },

  methods: {
    paymentModalClose() {
      this.showPaymentModalOption = false
      this.$store.commit('setOfferAddLoader', {status: false})
      this.$store.commit('openOfferPaymentModal', {status: false})

    },
    generateKey() {
      return uuid.v4();
    },
    getOfferSelectedModel(index) {
      return this.offerSelectedModels[index]
    },
    deleteOfferAnnouncement(index) {
      this.$store.commit('deleteOfferAnnouncement', {index: index})
    },
    pay() {

      this.$axios.post('/offer/pay', {
        isMobile: this.isMobileBreakpoint ? 'true' : 'false',
        offer_id: this.$store.state.offer_id

      }).then((res) => {
        this.handlePayment(res.data, false, this.$t('car_added'), 'v2')

      })
    },
  },
  watch: {
    '$store.state.offer_announcement_count': function () {
      if (this.$store.state.offer_announcement_count.length == 2 && this.$store.state.offer_announcement_count == false) {
      } else {
        this.scrollTo('.collapse-content:last-child')
      }
    },
    '$store.state.showOfferPaymentModal': function (newVal, oldVal) {
      this.showPaymentModalOption = newVal
    },

  }

}
</script>

<style scoped>

</style>
