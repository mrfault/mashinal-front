const getName = (search, data, not_set = false) => {
  let param = data && data.find(item => item.key === search) || {};
  return !not_set && param.name === 'not_set' ? false : param.name;
}

export const AnnouncementDataMixin = {
  methods: {
    getSpecs(...specs) {
      return specs.filter(spec => spec).join(' / ');
    }
  },
  computed: {
    motoTypeKey() {
      if (this.announcement.moto_brand) return 1;
      else if (this.announcement.scooter_brand) return 2;
      else if (this.announcement.moto_atv_brand) return 3;
    },
    region() {
      if (!this.announcement.region_id || !this.sellOptions) return false;
      return getName(this.announcement.region_id, this.sellOptions.regions);
    },
    color() {
      let color = this.announcement.colors || this.announcement.color || {};
      if (!color.length && !color.id) return ' ';
      return color instanceof Array
        ? color.filter(color => color.name).map(color => color.name[this.locale]).join(', ') || ' '
        : color.name?.[this.locale] || ' ';
    },
    box() {
      switch(this.type) {
        case 'cars':
          return this.$t('box_values')[this.catalog.main[' ']['box']];
        case 'moto':
          if (!this.motoOptions.config) return false;
          return this.$t(getName(this.announcement.box_id, this.motoOptions.config.box.sell_values[this.motoTypeKey]));
        case 'commercial':
          return getName(this.announcement.box_id, [
            {name: this.$t('automatic'), key: 1},
            {name: this.$t('semiautomatic'), key: 2},
            {name: this.$t('robot'), key: 3},
            {name: this.$t('mechanical'), key: 4},
            {name: this.$t('variable'), key: 5},
          ]);
        default:
          return null;
      }
    },
    gear() {
      switch(this.type) {
        case 'cars':
          return this.$t('type_of_drive_values')[this.catalog.main[' ']['type_of_drive']];
        case 'moto':
          if (!this.motoOptions.config) return false;
          return this.$t(getName(this.announcement.gear_id, this.motoOptions.config.drive.sell_values[this.motoTypeKey]));
        case 'commercial':
          return getName(this.announcement.gear_id, [
            {name: this.$t('rear_wheel_drive_with_plug_in_front'), key: 1},
            {name: this.$t('zadniy'), key: 2},
            {name: this.$t('peredniy'), key: 3},
            {name: this.$t('polnyy'), key: 4},
            {name: this.$t('polnyy_podkluchayemiy'), key: 5},
            {name: this.$t('permanent_vvvall_wheel_drive'), key: 6}
          ]);
        default:
          return null;
      }
    },
    engine() {
      switch(this.type) {
        case 'cars':
          return this.$t('engine_values')[this.catalog.main['  ']['engine']];
        case 'moto':
          if (!this.motoOptions.config) return false;
          return this.$t(getName(this.announcement.engine_type_id, this.motoOptions.config.engine.sell_values[this.motoTypeKey]));
        case 'commercial':
          return getName(this.announcement.engine_id, [
            {name: this.$t('бензин') , key: 1},
            {name: this.$t('дизель') , key: 2},
            {name: this.$t('электро') , key: 3},
            {name: this.$t('гибрид') , key: 4},
            {name: this.$t('diesel_plus_gas') , key: 5},
            {name: this.$t('bensin_plus_gas') , key: 6},
            {name: this.$t('gas') , key: 7}
          ]);
        default:
          return null;
      }
    },
    bodyType() {
      return this.catalog && this.catalog.car_type.name[this.locale];
    },
    cylinderBlock() {
      if (!this.motoOptions.config) return false;
      return this.$t(getName(this.announcement.cylinders, this.motoOptions.config.cylinders.sell_values[this.motoTypeKey]));
    },
    cylinderPlacement() {
      if (!this.motoOptions.config) return false;
      return this.$t(getName(this.announcement.cylinder_type_id, this.motoOptions.config.cylinder_placement.sell_values[this.motoTypeKey]));
    },
    tact() {
      if (this.announcement.tact === 0) return false;
      return this.announcement.tact === 1 ? 2 : 4;
    },
    commercialType() {
      if (this.announcement.commercial_car_type)
        return this.announcement.commercial_car_type.name[this.locale];
      if (this.announcement.truck_car_type)
        return this.announcement.truck_car_type.name[this.locale];
      if (this.announcement.cabin_type)
        return this.announcement.cabin_type.name[this.locale];
      if (this.announcement.bus_car_type)
        return this.announcement.bus_car_type.name[this.locale];
      if (this.announcement.trailer_type)
        return this.announcement.trailer_type.name[this.locale];
      if (this.announcement.equip_type)
        return this.announcement.equip_type.name[this.locale];
      if (this.announcement.construction_type)
        return this.announcement.construction_type.name[this.locale];
      if (this.announcement.forklift_type)
        return this.announcement.forklift_type.name[this.locale];
      if (this.announcement.excavator_type)
        return this.announcement.excavator_type.name[this.locale];
      if (this.announcement.communal_type)
        return this.announcement.communal_type.name[this.locale];
      return getName(this.announcement.bulldozer_type_id, [
        {name: this.$t('wheel_dozer'), key: 1},
        {name: this.$t('tracked_bulldozer'), key: 2},
      ]);
    },
    wheelFormula() {
      return getName(this.announcement.wheel_formula, [
        {name: '10x10', key: 1},
        {name: '10x6', key: 2},
        {name: '4x2', key: 3},
        {name: '4x4', key: 4},
        {name: '6x2', key: 5},
        {name: '6x4', key: 6},
        {name: '6x6', key: 7},
        {name: '8x2', key: 8},
        {name: '8x4', key: 9},
        {name: '8x8', key: 10},
      ]);
    },
    exhaustClass() {
      return getName(this.announcement.exhaust_class, [
        { name: '0', key: 1 },
        { name: '1', key: 2 },
        { name: '2', key: 3 },
        { name: '3', key: 4 },
        { name: '4', key: 5 },
        { name: '5', key: 6 },
        { name: this.$t('green_sert'), key: 7 },
      ]);
    },
    cabinSuspension() {
      return getName(this.announcement.cab_suspension_id, [
        { name: this.$t('mechanical'), key: 1 },
        { name: this.$t('pnevma'), key: 2 },
      ]);
    },
    chassisSuspension() {
      return getName(this.announcement.chassis_suspension_id, [
        { name: this.$t('resora_resora'), key: 1 },
        { name: this.$t('resora_pnevmo'), key: 2 },
        { name: this.$t('pnevmo_pnevmo'), key: 4 },
      ]);
    },
    brakeType() {
      return getName(this.announcement.brake_type_id, [
        {name: this.$t('tympanic'), key: 1},
        {name: this.$t('circular'), key: 2},
      ]);
    },
    capacity() {
      return (this.catalog || this.announcement).capacity;
    },
    power() {
      return (this.catalog || this.announcement).power;
    },
    engineSpecs() {
      const specs = [];
      if (this.capacity && this.capacity != 0) specs.push(`${this.capacity} ${this.catalog ? this.$t('char_litre') : this.$t('char_sm_cube')}`);
      if (this.power && this.power != 0) specs.push(`${this.power} ${this.$t('char_h_power')}`);
      if (this.engine) specs.push(`${this.engine}`);
      return specs.join(' / ');
    },
    loadingKg() {
      return this.announcement.weight && `${this.announcement.weight} ${this.$t('char_kilogramm')}`;
    },
    mileage() {
      return `${this.announcement.humanize_mileage} ${this.$t('char_kilometre')}`;
    },
    numberOfAxes() {
      return this.announcement.number_of_axles && `${this.announcement.number_of_axles} ${this.$t('axles')}`;
    }
  }
}