<template>
   <div class="customPackages">
      <ul class="customPackages__list">
         <li
            :class="['customPackages__list-item', {'popular' : item.popular}]"
            v-for="item in packages"
            :key="item.id"
         >
            <div class="customPackages__hat" v-if="item.popular">Ən Populyar</div>

            <h5 class="customPackages__title">{{ item.title }}</h5>

            <h3 class="customPackages__subtitle">{{ item.price }} <span>/ ay</span></h3>

            <ul class="customPackages__info">
               <li
                  class="customPackages__info-item"
                  v-for="info in item.list"
                  :key="info.id"
               >
                  <inline-svg :src="'/icons/check2.svg'" v-if="info.checked" />
                  <inline-svg :src="'/icons/close2.svg'" v-else />

                  <span>{{ info.name }}</span>

               </li>

               <li class="customPackages__info-item btnWrapper">
                  <button class="btn full-width">{{ item.title }} paketinə qoşul</button>
               </li>
            </ul>
         </li>
      </ul>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            packages: [
               {
                  id: 1,
                  title: 'Standart',
                  price: '300 AZN',
                  list: [
                     { id: 1, name: '50 elan', checked: true },
                     { id: 2, name: '150 AZN reklam büdcəsi', checked: true },
                     { id: 3, name: 'Avtosalon üçün korporativ səhifə', checked: true },
                     { id: 4, name: 'Platforma daxili mesaj sistemi', checked: true },
                     { id: 5, name: 'Xüsusi fərdi köməkçi və ay ərzində  2 dəfə sayt-vizit', checked: true },
                     { id: 6, name: 'Statistik və analitik məlumatlar', checked: true },
                     { id: 7, name: 'Zəng tarixçəsi', checked: true },
                     { id: 8, name: 'Sosial şəbəkələrdə reklam (büdcəsiz)', checked: true },
                     { id: 9, name: 'Sosial şəbəkələrdə reklam (50 AZN büdcə ilə)', checked: false },
                     { id: 10, name: 'Sosial şəbəkələr üçün foto çəkiliş', checked: false }
                  ]
               },
               {
                  id: 2,
                  title: 'Biznes',
                  price: '500 AZN',
                  popular: true,
                  list: [
                     { id: 1, name: '70 elan', checked: true },
                     { id: 2, name: '250 AZN reklam büdcəsi', checked: true },
                     { id: 3, name: 'Avtosalon üçün korporativ səhifə', checked: true },
                     { id: 4, name: 'Platforma daxili mesaj sistemi', checked: true },
                     { id: 5, name: 'Xüsusi fərdi köməkçi və ay ərzində  2 dəfə sayt-vizit', checked: true },
                     { id: 6, name: 'Statistik və analitik məlumatlar', checked: true },
                     { id: 7, name: 'Zəng tarixçəsi', checked: true },
                     { id: 8, name: 'Sosial şəbəkələrdə reklam (büdcəsiz)', checked: true },
                     { id: 9, name: 'Sosial şəbəkələrdə reklam (50 AZN büdcə ilə)', checked: true },
                     { id: 10, name: 'Sosial şəbəkələr üçün foto çəkiliş', checked: true },
                     { id: 11, name: 'Sosial şəbəkələr üçün video çəkiliş (30 saniyə)', checked: false },
                     { id: 12, name: 'Sayt daxili bannerlər', checked: false }
                  ]
               },
               {
                  id: 3,
                  title: 'Biznes+',
                  price: '1000 AZN',
                  list: [
                     { id: 1, name: '100 elan', checked: true },
                     { id: 2, name: '500 AZN reklam büdcəsi', checked: true },
                     { id: 3, name: 'Avtosalon üçün korporativ səhifə', checked: true },
                     { id: 4, name: 'Platforma daxili mesaj sistemi', checked: true },
                     { id: 5, name: 'Xüsusi fərdi köməkçi və ay ərzində  2 dəfə sayt-vizit', checked: true },
                     { id: 6, name: 'Statistik və analitik məlumatlar', checked: true },
                     { id: 7, name: 'Zəng tarixçəsi', checked: true },
                     { id: 8, name: 'Sosial şəbəkələrdə reklam (büdcəsiz)', checked: true },
                     { id: 9, name: 'Sosial şəbəkələrdə reklam (100 AZN büdcə ilə)', checked: true },
                     { id: 10, name: 'Sosial şəbəkələr üçün foto çəkiliş', checked: false },
                     { id: 11, name: 'Sosial şəbəkələr üçün video çəkiliş (30 saniyə)', checked: true },
                     { id: 12, name: 'Sayt daxili bannerlər', checked: true }
                  ]
               }
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .customPackages {
      &__list {
         display: flex;
         justify-content: space-between;

         &-item {
            position: relative;
            width: 100%;
            max-width: 387px;
            padding: 36px 20px 101px 20px;
            border-radius: 4px;
            text-align: center;
            border: 1px solid #D6E4F8;
            background-color: #FFFFFF;

            &.popular {
               border-color: #246EB2;

               .btnWrapper {
                  .btn {
                     color: #FFFFFF;
                     background-color: #29A53E;
                  }
               }
            }
         }
      }

      &__hat {
         display: flex;
         align-items: center;
         justify-content: center;
         position: absolute;
         top: -25px;
         left: -1px;
         width: 100.5%;
         height: 36px;
         font-weight: 500;
         font-size: 16px;
         line-height: 19px;
         color: #FFFFFF;
         border-top-left-radius: 4px;
         border-top-right-radius: 4px;
         background-color: #246EB2;
      }

      &__title {
         font-weight: 600;
         font-size: 20px;
         line-height: 25px;
         color: #081A3E;
         margin-bottom: 20px !important;
      }

      &__subtitle {
         display: flex;
         align-items: center;
         justify-content: center;
         font-weight: 700;
         font-size: 40px;
         line-height: 50px;
         color: #081A3E;

         span {
            margin-left: 9px;
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
            color: #081A3E;
            opacity: 0.3;
         }
      }

      &__info {
         margin-top: 23px !important;
         text-align: initial;

         &-item {
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            color: #081A3E;

            &:not(:first-child) {
               margin-top: 28px;
            }

            span {
               margin-left: 8px;
            }
         }

         .btnWrapper {
            position: absolute;
            bottom: 36px;
            width: calc(100% - 40px);

            .btn {
               font-size: 14px;
               line-height: 18px;
               color: #29A53E;
               height: 42px;
               border: 1px solid #29A53E;
               background-color: transparent;
            }
         }
      }

      h1, h2, h3, h4, h5, h6, ul {
         margin: 0;
         padding: 0;
         list-style: none;
      }
   }
</style>
