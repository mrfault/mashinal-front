<template>
   <div class="service_packages">
      <h2>Son addım, satışı sürətləndir !</h2>
      <p>Hər şey hazırdır! Turbo paketin seçməklə elanını daha gözə çarpan edəcəksən. Hər kəs sənin elanından danışacaq
         və daha tez alıcı tapacaqsan. Xeyirli olsun!</p>
      <div class="packages">
         <div
            :class="['package', 'premium_package', add_monetization === 1 ? 'selected': '' ]"
            @click="$emit('input', 1)">
            <div class="title">
               <img src="/img/turbo.png" alt="premium">
            </div>
            <ul class="content">
               <li :class="['content_list', {active: sp.status}]" v-for="sp in data?.premium" :key="sp.id">
                  {{ sp.text }}
                  <inline-svg v-if="sp.status"
                              :src="'/icons/check.svg'"/>
                  <inline-svg v-else
                              :src="'/icons/close.svg'"/>
               </li>
            </ul>
            <div class="package_price">
               <p>5.99 AZN</p>
               <span>10 AZN</span>
            </div>
            <div class="badge">
               <p>40% {{ $t('discount') }}</p>
            </div>
         </div>
         <div
            :class="['package', 'standard_package', add_monetization === 0 ? 'selected': '' ]"
            @click="$emit('input', 0)">
            <div class="title">
               <p>{{ $t('standard_announce') }}</p>
            </div>
            <ul class="content">
               <li :class="['content_list', {active: sp.status}]" v-for="sp in data?.standard" :key="sp.id">
                  {{ sp.text }}
                  <inline-svg v-if="sp.status"
                              :src="'/icons/check.svg'"/>
                  <inline-svg v-else
                              :src="'/icons/close.svg'"/>
               </li>
            </ul>
            <div class="package_price">
               <p>Pulsuz</p>
            </div>
         </div>
      </div>

      <div class="package_statistics">
         <div class="statistics_progress">
            <div class="progress" v-for="progress in statistics_data.find(s => s.id === add_monetization).statistics">
               <p>{{ progress.name }}</p>
               <div class="measure">
                  <div :class="['percentage', {active: add_monetization === 1}]"
                       :style="{width: progress.percentage + '%'}"></div>
               </div>
            </div>
         </div>
         <ul class="statistics_info">
            <li v-for="info in statistics_data.find(s => s.id === add_monetization).info">
               <p class="title">{{ info.name }}</p>
               <div class="dashed"></div>
               <p class="price">{{ info.price === 0 ? 'Ödənişsiz' : `${info.price} AZN` }}</p>
            </li>
            <li class="total" v-if="statistics_data.find(s => s.id === add_monetization).info.some(s => s.price > 0)">
               <p>CƏMİ</p>
               <p>
                  {{
                     statistics_data.find(s => s.id === add_monetization).info.reduce((acc, obj) => {
                        return acc + obj.price
                     }, 0)
                  }} AZN</p>
            </li>
         </ul>
      </div>

   </div>
</template>

<script>
export default {
   props: {
      data: {
         type: Object,
      },
      add_monetization: {
         type: Number,
         required: true
      }
   },
   data() {
      return {
         statistics_data: [
            {
               id: 1,
               statistics: [
                  {
                     id: 1,
                     name: "Baxış sayı",
                     percentage: 80
                  },
                  {
                     id: 2,
                     name: "Sevimlilərə əlavə edilmə",
                     percentage: 80
                  },
                  {
                     id: 3,
                     name: "Gələn zənglər",
                     percentage: 60
                  },
               ],
               info: [
                  {
                     id: 1,
                     name: "Elanınız 30 gün müddətinə dərc edilir",
                     price: 0
                  },
                  {
                     id: 2,
                     name: "Hər gün ön sıralarda yerləşdirilmə",
                     price: 0
                  },
                  {
                     id: 3,
                     name: "Turbo satış 10 gün ərzində",
                     price: 5.99
                  }
               ],
            },
            {
               id: 0,
               statistics: [
                  {
                     id: 1,
                     name: "Baxış sayı",
                     percentage: 35
                  },
                  {
                     id: 2,
                     name: "Sevimlilərə əlavə edilmə",
                     percentage: 40
                  },
                  {
                     id: 3,
                     name: "Gələn zənglər",
                     percentage: 30
                  },
               ],
               info: [
                  {
                     id: 1,
                     name: "Elanınız 30 gün müddətinə dərc edilir",
                     price: 0
                  }
               ]
            }
         ]
      }
   }
}
</script>

