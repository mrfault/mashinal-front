<template>
   <div class="protocol-details-component">
      <button
         :class="[
                                        'btn',
                                        'btn--white',
                                        'btn-dark-text',
                                        'full-width',
                  { 'pointer-events-none': pending }                  ]"
         type="button"
         @click="showProtocolDetails = true"
      >
         {{ $t('detail') }}
      </button>

      <modal-popup
         :modal-class="modalClasses"
         :title="$t('protocol_details')"
         :toggle="showProtocolDetails"
         @close="showProtocolDetails = false"
      >
         <div v-if="(!mediaIsOpen && !isMobileBreakpoint) || isMobileBreakpoint" class="protocol-details-button__content--container">
            <div
               class="protocol-details-button__content">
               <div v-for="(value, key) in filteredProtocol"
                    class="ma-penalties__card--body__penalties--item bottom-border">
                  <div class="ma-left">
                     <div class="ma-left__content">
                        <p>{{ $t(key) }}</p>
                     </div>
                  </div>

                  <div class="ma-right" style="padding-left: 24px; text-align: right;">
                     <strong v-if="key == 'protocol_amount' " class="ma-right__amount">
                        {{ value }}
                        <template v-if="protocol.amount">AZN</template>
                     </strong>
                     <strong v-else-if="key == 'pay_status' && value == false" class="ma-right__amount"
                             style="color: #039855">
                        {{ $t('already_paid') }}
                     </strong>
                     <strong v-else-if="key == 'pay_status' && value == true" class="ma-right__amount"
                             style="color: #F81734">
                        {{ $t('not_paid') }}
                     </strong>
                     <strong v-else class="ma-right__amount">
                        {{ $t(value) }}
                     </strong>
                  </div>
               </div>

               <div
                  class="ma-penalties__card--body__penalties--item total no-borders"
               >
                  <strong class="">{{ $t('total') }}</strong>
                  <strong>
                     {{ protocol.total }}
                     <template v-if="protocol.amount">AZN</template>
                  </strong>
               </div>
            </div>
            <div v-if="!history" class="protocol-details-button__actions">

               <!--               <protocol-files-->
               <!--                  v-if="!history"-->
               <!--                  :mediaIsOpen="mediaIsOpen || mobileMediaIsOpen"-->
               <!--                  :protocol="protocol"-->
               <!--                  @mediaClosed="mediaIsOpen = false"-->
               <!--                  @mediaOpened="openMedia"-->
               <!--                  @mobileMediaOpened="openMobileMedia"-->
               <!--                  @mobileMediaClosed="mobileMediaClose"-->
               <!--               />-->

               <button :class="['btn btn--light-outline full-width', { pending }]"
                       style="min-height: 52px;border-radius: 8px"
                       type="button" @click="openFiles">
                  {{ $t('watch_files') }}
               </button>


               <a v-if="protocol.isSelected && !history && !mediaIsOpen"
                  :class="[{pending}]"
                  :href="getPayLink(protocol)"
                  class="btn btn--green"
                  rel="noopener"
                  style="margin-left: 8px" target="_blank">
                  {{ $t('pay_online') }}
               </a>

            </div>
         </div>

         <div v-else>
            <template v-if="pending">
               <loader/>
            </template>
            <template v-else>
               <div v-if="slides.main" v-touch:swipe.top="handleSwipeTop" class="inner-gallery-lightbox">

                  <!--mobile-->
                  <template v-if="isMobileBreakpoint">
                     <!--                     <FsLightbox-->
                     <!--                        :key="lightboxKey"-->
                     <!--                        :disableThumbs="true"-->
                     <!--                        :onBeforeClose="onBeforeClose"-->
                     <!--                        :onClose="refreshLightbox"-->
                     <!--                        :onSlideChange="changeLightboxSlide"-->
                     <!--                        :slide="currentSlide + 1"-->
                     <!--                        :sources="slides.main"-->
                     <!--                        :toggler="toggleFsLightbox"-->
                     <!--                        :types="slides.types"-->
                     <!--                     />-->
                  </template>


                  <template v-if="!isMobileBreakpoint">
                     <transition-group name="fade">
                        <template v-if="showSliderTemplate">

                           <div :key="0" class="blur-bg">
                              <img v-if="slides.types[currentSlide] === 'image'"
                                   :src="$withBaseUrl(slides.thumbs[currentSlide])"
                                   alt=""/>
                           </div>


                           <!--                  desktop-->
                           <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">
                              <images-slider
                                 :current-slide="currentSlide"
                                 :has-sidebar="true"
                                 :slides="slides"
                                 isProtocol
                                 @close="closeLightbox"
                                 @slide-change="currentSlide = $event"
                              >

                                 <template #sidebar>
                                    <protocol-slider-info :protocol="protocol"/>
                                 </template>
                              </images-slider>
                           </div>
                        </template>
                     </transition-group>
                  </template>


               </div>
            </template>
         </div>


      </modal-popup>

      <template v-if="slides?.main?.length && isMobileBreakpoint && mediaIsOpen">
         <FsLightbox
            :key="lightboxKey"
            :disableThumbs="true"
            :onBeforeClose="onBeforeClose"
            :onClose="refreshLightbox"
            :onSlideChange="changeLightboxSlide"
            :slide="currentSlide + 1"
            :sources="slides.main"
            :toggler="toggleFsLightbox"
            :types="slides.types"
         />
      </template>
   </div>
