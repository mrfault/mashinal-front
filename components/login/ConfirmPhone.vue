<template>
  <form class="form confirm-sms-code" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <form-text-input
        v-if="!form.staticPhone && isNewUser"
        :placeholder="$t('your_name')"
        :maxlength="30"
        auto-focus
        v-model="form.name"
      />
      <p
        v-if="!form.staticPhone && isNewUser"
        style="color: #92959a; margin-top: -12px;"
      >
        {{ $t('filled_in_at_will') }}
      </p>
      <form-text-input
        :placeholder="$t('enter_the_code')"
        :mask="'99999'"
        auto-focus
        :invalid="validator.code.$error"
        v-model="form.code"
      />
    </div>

    <p class="under-texts" v-if="showResend || codeSent || askToCallSupport">
      <a
        v-if="showResend && resendSmsAfterSecond === 0"
        class="cursor-pointer text-decoration-underline"
        @click.prevent="resendCode"
      >
        {{ $t('resend_code') }}
      </a>
      <span
        class="d-flex justify-content-between"
        v-else-if="showResend && resendSmsAfterSecond > 0"
      >
        {{ $t('enter_the_code_sent_to_your_number') }}
        <timer
          format="i:s"
          :duration="resendSmsAfterSecond"
          @timeOver="resendSmsAfterSecond = 0"
        />
      </span>
      <span v-else-if="codeSent">{{ $t('code_has_been_sent') }}</span>
      <span v-else-if="askToCallSupport">
        {{ $t('please_call_to_support') }}
      </span>
    </p>
    <button type="submit" :class="['btn', 'btn--green', { pending }]">
      {{ actionText || $t('confirm') }}
    </button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    form: {},
    validator: {},
    actionText: String,
    isNewUser: Boolean,
    skipSignIn: Boolean,
    resendData: {
      default: {},
    },
  },
  data() {
    return {
      pending: false,
      showResend: this.resendData.showResend || true,
      resendSmsAfterSecond: this.resendData.resendSmsAfterSecond || 30,
      codeSent: this.resendData.showResend === undefined || false,
      askToCallSupport: this.resendData.showResend === false || false,
    }
  },
  computed: {
    ...mapGetters(['editPath', 'editingPostAuthor']),
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateStep']),
    resendCode() {
      this.showResend = false
      this.$axios
        .$post('/resend/code', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
        })
        .then((res) => {
          this.codeSent = true
        })
    },
    submit() {
      this.validator.$touch()
      if (this.pending || this.validator.$pending || this.validator.$error)
        return
      this.pending = true
      let form = {
        name: this.form.name,
        phone: this.form.phone.replace(/[^0-9]+/g, ''),
        code: this.form.code,
      }
      if (!this.form.name) delete form.name
      this.$axios
        .$post('/confirm/phone', form)
        .then(async (data) => {
          // track conversion
          this.fbTrack('Complete Registration Api')
          this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C')
          this.$auth.setUser(data.user.original)
          this.$emit('setFinished', true)
          await this.$auth.setUserToken(data.meta.token)
          this.pending = false
          this.$nuxt.$emit('login', true)
          this.updateStep(1)
          this.$nuxt.$emit('closeModal')
          if (this.$route.query.ref) {
            if(this.editingPostAuthor == this.$auth.user.id)
              this.$router.push(decodeURI(this.$route.query.ref));
          }
          // if (this.$store.state.editing == true) {
          //   if (this.editingPostAuthor == this.$auth.user.id) {
          //     this.$router.push(
          //       this.$localePath(`/cars/announcement/${this.editPath}/edit`),
          //     )
          //   }
          //   // this.$router.push("ehtiyat-hisseleri/magazalar")
          // }
        })
        .catch((err) => {
          this.pending = false
        })
    },
  },
}
</script>
