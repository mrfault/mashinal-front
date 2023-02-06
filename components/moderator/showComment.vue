<template>
  <div>
    <button
      :disabled="showTransferComment"
      class="btn btn--green mr-2"
      @click="showTransferComment = true"
    >
      {{ $t('show_transfer_comment') }}
    </button>
    <modal-popup
      :modal-class="''"
      :title="`${$t('transfer_comment')}`"
      :toggle="showTransferComment"
      closeable
      @close="showTransferComment = false"
    >
      <div class="body">
        <textarea
          key="ma-moderation-comment-2"
          v-model="transferComment"
          :placeholder="$t('transfer_comment')"
          class="ma-input"
        />
      </div>
    </modal-popup>

  </div>
</template>

<script>
export default {
  props:{
    single_announce: Object,
  },
  data(){
    return {
      showTransferComment: false,
    }
  }
}
</script>
