<template>
  <button class="btn btn--dark-blue-2-outline full-width" @click.stop="showStatsModal = true">
    <icon name="pie-chart" class="stronger" />
    {{ $t('statistics') }}
    <modal-popup
      :toggle="showStatsModal"
      :title="$t('statistics')"
      :modal-class="'modal-container'"
      @close="showStatsModal = false"
    >
      <template v-if="stats">
        <div class="row">
          <div class="col-lg-4">
            <div class="modal-card">
              <div class="ad-huge-stat">
                <icon name="users" />
                <strong>{{ stats.min_view }}</strong>
                <p>{{ $t('ad_views_shown') }}</p>
              </div>
            </div>
            <div class="modal-card">
              <div class="vehicle-specs">
                <div class="row">
                  <div class="col">
                    <ul>
                      <li>
                        <span>{{ $t('ad_active') }}</span>
                        <span>{{ $t('yes') }}</span>
                      </li>
                      <li>
                        <span>{{ $t('ad_done') }}</span>
                        <span>{{ $t('add_calc_percent', { n: stats.calculated_percent }) }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="modal-card">
              <div class="row">
                <div class="col-lg-4 mb-5 mb-lg-0">
                  <div class="ad-huge-stat">
                    <icon name="money-total" />
                    <strong class="text-green">{{ stats.monetization_price }} ₼</strong>
                    <p>{{ $t('ad_money_budget') }}</p>
                  </div>
                </div>
                <div class="col-lg-4 mb-5 mb-lg-0">
                  <div class="ad-huge-stat">
                    <icon name="money-used" />
                    <strong class="text-red">{{ stats.used_balance }} ₼</strong>
                    <p>{{ $t('ad_money_used') }}</p>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="ad-huge-stat">
                    <icon name="money-left" />
                    <strong>{{ stats.balance }} ₼</strong>
                    <p>{{ $t('ad_money_left') }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-card">
              <div class="vehicle-specs">
                <div class="row">
                  <div class="col">
                    <ul>
                      <li>
                        <span class="wider"><icon name="eye" /> {{ $t('ad_grid_views') }}</span>
                        <span>{{ stats.announce_view_count }}</span>
                      </li>
                      <li>
                        <span class="wider"><icon name="cursor" /> {{ $t('ad_grid_clicks') }}</span>
                        <span>{{ stats.announce_open_count }}</span>
                      </li>
                      <li>
                        <span class="wider"><icon name="phone" /> {{ $t('ad_calls') }}</span>
                        <span>{{ stats.announce_call_count }}</span>
                      </li>
                      <template v-if="isMobileBreakpoint">
                        <li>
                          <span class="wider"><icon name="chat" /> {{ $t('ad_messages') }}</span>
                          <span>{{ stats.message_groups }}</span>
                        </li>
                        <li>
                          <span class="wider"><icon name="star" /> {{ $t('ad_favorites') }}</span>
                          <span>{{ stats.announce_saved_count }}</span>
                        </li>
                      </template>
                    </ul>
                  </div>
                  <div class="col" v-if="!isMobileBreakpoint">
                    <ul>
                      <li>
                        <span class="wider"><icon name="chat" /> {{ $t('ad_messages') }}</span>
                        <span>{{ stats.message_groups }}</span>
                      </li>
                      <li>
                        <span class="wider"><icon name="star" /> {{ $t('ad_favorites') }}</span>
                        <span>{{ stats.announce_saved_count }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>{{ $t('n_azn_return_after_ad_stop', { n: stats.balance }) }}</p>
        <hr v-if="!isMobileBreakpoint"/>
        <div class="text-right modal-sticky-bottom">
          <button :class="['btn btn--red', {'full-width': isMobileBreakpoint}]" @click.stop="showStatsModal = false, showStopAdModal = true">
            {{ $t('stop_ad') }}
          </button>
        </div>
      </template>
    </modal-popup>
    <modal-popup
      :toggle="showStopAdModal"
      :title="$t('stop_ad')"
      @close="showStopAdModal = false"
    >
      <p>{{ $t('are_you_sure') }}</p><hr />
      <form class="form" @submit.prevent="stopAd" novalidate>
        <div class="row">
          <div class="col">
            <button type="button" class="btn btn--primary-outline full-width" @click="showStopAdModal = false">
              {{ $t('no') }}
            </button>
          </div>
          <div class="col">
            <button type="submit" :class="['btn btn--green full-width', { pending }]">
              {{ $t('yes') }}
            </button>
          </div>
        </div>
      </form>
    </modal-popup>
  </button>
</template>

<script>
  export default {
    props: {
      announcement: {}
    },
    data() {
      return {
        pending: false,
        showStopAdModal: false,
        showStatsModal: false,
        stats: {}
      }
    },
    methods: {
      async stopAd() {
        if (this.pending) return;
        this.pending = true;
        await this.$axios.$post(`/monetization/stop`,{
          id_unique: this.announcement.id_unique
        });
        await Promise.all([
          this.$nuxt.refresh(),
          this.$auth.fetchUser()
        ]);
        this.showStopAdModal = false;
        this.pending = false;
        this.$toasted.success(this.$t('ad_stopped'));
      }
    },
    created() {
      this.$axios.$get(`/monetization/announce/${this.announcement.id_unique}/stats`).then(res => {
        this.stats = res;
      });
    }
  }
</script>