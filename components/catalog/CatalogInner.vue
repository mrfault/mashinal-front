<template>
  <div class="catalog-inner">
    <div class="row flex-column flex-lg-row">
      <div class="col-auto">
        <gallery where="catalog" :media="selectedCar.transformed_media" :title="title" :subtitle="modName(main)" />
        <div class="mod-info-card card pt-0 pt-lg-3 mb-lg-3 pb-0 pb-lg-3">
          <template v-if="isMobileBreakpoint">
            <h1 v-html="title"></h1>
            <div class="d-flex">
              <share-it type="publish" class="btns" />
              <button class="btn btn--dark-blue-2-outline full-width" @click.stop="copyToClipboard($route.path)">
                <icon name="link" /> {{ $t('copy_to_clipboard') }}
              </button>
            </div>
            <hr />
          </template>
          <template v-else>
            <thumbs-gallery where="catalog" :media="selectedCar.transformed_media" />
          </template>
          <h3 class="text-dark-blue-2 text-center">{{$t('modification')}} {{ modName(main) }}</h3>
          <div class="body-dimensions text-dark-blue-2" v-if="type">
            <div :class="['height', {'hidden': !main.size.height}]">
              <span>{{ main.size.height }}</span>
              <img src="/img/size-height.svg" alt="" />
            </div>
            <div>
              <div class="body">
                <inline-svg :src="$withBaseUrl(type.transformed_media)" />
              </div>
              <div :class="['length', {'hidden': !main.size.length}]">
                <img src="/img/size-length.svg" alt="" />
                <span>{{ main.size.length }}</span>
              </div>
            </div>
            <div :class="['width', {'hidden': !main.size.width}]">
              <img src="/img/size-width.svg" alt="" />
              <span>{{ main.size.width }}</span>
            </div>
          </div>
          <div class="vehicle-specs">
            <hr />
            <div class="row">
              <div class="col" v-for="(specs, i) in mainSpecs" :key="i">
                <ul>
                  <li v-if="spec || $t(key+'_values')[spec]" v-for="(spec, key) in specs" :key="key">
                    <span>{{ $t(key) }}</span>
                    <span v-if="hasValues(key)">{{ $t(key+'_values')[spec] }}</span>
                    <span v-else>{{ spec || '—' }} {{ spec && getSuffix(key) }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <hr v-if="isMobileBreakpoint" />
          </div>
        </div>
        <div class="card pt-1 pt-lg-3" v-if="hasMods">
          <div class="modification-specs" v-for="(specs, key) in modSpecs" :key="key">
            <h2 class="title-with-line">
              <span>{{ $t(key) }}</span>
            </h2>
            <div class="vehicle-specs">
              <div class="row">
                <div class="col" v-for="(col, i) in getDivSpecs(specs)" :key="i">
                  <ul>
                    <li v-for="(spec, key) in col" :key="key">
                      <span>{{ $t(key) }}</span>
                      <span v-if="['ekologicheskiy-klass'].includes(key)">{{ $t(spec) }}</span>
                      <span v-else-if="hasValues(key)">{{ $t(key+'_values')[spec || 0] }}</span>
                      <span v-else-if="Array.isArray(spec) && spec.length">
                        <template v-if="key.includes('maksimalnaya-moshchnost')">
                          <template v-if="spec[0]">{{ spec[0] }}</template>
                          <template v-if="spec[0] && spec[1] && spec[1] !== '—'">/</template>
                          <template v-if="spec[1] && spec[1] !== '—'">{{ spec[1] }}</template>
                          <template v-if="spec[2] && spec[2] !== '—'">{{ $t('at', { value: spec[2] }) }}</template>
                        </template>
                        <template v-else-if="key.includes('krutyashchiy-moment')">
                          <template v-if="spec[0]">{{ spec[0] }}</template>
                          <template v-if="spec[1] && spec[1] !== '—'">{{ $t('at', { value: spec[1] }) }}</template>
                        </template>
                        <template v-else-if="key.includes('electric') || key.includes('combined')">
                          <template v-if="spec[0]">{{ spec[0] }}</template>
                          <template v-if="spec[1] && spec[1] !== '—'">/ {{ spec[1] }}</template>
                        </template>
                      </span>
                      <span v-else-if="typeof spec === 'object' && !Array.isArray(spec)">
                        <template v-if="spec.city || spec.track || spec.mixed">{{ spec.city || '?' }} / {{ spec.track || '?' }} / {{ spec.mixed || '?' }}</template>
                      </span>
                      <span v-else-if="spec && !Array.isArray(spec)">{{ spec }}</span>
                      <span v-else>-</span>
                    </li>
                  </ul>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
        <catalog-announcements :catalog-id="firstGeneration.id" :key="firstGeneration.id" />
      </div>
      <div class="col-auto">
        <div class="card mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
          <div class="vehicle-specs">
            <h1 v-if="selectedBrand && selectedModel">
              {{ selectedBrand.name }} {{ $translateHard(selectedModel.name) }}
            </h1>
            <hr />
            <ul>
              <li v-if="prodYears">
                <span>{{ $t('prod_years') }}</span>
                <span>{{ prodYears }}</span>
              </li>
              <li v-if="generationName">
                <span>{{ $t('generation') }}</span>
                <span>{{ generationName }}</span>
              </li>
              <li v-if="type">
                <span>{{ $t('body_type') }}</span>
                <span>{{ type.name[locale] }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="card mt-2 mt-lg-3">
          <h2 class="title-with-line">
            <span>{{ $t('available_modifications') }}</span>
          </h2>
          <div class="body-modifications" v-for="(o, key) in modificationsList" :key="key">
            <h4 class="text-dark-blue-2">{{ $t('engine_values')[key] }}</h4>
            <div class="body-modifications_row" v-for="(group, key, index) in o" :key="key">
              <h5 class="text-dark-blue-3 mb-1" v-if="key !== '–' || index" >{{ key }} </h5>
              <template v-for="mod in group.filter(mod => mod.main)">
                <a :class="['row flex-nowrap mb-1 align-items-center', { active: mod.id == firstGeneration.id }]"
                  :href="`${pathBase}/mod/${mod.id}`"
                  :key="mod.id" @click.prevent="handleModClick(mod)"
                >
                  <span class="col">{{ modName(mod.main) }}</span>
                  <span class="col">{{ modPower(mod) }}</span>
                  <span class="col">{{ modBox(mod.main) }}</span>
                  <span class="col-auto">
                    <add-comparison has-border :id="mod.id" type="model"/>
                  </span>
                </a>
              </template>
              <hr class="mt-2 mt-lg-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Gallery from '~/components/announcements/inner/Gallery';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
import AddComparison from '~/components/announcements/AddComparison';
import CatalogAnnouncements from '~/components/catalog/CatalogAnnouncements';

export default {
  props: {
    selectedCar: {},
    selectedBrand: {},
    selectedModel: {}
  },
  components: {
    Gallery,
    ThumbsGallery,
    AddComparison,
    CatalogAnnouncements
  },
  computed: {
    ...mapGetters(['firstGeneration', 'modificationsList']),

    main() {
      return this.firstGeneration.main;
    },
    type() {
      return this.firstGeneration.car_type;
    },
    modSpecs() {
      return this.firstGeneration.specifications;
    },
    mainSpecs() {
      return this.isMobileBreakpoint
        ? [{...this.main[' '], ...this.main['  ']}]
        : [this.main[' '], this.main['  ']];
    },
    generationName() {
      return this.$translateHard(this.firstGeneration?.generation?.short_name);
    },
    prodYears() {
      return this.firstGeneration?.generation?.start_year + ' – '+ (this.firstGeneration?.generation?.end_year || this.currentYear);
    },
    hasMods() {
      return Object.keys(this.modificationsList).length > 0;
    },
    title() {
      let title = this.selectedBrand?.name || '';
      if (this.selectedModel?.name) title += (' ' + this.$translateHard(this.selectedModel.name));
      if (this.generationName) title += ` | <span>${this.generationName}</span>`;
      if (this.prodYears) title += ` | <span>${this.prodYears}</span>`;
      return title;
    },
    pathBase() {
      let { brand, model, generation, body } = {...this.$route.params};
      return this.$localePath(`/catalog/${brand}/${model}/${generation}/${body}`);
    },
    model() {
      return {
        brand: this.selectedBrand,
        model: this.selectedModel,
        generation: this.selectedCar,
        carType: {},
        modification: this.modSpecs,
      }
    }
  },
  methods: {
    modName(main) {
      let box = this.$t('box_mode_values')[main[' ']['box']];
      return (main[' ']['obem'] && (main[' ']['obem'] + ' ' + box)) || box;
    },
    modPower(mod) {
      let calculatedPower;
      let combinedPower = mod.specifications.dvigatel.combined_power;
      let electricPower = mod.specifications.dvigatel.electric_motor_power;
      if(combinedPower && combinedPower[0] && combinedPower[0] != '0')
        calculatedPower = Math.ceil(combinedPower[0]) + ' ' + this.$t('char_h_power');
      else if (electricPower && electricPower[0] && electricPower[0]!= '0')
        calculatedPower = Math.ceil(electricPower[0]) + ' ' + this.$t('char_h_power')
      else
        calculatedPower = (mod.main['  ']['moshchnost'] && (mod.main['  ']['moshchnost'] + ' ' + this.$t('char_h_power'))) || '—';
      return calculatedPower;

    },
    modBox(main) {
      return this.$t('box_values')[main[' ']['box']];
    },
    hasValues(key) {
      return [
          'fuel', 'type_of_drive', 'engine', 'box', 'type_of_boost', 'engine_location', 'cylinder_location',
          'engine_power_system', 'rear_brakes', 'front_brakes', 'rear_suspensions', 'front_suspensions', 'brand_country'
        ].indexOf(key) !== -1;
    },
    getSuffix(key) {
      if (key === 'obem' || key === 'raskhod') return this.$t('char_litre');
      if (key === 'moshchnost') return this.$t('char_h_power');
      if (key === 'razgon') return this.$t('char_second');
    },
    getDivSpecs(specs) {
      let filtered = {}, divSpecs = [{}, {}];
      for (let key in specs) {
        let value = specs[key];
        if (value instanceof Array ? value.filter(i => !['-','—'].includes(i)).length : !['',0,null,false,'-','—'].includes(value)) {
          if(key === 'combined_power') {
            if(value.reduce((a, b) => a + b, 0) > 0)
              filtered[key] = value;
          }
          else if (Array.isArray(value)) {
            if(value.reduce((a, b) => a + b, 0) > 0)
              filtered[key] = value;
          }
          else if(Object.keys(value).length) {
            if(Object.values(value).reduce((a, b) => a + b, 0) > 0)
              filtered[key] = value;
          }
          else if (!(this.hasValues(key) && value === 0)) {
            filtered[key] = value;
          }
        }
      }
      Object.keys(filtered).map((key, i) => {
        divSpecs[i % 2 === 0 ? 0 : 1][key] = specs[key];
      });
      return this.isMobileBreakpoint ? [filtered] : divSpecs;
    },
    handleModClick(mod) {
      let path = `${this.pathBase}/mod/${mod.id}`;
      this.$router.push(path, () => {
        this.scrollTo('.mod-info-card', [0, -25]);
      });
    }
  }
}
</script>
