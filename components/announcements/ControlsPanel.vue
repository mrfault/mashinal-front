<template>
  <div class="controls-panel card mt-n3 mt-lg-0 mb-lg-3" v-if="showToolbar || isMobileBreakpoint">
    <div class="row flex-nowrap justify-content-between align-items-center" v-if="showToolbar">
      <!-- <div class="col-lg-2 ml-n2">
        <form-checkbox class="fw-500" :label="$t('select_all')" v-model="selectAll" input-name="selectAll"
          transparent @input="handleSelectAll" @change="handleSelectAll"/>
      </div> -->
      <div class="col d-flex align-items-center justify-content-end">
         <span v-if="false" :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]"
               @click="showChatModal = true">
           <span>MashinAL Business</span>
         </span>
        <span v-if="user.autosalon && user.autosalon.id" style="border-right: 1px solid #ccc6;" :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selectedAnnouncements.length}]" >
          <monetization-button
            :multiple="true"
            :multiple-announcements="selectedAnnouncements"
            tag="span"
            classes=" "
            :announcement="myAnnouncements.data[0]"
          />
        </span>

        <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]"
            @click="showDeactivateModal = true">
          <!-- <icon name="minus-circle" /> -->
          <inline-svg src="/icons/minus-circle.svg" :height="14" />
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
          <modal-popup
            :toggle="showChatModal"
            :title="'MashinAL Business'"
            @close="closeChatModal"
          >
            <form class="form" @submit.prevent="sendToChat" novalidate>
              <p class="mb-2 mb-lg-3">
                Müştəri ilə Mashin Chat-da alış verişə davam etmək üçün
                mobil nömrə və ya email daxil etməlisiniz.
              </p>
              <form-switch v-model="chat.user_type" :options="userTypes" auto-width />

              <form-text-input
                key="phone"
                v-if="chat.user_type === 1"
                class="mt-2 mb-2"
                v-model="chat.phone"
                :placeholder="$t('mobile_number')"
                :mask="$maskPhone()"
              />
              <form-text-input
                key="email"
                v-if="chat.user_type === 2"
                class="mt-2 mb-2"
                v-model="chat.email"
                :placeholder="$t('email')"
                :mask="$maskEmail()"
              />
              <button type="submit" :class="['btn btn--green full-width', { pending }]">
                {{ $t('confirm') }}
              </button>
            </form>
          </modal-popup>
        </span>
        <span :class="['control-icon cursor-pointer text-hover-red', {'disabled-ui': !selected.length}]"
            @click="showDeleteModal = true">
          <icon name="garbage" />
          <!-- <inline-svg src="/icons/garbage.svg" :height="14" /> -->
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
import MonetizationButton from "~/components/announcements/MonetizationButton";

export default {
  components: {MonetizationButton},
  props: {
    showToolbar: Boolean
  },
  data() {
    return {
      chat: {
        user_type: 1,
        phone:'',
        email:''
      },
      selected: [],
      selectedAnnouncements:[],
      selectAll: false,
      showDeactivateModal: false,
      showChatModal: false,
      showDeleteModal: false,
      pending: false
    }
  },
  computed: {
    ...mapGetters(['myAnnouncements']),
    userTypes() {
      return [
        { key: 1, name: this.$t('mobile_number') },
        { key: 2, name: this.$t('email') }
      ];
    },
  },
  methods: {
    closeChatModal() {
      this.showChatModal = false;
      this.chat.user_type = 1;
      this.chat.phone = '';
      this.chat.email = '';
    },
    ...mapActions(['deactivateMyAnnounement','deleteMyAnnounement']),
    async sendToChat() {
      this.pending = true;
      try {
        await this.$axios.$post('/deactivate_and_send',{
          announcements: this.selected,
          user_type: this.chat.user_type,
          phone: this.chat.phone.replace(/[^0-9]+/g, ''),
          email: this.chat.email
        })
        this.pending = false;
        this.closeChatModal();
        this.$toasted.success(this.$t('user_add_successfully'))
        this.selected = [];
        this.$nuxt.refresh();
      }catch (e){
        this.pending = false;
      }

      this.pending = false;

    },
    selectAnnouncement(id, value, controls = false) {
      if (!controls) return;

      this.$set(this, 'selected', value
        ? (this.selected.includes(id) ? [...this.selected] : [...this.selected, id])
        : this.selected.filter(selected_id => selected_id != id)
      );
      this.handleSelectAnnouncementObject(id);
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
    handleSelectAnnouncementObject(id) {
      let item = this.myAnnouncements.data.find(item => item.id_unique == id);
      let isSelected = this.selectedAnnouncements.findIndex(item => item.id_unique == id);
      if(isSelected !== -1) {
          this.selectedAnnouncements.splice(isSelected,1);
      }else {
        if(item.status == 1 && !item.has_monetization) this.selectedAnnouncements.push(item);
      }
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
        if (![0,3].includes(item.status)) canProceed = false;
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
