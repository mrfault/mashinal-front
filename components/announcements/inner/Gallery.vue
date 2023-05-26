<template>
    <div class="inner-gallery">
        <div class="position-relative">
            <div
                class="swiper-container"
                v-swiper:gallerySwiper="swiperOps"
                ref="gallerySwiper"
                v-if="showSlider"
            >
                <div class="swiper-wrapper">
                    <div
                        class="swiper-slide"
                        :key="index"
                        v-for="(slide, index) in slides.main"
                    >
                        <div
                            style="width: 100%; height: 100%"
                            v-if="
                                index === 0 &&
                                announcement.images_360 &&
                                announcement.images_360.length
                              "
                        >
                            <div class="position-relative" style="height: 100%">
                                <no-ssr>
                                    <Interior360Viewer :url="announcement.interior_360" v-if="showInterior"/>
                                    <vue-three-sixty
                                        v-else
                                        :amount="announcement.images_360.length"
                                        buttonClass="d-none"
                                        disableZoom
                                        :files="announcement.images_360"
                                    />
                                </no-ssr>
                            </div>
                        </div>

                        <div
                            v-else
                            :class="[
                                'swiper-slide-bg',
                                { 'youtube-play': showYtVideo(index) },
                              ]"
                            :style="`background-image:url(${showYtVideo(index) ? getYtVideoImage('hq') : slide}?width=848)`"
                        >
                            <!--              <loader />-->
                        </div>
                    </div>
                </div>
            </div>

            <div class="gallery-overlay" v-if="showSlider">
                <div class="gallery-overlay_top d-flex">
                    <template v-if="where === 'announcement'">
                        <form-switch
                            class="interior-exterior-switcher"
                            v-if="showInteriorCondition"
                            auto-width style="width: fit-content; pointer-events: all;"
                            v-model="showInterior"
                            :options="interiorOptions"
                        />
                    </template>
                </div>
                <div class="gallery-overlay_middle">
                    <span class="d-flex justify-content-between">
                        <button id="gallery-prev" class="btn-sq" @click.stop="slidePrev">
                          <!-- <inline-svg src="/icons/chevron-left.svg" :height="25"/> -->
                          <icon name="chevron-left"/>
                        </button>
                        <button id="gallery-next" class="btn-sq" @click.stop="slideNext">
                          <icon name="chevron-right"/>
                            <!-- <inline-svg src="/icons/chevron-right.svg" :height="25" /> -->
                        </button>
                    </span>
                </div>
                <div class="gallery-overlay_bottom">
                    <template v-if="where === 'announcement'">
                        <div class="gallery-overlay_bottom--left">
                            <div class="badge" v-if="announcementSpecs[4]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#32B878"/>
                                    <path d="M11.6505 8.51716H8.74377C8.12792 8.51716 7.6269 9.01818 7.6269 9.634V14.3812C7.6269 14.865 7.23472 15.2572 6.75095 15.2572C6.26718 15.2572 5.875 14.865 5.875 14.3812V9.634C5.875 8.05217 7.16194 6.76526 8.74377 6.76526H11.6505L11.3806 6.49535C11.0385 6.15327 11.0385 5.59865 11.3806 5.25657C11.7227 4.91448 12.2773 4.91448 12.6194 5.25657L14.3846 7.02183C14.5489 7.1861 14.6412 7.40892 14.6412 7.64121C14.6412 7.8735 14.5489 8.09632 14.3846 8.26059L12.6194 10.0259C12.4483 10.1969 12.2242 10.2824 12 10.2824C11.7758 10.2824 11.5516 10.1969 11.3806 10.0259C11.0385 9.68377 11.0385 9.12915 11.3806 8.78706L11.6505 8.51716ZM17.249 8.75805C16.7653 8.75805 16.3731 9.15023 16.3731 9.634V14.3812C16.3731 14.9971 15.8721 15.4981 15.2562 15.4981H12.3495L12.6194 15.2281C12.9615 14.886 12.9615 14.3314 12.6194 13.9893C12.2773 13.6473 11.7227 13.6473 11.3806 13.9893L9.61537 15.7546C9.45108 15.9189 9.3588 16.1417 9.3588 16.374C9.3588 16.6063 9.45108 16.8291 9.61537 16.9934L11.3806 18.7586C11.5517 18.9297 11.7759 19.0152 12 19.0152C12.2242 19.0152 12.4484 18.9297 12.6194 18.7586C12.9615 18.4165 12.9615 17.8619 12.6194 17.5198L12.3495 17.2499H15.2562C16.8381 17.2499 18.125 15.963 18.125 14.3812V9.634C18.125 9.15023 17.7328 8.75805 17.249 8.75805Z" fill="white"/>
                                </svg>

                                <span>{{ $t('tradeable') }}</span>
                            </div>

                            <div class="badge" v-if="announcementSpecs[5]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#155EEF"/>
                                    <path d="M16.2109 7.78906L7.78906 16.2109" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8.69141 10.1953C9.52199 10.1953 10.1953 9.52199 10.1953 8.69141C10.1953 7.86082 9.52199 7.1875 8.69141 7.1875C7.86082 7.1875 7.1875 7.86082 7.1875 8.69141C7.1875 9.52199 7.86082 10.1953 8.69141 10.1953Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15.3086 16.8125C16.1392 16.8125 16.8125 16.1392 16.8125 15.3086C16.8125 14.478 16.1392 13.8047 15.3086 13.8047C14.478 13.8047 13.8047 14.478 13.8047 15.3086C13.8047 16.1392 14.478 16.8125 15.3086 16.8125Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <span>{{ $t(announcementSpecs[5].value) }}</span>
                            </div>

                            <div class="badge" v-if="announcement.images_360 && announcement.images_360.length > 0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="24" rx="12" fill="#F79009"/>
                                    <path d="M12 7.83334C7.39996 7.83334 3.66663 9.70001 3.66663 12C3.66663 13.8667 6.11663 15.4417 9.49996 15.975V18.6667L12.8333 15.3333L9.49996 12V14.275C6.87496 13.8083 5.33329 12.6917 5.33329 12C5.33329 11.1167 7.86663 9.50001 12 9.50001C16.1333 9.50001 18.6666 11.1167 18.6666 12C18.6666 12.6083 17.45 13.575 15.3333 14.1083V15.8167C18.275 15.175 20.3333 13.7083 20.3333 12C20.3333 9.70001 16.6 7.83334 12 7.83334Z" fill="white"/>
                                </svg>

                                <span>360 foto</span>
                             </div>

                            <div class="badge">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="#4B5565"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3946 6.42399C11.4965 6.44955 11.5924 6.49493 11.6768 6.55754C11.7612 6.62016 11.8324 6.69878 11.8864 6.78891C11.9403 6.87905 11.976 6.97894 11.9914 7.08287C12.0068 7.1868 12.0015 7.29275 11.976 7.39465L11.624 8.79999H13.976L14.424 7.00532C14.4756 6.79951 14.6069 6.62264 14.7889 6.51362C14.879 6.45964 14.9789 6.42394 15.0829 6.40856C15.1868 6.39318 15.2927 6.39842 15.3946 6.42399C15.4965 6.44955 15.5924 6.49494 15.6768 6.55755C15.7612 6.62017 15.8324 6.69879 15.8863 6.78892C15.9403 6.87906 15.976 6.97894 15.9914 7.08287C16.0068 7.1868 16.0015 7.29275 15.976 7.39465L15.624 8.79999H17.6C17.8121 8.79999 18.0156 8.88427 18.1657 9.0343C18.3157 9.18433 18.4 9.38781 18.4 9.59999C18.4 9.81216 18.3157 10.0156 18.1657 10.1657C18.0156 10.3157 17.8121 10.4 17.6 10.4H15.224L14.424 13.6H16C16.105 13.6 16.2091 13.6207 16.3061 13.6609C16.4032 13.7011 16.4914 13.76 16.5657 13.8343C16.6399 13.9086 16.6989 13.9968 16.7391 14.0938C16.7793 14.1909 16.8 14.2949 16.8 14.4C16.8 14.505 16.7793 14.6091 16.7391 14.7061C16.6989 14.8032 16.6399 14.8914 16.5657 14.9657C16.4914 15.04 16.4032 15.0989 16.3061 15.1391C16.2091 15.1793 16.105 15.2 16 15.2H14.024L13.576 16.9933C13.552 17.0968 13.5076 17.1944 13.4455 17.2806C13.3834 17.3667 13.3047 17.4396 13.2141 17.4951C13.1235 17.5505 13.0228 17.5873 12.9178 17.6034C12.8128 17.6195 12.7057 17.6145 12.6026 17.5887C12.4996 17.563 12.4027 17.517 12.3176 17.4534C12.2326 17.3898 12.161 17.3099 12.1072 17.2183C12.0533 17.1268 12.0182 17.0254 12.0039 16.9202C11.9896 16.8149 11.9965 16.7079 12.024 16.6053L12.376 15.2H10.024L9.57598 16.9933C9.55199 17.0968 9.50763 17.1944 9.4455 17.2806C9.38337 17.3667 9.30471 17.4396 9.21411 17.4951C9.12351 17.5505 9.02277 17.5873 8.91779 17.6034C8.8128 17.6195 8.70566 17.6145 8.60262 17.5887C8.49958 17.563 8.4027 17.517 8.31763 17.4534C8.23257 17.3898 8.16102 17.3099 8.10715 17.2183C8.05329 17.1268 8.01819 17.0254 8.00391 16.9202C7.98963 16.8149 7.99645 16.7079 8.02397 16.6053L8.37598 15.2H6.39998C6.1878 15.2 5.98432 15.1157 5.83429 14.9657C5.68426 14.8156 5.59998 14.6122 5.59998 14.4C5.59998 14.1878 5.68426 13.9843 5.83429 13.8343C5.98432 13.6843 6.1878 13.6 6.39998 13.6H8.77597L9.57598 10.4H7.99998C7.7878 10.4 7.58432 10.3157 7.43429 10.1657C7.28426 10.0156 7.19998 9.81216 7.19998 9.59999C7.19998 9.38781 7.28426 9.18433 7.43429 9.0343C7.58432 8.88427 7.7878 8.79999 7.99998 8.79999H9.97597L10.424 7.00532C10.4495 6.90341 10.4949 6.80754 10.5575 6.72317C10.6201 6.6388 10.6988 6.56759 10.7889 6.51361C10.879 6.45962 10.9789 6.42392 11.0829 6.40855C11.1868 6.39317 11.2927 6.39842 11.3946 6.42399ZM11.224 10.4L10.424 13.6H12.7746L13.5746 10.4H11.224Z" fill="white"/>
                                </svg>

                                <span>VIN kodu yoxla</span>

                                <IconNovelties />
                            </div>

                            <span
                                class="btn-sq btn-sq--color-red active"
                                v-if="announcement.has_monetization"
                            >
                                 <icon name="speaker" v-tooltip="$t('ad_announcement')" />
                             </span>
                        </div>

                        <div class="gallery-overlay_bottom--right">
                            <!--              <add-complaint :announcement="announcement" />-->
                        </div>
                    </template>
                    <template v-else>
                        <add-comparison
                            :id="announcement.id_unique"
                            v-if="announcement.car_catalog"
                        />
                    </template>
                </div>
            </div>

            <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
                <template v-if="isMobileBreakpoint">
                    <FsLightbox
                        :zoomIncrement="0"
                        :toggler="toggleFsLightbox"
                        :sources="getSourcesFsLightbox"
                        :types="slides.types"
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
<!--                            <img-->
<!--                                :src="-->
<!--                                  showYtVideo(currentSlide)-->
<!--                                    ? getYtVideoImage('hq')-->
<!--                                    : $withBaseUrl(slides.main[currentSlide])-->
<!--                                "-->
<!--                                alt=""-->
<!--                            />-->
                        </div>
                        <div
                            class="blur-bg_announcement-info"
                            :key="1"
                            v-if="isMobileBreakpoint"
                        >
                            <div class="inner-gallery-lightbox-footer">
                                <template v-if="where === 'announcement'">
                                    <h3>{{ getAnnouncementTitle(announcement) }}</h3>
                                    <h4>{{ announcement.price }}</h4>
                                    <div class="row" v-if="announcement.status != 3">
                                        <div class="col" v-if="canSendMessage(announcement)">
                                            <chat-button
                                                :announcement="announcement"
                                                :className="'white-outline'"
                                            />
                                        </div>
                                        <div class="col">
                                            <call-button :phone="announcement.user.phone"/>
                                        </div>
                                    </div>
                                </template>
                                <template v-else-if="where === 'catalog'">
                                    <h3 v-html="title"></h3>
                                    <h4 v-html="subtitle"></h4>
                                </template>
                            </div>
                        </div>

                        <div class="blur-bg_slider" :key="2" v-else>
                            <images-slider
                                :announcement="announcement"
                                :current-slide="currentSlide"
                                :slides="slides"
                                :has-sidebar="where === 'announcement'"
                                @close="closeLightbox"
                                @slide-change="currentSlide = $event"
                            >
                                <template #sidebar v-if="where === 'announcement'">
                                    <slot />
                                </template>
                            </images-slider>
                        </div>
                    </template>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FsLightbox from 'fslightbox-vue'
