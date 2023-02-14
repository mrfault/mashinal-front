<template>
    <component
        :is="tag"
        :class="classes ? classes : `btn btn--add btn--${className} full-width`"
        @click.stop="openPaymentModal()"
    >
        {{ $t('get_an_ad') }}

        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6687 4.28818V5.37229L8.9508 8.45693H4.2312C2.80718 8.45693 1.64995 9.61416 1.64995 11.0382V12.7257C1.64995 14.1497 2.80718 15.3069 4.2312 15.3069H5.07521L6.34731 19.7551C6.48136 20.2287 6.97729 20.506 7.45128 20.3675C7.92483 20.2333 8.20196 19.7375 8.06346 19.2635C8.06344 19.2635 8.06343 19.2634 8.06341 19.2634L6.93419 15.3069H8.95079L16.6687 18.3958V19.4757C16.6687 19.9674 17.0708 20.3694 17.5625 20.3694C18.0541 20.3694 18.4562 19.9674 18.4562 19.4757V4.28818C18.4562 3.79651 18.0541 3.39444 17.5625 3.39444C17.0708 3.39444 16.6687 3.79651 16.6687 4.28818ZM3.43745 12.7299V11.0424C3.43745 10.606 3.79475 10.2487 4.2312 10.2487H8.2312V13.5237H4.2312C3.79475 13.5237 3.43745 13.1664 3.43745 12.7299ZM16.6687 16.4698L10.0187 13.8098V9.95829L16.6687 7.29829V16.4698Z" fill="#F81734" stroke="#F81734" stroke-width="0.1"/>
            <path d="M22.4563 10.9924H20.7688C20.2773 10.9924 19.875 11.3901 19.875 11.8862C19.875 12.3778 20.2771 12.7799 20.7688 12.7799H22.4563C22.948 12.7799 23.35 12.3778 23.35 11.8862C23.35 11.3945 22.948 10.9924 22.4563 10.9924Z" fill="#F81734" stroke="#F81734" stroke-width="0.1"/>
            <path d="M21.26 6.54158L21.2601 6.54151C21.6711 6.26899 22.2251 6.38058 22.4978 6.78738L22.498 6.78759C22.7705 7.19861 22.6589 7.75266 22.2521 8.02534L22.252 8.02541L21.1256 8.77635L21.1255 8.77642C20.7145 9.04893 20.1605 8.93737 19.8878 8.53063M21.26 6.54158L19.8877 8.53056C19.8878 8.53058 19.8878 8.53061 19.8878 8.53063M21.26 6.54158L20.1337 7.29245M21.26 6.54158L20.1337 7.29245M19.8878 8.53063C19.6107 8.11944 19.7225 7.56514 20.1336 7.29249M19.8878 8.53063C19.8878 8.53064 19.8878 8.53065 19.8878 8.53066L20.1336 7.29249M20.1336 7.29249C20.1336 7.29248 20.1337 7.29246 20.1337 7.29245M20.1336 7.29249L20.1337 7.29245" fill="#F81734" stroke="#F81734" stroke-width="0.1"/>
            <path d="M20.1334 16.4755L20.1335 16.4756L21.2597 17.2264C21.2598 17.2264 21.2598 17.2264 21.2599 17.2264C21.671 17.5034 22.2252 17.3917 22.4978 16.9807C22.7748 16.5695 22.663 16.0153 22.2519 15.7426C22.2519 15.7426 22.2519 15.7426 22.2519 15.7426L21.126 14.992C21.1259 14.992 21.1259 14.9919 21.1258 14.9919C20.7186 14.7147 20.1601 14.8267 19.8876 15.2377C19.6151 15.6488 19.7266 16.2028 20.1334 16.4755Z" fill="#F81734" stroke="#F81734" stroke-width="0.1"/>
        </svg>

        <modal-popup
            :toggle="showPaymentModal"
            :title="$t('get_an_ad')"
            :modal-class="'larger monetization-popup'"
            @close="showPaymentModal = false"
        >
            <p class="text-dark-blue-3">{{ $t('ad_views_count') }}</p>
            <h4 class="text-dark-blue-2">
                {{ selectedPlan.min_view }} - {{ selectedPlan.max_view }}
            </h4>
            <hr/>
            <h4>{{ $t('daily_budget') }}</h4>
            <form-range
                v-model="price.value"
                :min="price.min"
                :max="price.max"
                :step="0.1"
                :data="pricesForPlan"
                :tooltip-template="`{value} ALM`"
            />
            <h4>{{ $t('duration') }}</h4>
            <form-range
                v-model="day.value"
                :min="day.min"
                :max="day.max"
                :step="1"
                :data="daysForPlan"
                :tooltip-template="`{value} day`"
            />
            <p class="mb-2 mb-lg-3">
                <span class="star">*</span>
                {{ $t('ad_can_be_paused') }}
            </p>
            <h4>{{ $t('payment_method') }}</h4>
            <form-buttons
                v-model="paymentMethod"
                :options="paymentMethodOptions"
                :group-by="2"
            />
            <select-banking-card
                v-if="loggedIn"
                :show-card-image="false"
                :value="bankingCard"
                @input="bankingCard = $event"
                class="mt-2 mt-lg-3"
                v-show="paymentMethod === 'card'"
            />
            <terminal-info-button popup-name="monetization-popup"/>
            <div class="modal-sticky-bottom">
                <hr/>
                <div class="row">
                    <div class="col-6 col-lg-4">
                        <p class="text-medium">{{ $t('total') }}</p>
                        <p class="text-medium text-dark-blue-2">
                            {{ multiple ? multipleAnnouncements.length * selectedPlan.price : selectedPlan.price }} ALM
                            -
                            {{ $readPlural(selectedPlan.days, $t('plural_forms_day')) }}
                        </p>
                    </div>
                    <div class="col-6 col-lg-4">
                        <template v-if="$auth.loggedIn">
                            <p class="text-medium">{{ $t('balans') }}</p>
                            <p class="text-medium text-dark-blue-2">{{ totalBalance }} ALM</p>
                        </template>
                    </div>
                    <div class="col-12 col-lg-4 mt-2 mt-lg-0">
                        <button
                            :class="['btn btn--green full-width', { pending }]"
                            @click="getAnAd"
                        >
                            {{ $t('go_further') }}
                        </button>
                    </div>
                </div>
            </div>
        </modal-popup>

        <terminal-info-popup
            name="monetization-popup"
            @open="showPaymentModal = false"
            @close="showPaymentModal = true"
        />
    </component>
