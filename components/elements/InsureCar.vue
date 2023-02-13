<template>
    <div class="insureCar">
        <h4 class="insureCar__title">Avtomobilini sığortala</h4>

        <ul class="insureCar__list">
            <li
                class="insureCar__list-item"
                v-for="(item, i) in items"
                :key="i"
            >
                <img :src="item.url" alt="secure_icon">

                <p>{{ item.name }}</p>

                <span>{{ item.price }}</span>
            </li>
        </ul>

        <button class="insureCar__btn">Sığorta al</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    { url: '/icons/secure.svg', name: 'NV-nin icbari sığorta məbləği', price: '24 AZN' },
                    { url: '/icons/secure.svg', name: 'Təqribi kasko sığorta məbləği', price: '98 AZN' }
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    .insureCar {
        padding: 24px 20px;
        background-color: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #2970FF;
        &__title {
            font-weight: 500;
            font-size: 18px;
            line-height: 22px;
            color: #000000;
            margin-bottom: 22px;
        }
        &__list {
            list-style: none;
            margin: 0;
            padding: 0;
            &-item {
                display: flex;
                align-items: center;
                &:not(:first-child) {
                    margin-top: 14px;
                }
                p {
                    margin: 0 12px 0 8px;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 18px;
                    color: #364152;
                }
                span {
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 22px;
                    color: #364152;
                }
            }
        }
        &__btn {
            margin-top: 22px;
            padding: 17px;
            width: 100%;
            font-weight: 500;
            font-size: 15px;
            line-height: 18px;
            color: #FFFFFF;
            border: none;
            outline: none;
            background: #004EEB;
            border-radius: 8px;
        }
    }
</style>