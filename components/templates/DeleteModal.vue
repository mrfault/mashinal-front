<template>
   <form class="delete_modal" @submit.prevent="onSubmit">
      <p>{{ $t('template_delete_warning') }}</p>
      <div class="delete_modal_buttons">
         <button class="btn btn--white" @click="cancel">{{ $t('reject') }}</button>
         <button :class="['btn', 'btn--white', {pending}]">{{ $t('delete_template') }}</button>
      </div>
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
   methods: {
      cancel() {
         this.$emit('cancel')
      },
      onSubmit() {
         this.$emit('onSubmit')
      }
   }
}
</script>

<style lang="scss" scoped>
.delete_modal {
   display: flex;
   flex-direction: column;
   gap: 24px;

   p {
      font-size: 18px;
      font-weight: 400;
      white-space: nowrap;
   }

   &_buttons {
      display: flex;
      gap: 16px;

      button {
         flex: 1;
      }
   }
}

</style>
