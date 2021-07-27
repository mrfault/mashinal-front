<template>
  <div class="pages-profile pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card profile-card with-margins">
        <div class="profile_top">
          <img class="avatar" :src="getUserAvatar" :alt="user.full_name" />
          <div class="profile_top-details">
            <h2 :class="['text-center', {'title-with-line': !isMobileBreakpoint}]">
              <span>{{ user.full_name }}</span>
            </h2>
            <template v-if="isMobileBreakpoint">
              <span>{{ $moment(user.birthday).format('DD.MM.YYYY') }}</span>
              <span>{{ user.gender == 1 ? $t('male') : $t('female') }}</span>
            </template>
          </div>
        </div>
        <hr v-if="isMobileBreakpoint" />
        <nuxt-link class="edit-link" :to="$localePath('/profile/settings')">
          <icon name="edit" />
        </nuxt-link>
        <div class="row profile_info">
          <template v-if="!isMobileBreakpoint">
            <div class="col-lg-3">
              <div class="profile_info-details">
                <icon name="calendar" />
                <span>{{ $moment(user.birthday).format('DD.MM.YYYY') }}</span>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="profile_info-details">
                <icon name="user" />
                <span>{{ user.gender == 1 ? $t('male') : $t('female') }}</span>
              </div>
            </div>
          </template>
          <div class="col-lg-3">
            <div class="profile_info-details">
              <icon name="envelope" />
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="profile_info-details">
              <icon name="phone-call" />
              <a :href="`tel:+${user.phone}`" v-mask="$maskPhone(true)">+{{ user.phone }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { UserDataMixin } from '~/mixins/user-data';

  export default {
    name: 'pages-profile-index',
    mixins: [UserDataMixin],
    nuxtI18n: {
      paths: {
        az: '/profil'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('user_information')
      });
    },
    async asyncData({ $auth }) {
      await $auth.fetchUser();
    },
    computed: {
      crumbs() {
        return [
          { name: this.$t('user_information') }
        ]
      }
    }
  }
</script>