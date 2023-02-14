<template>
    <div class="images-slider">
        <div class="container wider">
            <div class="toolbar">
                <!--            <span>{{ currentSlide + 1 }} / {{ slides.main.length }}</span>-->
                <span class="cursor-pointer" @click.stop="$emit('close')"
                      style="background: #081a3e94; padding: 5px; border-radius: 5px; font-size: 13px; display: flex;">
        <icon name="cross"/>
                    <!-- <inline-svg src="/icons/cross.svg" height="14" /> -->
      </span>
            </div>

            <div :class="['row', { 'has-sidebar': hasSidebar }]" @click.stop>
                <div class="col-auto">
<!--                    <button-->
<!--                        id="slider-prev"-->
<!--                        class="btn"-->
<!--                        @click.stop="thumbsPrev"-->
<!--                        v-if="slides.main.length > 6"-->
<!--                    >-->
<!--                        <icon name="chevron-up"/>-->
<!--                    </button>-->
                    <div
                        class="swiper-container"
                        v-swiper:thumbsSwiper="thumbOps"
                        ref="thumbsSwiper"
                    >
                        <div class="swiper-wrapper">
                            <div
                                class="swiper-slide"
                                :key="index"
                                v-for="(slide, index) in (slides.thumbs || slides.main)"
                            >
                                <div
                                    @click="changeSlide(index)"
                                    :class="[
                                        'swiper-thumb-bg',
                                        {
                                          [`${slides.types && slides.types[index] ? (slides.types[index]+'-play'):''}`]:
                                            slides.types &&
                                            ['youtube', 'video'].includes(slides.types[index]),
                                        },
                                      ]"
                                    :style="slide ? { backgroundImage: `url('${slide}')` } : {}"
                                ></div>
                            </div>
                        </div>
                    </div>
