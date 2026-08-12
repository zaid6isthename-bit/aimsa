// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE
import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ASCIIText.css";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    float waveFactor = uEnableWaves;
    vec3 transformed = position;
    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

const mapRange = (n: number, start: number, stop: number, start2: number, stop2: number) =>
  ((n - start) / (stop - start)) * (stop2 - start2) + start2;

const PX_RATIO = typeof window !== "undefined" ? window.devicePixelRatio : 1;

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  deg = 0;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width = 0;
  height = 0;
  cols = 0;
  rows = 0;
  center = { x: 0, y: 0 };
  mouse = { x: 0, y: 0 };

  constructor(
    renderer: THREE.WebGLRenderer,
    opts: { fontSize?: number; fontFamily?: string; charset?: string; invert?: boolean } = {},
  ) {
    this.renderer = renderer;
    this.domElement = document.createElement("div");
    Object.assign(this.domElement.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    });

    this.pre = document.createElement("pre");
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.domElement.appendChild(this.canvas);

    this.invert = opts.invert ?? true;
    this.fontSize = opts.fontSize ?? 12;
    this.fontFamily = opts.fontFamily ?? "'Courier New', monospace";
    this.charset =
      opts.charset ?? " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.context.imageSmoothingEnabled = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText("A").width;
    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    Object.assign(this.pre.style, {
      fontFamily: this.fontFamily,
      fontSize: `${this.fontSize}px`,
      margin: "0",
      padding: "0",
      lineHeight: "1em",
      position: "absolute",
      left: "0",
      top: "0",
      zIndex: "9",
      backgroundAttachment: "fixed",
      mixBlendMode: "difference",
    });
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (w && h) this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!w || !h) return;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = "";
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x * 4 + y * 4 * w;
        const r = imgData[i]!;
        const g = imgData[i + 1]!;
        const b = imgData[i + 2]!;
        const a = imgData[i + 3]!;
        if (a === 0) {
          str += " ";
          continue;
        }
        const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += "\n";
    }
    this.pre.textContent = str;
  }

  dispose() {
    document.removeEventListener("mousemove", this.onMouseMove);
  }
}

class CanvasTxt {
  canvas = document.createElement("canvas");
  context: CanvasRenderingContext2D;
  font: string;

  constructor(
    public txt: string,
    { fontSize = 200, fontFamily = "Arial", color = "#fdf9f3" } = {},
  ) {
    this.context = this.canvas.getContext("2d")!;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${fontSize}px ${fontFamily}`;
  }

  fontSize: number;
  fontFamily: string;
  color: string;

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.canvas.width = Math.ceil(metrics.width) + 20;
    this.canvas.height =
      Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.context.fillText(this.txt, 10, 10 + metrics.actualBoundingBoxAscent);
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get texture() {
    return this.canvas;
  }
}

interface AsciiOptions {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
}

class CanvAscii {
  camera: THREE.PerspectiveCamera;
  scene = new THREE.Scene();
  mouse: { x: number; y: number };
  center = { x: 0, y: 0 };
  textCanvas!: CanvasTxt;
  texture!: THREE.CanvasTexture;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  renderer!: THREE.WebGLRenderer;
  filter!: AsciiFilter;
  animationFrameId = 0;

  constructor(
    private opts: AsciiOptions,
    private container: HTMLElement,
    private width: number,
    private height: number,
  ) {
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.mouse = { x: width / 2, y: height / 2 };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load('600 200px "IBM Plex Mono"');
      await document.fonts.load('500 12px "IBM Plex Mono"');
      await document.fonts.ready;
    } catch {
      /* fallback font */
    }
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.opts.text, {
      fontSize: this.opts.textFontSize,
      fontFamily: "IBM Plex Mono",
      color: this.opts.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const aspect = this.textCanvas.width / this.textCanvas.height;
    const baseH = this.opts.planeBaseHeight;

    this.geometry = new THREE.PlaneGeometry(baseH * aspect, baseH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.opts.enableWaves ? 1.0 : 0.0 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: "IBM Plex Mono",
      fontSize: this.opts.asciiFontSize,
      invert: true,
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("touchmove", this.onMouseMove);
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    const e = "touches" in evt ? evt.touches[0] : evt;
    if (!e) return;
    const bounds = this.container.getBoundingClientRect();
    this.mouse = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }

  render() {
    const time = new Date().getTime() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.material.uniforms["uTime"]!.value = Math.sin(time);
    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = mapRange(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = mapRange(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode) this.container.removeChild(this.filter.domElement);
    }
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("touchmove", this.onMouseMove);
    this.geometry?.dispose();
    this.material?.dispose();
    this.texture?.dispose();
    this.scene.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

export interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  className?: string;
}

export default function ASCIIText({
  text = "Hello World!",
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = "#fdf9f3",
  planeBaseHeight = 8,
  enableWaves = true,
  className = "",
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<CanvAscii | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;

    const setup = async () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const instance = new CanvAscii(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        container,
        width,
        height,
      );
      await instance.init();
      if (cancelled) {
        instance.dispose();
        return;
      }
      asciiRef.current = instance;
      instance.load();
      ro = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect || !asciiRef.current) return;
        if (rect.width > 0 && rect.height > 0) asciiRef.current.setSize(rect.width, rect.height);
      });
      ro.observe(container);
    };

    void setup();

    return () => {
      cancelled = true;
      ro?.disconnect();
      asciiRef.current?.dispose();
      asciiRef.current = null;
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return <div ref={containerRef} className={`ascii-text-container ${className}`} />;
}
