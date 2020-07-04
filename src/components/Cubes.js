import React from "react";
import PropTypes from "prop-types";
import {
  Color,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
} from "three";
import autobind from "utilities/autobind";
import GLTFLoader from "three-gltf-loader";

import { sceneWidth } from "utilities/helpers";
import {
  activeRotation,
  idleRotation,
  updateScaleAndColor,
} from "utilities/cubeTransforms";

class Cubes extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedResize = null;
    this.loader = new GLTFLoader();
    this.animateDownL = true;
    this.animateUpL = false;
    this.animateDownR = true;
    this.animateUpR = false;

    autobind(this);
    window.addEventListener("resize", () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = setTimeout(this.onResize, 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });
  }

  componentDidMount() {
    this.setupScene();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.hidden !== nextProps.hidden) {
      return true;
    }
    return false;
  }

  onResize() {
    const width = sceneWidth();
    const height = width * 0.75;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const width = sceneWidth();
    const height = width * 0.75;

    const scene = new Scene();
    const camera = new PerspectiveCamera(20, width / height, 1, 1200);
    camera.position.z = 45;
    camera.position.y = -27;

    const ambient = new AmbientLight(0xffffff, 0.35);
    const directional = new DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 500, 900);
    scene.add(ambient, directional);

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });

    // Safari doesn't support image-rendering: pixelated for WebGL yet
    // https://bugs.webkit.org/show_bug.cgi?id=193895
    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(pixRatio === 1 ? pixRatio * 0.5 : pixRatio * 0.15);
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.setupCube("leftCube", [-6.75, -29.3, 0]);
    this.setupCube("rightCube", [6.75, -29.7, 0]);

    this.mount.appendChild(this.renderer.domElement);
  }

  setupCube(slot, [x, y, z]) {
    this.loader.load(
      "./models/cubeBigger.gltf",
      ({
        scene: {
          children: [, , cubeModel],
        },
      }) => {
        // eslint-disable no-param-reassign
        cubeModel.material.color = new Color("hsl(143, 100%, 48%)");
        cubeModel.material.dithering = true;
        cubeModel.material.flatShading = false;
        cubeModel.position.set(x, y, z);
        cubeModel.rotateX(0.075);
        if (slot === "rightCube") {
          cubeModel.rotateY(0.075);
        } else {
          cubeModel.rotateY(-0.1);
        }

        this[slot] = cubeModel;
        this.scene.add(cubeModel);
        if (slot === "rightCube") this.props.setAnimationCallback(this.animate);
      }
    );
  }

  animate() {
    // Only animated the cubes when audio is playing
    if (this.props.playing) {
      const [leftChannel, rightChannel] = this.props.audioManager.analyserFFT;

      // Reset to middle after idle
      this.leftCube.position.y = -29;
      this.rightCube.position.y = -29;

      updateScaleAndColor(this.leftCube, leftChannel);
      updateScaleAndColor(this.rightCube, rightChannel);
      activeRotation(this.leftCube);
      activeRotation(this.rightCube, -1);
    } else {
      const { y: leftY } = this.leftCube.position;
      if (leftY >= -28.25 && !this.animateDownL) {
        this.animateDownL = true;
        this.animateUpL = false;
      }
      if (leftY <= -30.25 && !this.animateUpL) {
        this.animateUpL = true;
        this.animateDownL = false;
      }
      const { y: rightY } = this.rightCube.position;
      if (rightY >= -28.25 && !this.animateDownR) {
        this.animateDownR = true;
        this.animateUpR = false;
      }
      if (rightY <= -30.25 && !this.animateUpR) {
        this.animateUpR = true;
        this.animateDownR = false;
      }

      // TODO: Idle color
      idleRotation(this.leftCube, 0.35, this.animateDownL, this.animateUpL);
      idleRotation(this.rightCube, 0.35, this.animateDownR, this.animateUpR);
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        className="cubes"
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

Cubes.propTypes = {
  setAnimationCallback: PropTypes.func.isRequired,
  audioManager: PropTypes.shape({}).isRequired,
  playing: PropTypes.bool.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export default Cubes;
