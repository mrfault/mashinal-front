<template>
  <label class="form-keywords" for="keywords">
    <div v-if="disabled" class="form-keywords-overlay"/>
    <div class="keywords">
      <span
        v-for="(keyword, index) in keywords"
        :key="keyword"
        :class="{'keyword--highlighted': highlightLastKeyword && index === keywords.length - 1}"
        class="keyword"
        @click="removeKeyword(index)"
      >
        <icon name="cross"/>
        <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
          {{ keyword.text }}
      </span>
    </div>
    <input
      v-if="!disabled"
      id="keywords"
      ref="keywordInput"
      :placeholder="$t('add_keywords')"
      class="w-100"
      maxlength="50"
      type="text"
      @keyup="inputHandler"
    />
  </label>
</template>

<script>
export default {
  props: {
    isModerator: Boolean,
    disabled: Boolean,
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      highlightLastKeyword: false,
    }
  },
  methods: {
    inputHandler(e) {
      if (e.key === 'Backspace' && e.target.value === '') {
        if (this.highlightLastKeyword) {
          this.keywords.pop()
          this.highlightLastKeyword = false
        } else {
          this.highlightLastKeyword = true
        }
      } else {
        if (['Enter', ' '].includes(e.key)) {
          this.addKeyword(e)
        }
        this.highlightLastKeyword = false
      }

    },
    addKeyword(e) {
      const value = e.target.value.trim();

      if (value) {
        if (!this.keywords.includes(value)) {
          this.keywords.push({text:value})
        }
      }
      this.$refs.keywordInput.value = ''
    },
    removeKeyword(index) {
      this.keywords.splice(index, 1)
    }
  },
  computed: {
    keywords: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss">
.form-keywords {
  position: relative;
  z-index: 0;

  input {
    z-index: 1;
  }

  .keyword {
    z-index: 1;
  }

  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    background: rgba(grey, 0.3);
  }
}
</style>