<style lang="scss" scoped>
.service_packages {
   width: 100%;
   padding: 40px 24px;
   display: flex;
   flex-direction: column;
   gap: 24px;
   background-color: #EEF2F6;
   border-radius: 16px;

   h2 {
      font-size: 32px;
      font-weight: 600;
      color: #121926;
   }

   p {
      font-size: 20px;
      font-weight: 500;
      color: #4B5565;
   }

   .packages {
      display: flex;
      gap: 20px;

      .package {
         position: relative;
         flex-grow: 1;
         display: flex;
         background-color: #fff;
         flex-direction: column;
         gap: 16px;
         padding: 20px 16px;
         border: 3px solid transparent;
         border-radius: 12px;
         cursor: pointer;

         .title {
            display: flex;
            height: 54px;

            p {
               color: #4B5565;
               font-size: 36px;
               font-weight: 600;
            }
         }


         .content {
            display: flex;
            flex-direction: column;
            gap: 20px;

            &_list {
               display: flex;
               align-items: center;
               justify-content: space-between;
               gap: 12px;
               font-size: 18px;
               font-weight: 500;
               opacity: 0.4;
               color: #1B2434;

               svg {
                  min-width: 20px;
                  min-height: 20px;
                  max-width: 20px;
                  max-height: 20px;
                  color: #CDD5DF;
               }

               &.active {
                  opacity: 1;
               }
            }
         }

         .package_price {
            display: flex;
            align-items: end;
            gap: 12px;
            margin-top: 12px;

            p {
               color: #121926;
               font-size: 32px;
               font-style: normal;
               line-height: 38px;
               font-weight: 600;
            }

            span {
               font-size: 18px;
               font-weight: 500;
               line-height: 27px;
               text-decoration-line: line-through;
               color: #697586;
            }


         }

         &.premium_package {
            .title {
               align-items: center;

               img {
                  margin: auto;
               }
            }

            .badge {
               position: absolute;
               top: 0;
               right: 6%;
               transform: translateY(-50%);
               background-color: #F81734;
               padding: 4px 6px;
               border-radius: 6px;
               font-size: 13px;
               font-weight: 600;

               p {
                  font-size: 16px;
                  font-weight: 600;
                  color: #fff;
                  text-transform: lowercase;
               }
            }
         }

         &.selected {
            border-color: #F81734;
         }
      }

   }

   .package_statistics {
      display: flex;
      flex-direction: column;
      gap: 30px;
      background-color: #fff;
      padding: 24px;
      border-radius: 12px;

      .statistics_progress {
         display: flex;
         justify-content: space-between;
         gap: 24px;

         .progress {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;

            p {
               color: #121926;
               font-size: 16px;
               font-weight: 600;
            }

            .measure {
               width: 100%;
               height: 12px;
               background-color: #EEF2F6;
               border-radius: 99px;
               overflow: hidden;

               .percentage {
                  height: 100%;
                  border-radius: 99px;
                  background-color: #9AA4B2;

                  &.active {
                     background-color: rgb(252, 181, 48);
                     background: linear-gradient(90deg, rgba(252, 181, 48, 1) 0%, rgba(242, 94, 66, 1) 100%);
                  }
               }
            }
         }
      }

      .statistics_info {
         display: flex;
         flex-direction: column;
         gap: 34px;

         li {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
            color: #1B2434;
            font-size: 17px;
            font-weight: 500;

            .dashed {
               flex: 1;
               border-top: 2px dashed #1B2434;
            }
         }
      }
   }
}

//.dark-mode {
//   .service_packages {
//      display: flex;
//      gap: 16px;
//
//      .package {
//         background-color: #364152;
//
//         .content {
//            &_list {
//               color: #CDD5DF;
//
//               svg {
//                  color: #CDD5DF;
//
//                  &.active {
//                     color: #12B76A;
//                  }
//               }
//            }
//         }
//      }
//
//      .package_price {
//         background-color: #697586;
//      }
//
//   }
//}
//
@media (max-width: 1150px) {
   .service_packages {
      padding: 40px 0 0 0;
      background-color: transparent;

      .packages {
         overflow: auto;
         padding: 10px 4px;

         .package {
            min-width: 312px;
            box-shadow: -2px -2px 3px 0px rgba(0, 0, 0, 0.10);

            &.selected {
               box-shadow: unset;
            }
         }
      }
      .package_statistics {

         .statistics_progress {
            flex-direction: column;
            gap: 24px;
         }

         .statistics_info {
            display: flex;
            flex-direction: column;
            gap: 34px;

            li {
               flex-direction: column;
               gap: 4px;
               align-items: start;
               color: #1B2434;
               font-size: 17px;
               font-weight: 500;

               &.total {
                  flex-direction: row;

                  p {
                     font-size: 18px;
                     font-weight: 600;
                     color: #1B2434 !important;
                  }
               }

               .title {
                  color: #697586;
                  font-size: 16px;
                  font-weight: 500;
               }

               .price {
                  color: #1B2434;
                  font-size: 18px;
                  font-weight: 600;
               }
            }
         }
      }
   }
}
</style>
