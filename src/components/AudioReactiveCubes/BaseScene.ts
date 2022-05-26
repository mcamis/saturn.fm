import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { sceneWidth } from "../../utilities/helpers";

type Options = {
  pixelRatio?: number;
  animationCallback?: () => void;
  // sceneSetupFn: () => PerspectiveCamera;
};

// Unused draft of a basic three.js scene to extend for other components
class BaseScene {
  private camera: PerspectiveCamera;
  private debouncedResize: number;
  private height: number;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private width: number;
  private options: Options;

  public domElement;

  constructor(options: Options) {
    this.options = {
      pixelRatio: 0.75,
      ...options,
    };
    this.setDimensions();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false });
    this.domElement = this.renderer.domElement;
    this.renderer.setPixelRatio(this.options.pixelRatio);
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
    window.requestAnimationFrame(this.animate.bind(this));
  }

  setDimensions() {
    const width = sceneWidth();
    const height = window.innerHeight;

    this.width = width;
    this.height = height;

    return [width, height];
  }

  onResize() {
    this.setDimensions();
    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera?.updateProjectionMatrix();
    }
    this.renderer.setSize(this.width, this.height);
  }

  setupScene() {
    // this.camera = this.options.sceneSetupFn();
  }

  animate() {
    this.options?.animationCallback?.();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

export default BaseScene;
