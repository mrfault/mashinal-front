import Vue from 'vue';
import { mutate, reset } from '~/lib/vuex-helpers/mutations';

const getInitialState = () => ({
  step: 1,
  stepSendData: {
    garageId: '',
    carNumber: '',
    letterType: 1,
    idFinCode: '',
    idSerialNumber: '',
    idExpiryDate: '',
    birthDate: '',
    gender: 1,
    driverLicenseNumber: '',
    driverLicenseGivenDate: '',
    driverLicenseExpiryDate: '',
    vehicleIdNumber: '',
    vehicleIdGivenDate: '',
    idFinCodeB: '',
    idSerialNumberB: '',
    driverLicenseNumberB: '',
    mobileNotariatConfirm: false,
    letterPermissions: [],
    letterExpiryDate: '',
    region: '',
    senderPhone: '',
    recepientPhone: '',
    letterPermissionsTransfer: false,
    letterConfirmData: false,
    videoFile: ''
  },
  stepReceivedData: {
    showStepsSummary: true,
    hasDriverLicense: false,
    isOwnVehicle: false,
    senderFullName: '',
    senderFatherName: '',
    senderImage: '',
    recepientFullName: '',
    recepientFatherName: '',
    recepientImage: '',
    runningText: '',
    attorneyId: '',
    questions: []
  }
});

export const state = () => getInitialState();

export const getters = {
  currentStep: s => s.step,
  currentRealStep: (s, g) => {
    return 10;
    let steps = [1,2,4,5,8,9,10];
    // check if 6th and 7th steps are required
    if (g.hasGeneralPower) steps.splice(4,0,6,7);
    // check if 3rd step is required
    if (g.stepReceivedData.hasDriverLicense) steps.splice(2,0,3);
    return steps[s.step - 1];
  },
  maxSteps: (s, g) => {
    return (g.hasGeneralPower ? 10 : 8) - (g.stepReceivedData.hasDriverLicense ? 0 : 1);
  },
  stepSendData: s => s.stepSendData,
  stepReceivedData: s => s.stepReceivedData,
  hasGeneralPower: s => s.stepSendData.letterType === 2,
  hasAnyPower: s => s.stepReceivedData.showStepsSummary
}

