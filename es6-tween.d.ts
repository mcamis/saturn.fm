declare module "es6-tween" {
  type Coordinates = {
    x: number;
    y: number;
    z: number;
  };
  export class Tween {
    constructor(_: any);
    to(coords: Coordinates, duration: number): any;
    easing(_: any): void;
    easing(): void;
  }
  export const Easing: any;
}
