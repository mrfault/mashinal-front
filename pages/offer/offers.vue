<template>
  <div class="container">
    <offer-slider/>
    <div class=" salonsOffer">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="row">
        <div class=" col col-md-2" v-if="!isMobileBreakpoint">
          <div class="offerNav">
            <ul>
              <li @click="changePage('all')"  :class="{'active-filter': $route.query.param==='all' || !$route.query.param} ">
                <inline-svg src="/icons/offer/requests.svg" class="filter-icon"/>
                <span>
                  Təkliflər
                </span>
              </li>
              <li @click="changePage('deleted')" :class="{'active-filter-fill': $route.query.param==='deleted'} " >
                <inline-svg src="/icons/offer/delete.svg" class="filter-icon   filter-icon-fill"/>
                <span>
                  Silinmişlər
              </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-12" v-if="isMobileBreakpoint">
          <div class="mobile-filter">
            <ul>
              <li @click="changePage('all')"  :class="{'active-filter': $route.query.param==='all'} ">
                <inline-svg src="/icons/offer/requests.svg" class="filter-icon"/>
                <span>
                  Təkflilər
                </span>
              </li>
              <li @click="changePage('deleted')" :class="{'active-filter-fill': $route.query.param==='deleted'} " >
                <inline-svg src="/icons/offer/delete.svg" class="filter-icon   filter-icon-fill"/>
                <span>
                  Silinmişlər
              </span>
              </li>

            </ul>
          </div>
        </div>
        <div class="col col-md-4">
          <div class="offerUsers">
            <div class="searchBox">

              <input type="text" v-model="search" placeholder="Maşın və ya istifadəçi adı" class="searchInput">

            </div>
            <div class="user" v-for="userOffer in searchOffer"
                 @click="getUserOfferDetail(userOffer.auto_salon_offer_id)">
              <div class="userImg"
                   :style="'background-image: url('+(userOffer.auto_salon.logo ? userOffer.auto_salon.logo : '/images/offer/salon_no_logo.svg') +')'">
              </div>
              <div class="userName">
                <b> {{ userOffer.auto_salon.name }}</b>
                <span>{{ userOffer.offer.brand }} {{ userOffer.offer.model }}</span>
                <span>{{ userOffer.offer.minPrice }} - {{ userOffer.offer.maxPrice }}</span>

              </div>

              <div class="created">
                {{ userOffer.created_at }}
              </div>
            </div>
          </div>
        </div>
        <div class="col col-md-6 col-12 col-xs-12 col-sm-12">
          <div class="offerDetail" v-if="offer">
            <div class="d-flex align-items-center user">

              <div class="userImg" :style="'background-image: url('+offer.user.img+')'"></div>

              <p class="mt-2 ml-2 text-bold">
                {{ offer.user.full_name }}
              </p>
              <div class="actions" v-if="user_is_accepted">

                <span @click="deleteUserAutoSalonOffer(userOffer.auto_salon_offer_id)"
                      v-if="!userOffer.user_deleted_at"> <icon name="garbage"></icon></span>
              </div>
            </div>
            <collapse-content :title="'Təklif'">

              <div class="generations">
                <div class="row">

                  <div class="col-md-3" v-for="generation in offer.generations">
                    <img :src="generation.img" class="generationImage" width="100%">
                  </div>
                  <div class="col-md-6">
                    <div class="carName">

                      <span class="carPrice">{{ offer.minPrice }} - {{ offer.maxPrice }} ₼</span>
                      <h3>{{ offer.brand }} {{ offer.model }}</h3>

                    </div>

                  </div>

                </div>

              </div>
              <div class="offerDetailContent">
                <div class="offerDetailItem">
                  <p>Brand</p>
                  <span>{{ offer.brand }}</span>
                </div>
                <div class="offerDetailItem">
                  <p>Model </p>
                  <span>
                  {{ offer.model }}
                </span>
                </div>

                <div class="offerDetailItem">
                  <p>Nəsil </p>
                  <div>
                  <span v-for=" (generation,index) in offer.generations">
                  {{ generation.name }}
                                      <div v-if="index != offer.generations.length - 1">,</div>
                </span>


                  </div>

                </div>
                <div class="offerDetailItem">

                  <p>Sürətlər qutusu </p>
                  <div>
                <span v-for=" (gearbox,index) in offer.gear_boxes">
                               {{ $t('box_values')[gearbox.gear_box_key] }}

                  <div v-if="index != offer.gear_boxes.length - 1">,</div>
                </span>

                  </div>
                </div>
                <div class="offerDetailItem">
                  <p>Yanacaq növü </p>
                  <div>
                <span v-for=" (fuel_type,index) in offer.fuel_types">

                  {{ $t('engine_values')[fuel_type.fuel_type_key] }} <div
                  v-if="index != offer.fuel_types.length - 1">,</div>

                </span>
                  </div>
                </div>

              </div>
              <div class="text-right" v-if="!user_is_accepted">
                <button class="btn  btn--green mt-3" @click="accept(userOffer.auto_salon_offer_id)">Sorğunu qəbul et
                </button>
              </div>
            </collapse-content>


            <div v-if="user_is_accepted">
              <div class="messages">
                <div :class="isMyMessage(message) ? 'my' :'his' " v-for="message in offerMessages">
                  {{ message.message }} <span class="time">17:30</span>
                </div>
              </div>
            </div>
          </div>
          <div class="addons" v-if="user_is_accepted">
            <offer-message
              @type="handleTyping"
              @attach="handleFiles"
              @send="submitMessage"

              :sending="false"
              :message="false"
              v-model="chat.text"
              :send-button-disabled="chat.text.length<1 ? true : false"
            />
            <img src="" :ref="'attachment-'+key" alt=""/>
            <div class="addLink"></div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import OfferSlider from "~/components/offer/OfferSlider";
