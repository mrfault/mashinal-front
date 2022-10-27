<template>
  <div :style="isMobileBreakpoint ? null : 'margin-top: -16px;'" class="container">

    <offer-slider/>
    <section class="get-offer">

      <offer-form-select
        slug-in-value
        :label="$t('mark')"
        :options="brands"
        v-model="brand"
        @change="setBrand($event, brand)"
        has-search
        class="get-offer-select"
      />
      <offer-form-select
        slug-in-value
        :label="$t('model')"
        :options="carModels.length > 0 ? carModels : []"
        v-model="model"
        has-search
        class="get-offer-select"
      />
      <button class="btn  btn--green" @click="getOffer()">Əlavə et</button>
    </section>
    <div class="">
      <div class="new-offer mt-5" v-if="userOffers.length > 0">
        <div class="new-offer-title mt-5">
          <h2 class="text-center"> Sorğularım</h2>
        </div>
        <div class="new-offer-notification-box mt-5" v-for="userOffer in userOffers">
          <div class="notification">
            <img src="/icons/auction.svg">
            <p>
              <span v-for="(offerItem,index) in userOffer.offer.offer_items">
                <b>{{offerItem.brand}}</b> - {{offerItem.model}}  <span v-if="index != Object.keys(userOffer.offer.offer_items).length - 1">,</span>
              </span>
            </p>
          </div>
          <nuxt-link :to="$localePath('/offer/offers?param=all')" tag="button" class="offer-button">
            Sorğuya  bax
          </nuxt-link>
        </div>
      </div>
      <div class="new-offer-title mt-5">
        <h2 class="text-center mb-5">Sistem necə işləyir?</h2>
      </div>
      <section class="offer-step">
        <div class="offer-step-box">
          <div class="offer-step-title">Seçimlərini qeyd et <span>1</span></div>
          <p>Sizin üçün uyğun olan marka, model, avadanlıq və alış şərtlərini seçin</p>
          <inline-svg src="/icons/offer/pencil.svg" class="offer-step-icon"></inline-svg>

        </div>
        <div class="offer-step-box">
          <div class="offer-step-title">Uyğun təklifi seç <span>2</span></div>
          <p>Saytımız sürülmüş avtomobillərin alışı, satışı və mübadiləsi üzrə hər növ xidmətləri təklif edir. Bütün
            avtomobillər hər növ texniki diaqnostikadan və satış öncəsi hazırlıq prosedurlarından keçirilib.</p>
          <inline-svg src="/icons/offer/pointer.svg" class="offer-step-icon"></inline-svg>
        </div>
        <div class="offer-step-box">
          <div class="offer-step-title">Axtardığın maşını al <span>3</span></div>
          <p>Avtomobili dilerdən götürə və ya evinizə çatdıra bilərsiniz</p>
          <inline-svg src="/icons/offer/car.svg" class="offer-step-icon"/>
        </div>
      </section>
      <hr class="mt-5 mb-5">
      <section class="offer-text">
        <inline-svg src="/icons/offer/wheel.svg" width="100px"/>

        <p>
          Biz evdən çıxmadan cəmi bir saat ərzində eksklüziv ucuz qiymətə yeni avtomobil almağa imkan verən innovativ
          onlayn sistem yaratdıq. Biz sizin üçün təhlükəsiz, sürətli və rahat əməliyyata zəmanət veririk. Siz
          müdaxiləedici təmaslardan, yorucu danışıqlardan və stress faktorlarından tam qorunacaqsınız. İndi - yalnız
          alış-verişin sevinci və həzzi!
        </p>
      </section>
    </div>
    <section class="offer-count">
      <div class="container">
        <div class="new-offer-title mt-5">
          <h2 class="text-center mb-5">Onlayn yeni maşın almağın faydaları</h2>
        </div>
        <div class="offer-count-items">
          <div class="offer-count-item">
            <i>168</i>
            <p>Rəsmi diller sayı</p>
          </div>
          <div class="offer-count-item">
            <i>168</i>
            <p>Rəsmi diller sayı</p>
          </div>
          <div class="offer-count-item">
            <i>168</i>
            <p>Rəsmi diller sayı</p>
          </div>
          <div class="offer-count-item">
            <i>168</i>
            <p>Rəsmi diller sayı</p>
          </div>
        </div>
      </div>
    </section>
    <section class="offer-partners">

        <div class="new-offer-title mt-5">
          <h2 class="text-center mb-5">Rəsmi tərəfdaşlar</h2>
        </div>

        <div class="offer-partner-container">


          <div class="offer-partner-item" v-for="offerPartner in offerPartners">

            <img :src="offerPartner.logo" class="mt-5">

            <span class="partner-name mt-3">{{ offerPartner.name }}</span>
            <p class="mt-1 partner-subname mb-5">{{ offerPartner.description }}</p>
          </div>


        </div>
        <div class="d-flex justify-content-center">
          <button class="btn text-center  btn--dark-blue-2-outline ml-auto mr-auto mt-5" @click="loadOfferPartners()"
                  v-if="offerPartnersMeta.current_page!=offerPartnersMeta.last_page">
            Daha cox
            <icon name="top" class="rotate180"></icon>
          </button>

        </div>

    </section>
    <section class="text">
      <div class="">
        <hr class="mt-5 mb-5">
        <section class="offer-text">
          <inline-svg src="/icons/offer/stamp.svg" class="offer-stamp-icon" width="70"/>
          <p>
            Biz evdən çıxmadan cəmi bir saat ərzində eksklüziv ucuz qiymətə yeni avtomobil almağa imkan verən innovativ
            onlayn sistem yaratdıq. Biz sizin üçün təhlükəsiz, sürətli və rahat əməliyyata zəmanət veririk. Siz
            müdaxiləedici təmaslardan, yorucu danışıqlardan və stress faktorlarından tam qorunacaqsınız. İndi - yalnız
            alış-verişin sevinci və həzzi!
          </p>
        </section>
      </div>
    </section>
    <section class="questions">
      <div class="">
        <div class="new-offer-title mt-5">
          <h2 class="text-center">Tez-tez verilən suallar</h2>
        </div>
        <accordion :list="visibleList"/>
      </div>
    </section>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import Accordion from "~/components/elements/Accordion";
