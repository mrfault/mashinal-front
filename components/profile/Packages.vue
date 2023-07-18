<template>
   <div class="customPackages">
      <client-only>
         <div
            v-swiper:gallerySwiper="swiperOps"
            class="swiper-container pt-0"
         >
            <div class="swiper-wrapper">
               <div
                  v-for="item in packages"
                  :key="item.id"
                  class="swiper-slide"
               >
                  <div :class="['customPackages__item', {'popular' : item.is_popular}]">
                     <div class="customPackages__hat" v-if="item.is_popular">{{ $t('most_popular') }}</div>

                     <h5 class="customPackages__title">{{ item.name }}</h5>

                     <h3 class="customPackages__subtitle">{{ item.price }} AZN <span>/ {{ $t('month') }}</span> </h3>

                     <ul class="customPackages__info">
                        <li
                           :class="['customPackages__info-item', { 'opacity' : !info.checked }]"
                           v-for="info in item.items"
                           :key="info.id"
                        >
                           <inline-svg :src="'/icons/check3.svg'" v-if="info.checked" />
                           <inline-svg :src="'/icons/close2.svg'" v-else />

                           <span>{{ info.text }}</span>
                        </li>
                     </ul>

                     <button
                        :class="['btn',
                           { 'disabled' : disableBtn && !disableBtn?.is_expired && disableBtn?.hasPackage?.id !== item.id && (user?.autosalon && user?.autosalon?.status !== 0) }
                        ]"
                        @click="nextStep(item)"
                     >{{ $t('join_package', { package: item.name }) }}</button>
                  </div>
               </div>
            </div>
         </div>
      </client-only>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            swiperOps: {
               init: false,
               slidesPerView: 1.3,
               spaceBetween: 20,
               speed: 500,
               loop: false,
               centeredSlides: true,
               initialSlide: 1,
               autoHeight: true,
               breakpoints: {
                  1024: {
                     slidesPerView: 3,
                     centeredSlides: false,
                     initialSlide: 0,
                     touchRatio: 0
                  }
               }
            }
         }
      },

      methods: {
         async nextStep(item) {
            localStorage.setItem('selectedPackage', JSON.stringify(item));
            await this.$router.push(this.$localePath('/profile/packages/buy'));
         }
      },

      props: {
         packages: {
            type: Array,
            default() { return [] }
         },

         disableBtn: {
            required: false
         }
      },

      mounted() {
         setTimeout(() => {
            this.gallerySwiper.init()
         }, 100)
      }
   }
</script>

<style lang="scss">
   .customPackages {
      &__item {
         position: relative;
         height: 100%;
         max-width: 387px;
         padding: 36px 20px 30px 20px !important;
         text-align: center;
         border: 1px solid #D6E4F8;
         background-color: #FFFFFF;
         border-radius: 12px;
         &.popular {
            border-color: #155EEF;
            overflow: hidden;
            .btn {
               color: #FFFFFF;
               background-color: #29A53E;
            }
         }

         .btn {
            width: auto;
            font-size: 14px;
            line-height: 18px;
            color: #039855;
            height: 42px;
            border: 1px solid #039855;
            background-color: transparent;
            border-radius: 8px;
         }

         svg {
            max-width: 24px;
            width: 100%;
         }
      }

      &__hat {
         display: flex;
         align-items: center;
         justify-content: center;
         position: absolute;
         top: 25px;
         left: 90px;
         width: 100%;
         height: 56px;
         font-weight: 600;
         font-size: 20px;
         line-height: 24px;
         color: #FFFFFF;
         border-top-left-radius: 4px;
         border-top-right-radius: 4px;
         background-color: #155EEF;
         transform: rotate(45deg);
      }

      &__title {
         font-weight: 600;
         font-size: 20px;
         line-height: 25px;
         color: #081A3E;
         margin-bottom: 20px !important;
         text-align: left;
      }

      &__subtitle {
         display: flex;
         align-items: center;
         justify-content: start;
         font-weight: 700;
         font-size: 34px;
         line-height: 46px;
         color: #081A3E;
         text-align: left;

         span {
            margin-left: 9px;
            font-weight: 500;
            font-size: 18px;
            line-height: 22px;
            color: #081A3E;
            opacity: 0.3;
         }
      }

      &__info {
         margin-top: 23px !important;
         text-align: initial;
         min-height: 700px;
         &-item {
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            color: #081A3E;

            &.opacity {
               span {
                  opacity: 0.3;
               }
            }

            &:not(:first-child) {
               margin-top: 28px;
            }

            span {
               margin-left: 8px;
            }
         }
      }

      h1, h2, h3, h4, h5, h6, ul, p {
         margin: 0;
         padding: 0;
         list-style: none;
      }
   }

   .dark-mode {
      .customPackages {
         &__item {
            color: #FFFFFF;
            background-color: #242426;

            &:not(.popular) {
               border-color: #242426;

               .btn {
                  color: #a5fc65;
               }
            }
         }

         &__title,
         &__subtitle {
            color: #FFFFFF;

            span {
               color: silver;
               opacity: 1;
            }
         }

         &__info {
            &-item {
               color: #FFFFFF;

               &.opacity {
                  svg {
                     path {
                        stroke: #FFFFFF;
                     }
                  }
               }
            }
         }
      }
   }
</style>
