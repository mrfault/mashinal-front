<template>
   <div class="announcement-comment">
      <h2 class="announcement-comment__title">{{ $t('additional_info') }}</h2>

      <p
         class="announcement-comment__comment"
         :class="{'ellipsis' : comment?.length > 538 && !seeMore}"
      >{{ comment.trim() }}</p>

      <button
         class="announcement-comment__seeMore"
         @click="seeMore = true"
         v-if="!seeMore"
      >{{ $t('see_more') }}...</button>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            seeMore: false
         }
      },

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
         white-space: pre-wrap;

         &.ellipsis {
            display: -webkit-box;
            line-clamp: 7;
            -webkit-line-clamp: 7;
            overflow: hidden;
            -webkit-box-orient: vertical;
         }
      }

      &__seeMore {
         all: unset;
         margin-top: 5px;
         color: #155EEF;
         font-size: 16px;
         font-weight: 400;
         line-height: 24px;
         text-decoration-line: underline;
         cursor: pointer;
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
