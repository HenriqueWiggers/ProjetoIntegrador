import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

function v3(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

@Component({
  selector: 'app-coifa-viewer',
  standalone: true,
  templateUrl: './coifa-viewer.html',
  styleUrl: './coifa-viewer.css'
})
export class CoifaViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container', { static: true })
  private containerRef!: ElementRef<HTMLDivElement>;

  @Input() altura           = 0;
  @Input() largura          = 0;
  @Input() profundidade     = 0;
  @Input() bocaLargura      = 0;   // largura da abertura superior
  @Input() bocaProfundidade = 0;   // profundidade da abertura superior
  @Input() bocaCima         = 0;   // deslocamento a partir do canto traseiro
  @Input() bocaLado         = 0;   // deslocamento a partir do canto esquerdo

  private zone = inject(NgZone);

  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animId = 0;
  private resizeObs?: ResizeObserver;
  private readonly group = new THREE.Group();
  private labelEls: HTMLElement[] = [];
  private emptyOverlay!: HTMLDivElement;

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.initScene();
    this.buildModel();
    this.zone.runOutsideAngular(() => this.loop());
    this.watchResize();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.scene) this.buildModel();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    this.resizeObs?.disconnect();
    this.renderer?.dispose();
    this.labelRenderer?.domElement.remove();
  }

  // ── Scene setup ──────────────────────────────────────────────────────────────

  private initScene(): void {
    const el = this.containerRef.nativeElement;
    const w = Math.max(el.clientWidth, 400);
    const h = Math.max(el.clientHeight, 400);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0f1c);

    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);
    el.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    Object.assign(this.labelRenderer.domElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none'
    });
    el.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 1;

    // Empty state overlay
    this.emptyOverlay = document.createElement('div');
    Object.assign(this.emptyOverlay.style, {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      pointerEvents: 'none',
      zIndex: '5',
    });
    this.emptyOverlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
           fill="none" stroke="#2a2a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <p style="color:#2a2a4a;font-size:12px;font-family:'Calibri',sans-serif;text-align:center;margin:0">
        Preencha as dimensões<br>para visualizar a coifa
      </p>
    `;
    el.appendChild(this.emptyOverlay);

    this.scene.add(this.group);
  }

  // ── Model building ───────────────────────────────────────────────────────────

  private buildModel(): void {
    this.clearModel();

    const h  = +this.altura           || 0;
    const w  = +this.largura          || 0;
    const dp = +this.profundidade     || 0;
    const bL = +this.bocaLargura      || 0;
    const bP = +this.bocaProfundidade || 0;
    const cima = +this.bocaCima       || 0;
    const lado = +this.bocaLado       || 0;

    if (h <= 0 || w <= 0 || dp <= 0 || bL <= 0 || bP <= 0) {
      this.emptyOverlay.style.display = 'flex';
      return;
    }

    this.emptyOverlay.style.display = 'none';

    const bW = w / 2;
    const bD = dp / 2;
    // Abertura superior usa as dimensões fornecidas
    const tW = bL / 2;
    const tD = bP / 2;

    // Posicionamento corner-based:
    // lado=0, cima=0 → canto traseiro-esquerdo da boca alinha com canto da base
    const ox = -bW + tW + lado;
    const oy = -bD + tD + cima;

    const verts: THREE.Vector3[] = [
      v3(-bW,  0, -bD),             // 0 b0 back-left
      v3( bW,  0, -bD),             // 1 b1 back-right
      v3( bW,  0,  bD),             // 2 b2 front-right
      v3(-bW,  0,  bD),             // 3 b3 front-left
      v3(ox - tW, h, oy - tD),      // 4 t0 back-left
      v3(ox + tW, h, oy - tD),      // 5 t1 back-right
      v3(ox + tW, h, oy + tD),      // 6 t2 front-right
      v3(ox - tW, h, oy + tD),      // 7 t3 front-left
    ];

    this.addFaces(verts);
    this.addEdges(verts);
    this.addAnnotations(verts, w, dp, h);
    this.fitCamera();
  }

  private clearModel(): void {
    this.group.traverse((obj: THREE.Object3D) => {
      const o = obj as THREE.Mesh;
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) {
          (o.material as THREE.Material[]).forEach((m: THREE.Material) => m.dispose());
        } else {
          (o.material as THREE.Material).dispose();
        }
      }
    });
    this.group.clear();
    this.labelEls.forEach(el => el.remove());
    this.labelEls = [];
  }

  // ── Geometry ─────────────────────────────────────────────────────────────────

  private addFaces(verts: THREE.Vector3[]): void {
    const [b0, b1, b2, b3, t0, t1, t2, t3] = verts;
    const pts: number[] = [];

    const quad = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3) => {
      pts.push(
        a.x, a.y, a.z,  b.x, b.y, b.z,  c.x, c.y, c.z,
        a.x, a.y, a.z,  c.x, c.y, c.z,  d.x, d.y, d.z
      );
    };

    quad(b0, b3, b2, b1);  // bottom
    quad(t0, t1, t2, t3);  // top
    quad(b0, b1, t1, t0);  // back face
    quad(b1, b2, t2, t1);  // right face
    quad(b2, b3, t3, t2);  // front face
    quad(b3, b0, t0, t3);  // left face

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.computeVertexNormals();

    this.group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x1e3b78,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false
    })));
  }

  private addEdges(verts: THREE.Vector3[]): void {
    const [b0, b1, b2, b3, t0, t1, t2, t3] = verts;
    const pairs = [
      b0, b1,  b1, b2,  b2, b3,  b3, b0,   // bottom ring
      t0, t1,  t1, t2,  t2, t3,  t3, t0,   // top ring
      b0, t0,  b1, t1,  b2, t2,  b3, t3,   // vertical edges
    ];
    const positions: number[] = [];
    pairs.forEach(p => positions.push(p.x, p.y, p.z));

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.group.add(new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x5090f8 })
    ));
  }

  // ── Annotations ──────────────────────────────────────────────────────────────

  private addAnnotations(verts: THREE.Vector3[], w: number, dp: number, h: number): void {
    const [b0, b1, b2, b3, t0, t1, t2, t3] = verts;
    const G = Math.max(w, dp, h) * 0.28;

    // Largura — in front of the model (+Z offset)
    this.cota(
      v3(-w / 2, 0, dp / 2),
      v3( w / 2, 0, dp / 2),
      v3(0, 0, G),
      `${w} cm`
    );

    // Profundidade — to the right of the model (+X offset)
    this.cota(
      v3(w / 2, 0, -dp / 2),
      v3(w / 2, 0,  dp / 2),
      v3(G, 0, 0),
      `${dp} cm`
    );

    // Altura — to the back-left (-X offset)
    this.cota(
      v3(-w / 2, 0, -dp / 2),
      v3(-w / 2, h, -dp / 2),
      v3(-G, 0, 0),
      `${h} cm`
    );

    // Inclined edge lengths (at midpoint of each vertical edge)
    const edgePairs: [THREE.Vector3, THREE.Vector3][] = [
      [b0, t0], [b1, t1], [b2, t2], [b3, t3],
    ];
    edgePairs.forEach(([from, to]) => {
      const len = from.distanceTo(to);
      const mid = from.clone().lerp(to, 0.5);
      this.label(mid, `${len.toFixed(1)} cm`, '#ffcc88');
    });

    // Extensão de cada face: parte do meio do lado da base de cima (boca) e
    // desce em linha reta até a linha do lado correspondente da base de
    // baixo, no ponto mais próximo dela — não necessariamente no centro
    // desse lado de baixo.
    const faceMidPairs: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [
      [b0, b1, t0.clone().lerp(t1, 0.5)], // face de trás
      [b1, b2, t1.clone().lerp(t2, 0.5)], // face direita
      [b2, b3, t2.clone().lerp(t3, 0.5)], // face da frente
      [b3, b0, t3.clone().lerp(t0, 0.5)], // face esquerda
    ];
    faceMidPairs.forEach(([bottomA, bottomB, topMid]) => {
      const dir = bottomB.clone().sub(bottomA).normalize();
      const proj = topMid.clone().sub(bottomA).dot(dir);
      const foot = bottomA.clone().add(dir.clone().multiplyScalar(proj));

      this.seg(topMid, foot, 0x30d0c0);
      const mid = topMid.clone().lerp(foot, 0.5);
      this.label(mid, `${topMid.distanceTo(foot).toFixed(1)} cm`, '#7de8da');
    });
  }

  /**
   * Draw a dimension line (cota) from `from` to `to`, offset outward by `offset`.
   * Includes extension lines, dimension line, tick marks, and a text label.
   */
  private cota(
    from: THREE.Vector3,
    to: THREE.Vector3,
    offset: THREE.Vector3,
    text: string
  ): void {
    const df = from.clone().add(offset);
    const dt = to.clone().add(offset);
    const dir = new THREE.Vector3().subVectors(dt, df).normalize();
    const TICK = Math.max(4, offset.length() * 0.13);

    // Compute tick perpendicular (handles vertical vs horizontal dim lines)
    const ref = Math.abs(dir.y) > 0.85 ? v3(1, 0, 0) : v3(0, 1, 0);
    const perp = new THREE.Vector3()
      .crossVectors(dir, ref)
      .normalize()
      .multiplyScalar(TICK);

    this.seg(from, df, 0x304870);  // extension line from
    this.seg(to,   dt, 0x304870);  // extension line to
    this.seg(df,   dt, 0x5a88d0);  // dimension line

    this.seg(df.clone().sub(perp), df.clone().add(perp), 0x5a88d0);  // tick start
    this.seg(dt.clone().sub(perp), dt.clone().add(perp), 0x5a88d0);  // tick end

    // Label at midpoint — lift up or shift sideways to avoid overlapping the line
    const mid = df.clone().lerp(dt, 0.5);
    const isVertical = Math.abs(dir.y) > 0.85;
    const labelOffset = isVertical
      ? v3(offset.x < 0 ? -7 : 7, 0, 0)
      : v3(0, 6, 0);
    this.label(mid.clone().add(labelOffset), text, '#88bbff');
  }

  private seg(a: THREE.Vector3, b: THREE.Vector3, color: number): void {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    this.group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
  }

  private label(pos: THREE.Vector3, text: string, color = '#aaccff'): void {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    div.style.fontSize = '11px';
    div.style.fontFamily = '"Courier New", monospace';
    div.style.background = 'rgba(5, 5, 18, 0.88)';
    div.style.padding = '2px 6px';
    div.style.borderRadius = '3px';
    div.style.whiteSpace = 'nowrap';
    div.style.userSelect = 'none';
    div.style.letterSpacing = '0.3px';
    div.style.lineHeight = '1.4';

    this.labelEls.push(div);
    const obj = new CSS2DObject(div);
    obj.position.copy(pos);
    this.group.add(obj);
  }

  // ── Camera ───────────────────────────────────────────────────────────────────

  private fitCamera(): void {
    const box = new THREE.Box3().setFromObject(this.group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxD = Math.max(size.x, size.y, size.z, 1);
    const fov = (this.camera.fov * Math.PI) / 180;
    const dist = (maxD / 2 / Math.tan(fov / 2)) * 2.8;

    this.camera.position.set(
      center.x + dist * 0.85,
      center.y + dist * 0.55,
      center.z + dist * 0.85
    );
    this.camera.near = dist / 100;
    this.camera.far  = dist * 15;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    // Disable damping so update() clears any residual drag delta before re-enabling
    this.controls.enableDamping = false;
    this.controls.update();
    this.controls.enableDamping = true;
  }

  // ── Render loop ──────────────────────────────────────────────────────────────

  private loop(): void {
    this.animId = requestAnimationFrame(() => this.loop());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  private watchResize(): void {
    this.resizeObs = new ResizeObserver(() => {
      const el = this.containerRef.nativeElement;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.labelRenderer.setSize(w, h);
      }
    });
    this.resizeObs.observe(this.containerRef.nativeElement);
  }
}
