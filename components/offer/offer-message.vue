<template>
  <form class="form" @submit.prevent="$emit('send', $event)">
    <div class="message-textarea" :class="{disabled}">
      <div class="textarea-attach">
        <span class="cursor-pointer">
          <icon name="attachment" />
        </span>
        <input ref="input"
               type="file"
               accept="image/*"
               multiple
               @change="attachFiles"
        />
      </div>
      <div class="textarea-text">
        <textarea id="textarea"
                  @keydown="handleKeyDown"
                  :maxlength="1000"
                  :disabled="disabled"
                  :placeholder="'Təklifinizi verin'"
                  v-model="messageValue"
        />
        <span class="textarea-message text-dark-blue-3" v-if="message">
          <icon name="block" v-if="blocked" />
          {{ message }}
        </span>

      </div>
      <div class="textarea-submit">
        <button type="submit" class="btn-reset">
          <icon name="send" />
        </button>
      </div>
    </div>
    <div class="message-attachment-preview" v-if="attachmentsLength">
      <div class="preview" :class="{'hide':!loaded[key], 'loading': sending}" v-for="(attachment, key) in attachments" :key="key">
        <div class="image-preloader" v-if="sending"></div>
        <button class="btn-sq btn-sq--color-red" @click="removeFile(key)">
          <icon name="garbage"/>
          <!-- <inline-svg src="/icons/garbage.svg" :height="14" /> -->
        </button>
        <img src="" :ref="'attachment-'+key" alt="" />
      </div>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    value: {},
    disabled: Boolean,
    blocked: Boolean,
    sending: Boolean,
    message: {}
  },
  data() {
    return {
      attachments: {},
      loaded: {},
      fileKey: 0,
      hasError: false
    }
  },
  computed: {
    messageValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', (this.disabled || (this.value.length > 1000)) ? this.value : value);
      }
    },
    attachmentsLength() {
      return Object.keys(this.attachments).length;
    }
  },
  methods: {
    handleKeyDown(e) {
      this.$emit('type', e);
      const keyCode = e.which || e.keyCode;
      if(keyCode === 13 && e.shiftKey) {
        if(!e.target.value) e.preventDefault();
      }
      if (keyCode === 13 && !e.shiftKey) {
        this.$emit('send',e);
        this.messageValue = null;
        e.preventDefault();
      }
    },
    attachFiles(event) {
      if (this.disabled) return;

      let maxFiles = 4;
      let maxFileSize = 25;
      let acceptFiles = ['jpg','jpeg','png','webp'].map(ext => 'image/'+ext);
      let files = Array.from(event.target.files || event.dataTransfer.files);

      this.hasError = false;
      this.$refs.input.value = null;

      for (let i = 0; i < files.length; i++) {
        let fileSize = files[i].size / 1024 / 1024;
        let fileType = files[i].type;

        if (this.attachmentsLength >= maxFiles) {
          this.$toasted.error(this.$t('max_file_upload_error', { max: maxFiles }));
          this.hasError = true; break;
        } else if (!acceptFiles.includes(fileType)) {
          this.$toasted.error(this.$t('image_mimes_error'));
          this.hasError = true; continue;
        } else if (fileSize > maxFileSize) {
          this.$toasted.error(this.$t('max_file_size_error', { size: maxFileSize }));
          this.hasError = true; continue;
        }

        this.$set(this.attachments, this.fileKey, files[i]);
        this.fileKey++;
      }

      this.$nextTick(this.updateFiles);
    },
    removeFile(key) {
      if (this.sending) return;
      this.$delete(this.attachments, key);
      this.updateFiles();
    },
    previewAttachments() {
      for (let key in this.attachments) {
        this.$refs['attachment-'+key][0].src = URL.createObjectURL(this.attachments[key]);
        this.$set(this.loaded, key, true);
      }
    },
    updateFiles() {
      this.previewAttachments();
      this.$emit('attach', Object.keys(this.attachments).map(key => this.attachments[key]));
    }
  },
  mounted() {
    this.$nuxt.$on('clear-message-attachments', () => {
      this.$set(this, 'attachments', {});
      this.$emit('attach', []);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('clear-message-attachments');
    this.$emit('attach', []);
  }
}
</script>
