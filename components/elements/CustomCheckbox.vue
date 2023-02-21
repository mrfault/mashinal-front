<template>
    <div class="customCheckbox">
        <input
            type="checkbox"
            :id="id"
            v-model="checked"
        >
        <label :for="id">{{ text }}</label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checked: false
            }
        },
        props: {
            id: {
                type: String,
                default: 'id'
            },
            text: {
                type: String,
                default: 'Text'
            },
            checkedValue: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            checked() {
                this.$emit('check', this.checked);
            }
        },
        mounted() {
            this.checked = this.checkedValue;
        }
    }
</script>

<style lang="scss" scoped>
    .customCheckbox {
        input {
            display: none;
            &:checked {
                & + label {
                    border-color: #528BFF;
                }
            }
        }
        label {
            font-weight: 400;
            font-size: 15px;
            line-height: 18px;
            margin: 0;
            text-align: center;
            color: #202939;
            padding: 16px 17px;
            border-radius: 8px;
            border: 1px solid #CDD5DF;
            cursor: pointer;
            transition: all .3s;
        }
    }
</style>