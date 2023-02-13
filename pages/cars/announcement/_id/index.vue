<template>
    <div class="pages-cars-id">
        <div class="container">
            <div class="announcements-inner">
                <breadcrumbs :crumbs="crumbs">
                    <share-it type="publish"/>
                </breadcrumbs>

                <div class="row flex-column flex-lg-row">
                    <div class="col-auto">
                        <client-only>
                            <gallery>
                                <quick-info type="cars" brief/>
                                <announcement-specs type="cars" brief/>
                            </gallery>
                        </client-only>

                        <thumbs-gallery/>

                        <announcement-specs type="cars"/>

                        <comment :comment="announcement.comment" v-if="!isMobileBreakpoint && announcement.comment">
<!--                            <template #before>-->
<!--                                <thumbs-gallery/>-->
<!--                            </template>-->

                            <template #after v-if="hasComplects || getCarHealth">
<!--                                <hr v-if="announcement.comment"/>-->

                                <template v-if="getCarHealth">
                                    <damage-options
                                        :selected="getCarHealth"
                                        read-only
                                        :imageIsActive="imageIsActive"
                                        v-if="false"
                                    />

<!--                                    <hr v-if="hasComplects"/>-->
                                </template>

                            </template>
                        </comment>

                        <car-complects :options="getComplectOptions" v-if="hasComplects"/>
                    </div>

                    <div class="col-auto">
                        <quick-info type="cars" />

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

                        <template v-if="announcement.status != 2 && !(announcement.is_autosalon && announcement.status == 3)">
                            <!--            <hr :class="{ 'mt-3': announcement.status == 3 }"-->
                            <!--                v-if="showEditButton(announcement) || showDeactivateButton(announcement) || announcement.status == 3 && !announcement.is_external_salon"-->
                            <!--            />-->
                            <div class="row mt-n2 mt-lg-n3">
                                <div class="col mt-2 mt-lg-3">
                                    <restore-button
                                        :announcement="announcement"
                                        v-if="userIsOwner(announcement) && announcement.status == 3 && !announcement.is_external_salon"
                                        :free="true"
                                    />
                                    <deactivate-button
                                        :announcement="announcement"
                                        v-if="showDeactivateButton(announcement)"
                                    />
                                </div>
                                <div class="col mt-2 mt-lg-3">
                                    <edit-button
                                        :announcement="announcement"
                                        v-if="showEditButton(announcement)"
                                        @openModal="openModal"
                                    />
                                </div>
                            </div>
                        </template>

                        <modal-popup :toggle="showModal" @close="showModal = false">
                            <login-tabs></login-tabs>
                        </modal-popup>

                        <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement"/>

                        <comment :comment="announcement.comment" v-if="isMobileBreakpoint">
                            <template #after v-if="hasComplects || getCarHealth">
                                <hr v-if="announcement.comment"/>
                                <template v-if="getCarHealth">
                                    <damage-options :selected="getCarHealth" read-only v-if="false"/>
                                    <hr v-if="hasComplects"/>
                                </template>
                                <car-complects :options="getComplectOptions" v-if="hasComplects"/>
                            </template>
                        </comment>
                    </div>
                </div>

                <relatives />
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

import QuickInfo from '~/components/announcements/inner/QuickInfo';
import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
import Gallery from '~/components/announcements/inner/Gallery';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
import Comment from '~/components/announcements/inner/Comment';
import CarComplects from '~/components/announcements/inner/CarComplects';
import DamageOptions from '~/components/options/DamageOptions';
import Relatives from '~/components/announcements/inner/Relatives';
import SiteBanner from "~/components/banners/SiteBanner";
import MonetizationButton from "~/components/announcements/MonetizationButton.vue";
import MonetizationStatsButton from "~/components/announcements/MonetizationStatsButton.vue";
import PayAnnouncementButton from "~/components/announcements/PayAnnouncementButton.vue";
import RestoreButton from "~/components/announcements/RestoreButton.vue";
import DeactivateButton from "~/components/announcements/DeactivateButton.vue";
import EditButton from "~/components/announcements/EditButton.vue";