</template>

<script>
import { PaymentMixin } from '~/mixins/payment'
import { mapGetters } from 'vuex'

export default {
    props: {
        className: {
            default: '',
        },
        multipleAnnouncements: {
            default: () => []
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        classes: {
            default: '',
        },
        tag: {
            default: 'button',
            type: String
        },
        announcement: {},
    },
    mixins: [PaymentMixin],
    data() {
        return {
            pending: false,
            priceList: [],
            day: {
                value: 5,
                min: 1,
                max: 30,
            },
            price: {
                value: 0,
                min: 0.5,
                max: 1,
            },
        }
    },
    computed: {
        ...mapGetters(['user']),
        ...mapGetters({
            bankingCards: 'bankingCards/bankingCards'
        }),
        totalBalance() {
            let balance = this.user.balance
            if (this.user && this.user.id === this.announcement.user_id) {
                if (this.announcement.is_autosalon)
                    return this.$sum(balance, this.announcement.user.autosalon.balance)
                else if (this.announcement.is_part_salon)
                    return this.$sum(balance, this.announcement.user.part_salon.balance)
                else if (this.announcement.is_external_salon)
                    return this.$sum(balance, this.announcement.user.external_salon.balance)
                return balance
            } else {
                if (this.user.autosalon)
                    return this.$sum(balance, this.user.autosalon.balance)
                else if (this.user.part_salon)
                    return this.$sum(balance, this.user.part_salon.balance)
                else if (this.user.external_salon)
                    return this.$sum(balance, this.user.external_salon.balance)
                return balance
            }

        },
        pricesForPlan() {
            return this.priceList.map((item) => parseFloat(item.price))
        },
        availablePlans() {
            return (
                this.priceList.find(
                    (item) => parseFloat(item.price) === this.price.value,
                )?.prices || []
            )
        },
        daysForPlan() {
            return this.availablePlans.map((item) => item.days)
        },
        selectedPlan() {
            return (
                this.availablePlans.find((item) => item.days === this.day.value) || {}
            )
        },
        haveBalanceToPay() {
            return parseFloat(this.selectedPlan.price) <= this.totalBalance
        },
    },
    methods: {
        async getAnAd() {
            if (this.pending) return
            this.pending = true
            if (!this.haveBalanceToPay) {
                this.paymentMethod = 'card'
            }
            let form = {
                id_unique: this.announcement.id_unique,
                monetize_id: this.selectedPlan.id,
                type: this.paymentMethod,
                card_id: this.bankingCard
            };

            if (this.multiple) {
                delete form.id_unique;
                form['announcements'] = this.multipleAnnouncements.map(item => ({id_unique: item.id_unique}))
            }
            const res = await this.$axios.$post(
                `/monetization/start?is_mobile=${
                    this.isMobileBreakpoint ? 'true' : 'false'
                }`,
                form,
            )
            if (this.paymentMethod === 'card') {
                if (!res?.data?.redirect_url) {
                    await this.$nuxt.refresh();
                    this.updatePaidStatus({
                        type: 'success',
                        text: this.$t('ad_started'),
                        title: this.$t('success_payment')
                    });
                    this.pending = false;
                } else {
                    this.pending = false
                    this.showPaymentModal = false
                    this.$nuxt.$emit('refresh-my-announcements')
                    this.handlePayment(res, false, this.$t('ad_started'))
                }
            } else {
                await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
                this.pending = false
                this.showPaymentModal = false
                this.$nuxt.$emit('refresh-my-announcements')
                this.updatePaidStatus({
                    type: 'success',
                    text: this.$t('ad_started'),
                    title: this.$t('success_payment'),
                })
            }
        },
        openPaymentModal() {
            this.showPaymentModal = true;
        },
    },
    created() {
        this.$axios.$get('/monetization/price/list').then((res) => {
            this.priceList = res
            this.price.min = this.pricesForPlan[0]
            this.price.value = this.pricesForPlan[2]
            this.price.max = this.pricesForPlan[this.pricesForPlan.length - 1]
            if (this.haveBalanceToPay) this.paymentMethod = 'balance'
        })
    },
}
</script>
