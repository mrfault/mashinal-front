<template>
   <div class="ma-automobile-card">
      <div class="ma-automobile-card__image">
         <img :src="item.generation.image"
              @error="$event.target.src = '/placeholder-car.png'">
      </div>
      <div class="ma-automobile-card__content">
         <h4 class="ma-automobile-card__content--brand">{{ item.brand.name }} {{ item.model.name }}
            {{ item.generation.start_year }}-{{ item.generation.end_year }}</h4>
         <p class="ma-automobile-card__content--desc">{{ $t(item.car_type.name) }} / {{ 2.4 }}L / {{ 'benzin' }}</p>
      </div>
      <automobile-card-actions :announcement="item"/>
   </div>
</template>

<script>
import AutomobileCardActions from "~/components/profile/automobiles/AutomobileCardActions";

export default {
   props: {
      item: Object,
   },
   components: {
      AutomobileCardActions
   }
}
</script>

<style lang="scss" scoped>
.ma-automobile-card {
   width: 100%;
   min-height: 104px;
   border: 1px solid rgba(154, 164, 178, 1);
   border-radius: 12px;
   padding: 16px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   overflow: visible;

   &__image {
      width: 104px;
      height: 72px;
      border-radius: 8px;
      box-sizing: border-box;
      overflow: hidden;
      background: rgba(#cacaca, 0.3);

      img {
         width: 100%;
         height: 100%;
         object-fit: contain;
      }
   }

   &__content {
      padding: 0 16px;
      width: calc(100% - 104px - 24px);

      &--brand {
         font: 600 18px/22px 'TTHoves';
         color: #1b2434;
         margin-bottom: 4px;
      }

      &--desc {
         font: 400 18px/22px 'TTHoves';
         color: #364152;
      }
   }

   &__actions {

      //width: 24px;
      //position: relative;
      //.announcement-actions{
      //   position: relative;
      //}
   }
}
</style>
