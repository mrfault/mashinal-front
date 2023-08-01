<template>
   <div style="width: calc(50% - 6px)">
      <button :class="['btn btn--light-outline full-width',{'d-none': hideButton }, { pending }]" type="button" @click="openFiles" style="min-height: 52px;border-radius: 8px">
         {{ $t('watch_files') }}
      </button>
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
                     @close="closeLightbox"
                     @slide-change="currentSlide = $event"
                  >

                     <template #sidebar>
                        <div class="card garage_protocol-info">
                           <div class="garage_protocol-titles">
                              <h3 class="text-normal">{{ $readCarNumber(protocol.car_number) }}</h3>
                              <h3 class="text-normal text-dark-blue-2">{{ getTitle(protocol) }}</h3>
                              <hr/>
                           </div>
                           <div class="vehicle-specs">
                              <div class="row">
                                 <div v-for="(specs, i) in mainSpecs(protocol, true)"
                                      :key="i + '6545'" class="col">
                                    <ul>
                                       <template v-for="(spec, key) in specs">
                                          <li v-if="spec + 218" :key="key + '1546786'">
                                             <span class="w-auto">{{ $t(key) }}</span>
                                             <span>{{ spec }}</span>
                                          </li>
                                       </template>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                           <template v-if="protocol.can_pay && protocol.total > 0">
                              <hr class="mb-auto"/>
                              <div class="row">
                                 <div class="col-6">
                                                  <span class="total-price">
                                                    <span>{{ $t('total') }}</span>
                                                    <strong>{{ protocol.total }} ₼</strong>
                                                  </span>
                                 </div>
                                 <div class="col-6">
                                    <a :href="getPayLink(protocol)" class="btn btn--green full-width"
                                       rel="noopener"
                                       target="_blank">
                                       {{ $t('pay_online') }}
                                    </a>
                                 </div>
                              </div>
                           </template>
                        </div>
                     </template>
                  </protocol-images-slider>

               </div>
            </template>
         </transition-group>
      </div>
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
      ImagesSlider
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
         this.$emit('mediaOpened',true);
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
      },
      onBeforeClose() {
         this.showLightbox = false;
         this.setBodyOverflow('scroll');
      },
      changeLightboxSlide(fsBox) {
         this.currentSlide = fsBox.stageIndexes.current;
      },
      closeLightbox() {
         this.hideButton = false;
         if (this.isMobileBreakpoint) {
            if (this.showLightbox) {
               this.toggleFsLightbox = !this.toggleFsLightbox;
            }
         } else {
            this.setBodyOverflow('scroll');
            this.showImagesSlider = false;
         }
         this.$emit('mediaClosed',true)
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
