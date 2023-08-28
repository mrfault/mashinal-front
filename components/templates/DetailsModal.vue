<template>
   <ul class="template_details">
      <li class="template_details_list" v-for="detail in data">
         <p>{{ $t(`template_values.${detail.key}`) }}</p>
         <p class="template_details_list_value" v-if="detail.key !== 'additional_brands'">{{ detail.value }}</p>
         <ul v-else>
            <li class="template_details_list_value" v-for="(val, i) in detail.value">{{val}}</li>
         </ul>
      </li>
   </ul>
</template>

<script>
export default {
   props: {
      data: {
         type: Array,
         required: true
      }
   }
}
</script>

<style lang="scss" scoped>
.template_details {
   display: flex;
   flex-direction: column;
   gap: 12px;
   padding-left: 0 !important;
   padding-right: 8px;

   &_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      p {
         color: #364152;
         font-size: 18px;
         font-weight: 400;
         width: calc(50% - 8px);
      }

      &_value {
         color: #121926;
         font-weight: 500;
         text-align: right;
      }
   }
}

.dark-mode {
   .template_details {

      &_list {

         p {
            color: #fff;
         }

         &_value {
            color: #fff;
         }
      }
   }
}
</style>
