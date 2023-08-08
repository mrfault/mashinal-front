<template>
   <div style="width: calc(50% - 6px)">
      <button :class="['btn btn--light-outline full-width',{'d-none': hideButton }, { pending }]"
              style="min-height: 52px;border-radius: 8px"
              type="button" @click="openFiles">
         {{ $t('watch_files') }}
      </button>
      <template v-if="pending">
         <loader/>
      </template>
      <template v-else>
         <div v-if="slides.main" v-touch:swipe.top="handleSwipeTop" class="inner-gallery-lightbox">

            <template v-if="isMobileBreakpoint">
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

            <transition-group name="fade">
               <template v-if="(showLightbox && isMobileBreakpoint) || (!isMobileBreakpoint && showImagesSlider)">
                  <div :key="0" class="blur-bg">
                     <img v-if="slides.types[currentSlide] === 'image'" :src="$withBaseUrl(slides.thumbs[currentSlide])"
                          alt=""/>
                  </div>
                  <div v-if="!isMobileBreakpoint" :key="1" class="blur-bg_slider">
                     <protocol-images-slider
                        :current-slide="currentSlide"
                        :has-sidebar="true"
                        :slides="slides"
                        isProtocol
                        @close="closeLightbox"
                        @slide-change="currentSlide = $event"
                     >

                        <template #sidebar>
                           <div>
                              <div class="card garage_protocol-info">
                                 <div class="w-100">
                                    <div class="garage_protocol-titles">
                                       <h2 class="ma-subtitle--lg" style="margin-bottom: 12px">{{
                                             $t('penalty_info')
                                          }}</h2>
                                    </div>
                                    <div class="vehicle-specs">
                                       <div class="">
                                          <div
                                             class="ma-penalties__card--body__penalties--item bottom-border w-100"
                                          >
                                             <div class="ma-left">
                                                <div class="ma-left__content">
                                                   <p>{{ $t('number_plate_of_vehicle') }}</p>
                                                </div>
                                             </div>
                                             <div class="ma-right" style="padding-left: 24px; text-align: right;">
                                                <strong class="ma-right__amount">
                                                   {{ $readCarNumber(protocol.car_number) }}
                                                </strong>
                                             </div>
                                          </div>
                                          <div
                                             class="ma-penalties__card--body__penalties--item bottom-border w-100"
                                          >
                                             <div class="ma-left">
                                                <div class="ma-left__content">
                                                   <p>{{ $t('protocol_number') }}</p>
                                                </div>
                                             </div>
                                             <div class="ma-right" style="padding-left: 24px; text-align: right;">
                                                <strong class="ma-right__amount">
                                                   {{ getTitle(protocol) }}
                                                </strong>
                                             </div>
                                          </div>
                                          <div v-for="(specs, i) in mainSpecs(protocol, true)"
                                               :key="i + '6545'" class="">
                                             <template v-for="(spec, key) in specs">
                                                <div
                                                   v-if="spec"
                                                   class="ma-penalties__card--body__penalties--item bottom-border"
                                                >
                                                   <div v-if="spec" class="ma-left">
                                                      <div class="ma-left__content">
                                                         <p>{{ $t(key) }}</p>
                                                      </div>
                                                   </div>
                                                   <div class="ma-right" style="padding-left: 24px; text-align: right;">
                                                      <strong v-if="key == 'protocol_amount' " class="ma-right__amount">
                                                         {{ spec }} AZN
                                                      </strong>
                                                      <strong v-else-if="key == 'pay_status' && spec == false"
                                                              class="ma-right__amount"
                                                              style="color: #039855">
                                                         {{ $t('already_paid') }}
                                                      </strong>
                                                      <strong v-else-if="key == 'pay_status' && spec == true"
                                                              class="ma-right__amount"
                                                              style="color: #F81734">
                                                         {{ $t('not_paid') }}
                                                      </strong>
                                                      <strong v-else class="ma-right__amount">
                                                         {{ $t(spec) }}
                                                      </strong>
                                                   </div>
                                                </div>
                                             </template>
                                          </div>
                                       </div>
                                    </div>
                                    <div v-if="protocol.can_pay && protocol.total > 0">

                                       <div
                                          class="ma-penalties__card--body__penalties--item no-borders  mt-0"
                                          style="padding-bottom: 32px;"
                                       >
                                          <h6 class="ma-subtitle--md">{{ $t('total') }}</h6>
                                          <h6 class="ma-subtitle--md">
                                             {{ protocol.total }} AZN
                                          </h6>
                                       </div>

                                       <a :href="getPayLink(protocol)" class="btn btn--green full-width"
                                          rel="noopener"
                                          target="_blank">
                                          {{ $t('pay_online') }}
                                       </a>

                                    </div>
                                 </div>
                              </div>
                           </div>
                        </template>
                     </protocol-images-slider>

                  </div>
               </template>
            </transition-group>
         </div>
      </template>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import FsLightbox from 'fslightbox-vue';

