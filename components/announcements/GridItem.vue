<template>
    <div :class="colClass || 'stratch-child-block'">
        <div
            class="announcements-grid_gallery"
            @click="goToAnnouncement"
            v-if="showGallery"
        >
            <a
                v-if="clickable && !isMobileBreakpoint && !$env.DEV"
                target="_blank"
                :href="getLink"
                class="abs-link"
                @click.stop
            >
                <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
            </a>
            <div class="d-flex">
                <div>
                    <div
                        class="item-bg"
                        role="img"
                        v-lazy:background-image="$withBaseUrl(announcement.media.original[0])"
                    ></div>
                </div>
                <div>
                    <div
                        class="item-bg wider"
                        role="img"
                        v-lazy:background-image="$withBaseUrl(announcement.media.original[1])"
                    ></div>
                    <div
                        class="item-bg wider"
                        role="img"
                        v-lazy:background-image="$withBaseUrl(announcement.media.original[2])"
                    ></div>
                </div>
            </div>
        </div>
        <div class="announcements-grid_item" :class="'id'+announcement.id_unique" @click="goToAnnouncement">
            <a
                v-if="clickable && !isMobileBreakpoint && !$env.DEV"
                target="_blank"
                :href="getLink"
                class="abs-link"
                @click.stop
            >
                <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
            </a>
            <div
                class="item-bg"
                role="img"
                :aria-label="getAnnouncementTitle(announcement)"
                v-lazy:background-image="getImage"
                v-if="!showGallery"
            >
                <div class="item-overlay" v-if="showOverlay">
                    <div class="item-overlay__top">
                        <div class="item-overlay__top--left">
                            <template v-if="announcement.is_autosalon || announcement.is_part_salon">
                                <span class="badge badge-blue">{{ announcement.is_autosalon ? 'SALON' : 'SHOP' }}</span>
                            </template>

                            <template v-if="announcement.is_external_salon">
                                <span class="badge badge-blue">Sifarişlə</span>
                            </template>
                        </div>

                        <div :class="['item-overlay__top--right', {'pending-badge-centered': checkPendingBadge(announcement)}]">
                            <add-favorite
                                v-if="!isProfilePage"
                                :announcement="announcement"
                            />
                        </div>
                    </div>

                    <div class="item-overlay__bottom">
                        <!--            <span-->
                        <!--              class="d-flex"-->
                        <!--              v-if="announcement.status === undefined || announcement.status == 1"-->
                        <!--            >-->
                        <!--                <add-comparison-->
                        <!--                  :id="announcement.id_unique"-->
                        <!--                  v-if="getType === 'Car'"-->
                        <!--                />-->
                        <!--            </span>-->

                        <div class="item-overlay__bottom--left">
                          <span
                              class="btn-sq btn-sq--color-red active"
                              v-if="announcement.has_monetization && isMobileBreakpoint"
                          >
        <!--                <icon name="speaker" v-tooltip="$t('ad_announcement')"/>-->

                          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.4656 1.57349V2.47126L7.04077 5.03911H3.10938C1.91809 5.03911 0.95 6.0072 0.95 7.19849V8.60474C0.95 9.79602 1.91809 10.7641 3.10938 10.7641H3.80644L4.86478 14.4648C4.86479 14.4649 4.86479 14.4649 4.8648 14.4649C4.97779 14.864 5.39565 15.0976 5.79508 14.9809C6.19411 14.8679 6.42765 14.45 6.31092 14.0506C6.3109 14.0505 6.31089 14.0505 6.31088 14.0505L5.37291 10.7641H7.04076L13.4656 13.3355V14.2297C13.4656 14.6441 13.8044 14.9829 14.2188 14.9829C14.6331 14.9829 14.9719 14.6441 14.9719 14.2297V1.57349C14.9719 1.15915 14.6331 0.820361 14.2188 0.820361C13.8044 0.820361 13.4656 1.15915 13.4656 1.57349ZM2.45625 8.60825V7.202C2.45625 6.8429 2.75027 6.54888 3.10938 6.54888H6.43437V9.26138H3.10938C2.75027 9.26138 2.45625 8.96736 2.45625 8.60825ZM13.4656 11.7125L7.94063 9.50253V6.30421L13.4656 4.09421V11.7125Z"
                                fill="white" stroke="white" stroke-width="0.1"/>
                            <path
                                d="M18.2969 7.1519H16.8906C16.4765 7.1519 16.1375 7.48702 16.1375 7.90503C16.1375 8.31936 16.4763 8.65815 16.8906 8.65815H18.2969C18.7112 8.65815 19.05 8.31936 19.05 7.90503C19.05 7.4907 18.7112 7.1519 18.2969 7.1519Z"
                                fill="white" stroke="white" stroke-width="0.1"/>
                            <path
                                d="M17.2954 3.44441L17.2953 3.44448L16.3567 4.07019C16.3567 4.07021 16.3567 4.07022 16.3567 4.07023C16.0102 4.29999 15.916 4.76709 16.1495 5.11358C16.3793 5.45636 16.8461 5.55035 17.1925 5.32073L17.1926 5.32066L18.1312 4.69487L18.1313 4.6948C18.4742 4.46501 18.5682 3.99815 18.3385 3.65181L18.3384 3.6516C18.1086 3.30879 17.6417 3.21478 17.2954 3.44441Z"
                                fill="white" stroke="white" stroke-width="0.1"/>
                            <path
                                d="M16.3566 11.7366L16.3567 11.7366L17.2951 12.3623C17.2952 12.3623 17.2952 12.3623 17.2952 12.3623C17.6417 12.5958 18.1087 12.5016 18.3385 12.1553C18.5718 11.8088 18.4776 11.3417 18.1312 11.112C18.1312 11.112 18.1312 11.112 18.1312 11.112L17.193 10.4865C17.193 10.4865 17.1929 10.4864 17.1928 10.4864C16.8497 10.2528 16.379 10.3472 16.1494 10.6936C15.9197 11.0399 16.0137 11.5068 16.3566 11.7366Z"
                                fill="white" stroke="white" stroke-width="0.1"/>
                          </svg>
                         </span>

                        </div>

                        <div class="item-overlay__bottom--right">
                            <span class="badge">VIN</span>

                            <span class="badge">
            <!--                  v-if="announcement.has_360"-->
                                            <!--                360-->
                                            <!--                <sup>o</sup>-->
                              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 9.83422C1 9.83422 1.53543 10.2969 2.27168 10.2969C3.17527 10.2969 3.92187 9.56179 3.92187 8.65505C3.92187 7.88384 2.95898 7.14258 2.32812 7.14258C2.99219 7.14258 3.92187 6.49575 3.92187 5.63008C3.92187 4.72333 3.17527 3.98828 2.27168 3.98828C1.53543 3.98828 1 4.4509 1 4.4509"
                                    stroke="white" stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                                <path
                                    d="M6.51172 8.39102C6.51172 7.33476 7.3665 6.47852 8.4209 6.47852C9.4753 6.47852 10.3301 7.33476 10.3301 8.39102V8.38441C10.3301 9.44063 9.4753 10.2969 8.4209 10.2969C7.3665 10.2969 6.51172 9.44063 6.51172 8.38441V5.90078C6.51172 4.84452 7.3665 3.98828 8.4209 3.98828C9.36114 3.98828 10.0238 4.48633 10.0238 4.48633"
                                    stroke="white" stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                                <path
                                    d="M12.8535 8.38438V5.90075C12.8535 4.84452 13.7083 3.98828 14.7627 3.98828C15.8171 3.98828 16.6719 4.84452 16.6719 5.90075V8.38438C16.6719 9.44063 15.8171 10.2969 14.7627 10.2969C13.7083 10.2969 12.8535 9.44063 12.8535 8.38438Z"
                                    stroke="white" stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                                <path
                                    d="M7.67383 17.3359L8.70286 16.334C9.10166 15.9388 9.10166 15.2979 8.70286 14.9026L7.67383 13.8828"
                                    stroke="white" stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                                <path d="M11.4922 15.4343C14.5125 15.0217 16.6719 13.9087 16.6719 12.6211" stroke="white"
                                      stroke-width="1.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1 12.6211C1 13.9275 3.22288 15.1779 6.3125 15.5762" stroke="white" stroke-width="1.4"
                                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path
                                    d="M17.6758 1.66016C17.6758 2.21244 17.2281 2.66016 16.6758 2.66016C16.1235 2.66016 15.6758 2.21244 15.6758 1.66016C15.6758 1.10788 16.1235 0.660156 16.6758 0.660156C17.2281 0.660156 17.6758 1.10788 17.6758 1.66016Z"
                                    fill="white"/>
                              </svg>
                            </span>

