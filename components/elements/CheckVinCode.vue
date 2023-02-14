<template>
    <div class="checkVinCode">
        <h4 class="checkVinCode__title">
            VIN-kod: <span>{{ vin }}</span>
        </h4>

        <h5 class="checkVinCode__subtitle">
            Avtomobil almazdan əvvəl VIN kodunu yoxlamaq tövsiyyə olunur
        </h5>

        <nuxt-link class="checkVinCode__btn" :to="`https://www.google.com/search?tbm=isch&q=${vin}`" target="_blank">
            <span>VIN kodu yoxla</span>
            <img src="/icons/search_2.svg" alt="search_icon">
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        props: {
            vin: {
                type: String,
                default: '3KPF24AD8KE102301'
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
        &__btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 16px;
            width: 100%;
            padding: 17px;
            border-radius: 8px;
            border: 1px solid #CDD5DF;
            background-color: transparent;
            span {
                font-weight: 500;
                font-size: 15px;
                line-height: 18px;
                color: #364152;
                margin-right: 8px;
            }
        }
    }
</style>