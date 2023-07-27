<!--suppress ALL -->
<template>
   <div class="pages-dashboard-settings">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>

      <component
         :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
         :bar-title="$t('user_information_edit')"
         @back="$router.push(pageRef || $localePath('/profile/settings'))"
         height-auto>
         <div class="row">
            <div class="col-md-12 pb-5">
               <div class="row flex-column-reverse flex-lg-row pt-lg-0 pt-5">
                  <div class="col-md-6 pb-5">
                     <div class="card">
                        <div class="row">
                           <div class="col-md-12 pb-3">
                              <form-text-input :maxlength="30" :placeholder="$t('name')" v-model="form.name"/>
                           </div>
                           <div class="col-md-12 pb-3">
                              <form-text-input :maxlength="30" :placeholder="$t('surname')" v-model="form.lastname"/>
                           </div>
                           <div class="col-md-12 pb-3">
                              <change-email :placeholder="$t('email')"/>
                           </div>
                           <div class="col-md-12 pb-3">
                              <change-phone :placeholder="$t('contact_number')"/>
                           </div>
                           <div class="col-md-12 pb-3">
                              <form-text-input :placeholder="$t('birthday')" v-model="form.birthday" input-date />
                           </div>
                           <div class="col-md-12 pb-3">
                              <form-select
                                 :label="$t('gender')"
                                 :options="getGenderOptions"
                                 :clear-placeholder="true"
                                 :clear-option="false"
                                 :input-placeholder="$t('your_gender')"
                                 v-model="form.gender"
                                 :new-label="false"
                                 has-search
                              />
                           </div>
                           <div class="col-md-12 pb-3">
                              <button
                                 type="submit"
                                 @click="submit"
                                 :class="['btn btn--green full-width', { pending: pending && showPasswordModal }]">
                                 {{ $t('save') }}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="col-md-6">
                     <div class="row">
                        <div class="col-md-12 pb-3">
                           <div class="change-avatar d-flex justify-content-center">
                              <div class="avatar-image">
                                 <form-image
                                    v-model="form.avatar"
                                    :initial-image="getUserAvatar"
                                    croppable
                                    :width="isMobileBreakpoint ? 72 : 72"
                                    :height="isMobileBreakpoint ? 72 : 72"/>
                              </div>
                              <div class="avatar-content">
                                 <h4>{{$t('change_profile_pictures_text')}}</h4>
                                 <p>{{$t('change_profile_pictures_validation')}}</p>
                                 <button class="upload-image" @click="clickAvatar()">
                                    <inline-svg :src="'/icons/upload.svg'"/> {{$t('upload_file')}}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </component>
   </div>
</template>

<script>
import {UserDataMixin} from '~/mixins/user-data';

import ChangeEmail from '~/components/elements/ChangeEmail';
import ChangePhone from '~/components/elements/ChangePhone';

export default {
   name: 'pages-profile-settings',
   mixins: [UserDataMixin],
   layout: 'garageLayout',
   middleware: ['auth_general', ({$auth, redirect}) => {
      if ($auth.user.parent_id) {
         return redirect('/garage-services')
      }
   }],
   components: {
      ChangeEmail,
      ChangePhone
   },
   nuxtI18n: {
      paths: {
         az: '/profil/parametrler'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('user_information_edit')
      });
   },

   async asyncData({$auth, app}) {
      await $auth.fetchUser();

      return {
         form: {
            old: '',
            password: '',
            password_confirmation: '',
            name: $auth.user.name || '',
            lastname: $auth.user.lastname || '',
            gender: $auth.user.gender || 0,
            birthday: app.$moment($auth.user.birthday || null).format('DD.MM.YYYY'),
            avatar: null
         }
      }
   },
   computed: {
      crumbs() {
         return [
            {name: this.$t('user_information'), route: '/profile'},
            {name: this.$t('user_information_edit')}
         ]
      },

      getGenderOptions() {
         return [
            {key: 0, name: this.$t('not_selected')},
            {key: 1, name: this.$t('male')},
            {key: 2, name: this.$t('female')}
         ];
      },
      pending(){
         return false
      }

   },
   methods: {
      escapeDate(date) {
         return (date !== null && date !== '' && date !== 'Invalid date')
            ? this.$moment(date, 'DD.MM.YYYY').format('DD-MM-YYYY') : null;
      },
      clickAvatar() {
         this.$root.$refs.FormImage.croppaValue.chooseFile();
      },
      async submit() {
         let formData = new FormData();
         let pwdKeys = ['old', 'password', 'password_confirmation'];
         for (let key in this.form) {
            let value = this.form[key];
            if (key === 'birthday') {
               value = this.escapeDate(value);
               if (!value) continue;
            }
            if (key === 'avatar') {
               if (value) value = await value?.promisedBlob('image/jpeg', 0.8);
               else continue;
            } else if (pwdKeys.includes(key) && !pwdKeys.filter(k => !!this.form[k]).length) {
               continue;
            }
            formData.append(key, value);
         }

         this.$axios.$post('/profile/change_info', formData).then((res) => {
            this.$toasted.success(this.$t('saved_changes'));
            this.form.old = '';
            this.form.password = '';
            this.form.password_confirmation = '';
            this.$auth.fetchUser();
            this.$router.push(this.$localePath('/profile/settings'))
         });
      }
   }
}
</script>

<style>

.pages-dashboard-settings{
   min-height: 900px;
}
.card {
   border: 1px solid #CDD5DF;
   border: 1px solid #CDD5DF;
}
.change-avatar {
   padding: 24px;
   border-radius: 12px;
   gap: 16px;
   border: 1px solid #CDD5DF;
   background-color: #FFF;
   align-items: center;
}
.avatar-image{
   min-height: 72px;
   width: 20%;
   display: flex;
   justify-content: center;
}
.avatar-image img{
   height: 72px;
   width: 72px;
   border-radius: 50%;
   object-fit: contain;
}
.avatar-content{
   width: 80%;
   min-height: 72px;
}
.avatar-content h4{
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   text-align: left;
   color: #1B2434;
   margin-bottom: 5px;
}
.avatar-content p {
   font-size: 14px;
   font-weight: 400;
   line-height: 16px;
   letter-spacing: 0em;
   text-align: left;
   color: #697586;
   margin-bottom: 5px;
}
.avatar-content .upload-image{
   display: flex;
   justify-content: center;
   align-items: center;
   border: none;
   background-color: transparent;
   font-size: 14px;
   font-weight: 500;
   line-height: 16px;
   letter-spacing: 0;
   text-align: left;
   color: #155EEF;
   padding: 0;
   margin: 0;
}
.avatar-content .upload-image svg{
   margin-right: 10px;
}
.form-image{
   border-radius: 50%;
   padding: 0!important;
}
.croppa-container{
   height: 72px;
   width: 72px;
}
.btn--green{
   height: 52px;
}
.dark-mode{
   .change-avatar {
      border: 1px solid #1B2434!important;
      background-color: #1B2434 !important;
   }
   .card {
      border: 1px solid #1B2434!important;
      background-color: #1B2434 !important;
   }
   .avatar-content h4{
      color: #bcc2c9;
   }
   .avatar-content p {
      color: #CDD5DF;
   }

}
</style>
