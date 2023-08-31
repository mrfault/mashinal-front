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
         key="product_code"
         v-model="form.title"
         :class="{form_error: formError.includes('title')}"
         :placeholder="$t('headline')"
         :maxlength="32"
         :invalid="formError.includes('title')"
      />
      <form-textarea
         v-model="form.message"
         :placeholder="$t('additional_info')"
         :maxlength="600"
      />
      <button
              :class="['btn', 'full-width', 'btn--blue-new', 'active', {pending}]">
         Müraciəti göndər
      </button>
   </form>
</template>

<script>
import {email, required, requiredIf} from "vuelidate/lib/validators";

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
               .$post('https://v2dev.mashin.al/api/v2/common/mail/inform-us', this.form)
            this.$v.form.$reset()
            this.$toasted.success('Getdi')
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