<!--                            <template v-if="announcement.is_external_salon && !showStatus">-->
<!--                                <span class="badge badge-blue badge-external">-->
<!--                                  <inline-svg v-if="!isMobileBreakpoint" class="badge-icon" src="/img/auction.svg" />-->
<!--                                  Sifarişlə-->
<!--                                </span>-->
<!--                            </template>-->

<!--                            <template v-if="showStatus">-->
<!--                                <span class="badge active" v-if="announcement.status == 1">-->
<!--                                  {{ $t('accepted') }}-->
<!--                                </span>-->

<!--                                <span-->
<!--                                    class="badge pending"-->
<!--                                    v-else-if="-->
<!--                                                announcement.status == 2 &&-->
<!--                                                announcement.system_paid_announce &&-->
<!--                                                !announcement.system_paid_announce.is_paid-->
<!--                                              "-->
<!--                                >-->
<!--                                  {{ $t('need_pay') }}-->
<!--                                </span>-->

<!--                                <span-->
<!--                                    class="badge pending"-->
<!--                                    v-else-if="announcement.status == 2"-->
<!--                                >-->
<!--                                  {{ $t('under_consideration') }}-->
<!--                                </span>-->

<!--                                <span-->
<!--                                    class="badge pending"-->
<!--                                    v-else-if="announcement.status == 5"-->
<!--                                >-->
<!--                                  {{ $t('is_loading') }}-->
<!--                                </span>-->

