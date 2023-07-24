<template>
   <div class="insureCar">
      <h4 class="insureCar__title">Avtomobilini sığortala</h4>

      <ul class="insureCar__list">
         <li
            class="insureCar__list-item"
            v-for="item in list"
            :key="item.id"
         >
            <inline-svg :src="item.icon" />

            <span>{{ item.name }}</span>

            <p>{{ item.price }} AZN</p>
         </li>
      </ul>

      <button class="insureCar__btn">Sığorta al</button>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            list: [
               { id: 1, name: 'NV-nin icbari sığorta məbləği', icon: '/icons/check3.svg', price: '24' },
               { id: 2, name: 'Təqribi kasko sığorta məbləği', icon: '/icons/check3.svg', price: '98' },
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .insureCar {
      padding: 24px 20px;
      border-radius: 12px;
      border: 1px solid #2970FF;
      background-color: #FFFFFF;

      &__title {
         font-size: 18px;
         font-weight: 500;
         line-height: 22px
      }

      &__list {
         margin: 20px 0;

         &-item {
            display: flex;
            align-items: center;

            span {
               margin-left: 5px;
               color: #364152;
               font-size: 15px;
               font-weight: 400;
               line-height: 20px;
            }

            p {
               margin-left: auto;
               color: #364152;
               font-size: 18px;
               font-weight: 600;
               line-height: 22px;
            }

            &:not(:first-child) {
               margin-top: 12px;
            }
         }
      }

      &__btn {
         width: 100%;
         height: 52px;
         border: none;
         outline: none;
         color: #FFF;
         font-size: 15px;
         font-weight: 500;
         line-height: 18px;
         border-radius: 8px;
         background: #004EEB;
      }
   }
</style>
