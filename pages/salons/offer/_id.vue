<template>
  <div>
    <div class="container">
      <div class="d-flex align-items-center user userBar  mt-3 mb-3">
     <span @click="$router.back()">
      <a>
       <icon name="chevron-left " class="m-1"></icon>
      </a>
  </span>

        <div class="userImg"
             :style="'background-image: url('+(offer.user.img ? offer.user.img : '/img/user.jpg')+')'"></div>

        <p class="mt-2 ml-2 text-bold">
          {{ offer.user.full_name }}
        </p>
        <div class="actions m-1" v-if="user_is_accepted">

              <span @click="deleteUserAutoSalonOffer(offer.id)"
                    v-if="!offer.auto_salon_deleted_at || this.IsAccepted"> <icon
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
            </collapse-content>

            <div class="text-right" v-if="!IsAccepted">
              <button class="btn  btn--green mt-3" @click="accept(offer.id)">Sorğunu qəbul et
              </button>
            </div>
            <div v-else>
              <div class="messages">
                <div :class=" isMyMessage(message) ? 'my' :'his' " v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">
                    <div class="message-file" v-for="file in message.files">
                      <img :src="file" width="100%"/>
                    </div>
                    <div class="div m-1" v-if="message.files.length>0">
                      {{ message.message }} <span class="time">17:30</span>
                    </div>

                  </div>
                  <span v-if="!message.files.length>0">
                    {{ message.message }} <span class="time">17:30</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="addons" v-if="IsAccepted">
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
  name: "salon-offer-detail",
  components: {CollapseContent, OfferMessage},
  async asyncData({store, route, $axios}) {
    await store.dispatch('getOffer', {
      id:route.params.id,
      type:'user'
    })

    let res = await $axios.$post('/offer/salon/offer/check/' + route.params.id)

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
  mixins: [ImageResizeMixin],
  nuxtI18n: {
    paths: {
      az: '/salonlar/offer/:id'
    }
  },
  data() {
    return {
      chat: {
        text: '',
      },
      search: '',
      IsAccepted: false,
      files: []

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

      formData.append('recipient_id', this.offer.user.id)
      formData.append('message', this.chat.text)
      formData.append('offer_id', this.offer.id)


      await Promise.all(this.files.map(async (file) => {
        let resizedFile = await this.getResizedImage(file);
        formData.append('files[]', resizedFile);
      }));

      this.$axios.$post('/offer/messages/send', formData).then((res) => {
        this.$store.commit('appendOfferMessage', res.data.message)
        if (res.data.message.files.length > 1) {
          const sleep = () =>{
            this.scrollTo('.my:last-child >.message-files:last-child >.message-file', 300, 500, '.offerDetail')
          }
          setTimeout(sleep, 1000)
        } else {
          this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
        }
        this.chat.text = '';
        this.$nuxt.$emit('clear-message-attachments');
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
      })

    },

    async checkAccepted(id) {
      await this.$axios.$post('/offer/salon/offer/check/' + id).then((res) => {

        this.IsAccepted = res.status
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
      this.$axios.delete('/offer/salon/offer/delete/' + id);
      await this.$store.dispatch('OffersAcceptedByAutoSalon')
    /*  this.offer = null*/
      this.IsAccepted = false
      if (this.isMobileBreakpoint){
        this.$router.back()
      }
    },
  },
  computed: {
    ...mapGetters({
      offerMessages: 'getOfferMessages'
    }),
    offer() {
      var offer = this.$store.getters['getOffer'];
      console.log(offer)
      return offer.data
    }
  },
  created() {
    this.checkAccepted(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>