<!--                                <span-->
<!--                                    class="badge rejected"-->
<!--                                    v-else-if="announcement.status == 0"-->
<!--                                >-->
<!--                                  {{ $t('rejected') }}-->
<!--                                </span>-->

<!--                                <span-->
<!--                                    class="badge inactive"-->
<!--                                    v-else-if="announcement.status == 3"-->
<!--                                >-->
<!--                                  {{ $t('inactive') }}-->
<!--                                </span>-->
<!--                            </template>-->
                        </div>
                    </div>
                </div>
            </div>

            <!-- price, title -->
            <div class="item-details">
                <div class="d-flex align-items-center justify-content-between" style="margin-bottom: 3px">
                    <h3 class="item-details__price">
                        <span v-if="announcement.is_external_salon"> ≈ </span>
                        {{ announcement.price }}
                    </h3>

                    <span class="item-details__options" v-show="getOdometer">
                        <span
                            class="item-details__options-icon"
                            v-if="announcement.tradeable || announcement.exchange_possible"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#32B878"/>
                                <path d="M11.6506 8.51716H8.74383C8.12798 8.51716 7.62697 9.01818 7.62697 9.634V14.3812C7.62697 14.865 7.23479 15.2572 6.75101 15.2572C6.26724 15.2572 5.87506 14.865 5.87506 14.3812V9.634C5.87506 8.05217 7.162 6.76526 8.74383 6.76526H11.6506L11.3807 6.49535C11.0386 6.15327 11.0386 5.59865 11.3806 5.25657C11.7228 4.91448 12.2774 4.91448 12.6194 5.25657L14.3847 7.02183C14.549 7.1861 14.6413 7.40892 14.6413 7.64121C14.6413 7.8735 14.549 8.09632 14.3847 8.26059L12.6195 10.0259C12.4484 10.1969 12.2242 10.2824 12 10.2824C11.7759 10.2824 11.5517 10.1969 11.3807 10.0259C11.0386 9.68377 11.0386 9.12915 11.3807 8.78706L11.6506 8.51716ZM17.2491 8.75805C16.7653 8.75805 16.3732 9.15023 16.3732 9.634V14.3812C16.3732 14.9971 15.8721 15.4981 15.2563 15.4981H12.3495L12.6195 15.2281C12.9615 14.886 12.9615 14.3314 12.6195 13.9893C12.2774 13.6473 11.7228 13.6473 11.3807 13.9893L9.61543 15.7546C9.45114 15.9189 9.35886 16.1417 9.35886 16.374C9.35886 16.6063 9.45114 16.8291 9.61543 16.9934L11.3807 18.7586C11.5517 18.9297 11.7759 19.0152 12.0001 19.0152C12.2242 19.0152 12.4484 18.9297 12.6195 18.7586C12.9615 18.4165 12.9615 17.8619 12.6195 17.5198L12.3496 17.2499H15.2563C16.8381 17.2499 18.1251 15.963 18.1251 14.3812V9.634C18.1251 9.15023 17.7329 8.75805 17.2491 8.75805Z" fill="white"/>
                            </svg>
                        </span>

                        <span
                            class="item-details__options-icon"
                            v-if="announcement.credit"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#155EEF"/>
                                <path d="M16.2109 7.78906L7.78906 16.2109" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8.69141 10.1953C9.52199 10.1953 10.1953 9.52199 10.1953 8.69141C10.1953 7.86082 9.52199 7.1875 8.69141 7.1875C7.86082 7.1875 7.1875 7.86082 7.1875 8.69141C7.1875 9.52199 7.86082 10.1953 8.69141 10.1953Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.3086 16.8125C16.1392 16.8125 16.8125 16.1392 16.8125 15.3086C16.8125 14.478 16.1392 13.8047 15.3086 13.8047C14.478 13.8047 13.8047 14.478 13.8047 15.3086C13.8047 16.1392 14.478 16.8125 15.3086 16.8125Z" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>

