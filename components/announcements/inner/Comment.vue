<template>
   <div class="announcement-comment">
      <h2 class="announcement-comment__title">Əlavə məlumatlar</h2>

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
</style>
