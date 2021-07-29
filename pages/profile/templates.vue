<template>
  <div class="pages-profile-templates pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="templates-controls-panel card mb-2 mb-lg-3">
        <h2 class="title-with-line mt-n1 mb-n1" v-if="isMobileBreakpoint">
          <span>{{ $t('my_searches') }}</span>
        </h2>
        <div class="row justify-content-between align-items-center mt-n1 mt-lg-0">
          <div class="col-6 col-lg-2 ml-n2" v-if="!isMobileBreakpoint">
            <form-checkbox class="fw-500" :label="$t('select_all')" v-model="selectAll" input-name="selectAll" 
              transparent @input="handleSelectAll" @change="handleSelectAll"/>
          </div>
          <div class="col-6 col-lg-2 d-flex align-items-center justify-content-end">
            <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]" @click="showIntervalModal = true" v-tooltip="$t('receive_notifications')">
              <icon name="bell" />
            </span>
            <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]" @click="showRemoveModal = true" v-tooltip="$t('delete')">
              <icon name="garbage" />
            </span>
          </div>
        </div>
      </div>
      <div class="templates-list">
        <saved-search 
          v-for="item in savedSearchList" 
          :key="item.id"
          :item="item"
          :checked="selected.includes(item.id)"
          :notification-options="getNotificationOptions"
          @change="selectSavedSearch"
        />
      </div>
      <modal-popup
        :toggle="showIntervalModal"
        :title="$t('receive_notifications')"
        :overflow-hidden="false"
        @close="showIntervalModal = false"
      >
        <form class="form" @submit.prevent="updateNotifications">
          <div class="mb-2 mb-lg-3">
            <form-select
              v-if="user.email"
              v-model="interval"
              :options="getNotificationOptions"
              :clear-option="false"
              :allow-clear="false"
              :skip-select="true"
            />
          </div>
          <button type="submit" :class="['btn btn--green full-width', { pending }]">
            {{ $t('confirm') }}
          </button>
        </form>
      </modal-popup>
      <modal-popup
        :toggle="showRemoveModal"
        :title="$t('want_to_delete_a_search')"
        @close="showRemoveModal = false"
      >
        <form class="form" @submit.prevent="removeSavedSearch">
          <button type="submit" :class="['btn btn--green full-width', { pending }]">
            {{ $t('confirm') }}
          </button>
        </form>
      </modal-popup>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import SavedSearch from '~/components/profile/SavedSearch';

  export default {
    name: 'pages-profile-templates',
    middleware: 'auth_general',
    components: { 
      SavedSearch
    },
    nuxtI18n: {
      paths: {
        az: '/profil/axtaris-sablonlari'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('my_searches')
      });
    },
    async asyncData({store}) {
      await Promise.all([
        store.dispatch('getSavedSearch'),
        store.dispatch('getBrands'),
        store.dispatch('getColors'),
        store.dispatch('getOptions'),
        store.dispatch('getAllOtherOptions')
      ]);

      return { 
        selected: [],
        selectAll: false,
        interval: 0,
        showRemoveModal: false,
        showIntervalModal: false,
        pending: false
      }
    },
    computed: {
      ...mapGetters(['savedSearchList']),

      crumbs() {
        return [
          { name: this.$t('my_searches') }
        ]
      },

      getNotificationOptions() {
        return [
          {name: this.$t('do_not_receive_notifications'), selected_name: this.$t('do_not_receive_notifications_selected'), key: 0},
          {name: this.$t('receive_notifications_every_hour'), selected_name: this.$t('receive_notifications_every_hour_selected'), key: 60},
          {name: this.$t('receive_notifications_every_3_hours'), selected_name: this.$t('receive_notifications_every_3_hours_selected'), key: 180},
          {name: this.$t('receive_notifications_once_a_day'), selected_name: this.$t('receive_notifications_once_a_day_selected'), key: 1440},
          {name: this.$t('receive_notifications_once_a_weak'), selected_name: this.$t('receive_notifications_once_a_weak_selected'), key: 10080}
        ];
      }
    },
    methods: {
      ...mapActions(['updateSavedSearchNotificationsInterval', 'deleteSavedSearchMultiple']),

      selectSavedSearch(id, value) {
        this.$set(this, 'selected', value 
          ? [...this.selected, id] 
          : this.selected.filter(selected_id => selected_id !== id)
        );

        if (this.selectAll && !value) {
          this.selectAll = false;
        } else if (!this.selectAll && value && this.selected.length === this.savedSearchList.length) {
          this.selectAll = true;
        }
      },
      handleSelectAll(value) {
        this.selectAll = value;
        this.$set(this, 'selected', value 
          ? this.savedSearchList.map(item => item.id) 
          : []
        );
      },
      async updateNotifications() {
        if (this.pending) return;
        this.pending = true;
        try {
          await this.updateSavedSearchNotificationsInterval({ id: this.selected, type: this.interval });
          this.pending = false;
          this.showIntervalModal = false;
          this.$toasted.success(this.$t('saved_changes'));
          this.handleSelectAll(false);
        } catch (err) {
          this.pending = false;
        }
      },
      async removeSavedSearch() {
        if (this.pending) return;
        this.pending = true;
        try {
          await this.deleteSavedSearchMultiple({ ids: this.selected });
          this.pending = false;
          this.showRemoveModal = false;
          this.$toasted.success(this.$t('my_templates_removed'));
          this.handleSelectAll(false);
        } catch (err) {
          this.pending = false;
        }
      },
    }
  }
</script>