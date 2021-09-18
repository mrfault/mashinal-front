export const ComparisonMixin = {
  mounted() {
    const comparisonItems = document.querySelector('.comparison__items');
    if (comparisonItems) {
      comparisonItems.addEventListener('wheel', this.onWheelScroll)
      comparisonItems.addEventListener('scroll', this.onScroll)
    }
  },
  methods: {
    onWheelScroll(event) {
      const comparisonItems = document.querySelector('.comparison__items');

      if (comparisonItems.scrollWidth > comparisonItems.clientWidth) {
        if (!event.deltaY) {
          return;
        }
        document.querySelectorAll('.collapse-content__columns').forEach(element => {
          element.scrollLeft += event.deltaY;
        })
  
        event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
        event.preventDefault();
      }
    },
    onScroll(event) {
      document.querySelectorAll('.collapse-content__columns').forEach(element => {
        element.scrollLeft = event.target.scrollLeft;
      })
    },
    isAllSpecsSame(values) {
      return new Set(values).size === 1
    },
    filteredSpecs(specs) {
      let data = specs;
      if (this.filter.showDifferences) {
        data = data.filter(spec => !this.isAllSpecsSame(spec.values))
      }
      if (this.filter.hideEmptyCells) {
        data = data.filter(spec => !(this.isAllSpecsSame(spec.values) && ['', ' ', '-', '—'].includes(spec.values[0])))
      }
      return data;
    },

    // Specs getters
    getModificationAndSupply(announcement) {
      return announcement.capacity || '—'
    },
    getYear(announcement) {
      return announcement.year || '—'
    },
    getMileage(announcement) {
      return (announcement.humanize_mileage || '—') + ' ' + this.$t('char_kilometre')
    },
    getColor(announcement) {
      return announcement?.colors?.map(item => item.name[this.locale]).join(', ') || '—'
    },
    getCustomsClearance(announcement) {
      return announcement.customs_clearance ? this.$t('cleared') : this.$t('cleared')
    },
    getOwnerType(announcement) {
      return announcement.owner_type ? this.$t('yes') : this.$t('no')
    },


    getModelTitle(model) {
      if (model.brand) {
        return model.brand.name + ' ' + model.model.name
      } else {
        return model.model.parent.name + ' ' + model.model.name
      }
    },
    getModelDescription(model) {
      const desc = [];

      // Generation
      if (model?.generation?.name) {
        desc.push(model?.generation?.name[this.locale]) // added model
      } else if (model?.model_generations && model?.generation_id) {
        desc.push(model.model_generations.find(g => g.id === model.generation_id).short_name[this.locale]) // recommended model
      }

      // Car type
      if (model.car_types && model.car_type_id) {
        desc.push(model.car_types.find(c => c.id === model.car_type_id).name[this.locale]) // recommended model
      }

      // Modification
      
      return desc
    },
    getMaxSpeed(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        if (item.specifications['ekspluatatsionnye-pokazateli']['maksimalnaya-skorost-kmch']) {
          return parseInt(item.specifications['ekspluatatsionnye-pokazateli']['maksimalnaya-skorost-kmch']);
        }
      }
      return '—'
    },
    getAcceleration100(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        if (item.specifications['ekspluatatsionnye-pokazateli']['razgon-do-100-kmch-s']) {
          return item.specifications['ekspluatatsionnye-pokazateli']['razgon-do-100-kmch-s'];
        }
      }
      return '—'
    },
    getFuelConsumptionCity(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        let fuelData = item.specifications['ekspluatatsionnye-pokazateli'];
        if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']) {
          if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['city']) {
            return fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['city'];
          }
        } else if (fuelData['raskhod-topliva-l-gorodtrassa']) {
          if (fuelData['raskhod-topliva-l-gorodtrassa'].toString().split('/')[0]) {
            return fuelData['raskhod-topliva-l-gorodtrassa'].toString().split('/')[0];
          }
        } else if (fuelData['raskhod-topliva-l-gorod']) {
          return fuelData['raskhod-topliva-l-gorod'];
        }
      }
      return '—'
    },
    getFuelConsumptionTrack(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        let fuelData = item.specifications['ekspluatatsionnye-pokazateli'];
        if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']) {
          if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['track']) {
            return fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['track'];
          }
        } else if (fuelData['raskhod-topliva-l-gorodtrassa']) {
          if (fuelData['raskhod-topliva-l-gorodtrassa'].toString().split('/')[1]) {
            return fuelData['raskhod-topliva-l-gorodtrassa'].toString().split('/')[1];
          }
        } else if (fuelData['raskhod-topliva-l-trassa']) {
          return fuelData['raskhod-topliva-l-trassa'];
        }
      }
      return '—'
    },
    getFuelConsumptionMixed(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        let fuelData = item.specifications['ekspluatatsionnye-pokazateli'];
        if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']) {
          if (fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['mixed']) {
            return fuelData['raskhod-topliva-l-gorodtrassasmeshannyy']['mixed'];
          }
        } else if (fuelData['raskhod-topliva-l-smeshannyy']) {
          return fuelData['raskhod-topliva-l-smeshannyy'];
        }
      }
      return '—'
    },
    getFuelBrand(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        if (item.specifications['ekspluatatsionnye-pokazateli']['marka-topliva']) {
          return this.$t('fuel_values')[item.specifications['ekspluatatsionnye-pokazateli']['marka-topliva']];
        }
      }
      return '—'
    },
    getEcoClass(item) {
      if (item.specifications['ekspluatatsionnye-pokazateli']) {
        if (item.specifications['ekspluatatsionnye-pokazateli']['ekologicheskiy-klass']) {
          return item.specifications['ekspluatatsionnye-pokazateli']['ekologicheskiy-klass'];
        }
      }
      return '—'
    },
    getEngineType(item) {
      if (item.specifications['dvigatel']) {
        if (item.specifications['dvigatel']['tip-dvigatelya']) {
          return item.specifications['dvigatel']['tip-dvigatelya'];
        }
      }
      return '—'
    },
    getHorsePower(item) {
      if (item.specifications['dvigatel']) {
        if (item.specifications['dvigatel']['maksimalnaya-moshchnost-lskvt-pri-obmin']) {
          let data = item.specifications['dvigatel']['maksimalnaya-moshchnost-lskvt-pri-obmin'];
          if (data.length === 3) {
            return this.$t('maksimalnaya-moshchnost-lskvt-pri-obmin__result', {
              'ls': data[0],
              'kvt': data[1],
              'ob/min': data[2]
            });
          }
        }
      }
      return '—'
    },
    getTorque(item) {
      if (item.specifications['dvigatel']) {
        if (item.specifications['dvigatel']['maksimalnyy-krutyashchiy-moment-nm-pri-obmin']) {
          let data = item.specifications['dvigatel']['maksimalnyy-krutyashchiy-moment-nm-pri-obmin'];
          if (data.length === 2) {
            return this.$t('maksimalnyy-krutyashchiy-moment-nm-pri-obmin__result', {
              'nm': data[0],
              'ob/min': data[1]
            });
          }
        }
      }
      return '—'
    },
    getLength(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['dlina']) {
          return parseInt(item.specifications['razmery-mm']['dlina']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getWidth(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['shirina']) {
          return parseInt(item.specifications['razmery-mm']['shirina']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getHeight(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['vysota']) {
          return parseInt(item.specifications['razmery-mm']['vysota']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getWheelBase(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['kolesnaya-baza']) {
          return parseInt(item.specifications['razmery-mm']['kolesnaya-baza']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getFrontWheelWidth(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['shirina-peredney-kolei']) {
          return parseInt(item.specifications['razmery-mm']['shirina-peredney-kolei']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getRearWheelWidth(item) {
      if (item.specifications['razmery-mm']) {
        if (item.specifications['razmery-mm']['shirina-zadney-kolei'] !== undefined) {
          return parseInt(item.specifications['razmery-mm']['shirina-zadney-kolei']) + ' ' + this.$t('char_millimetre');
        }
      }
      return '—'
    },
    getTrunkVolume(item) {
      if (item.specifications['obem-i-massa']) {
        if (item.specifications['obem-i-massa']['obem-bagazhnika-minmaks-l']) {
          let value = item.specifications['obem-i-massa']['obem-bagazhnika-minmaks-l'];
          if (value !== '-') {
            value = value.toString().split('/');
            if (value.length === 1) {
              return value[0];
            } else if (value.length === 2) {
              return value[1];
            }
          }
        }
      }
      return '—'
    },
    getSeatCount(item) {
      if (item.specifications['obshchaya-informatsiya']) {
        if (item.specifications['obshchaya-informatsiya']['kolichestvo-mest']) {
          let str = item.specifications['obshchaya-informatsiya']['kolichestvo-mest'].toString();
          if (str.split(',').length > 1) {
            return str.split(',')[1];
          } else {
            return str.split(',')[0];
          }
        }
      }
      return '—'
    },
    getTransmission(item) {
      if (item.specifications['transmissiya']) {
        if (item.specifications['transmissiya']['korobka-peredach']) {
          return item.specifications['transmissiya']['korobka-peredach'];
        }
      }
      return '—'
    },
    getBrandCountry(item) {
      if (item.specifications['obshchaya-informatsiya']) {
        if (item.specifications['obshchaya-informatsiya']['strana-marki']) {
          return item.specifications['obshchaya-informatsiya']['strana-marki'];
        }
      }
      return '—'
    }
  }
}