<!--                        <icon-->
<!--                            name="barter"-->
<!--                            v-tooltip="$t('tradeable')"-->
<!--                            v-if="announcement.tradeable || announcement.exchange_possible ? 'margin-right:16px': ''"-->
<!--                        />-->

<!--                        <icon-->
<!--                            name="percent_new"-->
<!--                            :style="announcement.tradeable || announcement.exchange_possible"-->
<!--                            v-tooltip="$t('credit_possible')"-->
<!--                            v-if="announcement.credit"-->
<!--                        />-->

                  </span>
                    <!--                    <span -->
                    <!--                        style="font-size: 12px;text-align: right;"-->
                    <!--                        v-if="announcement.is_external_salon"-->
                    <!--                    >-->
                    <!--                        {{ announcement[`country_name_${locale}`] }}-->
                    <!--                    </span>-->
                </div>

                <h3 class="item-details__title">{{ getAnnouncementTitle(announcement) }}</h3>

                <!-- year, odometer, credit, barter -->
                <!-- 1 -->
                <div class="item-details--infos">
                    <span class="item-details__year">
                        <p
                            v-if="announcement.formatted_filters && announcement.formatted_filters.shine_width || announcement.commercial_size"
                            class="shine-size">{{
                                $t('size')
                            }}: {{
                                announcement.formatted_filters.shine_width ? getShineSize(announcement.formatted_filters) : announcement.commercial_size
                            }}
                        </p>

                        <template v-else-if="getTextLine">
                            <span>{{ getTextLine }}</span>
                            <span>{{ getCapacity }}</span>
                            <span>{{ getOdometer }}</span>

<!--                            <span v-if="getTextLine  && isMobileBreakpoint">-->
<!--                                <span v-if="!announcement.category">, {{ getOdometer }}</span>-->
<!--                            </span>-->

<!--                            <span class="item-details__year" v-if="getTextLine && !isMobileBreakpoint">-->
<!--                                <span v-if="!announcement.category">{{ getOdometer }}</span>-->
<!--                            </span>-->

<!--                            <span class="item-details__year" v-if="isMobileBreakpoint">-->
<!--                                <span>{{ announcement.humanize_created_at }}</span>-->
<!--                            </span>-->

