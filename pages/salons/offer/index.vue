<template>
  <div class="container ">
    <offer-slider/>
    <div class="salonsOffer">
      <breadcrumbs :crumbs="crumbs" class=""/>
      <div class=" row m-0">
        <div class=" col col-md-2 background-white" v-if="!isMobileBreakpoint">
          <div class="offerNav">
            <ul>
              <li @click="changePage('all')"
                  :class="{'active-filter': $route.query.param==='all' || !$route.query.param} ">
                <inline-svg src="/icons/offer/requests.svg" class="filter-icon"/>
                <span>
                  Sorğular <span class="offerCount">{{ newOfferCount }}</span>
                </span>
              </li>

              <li @click="changePage('sended')" :class="{'active-filter-fill': $route.query.param==='sended'} ">
                <inline-svg src="/icons/offer/send.svg" class="filter-icon-fill"/>
                <span>
                   Gönd. Təkliflər
                </span>
              </li>


              <li @click="changePage('favorites')" :class="{'active-filter': $route.query.param==='favorites'} ">
                <inline-svg src="/icons/offer/star.svg" class="filter-icon"/>
                <span>
      Seçilmişlər
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
                  Sorğular
                </span>
              </li>

              <li @click="changePage('sended')" :class="{'active-filter-fill': $route.query.param==='sended'} ">
                <inline-svg src="/icons/offer/send.svg" class="filter-icon-fill"/>
                <span>
                   Gönd. Təkliflər
                </span>
              </li>


              <li @click="changePage('favorites')" :class="{'active-filter': $route.query.param==='favorites'} " >
                <inline-svg src="/icons/offer/star.svg" class="filter-icon"/>

                <span>
      Seçilmişlər
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
        <div class="col col-md-12 col-lg-4 background-white">

          <div class="offerUsers">
            <div class="searchBox">
              <icon name="search"></icon>

              <input type="text" v-model="search" placeholder="Maşın və ya istifadəçi adı" class="searchInput">
            </div>
            <div class="user" v-for="offer in offers"
                 @click="getOfferDetail(offer.id)">
              <div class="userImg"
                   :style="'background-image: url('+(offer.user.img ? offer.user.img : '/img/user.jpg')+')'">
              </div>
              <div class="userName">
                <b>{{ offer.user.full_name }}</b>
                <div v-for="offer_item in offer.offer_items">
                  <span>{{ offer_item.brand }} {{ offer_item.model }}</span>

                </div>

              </div>
              <div class="messageCount" v-if="offer.unread_messages > 0">{{offer.unread_messages}}</div>

            </div>
          </div>
        </div>
        <div class="col col-md-12 col-lg-6 col-xs-12 col-sm-12 background-white" v-if="!isMobileBreakpoint">

          <div class="offerDetail" v-if=" offer && Object.keys(offer).length > 0">
            <div class="d-flex align-items-center user" v-if="offer.user">
              <div class="userImg" :style="'background-image: url('+(offer.user.img ? offer.user.img : '/img/user.jpg')+')'" ></div>
              <p class="mt-2 ml-2 text-bold">  {{ offer.user.full_name }}  </p>
              <div class="actions">
                <span @click="addFavorite(offer.id)" :class="offer.isFavorite ? 'isFavorite' : 'favorite'" v-if="!offer.deleted"><icon name="star"/> </span>
                <span @click="deleteAutoSalonOffer(offer.id)" v-if="IsAccepted"> <icon name="garbage"></icon></span>
              </div>
            </div>
            <collapse-content :title="'Təklif'">
              <offer-items :key="offer.id" :offer_items="offer.offer_items"/>

            </collapse-content>

            <div>
              <div class="messages">

                <div :class=" isMyMessage(message) ? 'my' :'his' " class="message" v-for="message in offerMessages">
                  <div v-if="message.files.length>0" class="message-files">
                    <div class="message-file" v-for="file in message.files">
                      <img :src="file" width="100%" class="p-1" @click="openLightbox(file)">
                    </div>
                    <div class="div m-1" v-if="message.files.length > 0 ">

                      {{ message.message }} <span class="time">{{message.time}}</span>
                    </div>

                  </div>
                  <span v-if="!message.files.length>0">

                    {{ message.message }} <span class="time">{{message.time}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="offer-alert" role="alert" v-if=" offer && Object.keys(offer).length > 0 && user_deleted_at!=null">
              İstifadəçi təklifi silmişdir.
            </div>
          </div>

          <div class="addons" v-if="offer && Object.keys(offer).length > 0 && !offer.deleted && user_deleted_at==null">
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
import OfferSlider from "~/components/offer/OfferSlider";
import {mapGetters} from "vuex";
import OfferMessage from "~/components/offer/offer-message";
import CollapseContent from "~/components/elements/CollapseContent";
import {ImageResizeMixin} from '~/mixins/img-resize';
import OfferItems from "~/components/offer/offerItems";
import {offerImageView} from "~/mixins/offer-image-view";

export default {
  name: "index",
  components: {OfferItems, CollapseContent, OfferMessage, OfferSlider},
  data() {
    return {
      IsAccepted:false,
      readedOfferId: null,
      user_deleted_at:null,
      offer: null,
      chat: {
        text: ''
      },
      sendingFiles: false,
      search: "",
      files: [],
      auto_salon_offer_id: null,
      messageButtonDisabled: false
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('Super teklif'),
    })
  },
  mixins: [ImageResizeMixin,offerImageView],
  async asyncData({store, route}) {
    await Promise.all([
      store.dispatch('getHomePageSliders'),
      store.dispatch('getAllOffers', route.query),
    ]);
  },
  nuxtI18n: {
    paths: {
      az: '/salonlar/offer'
    }
  },
  methods: {

    selectOfferItem(index) {
      this.selected_offer_item = index
    },
    changePage(param = null) {

      this.chat.text=''

      this.$router.push({
        path: '/salons/offer',
        params: param,
        query: {param: param}
      })
      this.offer = {}


    },
    isMyMessage(message) {
      return this.user.id === message.sender.id
    },
    handleTyping() {

    },
    handleFiles(files) {
      this.$set(this, 'files', files);
    },
    async addFavorite(id) {
      await this.$store.dispatch('offerAddFavorite', id)
      this.offer.isFavorite = !this.offer.isFavorite;
      this.$store.dispatch('getAllOffers', this.$route.query)

    },
    async deleteAutoSalonOffer(id) {
      await this.$axios.delete('/offer/salon/offer/delete/' + id);
      this.checkAccepted(id)
      this.offer = false

      this.$store.dispatch('getAllOffers', this.$route.query)
    },
    async submitMessage() {
      this.messageButtonDisabled = true;
      if (!this.IsAccepted){
        this.IsAccepted=true
        setTimeout( ()=>{
             this.$store.dispatch('getAllOffers', this.$route.query)
        },500)
      }
      let formData = new FormData();


      formData.append('recipient_id', this.offer.user.id)
      formData.append('message', this.chat.text)
      formData.append('offer_id', this.offer.id)
      formData.append('auto_salon_offer_id', this.auto_salon_offer_id)


      await Promise.all(this.files.map(async (file) => {
        let resizedFile = await this.getResizedImage(file);
        formData.append('files[]', resizedFile);
      }));

      this.$axios.$post('/offer/messages/send', formData).then((res) => {
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
        this.chat.text = '';
        this.$nuxt.$emit('clear-message-attachments');
        this.scrollTo('.my:last-child', 0, 500, '.offerDetail')

      })
      setTimeout(()=>{
        this.messageButtonDisabled = false;
      },2000)


    },

    async getOfferDetail(id) {
      console.log(id)
      this.chat.text=''


      if (this.isMobileBreakpoint) {
        this.$router.push(this.$localePath('/salons/offer') + '/' + id)
      } else {
        await this.checkAccepted(id)

        this.offer = JSON.parse(JSON.stringify(this.offers.find(function (offer) {
            return id === offer.id
          }
        )));
      }
      this.$store.commit('readAllMessage',{offer_id:id})
      this.$store.commit('mutate', {property: 'current_offer_id', value: id})
      setTimeout(() => {
        this.scrollTo('.message:last-child', 300, 500, '.offerDetail')
      }, 1000)

    },
    addFile(e) {
      this.chat.files.append(e.target.files[0])


    },
    choseFile() {
      document.getElementById("fileInput").click();
    },
    async checkAccepted(id) {
      await this.$axios.$post('/offer/salon/offer/check/' + id).then((res) => {
        this.user_deleted_at=res.user_deleted_at;
        this.IsAccepted = res.status
        this.auto_salon_offer_id = res.auto_salon_offer_id ? res.auto_salon_offer_id : null

          this.$store.commit('setOfferMessages', res.messages)
      })

    },
    async accept(id) {
      await this.$store.dispatch('salonAcceptOffer', {id})
      this.checkAccepted(id)
    },
    searchOffer(){

    }
  },
  computed: {
    crumbs() {
      return [
        {name: 'Super təklif paneli', route: '/salons/offer?param=all'},

      ]
    },
    ...mapGetters({
      offers: 'offers',
      offerMessages: 'getOfferMessages',
      newOfferCount: 'getNewOfferCount',
      isFavorite: 'isFavorite'
    }),
  },

  created() {
    if (this.$route.query.c && this.$route.query.c!=null){
      this.getOfferDetail(parseInt(this.$route.query.c))
    }


    if(!Object.keys(this.$route.query).length >0){
      this.$router.push({
        query: {
          param:'all',

        }
      })
    }
  },
  watch: {
    async $route(newVal, oldVal) {
      await this.$store.dispatch('getAllOffers', newVal.query)
      console.log(newVal)
    },
    search(newVal){
      this.$router.push({
        query: {
          param:this.$route.query.param,
          query: newVal,
        }
      })
    }

  }

}

</script>

<style scoped>

</style>
