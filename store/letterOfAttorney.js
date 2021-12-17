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
    hasDriverLicense: false,
    isOwnVehicle: false,
    senderFullName: '',
    senderFatherName: '',
    senderImage: '',
    recepientFullName: '',
    recepientFatherName: '',
    recepientImage: '',
    runningText: '',
    questions: []
  }
});

export const state = () => getInitialState();

export const getters = {
  currentStep: s => s.step,
  currentRealStep: (s, g) => {
    let steps = [1,2,4,5,8,10];
    // check if 6th, 7th and 9th steps are required
    if (g.hasGeneralPower) steps.splice(4,1,6,7,8,9);
    // check if 3rd step is required
    if (g.stepReceivedData.hasDriverLicense) steps.splice(2,0,3);
    return steps[s.step - 1];
  },
  maxSteps: (s, g) => {
    return (g.hasGeneralPower ? 10 : 7) - (g.stepReceivedData.hasDriverLicense ? 0 : 1);
  },
  stepSendData: s => s.stepSendData,
  stepReceivedData: s => s.stepReceivedData,
  hasGeneralPower: s => s.stepSendData.letterType === 2
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
      garageId: stepSendData.garageId,
      letterType: stepSendData.letterType
    });
    dispatch('updateReceivedData', [
      { key: 'isOwnVehicle', value: res.data.isOwnVehicle },
      { key: 'hasDriverLicense', value: res.data.haveDriverLicense },
      { key: 'questions', value: res.data.questions || [] },
      { key: 'runningText', value: res.data.runningText || '' }
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
      vehicleIdNumber: stepSendData.vehicleIdNumber,
      vehicleIdGivenDate: stepSendData.vehicleIdGivenDate
    });
    return res.data.have_access;
  },
  async payForSubmission({ dispatch, state: { stepSendData, stepReceivedData } }, data) {
    let formData = new FormData();
    
    Object.entries({
      pay_type: data.pay_type,
      card_id: data.card_id,
      garage_id: stepSendData.garageId,
      idFinCode: stepSendData.idFinCode,
      idSerialNumber: stepSendData.idSerialNumber,
      driverLicenseNumber: stepSendData.driverLicenseNumber,
      idFinCodeB: stepSendData.idFinCodeB,
      idSerialNumberB: stepSendData.idSerialNumberB,
      driverLicenseNumberB: stepSendData.driverLicenseNumberB,
      videoFile: stepSendData.videoFile,
      letterExpiryDate: stepSendData.letterExpiryDate,
      letterPermissionsTransfer: stepSendData.letterPermissionsTransfer,
      letterType: stepSendData.letterType,
      isOwnVehicle: stepReceivedData.isOwnVehicle,
      right_manage: stepSendData.letterPermissions.includes(1),
      right_gift: stepSendData.letterPermissions.includes(2),
      right_mortgage: stepSendData.letterPermissions.includes(3),
      right_transfer_trust: stepSendData.letterPermissions.includes(4),
      right_register: stepSendData.letterPermissions.includes(5),
      right_unregister: stepSendData.letterPermissions.includes(6),
      right_on_my_behalf: stepSendData.letterPermissions.includes(7),
      answers: JSON.stringify([
        { answer: stepSendData.region, questionId: stepSendData.questions[0].id },
        { answer: stepSendData.senderPhone, questionId: stepSendData.questions[1].id },
        { answer: stepSendData.recepientPhone, questionId: stepSendData.questions[2].id }
      ])
    }).map(([key, value]) => { formData.append(key, value)});
    
    const res = await this.$axios.$post(`/attorney/pay?is_mobile=${data.is_mobile}`, formData);
    return res;
  },
}

export const mutations = {
  mutate: mutate(),
  reset: reset(getInitialState())
}