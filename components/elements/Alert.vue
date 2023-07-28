<template>
   <div class="alert" :class="'alert-'+type">
      <div class="alert_icon" v-if="type === 'success'">
         <inline-svg :src="'/icons/success.svg'"/>
      </div>
      <div class="alert_icon" v-if="type === 'error'">
         <inline-svg :src="'/icons/error.svg'"/>
      </div>
      <div class="alert_icon" v-if="type === 'warning'">
         <inline-svg :src="'/icons/warning.svg'"/>
      </div>
      <div class="alert_icon" v-if="type === 'info'">
         <inline-svg :src="'/icons/info.svg'"/>
      </div>
      <div class="alert_content" v-html="content"></div>
   </div>
</template>

<script>
export default {
   props: {
      type: {
         type: String
      },
      content: {
         type: String
      }
   },
   data() {
      return {
         alertType: {
            success: 'success',
            info: 'info',
            error: 'error',
            warning: 'warning'
         }
      }
   }
}
</script>

<style lang="scss">
.alert {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 16px 10px 16px;
   border-radius: 8px;
   min-height: 60px;
}
.alert.alert-success {
   background-color: #E6F4EA;
   border: 1px solid #CDEBD7;
}
.alert.alert-info {
   border: 1px solid #EEF2F6;
   background: linear-gradient(0deg, #EEF2F6, #EEF2F6),
   linear-gradient(0deg, #F8FAFC, #F8FAFC);
}
.alert.alert-warning {
   background-color: #FFF7E6;
   border: 1px solid #FFEBC2;
}
.alert.alert-error {
   background-color: #FCE8E8;
   border: 1px solid #F8C9C9;
}
.alert .alert_icon {
   width: 24px;
   height: 24px;
   margin-right: 10px;
}
.alert .alert_content{
   font-size: 14px;
   font-weight: 400;
   line-height: 20px;
   letter-spacing: 0.1px;
   text-align: left;

}
.alert .alert_content span{
   color: #155EEF;
}

.dark-mode{
   .alert.alert-info {
      border: 1px solid #1B2434;
      background: linear-gradient(0deg, #1B2434, #1B2434),
      linear-gradient(0deg, #1B2434, #1B2434);
   }
}
</style>