import CallButton from '~/components/announcements/CallButton'
import ChatButton from '~/components/announcements/ChatButton'
import AddFavorite from '~/components/announcements/AddFavorite'
import AddComparison from '~/components/announcements/AddComparison'
import AddComplaint from '~/components/announcements/AddComplaint'
import ImagesSlider from '~/components/elements/ImagesSlider'
import Interior360Viewer from "~/components/Interior360Viewer";
import IconNovelties from "~/components/elements/IconNovelties.vue";

export default {
    props: {
        where: {
            type: String,
            default: 'announcement',
        },
        media: {},
        title: String,
        subtitle: String,
        showSlider: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        Interior360Viewer,
        FsLightbox,
        CallButton,
        ChatButton,
        AddFavorite,
        AddComparison,
        AddComplaint,
        ImagesSlider,
        IconNovelties
    },
    data() {
        return {
            showInterior: false,
            toggleFsLightbox: false,
            showImagesSlider: false,
            showLightbox: false,
            lightboxKey: 0,
            currentSlide: 0,
            swiperOps: {
                init: false,
                effect: 'fade',
                allowTouchMove: false,
                fadeEffect: {
                    crossFade: true,
                },
                loop: false,
                preloadImages: false,

            },
        }
    },

    methods: {
        switchInterior() {
            this.showInterior = !this.showInterior;
            this.lightboxKey++
            this.toggleFsLightbox = false
            setTimeout(() => {
                this.toggleFsLightbox = true;
            }, 1)
        },
        openLightbox(index) {
            if (index || index === 0) {
                this.currentSlide = index
            }
            if (this.isMobileBreakpoint) {
                this.showLightbox = true
                this.toggleFsLightbox = !this.toggleFsLightbox
            } else {
                this.showImagesSlider = true
            }
            this.setBodyOverflow('hidden')
        },
        refreshLightbox() {
            this.onBeforeClose()
            this.lightboxKey++
        },
        onBeforeClose() {
            this.showLightbox = false
            this.setBodyOverflow('scroll')
        },
        changeSlide(index) {
            if (!this.showSlider) return
            this.gallerySwiper.slideTo(index, 0)
        },
        slidePrev() {
            if (!this.showSlider) return
            if (this.gallerySwiper.activeIndex === 0) {
                this.gallerySwiper.slideTo(this.slides.main.length - 1)
            } else this.gallerySwiper.slidePrev()
            this.updateTouchEvents()
        },
        slideNext() {
            if (!this.showSlider) return
            if (this.slides.main.length - 1 === this.gallerySwiper.activeIndex) {
                this.gallerySwiper.slideTo(0)
            } else this.gallerySwiper.slideNext()
            this.updateTouchEvents()
        },
        changeLightboxSlide(fsBox) {
            this.currentSlide = fsBox.stageIndexes.current
            this.changeSlide(this.currentSlide)
        },
        getMediaByKey(media, key) {
            key = media[key] ? key : Object.keys(media)[0]
            return media[key] instanceof Array
                ? media[key].map((item) => this.$withBaseUrl(item))
                : []
        },
        closeLightbox() {
            if (this.isMobileBreakpoint) {
                if (this.showLightbox) {
                    this.toggleFsLightbox = !this.toggleFsLightbox
                }
            } else {

                this.showImagesSlider = false
            }
            this.setBodyOverflow('scroll')
        },
        handleSwipeTop() {
            if (document.body.classList.contains('zooming')) return
            //this.closeLightbox()
        },
        showYtVideo(index) {
            return this.announcement?.youtube_id && index === 1
        },
        getYtVideoImage(size) {
            return `https://img.youtube.com/vi/${this.announcement.youtube_id}/${size}default.jpg`
        },
        updateTouchEvents() {
            if (this.gallerySwiper.activeIndex > 0) {
                this.gallerySwiper.simulateTouch = this.isMobileBreakpoint
                this.gallerySwiper.allowTouchMove = this.isMobileBreakpoint
            } else {
                this.gallerySwiper.simulateTouch = false
                this.gallerySwiper.allowTouchMove = false
            }
        },
    },
    computed: {
        ...mapGetters(['announcement']),
        announcementSpecs() {
            const specs = [
                {key: 'years', value: this.announcement.year, class: 'car-year'},
                {key: 'region', value: this.announcement.region?.name[this.locale]},
                {key: 'country', value: this.announcement[`country_name_${this.locale}`], for: ['cars', 'commercial', 'moto']},
                {key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage', for: ['cars', 'commercial', 'moto']},
                {key: 'condition', value: (this.announcement.broken || this.announcement.status_id || this.announcement.beaten) && this.$t('bitie')},
                {key: 'guaranty', value: (this.announcement.in_garanty || this.announcement.guaranty) && this.$t('in_garanty')},
                {key: 'com_equip_type', value: this.commercialType, for: ['commercial']},
                {key: 'carcase', value: this.bodyType, for: ['cars']},
                {key: 'color2', value: this.color, for: ['cars', 'commercial', 'moto']},
                {key: 'engine', value: this.engineSpecs},
                {key: 'the_number_of_measures', value: this.tact, for: ['moto']},
                {key: 'cylinder_block', value: this.cylinderBlock, for: ['moto']},
                {key: 'fuel_type', value: this.fuelType, for: ['moto']},

                {key: 'box', value: this.box},
                {key: 'privod', value: this.gear},
                {key: 'type_of_brakes', value: this.brakeType, for: ['commercial']},
                {key: 'wheel_formula', value: this.wheelFormula, for: ['commercial']},
                {key: 'loading', value: this.loadingKg, for: ['commercial']},
                {key: 'number_of_axles', value: this.numberOfAxes, for: ['commercial']},
                {key: 'working_hours', value: this.announcement.moto_hours, for: ['commercial']},
                {key: 'com_truck_cabin', value: this.announcement.cabin_type?.name?.[this.locale], for: ['commercial']},
                {key: 'seat_count', value: this.announcement.seats, for: ['commercial']},
                {key: 'exhaust_class', value: this.exhaustClass, for: ['commercial']},
                {key: 'cab_suspension', value: this.cabinSuspension, for: ['commercial']},
                {key: 'chassis_suspension', value: this.chassisSuspension, for: ['commercial']},
                // { key: 'first_owner', value: (parseInt(this.announcement.owner_type || this.announcement.owners || this.announcement.owner)) ? this.$t('no') : this.$t('yes'), for: ['cars', 'commercial', 'moto'] },
                {key: 'customs', value: (this.announcement.customs_clearance || this.announcement.customed_id || this.announcement.customed) ? this.$t('not_cleared') : this.$t('cleared'), for: ['cars', 'commercial', 'moto']},
                {key: 'product_code', value: this.announcement.product_code, for: ['parts']},
                {key: 'category', value: this.announcement?.category?.name[this.locale], for: ['parts']},
                {key: 'sub_category', value: this.announcement?.sub_category?.name[this.locale], for: ['parts']},
                {key: 'brand_name', value: this.announcement?.brand?.name, for: ['parts']},
                {key: 'vin', value: this.announcement.show_vin && this.announcement.vin},
                {key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number},
                {key: 'exchange', value: (this.announcement.exchange_possible || this.announcement.tradeable) && this.$t('is_possible')},
                {key: 'credit', value: this.announcement.credit && this.$t('is_in_credit')},
                {key: 'condition', value: this.condition, for: ['parts']},
                {key: 'is_original', value: this.announcement.is_original ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'have_delivery', value: this.announcement.have_delivery ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'have_warranty', value: this.announcement.have_warranty ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'commercial_size', value: this.announcement.commercial_size}
            ];

            if (this.announcement.is_external_salon) {
                let index = specs.findIndex(item => item.key === 'region');
                delete specs[index]
            }
            let mergedKeys = [
                'shine_width', 'diameter', 'height'
            ];
            let mergedValues = {
                shine_width: '',
                height: '',
                diameter: ''
            };

            // Dynamic specs
            if (this.type === 'parts') {
                Object.keys(this.announcement.filters).forEach(filter => {
                    let value = this.announcement.filters[filter]

                    if (value) {
                        if (typeof value === 'boolean') {
                            value = value ? this.$t('yes') : this.$t('yes');
                        } else if (typeof value === 'object') {
                            value = this.$t(value.name)
                        }

                        if (mergedKeys.includes(filter)) {
                            mergedValues[filter] = value;
                        } else {
                            specs.push({
                                    key: filter.replace('capacity', 'battery_capacity'),
                                    value,
                                    for: ['parts']
                                }
                            )
                        }

                    }
                })
                if (mergedValues['shine_width'])
                    specs.push({
                        key: 'size',
                        value: mergedValues['shine_width'] + '/' + mergedValues['height'] + 'R' + mergedValues['diameter'],
                        for: ['parts']
                    })
                else if (mergedValues['diameter']) {
                    specs.push({
                        key: 'diameter',
                        value: mergedValues['diameter'],
                        for: ['parts']
                    })
                }
            }

            let filteredSpecs = specs.filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
            return this.brief ? filteredSpecs.slice(0, 5) : filteredSpecs;
        },
        showInteriorCondition() {
            return this.currentSlide === 0 &&
                this.announcement.images_360 &&
                this.announcement.images_360.length &&
                this.announcement.interior_360
        },
        getSourcesFsLightbox() {
            if (this.slides.types[0] === 'custom') {
                return [
                    {
                        component: this.showInterior ? 'interior360-viewer' : 'vue-three-sixty',
                        props: {
                            onFsLightBox: true,
                            url: this.announcement.interior_360,
                            files: this.announcement.images_360,
                            amount: this.announcement.images_360.length,
                            fromFsPopup: true,
                        },
                    },
                    ...this.slides.main.slice(1, this.slides.main.length),
                ]
            }
            return this.slides.main
        },

        slides() {
            let thumbs = [],
                main = [],
                types = [],
                hasVideo = false,
                has360 = false

            if (this.where === 'catalog') {
                thumbs = this.getMediaByKey(this.media, 'thumb')
                main = this.getMediaByKey(this.media, 'main')
            } else if (this.where === 'announcement') {
                let media = this.announcement.media
                if (media.length === 0) return []
                main = JSON.parse(JSON.stringify(media));
                if (this.announcement.youtube_id) {
                    hasVideo = true
                    thumbs.splice(1, 0, this.getYtVideoImage('hq'))
                    main.splice(
                        1,
                        0,
                        `https://www.youtube.com/watch?v=${this.announcement.youtube_id}`,
                    )
                }
                if (
                    this.announcement.images_360 &&
                    this.announcement.images_360.length
                ) {
                    thumbs.splice(0, 0, this.announcement.images_360[0])
                    main.splice(0, 0, this.announcement.images_360[0])
                    has360 = true
                }
                //360 here
            } else if (this.where === 'salon') {
                thumbs = this.media[1]
                main = this.media[0]
            }
            types = [...main.map((_) => 'image')]

            if (hasVideo) types.splice(1, 0, 'youtube')
            if (has360) types.splice(0, 0, 'custom')
            return {thumbs, main, types}
        },
    },
    watch: {
        breakpoint() {
            this.showImagesSlider = false
            if (this.showSlider) this.updateTouchEvents()
            this.refreshLightbox()
        },
    },
    mounted() {
        let swiperTouchStartX

        this.$nextTick(() => {
            this.$nuxt.$on('switchInterior', () => {
                this.switchInterior();
            })
            if (this.showSlider) {
                setTimeout(() => {
                    this.gallerySwiper.init()
                    this.gallerySwiper.on('slideChange', () => {
                        this.updateTouchEvents()
                        this.currentSlide = this.gallerySwiper.realIndex
                    })
                    this.gallerySwiper.on('touchStart', (e) => {
                        if (e.type === 'touchstart') {
                            swiperTouchStartX = e.touches[0].clientX
                        } else {
                            swiperTouchStartX = e.clientX
                        }
                    })

                    this.gallerySwiper.on('touchEnd', (e) => {
                        const tolerance = 100
                        const totalSlidesLen = this.gallerySwiper.slides.length

                        const diff = (() => {
                            if (e.type === 'touchend') {
                                return e.changedTouches[0].clientX - swiperTouchStartX
                            } else {
                                return e.clientX - swiperTouchStartX
                            }
                        })()

                        if (this.gallerySwiper.isBeginning && diff >= tolerance) {
                            //this.gallerySwiper.slideTo(totalSlidesLen - 1);
                        } else if (this.gallerySwiper.isEnd && diff <= -tolerance) {
                            setTimeout(() => {
                                this.gallerySwiper.slideTo(0)
                            }, 1)
                        }
                    })

                    this.gallerySwiper.on('click', (event) => {
                        this.openLightbox(this.currentSlide)
                    })
                    this.updateTouchEvents()
                }, 100)
            }

            if (this.showSlider)
                this.$nuxt.$on('show-gallery-slide', this.changeSlide)
            this.$nuxt.$on('show-lightbox', this.openLightbox)
        })
    },
    beforeDestroy() {
        if (this.showSlider) this.$nuxt.$off('show-gallery-slide', this.changeSlide)
        if (this.showImagesSlider || this.showLightbox) this.closeLightbox()
        this.$nuxt.$off('show-lightbox', this.openLightbox)
    },
}
</script>
<style lang="scss">
    @media only screen and (min-width: 1024px) {
        .inner-gallery .swiper-wrapper {
            height: 600px;
        }
    }

    .fslightbox-source {
        width: 100vw !important;
    }

    .inner-gallery .swiper-slide {

        display: flex;
        align-items: center;
    }
</style>
