<template>
   <div class="pages-dashboard-settings">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>

      <div class="row" v-if="!isMobileBreakpoint">
         <div class="col-md-12 mb-0 mb-lg-4">
            <h1>{{ $t('site_settings') }}</h1>
         </div>
      </div>
      <div class="row">
         <div class="col-md-12 pb-5">
            <div class="row flex-column-reverse flex-lg-row pt-lg-0 pt-5">
               <div class="col-md-12 pb-5">
                  <div class="card-settings">
                     <div class="row">
                        <div class="col-md-12 pb-3 pt-3 border-bottom">
                           <div class="row">
                              <div class="col-md-12 d-flex justify-content-between align-items-center">
                                 <label @click="changeTheme()" class="settings-label">{{$t('dark_mode')}}</label>
                                 <custom-switch :value="darkTheme" @input="changeTheme()"/>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-12 pb-3 pt-3 border-bottom">
                           <div class="row">
                              <div class="col-md-12 d-flex justify-content-between align-items-center">
                                 <label @click="changeNotificationStatus()" class="settings-label">{{$t('notification_status')}}</label>
                                 <custom-switch :value="notificationStatus" @input="changeNotificationStatus()"/>
                              </div>
                           </div>
                        </div>
                        <div class="col-md-12 pb-3 pt-3">
                           <div class="row">
                              <div class="col-md-12 d-flex justify-content-between align-items-center">
                                 <label class="settings-label p-0 col">{{$t('select_language')}}</label>
                                 <form-select
                                    :label="$t('select_language')"
                                    :options="getLanguageOptions"
                                    :clear-placeholder="true"
                                    :clear-option="false"
                                    :input-placeholder="$t('select_language')"
                                    v-model="language"
                                    :new-label="false"
                                    has-search
                                    :class-name="'col p-0'"
                                    @change="changeSiteLanguage()"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapActions} from "vuex";
import {ColorModeMixin} from '~/mixins/color-mode';
import CustomSwitch from "~/components/elements/CustomSwitch.vue";
import LanguageChange from "~/components/elements/languageChange.vue";
export default {
   components: {LanguageChange, CustomSwitch},
   mixins: [ColorModeMixin],
   nuxtI18n: {
      paths: {
         az: '/tenzimlemeler',
      },
   },
   layout: 'garageLayout',
   head() {
      return this.$headMeta({
         title: this.$t('site_settings'),
      })
   },
   created() {
      this.$root.$refs.Settings = this;
   },
   methods: {
      ...mapActions(['setNotificationStatus', 'changeLocale']),
      changeTheme() {
         this.darkTheme = !this.darkTheme;
         this.$root?.$refs?.ThemeSwitch?.switchColorMode();
      },
      changeOptionValue(value) {
         this.darkTheme = value;
      },
      changeNotificationStatus() {
         this.notificationStatus = !this.notificationStatus;

         let notificationStatus = this.notificationStatus ? 'active' : 'deactive';

         this.setNotificationStatus(notificationStatus);

         this.$cookies.set('notification-status', notificationStatus);
      },
      changeSiteLanguage() {

         this.changeLocale(this.language);

         this.$cookies.set('current-language', this.language);
      }
   },
   computed: {
      crumbs() {
         return [
            {name: this.$t('user_information'), route: '/profile'},
            {name: this.$t('site_settings')}
         ]
      },
      getLanguageOptions() {
         return [
            {key: 'az', name: 'Azerbaijani'},
            {key: 'ru', name: 'Russian'}
         ];
      },
   },
   data() {
      return {
         language: this.$cookies.get('current-language') ?? 'az',
         notificationStatus: (this.$cookies.get('notification-status') === 'active'),
         darkTheme: (this.$cookies.get('color-mode') === 'dark')
      }
   }
}
</script>

<style>
.settings-label{
   font-size: 18px;
   font-weight: 500;
   line-height: 22px;
   letter-spacing: 0;
   text-align: left;
   color: #364152;
   cursor: pointer;
}
.card-settings{
   width: 100%;
   min-height: 112px;
   top: 128px;
   left: 16px;
   padding: 20px 24px 20px 24px;
   border-radius: 12px;
   gap: 16px;
   border: 1px solid #CDD5DF;
   background: #FFF;
}
.border-bottom{
   border-bottom: 1px solid #CDD5DF;
}
.mobile-screen {
   .settings-label{
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0;
      text-align: left;
      color: #364152;
   }
   .card-settings{
      width: 100%;
      min-height: 112px;
      top: 128px;
      left: 16px;
      padding: 20px 24px 20px 24px;
      border-radius: 12px;
      gap: 16px;
      border: 1px solid #CDD5DF;
      background: #FFF;
   }
   .border-bottom{
      border-bottom: 1px solid #CDD5DF;
   }
}
.dark-mode{
   .card-settings{
      background: #1B2434!important;
      border: 1px solid #1b2434!important;
   }
   .settings-label{
      color: #9AA4B2!important;
   }
   .border-bottom{
      border-bottom: 1px solid #1b2434!important;
   }
}
.dark-mode {
   .mobile-screen {
      .card-settings{
         background: #1B2434!important;
         border: 1px solid #1b2434!important;
      }
      .settings-label{
         color: #9AA4B2!important;
      }
      .border-bottom{
         border-bottom: 1px solid #1b2434!important;
      }
   }
}
</style>