import ImagesSlider from '~/components/elements/ImagesSlider';
import ProtocolImagesSlider from "~/components/elements/ProtocolImagesSlider";

export default {
   props: {
      protocol: {}
   },
   components: {
      ProtocolImagesSlider,
      FsLightbox,
      ImagesSlider,

   },
   data() {
      return {
         pending: false,
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

      async openFiles() {
         this.hideButton = true;
         this.$emit('mediaOpened', true);
         if (this.files.din_id === this.protocol.din_id) {
            this.openLightbox();
            return;
         }
         if (this.pending) return;
         this.pending = true;
         try {
            const res = await this.getProtocolFiles({din_id: this.protocol.din_id});
            this.pending = false;
            if (res.status === 'success') {
               this.openLightbox();


            }

         } catch (err) {
            this.pending = false;
         }
      },
      // lightbox
      openLightbox() {


         this.currentSlide = 0;
         if (this.isMobileBreakpoint) {
            this.showLightbox = true;
            this.toggleFsLightbox = !this.toggleFsLightbox;
         } else {
            this.$emit("closeDetailsWindow", true);
            setTimeout(() => {
               this.showImagesSlider = true;
            }, 1000)
         }
         this.setBodyOverflow('hidden');


      },
      refreshLightbox() {
         this.onBeforeClose();
         this.lightboxKey++;
         this.$emit('mediaClosed', true)
      },
      onBeforeClose() {
         this.showLightbox = false;
         this.setBodyOverflow('scroll');
      },
      changeLightboxSlide(fsBox) {
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         console.log("this.$emit('mediaClosed', true)")
         this.hideButton = false;
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         } else {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }
         this.$emit('mediaClosed', true)
      },
      handleSwipeTop() {
         if (document?.body?.classList.contains('zooming')) return;
         this.closeLightbox();
      },
      getTitle(protocol) {
         return `${protocol.protocol_series || ''}${protocol.protocol_number}`;
      },
      mainSpecs(protocol, unite) {
         let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

         return this.$dataRows({
            pay_status: this.history ? this.$t('already_paid') : '',
            car_number: !unite && protocol.car_number,
            fined_fullname: protocol.fullname,
            point: protocol.point,
            fine: protocol.amount && `${protocol.amount} ₼`,
            discount: protocol.discount && `${protocol.discount} ₼`,
            penalty: protocol.penalty && `${protocol.penalty} ₼`,
            total_amount: !unite && protocol.total && `${protocol.total} ₼`,
            speed_max: protocol.speed_max && `${protocol.speed_max} ${this.$t('char_kilometre_hour')}`,
            speed_real: protocol.speed_real && `${protocol.speed_real} ${this.$t('char_kilometre_hour')}`,

            status: protocol.has_decision !== undefined && (protocol.has_decision ? this.$t('has_decision') : this.$t('no_decision')),
            date_decided: getDate(protocol.decision_date),
            date_expire: getDate(protocol.expiry_date),
            date: getDate(protocol.date) || getDate(protocol.action_date),
            protocol_took_place: unite && protocol.address
         }, this.isMobileBreakpoint || unite);
      },
      restSpecs(protocol) {
         return {
            protocol_took_place: protocol.address,
            protocol_article: protocol.law_item,
         }
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
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

<style lang="scss" scoped>
.ma-left__content {
   p {
      font: 400 16px/20px 'TTHoves';
   }
}


.ma-penalties__card--body__penalties--item {
   padding-left: 0;
   padding-right: 0;
}
</style>
