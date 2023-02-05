import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Raycaster,
  TextureLoader,
  NearestFilter,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
} from "three";
import discSrc from "../../images/disc.png";

import {
  sceneWidth,
} from "../../utilities/helpers";
import * as TWEEN from "es6-tween";

import {
  orbitGeometry,
  purpleMesh,
  pinkMesh,
} from "../../utilities/menuElements";
export const planeGeometry = new PlaneGeometry(2, 2, 1, 1);


class MenuItemsScene {
  private camera: PerspectiveCamera;
  private debouncedResize: number;
  private height: number;
  private rafId: number;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private width: number;
  private orbits: any;
  private raycaster: any;
  private mouse: any;
  

  public domElement;

  constructor() {
    this.setDimensions();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false });
    this.domElement = this.renderer.domElement;
    this.renderer.setSize(this.width, this.height);

    this.debouncedResize = null;

    window.addEventListener("resize", () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = window.setTimeout(this.onResize.bind(this), 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });

    this.setupScene();
    this.start();
  }

  setDimensions() {
    const width = sceneWidth();
    const height = width * 0.75;

    this.width = width;
    this.height = height;
  }

  onResize() {
    this.setDimensions();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setupScene() {
    const camera = new PerspectiveCamera(
      2.5, this.width / this.height, 1, 500
    );
    camera.aspect = this.width / this.height;
    camera.position.z = 360;
    camera.position.y = 0.5;
    camera.updateProjectionMatrix();

    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
    this.camera = camera;
    // this.addMenuElements();
    this.placeOrbitsInScene();
    this.addButton();
  }


  // name: "disc",
  // position: 
  // onClick: () => {    },
  // animationDuration: 400,
  // animationDelay: 220,
  // mapSrc: discSrc.src,
  // showShadow: false,
  addButton() {
    const [x, y, z] = [-2.25, 0, 1];

    const planeTexture = new TextureLoader().load(discSrc.src);
    planeTexture.magFilter = NearestFilter;
    planeTexture.minFilter = NearestFilter;

    const planeMaterial = new MeshBasicMaterial({
      map: planeTexture,
      transparent: true,
      name: 'Test',
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.position.set(x, y, z);
    // plane.rotateZ(0.75);
    this.scene.add(plane);
  }

  placeOrbitsInScene() {
    const [x, y] = [-2.25, 0];
    const pink = new Mesh(orbitGeometry, pinkMesh);
    const purple = new Mesh(orbitGeometry, purpleMesh);

    // Push the orbits slight ahead in Z so they hit the plane at the eges of the sphere
    pink.position.set(x, y, 2);
    pink.rotateX(0.35);
    pink.rotateZ(-0.8);

    purple.position.set(x, y, 2.03);
    purple.rotateZ(0.8);
    purple.rotateX(0.25);
    purple.rotateY(1);

    this.orbits = {
      pink,
      purple,
    };
    this.scene.add(pink, purple);
  }

  start() {
    this.rafId = window.requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    window.cancelAnimationFrame(this.rafId);
  }

  animate() {
    this.animateOrbits();
    this.renderer.render(this.scene, this.camera);
    this.rafId = window.requestAnimationFrame(this.animate.bind(this));
  }

  animateOrbits() {
    const { pink, purple } = this.orbits;
    pink.material.visible = true;
    purple.material.visible = true;
    pink.rotateY(-0.065);
    purple.rotateY(0.07);

  }
}

export default MenuItemsScene;
