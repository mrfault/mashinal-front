<template>
  <div class="pages-profile-settings pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card">
        <div class="avatar_edit">
          <croppa class="croppa-image" 
            v-model="form.avatar" placeholder="" 
            :initial-image="getUserAvatar"
            :accept="'image/*'"
            :canvas-color="'transparent'"
            :zoom-speed="5" 
            :width="100"
            :height="100"
            :quality="1"
            :prevent-white-space="true" 
            :show-remove-button="false"
            :replace-drop="true"
          >
            <span class="drop-file" @click="form.avatar.chooseFile()">
              <icon name="camera" />
            </span>
          </croppa>
          <p class="text-center">100x100px</p>
        </div>
        <div class="row profile_edit">
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-text-input :maxlength="30" disabled 
              :placeholder="$t('name')" v-model="form.name" />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-text-input :placeholder="$t('birthday')" v-model="form.birthday" input-date />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-buttons v-model="form.gender" :options="getGenderOptions" :group-by="2"
              btn-class="primary-outline"  />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <change-email :placeholder="$t('email')" />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3 ">
            <change-phone :placeholder="$t('mobile_number')" />
          </div>
          <div class="full-width"></div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-text-input type="password" autocomplete="old-password" :maxlength="255" 
              :placeholder="$t('current_password')"  v-model="form.old"
            />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-text-input type="password" autocomplete="new-password" :maxlength="255" 
              :placeholder="$t('new_password')"  v-model="form.password"
            />
          </div>
          <div class="col-lg-4 mb-3 mb-lg-3">
            <form-text-input type="password" autocomplete="new-password" :maxlength="255" 
              :placeholder="$t('confirm_new_password')"  v-model="form.password_confirmation"
            />
          </div>
          <div class="col-lg-2 offset-lg-10">
            <button class="btn btn--green full-width" @click="submit">{{ $t('confirm') }}</button>
          </div>
        </div>
      </div>
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
          name: $auth.user.full_name,
          lastname: $auth.user.lastname,
          gender: $auth.user.gender,
          birthday: app.$moment($auth.user.birthday).format('DD.MM.YYYY'),
          avatar: null
        },
        initialAvatar: null,
        previousAvatar: null
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
        this.form.name = this.user.name;
        this.form.surname = this.user.surname;

        let form = {...this.form};
        for (let key in form) {
          if (key === 'avatar' || !form[key]) delete form[key];
          if (key === 'birthday') form[key] = this.escapeDate(form[key]);
        }

        let formData = new FormData();
        for (let key in form)
          formData.append(key, form[key]);

        const blob = await this.form.avatar.promisedBlob('image/jpeg', 0.8);
        formData.append('avatar', blob, `profile_${this.user.id}_.jpg`);
        
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