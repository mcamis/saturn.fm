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
  Clock,
} from "three";

import {
  sceneWidth,
  throttle,
  TextureAnimator
} from "../../utilities/helpers";
import * as TWEEN from "es6-tween";

import {
  orbitGeometry,
  purpleMesh,
  pinkMesh,
  menuElementsMetadata,
  MenuButton,
  menuButtons,
  shadowTexture,
  shadowGeometry
} from "../../utilities/menuElements";
export const planeGeometry = new PlaneGeometry(2, 2, 1, 1);
import globeSprite from "../../images/globeSprite.png";


// TODO: Set more magic numbers to constants
const SHADOW_OFFSET = 1.025;


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
  private buttonMeshes: any;
  private activeButton: string;
  private syncActiveItem: any;
  private textureAnimator: TextureAnimator;
  private clock: Clock;
  

  public domElement;

  constructor(setActiveButton: any) {
    this.setDimensions();
    const onMouseMoveThrottled = throttle(this.onMouseMove.bind(this), 100);
    this.buttonMeshes = [];
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false });
    this.domElement = this.renderer.domElement;
    this.renderer.setSize(this.width, this.height);
    this.syncActiveItem = setActiveButton;
    this.debouncedResize = null;
    this.clock = new Clock();


    window.addEventListener("resize", () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = window.setTimeout(this.onResize.bind(this), 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });
    this.domElement.addEventListener(
      "mousemove",
      (e) => onMouseMoveThrottled(e),
      false
    );

    this.setupScene();
    this.start();
  }


  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    // TODO/WTF: Why is * 1.5 necessary!?
    this.mouse.x = ((e.clientX - rect.left * 1.5) / (rect.width - rect.left)) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    this.manageActiveButton();
  }

  manageActiveButton() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.buttonMeshes);
    if (intersects.length > 0) {
      const {
        object: {
          material: { name },
        },
      } = intersects[0];
      if (name && name !== this.activeButton) {
        // this.setState({ activeButton: name });
        this.syncActiveItem(name)
      }
      document.body.classList.add("pointer");
    } else {
      document.body.classList.remove("pointer");
    }
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
    menuElementsMetadata.forEach(button => this.addButton(button))
    this.setupSpinningGlobeButton();
  }

  setupSpinningGlobeButton() {
    const [x, y, z] = [2.25, -4.3, 1];

    const globeTexture = new TextureLoader().load(globeSprite.src);
    globeTexture.magFilter = NearestFilter;
    globeTexture.minFilter = NearestFilter;

    this.textureAnimator = new TextureAnimator(globeTexture);

    const globeMaterial = new MeshBasicMaterial({
      map: globeTexture,
      transparent: true,
      name: "advanced",
      userData: {
        animationDelay: 900,
        animationDuration: 300,
        showShadow: true,
        onClick: () => {}
      },
    });

    const spinningGlobe = new Mesh(planeGeometry, globeMaterial);
    spinningGlobe.position.set(x, y, z);
    spinningGlobe.name = "advanced";

    shadowTexture.magFilter = NearestFilter;
    shadowTexture.minFilter = NearestFilter;

    const shadowMaterial = new MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.5,
      userData: {
        animationDelay: 900,
        animationDuration: 300,
      },
    });

    const shadowPlane = new Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.position.set(x, y - SHADOW_OFFSET, z - 0.5);
    // shadowPlane.visible = window.innerWidth >= 400;
    this.scene.add(shadowPlane);

    this.buttonMeshes.push(spinningGlobe);
    this.scene.add(spinningGlobe);
  }

  addButton(button: MenuButton) {
    const [x, y, z] = button.position;

    const planeTexture = new TextureLoader().load(button.mapSrc);
    planeTexture.magFilter = NearestFilter;
    planeTexture.minFilter = NearestFilter;

    const planeMaterial = new MeshBasicMaterial({
      map: planeTexture,
      transparent: true,
      name: button.name,
      userData: {
        onClick: button.onClick,
        animationDelay: button.animationDelay,
        animationDuration: button.animationDuration,
      },
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.position.set(x, y, z);
    this.scene.add(plane);
    this.buttonMeshes.push(plane);
  }

  updateCurrentButton(button:string) {
    if(!button) return;
    const { position } = menuButtons[button] ?? {};
    if(!position) return;
    const [x, y] = position;
    this.orbits.pink.position.set(x, y, 2);
    this.orbits.purple.position.set(x, y, 2.03);
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
    const delta = this.clock.getDelta();

    this.animateOrbits();
    this.renderer.render(this.scene, this.camera);
    this.textureAnimator.update(1000 * delta);

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
