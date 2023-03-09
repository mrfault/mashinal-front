<template>
  <div>


  <div class="row">
    <div class="col-12 col-md-6 col-lg-8">
      <user-details
        :brand="single_announce.brand"
        :createdAt="single_announce.created_at"
        :is-autosalon="single_announce.is_autosalon"
        :is-external-salon="single_announce.is_external_salon"
        :smsRadarData="smsRadarData"
        :userData="single_announce.user"
      />
    </div>
    <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-end mt-2 mt-lg-0">
      <show-comment
        v-if="user.admin_group === 1 && single_announce.transferred"
        :single_announce="single_announce"
      />
      <button
        :class="{ pending: button_loading }"
        class="btn btn--green w-50"
        style="padding: 5px 20px;"
        @click.prevent="openLog = true"
      >
        {{ $t('show_logs') }}
      </button>

    </div>
  </div>
    <!--    logs-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('logs')}`"
      :toggle="openLog"
      @close="openLog = false"
    >
      <change-log
        :btl="single_announce.btl_announces"
        :logs="single_announce.change_log"
        :user-id="single_announce.user_id"
        :single_announce="single_announce"
      />
<!--        :btlUserName="getBtlUserName"-->
    </modal-popup>
  </div>
</template>

<script>
import UserDetails from '~/components/moderator/brand.vue'
import showComment from '~/components/moderator/showComment'
import ChangeLog from "~/components/moderator/changeLog";


export default {
  components:{
    UserDetails,
    showComment,
    ChangeLog,

  },
  props:{
    single_announce: Object,
    form: Object,
    smsRadarData: Object,
    button_loading:Boolean,
  },
  data(){
    return {
      openLog: false,
    }
  },

}
</script>