<!--                            <span class="item-details__options" v-show="getOdometer">-->
<!--                                <icon-->
<!--                            name="percent"-->
<!--                            :style="announcement.tradeable || announcement.exchange_possible ? 'margin-right:16px':''"-->
<!--                            v-tooltip="$t('credit_possible')"-->
<!--                            v-if="announcement.credit"-->
<!--                        />-->
<!--                                <icon-->
<!--                            name="barter"-->
<!--                            v-tooltip="$t('tradeable')"-->
<!--                            v-if="announcement.tradeable || announcement.exchange_possible"-->
<!--                        />-->
<!--                            </span>-->
                        </template>
                    </span>
                    <!--                    <span class="item-details__options" v-show="getOdometer == null">-->
                    <!--                        <icon-->
                    <!--                            name="barter"-->
                    <!--                            v-tooltip="$t('tradeable')"-->
                    <!--                            v-if="announcement.tradeable || announcement.exchange_possible"-->
                    <!--                        />-->
                    <!--                        <icon-->
                    <!--                            :style="announcement.tradeable || announcement.exchange_possible ? 'margin-right:16px':''"-->
                    <!--                            name="percent"-->
                    <!--                            v-tooltip="$t('credit_possible')"-->
                    <!--                            v-if="announcement.credit"-->
                    <!--                        />-->
                    <!--                    </span>-->
                </div>
                <!-- odometer, credit,barter
                 -->
                <!-- 2 -->
                <div class="item-details--infos">
                    <span class="badge" v-if="announcement.updated_at">
<!--                        && !isMobileBreakpoint-->
                        {{ $formatDate(announcement.updated_at, 'D MMMM')[locale] }}
                    </span>
<!--                    <span class="item-details__year" v-if="getTextLine && !isMobileBreakpoint">-->
<!--                        <span v-if="!announcement.category">{{ getOdometer }}</span>-->
<!--                    </span>-->
<!--                    <span class="item-details__year" v-if="isMobileBreakpoint">-->
<!--                        <span>{{ announcement.humanize_created_at }}</span>-->
<!--                    </span>-->
                </div>
                <!-- checkbox and counts -->
<!--                <div-->
<!--                    class="item-details__checks"-->
<!--                    @click.stop-->
<!--                    v-if="showCheckbox || showPhoneCount"-->
<!--                >-->
<!--          <span-->
<!--              class="call-count"-->
<!--              v-if="announcement.show_phone_number_count || showPhoneCount || announcement.view_count"-->
<!--          >-->
<!--            <icon name="phone-call"/>-->
<!--            {{ announcement.show_phone_number_count || 0 }}-->
<!--            <icon name="eye"/>-->
<!--            {{ announcement.view_count }}-->
<!--          </span>-->
<!--                    <div class="item-checkbox" v-if="showCheckbox" style="">-->
<!--                        <form-checkbox-->
<!--                            :value="selected"-->
<!--                            :input-name="`selected_${announcement.id_unique}`"-->
<!--                            transparent-->
<!--                            @input="handleChange"-->
<!--                        />-->
<!--                    </div>-->
                </div>

<!--                <hr class="mt-1" v-if="showMonetizationActions && showCheckbox && announcement.status === 1"/>-->
<!--                <div class="item-details__actions" style="z-index: 1" v-if="showMonetizationActions">-->
<!--                    <template v-if="showCheckbox && announcement.status === 1">-->
<!--                    <span>-->
<!--                      <monetization-button-->
<!--                          :announcement="announcement"-->
<!--                          class-name="red-outline"-->
<!--                      />-->
<!--                      <monetization-stats-button-->
<!--                          class="mt-2"-->
<!--                          v-if="$auth.user.id === announcement.user_id && announcement.has_monetization"-->
<!--                          :announcement="announcement"-->
<!--                      />-->
<!--                    </span>-->
<!--                    </template>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
import AddFavorite from '~/components/announcements/AddFavorite'
import AddComparison from '~/components/announcements/AddComparison'
import MonetizationButton from '~/components/announcements/MonetizationButton'
import MonetizationStatsButton from '~/components/announcements/MonetizationStatsButton'

