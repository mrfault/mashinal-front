<template>
  <div class="container">
    <breadcrumbs :crumbs="crumbs" />
    <div class="card d-flex justify-content-between mb-2" style="padding:20px 25px">
      <div style="font-size: 15px;">{{ $t('notification') }}</div>
      <div class="d-flex justify-content-between">
        <div style="font-size: 15px;margin-right: 70px;">{{ $t('date') }}</div>
      </div>
    </div>
    <div class="card-bordered_scrollview card">
      <div class="vehicle-specs">
        <div class="row">
          <div class="col col-12 custom-col-12">
            <ul>
              <nuxt-link :to="getRoutePath(item)" class="cursor-pointer" tag="li" v-for="item in notifications" :key="item.id">
               <i v-show="!item.read_at" class="new-notification-dot"></i> <span class="wider notification-info">
                  <span style="margin-bottom: 5px;white-space: nowrap;">{{ $t(item.title) }}</span>
                  <span>{{ item.body }}</span>
                </span>
                <span>{{ $formatDate(item.created_at, 'HH:m | D.MM.YYYY')[locale] }}</span>
              </nuxt-link>
            </ul>
            <hr/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {LayoutMixin} from "~/mixins/layout";

export default {
  async fetch({ store }) {
    if(!store.state.notifications.length)
      await store.dispatch('getNotifications')
  },
  mixins: [LayoutMixin],
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
  created() {
    this.getUserData();
  },
  methods:{
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
      switch(n.route) {
        case '/messages_bnb' :
          return this.$localePath('/profile/messages?group='+n.value)
        case '/announcement_details' :
          return this.$localePath(this.getAnnounceTypePath(n.notifiable_type)+'/'+n.value)
        case '/garage_bnb' :
          return this.$localePath('/garage')
        case '/balance' :
          return this.$localePath('/profile/balance')
        case '/business_profiles' :
          return this.$localePath('/salons')
        case '/search_templates' :
          return this.$localePath('/profile/templates')
      }
      return '/';
    }
  },

  computed: {
    ...mapGetters(['notifications']),
    crumbs() {
      return [{name: this.$t('notifications')}]
    },
  },
}
</script>

<style scoped>
.new-notification-dot {
  display: block;
  width: 5px;
  height: 5px;
  background: #F81734;
  border-radius: 50%;
  margin-right: 7px;
  margin-left: 3px;
  margin-bottom: 24px;
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
