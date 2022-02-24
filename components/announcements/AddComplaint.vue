<template>
  <button class="btn-sq btn-sq--color-dark-blue" @click.stop="showModal = true">
    <!-- <icon name="alert" /> -->
    <inline-svg src="/icons/alert.svg" :height="20" />
    <modal-popup 
      :toggle="showModal" 
      :title="$t('complain_the_announce')"
      @close="showModal = false, selectedOptions = []"
    >
      <div class="form">
        <div class="mb-2 mb-lg-3" v-for="(option, index) in complaintOptions" :key="index">
          <form-checkbox :label="$t(option.title[locale])" v-model="selectedOptions" 
            :checked-value="option.id" :id="''+option.id" />
        </div>
        <button :class="['btn btn--green full-width', {pending, disabled: !selectedOptions.length}]" @click="sendComplaint">
          {{ $t('send') }}
        </button>
      </div>
    </modal-popup>
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    announcement: {},
    type: String
  },
  data() {
    return {
      showModal: false,
      userComplained: false,
      triedAgain: false,
      selectedOptions: [],
      pending: false
    }
  },
  computed: {
    ...mapGetters(['complaintOptions']),
  
    getType() {
      if (this.announcement.car_catalog) return 'announcement';
      else if (this.announcement.moto_brand) return 'moto';
      else if (this.announcement.scooter_brand) return 'scooter';
      else if (this.announcement.moto_atv_brand) return 'moto_atv';
      else if (this.announcement.commercial_brand) return 'commercial';
      return this.type;
    },
    userAlreadyComplained() {
      return (this.$cookies.get('complaints') || [])
        .findIndex(item => (item.announce_id == this.announcement.id) && (item.announce_type == this.getType)) !== -1;
    },
    isComplained() {
      return this.announcement.complaints.length || this.userAlreadyComplained || this.triedAgain;
    }
  },
  methods: {
    openModal() {
      if (this.isComplained || this.userComplained) return;
      this.showModal = true;
    },
    eatCookie() {
      if (this.userAlreadyComplained) return;
      let complaints = this.$cookies.get('complaints') || [];
      let newComplaint = { announce_id: this.announcement.id, announce_type: this.getType };
      let expires = this.$expireDate(30);
      this.$cookies.set('complaints', [...complaints, newComplaint], { expires });
    },
    async sendComplaint() {
      if (!this.selectedOptions.length) return;
      this.pending = true;
      // send complaint if options selected
      this.$axios.$post(`/complaint-options`, {
        options: this.selectedOptions,
        announcement_id: this.announcement.id,
        announcement_model: this.getType,
      }).then(() => {
        this.userComplained = true;
        this.eatCookie();
        this.showModal = false;
        this.$toasted.success(this.$t('thanks_we_will_check'));
        this.pending = false;
      }).catch(() => {
        this.triedAgain = true;
        this.eatCookie();
        this.pending = false;
      });
    }
  }
}
</script>