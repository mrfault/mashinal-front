<template>
  <div class="pages-profile pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card profile-card with-margins">
        <div class="profile_top">
          <img class="avatar" :src="getUserAvatar" :alt="user.full_name" />
          <div class="profile_top-details">
            <h2 :class="{'text-center title-with-line': !isMobileBreakpoint}">
              <span>{{ user.full_name }}</span>
            </h2>
            <template v-if="isMobileBreakpoint">
              <span v-if="user.birthday">{{ $moment(user.birthday).format('DD.MM.YYYY') }}</span>
              <span v-if="[1,2].includes(user.gender)">{{ user.gender == 1 ? $t('male') : $t('female') }}</span>
            </template>
          </div>
        </div>
        <hr v-if="isMobileBreakpoint" />
        <nuxt-link class="edit-link" :to="$localePath('/profile/settings')" @click.native="setPageRef($route.path)">
          <icon name="edit" />
        </nuxt-link>
        <div class="row profile_info">
          <template v-if="!isMobileBreakpoint">
            <div class="col-lg-3" v-if="user.birthday">
              <div class="profile_info-details">
                <icon name="calendar" />
                <span>{{ $moment(user.birthday).format('DD.MM.YYYY') }}</span>
              </div>
            </div>
            <div class="col-lg-3" v-if="[1,2].includes(user.gender)">
              <div class="profile_info-details">
                <icon name="user" />
                <span>{{ user.gender == 1 ? $t('male') : $t('female') }}</span>
              </div>
            </div>
          </template>
          <div class="col-lg-3" v-if="user.email">
            <div class="profile_info-details">
              <icon name="envelope" />
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </div>
          </div>
          <div class="col-lg-3" v-if="user.phone">
            <div class="profile_info-details">
              <icon name="phone-call" />
              <a :href="`tel:+${user.phone}`" v-mask="$maskPhone(true)">+{{ user.phone }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-hidden">
      <div class="container">
        <banking-cards />
      </div>
    </div>
  </div>
</template>

<script>
import { UserDataMixin } from '~/mixins/user-data';

import BankingCards from '~/components/payments/BankingCards';

export default {
  name: 'pages-profile-index',
  middleware: ['auth_general'],
  mixins: [UserDataMixin],
  components: {
    BankingCards
  },
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
  async asyncData({ store, $auth }) {
    await Promise.all([
      $auth.fetchUser(),
      store.dispatch('bankingCards/getBankingCards'),
      store.dispatch('garage/getCarList', {})
    ]);
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