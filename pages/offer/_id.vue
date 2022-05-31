<template>
  <div>
    <div class="d-flex align-items-center user userBar  mt-3 mb-3">

     <span @click="$router.back()">
      <a>
       <icon name="chevron-left"></icon>
      </a>
  </span>

      <div class="userImg"
           :style="'background-image: url('+(offer.user.img ? offer.user.img : '/img/user.jpg')+')'"></div>

      <p class="mt-2 ml-2 text-bold">
        {{ offer.user.full_name }}
      </p>
      <div class="actions" v-if="user_is_accepted">

              <span @click="deleteUserAutoSalonOffer(autoSalonOffer.auto_salon_offer_id)"
                    v-if="!autoSalonOffer.user_deleted_at"> <icon
                name="garbage"></icon></span>
      </div>
    </div>
    <div class="container">

      <div class="row">
        <div class="col col-md-12 col-12 col-xs-12 col-sm-12">

          <div class="offerDetail" v-if="offer">

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
            </collapse-content>

            <div class="text-right" v-if="!user_is_accepted">
              <button class="btn  btn--green mt-3" @click="accept(autoSalonOffer.auto_salon_offer_id)">Sorğunu qəbul et
              </button>
            </div>
            <div v-else>
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
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";
import {mapGetters} from "vuex";

export default {
  name: "offer-detail",
  components: {CollapseContent, OfferMessage},
  async asyncData({store, route, $axios}) {
    await store.dispatch('getOffer',{
      id:route.params.id,
      type:'auto_salon'
    })

    let res = await $axios.$post('/offer/user/offer/check/' + route.params.id)

    store.commit('setOfferMessages', res.messages)
    return {
      user_is_accepted: res.status
    }

  },
  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  data() {
    return {
      chat: {
        text: '',
      },
      search: '',
      autoSalonOffer: null

    }
  },
  methods: {
    isMyMessage(message) {
      return this.user.id === message.sender.id
    },
    handleTyping() {

    },
    handleFiles() {

    },

    submitMessage() {

      this.$axios.$post('/offer/messages/send', {
        recipient_id: this.autoSalonOffer.auto_salon.user_id,
        message: this.chat.text,
        offer_id: this.offer.id
      }).then((res) => {
        this.chat.text = ''
        this.$store.commit('appendOfferMessage', res.data.message)
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
      })

    },

    async checkAccepted(id) {
      await this.$axios.$post('/offer/salon/offer/check' + id).then((res) => {

        this.user_is_accepted = res.status
        this.$store.commit('setOfferMessages', res.messages)
      })


    },
    async accept(id) {
      await this.$store.dispatch('salonAcceptOffer', {id})
      this.checkAccepted(id)

    },
    async getMessages(offerId) {

    },
    async deleteUserAutoSalonOffer(id) {
      this.$axios.delete('/offer/user/offer/delete/' + id);
      await this.$store.dispatch('OffersAcceptedByAutoSalon')
      this.offer = null
      this.user_is_accepted = false
    },


  },
  computed: {
    ...mapGetters({
      offerMessages: 'getOfferMessages'
    }),
    offer() {
      var autoSalonOffer = this.$store.getters['getOffer'];
      this.autoSalonOffer = autoSalonOffer.data
      return this.autoSalonOffer.offer

    }
  }
}
</script>

<style scoped>

</style>
