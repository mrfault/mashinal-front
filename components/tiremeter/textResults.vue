<template>
  <div>
    
    <h2 class="title-with-line full-width mb-2">
      <span>{{ $t('result_of_tire_size_change') }}</span>
    </h2>
    <div class="ma-tiremeter__results-text" v-if="listD.length">
      <h5 class="ma-tiremeter__results-text--title">
                <template v-if="increase.d">
          {{
            $t('result_of_tire_size_change_title_1').replace(
              'INCREASE',
              $t('will_increase'),
            )
          }}776142063
        </template>
        <template v-else>
          {{
            $t('result_of_tire_size_change_title_1').replace(
              'INCREASE',
              $t('will_diminish'),
            )
          }}
        </template>
        <span class="ma-tiremeter__results-text--title-d">"D"</span>
        <template v-if="increase.d">
          {{
            $t('result_of_tire_size_change_title_2').replace(
              'INCREASE',
              $t('will_increase'),
            )
          }}776142063
        </template>
        <template v-else>
          {{
            $t('result_of_tire_size_change_title_2').replace(
              'INCREASE',
              $t('will_diminish'),
            )
          }}
        </template>
      </h5>
      <h6
        class="ma-tiremeter__results-text--item"
        v-for="(item, index) in listD"
        :key="index + 5465"
      >
        <span
          class="ma-tiremeter__results-text--item-plus"
          v-if="item.isPositive"
        >
          <icon name="plus" />
        </span>
        <span class="ma-tiremeter__results-text--item-minus" v-else>
          <icon name="minus" />
        </span>
        {{
          $t(item.text).replace('PERCENTAGE', `${Math.abs(errorPercentage)}%`)
        }}
      </h6>
    </div>
    <div class="ma-tiremeter__results-text" v-if="listH.length">
      <h5 class="ma-tiremeter__results-text--title">
        <template v-if="increase.h">
          {{
            $t('result_of_tire_size_change_h').replace(
              'INCREASE',
              $t('will_increase'),
            )
          }}
        </template>
        <template v-else>
          {{
            $t('result_of_tire_size_change_h').replace(
              'INCREASE',
              $t('will_diminish'),
            )
          }}
        </template>
        <span class="ma-tiremeter__results-text--title-h">"H"</span>
      </h5>
      <h6
        class="ma-tiremeter__results-text--item"
        v-for="(item, index) in listH"
        :key="index + 5465"
      >
        <span
          class="ma-tiremeter__results-text--item-plus"
          v-if="item.isPositive"
        >
          <icon name="plus" />
        </span>
        <span class="ma-tiremeter__results-text--item-minus" v-else>
          <icon name="minus" />
        </span>
        {{ $t(item.text) }}
      </h6>
    </div>
    <div class="ma-tiremeter__results-text" v-if="listL.length">
      <h5 class="ma-tiremeter__results-text--title">
        <template v-if="increase.l">
          {{
            $t('result_of_tire_size_change_l').replace(
              'INCREASE',
              $t('will_increase'),
            )
          }}
        </template>
        <template v-else>
          {{
            $t('result_of_tire_size_change_l').replace(
              'INCREASE',
              $t('will_diminish'),
            )
          }}
        </template>
        <span class="ma-tiremeter__results-text--title-l">"L"</span>
      </h5>
      <h6
        class="ma-tiremeter__results-text--item"
        v-for="(item, index) in listL"
        :key="index + 5465"
      >
        <span
          class="ma-tiremeter__results-text--item-plus"
          v-if="item.isPositive"
        >
          <icon name="plus" />
        </span>
        <span class="ma-tiremeter__results-text--item-minus" v-else>
          <icon name="minus" />
        </span>
        {{ $t(item.text) }}
      </h6>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listD: {
      type: Array,
      default: () => [],
    },
    listH: {
      type: Array,
      default: [],
    },
    listL: {
      type: Array,
      default: [],
    },
    errorPercentage: {
      type: Number,
      default: 0,
    },
    increase: Object,
  },
}
</script>

18 xan sarayı