import OfferSlider from "~/components/offer/OfferSlider";
import OfferFormSelect from "~/components/offer/OfferFormSelect";

export default {
  name: 'Offer',
  components: {OfferFormSelect, OfferSlider, Accordion},
  middleware: ['not_auto_salon', 'auth_general'],
  async fetch({store}) {
    await store.dispatch('getBrands')
    await store.dispatch('offerPartners')
    await store.dispatch('OffersAcceptedByAutoSalon')

  },
  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  data() {
    return {
      brand: '',
      model: '',
    }
  },
  computed: {
    ...mapGetters({
      faq: 'getOfferFaq',
      userOffers: 'OffersAcceptedByAutoSalon',
      brands: 'brands',
      carModels: 'models',
      offerPartners: 'getOfferPartners',
      offerPartnersMeta: 'getOfferPartnersMeta',

    }),


    list() {
      return this.faq.map(item => ({title: item.question[this.locale], text: item.answer[this.locale]}));
    },
    visibleList() {
      if (!this.showAll) {
        return this.list.slice(0, this.defaultVisibleItemCount);
      }
      return this.list;
    }

  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getHomePageSliders'),
      store.dispatch('offerFaq')
    ]);
    return {
      pending: false
    }
  },
  methods: {
    ...mapActions({
      getModelsArray: 'getModelsArray',
      getModelGenerationsArray: 'getModelGenerationsArray',
    }),
    getOffer() {
      if (!this.brand || !this.model) {
        return this.$toasted.error('Brend və ya model seçilməyib')
      }
      this.$router.push({
        name: 'offer-add___'+this.locale, query: {
          brand: this.brand,
          model: this.model,
        }
      })
      this.$store.commit('setNullModels')
    },
    async setBrand(slug, index) {
      let brand = this.brands.find((option) => option.slug === slug)
      this.model = null
      if (slug) this.$store.dispatch('getModels', slug)

    },

    loadOfferPartners() {
      this.$store.dispatch('offerPartners', this.offerPartnersMeta.current_page + 1)

    }
  },
  watch: {},
  beforeCreate() {
    this.brands = [];
    this.carModels = []
  },
  beforeDestroy() {
    this.brands = [];
    this.carModels = []
    this.$store.commit('setNullModels')
  }

}
</script>

