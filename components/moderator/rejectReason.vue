<template>
  <div style="display: inline-block; z-index: 0;" @click="openPhotoIssuePopup">
    <label class="toggleButton">
      <input
        v-model="rejectedValue"
        :disabled="toggleDisable"
        type="checkbox"
      />
      <div>
        <svg viewBox="0 0 44 44">
          <path
            d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
            transform="translate(-2.000000, -2.000000)"
          ></path>
        </svg>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    disabledValue: {
      default: false,
      type: Boolean,
    },
    rejectKey: {},
  },
  data() {
    return {
      rejected: false,
      disabled: false,
    }
  },
  mounted() {
    this.disabled = this.disabledValue

    if (this.rejectKey === 'image') {
      this.$nuxt.$on('image-checkbox-change', (toggle) => {
        this.rejectedValue = toggle
      })
    }
    if (this.rejectKey === '360') {
      this.$nuxt.$on('360-checkbox-change', (toggle) => {
        this.rejectedValue = toggle
      })
    }
  },
  computed: {
    toggleDisable() {
      return this.disabled ? this.disabledValue : false
    },
    rejectedValue: {
      get() {
        return !this.rejected
      },
      set(value) {
        this.rejected = !value
        this.$emit('change', this.rejectKey)
      },
    },
  },
  methods: {
    openPhotoIssuePopup() {
      if (this.rejectKey === 'image') {
        this.$emit('change', this.rejectKey)
      }
      if (this.rejectKey === '360') {
        this.$emit('change', this.rejectKey)
      }
    },
    click() {
      this.rejected = !this.rejected
      this.$emit('change', this.rejectKey)
    },
  },
}
</script>

<style lang="scss" scoped>
$color: #b90026;
$colorGreen: green;

.toggleButton {
  cursor: pointer;
  display: block;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: transform 0.14s ease;

  &:active {
    transform: rotateX(30deg);
  }

  input {
    display: none;

    & + div {
      border: 3px solid rgba($color, 0.2);
      border-radius: 50%;
      position: relative;
      width: 34px;
      height: 34px;

      svg {
        fill: none;
        stroke-width: 3.6;
        stroke: $color;
        stroke-linecap: round;
        stroke-linejoin: round;
        width: 34px;
        height: 34px;
        display: block;
        position: absolute;
        left: -3px;
        top: -3px;
        right: -3px;
        bottom: -3px;
        z-index: 0;
        stroke-dashoffset: 162.6 - 38;
        stroke-dasharray: 0 162.6 133 (162.6 - 133);
        transition: all 0.4s ease 0s;
      }

      &:before,
      &:after {
        content: '';
        width: 3px;
        height: 16px;
        background: $color;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 5px;
      }

      &:before {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBefore 0.3s linear forwards 0.3s;
      }

      &:after {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfter 0.3s linear forwards 0.3s;
      }
    }

    &:checked + div {
      border: 3px solid rgba($colorGreen, 0.2);

      svg {
        stroke: $colorGreen;
        stroke-dashoffset: 162.6;
        stroke-dasharray: 0 162.6 28 (162.6 - 28);
        transition: all 0.4s ease 0.2s;
      }

      &:before {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBeforeDont 0.3s linear forwards 0s;
      }

      &:after {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfterDont 0.3s linear forwards 0s;
      }
    }
  }
}

@keyframes bounceInBefore {
  0% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(45deg);
  }
  80% {
    opacity: 1;
    transform: scale(0.89) translate(-50%, -50%) rotate(45deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfter {
  0% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(-45deg);
  }
  80% {
    opacity: 1;
    transform: scale(0.89) translate(-50%, -50%) rotate(-45deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
}

@keyframes bounceInBeforeDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfterDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
  }
}

html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: inherit;

  &:before,
  &:after {
    box-sizing: inherit;
  }
}
</style>
