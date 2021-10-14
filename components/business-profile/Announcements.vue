<template>
  <grid 
    :announcements="profileType === 'salon' ? cars : parts" 
    :clickable="false"
  />
</template>

<script>
import { mapGetters } from 'vuex';

import Grid from '~/components/announcements/Grid';

export default {
  components: {
    Grid
  },
  data() {
    return {
      cars: [
        {
          "id": 2,
          "status": "3",
          "mileage": 57000,
          "mileage_measure": 1,
          "price": "178 300 ₼",
          "year": 2018,
          "media": {
            "thumb": [
              "https://mashin.al/storage/21814/conversions/mercedes-benz_s-class_mercedes-benz_s-klasse_6w222_sedan-thumb.jpg",
            ]
          },
          "is_autosalon": true,
          "is_part_salon": false,
          "id_unique": "002",
          "humanize_mileage": "57 000",
          "brand": {
            "name": "Mercedes"
          },
          "model": {
            "name": "S-class"
          },
          "car_catalog": {
            "capacity": "2.9"
          }
        },
        {
          "id": 3,
          "status": "3",
          "mileage": 24000,
          "mileage_measure": 1,
          "price": "149 000 ₼",
          "year": 2018,
          "media": {
            "thumb": [
              "https://mashin.al/storage/1102264/conversions/porsche_panamera_2_hb5_1-thumb.jpg",
            ]
          },
          "is_autosalon": true,
          "is_part_salon": false,
          "id_unique": "003",
          "humanize_mileage": "24 000",
          "brand": {
            "name": "Porsche"
          },
          "model": {
            "name": "Panamera"
          },
          "car_catalog": {
            "capacity": "3.0"
          }
        },
        {
          "id": 1,
          "status": "3",
          "mileage": 61000,
          "mileage_measure": 1,
          "price": "72 590 ₼",
          "year": 2019,
          "media": {
            "thumb": [
              "https://mashin.al/storage/6607/conversions/BMW_5_7_Sed_1-thumb.jpg",
            ]
          },
          "is_autosalon": true,
          "is_part_salon": false,
          "id_unique": "001",
          "humanize_mileage": "61 000",
          "brand": {
            "name": "BMW"
          },
          "model": {
            "name": "5-series"
          },
          "car_catalog": {
            "capacity": "2.0"
          }
        },
        {
          "id": 4,
          "status": "3",
          "mileage": 23000,
          "mileage_measure": 1,
          "price": "65 700 ₼",
          "year": 2019,
          "media": {
            "thumb": [
              "https://mashin.al/storage/3722/conversions/Audi_A5_2_Lift_2-thumb.jpg",
            ]
          },
          "is_autosalon": true,
          "is_part_salon": false,
          "id_unique": "004",
          "humanize_mileage": "23 000",
          "brand": {
            "name": "Audi"
          },
          "model": {
            "name": "A5"
          },
          "car_catalog": {
            "capacity": "2.0"
          }
        },
        {
          "id": 5,
          "status": "3",
          "mileage": 33000,
          "mileage_measure": 1,
          "price": "48 790 ₼",
          "year": 2019,
          "media": {
            "thumb": [
              "https://mashin.al/storage/16121/conversions/ford_mustang_6r_cab-thumb.jpg",
            ]
          },
          "is_autosalon": true,
          "is_part_salon": false,
          "id_unique": "005",
          "humanize_mileage": "33 000",
          "brand": {
            "name": "Ford"
          },
          "model": {
            "name": "Mustang"
          },
          "car_catalog": {
            "capacity": "2.3"
          }
        }
      ],
      parts: [
        {
          "id": 6,
          "status": "3",
          "price": this.$t('is_negotiable'),
          "media": {
            "thumb": [
              "/demo/parts/mercedes-wheel.jpg",
            ]
          },
          "is_autosalon": false,
          "is_part_salon": true,
          "id_unique": "006",
          "title": "Mercedes üçün rul"
        },
        {
          "id": 9,
          "status": "3",
          "price": "1490 ₼",
          "media": {
            "thumb": [
              "/demo/parts/bmw-f30-light.jpg",
            ]
          },
          "is_autosalon": false,
          "is_part_salon": true,
          "id_unique": "009",
          "title": "BMW F30 farası"
        },

        {
          "id": 7,
          "status": "3",
          "price": "850 ₼",
          "media": {
            "thumb": [
              "/demo/parts/mazda-cx7-turbo.jpg",
            ]
          },
          "is_autosalon": false,
          "is_part_salon": true,
          "id_unique": "007",
          "title": "Mazda CX7 Turbo"
        },
        {
          "id": 8,
          "status": "3",
          "price": "195 ₼",
          "media": {
            "thumb": [
              "/demo/parts/45-r17.jpg",
            ]
          },
          "is_autosalon": false,
          "is_part_salon": true,
          "id_unique": "008",
          "title": "Lassa 225/45/R17"
        },
        {
          "id": 10,
          "status": "3",
          "price": "180 ₼",
          "media": {
            "thumb": [
              "/demo/parts/ford-fusion-pump.jpg",
            ]
          },
          "is_autosalon": false,
          "is_part_salon": true,
          "id_unique": "010",
          "title": "Ford Fusion pompa"
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      profileType: 'packages/profileType'
    })
  }
}
</script>