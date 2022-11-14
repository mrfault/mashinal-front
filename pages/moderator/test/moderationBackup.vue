<template>
              <div>
                <title-with-line-and-reject-reason
                  title="body_type"
                  rejectKey="body_type"
                />

                <form-buttons
                  v-model="single_announce.car_type"
                  :options="sell_bodies"
                  :btn-class="'primary-outline select-body'"
                  :group-by="isMobileBreakpoint ? 2 : 5"
                  class="mb-4"
                >
                  <template #custom="{ button }">
                    <div class="body-img">
                      <img
                        :src="$withBaseUrl(button.transformed_media)"
                        :alt="button.name[locale]"
                      />
                    </div>
                  </template>
                </form-buttons>

                <title-with-line-and-reject-reason :title="$t('generation')" />

                <form-buttons
                  v-model="single_announce.generation"
                  :options="generations"
                  :btn-class="'primary-outline select-body'"
                  :group-by="isMobileBreakpoint ? 2 : 5"
                  class="mb-4"
                >
                  <template #custom="{ button }">
                    <div class="body-img">
                      <img
                        :src="$withBaseUrl(button.transformed_media)"
                        :alt="button.name[locale]"
                      />
                    </div>
                  </template>
                </form-buttons>

                <title-with-line-and-reject-reason :title="$t('fuel')" />

                <button-options
                  :list="engines"
                  :selected="single_announce.car_catalog.engine_id"
                  isEngine
                />

                <form-checkbox
                  :label="$t('gas_equipment')"
                  v-model="single_announce.autogas"
                  transparent
                  input-name="autogas"
                  class="mb-4"
                />

                <title-with-line-and-reject-reason :title="$t('tip-privoda')" />
                <!-- <form-buttons
                  v-model="single_announce.car_catalog.engine_id"
                  :options="boxesList"
                  :btn-class="'primary-outline'"
                  :group-by="isMobileBreakpoint ? 1 : 5"
                  v-if="false"
                >
                  <template #icon="{ button }">
                    <icon
                      :name="getIcon('engine', button.key)"
                      :class="`engine-${button.key}`"
                    />
                  </template>
                </form-buttons> -->

                <button-options
                  :list="type_of_drives"
                  :selected="single_announce.car_catalog.engine_id"
                  isTypeofdrive
                  class="mb-4"
                />

                <title-with-line-and-reject-reason :title="$t('box')" />
                <button-options
                  :list="boxesList"
                  :selected="single_announce.car_catalog.box_id"
                  isGearbox
                  class="mb-4"
                />

                <title-with-line-and-reject-reason
                  :title="$t('modification')"
                />
                <button-options
                  :list="modificationsList"
                  :selected="single_announce.car_catalog.box_id"
                  isGearbox
                  class="mb-4"
                />
              </div>
</template>

<script>
export default {

}
</script>

<style>

</style>