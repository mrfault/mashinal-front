<template>
  <div class="container">
    <offer-slider/>
    <div class=" salonsOffer">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="row m-0">
        <div class=" col col-md-2" v-if="!isMobileBreakpoint">
          <div class="offerNav">
            <ul>
              <li @click="changePage('all')"
                  :class="{'active-filter': $route.query.param==='all' || !$route.query.param} ">
                <inline-svg src="/icons/offer/requests.svg" class="filter-icon"/>
                <span>
                  Təkliflər  <span class="offerCount">{{ newOfferCount }}</span>
                </span>
              </li>
              <li @click="changePage('deleted')" :class="{'active-filter-fill': $route.query.param==='deleted'} ">
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
              <li @click="changePage('all')" :class="{'active-filter': $route.query.param==='all'} ">
                <inline-svg src="/icons/offer/requests.svg" class="filter-icon"/>
                <span>
                  Təkflilər
                </span>
              </li>
              <li @click="changePage('deleted')" :class="{'active-filter-fill': $route.query.param==='deleted'} ">
                <inline-svg src="/icons/offer/delete.svg" class="filter-icon   filter-icon-fill"/>
                <span>
                  Silinmişlər
              </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col col-md-12 col-lg-4">
          <div class="offerUsers" style="height: 692px">
            <div class="searchBox">
              <icon name="search"></icon>
              <input type="text" v-model="search" placeholder="Maşın və ya istifadəçi adı" class="searchInput"
              >

            </div>
            <div class="user" v-for="userOffer in userOffers"
                 @click="getUserOfferDetail(userOffer.auto_salon_offer_id)">


              <div class="userImg"
                   :style="'background-image: url('+(userOffer.auto_salon.logo ? userOffer.auto_salon.logo : '/images/offer/salon_no_logo.svg') +')'"></div>

              <div class="userName">
                <b> {{ userOffer.auto_salon.name }}</b>

                <div v-for="offer_item in userOffer.offer.offer_items">
                  <span>{{ offer_item.brand }} {{ offer_item.model }}</span>
                </div>
              </div>
              <div class="created">
                <div v-if="userOffer.auto_salon_deleted_at">
                  <span style="color: red;font-size: 25px">!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-md-6 col-12 col-xs-12 col-sm-12 offerDetailSection" v-if="!isMobileBreakpoint">
          <div class="offerDetail" v-if="offer">
            <div class="d-flex align-items-center user">
              <div class="userImg"
                   :style="'background-image: url('+(userOffer.auto_salon.logo ? userOffer.auto_salon.logo : '/images/offer/salon_no_logo.svg') +')'"></div>

              <p class="mt-2 ml-2 text-bold">
                {{ auto_salon.name }}
              </p>

              <div class="actions">
                <span @click="deleteUserAutoSalonOffer(userOffer.auto_salon_offer_id)"
                      v-if="!userOffer.user_deleted_at"> <icon name="garbage"></icon></span>
              </div>
            </div>
            <collapse-content :title="'Təklif'">
              <offer-items :offer_items="offer.offer_items"/>
            </collapse-content>
            <div>

              <div class="messages">
                <div class="message" :class="   isMyMessage(message) ? 'my' :'his ' " v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">




                    <div class="message-file" v-for="file in message.files">
                      <img :src="file" width="100%" class="p-1" @click="openLightbox(file)" />

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
            <div class="offer-alert" role="alert" v-if="auto_salon_deleted_at!=null">
              Avto salon təklifi silmişdir.
            </div>
          </div>

          <div class="addons" v-if="userOffer && auto_salon_deleted_at===null && offer.user_deleted==null">
            <offer-message
              @type="handleTyping"
              @attach="handleFiles"
              @send="submitMessage"
              :sending="false"
              :message="false"
              v-model="chat.text"
              :send-button-disabled="messageButtonDisabled "
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

import FsLightbox from 'fslightbox-vue';
import ImagesSlider from '~/components/elements/ImagesSlider';
import OfferSlider from "~/components/offer/OfferSlider";
import {mapGetters} from "vuex";
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";
import {ImageResizeMixin} from '~/mixins/img-resize';
import OfferItems from "~/components/offer/offerItems";
import {offerImageView} from "~/mixins/offer-image-view";

