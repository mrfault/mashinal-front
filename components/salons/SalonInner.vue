<template>
    <div class="salon-inner">
        <div :class="['profile-card salon-single-card overflow-hidden']">
            <div class="cover-with-avatar">
                <img
                    :class="['cover-with-avatar__img', {full : !salonSingle.gallery_thumbs.length}]"
                    :src="getCover(salonSingle.cover, salonSingle.type_id)"
                    alt="img"
                >

                <gallery
                    where="salon"
                    :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]"
                    :show-slider="false"
                />

                <div class="cover-with-avatar__gallery" v-if="salonSingle.gallery_thumbs">
                    <div
                        class="cover-with-avatar__gallery-item"
                        v-for="(item, i) in salonSingle.gallery_thumbs"
                        :style="{background: `url('${item}?width=108') center center / cover no-repeat`}"
                        @click="$nuxt.$emit('show-lightbox', i)"
                    >
                        <span v-if="i === 5">+ {{ salonSingle.gallery_thumbs.length - 6 }} şəkil</span>
                    </div>
                </div>

                <!--                <div-->
                <!--                    class="cover"-->
                <!--                    :style="{-->
                <!--                        backgroundImage: `url('${getCover(-->
                <!--                          salonSingle.cover,-->
                <!--                          salonSingle.type_id,-->
                <!--                        )}')`,-->
                <!--                    }"-->
                <!--                >-->
                <!--                    <img-->
                <!--                        class="avatar"-->
                <!--                        style="border-radius:0;"-->
                <!--                        :src="getLogo(salonSingle.logo)"-->
                <!--                        :alt="salonSingle.name || salonSingle.user.full_name"-->
                <!--                    />-->
                <!--                    <div class="socials" @click.stop>-->
                <!--                        <a-->
                <!--                            v-for="social in ['facebook', 'instagram']"-->
                <!--                            :key="social"-->
                <!--                            v-if="salonSingle[social]"-->
                <!--                            :href="salonSingle[social]"-->
                <!--                            rel="noopener"-->
                <!--                            target="_blank"-->
                <!--                        >-->
                <!--                            <icon :name="social"/>-->
                <!--                        </a>-->
                <!--                    </div>-->
                <!--                </div>-->

                <!--                <span class="edit-link items-total d-flex align-items-center">-->
                <!--                    <inline-svg v-if="salonSingle.type_id === 2" class="salon-car-icon" src="/images/settings.svg" />-->
                <!--                    <inline-svg v-else class="salon-car-icon" src="/images/car_icon.svg" />-->
                <!--                    <span :style="salonSingle.type_id === 2 ? 'margin-top:2px;': '' ">{{ salonSingle.announcements.total }}</span>-->
                <!--                </span>-->

                <nuxt-link
                    class="edit-link"
                    style="bottom: -5px;"
                    :to="$localePath(`/dashboard/${salonSingle.type_id}/settings`)"
                    @click.native="setPageRef($route.path)"
                    v-if="salonIsOwner(salonSingle)"
                >
                    <icon name="edit"/>
                </nuxt-link>
            </div>

            <div class="salon-inner__details">
                <div class="salon-inner__details-left">
                    <div
                        class="salon-inner__details-logo"
                        :style="`background: url('${getLogo(salonSingle.logo)}') center center / cover no-repeat`"
                    ></div>

                    <div class="salon-inner__details-info">
                        <h4 class="salon-inner__details-name">
                            <template v-if="!salonSingle.is_official">
                                {{ $t(isShop ? 'shop' : 'autosalon') }}
                                "{{ salonSingle.name || salonSingle.user.full_name }}"
                            </template>

                            <template v-else>{{ salonSingle.name || salonSingle.user.full_name }}</template>
                        </h4>

                        <h5 class="salon-inner__details-description">{{ salonSingle.description }}</h5>

                        <h5 class="salon-inner__details-address">
                            <icon name="placeholder"/>

                            <a
                                :href="`https://www.google.com/maps?q=${salonSingle.lat}%2C${salonSingle.lng}&ll=${salonSingle.lat}%2C${salonSingle.lng}&z=15`"
                                target="_blank"
                            >
                                {{ salonSingle.address }}
                            </a>
                        </h5>
                    </div>
                </div>

                <div class="salon-inner__details-right">
                    <div class="salon-inner__details-time">
                        <icon name="time"/>

                        <span
                            class="working-time"
                            v-html="
                            getWorkingDays(
                              salonSingle.working_days,
                              salonSingle.working_hours,
                            )
                          "
                        />
                    </div>

                    <div class="salon-inner__details-tels" v-if="salonSingle.phones && salonSingle.phones.length">
                        <icon name="phone-call"/>

                        <ul>
                            <li>
                                <a :href="`tel:${salonSingle.short_number}`">
                                    {{ salonSingle.short_number }}
                                </a>
                            </li>
                            <li v-for="(item, i) in salonSingle.phones.slice(0, 1)" :key="i">
                                <a :href="`tel:${item}`">
                                    +{{ normalize(item) }}
                                </a>
                            </li>
                        </ul>

                        <ul>
                            <li v-for="(item, i) in salonSingle.phones.slice(1, 10)" :key="i">
                                <a :href="`tel:${item}`">
                                    +{{ normalize(item) }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!--            <h2 class="title-with-line text-center">-->
            <!--                <span>-->
            <!--                    <template v-if="!salonSingle.is_official">-->
            <!--                      {{ $t(isShop ? 'shop' : 'autosalon') }} "{{ salonSingle.name || salonSingle.user.full_name }}"-->
            <!--                    </template>-->

            <!--                    <template v-else>{{ salonSingle.name || salonSingle.user.full_name }}</template>-->
            <!--                </span>-->
            <!--            </h2>-->

            <!--            <p v-if="salonSingle.description" class="mb-4"-->
            <!--               style="font-weight: 400;font-size: 15px;white-space: pre-line">-->
            <!--                {{ salonSingle.description }}-->
            <!--            </p>-->

            <!--            <div class="row align-items-lg-end profile_info">-->
            <!--                <div class="col-lg-12 mb-2 d-flex">-->

            <!--                    <div v-if="hasWorkingHours" class="ml-auto profile_info-details border-padding-none">-->
            <!--                        <icon name="time"/>-->
            <!--                        <span-->
            <!--                            class="working-time"-->
            <!--                            v-html="-->
            <!--                            getWorkingDays(-->
            <!--                              salonSingle.working_days,-->
            <!--                              salonSingle.working_hours,-->
            <!--                            )-->
            <!--                          "-->
            <!--                        />-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--                <div :class="`col-lg-12 mb-2`" v-if="salonSingle.address">-->
            <!--                    <div class="profile_info-details border-padding-none">-->
            <!--                        <icon name="placeholder"/>-->
            <!--                        <a :href="`https://www.google.com/maps?q=${salonSingle.lat}%2C${salonSingle.lng}&ll=${salonSingle.lat}%2C${salonSingle.lng}&z=15`"-->
            <!--                           target="_blank" style="font-weight: 500">-->
            <!--                            {{ salonSingle.address }}-->
            <!--                        </a>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->

            <!--            <template v-if="salonSingle.gallery_urls.length">-->
            <!--                <gallery-->
            <!--                    where="salon"-->
            <!--                    :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]"-->
            <!--                    :show-slider="false"-->
            <!--                />-->

            <!--                <thumbs-gallery where="salon" :media="salonSingle.gallery_thumbs"/>-->
            <!--            </template>-->
        </div>
        <!-- ------------------ -->

        <div class="text-with-line" v-if="salonSingle.announcements.data.length">
            <h2 class="row title-with-line d-flex justify-content-between full-width align-items-center position-relative">
                <span>{{ $t('auto_salon_ads') }}</span>

                <CustomDropdown
                    :items="filters"
                    @selected=""
                />
            </h2>
        </div>

        <grid
            v-if="salonSingle.announcements.data.length"
            :announcements="salonSingle.announcements.data"
            :paginate="$paginate(salonSingle.announcements)"
            :pending="pending"
            @pending="pending = true"
            @change-page="changePage"
            escape-duplicates
            :needAutoScroll="true"
        />
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

