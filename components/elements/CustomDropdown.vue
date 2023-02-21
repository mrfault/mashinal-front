<template>
    <div :class="['customDropdown', className]">
        <template v-if="className === 'lang'">
            <div class="customDropdown__head">
                <span class="customDropdown__selected">{{ selected }}</span>
                <icon name="chevron-down"/>
            </div>

            <ul class="customDropdown__list">
                <li
                    class="customDropdown__list-item"
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectItem(item)"
                >{{ item }}
                </li>
            </ul>
        </template>

        <template v-else>
            <div class="customDropdown__head">
                <span class="customDropdown__selected">
                    {{ (typeof selected === 'object') ? selected.name : selected }}
                </span>

                <icon name="chevron-down" />
            </div>

            <ul class="customDropdown__list">
                <li
                    class="customDropdown__list-item"
                    v-for="(item, i) in items"
                    :key="i"
                    @click="selectItem(item)"
                >
                    {{ (typeof items === 'object') ? item.name : item }}
                </li>
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
                if (this.className === 'lang') {
                    this.changeLocale(item);
                } else {
                    this.$emit('selected', item);
                }
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
                default() {
                    return ['111', '222', '333']
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .customDropdown {
        min-width: 66px;
        max-height: 48px;
        z-index: 10;
        border-radius: 8px;
        border: 1px solid #CDD5DF;
        background-color: #FFFFFF;
        overflow: hidden;
        &:hover {
            max-height: unset !important;

            .customDropdown__head {
                i {
                    transform: rotate(-180deg);
                }
            }
        }

        &__head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px 0 14px;

            .icon-chevron-down {
                &:before {
                    margin-left: 0;
                }
            }
        }

        &__selected {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: #202939;
        }

        &__list {
            margin: 0;
            padding: 8px;
            list-style: none;
            &-item {
                padding: 8px;
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                color: #202939;
                border-radius: 8px;
                cursor: pointer;
                transition: all .3s;
                &:hover {
                    background-color: #EEF2F6;
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
                margin-top: 2px;
                padding: 0;
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

            .customDropdown__selected {
                color: #FFFFFF;
            }

            .customDropdown__list {
                padding: 0;
                &-item {
                    color: #FFFFFF;
                    margin-top: 15px;
                    padding: 0;
                    text-transform: uppercase;
                    &:hover {
                        color: #f81734;
                        background-color: unset;
                    }
                }
            }
        }
    }
</style>