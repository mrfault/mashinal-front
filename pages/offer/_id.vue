<template>
  <div>
    <div class="container">
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
              <div class="text-right" v-if="!user_is_accepted">
                <button class="btn  btn--green mt-3" @click="accept(userOffer.auto_salon_offer_id)">Sorğunu qəbul et
                </button>
              </div>
            </collapse-content>


            <div v-if="user_is_accepted">
              <div class="messages">
                <div :class=" isMyMessage(message) ? 'my' :'his' " v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">
                    <div class="message-file" v-for="file in message.files">
                      <img :src="file" width="100%" class="p-1"/>
                    </div>
                    <div class="div m-1" v-if="message.files.length>0">
                      {{ message.message }} <span class="time">17:30</span>
                    </div>

                  </div>
                  <span v-if="!message.files.length>0">
                    {{ message.message }} <span class="time">{{ message.time }}</span>
                  </span>
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
import {ImageResizeMixin} from "~/mixins/img-resize";

export default {
  name: "offer-detail",
  components: {CollapseContent, OfferMessage},
  mixins: [ImageResizeMixin],
  async asyncData({store, route, $axios}) {
    await store.dispatch('getOffer', {
      id: route.params.id,
      type: 'auto_salon'
    })
    await store.dispatch('OffersAcceptedByAutoSalon',route.params.id)


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
      autoSalonOffer: null,
      files: [],
      userOffer:null,
      auto_salon_offer_id:null,
    }
  },
  methods: {
    isMyMessage(message) {
      return this.user.id === message.sender.id
    },
    handleTyping() {

    },
    handleFiles(files) {
      this.$set(this, 'files', files);
    },
    async submitMessage() {
      let formData = new FormData();
      console.log(this.auto_salon_offer_id)

      formData.append('recipient_id', this.userOffer.auto_salon.user_id)
      formData.append('message', this.chat.text)
      formData.append('offer_id', this.offer.id)
      formData.append('auto_salon_offer_id', this.auto_salon_offer_id)

      await Promise.all(this.files.map(async (file) => {
        let resizedFile = await this.getResizedImage(file);
        formData.append('files[]', resizedFile);
      }));
      this.$axios.$post('/offer/messages/send', formData).then((res) => {
        this.chat.text = ''
        this.$store.commit('appendOfferMessage', res.data.message)
        if (res.data.message.files.length > 1) {
          const sleep = () =>{
            this.scrollTo('.my:last-child >.message-files:last-child >.message-file', 300, 500, '.offerDetail')
          }
          setTimeout(sleep, 1000)
        } else {
          this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
        }

      })
      this.$nuxt.$emit('clear-message-attachments');
    },
    async checkAccepted(id) {
      await this.$axios.$post('/offer/user/offer/check/' + id).then((res) => {
        this.user_is_accepted = res.status
        this.auto_salon_offer_id=res.auto_salon_offer_id
        console.log(this.auto_salon_offer_id)
        this.$store.commit('setOfferMessages', res.messages)
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
        console.log('-----------------')
        console.log(this.auto_salon_offer_id)
      })

    },
    async accept(id) {
      await this.$store.dispatch('userAcceptOffer', {id})
      this.checkAccepted(this.$route.params.id)
    },
    async getMessages(offerId) {

    },
    async deleteUserAutoSalonOffer(id) {
      this.$axios.delete('/offer/user/offer/delete/' + id);

      await this.$store.dispatch('OffersAcceptedByAutoSalon')
      if (this.isMobileBreakpoint) {
        this.$router.push('/offer/offers')
      } else {
        this.offer = null
        this.user_is_accepted = false
      }

    },

  },
  created(){
    this.userOffer = this.userOffers.find( (offer)=> {
      return parseInt(this.$route.params.id) === offer.auto_salon_offer_id
    })
    this.checkAccepted(this.$route.params.id)

  },
  computed: {
    ...mapGetters({
      offerMessages: 'getOfferMessages',
      userOffers: 'OffersAcceptedByAutoSalon',
    }),
    offer() {
      var autoSalonOffer = this.$store.getters['getOffer'];
      this.autoSalonOffer = autoSalonOffer.data
      return this.autoSalonOffer.offer

    }
  },
  watch: {
    async $route(newVal, oldVal) {
      await this.$store.dispatch('OffersAcceptedByAutoSalon', newVal.query.param)
    }
  }
}

</script>

<style scoped>

</style>