import {SalonsMixin} from '~/mixins/salons'
import Grid from '~/components/announcements/Grid'
import Gallery from '~/components/announcements/inner/Gallery'
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery'
import CustomDropdown from "~/components/elements/CustomDropdown.vue";

export default {
    components: {
        Grid,
        Gallery,
        ThumbsGallery,
        CustomDropdown
    },
    mixins: [SalonsMixin],
    data() {
        return {
            pending: false,
            filters: [
                { id: 1, name: 'Əvvəlcə ucuz' },
                { id: 2, name: 'Əvvəlcə baha' }
            ]
        }
    },
    computed: {
        ...mapGetters(['salonSingle']),

        hasWorkingHours() {
            return !!this.getWorkingDays(
                this.salonSingle.working_days,
                this.salonSingle.working_hours,
            )
        },
        messengers() {
            let msg = []
            let phonesLength = this.salonSingle.phones?.length || 0
            if (this.salonSingle.whatsapp?.slice(0, phonesLength).find((wp) => wp))
                msg.push('Whatsapp')
            if (this.salonSingle.telegram?.slice(0, phonesLength).find((tg) => tg))
                msg.push('Telegram')
            return msg.join('/')
        },
        isShop() {
            return this.routeName.includes('parts')
        },
    },
    methods: {
        ...mapActions(['getSalonById']),

        async changePage() {
            this.pending = true
            await this.getSalonById({
                slug: this.$route.params.id,
                page: this.$route.query.page || 1,
            })
            this.pending = false
            this.scrollTo('.profile_info')
        },
        scrollFunc() {
            setTimeout(() => {
                this.$scrollTo('.profile_info', 1000);
                // const el = this.$refs.scrollToMe
                // if (el) {
                //   el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                // }
            }, 1)
        },
        normalize(num) {
            return num.substr(0, 3) + ' ' + num.substr(3, 3) + ' ' + num.substr(6, 2) + ' ' + num.substr(8, 2) + ' ' + num.substr(10, 2);
        },
    },
    mounted() {
        this.scrollFunc()
    },
}
</script>

