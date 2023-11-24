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
        <div class="actions m-1 d-flex" v-if="IsAccepted">
          <span @click="addFavorite(offer.id)" :class="offer.isFavorite ? 'isFavorite' : 'favorite'" v-if="!offer.deleted"><icon name="star"/> </span>
              <span @click="deleteUserAutoSalonOffer(offer.id)"  v-if="!offer.auto_salon_deleted_at || this.IsAccepted"> <icon
                name="garbage"></icon></span>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col col-md-12 col-12 col-xs-12 col-sm-12">
          <div class="offerDetail" v-if="offer">


            <collapse-content :title="'Təklif'">
              <offer-items :offer_items="offer.offer_items"/>
            </collapse-content>



              <div class="messages">
                <div class="message" :class=" isMyMessage(message) ? 'my' :'his' " v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">
                    <div class="message-file" v-for="file in message.files">
                      <img :src="file" width="100%" @click="openLightbox(file)" class="p-1"/>
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

          <div class="col-md-12">
            <div class="offer-alert" role="alert" v-if="user_deleted">
              İstifadəçi təklifi silmişdir.
            </div>
          </div>

          <div class="addons" v-if="!auto_salon_deleted && !user_deleted">
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
    <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
      <template v-if="isMobileBreakpoint">
        <FsLightbox
          :toggler="toggleFsLightbox"
          :sources="attachments"
          :slide="currentSlide + 1"
          :key="lightboxKey"
          :onClose="refreshLightbox"
          :onBeforeClose="onBeforeClose"
          :disableThumbs="true"
          :onSlideChange="changeLightboxSlide"
        />
      </template>
      <transition-group name="fade">
        <template v-if="(showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && showImagesSlider)">
          <div class="blur-bg" :key="0">
            <img :src="$withBaseUrl(attachments[currentSlide])" alt="" />
          </div>
          <div class="blur-bg_slider" :key="1" v-if="!isMobileBreakpoint">
            <images-slider
              :current-slide="currentSlide"
              :slides="{ main: attachments }"
              @close="closeLightbox"
              @slide-change="currentSlide = $event"
            />
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";
import {mapGetters} from "vuex";
import {ImageResizeMixin} from "~/mixins/img-resize";
import OfferItems from "~/components/offer/offerItems";
import {offerImageView} from "~/mixins/offer-image-view";

export default {
  name: "salon-offer-detail",
  components: {OfferItems, CollapseContent, OfferMessage},
  async asyncData({store, route, $axios}) {
    await store.dispatch('getOffer', {
      id:route.params.id,
      type:'user'
    })

    let res = await $axios.$post('/offer/salon/offer/check/' + route.params.id)

    store.commit('setOfferMessages', res.messages)
    return {
      user_is_accepted: res.status,
      auto_salon_deleted:res.auto_salon_deleted_at==null ? false : true,
      user_deleted:res.user_deleted_at==null ? false : true
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  mixins: [ImageResizeMixin,offerImageView],
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
      files: [],
      auto_salon_offer_id:null,
      user_deleted:true,
      auto_salon_deleted:true,

    }
  },
  methods: {
    async addFavorite(id) {
      await this.$store.dispatch('offerAddFavorite', id)

      this.$store.dispatch('getAllOffers', this.$route.query)

    },
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
      formData.append('auto_salon_offer_id', this.auto_salon_offer_id)


      await Promise.all(this.files.map(async (file) => {
        // let resizedFile = await this.getResizedImage(file);
        formData.append('files[]', file);
      }));

      this.$axios.$post('/offer/messages/send', formData).then((res) => {
        this.$store.commit('appendOfferMessage', res.data.message)
        if (res.data.message.files.length > 1) {
          const sleep = () =>{
            this.scrollTo('.my:last-child >.message-files:last-child >.message-file', 300, 500, '.offerDetail')
          }
          setTimeout(sleep, 1000)
        } else {
          this.scrollTo('.message:last-child', 0, 500, '.offerDetail')
        }
        this.chat.text = '';
        this.$nuxt.$emit('clear-message-attachments');
        this.checkAccepted(this.$route.params.id)

      })

    },

    async checkAccepted(id) {
      await this.$axios.$post('/offer/salon/offer/check/' + id).then((res) => {

        this.auto_salon_deleted=res.auto_salon_deleted_at==null ? false : true
        this.user_deleted=res.user_deleted_at==null ? false : true

        this.IsAccepted = res.status
        this.auto_salon_offer_id = res.auto_salon_offer_id

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
