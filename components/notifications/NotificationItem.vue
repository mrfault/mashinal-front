<template>
   <div
      :class="{'ma-notification__inactive': !notification.read_at}"
      class="ma-notification"
      @click.prevent="gotoLink"
   >
      <div class="ma-notification__icon">
         <inline-svg v-if="notification.read_at" src="/new-icons/notification.svg"/>
         <inline-svg v-else src="/new-icons/notification-read.svg"/>
      </div>
      <div class="ma-notification__content">
         <div class="ma-notification__content--body">
            <h6 class="ma-notification__content--title">{{ notification.title }}</h6>
            <p class="ma-notification__content--desc" v-html="notification.body"></p>
         </div>
         <span class="ma-notification__date">
               {{ date }}
            </span>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      isActive: Boolean,
      link: String,
      date: String,
      notification: Object,
      page: Number,
   },
   methods: {
      gotoLink() {
         const routePath = this.link;
         window.open(routePath, '_blank');
         this.$store.dispatch('getNotifications', this.page);
         this.$nuxt.refresh()
      }
   }
}
</script>

<style lang="scss">
.ma-notification {
   cursor: pointer;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 25px 16px;
   border-radius: 12px;
   border: 1px solid #84ADFF;
   width: 100%;
   background: #fff;
   margin-bottom: 16px;

   &:hover{
      background: rgba(#2970FF, .1);
   }

   &__content {
      width: calc(100% - 60px);
      display: flex;
      justify-content: center;

      &--body {
         width: calc(100% - 150px);
      }

      &--title {
         font: 600 16px/24px 'TTHoves';
         color: #1B2434;
         margin-bottom: 4px;
      }

      &--desc {
         font: 500 15px/18px 'TTHoves';
         color: #364152;
      }
   }

   &__icon {
      width: 36px;
      margin-right: 16px;

      svg {
         width: 100%;
         height: 100%;
         object-fit: contain;
      }
   }

   &__date {
      width: 150px;
      text-align: right;
      font: 500 14px/16px 'TTHoves';
      color: #4B5565;
      margin: auto 0;
   }

   &__inactive {
      border: 1px solid #CDD5DF !important;
   }
}


.dark-mode {
   .ma-notifications__title {
      color: #fff !important;
   }

   .ma-notification {
      background: #1B2434;



      &__content {
         &--title {
            color: #fff;
         }

         &--desc {
            color: #fff;
         }
      }

      &__date {
         color: #fff;
      }

      &__inactive {
         border: 1px solid #cdd5df;
      }

      &:hover {
         background: #121926;
      }
   }
}


@media(max-width: 599px) {
   .ma-notification {
      background: #fff;
      border: none;
      border-bottom: 1px solid #EEF2F6;
      border-radius: 0;
      margin-bottom: 0;
      padding: 16px;

      &__content {
         flex-wrap: wrap;

         &--body {
            width: 100%;
         }

         &--title {

         }

         &--desc {

         }
      }

      &__date {
         width: 100%;
         text-align: left;
         margin-top: 4px;
      }

      &__inactive {
         border: none !important;
         border-bottom: 1px solid #EEF2F6 !important;
         padding-bottom: 16px;
         border-radius: 0;
      }
   }
}

@media(max-width: 599px) {
   .dark-mode {
      .ma-notification {
         background: #121926;
         border-bottom: 1px solid #364152;

         &__content {
            &--desc {
               color: #CDD5DF;
            }
         }

         &__date {
            color: #9AA4B2;
         }

         &__inactive {
            border-bottom: 1px solid #364152 !important;
         }
      }
   }
}

</style>