<!--                    <button-->
<!--                        id="slider-next"-->
<!--                        class="btn"-->
<!--                        @click.stop="thumbsNext"-->
<!--                        v-if="slides.main.length > 6"-->
<!--                    >-->
<!--                        <icon name="chevron-down"/>-->
<!--                    </button>-->
                </div>

                <div class="col-auto">
                    <div class="position-relative">
                        <div
                            id="images-swiper"
                            class="swiper-container"
                            v-swiper:imagesSwiper="swiperOps"
                            ref="imagesSwiper"
                            :auto-update="false"
                        >
                            <div class="swiper-wrapper">
                                <div
                                    class="swiper-slide"
                                    :key="index"
                                    v-for="(slide, index) in slides.main"
                                >
                                    <div class="swiper-slide-bg" @click.stop>
                                        <div
                                            class="iframe"
                                            v-if="slides.types && slides.types[index] === 'youtube'"
                                        >
                                            <iframe
                                                v-if="showIframe"
                                                :src="`https://www.youtube.com/embed/${
                          slide.split('?v=')[1]
                        }`"
                                                frameborder="0"
                                                allowfullscreen
                                            ></iframe>
                                        </div>
                                        <div
                                            class="video"
                                            v-else-if="
                        slides.types && slides.types[index] === 'video'
                      "
                                        >
                                            <video ref="video" controls>
                                                <source :src="slide"/>
                                            </video>
                                        </div>
                                        <div
                                            class="position-relative"
                                            style="width: 100%;overflow: hidden;"
                                            v-else-if="
                        slides.types && slides.types[index] === 'custom'
                      "
                                        >
                                            <no-ssr>
                                                <div v-if="announcement.interior_360" class="interior-switcher">
                                                    <form-switch class="interior-exterior-switcher" auto-width
                                                                 style="width: fit-content;pointer-events: all;"
                                                                 v-model="showInterior" :options="interiorOptions"/>
                                                </div>
                                                <interior360-viewer :url="announcement.interior_360"
                                                                    v-if="showInterior"/>
                                                <vue-three-sixty
                                                    @interiorChange="showInterior = !showInterior"
                                                    :show-interior="showInterior"
                                                    v-else
                                                    showZoom
                                                    disable-zoom
                                                    :amount="announcement.images_360.length"
                                                    buttonClass="d-none"
                                                    :files="announcement.images_360"
                                                />
                                            </no-ssr>
                                        </div>

                                        <template v-else>
                                            <img alt="" :src="slide" class="swiper-lazy"/>
                                            <!--                      <loader />-->
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="slider-overlay">
                            <div class="slider-overlay_middle">
                                <span class="d-flex justify-content-between">
                                  <button
                                      id="slider-prev"
                                      class="btn-transparent"
                                      @click.stop="slidePrev"
                                  >
                                    <!-- <icon name="chevron-left" /> -->
                                    <inline-svg src="/icons/chevron-left.svg" :height="14"/>
                                  </button>
                                  <button
                                      id="slider-next"
                                      class="btn-transparent"
                                      @click.stop="slideNext"
                                  >
                                    <!-- <icon name="chevron-right" /> -->
                                    <inline-svg src="/icons/chevron-right.svg" :height="14"/>
                                  </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-auto" v-if="hasSidebar">
                    <slot name="sidebar" />

                    <template v-if="((!this.isMobileBreakpoint && (announcement.status == 1 || announcement.has_monetization)) ||needToPay)">
                        <div :class="{ 'mb-2 mb-lg-3': !needToPay }">
                            <pay-announcement-button
                                :announcement="announcement"
                                v-if="needToPay"
                            />

                            <monetization-stats-button
                                :announcement="announcement"
                                v-else-if="!this.isMobileBreakpoint && announcement.has_monetization && $auth.loggedIn && $auth.user.id === announcement.user_id && !needToPay"
                            />

                            <monetization-button
                                :announcement="announcement"
                                @openModal="openModal"
                            />
                        </div>
                    </template>

                    <div class="btns">
                        <template v-if="announcement.status === 1">
                            <add-favorite
                                :text="'Seçilmiş et'"
                                :img="true"
                                :announcement="announcement"
                            />

                            <add-comparison
                                :text="'Müqayisə et'"
                                :img="true"
                                :id="announcement.id_unique"
                                v-if="announcement.car_catalog"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Interior360Viewer from "~/components/Interior360Viewer";
import AddFavorite from "~/components/announcements/AddFavorite.vue";
import AddComparison from "~/components/announcements/AddComparison.vue";
import {mapGetters} from "vuex";
import MonetizationButton from "~/components/announcements/MonetizationButton.vue";
import MonetizationStatsButton from "~/components/announcements/MonetizationStatsButton.vue";
import PayAnnouncementButton from "~/components/announcements/PayAnnouncementButton.vue";

export default {
    components: {
        Interior360Viewer,
        AddFavorite,
        AddComparison,
        MonetizationButton,
        MonetizationStatsButton,
        PayAnnouncementButton
    },
    computed: {
        ...mapGetters(['announcement']),

        needToPay() {
            return (
                this.announcement.status == 2 &&
                this.announcement.system_paid_announce &&
                !this.announcement.system_paid_announce.is_paid
            )
        },
    },
    props: {
        slides: {},
        announcement: {},
        currentSlide: Number,
        hasSidebar: Boolean,
    },
    data() {
        return {
            showFirst: false,
            showInterior: false,
            zoom: 0,
            swiperOps: {
                initialSlide: this.currentSlide,
                allowTouchMove: false,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                },
                loop: false,
                preloadImages: false,
                lazy: {
                    loadPrevNext: false,
                    preloaderClass: 'loader',
                },
                keyboard: {
                    enabled: true,
                },
            },
            thumbOps: {
                initialSlide: this.currentSlide,
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 20,
                keyboard: {
                    enabled: true,
                    pageUpDown: true,
                },
            },
            showIframe: true,
        }
    },
    methods: {
        slidePrev() {
            if (this.imagesSwiper.activeIndex === 0) {
                this.imagesSwiper.slideTo(this.slides.main.length - 1)
            } else this.imagesSwiper.slidePrev()

            this.updateTouchEvents()
        },
        slideNext() {
            if (this.slides.main.length - 1 === this.imagesSwiper.activeIndex) {
                this.imagesSwiper.slideTo(0)
            } else this.imagesSwiper.slideNext()

            this.updateTouchEvents()
        },
        thumbsPrev() {
            this.thumbsSwiper.slidePrev()
        },
        updateTouchEvents() {
            if (this.imagesSwiper.activeIndex > 0) {
                this.imagesSwiper.allowTouchMove = true
            } else {
                this.imagesSwiper.allowTouchMove = false
            }
        },
        thumbsNext() {
            this.thumbsSwiper.slideNext()
        },
        changeSlide(index) {
            this.imagesSwiper.slideTo(index, 0)
        },
        handleEscapeKey(e) {
            if (e.key === 'Escape') {
                this.$emit('close')
            }
            // if(e.key === "ArrowLeft") {
            //   this.slidePrev();
            //   //Left arrow pressed
            // }

            if (e.key === "ArrowRight" && this.slides.main.length - 1 === this.imagesSwiper.activeIndex) {
                if (this.showFirst) {
                    this.imagesSwiper.slideTo(0);
                    this.showFirst = false;
                } else {
                    this.showFirst = true;
                }
            }

            if (e.key === "ArrowLeft" && this.imagesSwiper.activeIndex === 0) {
                if (this.showFirst) {
                    this.imagesSwiper.slideTo(this.slides.main.length - 1)
                    this.showFirst = false;
                } else {
                    this.showFirst = true;
                }
            }
        },
    },
    mounted() {
        window.addEventListener('keydown', this.handleEscapeKey)
        this.$nextTick(() => {
            this.imagesSwiper.thumbs.swiper = this.thumbsSwiper
            this.imagesSwiper.on('slideChange', () => {
                this.showIframe = false
                this.$refs.video?.[0]?.pause()
                this.$nextTick(() => {
                    this.showIframe = true

                    this.$emit('slide-change', this.imagesSwiper.realIndex)
                    this.updateTouchEvents()


                })
            })
            let swiperTouchStartX
            this.imagesSwiper.on('touchStart', (e) => {
                if (e.type === 'touchstart') {
                    swiperTouchStartX = e.touches[0].clientX
                } else {
                    swiperTouchStartX = e.clientX
                }
            })

            this.imagesSwiper.on('touchEnd', (e) => {
                const tolerance = 100
                const totalSlidesLen = this.imagesSwiper.slides.length

                const diff = (() => {
                    if (e.type === 'touchend') {
                        return e.changedTouches[0].clientX - swiperTouchStartX
                    } else {
                        return e.clientX - swiperTouchStartX
                    }
                })()

                if (this.imagesSwiper.isBeginning && diff >= tolerance) {
                    //this.gallerySwiper.slideTo(totalSlidesLen - 1);
                } else if (this.imagesSwiper.isEnd && diff <= -tolerance) {
                    setTimeout(() => {
                        this.imagesSwiper.slideTo(0)
                    }, 1)
                }
            })
        })
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleEscapeKey)
    },
}
</script>
<style>
.interior-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    height: 40px;
    min-width: 76px;
    border-radius: 4px;
    color: #fff;
    background-color: #246EB2;
    padding: 0 14px;
}

.interior-switcher {
    position: absolute;
    top: 10px;
    left: 75px;
    z-index: 11233;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32px;
    font-size: 16px;
    text-align: center;
}
</style>
