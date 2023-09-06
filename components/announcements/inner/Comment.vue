<template>
   <div class="announcement-comment">
      <h2 class="announcement-comment__title">{{ $t('additional_info') }}</h2>

      <p class="announcement-comment__comment">{{ comment.trim() }}</p>
   </div>
</template>

<script>
   export default {
      props: {
         comment: String
      }
   }
</script>

<style lang="scss" scoped>
   .announcement-comment {
      padding: 32px;
      border-radius: 12px;
      border: 1px solid #E3E8EF;

      &__title {
         font-size: 24px;
         font-weight: 600;
         line-height: 28px;
         color: #1B2434;
      }

      &__comment {
         margin-top: 16px;
         font-size: 16px;
         font-weight: 400;
         line-height: 24px;
         color: #202939;
      }
   }

   .dark-mode {
      .announcement-comment {
         border-color: #1B2434;
         background-color: #1B2434;

         &__title {
            color: #EEF2F6;
         }

         &__comment {
            color: #EEF2F6;
         }
      }
   }

   @media (max-width: 960px) {

      .announcement-comment {
         padding: 32px;
         border-radius: 12px;
         border: 1px solid #E3E8EF;

         &__title {
            color: var(--gray-800, #1B2434);
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px;
         }

      }
   }
   @media (max-width: 385px) {
      .announcement-comment {
         padding: 16px;
      }
   }
</style>
