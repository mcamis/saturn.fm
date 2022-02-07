export class TranceVibrator {
  constructor() {
    if (!navigator.usb) {
      alert("WebUSB unsupported on your browser");
      throw new Error("WebUSB unsupported on your browser");
    }
    this.balance = [0.75, 0.5];
  }

  async connect() {
    const trv = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x0b49, productId: 0x064f }],
    });
    if (trv.opened) {
      alert("The device is already in use.");
      throw new Error("The device is already in use.");
    }
    this.trv = trv;
    await this.trv.open();
    await this.trv.selectConfiguration(1);
    await this.trv.claimInterface(0);
    await this.send(0.5, 0.5);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance(value) {
    this.balance = value;
  }

  async send(value) {
    if (this.trv) {
      await this.trv.controlTransferOut({
        requestType: "vendor",
        recipient: "interface",
        request: 1,
        value,
        index: 0,
      });
    }
  }
}
