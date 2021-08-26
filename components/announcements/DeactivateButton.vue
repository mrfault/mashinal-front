<template>
  <button :class="['btn full-width', `btn--${className} `]" @click.stop="showDeactivateModal = true">
    <icon name="minus-circle" /> {{ $t('inactive_make') }}
    <modal-popup
      :toggle="showDeactivateModal"
      :title="$t('are_you_sure_you_want_to_delete_the_announcement')"
      @close="showDeactivateModal = false"
    >
      <form class="form" @submit.prevent="deactivateAnouncement" novalidate>
        <button type="submit" :class="['btn btn--green full-width', { pending }]">
          {{ $t('confirm') }}
        </button>
      </form>
    </modal-popup>
  </button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    announcement: {},
    className: {
      default: 'dark-blue-outline'
    }
  },
  data() {
    return {
      showDeactivateModal: false,
      pending: false
    }
  },
  methods: {
    ...mapActions(['deleteMyAnnounement']),

    async deactivateAnouncement() {
      if (this.pending) return;
      this.pending = true;
      try {
        await this.deleteMyAnnounement(this.announcement.id_unique);
        await this.$nuxt.refresh();
        this.pending = false;
        this.showDeactivateModal = false;
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>