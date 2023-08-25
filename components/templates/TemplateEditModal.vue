<template>
   <form class="form" @submit.prevent="onSubmit" novalidate>
      <div class="mb-2 mb-lg-3">
         <form-select
            v-model="interval"
            :options="getNotificationOptions"
            :clear-option="false"
            :allow-clear="false"
            :skip-select="true"
            :show-label-only-on-action-bar="true"
            :label="$t('receive_notifications')"
         />
      </div>
      <qrcode-box/>
      <button type="submit" :class="['btn btn--green full-width', { pending }]">
         {{ $t('confirm') }}
      </button>
   </form>
</template>

<script>
import QrcodeBox from "~/components/login/Qrcode-box.vue";

export default {
   components: {QrcodeBox},
   props: {
      getNotificationOptions: {
         type: Array,
         required: true
      },
      pending: {
         type: Boolean,
         default: false
      },
      defaultInterval: {
         type: Number,
         required: true
      }
   },
   data() {
      return {
         interval: 0
      }
   },
   mounted() {
      this.interval = this.defaultInterval
   },
   methods: {
      onSubmit() {
         this.$emit('onSubmit', this.interval)
      }
   }
}
</script>

<style lang="scss" scoped>
.form {
   display: flex;
   flex-direction: column;

   &_btn {
      margin-top: auto
   }
}
</style>
