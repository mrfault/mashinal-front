<template>
   <div>
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <h2 class="ma-notifications__title">{{ $t('notifications') }}</h2>
      </div>
      <div :class="{'px-0':isMobileBreakpoint}" class="container ">
         <div class="ma-notifications">

            <template v-if="notifications.data.length && getNotificationsList.length">
               <NotificationItem
                  v-for="item in getNotificationsList"
                  :date="getDateString(item)" :link="getRoutePath(item)"
                  :notification="item"
                  :page="notifications.current_page"
               ></NotificationItem>

            </template>

            <div v-else>
               <not-found :text="$t('notification_not_found')" img-src="/img/notification_icon.png"
                          textClass="text-black">
                  <nuxt-link :to="$localePath('/')" class="btn btn--green">
                     <icon name="arrow-left"/>
                     {{ $t('back_to_home') }}
                  </nuxt-link>
               </not-found>
            </div>

            <pagination
               v-if="notifications && notifications.last_page > 1"
               :page-count="notifications.last_page"
               :value="notifications.current_page"
               @change-page="changePage"
            />


         </div>
      </div>
   </div>
</template>


<style lang="scss" scoped>
.ma-notifications {
   &__title {
      font: 700 28px/32px 'TTHoves';
      margin-bottom: 32px;
      color: #1b2434;
   }
}

.new-notification-dot {
   display: block;
   width: 5px;
   height: 5px;
   background: #F81734;
   border-radius: 50%;
   margin-right: 7px;
   margin-left: 3px;
}

.custom-col-12 {
   padding: 0px 28px 0px 10px;
}

.notification-info {
   display: flex;
   flex-direction: column;
   align-items: start;
}
</style>

<script>
import {mapGetters} from "vuex";
import NotFound from "~/components/elements/NotFound";
import NotificationItem from "~/components/notifications/NotificationItem";

export default {
   components: {NotFound, NotificationItem},
   async fetch({store}) {
      await store.dispatch('getNotifications')
   },
   nuxtI18n: {
      paths: {
         az: '/bildirishler'
      }
   },
   middleware: ['auth_general'],
   head() {
      return this.$headMeta({
         title: this.$t('notifications'),
         description: this.$t('notifications')
      });
   },
   methods: {
      getDateString(item) {
         const apiDate = new Date(item.created_at);
         const today = new Date();

         // Check if the year, month, and day match
         if (
            apiDate.getFullYear() === today.getFullYear() &&
            apiDate.getMonth() === today.getMonth() &&
            apiDate.getDate() === today.getDate()
         ) {
            // If the date is today, format it as 'today 12.03'
            const obj = this.$formatDate(item.created_at, 'HH:mm');
            return this.$t('today') + " " + obj.az
         } else {
            // If it's not today, format the date in your preferred way
            const obj = this.$formatDate(item.created_at, 'D.MM.YYYY HH:mm');
            return obj.az
         }
      },
      async changePage(page) {
         await this.$store.dispatch('getNotifications', 'page=' + page)
         this.scrollTo('.vehicle-specs', [-15, -20]);
         window.scrollTo({top: 0})
      },
      getAnnounceTypePath(type) {
         switch (type) {
            case 'App\\Announcement':
               return '/cars/announcement';
            case 'App\\Motorcycle':
            case 'App\\Scooter':
            case 'App\\MotoAtv':
               return '/moto/announcement';
            case 'App\\Commercial':
               return '/commercial/announcement';
            case 'App\\Part':
               return '/parts/announcement';
         }
      },
      getRoutePath(n) {
         if (n?.notifiable?.type) {
            switch (n.notifiable.type) {
               case 6 :
                  return this.$localePath('/plates/' + n.value)
               case 2 :
                  if (this.getAnnounceTypePath(n.notifiable_type) == '/cars/announcement') {
                     return this.$localePath(this.getAnnounceTypePath(n.notifiable_type) + '/' + Math.floor(n.notifiable.id_unique / 10))
                  } else {
                     return this.$localePath(this.getAnnounceTypePath(n.notifiable_type) + '/' + n.notifiable.id_unique)
                  }
            }
            return '/';
         } else {
            switch (n?.route) {
               case '/messages_bnb' :
                  return this.$localePath('/profile/messages?group=' + n?.value)
               case '/announcement_details' :
                  return this.$localePath(this.getAnnounceTypePath(n?.notifiable_type) + '/' + (n?.notifiable?.id || n?.notifiable_id))
               case '/garage_bnb' :
                  return this.$localePath(`/garage?id=${n?.notifiable?.id}`)
               case '/balance' :
                  return this.$localePath('/profile/balance')
               case '/business_profiles' :
                  return this.$localePath('/salons')
               case '/search_templates' :
                  return this.$localePath('/profile/templates')
               case '/salons/offer' :

                  var url = this.isMobileBreakpoint ? '/salons/offer/' : this.$localePath('/salons/offer?param=all&c=');

                  var offerId = n.hasOwnProperty('notifiable_id') && n?.notifiable_id != null ? n?.notifiable_id : false

                  if (offerId) url += offerId
                  return url

               case '/salons/offer/new-message' :

                  var url = this.isMobileBreakpoint ? '/salons/offer/' : this.$localePath('/salons/offer?param=sended&c=');

                  var offerId = n.hasOwnProperty('notifiable_id') && n?.notifiable_id != null ? n?.notifiable_id : false

                  if (offerId) url += offerId
                  return url

               case '/offer/offers/new-message' :

                  var url = this.isMobileBreakpoint ? '/offer/' : this.$localePath('/offer/offers?param=all&c=');

                  var offerId = n.hasOwnProperty('notifiable_id') && n?.notifiable_id != null ? n?.notifiable_id : false

                  if (offerId) url += offerId
                  return url

               case '/offer/offers' :
                  return this.user?.autosalon ? this.$localePath('/salons/offer?param=all') : this.$localePath('/offer/offers?param=all')
            }
            return '/';
         }
         // return '/';
      }
   },
   async mounted() {
      await this.$axios.$post('/notifications/read_all')
      setTimeout(() => {
         this.$store.dispatch('getNotifications')
      }, 1000)
   },
   computed: {
      ...mapGetters(['notifications']),
      getNotificationsList() {
         return this.notifications.data;
      },
      crumbs() {
         return [{name: this.$t('notification')}]
      },
   },
}
</script>


