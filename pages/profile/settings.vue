<template>
  <div class="pages-profile-settings pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <component
        :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
        :bar-title="$t('user_information_edit')"
        @back="$router.push(pageRef || $localePath('/profile'))"
        height-auto
      >
        <div class="card profile-settings-card">
          <div class="avatar_edit">
            <form-image v-model="form.avatar" :initial-image="getUserAvatar"
              croppable :width="100" :height="100" />
            <p class="text-center">100x100px</p>
          </div>
          <div class="row profile_edit">
            <div class="col-lg-4 mb-3 mb-lg-3">
              <form-text-input :maxlength="30" disabled :placeholder="$t('name')" v-model="form.name" />
            </div>
            <div class="col-lg-4 mb-3 mb-lg-3">
              <form-text-input :placeholder="$t('birthday')" v-model="form.birthday" input-date />
            </div>
            <div class="col-lg-4 mb-3 mb-lg-3">
              <form-buttons v-model="form.gender" :options="getGenderOptions" :group-by="2"
                btn-class="primary-outline" />
            </div>
            <div class="col-lg-4 mb-3 mb-lg-3">
              <change-email :placeholder="$t('email')" />
            </div>
            <div class="col-lg-4 mb-3 mb-lg-3 ">
              <change-phone :placeholder="$t('contact_number')" />
            </div>
            <div class="full-width"></div>
<!--            <div class="col-lg-4 mb-3 mb-lg-3">-->
<!--              <form-text-input type="password" autocomplete="old-password" :maxlength="255" -->
<!--                :placeholder="$t('current_password')"  v-model="form.old"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="col-lg-4 mb-3 mb-lg-3">-->
<!--              <form-text-input type="password" autocomplete="new-password" :maxlength="255" -->
<!--                :placeholder="$t('new_password')"  v-model="form.password"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="col-lg-4 mb-3 mb-lg-3">-->
<!--              <form-text-input type="password" autocomplete="new-password" :maxlength="255" -->
<!--                :placeholder="$t('confirm_new_password')"  v-model="form.password_confirmation"-->
<!--              />-->
<!--            </div>-->
            <div class="col-lg-2 offset-lg-10">
              <button class="btn btn--green full-width" @click="submit">{{ $t('confirm') }}</button>
            </div>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script>
import { UserDataMixin } from '~/mixins/user-data';

import ChangeEmail from '~/components/elements/ChangeEmail';
import ChangePhone from '~/components/elements/ChangePhone';

export default {
  name: 'pages-profile-settings',
  mixins: [UserDataMixin],
  middleware: ['auth_general'],
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
  async asyncData({ $auth, app }) {
    await $auth.fetchUser();

    return {
      form: {
        old: '',
        password: '',
        password_confirmation: '',
        name: $auth.user.full_name || '',
        lastname: $auth.user.lastname || '',
        gender: $auth.user.gender || '',
        birthday: app.$moment($auth.user.birthday || null).format('DD.MM.YYYY'),
        avatar: null
      }
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('user_information'), route: '/profile' },
        { name: this.$t('user_information_edit') }
      ]
    },

    getGenderOptions() {
      return [
        { key: 1, name: this.$t('male')	},
        { key: 2, name: this.$t('female')	}
      ];
    }
  },
  methods: {
    escapeDate(date) {
      return (date !== null && date !== '' && date !== 'Invalid date')
        ? this.$moment(date, 'DD.MM.YYYY').format('DD-MM-YYYY') : null;
    },
    async submit() {
      this.form.name = this.user.name || '';
      this.form.lastname = this.user.lastname || '';

      let formData = new FormData();
      let pwdKeys = ['old','password','password_confirmation'];
      for (let key in this.form) {
        let value = this.form[key];
        if (key === 'birthday') {
          value = this.escapeDate(value);
          if (!value) continue;
        } if (key === 'avatar') {
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
      });
    }
  }
}
</script>
