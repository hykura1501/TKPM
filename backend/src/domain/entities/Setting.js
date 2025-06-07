// Domain Entity - Setting
class Setting {
  constructor({ allowDomains, allowPhones }) {
    this.allowDomains = allowDomains;
    this.allowPhones = allowPhones;
  }
}
module.exports = Setting;
