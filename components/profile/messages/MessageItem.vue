<template>
  <div :class="['message-item', {'pull-right': sentByMe}]" :id="`message-${message.id}`">
    <div :class="['message-content', {'sent-by-me': sentByMe}]">
      <div class="message-attachments" v-if="message.attachments.length">
        <div v-for="(image, i) in message.attachments" :key="image.src" 
            :class="{'half-width': !(message.attachments.length % 2 === 1 && i === message.attachments.length - 1)}">
          <img :src="$withBaseUrl(image.thumb)" alt="" @click="$emit('show-image', $withBaseUrl(image.src))" />
          <span class="message-time">
            {{ $moment(message.created_at).format('hh:mm') }}
          </span>
        </div>
      </div>
      <div class="message-text_wrapper" v-if="message.text">
        <span class="message-text">
          <span v-if="rawHtml" v-html="message.text || ''"></span>
          <span v-else>{{ message.text || '' }}</span>
        </span>
        <span :class="['message-time', {'text-dark-blue-3': !sentByMe}]">
          <icon name="check1" v-if="sentByMe" />
          {{ $moment(message.created_at).format('hh:mm') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    message: {},
    rawHtml: Boolean
  },
  computed: {
    sentByMe() {
      return this.message.recipient_id != this.user.id;
    }
  }
}
</script>