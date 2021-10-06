<template>
  <div class="controls-panel card mt-n3 mt-lg-0 mb-lg-3" v-if="showToolbar || isMobileBreakpoint">
    <div class="row flex-nowrap justify-content-between align-items-center" v-if="showToolbar">
      <!-- <div class="col-lg-2 ml-n2">
        <form-checkbox class="fw-500" :label="$t('select_all')" v-model="selectAll" input-name="selectAll" 
          transparent @input="handleSelectAll" @change="handleSelectAll"/>
      </div> -->
      <div class="col d-flex align-items-center justify-content-end">
        <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]" 
            @click="showDeactivateModal = true">
          <icon name="minus-circle" />
          <span>{{ $t('inactive_make') }}</span>
          <modal-popup
            :toggle="showDeactivateModal"
            :title="$t('are_you_sure_you_want_to_deactivate_the_announcements')"
            @close="showDeactivateModal = false"
          >
            <form class="form" @submit.prevent="deactivateAnouncement" novalidate>
              <button type="submit" :class="['btn btn--green full-width', { pending }]">
                {{ $t('confirm') }}
              </button>
            </form>
          </modal-popup>
        </span>
        <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]" 
            @click="showDeleteModal = true">
          <icon name="garbage" />
          <span>{{ $t('delete') }}</span>
          <modal-popup
            :toggle="showDeleteModal"
            :title="$t('are_you_sure_you_want_to_delete_the_announcements')"
            @close="showDeleteModal = false"
          >
            <form class="form" @submit.prevent="deleteAnouncement" novalidate>
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
    showToolbar: Boolean
  },
  data() {
    return {
      selected: [],
      selectAll: false,
      showDeactivateModal: false,
      showDeleteModal: false,
      pending: false
    }
  },
  computed: {
    ...mapGetters(['myAnnouncements'])
  },
  methods: {
    ...mapActions(['deactivateMyAnnounement','deleteMyAnnounement']),

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
        await Promise.all(this.selected.map(this.deactivateMyAnnounement));
        this.handleSelectAll(false);
        await this.$nuxt.refresh();
        this.pending = false;
        this.showDeactivateModal = false;
      } catch (err) {
        this.pending = false;
      }
    },
    async deleteAnouncement() {
      if (this.pending) return;

      let canProceed = true;
      
      this.selected.map(id => {
        let item = this.myAnnouncements.data.find(item => item.id_unique == id);
        if (![3].includes(item.status)) canProceed = false;
      });

      if (!canProceed) {
        this.$toasted.error(this.$t('cant_delete_selected_announcements'));
        return;
      }

      this.pending = true;
      try {
        await Promise.all(this.selected.map(this.deleteMyAnnounement));
        this.handleSelectAll(false);
        await this.$nuxt.refresh();
        this.pending = false;
        this.showDeleteModal = false;
      } catch (err) {
        this.pending = false;
      }
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