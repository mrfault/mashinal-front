<template>
    <div :class="['customDropdown', className]">
        <template v-if="className === 'lang'">
            <div class="customDropdown__head">
                <span class="customDropdown__selected">{{ selected }}</span>
                <icon name="chevron-down" />
            </div>

            <ul class="customDropdown__list">
                <li
                    class="customDropdown__list-item"
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectItem(item)"
                >{{ item }}</li>
            </ul>
        </template>

        <template v-else-if="className === 'aa'">
            <div class="customDropdown__head">
                <span class="customDropdown__selected">{{ selected }}</span>
                <icon name="chevron-down" />
            </div>

            <ul class="customDropdown__list">
                <li
                    class="customDropdown__list-item"
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectItem(item)"
                >{{ item }}</li>
            </ul>
        </template>
    </div>
</template>

<script>
    import { mapActions } from "vuex";

    export default {
        data() {
            return {
                selected: ''
            }
        },
        methods: {
            selectItem(item) {
                this.selected = item;
                this.changeLocale(item);
            },
            ...mapActions(['changeLocale'])
        },
        mounted() {
          this.selected = this.value;
        },
        props: {
            className: {
                type: String,
                default: ''
            },
            value: {
                default: 'Selected'
            },
            items: {
                type: Array,
                default() { return ['111', '222', '333'] }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .customDropdown {
        min-width: 66px;
        z-index: 10;
        overflow: hidden;
        &:hover {
            max-height: unset !important;
            .customDropdown__head {
                i {
                    transform: rotate(-180deg);
                }
            }
        }
        &.lang {
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
            color: #FFFFFF;
            max-height: 40px;
            padding: 6.5px 12px;
            border-radius: 4px;
            border: 1px solid #9AA4B2;
            background-color: #081A3E;

            .customDropdown__head {
                display: flex;
                align-items: center;
                margin-top: 2px;
                text-transform: uppercase;
                span {
                    margin-right: 6px;
                }
                i {
                    font-size: 24px;
                    &:before {
                        margin: 0;
                    }
                }
            }
            .customDropdown__list {
                list-style: none;
                margin: 0;
                padding: 0;
                &-item {
                    margin-top: 15px;
                    text-transform: uppercase;
                    transition: all .3s;
                    cursor: pointer;
                    &:hover {
                        color: #f81734;
                    }
                }
            }
        }
    }
</style>