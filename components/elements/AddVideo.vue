<template>
  <div class="add-video row">
    <div class="col-lg-5">
      <form-text-input
        :placeholder="$t('enter_the_youtube_video_link')"
        :icon-name="'link'"
        :invalid="invalid"
        :valid="!!youtubeUrl && !invalid"
        :value="youtubeUrl"
        @input="validateUrl"
        @blur="checkVideo"
      />
    </div>
    <div class="col-12 mt-2 mt-lg-3">
      <transition-group name="fade2">
        <img :key="1" width="200" :src="thumb" v-if="!!youtubeUrl && !invalid" />
        <p :key="2" v-else>{{ $t('add_a_video_this_will_attract_more_attention_increase_confidence_in_the_seller_and_increase_the_likelihood_of_a_call') }}</p>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    thumb: String
  },
  data() {
    return {
      youtubeUrl: this.value ? `https://www.youtube.com/watch?v=${this.value}` : '',
      invalid: false,
      added: !!this.value
    }
  },
  methods: {
    validateUrl(url) {
      this.youtubeUrl = url;
      if (!url) {
        this.$emit('input', { id: '', thumb: '' });
        this.invalid = false;
      } else {
        let youtubeMatch = url.match('(?:.+?)?(?:\\/v\\/|watch\\/|\\?v=|\\&v=|youtu\\.be\\/|\\/v=|^youtu\\.be\\/|watch\\%3Fv\\%3D)([a-zA-Z0-9_-]{11})+');
        if (youtubeMatch) {
          this.invalid = false;
          this.$emit('input', { id: youtubeMatch[1], thumb: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg` });
        } else {
          this.invalid = true;
        }
      }
    },
    checkVideo() {
      if (this.value && !this.invalid) {
        this.added = true;
      }
    }
  }
}
</script>