export default {
    name: 'pages-cars-id',
    components: {
        MonetizationButton,
        MonetizationStatsButton,
        PayAnnouncementButton,
        SiteBanner,
        QuickInfo,
        AnnouncementSpecs,
        Gallery,
        ThumbsGallery,
        Comment,
        CarComplects,
        DamageOptions,
        Relatives,
        RestoreButton,
        DeactivateButton,
        EditButton,
    },
    nuxtI18n: {
        paths: {
            az: '/masinlar/elan/:id'
        }
    },
    data() {
        return {
            showModal: false,
        }
    },
    head() {
        let announcementTitle = `${this.catalog.brand.name} ${this.$translateHard(this.catalog.model.name)}`;
        let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, {announce: `${announcementTitle}, ${this.announcement.year}`})}`;
        let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', {announce: `${this.announcement.price}`})}`;
        let image = this.getAnnouncementImage(this.announcement);
        return this.$headMeta({title, description, image}, {
            category: 'Car',
            id: this.announcement.id_unique,
            autosalon: this.announcement.user.autosalon,
            brand: this.catalog.brand.name,
            model: this.catalog.model.name.replace('серия', 'seriya').replace('класс', 'klass'),
            year: this.announcement.year,
            price: {amount: this.announcement.price_int, currency: this.announcement.currency_id},
            services: this.announcement.type,
            new: this.announcement.is_new,
            available: this.announcement.status == 1,
            barter: this.announcement.exchange_possible,
            credit: this.announcement.credit
        });
    },
    async asyncData({store, route}) {
        await Promise.all([
            store.dispatch('getAnnouncementInner', route.params.id),
            store.dispatch('getComplaintOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getAllOtherOptions'),
            store.dispatch('getPopularOptions')
        ]);
    },
    methods: {
        showDeactivateButton(item) {
            if (this.$auth.user.id == item.user.id) {
                if (item.status == 0 || item.status == 1) {
                    return true
                }
            } else {
                return false
            }
        },
        showEditButton(item) {
            if (this.$auth.loggedIn == false) {
                return item.status == 1 || item.status == 2
            } else {
                return this.$auth.user.id == item.user.id && item.status != 5 && item.status !== 3;
            }
        },
        openModal() {
            this.showModal = true
        },
        getFilterLink(type) {
            let form = {
                sorting: 'created_at_desc',
                additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
                all_options: {},
                announce_type: 1,
                currency: 1
            }
            // insert announcement data into form
            if (type.includes('brand')) {
                form.additional_brands[0].brand = this.catalog.brand.id;
                form.additional_brands[0].brand_slug = this.catalog.brand.slug;
            }
            if (type.includes('model')) {
                form.additional_brands[0].model = this.catalog.model.id;
                form.additional_brands[0].model_slug = this.catalog.model.slug;
            }
            if (type.includes('generation')) {
                form.additional_brands[0].generation = this.catalog.generation.id;
            }

            return `/cars?car_filter=${encodeURI(JSON.stringify(form))}`
        }
    },
    computed: {
        ...mapGetters(['announcement', 'catalog']),
        needToPay() {
            return (
                this.announcement.status == 2 &&
                this.announcement.system_paid_announce &&
                !this.announcement.system_paid_announce.is_paid
            )
        },
        getComplectOptions() {
            return typeof this.announcement.options === 'string'
                ? JSON.parse(this.announcement.options)
                : this.announcement.options;
        },
        hasComplects() {
            return Object.keys(this.getComplectOptions).length;
        },
        getCarHealth() {
            return this.announcement.car_body_health
                ? JSON.parse(this.announcement.car_body_health.options)
                : false;
        },
        imageIsActive() {
            return false
        },
        crumbs() {
            return [
                {name: this.$t('cars'), route: '/cars'},
                {name: this.catalog.brand.name, route: this.getFilterLink('brand')},
                {name: this.catalog.model.name, route: this.getFilterLink('brand-model')},
                {
                    name: this.$translateHard(this.catalog.generation.name[this.locale]),
                    route: this.getFilterLink('brand-model-generation')
                },
                {name: '#' + this.announcement.id_unique}
            ]
        }
    },
}
</script>
