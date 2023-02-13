<template>
    <div class="checkVinCode">
        <h4 class="checkVinCode__title">
            VIN-kod: <span>{{ vin }}</span>
        </h4>

        <h5 class="checkVinCode__subtitle">
            Avtomobil almazdan əvvəl VIN kodunu yoxlamaq tövsiyyə olunur
        </h5>
    </div>
</template>

<script>
    export default {
        props: {
            vin: {
                type: String,
                default: '######'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .checkVinCode {
        padding: 24px 20px;
        background-color: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #12B76A;
        &__title {
            font-weight: 400;
            font-size: 18px;
            line-height: 22px;
            color: #000000;
            span {
                font-weight: 500;
            }
        }
        &__subtitle {
            margin-top: 12px;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            color: #697586;
        }
    }
</style>