<template>
   <div
       class="announcementTitle"
       v-if="announcement?.type === 'light_vehicle' || isMoto"
   >
      <template v-if="announcement?.type === 'light_vehicle'">
         <p>
            {{ announcement?.car_catalog?.brand.name }}
            {{ announcement?.car_catalog?.model.name }}
         </p>

         <p>
            {{announcement?.car_catalog?.main[" "]?.obem}} {{ $t('char_litre') }}
            {{announcement?.car_catalog?.generation?.start_year}} {{ $t('year') }}
            {{announcement?.mileage}} {{ $t('char_kilometre') }}
         </p>
      </template>

      <template v-else-if="isMoto">
         <p>
            {{ announcement?.brand?.name }}
            {{ announcement?.model?.name }}
         </p>

         <p>
            {{announcement?.power}} {{ $t('char_h_power') }}
            {{announcement?.year}} {{ $t('year') }}
            {{announcement?.mileage}} {{ $t('char_kilometre') }}
         </p>
      </template>
   </div>
</template>

<script>
   export default {
      computed: {
         isMoto() {
            return this.announcement.type === 'motorcycle' ||
                this.announcement.type === 'scooter' ||
                this.announcement.type === 'moto_atv'
         }
      },

      props: {
         announcement: {
            type: Object,
            default() { return {} }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .announcementTitle {
      margin-bottom: 10px;

      p {
         color: #1B2434;
         font-size: 18px;
         font-weight: 500;
         line-height: 24px;

         &:last-child {
            margin-bottom: 4px;
         }
      }
   }

   .dark-mode {
      .announcementTitle {
         p {
            color: #EEF2F6;
         }
      }
   }
</style>
