export function isPhoneNumber(value) {
  return value.match(/^[+]994[ ][(][0-9]{2}[)][ ][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/) !== null;
}