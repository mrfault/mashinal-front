<template>
   <form class="feedback_form" @submit.prevent="onSubmit">
      <form-text-input
         v-model="form.name"
         :class="{form_error: $v.form.name.$error || formError.includes('name')}"
         :placeholder="$t('your_name') + '*'"
         :invalid="$v.form.name.$error || formError.includes('name')"
         :disabled="loggedIn"
      />
      <form-text-input
         v-model="form.email"
         :class="{form_error: $v.form.email.$error || formError.includes('email')}"
         :placeholder="$t('email') + '*'"
         :mask="$maskEmail()"
         :invalid="$v.form.email.$error || formError.includes('email')"
      />
      <form-text-input
         key="phone"
         :placeholder="$t('mobile_phone_number') + '*'"
         :class="{form_error: $v.form.phone.$error || formError.includes('phone')}"
         v-model="form.phone"
         :mask="$maskPhone()"
         :invalid="$v.form.phone.$error || formError.includes('phone')"
      />
      <form-text-input
         key="title"
         v-model="form.title"
         :class="{form_error: $v.form.title.$error || formError.includes('title')}"
         :placeholder="$t('headline')"
         :maxlength="50"
         :invalid="$v.form.title.$error || formError.includes('title')"
      />
      <form-textarea
         v-model="form.message"
         :class="{form_error: $v.form.message.$error || formError.includes('message')}"
         :placeholder="$t('request_text')"
         :maxlength="500"
         :invalid="$v.form.message.$error || formError.includes('message')"
      />
      <button
              :class="['btn', 'full-width', 'btn--blue-new', 'active', {pending}]">
         {{ $t('send') }}
      </button>
   </form>
</template>

<script>
import {email, maxLength, required} from "vuelidate/lib/validators";

export default {
   data() {
      return {
         formError: [],
         pending: false,
         form: {
            name: "",
            email: "",
            phone: "",
            title: "",
            message: ""
         }
      }
   },
   mounted() {
      if (Object.values(this.user).length) {
         this.form.name = this.user.full_name
         this.form.email = this.user.email
         this.form.phone = this.user.phone
      }
   },
   methods: {
      async onSubmit() {
         this.$v.form.$touch()
         if (this.$v.form.$error) {
            this.$toasted.error(this.$t('required_fields'));
            return;
         }
         this.pending = true;
         try {
            await this.$axios
               .$post(this.$env().API_SECRET + '/common/mail/inform-us', this.form)
            this.$v.form.$reset()
            this.$toasted.success(this.$t('request_success_message'))
            this.$emit("close")
         } catch (e) {
            const errors = []
            for (const key in e.response.data?.data) {
               errors.push(key)
            }
            this.formError = errors
         } finally {
            this.pending = false;
         }
      }
   },
   validations() {
      return {
         form: {
            name: {required},
            email: {
               email, required
            },
            title: {maxLength: maxLength(35)},
            phone: {required},
            message: {required}
         }
      }
   }
}
</script>

<style lang="scss" scoped>
.feedback_form {
   display: flex;
   flex-direction: column;
   gap: 20px;
}
</style>
