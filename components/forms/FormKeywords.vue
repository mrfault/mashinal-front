<template>
  <label class="form-keywords" for="keywords">
    <div class="keywords">
      <div class="form-keywords-overlay"></div>
      <span
        v-for="(keyword, index) in keywords"
        :key="keyword"
        :class="{'keyword--highlighted': highlightLastKeyword && index === keywords.length - 1}"
        class="keyword"
        @click="removeKeyword(index)"
      >
        <icon name="cross"/>
        <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
        <template v-if="!keyword.text">
          {{ keyword }}
        </template>
        <template v-else>
          {{ keyword.text }}
        </template>
      </span>
    </div>
    <input
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
          this.keywords.push(value)
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
.form-keywords{

&-overlay{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
}
</style>
