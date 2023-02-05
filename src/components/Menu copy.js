// Todo: Import specific tween functions as needed
import * as TWEEN from "es6-tween";
import {
  Clock,
  Scene,
  Vector2,
  Raycaster,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  NearestFilter,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import * as React from "react";
import PropTypes from "prop-types";
import styles from "./Menu.module.scss";
import {
  audioManagerSingleton,
  AudioStatus,
  RepeatValues,
} from "../audioManager";

import {
  throttle,
  sceneWidth,
  triggerButtonCallback,
  TextureAnimator,
  getLocalizedCopy,
} from "../utilities/helpers";

import {
  animateButtonPosition,
  createButtons,
  orbitGeometry,
  purpleMesh,
  pinkMesh,
  planeGeometry,
  shadowGeometry,
  shadowTexture,
} from "../utilities/menuElements";

import globeSprite from "../images/globeSprite.png";

import buttonSrc from "../effects/button-press.mp3";
import highlightSrc from "../effects/button-highlight.mp3";
import hideSrc from "../effects/hide.mp3";
import showSrc from "../effects/show.mp3";

import autobind from "../utilities/autobind";

// TODO: Set more magic numbers to constants
const SHADOW_OFFSET = 1.025;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.timeOut = null;
    this.planes = [];
    this.shadowPlanes = [];

    this.buttonEffect = new Audio();
    this.buttonEffect.src = buttonSrc;
    this.highlightEffect = new Audio();
    console.log("test", highlightSrc);
    this.highlightEffect.src = highlightSrc;

    this.hideEffect = new Audio();
    this.hideEffect.src = hideSrc;
    this.showEffect = new Audio();
    this.showEffect.src = showSrc;
    this.state = {
      activeButton: "play",
      allowToggle: false,
      introActive: true,
    };

    this.clock = new Clock();

    this.buttons = [
      "disc",
      "settings",
      "hide",
      "rewind",
      "play",
      "fastforward",
      "repeat",
      "stop",
      "advanced",
    ];

    this.onMouseMoveThrottled = throttle(this.onMouseMove.bind(this), 100);
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();

    this.setupKeyboardListeners();
    setTimeout(() => this.setState({ introActive: false }), 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeButton !== prevState.activeButton) {
      const [x, y] = this.menuElements[this.state.activeButton].position;
      this.orbits.pink.position.set(x, y, 2);
      this.orbits.purple.position.set(x, y, 2.03);
      this.playHighlight();
    }
  }

  onResize() {
    const width = sceneWidth();
    const height = width * 0.75;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseDown(e) {
    e.stopPropagation();
    if (this.props.isUiHidden) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const {
        object: {
          material: {
            userData: { onClick },
          },
        },
      } = intersects[0];

      const { object } = intersects[0];

      if (audioManagerSingleton.analyser.audioContext.state === "running") {
        this.handleMouseDown(object, onClick);
      } else {
        audioManagerSingleton.analyser.audioContext
          .resume()
          .then(() => {
            this.handleMouseDown(object, onClick);
          })
          .catch((e) => console.log(e));
      }
    }
  }

  handleMouseDown(object, onClick) {
    if (object.name !== "hide") {
      this.buttonEffect.currentTime = 0;
      this.buttonEffect.play();
    }

    triggerButtonCallback(object, onClick);
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    // TODO/WTF: Why is * 1.5 necessary!?
    this.mouse.x =
      ((e.clientX - rect.left * 1.5) / (rect.width - rect.left)) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    this.manageActiveButton();
  }

  setupKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      let nextIndex = this.buttons.indexOf(this.state.activeButton);
      switch (e.code) {
        case "ArrowRight":
          if (nextIndex !== 2 && nextIndex !== 5) {
            nextIndex += 1;
          }
          break;
        case "ArrowLeft":
          if (nextIndex !== 3 && nextIndex !== 6) {
            nextIndex -= 1;
          }
          break;

        case "ArrowUp":
          nextIndex -= 3;
          break;
        case "ArrowDown":
          nextIndex += 3;
          break;
        case "Enter": {
          const nextName = this.buttons[nextIndex];
          const nextObject = this.planes.find(
            (plane) => plane.name === nextName
          );
          if (audioManagerSingleton.analyser.audioContext.state === "running") {
            this.buttonEffect.currentTime = 0;
            this.buttonEffect.play();
            triggerButtonCallback(
              nextObject,
              this.menuElements[nextName].onClick
            );
          } else {
            audioManagerSingleton.analyser.audioContext
              .resume()
              .then(() => {
                this.buttonEffect.currentTime = 0;
                this.buttonEffect.play();
                triggerButtonCallback(
                  nextObject,
                  this.menuElements[nextName].onClick
                );
              })
              .catch((err) => console.log(err));
          }

          break;
        }
        default:
          nextIndex = -1;
      }

      if (nextIndex >= 0 && nextIndex < this.buttons.length) {
        this.setState({ activeButton: this.buttons[nextIndex] });
      }
    });
  }

  setupScene() {
    const width = sceneWidth();
    const height = width * 0.75;
    const scene = new Scene();

    const camera = new PerspectiveCamera(2.5, width / height, 1, 500);
    camera.aspect = width / height;

    camera.position.z = 360;
    camera.position.y = 0.5;
    camera.updateProjectionMatrix();

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);

    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
    this.scene = scene;
    this.camera = camera;

    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);

    this.createMenuElements();
    this.setupOrbAnimation();
    this.setupEventListeners();

    this.animate();
  }

  setupEventListeners() {
    const {
      renderer: { domElement },
    } = this;

    window.addEventListener("resize", () => {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(this.onResize, 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });

    domElement.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
    domElement.addEventListener(
      "mousemove",
      (e) => this.onMouseMoveThrottled(e),
      false
    );
  }

  setupOrbAnimation() {
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
        onClick: this.props.toggleAbout,
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
    this.shadowPlanes.push(shadowPlane);
    this.scene.add(shadowPlane);

    this.planes.push(spinningGlobe);
    this.scene.add(spinningGlobe);
  }

  getToolTip(repeat, audioStatus) {
    const { menu } = getLocalizedCopy();
    const isPlaying = audioStatus === AudioStatus.Playing;
    const isPaused = audioStatus === AudioStatus.Paused;

    const tooltips = {
      disc: () => <p>{menu.disc}</p>,
      settings: () => <p>{menu.settings}</p>,
      hide: () => <p>{menu.hide}</p>,
      rewind: () => <p>{menu.skipBackwards}</p>,
      fastforward: () => <p>{menu.skipForwards}</p>,
      play: () => {
        let playElement = (
          <p>
            {menu.play} / {menu.pause}
          </p>
        );
        if (isPlaying) {
          playElement = (
            <p>
              <strong>{menu.play}</strong> / {menu.pause}
            </p>
          );
        } else if (isPaused) {
          playElement = (
            <p>
              {menu.play} / <strong>{menu.pause}</strong>
            </p>
          );
        }
        return playElement;
      },
      repeat: () => {
        let repeatElement = (
          <p>
            {menu.repeat}: {menu.repeatOne} / {menu.repeatAll} /{" "}
            <strong>{menu.repeatOff}</strong>
          </p>
        );
        if (repeat === RepeatValues.Single) {
          repeatElement = (
            <p>
              {menu.repeat}: <strong>{menu.repeatOne}</strong> /{" "}
              {menu.repeatAll} / {menu.repeatOff}
            </p>
          );
        } else if (repeat === RepeatValues.All) {
          repeatElement = (
            <p>
              {menu.repeat}: {menu.repeatOne} /{" "}
              <strong>{menu.repeatAll}</strong> / {menu.repeatOff}
            </p>
          );
        }
        return repeatElement;
      },
      stop: () => <p>{menu.stop}</p>,
      advanced: () => <p>{menu.advanced}</p>,
    };

    return tooltips[this.state.activeButton]();
  }

  orbitButton() {
    const { pink, purple } = this.orbits;

    if (this.props.isUiHidden) {
      pink.material.visible = false;
      purple.material.visible = false;
    } else {
      pink.material.visible = true;
      purple.material.visible = true;
      pink.rotateY(-0.065);
      purple.rotateY(0.07);
    }
  }

  manageActiveButton() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const {
        object: {
          material: { name },
        },
      } = intersects[0];
      if (name && name !== this.state.activeButton) {
        this.setState({ activeButton: name });
      }
      document.body.classList.add("pointer");
    } else {
      document.body.classList.remove("pointer");
    }
  }

  hideMenu() {
    if (this.props.isUiHidden) {
      return this.showIfHidden();
    }

    // TODO: Switch this to the real sound effect
    this.hideEffect.currentTime = 0;
    this.hideEffect.play();
    setTimeout(() => {
      this.planes.forEach((plane) => {
        const { x, y, z } = plane.position;
        animateButtonPosition(plane, new Vector3(x, y - 10, z));
      });

      this.shadowPlanes.forEach((shadow) => {
        // eslint-disable-next-line no-param-reassign
        shadow.visible = false;
      });
      this.props.hideDash();
    }, 450);

    return setTimeout(() => this.setState({ allowToggle: true }), 1400);
  }

  animate() {
    TWEEN.update();
    this.orbitButton();

    const delta = this.clock.getDelta();

    this.renderer.render(this.scene, this.camera);
    this.textureAnimator.update(1000 * delta);
    window.requestAnimationFrame(this.animate);
  }

  showIfHidden() {
    if (this.state.allowToggle && this.props.isUiHidden) {
      this.props.showIfHidden();
      this.setState({ allowToggle: false });
      this.showEffect.currentTime = 0;
      this.showEffect.play();

      this.planes.forEach((plane) => {
        const { x, y, z } = plane.position;
        animateButtonPosition(plane, new Vector3(x, y + 10, z));
      });
      setTimeout(() => {
        this.shadowPlanes.forEach((shadow) => {
          // eslint-disable-next-line no-param-reassign
          shadow.visible = true;
        });
      }, 1000);
    }
  }

  placeInScene({
    name = "",
    position,
    onClick,
    mapSrc,
    animationDelay,
    animationDuration,
    showShadow,
  }) {
    const [x, y, z] = position;

    const planeTexture = new TextureLoader().load(mapSrc);
    planeTexture.magFilter = NearestFilter;
    planeTexture.minFilter = NearestFilter;

    const planeMaterial = new MeshBasicMaterial({
      map: planeTexture,
      transparent: true,
      name,
      userData: {
        onClick,
        animationDelay,
        animationDuration,
      },
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.position.set(x, y, z);
    plane.name = name;
    if (showShadow) {
      shadowTexture.magFilter = NearestFilter;
      shadowTexture.minFilter = NearestFilter;

      const shadowMaterial = new MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.5,
        name,
        userData: {
          animationDelay,
          animationDuration,
        },
      });
      const shadowPlane = new Mesh(shadowGeometry, shadowMaterial);
      shadowPlane.position.set(x, y - SHADOW_OFFSET, z - 0.5);
      // shadowPlane.visible = window.innerWidth >= 400;
      this.shadowPlanes.push(shadowPlane);
      this.scene.add(shadowPlane);
    }
    // plane.rotateZ(0.75);
    this.planes.push(plane);
    this.scene.add(plane);
  }

  placeOrbitsInScene() {
    const [x, y] = [0, -2.15];
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

  createMenuElements() {
    const menuElements = createButtons(
      audioManagerSingleton,
      this.hideMenu,
      this.props.toggleMenu
    );
    menuElements.forEach((button) => this.placeInScene(button));
    this.menuElements = menuElements.reduce(
      (obj, { name, position, onClick }) => ({
        [name]: {
          onClick,
          position,
        },
        ...obj,
      }),
      {}
    );
    this.menuElements.advanced = {
      onClick: this.props.toggleAbout,
      position: [2.25, -4.3, 1],
    };

    this.placeOrbitsInScene();
  }

  playHighlight() {
    // Only autoplay highlight on desktop to prevent multiple sounds at once
    if (typeof window.orientation === "undefined" && !this.state.introActive) {
      if (audioManagerSingleton.analyser.audioContext.state === "running") {
        this.highlightEffect.currentTime = 0;
        this.highlightEffect.play();
      }
    }
  }

  render() {
    return (
      <div
        onClick={this.showIfHidden}
        className={styles.wrapper}
        ref={(mount) => {
          this.mount = mount;
        }}
      >
        {!this.props.isUiHidden && (
          <div key={this.state.activeButton} className={styles.tooltip}>
            {this.getToolTip(this.props.repeat, this.props.audioStatus)}
          </div>
        )}
      </div>
    );
  }
}

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  hideDash: PropTypes.func.isRequired,
  isUiHidden: PropTypes.bool.isRequired,
  showIfHidden: PropTypes.func.isRequired,
};

export default Menu;
