<template>
   <div class="customPackages">
      <client-only>
         <div
            v-swiper:gallerySwiper="swiperOps"
            class="swiper-container"
         >
            <div class="swiper-wrapper">
               <div
                  v-for="item in packages"
                  :key="item.id"
                  class="swiper-slide"
               >
                  <div :class="['customPackages__item', {'popular' : item.is_popular}]">
                     <div class="customPackages__hat" v-if="item.is_popular">Ən Populyar</div>

                     <h5 class="customPackages__title">{{ item.name }}</h5>

                     <h3 class="customPackages__subtitle">{{ item.price }} AZN<span>/ {{ $t('month') }}</span></h3>

                     <ul class="customPackages__info">
                        <li
                           :class="['customPackages__info-item', { 'opacity' : !info.checked }]"
                           v-for="info in item.items"
                           :key="info.id"
                        >
                           <inline-svg :src="'/icons/check2.svg'" v-if="info.checked" />
                           <inline-svg :src="'/icons/close2.svg'" v-else />

                           <span>{{ info.text }}</span>
                        </li>
                     </ul>

                     <button class="btn" @click="nextStep(item)">{{ $t('join_package', { package: item.name }) }}</button>
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
            // await this.$store.dispatch('packages/getSelectedPackage', item);
            await this.$router.push(this.$localePath('/profile/packages/buy'));
         }
      },

      props: {
         packages: {
            type: Array,
            default() { return [] }
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
         padding: 36px 20px 100px 20px !important;
         border-radius: 4px;
         text-align: center;
         border: 1px solid #D6E4F8;
         background-color: #FFFFFF;

         &.popular {
            border-color: #246EB2;

            .btn {
               color: #FFFFFF;
               background-color: #29A53E;
            }
         }

         .btn {
            position: absolute;
            left: 20px;
            bottom: 36px;
            width: calc(100% - 40px);

            font-size: 14px;
            line-height: 18px;
            color: #29A53E;
            height: 42px;
            border: 1px solid #29A53E;
            background-color: transparent;
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
         top: -25px;
         left: -1px;
         width: 101%;
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
</style>
