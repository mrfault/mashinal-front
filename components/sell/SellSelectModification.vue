<template>
  <div ref="sellSelectModification" class="sell_select-modification">
    <transition-group name="fade2">
      <div
        v-if="form.year && sellBody.length"
        :key="1"
        ref="sell-car_body_type"
        class="mt-3 mt-lg-0 mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('carcase') }}
            <span class="star">*</span>
          </span>
        </h2>
        <form-buttons
          v-model="form.car_body_type"
          :btn-class="'primary-outline select-body'"
          :group-by="isMobileBreakpoint ? 2 : 5"
          :options="sellBody"
          @change="
            handleChange(
              $event,
              'getSellGenerations',
              ['car_body_type'],
              [
                'sellGenerations',
                'sellEngines',
                'sellGearing',
                'sellTransmissions',
                'sellModifications',
              ],
              'generation_id',
            )
          "
        >
          <template #custom="{ button }">
            <div class="body-img">
              <img
                :alt="button.name[locale]"
                :src="$withBaseUrl(button.transformed_media)"
              />
            </div>
          </template>
        </form-buttons>
      </div>
      <div
        v-if="form.car_body_type && sellGenerations.length"
        :key="2"
        ref="sell-generation_id"
        class="mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('generation') }}
            <span class="star">*</span>
          </span>
        </h2>
        <form-buttons
          v-model="form.generation_id"
          :btn-class="'primary-outline select-generation'"
          :group-by="isMobileBreakpoint ? 2 : 5"
          :options="sellGenerations"
          @change="
            handleChange(
              $event,
              'getSellEngines',
              ['car_body_type', 'generation_id'],
              [
                'sellEngines',
                'sellGearing',
                'sellTransmissions',
                'sellModifications',
              ],
              'gearing',
            )
          "
        >
          <template #custom="{ button }">
            <div
              :class="[
                'generation-bg',
                { 'no-img': !!getGenerationStyle(button).noImg },
              ]"
              :style="getGenerationStyle(button)"
            ></div>
            <div class="generation-info">
              <span>
                {{ button.start_year }} — {{ button.end_year || currentYear }}
              </span>
              <span>{{ button.short_name[locale] }}</span>
            </div>
          </template>
        </form-buttons>
      </div>
      <div
        v-if="form.generation_id && sellEngines.length"
        :key="3"
        ref="sell-gearing"
        class="mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('fuel') }}
            <span class="star">*</span>
          </span>
        </h2>
        <form-buttons
          v-model="form.gearing"
          :btn-class="'primary-outline'"
          :group-by="isMobileBreakpoint ? 1 : 5"
          :options="
            sellEngines.map((o) => ({
              name: $t('engine_values')[o.engine],
              key: o.engine,
            }))
          "
          @change="
            handleChange(
              $event,
              'getSellGearing',
              ['car_body_type', 'generation_id', 'gearing'],
              ['sellGearing', 'sellTransmissions', 'sellModifications'],
              'transmission',
            )
          "
        >
          <template #icon="{ button }">
            <icon
              :class="`engine-${button.key}`"
              :name="getIcon('engine', button.key)"
            />
          </template>
        </form-buttons>

        <div class="mt-2 mt-lg-3">
          <form-checkbox
            v-model="form.autogas"
            :label="$t('gas_equipment')"
            input-name="autogas"
            transparent
            @change="$emit('update-form', { key: 'autogas', value: $event })"
          />
        </div>
      </div>

      <div
        v-if="form.gearing && sellGearing.length"
        :key="4"
        ref="sell-transmission"
        class="mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('type_of_drive') }}
            <span class="star">*</span>
          </span>
        </h2>
        <form-buttons
          v-model="form.transmission"
          :btn-class="'primary-outline'"
          :group-by="isMobileBreakpoint ? 1 : 5"
          :options="
            sellGearing.map((o) => ({
              name: $t('type_of_drive_values')[o.type_of_drive],
              key: o.type_of_drive,
            }))
          "
          @change="
            handleChange(
              $event,
              'getSellTransmissions',
              ['car_body_type', 'generation_id', 'gearing', 'transmission'],
              ['sellTransmissions', 'sellModifications'],
              'modification',
            )
          "
        >
          <template #icon="{ button }">
            <icon
              :class="`type-of-drive-${button.key}`"
              :name="getIcon('type_of_drive', button.key)"
            />
          </template>
        </form-buttons>
      </div>
      <div
        v-if="form.transmission && sellTransmissions.length"
        :key="5"
        ref="sell-modification"
        class="mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('box') }}
            <span class="star">*</span>
          </span>
        </h2>

        <form-buttons
          v-model="form.modification"
          :btn-class="'primary-outline'"
          :group-by="isMobileBreakpoint ? 1 : 5"
          :options="
            sellTransmissions.map((o) => ({
              name: $t('box_values')[o.box],
              key: o.box,
            }))
          "
          @change="
            handleChange(
              $event,
              'getSellModifications',
              [
                'car_body_type',
                'generation_id',
                'gearing',
                'transmission',
                'modification',
              ],
              ['sellModifications'],
              'car_catalog_id',
            )
          "
        >
          <template #icon="{ button }">
            <icon
              :class="`box-${button.key}`"
              :name="getIcon('box', button.key)"
            />
          </template>
        </form-buttons>
      </div>
      <div
        v-if="form.modification && sellModifications.length"
        :key="6"
        ref="sell-car_catalog_id"
        class="mb-3"
      >
        <h2 class="title-with-line full-width">
          <span>
            {{ $t('modification') }}
            <span class="star">*</span>
          </span>
        </h2>
        <form-buttons
          v-model="form.car_catalog_id"
          :btn-class="'primary-outline'"
          :group-by="isMobileBreakpoint ? 1 : 3"
          :options="
            sellModifications.map((o) => ({
              name: getModificationName(o),
              key: o.id,
            }))
          "
          @change="handleChange($event, false, ['car_catalog_id'], [])"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  props: {
    form: {},
    disableScroll: false,
  },
  data() {
    return {
      timeout: -1,
    }
  },
  computed: {
    ...mapGetters([
      'sellBody',
      'sellGenerations',
      'sellEngines',
      'sellGearing',
      'sellTransmissions',
      'sellModifications',
    ]),
  },
  methods: {
    ...mapActions([
      'getSellBody',
      'getSellGenerations',
      'getSellEngines',
      'getSellGearing',
      'getSellTransmissions',
      'getSellModifications',
    ]),
    getFormValues(keys) {
      let form = {}
      keys.map((key) => {
        let formKey = key
          .replace('car_body_type', 'body')
          .replace('generation_id', 'generation')
          .replace('gearing', 'engine')
          .replace('transmission', 'gearing')
          .replace('modification', 'transmission')
        form[formKey] = this.form[key]
      })
      return form
    },
    getModificationName(o) {
      let generation = this.sellGenerations.find(
        (o) => o.id === this.form.generation_id,
      )
      let name = `${this.$t('box_mode_values')[o.box]}/${
        generation.start_year
      } - ${generation.end_year || this.currentYear}`
      if (o.capacity) name = `${o.capacity} ${name}`
      if (o.power) name = `${o.power} ${this.$t('char_h_power')}/${name}`
      if (o.complect_type) name += `/${o.complect_type}`
      return name
    },
    getGenerationStyle(o) {
      const getImage = (media) =>
        media && media.length > 0 ? this.$withBaseUrl(media[0]) : false
      let carType = o.car_type_generation.find(
        (type) => type.car_type_id === o.pivot.car_type_id,
      )
      let imgUrl = getImage(carType && carType.transformed_media.thumb)
      return imgUrl ? {backgroundImage: `url('${imgUrl}')`} : {noImg: true}
    },
    getIcon(key, value) {
      return {
        engine: {
          1: 'fuel-station',
          2: 'battery-charge',
          3: 'diesel',
          4: 'gas',
          5: 'plug',
        },
        type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
        box: {
          1: 'mechanical',
          2: 'automatic',
          3: 'robot',
          4: 'variator',
          5: 'reductor',
        },
      }[key][value]
    },
    async handleChange(value, action, keys, props, nextKey) {

      if (!this.disableScroll) {
        if (keys[0] === 'car_catalog_id' && !this.isMobileBreakpoint) {
          setTimeout(() => {
            window.scrollTo({top: 1000, behavior: 'smooth'})
          }, 500)
        } else if (keys[0] === 'car_catalog_id' && this.isMobileBreakpoint) {
          window.scrollTo({top: 1200, behavior: 'smooth'})
          setTimeout(() => {
            // window.location.href = '#sellLastStepUploadImage'
            const el = document.querySelector('#anchor-saved_images')
            el.scrollIntoView({block: 'start', behavior: 'smooth'})
          }, 500)
        }
      }

      clearTimeout(this.timeout)
      let $container
      if (this.isMobileBreakpoint) {
        $container = document.querySelector('.mobile-screen .container')
        if (action) $container.style.minHeight = `${$container.scrollHeight}px`
      }
      // clean store props
      props.map((property) => {
        this.mutate({property, value: []})
      })
      // update form prop
      this.$emit('update-form', {key: keys[keys.length - 1], value})
      // skip step for the last input
      if (!action) return // clean form props
        ;
      [
        'car_body_type',
        'generation_id',
        'gearing',
        'transmission',
        'modification',
        'car_catalog_id',
      ].map((key) => {
        if (!keys.includes(key)) this.$emit('update-form', {key, value: ''})
      })
      // get values for the next input
      let values = this.getFormValues([...keys, 'brand', 'model', 'year'])
      await this[action](values)
      // move next if only one option available
      this.$nextTick(() => {
        let options = this[action.replace('getSell', 'sell')]
        if (options.length === 1 && nextKey !== 'car_catalog_id') {
          let nextValue =
            options[0].engine ||
            options[0].type_of_drive ||
            options[0].box ||
            options[0].id
          this.$emit('update-form', {key: nextKey, value: nextValue})
        } else if (this.isMobileBreakpoint) {
          this.timeout = setTimeout(() => {
            this.scrollTo(this.$refs[`sell-${nextKey}`], -34, 500)

            $container.style.minHeight = ''
          }, 100)
        }
        if (!this.isMobileBreakpoint) {
          this.timeout = setTimeout(() => {
            this.scrollTo(this.$refs[`sell-${nextKey}`], -20, 500)
          }, 100)
        }
      })
    },
  },
  async fetch() {
    if (!this.sellBody.length)
      await this.getSellBody(this.getFormValues(['brand', 'model', 'year']))
  },
  created() {
    this.getSellBody(this.getFormValues(['brand', 'model', 'year']))
  },
}
</script>
