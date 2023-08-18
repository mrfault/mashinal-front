<template>
   <div class="ma-automobile-card" :key="keyItem">
      <div class="ma-automobile-card__image">
         <img :src="item.generation.image"
              @error="$event.target.src = '/placeholder-car.png'">
      </div>
      <div class="ma-automobile-card__content">
         <h4 class="ma-automobile-card__content--brand">{{ item.brand.name }} {{ item.model.name }}
            {{ item.generation.start_year }}-{{ item.generation.end_year }}</h4>
         <p class="ma-automobile-card__content--desc">{{ card_desc_1 }} / {{ 2.4 }}{{$t('L')}} / {{ $t('benzin') }}</p>
      </div>
      <automobile-card-actions @openEditModal="openEditModal(item)" :announcement="item" :dropdown-id="item.id"/>
   </div>
</template>

<script>
import AutomobileCardActions from "~/components/profile/automobiles/AutomobileCardActions";

export default {
   props: {
      item: Object,
      keyItem: Number,
   },
   components: {
      AutomobileCardActions
   },
   methods:{
      openEditModal(item){
         console.log("card openEditModal")
         this.$emit('openEditModal',item)
      },
   },
   computed:{
      card_desc_1(){
         return this.$t(this.item.car_type.name.toLocaleLowerCase())
      },
   }
}
</script>

<style lang="scss">
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
         object-fit: cover;
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
         //text-transform: capitalize;
      }
   }

   &__actions {
   }
}

.dark-mode{
   .ma-automobile-card {
      border: 1px solid #364152;
      background:  #364152;

      &__image {
         background: #364152;

         img {
            width: 100%;
            height: 100%;
            object-fit: cover;
         }
      }

      &__content {
         padding: 0 16px;
         width: calc(100% - 104px - 24px);

         &--brand {
            color: #fff;
         }

         &--desc {
            color: #fff;
         }
      }


   }
}

.automobile-card-actions {
   position: relative;
   .announcement-actions {
      height: 100%;
      position: initial;
      border: none;


      &__button {
         border: none;
         padding: 10px 0;
         height: 50px;
         width: 100%;
         cursor: pointer;
         z-index: 0 !important;

         svg {
            path {
               stroke: #1B2434 !important;
            }
         }

         &:hover {
            background: #cacaca;
         }
      }

      &__content {
         position: absolute;
         top: 0;
         left: calc(-100% - 180px);
         z-index: 2 !important;
         width: 200px;

         background: #fff;
      }

      .btn-transparent {
         width: 44px;
         height: 44px;
         border: none !important;

         &:hover {
            background: #cacaca;
         }
      }
   }
}


.dark-mode {
   .automobile-card-actions {
      .announcement-actions__button {
         background: #1b2434 !important;

         svg {
            path {
               stroke: #fff !important;
            }
         }
      }
   }
}
</style>