export default {
    props: {
        announcement: {},
        showStatus: Boolean,
        showMonetizationActions: {
            type: Boolean,
            default: true,
        },
        showCheckbox: Boolean,
        showPhoneCount: Boolean,
        showGallery: Boolean,
        showOverlay: Boolean,
        clickable: Boolean,
        trackViews: Boolean,
        colClass: String,
        isProfilePage: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        MonetizationStatsButton,
        MonetizationButton,
        AddFavorite,
        AddComparison,
    },
    data() {
        return {
            selected: false,
        }
    },
    computed: {
        getType() {
            let item = this.announcement
            if (item.moto_brand) return 'Motorcycle'
            else if (item.scooter_brand) return 'Scooter'
            else if (item.moto_atv_brand) return 'Atv'
            else if (item.commercial_brand) return 'Commercial'
            else if (item.car_catalog) return 'Car'
            else if (item.title) return 'Part'
            return ''
        },
        getLink() {
            let type = 'cars'
            if (['Motorcycle', 'Scooter', 'Atv'].includes(this.getType)) type = 'moto'
            else if (['Commercial'].includes(this.getType)) type = 'commercial'
            else if (['Part'].includes(this.getType)) type = 'parts'
            let path = `/${type}/announcement/${this.announcement.id_unique}`
            return this.$localePath(path)
        },
        getTextLine() {
            if (['Part'].includes(this.getType)) return this.announcement.description;

            let text = `${this.announcement.year} ${this.$t('plural_forms_year')[0]}`

            // if (this.showOverlay)
            //     if (this.getCapacity) {
            //         text +=`  ${this.getCapacity}`
            //     }
            return text
        },
        getImage() {
            let item = this.announcement

            if (item.has_360 == false || !item.has_360) {
                if (item.media && item.media.original && item.media.original.length)
                    return this.$withBaseUrl(item.media.original[0])
                else if (item.media && item.media.length)
                    return this.$withBaseUrl(item.media[0].original || item.media[0])
                return false
            } else {
                return this.$withBaseUrl(item.has_360)
            }
        },
        getCapacity() {
            let item = this.announcement,
                type = this.getType
            let capacity = item.car_catalog?.capacity || item.capacity
            let showLitres = ['Car', 'Commercial'].includes(type)
            if (!capacity || capacity == '0') return ''
            if (showLitres && capacity > 50) capacity = (capacity / 1000).toFixed(1)
            return `${capacity} ${this.$t(
                showLitres ? 'char_litre' : 'char_sm_cube',
            )}`
        },
        getOdometer() {
            if (this.showOverlay) {
                return `${this.announcement.humanize_mileage} ${this.$t('char_kilometre')}`
            }
        },
    },
    methods: {
        getShineSize(filters) {
            return filters.shine_width.name + '/' + filters.height.name + 'R' + filters.diameter.name
        },
        goToAnnouncement() {
            if (!this.clickable) return

            if (this.trackViews) {
                this.fbTrack('ViewContent', {
                    content_type: 'product',
                    content_category: this.getType,
                    content_ids: [this.announcement.id_unique],
                    content_name:
                        this.getAnnouncementTitle(this.announcement) +
                        ', ' +
                        this.announcement.year,
                })
            }

            if (!this.isMobileBreakpoint && !this.$env.DEV) return
            this.$router.push(this.getLink)
        },
        handleChange(value) {
            this.selected = value
            this.$nuxt.$emit(
                'select-announcement',
                this.announcement.id_unique,
                value,
                true,
            )
        },
        selectAnnouncement(id, value, controls = false) {
            if (controls || id != this.announcement.id_unique) return
            this.handleChange(value)
        },
        checkPendingBadge(announcement) {
            if (
                (announcement.status == 2 ||
                    announcement.status == 5 ||
                    announcement.status == 3) &&
                (announcement.is_autosalon == true ||
                    announcement.is_part_salon == true)
            ) {
                return true
            } else {
                return false
            }
        },
    },
    mounted() {
        this.$nuxt.$on('select-announcement', this.selectAnnouncement)
    },
    beforeDestroy() {
        this.$nuxt.$off('select-announcement', this.selectAnnouncement)
    },
}
</script>

<style lang="scss">
.badge-icon {
    width: 20px;
    margin-right: 3px;
    margin-bottom: 1px;
    height: 20px;
}

.badge-external {
    margin-right: -17px;
    border-bottom-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
}

.shine-size {
    margin-left: auto;
}
</style>
