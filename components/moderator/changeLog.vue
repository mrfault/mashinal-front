<template>
  <div class="log">
    <!--    info-->
    <small class="w-100 mb-4 text-right text-red">* {{ $t('old_value') }}
      <icon name="arrow-right"></icon>
      {{ $t('new_value') }}</small>
    <!--    content-->
    <div class="body">
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
              {{ $t(key) }}: {{ (key == 'created_at') && (key !== 'status') ? formatDate(value) : value }}
              {{ (key === 'status') ? getStatus(value) : value }}
              <icon name="arrow-right"></icon>
              {{ (key === 'created_at' && (key !== 'status')) ? formatDate(log.changes[key]) : log.changes[key] }}
              {{ (key === 'status') ? getStatus(log.changes[key]) : log.changes[key] }}
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
  },
  methods: {
    formatDate(dte) {
      return moment(dte).format('DD.MM.YYYY HH:mm')
    },
    getStatus(stat){
      switch (stat) {
          case 0: return 'Reject';
          case 1: return 'Active';
          case 2: return 'Pending';
          case 3: return 'Sold';
          default: stat;
      }

    }
  }
}
</script>
