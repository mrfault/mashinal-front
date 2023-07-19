<template>
   <div class="why-register">
      <div class="why-register__image">
         <inline-svg :src="'/new-icons/stars.svg'"/>
      </div>
      <div class="why-register__content">
         <h4 class="ma-title--sm">{{$t('register_question1')}}</h4>
         <p class="why-register__content--desc">{{$t('register_question2')}}</p>
      </div>

   </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.why-register {
   width: 100%;
   border-radius: 12px;
   background: #eef2f6;
   min-height: 100px;
   margin-top: 32px;
   padding: 16px;
   display: flex;
   align-items: center;
   &__image{
      padding-right: 12px;
      width: 44px;
   }
   &__content{
      width: calc(100% - 44px);
      h4{
         margin-bottom: 4px;
      }
      &--desc{
         font: 400 14px/20px 'TTHoves';
         color: #4B5565;
      }
   }
}
</style>
