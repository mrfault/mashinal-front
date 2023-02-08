<template>
    <div :class="['minMaxSearch', className]">
        <template v-if="className === 'dropdown'">
            <div :class="['minMaxSearch__divider', {selected: selectedItems.min}]" @click.stop="addActive">
                <div class="minMaxSearch__head">
                    <span>{{ placeholder[0] }}</span>
                    <span v-if="selectedItems.min">{{ selectedItems.min }}</span>

                    <icon :name="'chevron-down'"/>
                </div>

                <ul class="minMaxSearch__list">
                    <li
                        class="minMaxSearch__list-item"
                        v-for="item in initialOptions"
                        :key="item.id"
                        @click="selectItem('min', item.key)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </div>

            <div :class="['minMaxSearch__divider', {selected: selectedItems.max}]" @click.stop="addActive">
                <div class="minMaxSearch__head">
                    <span>{{ placeholder[1] }}</span>
                    <span v-if="selectedItems.max">{{ selectedItems.max }}</span>

                    <icon :name="'chevron-down'"/>
                </div>

                <ul class="minMaxSearch__list">
                    <li
                        class="minMaxSearch__list-item"
                        v-for="item in initialOptions"
                        :key="item.id"
                        @click="selectItem('max', item.key)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </template>

        <template v-else>
            <div
                :class="{ selected: item.value }"
                v-for="item in items"
                :key="item.id"
            >
                <span class="label" v-if="item.value">{{ item.placeholder }}</span>
<!--                <span class="value" v-if="item.value">{{ numberWithSpaces(item.value) }}</span>-->
                <input
                    type="text"
                    :placeholder="item.placeholder"
                    v-model.trim="item.value"
                >
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                initialOptions: [],
                items: [
                    { id: 1, placeholder: '', value: '' },
                    { id: 2, placeholder: '', value: '' }
                ],
                selectedItems: {
                    min: '',
                    max: ''
                }
            }
        },
        methods: {
            // aaa(value) {
            //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            //     // this.$emit('change', this.items);
            // },
            numberWithSpaces(num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            },
            addActive(e) {
                e.target.closest('.minMaxSearch__divider').classList.toggle('active');
            },
            selectItem(type, item) {
                (type === 'min') ? this.selectedItems.min = item : this.selectedItems.max = item;
                this.$emit('change', this.selectedItems);
            },
            close() {
                document.querySelectorAll('.minMaxSearch__divider').forEach(item => {
                    item.classList.remove('active');
                })
            }
        },
        // computed: {
        //     aaa(value) {
        //         return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        //         // this.$emit('change', this.items);
        //     },
        // },
        mounted() {
            this.items[0].placeholder = this.placeholder[0];
            this.items[1].placeholder = this.placeholder[1];

            this.initialOptions = this.options;

            window.addEventListener('click', this.close);
        },
        beforeDestroy() {
            window.addEventListener('click', this.close);
        },
        props: {
            className: {
                type: String,
                default: ''
            },
            placeholder: {
                type: Array,
                default() {
                    return []
                }
            },
            options: {
                type: Array,
                default() {
                    return []
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .minMaxSearch {
        display: flex;
        max-width: 288px;
        width: 100%;
        height: 52px;
        border: 1px solid #CDD5DF;
        border-radius: 8px;
        background-color: #FFFFFF;
        .label {
            margin-top: -3px;
            font-size: 12px;
            color: #4B5565;
        }

        & > div {
            position: relative;
            display: flex;
            align-items: center;
            width: 50%;
            padding: 16px;
            &.selected {
                align-items: unset;
                flex-direction: column;
                padding: 8px 16px;
            }
            &:first-child {
                border-right: 1px solid #CDD5DF;
            }
        }

        input {
            width: 100%;
            font-size: 16px;
            padding: 0;
            border: none;
            outline: none;
        }

        &.dropdown {
            .minMaxSearch__divider {
                flex-direction: column;
                padding: 0;
                &.active {
                    .minMaxSearch__head {
                        i {
                            transform: translateY(-50%) rotate(180deg);
                        }
                    }
                    .minMaxSearch__list {
                        display: block;
                        min-height: 255px;
                    }
                }
                &.selected {
                    .minMaxSearch__head {
                        align-items: unset;
                        flex-direction: column;
                        padding: 8px 16px;
                        span {
                            &:first-child {
                                font-size: 12px;
                                color: #4B5565;
                            }
                        }
                    }
                    .minMaxSearch__list {
                        margin: -7px 0 0 -1px;
                    }
                }
            }

            .minMaxSearch__head {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 16px;
                span {
                    pointer-events: none;
                }
                i {
                    position: absolute;
                    top: 50%;
                    right: 16px;
                    transform: translateY(-50%);
                    transition: all .3s;
                    &:before {
                        margin: 0;
                    }
                }
            }

            .minMaxSearch__list {
                display: none;
                width: 102%;
                min-height: 0;
                margin: -7px 0 0 1px;
                padding: 8px;
                border: 1px solid #CDD5DF;
                border-top: none;
                list-style: none;
                overflow: hidden;
                border-radius: 0 0 8px 8px;
                //transition: all .3s;
                background-color: #FFFFFF;
                z-index: 10;
                overflow-y: auto;
                //opacity: 0;
                &-item {
                    font-size: 16px;
                    line-height: 20px;
                    padding: 12px 8px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                        background-color: #EEF2F6;
                    }

                    &:not(:first-child) {
                        margin-top: 5px;
                    }
                }
            }
        }
    }
</style>