<style lang="scss">
.salon-inner {
    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    &__details {
        display: flex;
        margin-top: 20px;
        width: 100%;
        padding: 20px;
        border-radius: 12px;
        background-color: #FFFFFF;

        &-left {
            position: relative;
            display: flex;
            max-width: 714px;
            width: 100%;
            padding-right: 24px;

            &:before {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                width: 1px;
                height: 80%;
                background-color: #CDD5DF;
            }
        }

        &-right {
            max-width: 466px;
            width: 100%;
            padding-left: 24px;
        }

        &-logo {
            max-width: 144px;
            width: 100%;
            height: 144px;
            margin-right: 24px;
            border-radius: 8px;
            overflow: hidden;
        }

        &-name {
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            color: #121926;
        }

        &-description {
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            color: #364152;
            margin: 8px 0 !important;

            display: -webkit-box;
            line-clamp: 3;
            -webkit-line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
        }

        &-address {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: #2970FF;

            a {
                margin-left: 7px;
            }
        }

        &-time {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 18px;
            background-color: #EEF2F6;
            border-radius: 12px;

            span {
                margin-left: 14px;
                font-size: 15px;
                line-height: 18px;
                color: #202939;
            }
        }

        &-tels {
            margin-top: 12px;
            display: flex;
            width: 100%;
            padding: 12px;
            background-color: #EEF2F6;
            border-radius: 12px;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                &:not(:last-child) {
                    padding-right: 48px;
                    margin-right: 48px;
                    border-right: 1px solid #CDD5DF;
                }
                li {
                    a {
                        font-weight: 400;
                        font-size: 15px;
                        line-height: 22px;
                        color: #202939;
                    }
                }
            }

            .icon-phone-call {
                align-items: center;
                font-size: 24px;
                margin-right: 16px;
            }
        }
    }

    .text-with-line {
        h2 {
            height: 48px;
        }
        .customDropdown {
            position: absolute;
            top: 0;
            right: 0;
            width: 168px;
        }
    }
}

.border-padding-none {
    border: none !important;
    padding-bottom: 0 !important;
}

.items-total {
    bottom: -5px !important;
    display: flex;
    left: 25px !important;
    font-size: 14px !important;
    font-weight: 500;
}
</style>
