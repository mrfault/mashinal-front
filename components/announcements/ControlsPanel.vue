<template>
  <div class="controls-panel card mb-3 mb-lg-3">
    <h2 class="title-with-line mb-0" v-if="isMobileBreakpoint">
      <span>{{ $t('my_announces') }}</span>
    </h2>
    <div class="row justify-content-between align-items-center">
      <div class="col-6 col-lg-2 ml-n2" v-if="!isMobileBreakpoint">
        <form-checkbox class="fw-500" :label="$t('select_all')" v-model="selectAll" input-name="selectAll" 
          transparent @input="handleSelectAll" @change="handleSelectAll"/>
      </div>
      <div class="col-6 col-lg-2 d-flex align-items-center justify-content-end">
        <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]" 
            @click="showDeactivateModal = true" v-tooltip="$t('inactive_make')">
          <icon name="minus-circle" />
          <modal-popup
            :toggle="showDeactivateModal"
            :title="$t('are_you_sure_you_want_to_delete_the_announcement')"
            @close="showDeactivateModal = false"
          >
            <form class="form" @submit.prevent="deactivateAnouncement">
              <button type="submit" :class="['btn btn--green full-width', { pending }]">
                {{ $t('confirm') }}
              </button>
            </form>
          </modal-popup>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    status: {}
  },
  data() {
    return {
      selected: [],
      selectAll: false,
      showDeactivateModal: false,
      pending: false
    }
  },
  computed: {
    ...mapGetters(['myAnnouncements'])
  },
  methods: {
    ...mapActions(['deleteMyAnnounement']),

    selectAnnouncement(id, value, controls = false) {
      if (!controls) return;
      
      this.$set(this, 'selected', value 
        ? (this.selected.includes(id) ? [...this.selected] : [...this.selected, id]) 
        : this.selected.filter(selected_id => selected_id != id)
      );

      if (this.selectAll && !value) {
        this.selectAll = false;
      } else if (!this.selectAll && value && this.selected.length === this.myAnnouncements.data.length) {
        this.selectAll = true;
      }
    },
    handleSelectAll(value) {
      this.myAnnouncements.data.map(item => {
        this.$nuxt.$emit('select-announcement', item.id_unique, value, false);
      });
    },
    async deactivateAnouncement() {
      if (this.pending) return;

      let canProceed = true;
      
      this.selected.map(id => {
        let item = this.myAnnouncements.data.find(item => item.id_unique == id);
        if (![0,1].includes(item.status)) canProceed = false;
      });

      if (!canProceed) {
        this.$toasted.error(this.$t('cant_deactivate_selected_announcements'));
        return;
      }

      this.pending = true;
      try {
        await Promise.all(this.selected.map(this.deleteMyAnnounement));
        await this.$nuxt.refresh();
        this.pending = false;
        this.showDeactivateModal = false;
        this.handleSelectAll(false);
      } catch (err) {
        this.pending = false;
      }
    }
  },
  watch: {
    status() {
      this.handleSelectAll(false);
    }
  },
  mounted() {
    this.$nuxt.$on('select-announcement', this.selectAnnouncement);
  },
  beforeDestroy() {
    this.$nuxt.$off('select-announcement', this.selectAnnouncement);
  }
}
</script>