export const actions = {
  updateStep({ commit }, step) {
    commit('mutate', { property: 'step', value: step });
  },
  increaseStep({ commit, state: { step } }) {
    commit('mutate', { property: 'step', value: step + 1 });
  },
  updateSendData({ commit }, dataRows) {
    if (!(dataRows instanceof Array)) dataRows = [dataRows];
    dataRows.map(row => {
      commit('mutate', { property: 'stepSendData', value: row.value, key: row.key });
    });
  },
  updateReceivedData({ commit }, dataRows) {
    if (!(dataRows instanceof Array)) dataRows = [dataRows];
    dataRows.map(row => {
      commit('mutate', { property: 'stepReceivedData', value: row.value, key: row.key });
    });
  },
  resetSteps({ commit }) {
    commit('reset', ['maxSteps','step','stepSendData','stepReceivedData']);
  },
  // API
  async checkOwnInfo({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/get_user_info`, {
      idFinCode: stepSendData.idFinCode,
      idSerialNumber: stepSendData.idSerialNumber
    });
    dispatch('updateReceivedData', [
      { key: 'senderFullName', value: res.name ? `${res.name} ${res.surname}` : '' },
      { key: 'senderFatherName', value: res.middleName || '' },
      { key: 'senderImage', value: res.image ? `data:image/png;base64, ${res.image}` : '' }
    ]);
    return !!res.name;
  },
  async checkOtherUserInfo({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/get_user_info`, {
      idFinCode: stepSendData.idFinCodeB,
      idSerialNumber: stepSendData.idSerialNumberB
    });
    dispatch('updateReceivedData', [
      { key: 'recepientFullName', value: res.name ? `${res.name} ${res.surname}` : '' },
      { key: 'recepientFatherName', value: res.middleName || '' },
      { key: 'recepientImage', value: res.image ? `data:image/png;base64, ${res.image}` : '' }
    ]);
    return !!res.name;
  },
  async checkUserAccess({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/check_user_access`, {
      idFinCode: stepSendData.idFinCode,
      idSerialNumber: stepSendData.idSerialNumber,
      car_number: stepSendData.carNumber.replace(/-|[ ]/g, ''),
      garageId: stepSendData.garageId,
      letterType: stepSendData.letterType
    });
    dispatch('updateReceivedData', [
      { key: 'showStepsSummary', value: res.data.have_access },
      { key: 'isOwnVehicle', value: res.data.isOwnVehicle },
      { key: 'hasDriverLicense', value: res.data.haveDriverLicense },
      { key: 'questions', value: res.data.questions || [] }
    ]);
    return res.data.have_access;
  },
  async checkPinCode({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/check_pin_code`, {
      idFinCode: stepSendData.idFinCode,
      idSerialNumber: stepSendData.idSerialNumber,
      idExpiryDate: stepSendData.idExpiryDate,
      gender: stepSendData.gender,
      birthDate: stepSendData.birthDate
    });
    return res.data.have_access;
  },
  async checkOwnDriverLicense({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/check_driver_license`, {
      idFinCode: stepSendData.idFinCode,
      driverLicenseNumber: stepSendData.driverLicenseNumber,
      driverLicenseGivenDate: stepSendData.driverLicenseGivenDate,
      driverLicenseExpiryDate: stepSendData.driverLicenseExpiryDate
    });
    return res.data.have_access;
  },
  async checkDriverLicense({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/check_only_driver_license`, {
      idFinCode: stepSendData.idFinCodeB,
      driverLicenseNumber: stepSendData.driverLicenseNumberB
    });
    dispatch('updateReceivedData', [
      { key: 'driverLicenseExpiryDateB', value: res.data.expiryDate || '' },
    ]);
    return res.data.have_access;
  },
  async checkVehicleLicense({ dispatch, state: { stepSendData } }) {
    const res = await this.$axios.$post(`/attorney/check_vehicle_license`, {
      garageId: stepSendData.garageId,
      car_number: stepSendData.carNumber.replace(/-|[ ]/g, ''),
      vehicleIdNumber: stepSendData.vehicleIdNumber,
      vehicleIdGivenDate: stepSendData.vehicleIdGivenDate
    });
    return res.data.have_access;
  },
  async checkAllData({ dispatch, state: { stepSendData, stepReceivedData } }, data) {
    let checkData = {
      garage_id: stepSendData.garageId,
      car_number: stepSendData.carNumber.replace(/-|[ ]/g, ''),
      idFinCode: stepSendData.idFinCode,
      idSerialNumber: stepSendData.idSerialNumber,
      driverLicenseNumber: stepSendData.driverLicenseNumber,
      idFinCodeB: stepSendData.idFinCodeB,
      idSerialNumberB: stepSendData.idSerialNumberB,
      driverLicenseNumberB: stepSendData.driverLicenseNumberB,
      letterExpiryDate: stepSendData.letterExpiryDate,
      letterPermissionsTransfer: stepSendData.letterPermissionsTransfer,
      letterType: stepSendData.letterType,
      isOwnVehicle: stepReceivedData.isOwnVehicle,
      answers: JSON.stringify([
        { answer: stepSendData.region, questionId: stepReceivedData.questions[0].id },
        { answer: stepSendData.senderPhone, questionId: stepReceivedData.questions[1].id },
        { answer: stepSendData.recepientPhone, questionId: stepReceivedData.questions[2].id }
      ])
    };

    stepSendData.letterType === 2 && [
      'right_manage', 'right_gift', 'right_mortgage', 'right_transfer_trust',
      'right_register', 'right_unregister', 'right_on_my_behalf'
    ].map((key, i) => { checkData[key] = stepSendData.letterPermissions.includes(i + 1) });

    const res = await this.$axios.$post(`/attorney/check_all_data`, checkData);

    dispatch('updateReceivedData', [
      { key: 'attorneyId', value: res.data.attorney_id || '' },
      { key: 'runningText', value: res.data.runningText || '' }
    ]);

    return res.data.have_access;
  },
  async payForSubmission({ dispatch, state: { stepSendData, stepReceivedData } }, data) {
    let formData = new FormData();

    Object.entries({
      pay_type: data.pay_type,
      card_id: data.card_id,
      videoFile: stepSendData.videoFile,
      attorney_id: stepReceivedData.attorneyId
    }).map(([key, value]) => { formData.append(key, value)});

    const res = await this.$axios.$post(`/attorney/pay?is_mobile=${data.is_mobile}`, formData);
    return res;
  },
}

export const mutations = {
  mutate: mutate(),
  reset: reset(getInitialState())
}
