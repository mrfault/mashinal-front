<template>
   <nuxt-link class="ma-garage-card" :to="$localePath(item.url)">

      <div class="ma-garage-card__body" v-if="true">

         <div class="ma-garage-card--image">
            <img :src="`/new-icons/profile/${item.image}`" alt="">
         </div>
         <h5 class="ma-garage-card__title">{{ $t(item.title) }}</h5>

         <p class="ma-garage-card__description">{{ $t(item.description) }}</p>
      </div>
   </nuxt-link>
</template>

<script>
import LetterOfAttorneyButton from '~/components/garage/loa/LetterOfAttorneyButton';

export default {
   components: { LetterOfAttorneyButton },

   props: {
      shouldExtendContract: Boolean,
      item: Object,
   },

   computed: {
      isSafari() {
         return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      }
   },

   methods: {
      setStoreBalance(link) {
         this.$store.commit('mutate', {
            property: 'balanceHasAnimation',
            value: true,
         })
         this.$router.push(link)
      },

      checkIfSafari(link) {
         if (this.isSafari) {
            this.setStoreBalance(link)
         } else {
            alert('hayhuy')
         }
      }
   }
}
</script>

<style lang="scss">
.ma-garage-card {
   background: #EEF2F6;
   border-radius: 12px;
   margin-bottom: 18px;
   padding: 16px;
   width: 100%;
   height: fit-content;
   display: block;
   &--image{
      width: 100%;
      height: 57px;
      margin-bottom: 16px;
      img{
         width: 100%;
         height: 100%;
         object-fit: contain;
         object-position: left;
      }
   }
   &__title{
      font: 600 18px/22px 'TTHoves';
      color: #121926;
      margin-bottom: 6px;
   }
   &__description{
      font: 400 15px/20px 'TTHoves';
      color: #697586;
   }
}

.dark-mode{
   .ma-garage-card{
      background: #1B2434 !important;
      &__description{
         color: #fff;
      }
   }
}
</style>
