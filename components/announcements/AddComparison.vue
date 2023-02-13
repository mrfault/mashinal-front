<template>
    <!-- <button
      class="btn-sq btn-sq--color-red"
      :class="{'active': isActive}"
      @click.prevent.stop="handleClick"
    >
      <icon name="compare" />
    </button> -->
<!--    <div class="white-background">-->
        <button
            class="btn-compare btn-transparent"
            :class="{ 'btn-compare-active': isActive }"
            @click.prevent.stop="handleClick()"
        >
            <span v-if="text">{{ text }}</span>
            <img v-if="img" src="/icons/compare-icon_new.svg" alt="icon">
<!--            <i></i>-->
        </button>
<!--    </div>-->
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    props: {
        text: {
            type: String
        },
        img: {
            type: Boolean,
            default: false
        },
        id: {
            type: [Number, String],
            required: false
        },
        type: {
            type: String,
            required: false,
            default: 'announcement',
            validator(val) {
                return ['announcement', 'model'].includes(val)
            }

        }
    },
    methods: {
        async handleClick() {
            if (this.type === 'announcement') {
                if (this.announcementsList.findIndex(a => a.id_unique === this.id) >= 0) {
                    this.$toasted.success(this.$t('comparison_removed'))
                } else {
                    if (this.limit === this.announcementsList.length) {
                        this.$toasted.error(this.$t('reached_the_limit_announcement'))
                    } else {
                        this.$toasted.success(this.$t('comparison_added'))
                    }
                }
                await this.$store.dispatch('comparison/toggleAnnouncement', this.id)
            } else {
                if (this.modelsList.findIndex(a => a.id === this.id) >= 0) {
                    this.$toasted.success(this.$t('comparison_removed'))
                } else {
                    if (this.limit === this.modelsList.length) {
                        this.$toasted.error(this.$t('reached_the_limit_model'))
                    } else {
                        this.$toasted.success(this.$t('comparison_added'))
                    }
                }
                await this.$store.dispatch('comparison/toggleModel', this.id)
            }
        }
    },
    computed: {
        ...mapGetters({
            announcementsList: 'comparison/announcementsList',
            announcementIds: 'comparison/announcementIds',
            modelsList: 'comparison/modelsList',
            limit: 'comparison/limit',
        }),
        isActive() {
            if (this.type === 'announcement') {
                return this.announcementIds.findIndex(aId => aId === this.id) >= 0
            } else {
                return this.modelsList.findIndex(model => model.id === this.id) >= 0
            }
        }
    }
}
</script>