</template>

<script>
import ProtocolPayment from "~/components/garage/ProtocolPayment";
import ProtocolFiles from "~/components/garage/ProtocolFiles";
import {mapGetters, mapActions} from 'vuex';

import FsLightbox from 'fslightbox-vue';

import ImagesSlider from '~/components/elements/ImagesSlider';
import ProtocolImagesSlider from "~/components/elements/ProtocolImagesSlider";
import ProtocolSliderInfo from "~/components/garage/ProtocolSliderInfo";

export default {
   props: {
      protocol: Object,
      history: Boolean,
   },
   components: {
      ProtocolPayment,
      ProtocolFiles,
      ProtocolImagesSlider,
      FsLightbox,
      ImagesSlider,
      ProtocolSliderInfo,
   },
   data() {
      return {
         showProtocolDetails: false,
         pending: false,
         mediaIsOpen: false,
         mobileMediaIsOpen: false,
         loading: false,
         toggleFsLightbox: false,
         showLightbox: false,
         showImagesSlider: false,
         lightboxKey: 0,
         currentSlide: 0,
         hideButton: false,
      }
   },
   computed: {
      ...mapGetters({
         files: 'garage/protocolFiles'
      }),
      modalClasses() {
         if (!this.isMobileBreakpoint && this.mediaIsOpen) {
            return 'background-transparent full-screen'
         } else if (!this.isMobileBreakpoint && !this.mediaIsOpen) {
            return 'wider'
         } else if (this.isMobileBreakpoint && this.mediaIsOpen) {
            return 'full-screen'
         }

      },
      filteredProtocol() {
         return {
            pay_status: this.protocol.can_pay,
            car_number: this.protocol.car_number,
            fined_fullname: this.protocol.fullname,
            protocol_amount: this.protocol.amount || this.$t('dont_have'),
            date_decided: this.protocol.decision_date || 'no_decision',
            date: this.protocol.action_date,
            protocol_took_place: this.protocol.address,
            protocol_article: this.protocol.law_item,
         }
      },


      showSliderTemplate() {
         if (this.isMobileBreakpoint) {
            return this.showLightbox
         } else {
            return this.showImagesSlider
         }
      },

      slides() {
         let thumbs = [], main = [], types = [];
         let hasVideo = !this.files.videoError && this.files.video?.url;
         let hasImages = this.files.data?.length > 0;
         if (!hasVideo && !hasImages) return [];
         if (hasVideo) {
            main.push(this.files.video.url);
            thumbs.push(''); // this.files.video.thumbnail
            types.push('video');
         }
         if (hasImages) {
            main = [...main, ...this.files.data.map(img => img.src)];
            thumbs = [...thumbs, ...this.files.data.map(img => img.src)];
            types = [...types, ...this.files.data.map(_ => 'image')];
         }
         return {thumbs, main, types};
      }
   },
   methods: {
      ...mapActions({
         getProtocolFiles: 'garage/getProtocolFiles'
      }),
      showPaymentModal() {
         this.showProtocolDetails = false;
         this.$emit('showPaymentModal', true)
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },
      openMedia() {
         this.mediaIsOpen = true;
      },
      openMobileMedia() {
         // this.mobileMediaIsOpen = true;
         return
      },
      mobileMediaClose() {
         this.mediaIsOpen = false;
         this.mobileMediaIsOpen = false;
      },


      //   protocol files
      async openFiles() {


         if (this.files.din_id === this.protocol.din_id) {
            this.openLightbox();
            return;
         }
         if (this.pending) return;
         this.pending = true;

         try {
            const res = await this.getProtocolFiles({din_id: this.protocol.din_id});
            this.pending = false;
            if (this.isMobileBreakpoint) {
               this.showProtocolDetails = false;
            }
            if (res.status === 'success') {
               this.openLightbox();
            }

         } catch (err) {
            this.pending = false;
         }
      },
      openLightbox() {

         this.mediaIsOpen = true;
         if (this.isMobileBreakpoint) {
            this.showProtocolDetails = false;
         }
         this.currentSlide = 0;
         if (this.isMobileBreakpoint) {
            this.showLightbox = true;
            this.toggleFsLightbox = !this.toggleFsLightbox;
         } else {
            setTimeout(() => {
               this.showImagesSlider = true;
            }, 1000)
         }
         this.setBodyOverflow('hidden');


      },
      refreshLightbox() {
         this.onBeforeClose();
         this.lightboxKey++;
      },
      onBeforeClose() {
         this.mediaIsOpen = false;
         this.showLightbox = false;
         // this.setBodyOverflow('scroll');
         // this.hideButton = false

      },
      changeLightboxSlide(fsBox) {
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         this.mediaIsOpen = false;
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         }
         if (!this.isMobileBreakpoint) {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }

      },
      handleSwipeTop() {
         if (document?.body?.classList.contains('zooming')) return;
         this.closeLightbox();
      },
   },
   watch: {
      breakpoint() {
         this.showImagesSlider = false;
         if (this.showSlider)
            this.updateTouchEvents();
         this.refreshLightbox();
      }
   }
}
</script>

