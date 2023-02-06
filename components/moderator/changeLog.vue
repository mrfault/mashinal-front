<template>
  <div class="log">
    <!--    info-->
    <small class="w-100 mb-4 text-right text-red">* {{ $t('old_value') }}
      <icon name="arrow-right"></icon>
      {{ $t('new_value') }}</small>
    <!--    content-->
    <div class="body">
      <div class="w-100 my-2" v-if="single_announce && single_announce.btl_announces && single_announce.btl_announces.length">
        <strong >
          BTL : {{ getBtlUserName }}
        </strong>
          <hr class="m-0">
      </div>
      <div v-for="log in logs" :key="log.id">
        <template v-if="(!log.changes.open_count)">
          {{ log.user.name }} {{ log.user.lastname }} /
          {{ formatDate(log.created_at) }}
          <br/>
          <div
            v-for="(value, key) in log.original"
            :key="key + '_changes'"
          >
            <div v-if="!['admin_user_id'].includes(key)" class="my-2" style="border-bottom: 1px solid #dadada">
              {{ $t(key) }} :
              <span v-if="key == 'status'">
                {{ (key === 'status') ? getStatus(value) : value }}
              </span>
              <span v-else>
                {{ (key == 'created_at') ? formatDate(value) : value }}
              </span>
              <icon name="arrow-right"></icon>
              <span v-if="key == 'status'">
                {{ (key === 'status') ? getStatus(log.changes[key]) : log.changes[key] }}
              </span>
              <span v-else>
                {{ (key === 'created_at') ? formatDate(log.changes[key]) : log.changes[key] }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: 'ModeratorChangeLog',
  props: {
    logs: Array,
    btl: Array,
    userId: Number,
    single_announce: Object,
    btlUserName: {
      type: String,
      default: "btlusrname"
    },
  },
  methods: {
    formatDate(dte) {
      return moment(dte).format('DD.MM.YYYY HH:mm')
    },
    getStatus(stat) {
      switch (stat) {
        case 0:
          return 'Reject';
        case 1:
          return 'Active';
        case 2:
          return 'Pending';
        case 3:
          return 'Sold';
        default:
          stat;
      }

    },
  },
  computed:{
    getBtlUserName() {
      if (this.single_announce.btl_announces.length)
        return this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name
      else return null
    },
  }
}
</script>
