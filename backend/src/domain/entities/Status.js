// Domain Entity - Status
class Status {
  constructor({ id, name, color, allowedStatus }) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.allowedStatus = allowedStatus;
  }
}
module.exports = Status;