import {mapGetters} from "vuex";
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";

export default {


  name: "offers",
  components: {CollapseContent, OfferMessage, OfferSlider},
  middleware: ['auth_general'],
  async fetch({store}) {
    await store.dispatch('OffersAcceptedByAutoSalon')
  },
  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getHomePageSliders')
    ])
  },

  data() {
    return {
      offers: null,
      userOffer: null,
      offer: null,
      user_is_accepted: false,
      chat: {
        text: '',
      },
      search: ''


    }
  },

  computed: {
    ...mapGetters({
      userOffers: 'OffersAcceptedByAutoSalon',
      offerMessages: 'getOfferMessages'
    }),

    crumbs() {
      return [
        {name: 'Super təklif paneli', route: '/offer/offers'},
      ]
    },
    searchOffer() {
      return this.userOffers.filter((item => {
        return item.auto_salon.name.toUpperCase().includes(this.search.toUpperCase()) ||
          item.offer.brand.toUpperCase().includes(this.search.toUpperCase())
      }))
    },

  },
  methods: {
    isMyMessage(message) {
      return this.user.id === message.sender.id
    },
    handleTyping() {

    },
    handleFiles() {

    },
    async changePage(param) {
      this.$router.push({
        path:'offers',
        params:param,
        query :{param:param}
      })

    },
    submitMessage() {

      this.$axios.$post('/offer/messages/send', {
        recipient_id: this.userOffer.auto_salon.user_id,
        message: this.chat.text,
        offer_id: this.offer.id
      }).then((res) => {
        this.chat.text = ''
        this.$store.commit('appendOfferMessage', res.data.message)
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
      })

    },
    async getUserOfferDetail(id) {
      if (this.isMobileBreakpoint) {
        this.$router.push(this.$localePath('/offer') + '/' + id)
      } else {
        await this.checkAccepted(id)
        this.userOffer = this.userOffers.find(function (offer) {
            return id === offer.auto_salon_offer_id
          }
        )
        this.offer = this.userOffer.offer
      }

    },
    async checkAccepted(id) {
      await this.$axios.$post('/offer/user/offer/check/' + id).then((res) => {

        this.user_is_accepted = res.status
        this.$store.commit('setOfferMessages', res.messages)
      })


    },
    async accept(id) {
      await this.$store.dispatch('userAcceptOffer', {id})
      this.checkAccepted(id)

    },
    async getMessages(offerId) {

    },
    async deleteUserAutoSalonOffer(id) {
      this.$axios.delete('/offer/user/offer/delete/' + id);
      await this.$store.dispatch('OffersAcceptedByAutoSalon')
      this.offer = null
      this.user_is_accepted = false
    }
  },
  watch:{
   async  $route(newVal,oldVal){
      await this.$store.dispatch('OffersAcceptedByAutoSalon', newVal.query.param)
    }
  }
}
</script>

<style scoped>

</style>
