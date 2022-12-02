<template>

  <div class="reject-reason-with-title">
    <div
      :class="{ 'w-100': noApproval }"
      class="reject-reason-with-title__title"
    >
      <h2 :id="id" class="title-with-line full-width">
        <span :id="spanId">
          {{ $t(title) }}
          <template v-if="subtitle">({{ $t(subtitle) }})</template>
          <span v-if="required" class="star">*</span>
        </span>
      </h2>
    </div>
    <div
      v-if="!noApproval"
      class="mb-2 ml-2"
      style="display: inline-block; z-index: 0;"
      @click="openPhotoIssuePopup"
    >
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

  </div>

</template>

<script>
import RejectReason from '~/components/moderator/rejectReason'

export default {
  components: {
    RejectReason,
  },
  data() {
    return {
      rejected: false,
      disabled: false,
    }
  },
  props: {
    title: String,
    required: Boolean,
    id: String,
    spanId: String,
    subtitle: String,
    noApproval: Boolean,
    // reject key
    disabledValue: {
      default: false,
      type: Boolean,
    },
    rejectKey: {},
    imageRejected: Boolean,
    imageReject: Boolean,
    modalToggled: Boolean
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
    changeReason() {
      this.$emit('changeReason', true)
    },
    // reject key
    openPhotoIssuePopup() {
      if (this.rejectKey === 'image') {
        this.$emit('change', this.rejectKey)
      }
      if (this.rejectKey === '360') {
        this.$emit('change', this.rejectKey)
      }
    },
    click() {
      if (this.imageReject) {
        this.rejected = this.rejected;
      } else {
        this.rejected = !this.rejected
      }

      this.$emit('change', this.rejectKey)
    },
  },
  mounted() {
    this.disabled = this.disabledValue
    if (this.rejectKey === 'image') {
      this.$nuxt.$on('image-checkbox-change', (toggle) => {
        this.rejectedValue = toggle;
      })
    }
    if (this.rejectKey === '360') {
      this.$nuxt.$on('360-checkbox-change', (toggle) => {
        this.rejectedValue = toggle
      })
    }
  },
  watch: {
    'imageRejected': {
      handler() {
        if (this.rejectKey = "image") {
          this.rejected = this.imageRejected;
        }
      }
    }
  }

}
</script>

<style lang="scss">
.reject-reason-with-title {
  padding-top: 30px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__title {
    width: calc(100% - 51px);
  }
}

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
        z-index: 1;
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
