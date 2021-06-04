<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="row">
        <div class="col-lg-5">
          <div class="card">
            <h2 class="title-with-line full-width">
              <span>{{ $t('new_announce') }}</span>
            </h2>
            <template v-if="loggedIn || sellTokens !== false">
              <template v-if="loggedIn && user.announce_left > 0">
                <p v-html="$t('you_can_create_announcement', { 
                  plural: $readPlural(user.announce_left, $t('plural_forms_announcements'), false),
                  left: user.announce_left
                })"></p>
              </template>
              <template v-else-if="!loggedIn && sellTokens > 0">
                <p v-html="$t('you_can_create_announcement', { 
                  plural: $readPlural(sellTokens, $t('plural_forms_announcements'), false),
                  left: sell_tokens
                })"></p>
              </template>
              <template v-else>
                <p><strong class="text-red">*</strong> {{ $t('no_announcements_on_balance') }}</p><br/>
                <p v-if="loggedIn && user.autosalon" v-html="$t('contact_for_more_info', { phone: '(055) 222-13-05', email: 'elchin.m@mashin.al' })"></p>
                <p v-else v-html="$t('contact_for_more_info', { phone: '*8787', email: 'support@mashin.al' })"></p>
              </template>
            </template>
            <template v-else>
              <p v-html="$t('you_can_only_have_3_announce_within_30_days')"></p>
              <check-sell-tokens />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import CheckSellTokens from '~/components/sell/CheckSellTokens';

  export default {
    components: {
      CheckSellTokens
    },
    nuxtI18n: {
      paths: {
        az: '/satmaq'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('meta-title_sell'),
        description: this.$t('meta-descr_sell')
      });
    },
    computed: {
      ...mapGetters(['sellTokens']),

      crumbs() {
        return [
          { name: this.$t('place_an_ad') }
        ]
      }
    },
    created() {
      if (!this.$route.query.phone) 
        this.$store.dispatch('resetSellTokens');
    }
  }
</script>