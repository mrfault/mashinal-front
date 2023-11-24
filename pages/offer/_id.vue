<template>
  <div>
    <div class="container" >
      <div class="d-flex align-items-center user userBar  mt-3 mb-3">

     <span @click="$router.back()">
      <a>
       <icon name="chevron-left"></icon>
      </a>
  </span>

         <div class="userImg" :style="'background-image: url('+(autoSalonOffer.data.auto_salon ? autoSalonOffer.data.auto_salon : '/images/offer/salon_no_logo.svg') +')'" ></div>

        <p class="mt-2 ml-2 text-bold" >
          {{autoSalonOffer.data.auto_salon.name}}
        </p>
        <div class="actions" >

              <span @click="deleteUserAutoSalonOffer(autoSalonOffer.data.auto_salon_offer_id)"
                    v-if="!autoSalonOffer.data.user_deleted_at"> <icon
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


            <div >
              <div class="messages">
                <div class="message" :class=" isMyMessage(message) ? 'my' :'his' " v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">

                    <div class="message-file" v-for="file in message.files"  @click="openLightbox(file)" >
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

          <div class="col-md-12">
            <div class="offer-alert" role="alert" v-if="auto_salon_deleted_at!=null ">
              Avto salon  təklifi silmişdir.
            </div>
          </div>


          <div class="addons" v-if="userOffer && !auto_salon_deleted && !user_deleted">
            <offer-message
              @type="handleTyping"
              @attach="handleFiles"
              @send="submitMessage"

              :sending="false"
              :message="false"
              v-model="chat.text"
              :send-button-disabled="messageButtonDisabled"

            />
            <img src="" :ref="'attachment-'+key" alt=""/>
            <div class="addLink"></div>
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
    </div>
  </div>
</template>

<script>
import FsLightbox from 'fslightbox-vue';
import ImagesSlider from '~/components/elements/ImagesSlider';
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";
import {mapGetters} from "vuex";
import {ImageResizeMixin} from "~/mixins/img-resize";
import OfferItems from "~/components/offer/offerItems";
import {offerImageView} from "~/mixins/offer-image-view";

export default {
  name: "offer-detail",
  components: {OfferItems, CollapseContent, OfferMessage},
  mixins: [ImageResizeMixin,offerImageView],
  async asyncData({store, route, $axios}) {
    await store.dispatch('getOffer', {
      id: route.params.id,
      type: 'auto_salon'
    })
    if(process.server)
      await store.dispatch('OffersAcceptedByAutoSalon',route.params.id)


    let res = await $axios.$post('/offer/user/offer/check/' + route.params.id)
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
  data() {
    return {
      chat: {
        text: '',
      },
      search: '',
      files: [],
      userOffer:null,
      auto_salon_offer_id:null,
      auto_salon_deleted: true,
      user_deleted:true,
      messageButtonDisabled: false,
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
      this.messageButtonDisabled = true;
      let formData = new FormData();

      formData.append('recipient_id', this.userOffer.auto_salon.user_id)
      formData.append('message', this.chat.text)
      formData.append('offer_id', this.offer.id)
      formData.append('auto_salon_offer_id', this.auto_salon_offer_id)

      await Promise.all(this.files.map(async (file) => {
        // let resizedFile = await this.getResizedImage(file);
        formData.append('files[]', file);
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
      setTimeout(() => {
        this.messageButtonDisabled = false;
      }, 2000)
    },
    async checkAccepted(id) {

      await this.$axios.$post('/offer/user/offer/check/' + id).then((res) => {
        this.user_is_accepted = res.status
        this.auto_salon_offer_id=res.auto_salon_offer_id

        this.$store.commit('setOfferMessages', res.messages)
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')

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
    this.auto_salon_deleted_at = this.userOffer.auto_salon_deleted_at
    this.checkAccepted(this.$route.params.id)


  },
  computed: {
    ...mapGetters({
      offerMessages: 'getOfferMessages',
      userOffers: 'OffersAcceptedByAutoSalon',
      autoSalonOffer:'getOffer'
    }),
    offer() {
      return this.autoSalonOffer.data.offer


    }
  },
  watch: {
    async $route(newVal, oldVal) {
     // await this.$store.dispatch('OffersAcceptedByAutoSalon', newVal.query.param)
    }
  }
}

</script>

<style scoped>

</style>
