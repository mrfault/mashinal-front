<template>
   <form class="feedback_form">
      <!--         :class="{form_error: $v.authForm.email.$error}"-->
      <!--         :invalid="$v.authForm.email.$error || authError.includes('email')"-->
      <form-text-input
         v-model="form.email"
         :placeholder="$t('email') + '*'"
         :mask="$maskEmail()"
      />
      <!--         :class="{form_error: $v.authForm.phone.$error || authError.includes('phone')}" -->
      <!--         :invalid="$v.authForm.phone.$error || authError.includes('phone')"-->
      <form-text-input
         key="phone"
         :placeholder="$t('mobile_phone_number') + '*'"
         v-model="form.phone"
         :mask="$maskPhone()"
      />
      <form-text-input
         key="product_code"
         v-model="form.title"
         :placeholder="$t('headline')"
         maxlength="32"
      />
      <form-textarea
         v-model="form.comment"
         :placeholder="$t('additional_info')"
         :maxlength="600"
      />
      <button type="button"
              :class="['btn', 'full-width', 'btn--blue-new', 'active', {pending}]">
         Müraciəti göndər
      </button>
   </form>
</template>

<script>
export default {
   props: {
      pending: {
         type: Boolean,
         default: false
      }
   },
   data() {
      return {
         form: {
            email: "",
            phone: "",
            title: "",
            content: ""
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