export default {
  name: "offers",
  components: {OfferItems, CollapseContent, OfferMessage, OfferSlider, FsLightbox, ImagesSlider},
  middleware: ['auth_general', 'not_auto_salon'],

  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  mixins: [ImageResizeMixin,offerImageView],
  async asyncData({store, route}) {

    await Promise.all([
      store.dispatch('getHomePageSliders'),
      await store.dispatch('OffersAcceptedByAutoSalon', route.query)
    ])
  },

  data() {
    return {
      offers: null,
      userOffer: null,
      offer: null,
      auto_salon: null,

      chat: {
        text: '',
      },
      search: '',
      files: [],
      auto_salon_offer_id: null,
      auto_salon_deleted_at: null,
      messageButtonDisabled: false,

    }
  },
  computed: {
    ...mapGetters({
      userOffers: 'OffersAcceptedByAutoSalon',
      offerMessages: 'getOfferMessages',
      newOfferCount: 'getNewOfferCount',
    }),

    crumbs() {
      return [
        {name: 'Super təklif paneli', route: '/offer/offers'},
      ]
    },
  },
  methods: {

    searchInputFocus() {
      this.scrollTo('.search-offer', -300, 500, '.container')
    },
    isMyMessage(message) {
      return this.user.id === message.sender.id
    },
    handleTyping() {

    },
    handleFiles(files) {
      this.$set(this, 'files', files);
    },
    async changePage(param) {
      this.chat.text = ''

      this.$router.push({
        path: 'offers',
        params: param,
        query: {param: param}
      })

    },
    async submitMessage() {

      this.messageButtonDisabled = true;
      let formData = new FormData();

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
        this.files = ''
        this.$nuxt.$emit('clear-message-attachments');
        this.$store.commit('appendOfferMessage', res.data.message)
        if (res.data.message.files.length > 1) {
          const sleep = () => {
            this.scrollTo('.my:last-child >.message-files:last-child >.message-file', 300, 500, '.offerDetail')
          }
          setTimeout(sleep, 1000)
        } else {
          setTimeout(() => {
            this.scrollTo('.my:last-child', 0, 500, '.offerDetail')
          }, 1000)

        }
        this.messageButtonDisabled = false;

      })

    },
    async getUserOfferDetail(id) {

      this.chat.text = ''

      if (this.isMobileBreakpoint) {
        this.$router.push(this.$localePath('/offer') + '/' + id)
      } else {


        await this.checkAccepted(id)
        this.userOffer = this.userOffers.find(function (offer) {
          return id === offer.auto_salon_offer_id
        })
        this.auto_salon = this.userOffer.auto_salon
        this.offer = this.userOffer.offer


        this.$store.commit('mutate', {property: 'current_offer_id', value: this.offer.id})
        console.log('-----')
        console.log(this.userOffer)
        this.offer.user_deleted = this.userOffer.user_deleted_at ?  this.userOffer.user_deleted_at : null
          this.auto_salon_deleted_at = this.userOffer.auto_salon_deleted_at

      }
      setTimeout(() => {
        this.scrollTo('.message:last-child', 300, 500, '.offerDetail')
      }, 1000)


    },

    async checkAccepted(id) {
      await this.$axios.$post('/offer/user/offer/check/' + id).then((res) => {
        this.auto_salon_offer_id = res.auto_salon_offer_id
        this.$store.commit('setOfferMessages', res.messages)
        this.scrollTo('.message:last-child', 0, 500, '.offerDetail')
      })

    },
    async accept(id) {
      await this.$store.dispatch('userAcceptOffer', {id})
      this.$store.dispatch('OffersAcceptedByAutoSalon', this.$route.query)
      this.checkAccepted(id)
    },
    async deleteUserAutoSalonOffer(id) {
      this.$axios.delete('/offer/user/offer/delete/' + id);
      this.$store.dispatch('OffersAcceptedByAutoSalon', this.$route.query)
      this.offer = null
      this.userOffer = null

    }
  },
  created() {

    if (!Object.keys(this.$route.query).length > 0) {
      this.$router.push({
        query: {
          param: 'all',

        }
      })
    }
  },
  watch: {
    async $route(newVal, oldVal) {
      await this.$store.dispatch('OffersAcceptedByAutoSalon', newVal.query)
    },
    search(newVal) {

      this.$router.push({
        query: {
          param: this.$route.query.param,
          query: newVal,
        }
      })

    }
  }
}
</script>

<style scoped>

</style>
