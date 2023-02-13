<template>
    <button :class="['call-button btn full-width']" @click.stop="handleClick">
        <!--        <icon name="phone-call"/>-->
        <span class="call-button__title">Nömrəni göstər</span>

        <template v-if="callAtOnce">
            <span v-mask="$maskPhone(true)" v-if="!isMobileBreakpoint">+{{ phone }}</span>
            <span v-else>{{ $t('make_a_call') }}</span>
        </template>

        <template v-else>
            +994 *******
        </template>
    </button>
</template>

<script>
export default {
    props: {
        phone: {},
        announcementId: {
            type: [String, Number],
            required: false
        }
    },
    data() {
        return {
            showPhone: false
        }
    },
    computed: {
        callAtOnce() {
            return this.showPhone || this.isMobileBreakpoint;
        },
        id() {
            return this.$route.params.id || this.announcementId
        }
    },
    methods: {
        handleClick() {
            if (this.callAtOnce) {
                window.location.href = `tel:+${this.phone}`;
                this.trackCall(2);
            } else {
                this.showPhone = true;
                this.trackCall(1);
            }
        },
        trackCall(n) {
            this.fbTrack('Call ' + n);
            this.gtagTrack('AW-600951956/' + (n === 1 ? 'rgWNCOTA8IMCEJSZx54C' : 'VunMCPr51oMCEJSZx54C'));
            this.$axios.$get(`/announce/${this.id}/show/phone`);
        }
    }
}
</script>

<style lang="scss" scoped>
    .call-button {
        display: flex;
        flex-direction: column;
        background: #32B878;
        border-radius: 6px;
        height: 56px;
        color: #FFFFFF;
        &__title {
            font-weight: 500;
            font-size: 13px;
            line-height: 16px;
            margin-bottom: 2px;
        }
    }
</style>