"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Eye, Sun, Star, Upload, Trash2, Lock, Unlock, ShieldAlert } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Cabinet {
  id: string; name: string; category: string; description: string;
  image: string; defaultImage: string;
  year: string; source: string; details: string[];
  xrayNote: string; infraNote: string;
}
interface VirtualMuseumGameProps {
  onOpenChat?: () => void;
  onSwitchToBooks?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_CABINETS: Cabinet[] = [
  {
    id: 'cab-trung-tam', name: 'Tượng đồng chân dung Bác', category: 'Tượng thờ & Tư liệu',
    description: 'Các bức tượng đồng tạc họa dung mạo Chủ tịch Hồ Chí Minh tại các thời điểm lịch sử, kèm khung hình tư liệu gốc ghi lại hành trạng cách mạng của Người.',
    image: '/cab1.jpg',
    defaultImage: '/cab1.jpg',
    year: 'Thế kỷ XX', source: 'Khu Di tích Phủ Chủ tịch',
    details: ['3 bộ tượng bán thân đúc đồng đỏ nguyên chất.', 'Kèm bản thảo gốc Tuyên ngôn Độc lập 2/9/1945.'],
    xrayNote: 'Mật độ đồng đều, kỹ thuật đúc sáp ong truyền thống đạt độ tinh xảo cực cao.',
    infraNote: 'Bề mặt ổn định 24°C, bảo quản dưới kính chân không kiểm soát ẩm độ.'
  },
  {
    id: 'cab-doc-bvat', name: 'Kỷ vật viết lách & Sách báo', category: 'Kỷ vật thiêng liêng',
    description: 'Bút máy ngòi vàng Bác ký các sắc lệnh lập quốc, bản thảo báo Thanh niên viết tay — những di vật gắn liền sự nghiệp báo chí của Người.',
    image: '/cab2.jpg',
    defaultImage: '/cab2.jpg',
    year: '1945 – 1969', source: 'Bảo tàng Lịch sử Quốc gia',
    details: ['Bút máy Parker ngòi vàng khắc chữ tượng trưng ý chí cách mạng.', 'Tủ kín phun khí Nitơ khô chống phân rã xơ.'],
    xrayNote: 'Cơ cấu bơm mực vẫn hoạt động nguyên vẹn sau hơn 70 năm.',
    infraNote: 'Dấu ố tự nhiên theo thời gian, chứng thực nguồn gốc cổ sử.'
  },
  {
    id: 'cab-dep-cao-su', name: 'Đôi dép cao su lịch sử', category: 'Đời sống thường nhật',
    description: 'Đôi dép chế tác thủ công từ lốp máy bay thực dân thu được năm 1947. Gắn bó theo gót chân Người trên vạn dặm hành quân.',
    image: '/cab3.jpg',
    defaultImage: '/cab3.jpg',
    year: '1947', source: 'Nhà sàn Phủ Chủ tịch',
    details: ['Cắt thủ công từ lốp lính chiến lợi phẩm.', 'Biểu tượng lối sống tối giản bậc thầy.'],
    xrayNote: 'Các lớp xơ thép dệt liên kết dẻo 100%, bảo vệ tuyệt đối.',
    infraNote: 'Độ ẩm sợi xơ tự nhiên cực thấp, quai gài còn nguyên độ co giãn.'
  },
  {
    id: 'cab-nhat-ky', name: 'Nhật ký trong tù', category: 'Áng văn cách mạng',
    description: '133 bài thơ chữ Hán viết trong lao tù Quảng Tây 1942–1943, thể hiện cốt cách thi nhân phi thường bất khuất của Người.',
    image: '/cab4.jpg',
    defaultImage: '/cab4.jpg',
    year: '1942 – 1943', source: 'Bảo tàng Cách mạng Việt Nam',
    details: ['Bản chép tay chữ Hán có tranh vẽ phác thảo của Bác.', 'Bảo vật Quốc Gia tối thượng của dân tộc.'],
    xrayNote: 'Mực muội than cổ trên giấy bản, dệt gáy bằng xơ đay bền chắc.',
    infraNote: 'Dấu mờ các nét vẽ chìm dưới trang giấy tả cảnh lao tù.'
  }
];

const PAINTING_SLOTS = [
  { 
    id: 'p1', title: 'Tuyên ngôn Độc lập', color: 0xc8860a, accent: 0x8b5e00, x: -6.2, y: 5.2, z: -9.5, w: 2.5, h: 1.85, defaultImage: '/p1.jpg',
    description: 'Bức ảnh ghi lại thời khắc lịch sử vô song ngày 2/9/1945, tại Quảng trường Ba Đình Hà Nội, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa.'
  },
  { 
    id: 'p2', title: 'Hành trình Cứu nước', color: 0x1a3a6c, accent: 0x0f2347, x: -1.8, y: 5.35, z: -9.5, w: 2.15, h: 1.65, defaultImage: '/p2.jpg',
    description: 'Đồng chí Nguyễn Ái Quốc phát biểu tại Đại hội đại biểu toàn quốc lần thứ XVIII của Đảng Xã hội Pháp ở Tours (tháng 12/1920). Tại đây, Người đã bỏ phiếu tán thành gia nhập Quốc tế thứ ba và tham gia thành lập Đảng Cộng sản Pháp.'
  },
  { 
    id: 'p3', title: 'Bác Hồ với Nhân dân', color: 0x7a1c1c, accent: 0x4a0e0e, x: 2.2, y: 5.35, z: -9.5, w: 2.3, h: 1.85, defaultImage: '/p3.jpg',
    description: 'Chủ tịch Hồ Chí Minh giản dị ngồi quan sát và chỉ đạo trận đánh Đông Khê trong chiến dịch Biên giới Thu Đông năm 1950. Hình ảnh thể hiện sự sâu sát thực tế chiến trường và tác phong quần chúng của vị lãnh tụ kính yêu.'
  },
  { 
    id: 'p4', title: 'Chiến thắng ĐBP 1954', color: 0x1a4a1a, accent: 0x0d2e0d, x: 6.2, y: 5.2, z: -9.5, w: 2.15, h: 1.65, defaultImage: '/p4.jpg',
    description: 'Hình ảnh lịch sử ghi lại cảnh các chiến sĩ quân đội nhân dân Việt Nam phất cao lá cờ "Quyết chiến Quyết thắng" trên nóc hầm tướng De Castries, đánh dấu sự toàn thắng của Chiến dịch Điện Biên Phủ vang dội năm châu.'
  },
  { 
    id: 'p5', title: 'Nhà sàn Phủ Chủ tịch', color: 0x3a1a5c, accent: 0x220e38, x: -9.45, y: 5.0, z: -3.5, w: 1.85, h: 2.0, rotY: Math.PI / 2, defaultImage: '/p5.jpg',
    description: 'Nhà sàn gỗ đơn sơ của Bác Hồ trong khu di tích Phủ Chủ tịch tại Hà Nội, nơi Người đã sống và làm việc suốt 15 năm cuối đời (1954 - 1969). Ngôi nhà là biểu tượng cao đẹp của lối sống giản dị, thanh tao.'
  },
  { 
    id: 'p6', title: 'Bác Hồ với Phụ nữ Việt Nam', color: 0x6b2800, accent: 0x421800, x: 9.45, y: 5.0, z: -3.5, w: 1.85, h: 2.0, rotY: -Math.PI / 2, defaultImage: '/p6.png',
    description: 'Chủ tịch Hồ Chí Minh luôn dành sự quan tâm sâu sắc và tình cảm ấm áp cho phụ nữ Việt Nam. Bức ảnh ghi lại khoảnh khắc Người gặp gỡ và trò chuyện thân mật cùng các đại biểu phụ nữ Việt Nam, tôn vinh truyền thống anh hùng, bất khuất, trung hậu, đảm đang.'
  },
];

const ADMIN_PASSWORD = 'admin2026';

// ─── Component ────────────────────────────────────────────────────────────────
export default function VirtualMuseumGame({ onSwitchToBooks, onOpenChat }: VirtualMuseumGameProps) {
  const [cabinets, setCabinets] = useState<Cabinet[]>(DEFAULT_CABINETS);
  const [paintingImages, setPaintingImages] = useState<Record<string, string | null>>({});

  const onSwitchToBooksRef = useRef(onSwitchToBooks);
  const onOpenChatRef = useRef(onOpenChat);
  useEffect(() => {
    onSwitchToBooksRef.current = onSwitchToBooks;
    onOpenChatRef.current = onOpenChat;
  }, [onOpenChat]);

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [selectedPainting, setSelectedPainting] = useState<typeof PAINTING_SLOTS[number] | null>(null);
  const [scanLayer, setScanLayer] = useState<'optical' | 'infra' | 'xray'>('optical');
  const [isScanning, setIsScanning] = useState(false);
  const [tributeCounts, setTributeCounts] = useState<Record<string, number>>({
    'cab-trung-tam': 1945, 'cab-doc-bvat': 1969, 'cab-dep-cao-su': 2026, 'cab-nhat-ky': 1943,
  });
  const [activeTributeId, setActiveTributeId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Admin auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [showWallPanel, setShowWallPanel] = useState(false);

  // Refs
  const cabUploadRef = useRef<HTMLInputElement>(null);
  const wallUploadRef = useRef<HTMLInputElement>(null);
  const pendingUploadCabId = useRef<string | null>(null);
  const pendingUploadPaintId = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintingMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const paintingTexturesRef = useRef<Record<string, THREE.Texture | null>>({});

  // ── Tribute ────────────────────────────────────────────────────────────────
  const saveTribute = useCallback((u: Record<string, number>) => {
    setTributeCounts(u);
    try { localStorage.setItem('hcm_tributes', JSON.stringify(u)); } catch {}
  }, []);
  useEffect(() => {
    try { const s = localStorage.getItem('hcm_tributes'); if (s) setTributeCounts(JSON.parse(s)); } catch {}
  }, []);

  // ── Admin login ────────────────────────────────────────────────────────────
  const handleAdminLogin = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowAdminModal(false); setAdminInput(''); setAdminError(false);
    } else {
      setAdminError(true); setAdminInput('');
    }
  };

  // ── Wall upload ───────────────────────────────────────────────────────────
  const handleWallUpload = (id: string) => { pendingUploadPaintId.current = id; wallUploadRef.current?.click(); };
  const onWallFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; const id = pendingUploadPaintId.current;
    if (!file || !id) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setPaintingImages(p => ({ ...p, [id]: url }));
      new THREE.TextureLoader().load(url, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = paintingMeshesRef.current[id];
        if (mesh) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.map) {
            mat.map.dispose();
          }
          mat.map = tex; mat.color.set(0xffffff); mat.emissiveIntensity = 0; mat.needsUpdate = true;
        }
        if (paintingTexturesRef.current[id]) {
          paintingTexturesRef.current[id]?.dispose();
        }
        paintingTexturesRef.current[id] = tex;
      });
    };
    reader.readAsDataURL(file); e.target.value = '';
  };
  const resetWallImage = (id: string) => {
    setPaintingImages(p => { const n = { ...p }; delete n[id]; return n; });
    const mesh = paintingMeshesRef.current[id];
    const slot = PAINTING_SLOTS.find(p => p.id === id);
    if (mesh && slot) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.map = null; mat.color.set(slot.color); mat.emissive.set(slot.accent);
      mat.emissiveIntensity = 0.04; mat.needsUpdate = true;
    }
    paintingTexturesRef.current[id]?.dispose();
    paintingTexturesRef.current[id] = null;
  };

  // ── Cabinet upload ────────────────────────────────────────────────────────
  const handleCabUpload = (id: string) => { pendingUploadCabId.current = id; cabUploadRef.current?.click(); };
  const onCabFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; const id = pendingUploadCabId.current;
    if (!file || !id) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setCabinets(p => p.map(c => c.id === id ? { ...c, image: url } : c));
      setSelectedCabinet(p => p?.id === id ? { ...p, image: url } : p);
    };
    reader.readAsDataURL(file); e.target.value = '';
  };
  const resetCabImage = (id: string) => {
    const def = DEFAULT_CABINETS.find(c => c.id === id);
    if (!def) return;
    setCabinets(p => p.map(c => c.id === id ? { ...c, image: def.defaultImage } : c));
    setSelectedCabinet(p => p?.id === id ? { ...p, image: def.defaultImage } : p);
  };

  const runScan = useCallback((l: 'optical' | 'infra' | 'xray') => {
    setIsScanning(true); setScanLayer(l); setTimeout(() => setIsScanning(false), 1200);
  }, []);

  // ── THREE.JS SCENE ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let W = canvas.parentElement?.clientWidth || 900;
    let H = canvas.parentElement?.clientHeight || 580;

    // Drag rotation state
    let theta = 0;
    let phi = -0.0644;
    let isPointerDown = false;
    let isDragging = false;
    let downX = 0;
    let downY = 0;
    let startTheta = 0;
    let startPhi = 0;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    // Bright museum atmosphere
    scene.background = new THREE.Color(0x1a1f2e);
    scene.fog = new THREE.FogExp2(0x181d2c, 0.022);

    // Camera — cinematic low angle looking up into the space
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 80);
    camera.position.set(0, 4.5, 13.5);

    const updateCamera = () => {
      const target = new THREE.Vector3(
        camera.position.x + Math.sin(theta) * Math.cos(phi),
        camera.position.y + Math.sin(phi),
        camera.position.z - Math.cos(theta) * Math.cos(phi)
      );
      camera.lookAt(target);
    };
    updateCamera();

    // ═══ LIGHTING — museum well-lit ════════════════════════════════════════
    // Strong ambient base so no surface is pitch black
    scene.add(new THREE.AmbientLight(0xd0d8f0, 1.8));

    // Warm key light — main overhead fill
    const keyLight = new THREE.DirectionalLight(0xfff6e0, 2.2);
    keyLight.position.set(2, 18, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.setScalar(2048);
    keyLight.shadow.camera.left = -14; keyLight.shadow.camera.right = 14;
    keyLight.shadow.camera.top = 14; keyLight.shadow.camera.bottom = -14;
    keyLight.shadow.bias = -0.001; keyLight.shadow.radius = 3;
    scene.add(keyLight);

    // Cool bounce fill from front
    const fillLight = new THREE.DirectionalLight(0xc0d0ff, 1.0);
    fillLight.position.set(-8, 4, 8);
    scene.add(fillLight);

    // Second fill — back wall bounce
    const backFill = new THREE.DirectionalLight(0xffe8c0, 0.7);
    backFill.position.set(0, 6, -12);
    scene.add(backFill);

    // ── Ceiling cove lights — bright warm strips ──
    const covePositions = [
      [-13.2, 9.4, -5], [-13.2, 9.4, 0], [-13.2, 9.4, 5],
      [13.2, 9.4, -5],  [13.2, 9.4, 0],  [13.2, 9.4, 5],
      [-8, 9.4, -9.2], [-4, 9.4, -9.2], [0, 9.4, -9.2], [4, 9.4, -9.2], [8, 9.4, -9.2],
    ];
    covePositions.forEach(([x, y, z]) => {
      const pl = new THREE.PointLight(0xffcc88, 4.5, 9, 1.6);
      pl.position.set(x, y, z); scene.add(pl);
    });

    // ── Painting spotlights — sharp theatrical ──
    const paintSpotConfigs = [
      { pos: [-9.5, 8.8, -5.5],  target: [-9.5, 5.2, -9.5] },
      { pos: [-3.2, 8.8, -5.5],  target: [-3.2, 5.35,-9.5] },
      { pos: [ 3.2, 8.8, -5.5],  target: [ 3.2, 5.35,-9.5] },
      { pos: [ 9.5, 8.8, -5.5],  target: [ 9.5, 5.2, -9.5] },
      { pos: [-9.0, 8.2, -3.5],  target: [-13.45,5.0, -3.5] },
      { pos: [ 9.0, 8.2, -3.5],  target: [ 13.45,5.0, -3.5] },
    ];
    paintSpotConfigs.forEach(({ pos, target }) => {
      const s = new THREE.SpotLight(0xfff5d0, 55, 16, Math.PI / 7.5, 0.5, 1.5);
      s.position.set(...pos as [number,number,number]);
      s.target.position.set(...target as [number,number,number]);
      s.castShadow = false;
      scene.add(s); scene.add(s.target);
    });

    // ── Center exhibit spotlight ──
    const heroSpot = new THREE.SpotLight(0xfffae8, 90, 14, Math.PI / 7.5, 0.4, 1.3);
    heroSpot.position.set(0, 9.5, 0);
    heroSpot.target.position.set(0, 2.5, -1.8);
    heroSpot.castShadow = true; heroSpot.shadow.bias = -0.001;
    scene.add(heroSpot); scene.add(heroSpot.target);

    // Side exhibit spots
    [[-6.5,-1.5],[6.5,-1.5],[-3.2,1.8]].forEach(([ex,ez]) => {
      const sp = new THREE.SpotLight(0xfff4dc, 60, 12, Math.PI/7, 0.55, 1.4);
      sp.position.set(ex, 9, ez+1); sp.target.position.set(ex, 1.5, ez);
      scene.add(sp); scene.add(sp.target);
    });

    // ═══ FLOOR — dark polished marble ═══════════════════════════════════════
    // Realistic marble: large tiles with slight variation
    const mkTile = (color: number, roughness: number) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.12 });
    const tileGeo = new THREE.BoxGeometry(2.48, 0.12, 2.48);
    const tileDark = mkTile(0x152540, 0.22);
    const tileMid  = mkTile(0x1a2e52, 0.24);
    const tileAcct = mkTile(0x1e3360, 0.20);
    for (let i = -9; i <= 9; i++) {
      for (let j = -9; j <= 9; j++) {
        const r = Math.random();
        const mat = r < 0.6 ? tileDark : r < 0.85 ? tileMid : tileAcct;
        const tile = new THREE.Mesh(tileGeo, mat);
        tile.position.set(i * 2.5, -0.06, j * 2.5 - 1);
        tile.receiveShadow = true; scene.add(tile);
      }
    }
    // Grout lines: thin bright strips
    const groutMat = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.9 });
    for (let i = -9; i <= 9; i++) {
      const hLine = new THREE.Mesh(new THREE.BoxGeometry(46, 0.02, 0.04), groutMat);
      hLine.position.set(0, 0.001, i * 2.5 - 1); scene.add(hLine);
      const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 46), groutMat);
      vLine.position.set(i * 2.5, 0.001, -1); scene.add(vLine);
    }

    // ═══ WALLS — plastered with subtle texture ════════════════════════════════
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // Load wall textures
    const wallBackTex = textureLoader.load('/wall-back.png');
    wallBackTex.colorSpace = THREE.SRGBColorSpace;
    const wallSideTex = textureLoader.load('/wall-side.png');
    wallSideTex.colorSpace = THREE.SRGBColorSpace;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2e3450, roughness: 0.88, metalness: 0.0 });
    const mkPanel = (w:number,h:number,d:number,x:number,y:number,z:number,mat=wallMat) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
      m.position.set(x,y,z); m.receiveShadow = true; scene.add(m); return m;
    };
    mkPanel(22, 10.5, 0.4, 0, 5.25, -10);  // back
    mkPanel(0.4, 10.5, 22, -10, 5.25, -1); // left
    mkPanel(0.4, 10.5, 22, 10, 5.25, -1);  // right

    // Image planes for walls to overlay Uncle Ho's propaganda posters without stretching distortion
    const wallBackMat = new THREE.MeshStandardMaterial({ map: wallBackTex, roughness: 0.85, metalness: 0.05 });
    const wallSideMat = new THREE.MeshStandardMaterial({ map: wallSideTex, roughness: 0.85, metalness: 0.05 });

    // Back wall plane (fits exactly between wainscoting cap at y=2.3 and crown molding at y=10.03)
    const backWallPlane = new THREE.Mesh(new THREE.PlaneGeometry(19.6, 7.7), wallBackMat);
    backWallPlane.position.set(0, 6.165, -9.79);
    backWallPlane.receiveShadow = true;
    scene.add(backWallPlane);

    // Left wall plane (rotation ensures correct orientation of text)
    const leftWallPlane = new THREE.Mesh(new THREE.PlaneGeometry(22.0, 7.7), wallSideMat);
    leftWallPlane.position.set(-9.79, 6.165, -1.0);
    leftWallPlane.rotation.y = Math.PI / 2;
    leftWallPlane.receiveShadow = true;
    scene.add(leftWallPlane);

    // Right wall plane (rotation ensures correct orientation of text)
    const rightWallPlane = new THREE.Mesh(new THREE.PlaneGeometry(22.0, 7.7), wallSideMat);
    rightWallPlane.position.set(9.79, 6.165, -1.0);
    rightWallPlane.rotation.y = -Math.PI / 2;
    rightWallPlane.receiveShadow = true;
    scene.add(rightWallPlane);

    // Ceiling — lighter so light bounces back down
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x252b40, roughness: 0.9 });
    mkPanel(22, 0.35, 22, 0, 10.5, -1, ceilMat);

    // ── Wainscoting panel system — lower wall detail ──
    const wainMat = new THREE.MeshStandardMaterial({ color: 0x1e2640, roughness: 0.75, metalness: 0.05 });
    const wainCapMat = new THREE.MeshStandardMaterial({ color: 0x7a6035, roughness: 0.35, metalness: 0.55 });
    // Back wall wainscoting
    mkPanel(22, 2.2, 0.5, 0, 1.1, -9.95, wainMat);
    mkPanel(22, 0.1, 0.5, 0, 2.25, -9.95, wainCapMat);
    // Side walls
    mkPanel(0.5, 2.2, 22, -9.95, 1.1, -1, wainMat);
    mkPanel(0.5, 0.1, 22, -9.95, 2.25, -1, wainCapMat);
    mkPanel(0.5, 2.2, 22, 9.95, 1.1, -1, wainMat);
    mkPanel(0.5, 0.1, 22, 9.95, 2.25, -1, wainCapMat);

    // Crown molding — gold trim
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xb8922a, roughness: 0.28, metalness: 0.75 });
    mkPanel(22.4, 0.18, 0.22, 0, 10.12, -9.92, crownMat);
    mkPanel(0.22, 0.18, 22.4, -9.92, 10.12, -1, crownMat);
    mkPanel(0.22, 0.18, 22.4, 9.92, 10.12, -1, crownMat);

    // ── Architectural columns — fluted marble ──
    const colMat = new THREE.MeshStandardMaterial({ color: 0x1c2236, roughness: 0.5, metalness: 0.12 });
    const colCapMat = new THREE.MeshStandardMaterial({ color: 0x96793a, roughness: 0.28, metalness: 0.72 });
    const colPositions = [[-10, -8.5], [-10, 3.5], [10, -8.5], [10, 3.5]];
    colPositions.forEach(([cx, cz]) => {
      // Shaft — octagonal for that classical feel
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 9.4, 8), colMat);
      shaft.position.set(cx, 4.8, cz); shaft.castShadow = true; scene.add(shaft);
      // Capital top
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.9), colCapMat);
      cap.position.set(cx, 10.15, cz); scene.add(cap);
      // Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.3, 0.85), colCapMat);
      base.position.set(cx, 0.15, cz); scene.add(base);
      // Subtle column glow uplight
      const pl = new THREE.PointLight(0xffd080, 1.2, 5, 2);
      pl.position.set(cx, 0.8, cz); scene.add(pl);
    });

    // ── Decorative wall sconces between paintings ──
    const sconceMat = new THREE.MeshStandardMaterial({ color: 0xd4a030, roughness: 0.22, metalness: 0.9, emissive: 0xffd060, emissiveIntensity: 0.35 });
    [-12, -6, 0, 6, 12].forEach(sx => {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.25), sconceMat);
      s.position.set(sx, 7.5, -9.7); scene.add(s);
      const pl = new THREE.PointLight(0xffd080, 2.5, 3.5, 2);
      pl.position.set(sx, 7.2, -9.2); scene.add(pl);
    });

    // ── Center aisle carpet ──
    const carpetMat = new THREE.MeshStandardMaterial({ color: 0x1a0e04, roughness: 0.95 });
    const carpet = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.04, 14), carpetMat);
    carpet.position.set(0, 0.02, -2); carpet.receiveShadow = true; scene.add(carpet);
    // Gold border on carpet
    const carpetGold = new THREE.MeshStandardMaterial({ color: 0xb8922a, roughness: 0.3, metalness: 0.8 });
    const cEdge = (w:number,h:number,d:number,x:number,z:number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), carpetGold);
      m.position.set(x,0.04,z); scene.add(m);
    };
    cEdge(0.12,0.03,14, 1.66,-2); cEdge(0.12,0.03,14,-1.66,-2);
    cEdge(3.44,0.03,0.12,0,-9.06); cEdge(3.44,0.03,0.12,0,5.06);

    // ═══ WALL PAINTINGS ═══════════════════════════════════════════════════════
    const interactive: THREE.Object3D[] = [];
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xb8881e, roughness: 0.15, metalness: 0.92 });
    const innerFrameMat = new THREE.MeshStandardMaterial({ color: 0x7a5c12, roughness: 0.3, metalness: 0.7 });

    PAINTING_SLOTS.forEach(p => {
      const g = new THREE.Group();
      g.position.set(p.x, p.y, p.z + 0.2);
      g.rotation.y = p.rotY ?? 0;

      const fw = p.w + 0.28, fh = p.h + 0.28;
      // Outer gold frame bars
      [[fw,0.14,0.18,0,fh/2,0],[fw,0.14,0.18,0,-fh/2,0],
       [0.14,fh,0.18,-fw/2,0,0],[0.14,fh,0.18,fw/2,0,0]].forEach(([w,h,d,x,y,z]) => {
        const f = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), frameMat);
        f.position.set(x,y,z); g.add(f);
      });
      // Inner frame (darker inset)
      const ifw = p.w + 0.06, ifh = p.h + 0.06;
      [[ifw,0.06,0.12,0,ifh/2,0],[ifw,0.06,0.12,0,-ifh/2,0],
       [0.06,ifh,0.12,-ifw/2,0,0],[0.06,ifh,0.12,ifw/2,0,0]].forEach(([w,h,d,x,y,z]) => {
        const f = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), innerFrameMat);
        f.position.set(x,y,z); g.add(f);
      });

      // Canvas — deep, realistic dark colors (oil painting feel)
      const faceMat = new THREE.MeshStandardMaterial({
        color: p.color, roughness: 0.72, emissive: new THREE.Color(p.accent), emissiveIntensity: 0.04, metalness: 0.0
      });
      const face = new THREE.Mesh(new THREE.BoxGeometry(p.w, p.h, 0.04), faceMat);
      face.position.set(0, 0, -0.015);
      face.userData = { id: p.id, type: 'painting', title: p.title };
      g.add(face); interactive.push(face);
      paintingMeshesRef.current[p.id] = face;


      // Brass name plate below
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xc8980e, roughness: 0.18, metalness: 0.92, emissive: 0xd4a020, emissiveIntensity: 0.08 });
      const plate = new THREE.Mesh(new THREE.BoxGeometry(p.w * 0.62, 0.16, 0.1), plateMat);
      plate.position.set(0, -fh / 2 - 0.14, 0); g.add(plate);

      // Wall hook
      const hookMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.95, roughness: 0.15 });
      const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8), hookMat);
      hook.position.set(0, fh / 2 + 0.06, -0.1); g.add(hook);

      scene.add(g);

      // Apply texture (custom uploaded, state-stored, or default)
      const currentImageUrl = paintingImages[p.id] || p.defaultImage;
      if (paintingTexturesRef.current[p.id]) {
        faceMat.map = paintingTexturesRef.current[p.id];
        faceMat.color.set(0xffffff); faceMat.emissiveIntensity = 0;
        faceMat.needsUpdate = true;
      } else if (currentImageUrl) {
        textureLoader.load(currentImageUrl, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          faceMat.map = tex;
          faceMat.color.set(0xffffff); faceMat.emissiveIntensity = 0;
          faceMat.needsUpdate = true;
          paintingTexturesRef.current[p.id] = tex;
        });
      }
    });

    // ═══ PEDESTALS — classical museum style ══════════════════════════════════
    const pedStoneMat = new THREE.MeshStandardMaterial({ color: 0x151c28, roughness: 0.55, metalness: 0.08 });
    const pedGoldMat  = new THREE.MeshStandardMaterial({ color: 0xb8882a, roughness: 0.25, metalness: 0.82 });

    const mkPedestal = (x: number, z: number, id: string, scale = 1) => {
      const g = new THREE.Group();
      // Wide base slab
      const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(1.7*scale,0.15,1.7*scale), pedStoneMat);
      baseSlab.position.y = 0.075; baseSlab.receiveShadow = true; baseSlab.castShadow = true; g.add(baseSlab);
      // Gold accent at base
      const baseGold = new THREE.Mesh(new THREE.BoxGeometry(1.65*scale,0.07,1.65*scale), pedGoldMat);
      baseGold.position.y = 0.185; g.add(baseGold);
      // Main column body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.2*scale, 1.55*scale, 1.2*scale), pedStoneMat);
      body.position.y = 0.99*scale; body.castShadow = true; body.receiveShadow = true;
      body.userData = { id, type: 'exhibit' }; g.add(body); interactive.push(body);
      // Gold neck
      const neck = new THREE.Mesh(new THREE.BoxGeometry(1.35*scale,0.09,1.35*scale), pedGoldMat);
      neck.position.y = 1.79*scale; g.add(neck);
      // Top cap
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.55*scale,0.16,1.55*scale), pedStoneMat);
      cap.position.y = 1.93*scale; cap.castShadow = true; g.add(cap);
      // Top gold trim
      const capGold = new THREE.Mesh(new THREE.BoxGeometry(1.6*scale,0.05,1.6*scale), pedGoldMat);
      capGold.position.y = 2.025*scale; g.add(capGold);

      g.position.set(x, 0, z); scene.add(g);
      return 2.075 * scale;
    };

    const ped1H = mkPedestal(-4.8, -1.5, 'cab-doc-bvat');
    const ped2H = mkPedestal( 4.8, -1.5, 'cab-dep-cao-su');
    const ped3H = mkPedestal(-2.3,  1.8, 'cab-nhat-ky');
    const ctrCapH = mkPedestal(0, -1.8, 'cab-trung-tam', 1.4);

    // Function to create a 2D image board representing the exhibit on top of its pedestal
    const createExhibitBoard = (x: number, z: number, capY: number, id: string, scale = 1) => {
      const cab = cabinets.find(c => c.id === id) || DEFAULT_CABINETS.find(c => c.id === id);
      if (!cab) return;

      const boardGroup = new THREE.Group();
      boardGroup.position.set(x, capY, z);

      // Gold frame for the board
      const frameW = 1.05 * scale;
      const frameH = 1.35 * scale;
      const frameD = 0.06 * scale;
      const frameGeo = new THREE.BoxGeometry(frameW, frameH, frameD);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xb8882a, roughness: 0.2, metalness: 0.8 });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.y = frameH / 2;
      frameMesh.castShadow = true;
      frameMesh.receiveShadow = true;
      frameMesh.userData = { id, type: 'exhibit' };
      boardGroup.add(frameMesh);
      interactive.push(frameMesh);

      // Inner poster with texture
      const posterW = 0.95 * scale;
      const posterH = 1.25 * scale;
      const posterGeo = new THREE.BoxGeometry(posterW, posterH, 0.01 * scale);
      
      textureLoader.load(cab.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const posterMat = new THREE.MeshStandardMaterial({ 
          map: tex, 
          roughness: 0.4, 
          metalness: 0.1 
        });
        const posterMesh = new THREE.Mesh(posterGeo, posterMat);
        posterMesh.position.y = frameH / 2;
        posterMesh.position.z = frameD / 2 + 0.005;
        posterMesh.castShadow = true;
        posterMesh.receiveShadow = true;
        posterMesh.userData = { id, type: 'exhibit' };
        boardGroup.add(posterMesh);
        interactive.push(posterMesh);
      });

      // Rotation angles to face the viewer/camera
      if (id === 'cab-doc-bvat') {
        boardGroup.rotation.y = Math.PI / 4.2;
      } else if (id === 'cab-dep-cao-su') {
        boardGroup.rotation.y = -Math.PI / 4.2;
      } else if (id === 'cab-nhat-ky') {
        boardGroup.rotation.y = Math.PI / 5.5;
      } else {
        boardGroup.rotation.y = 0;
      }

      scene.add(boardGroup);
    };

    createExhibitBoard(-4.8, -1.5, ped1H, 'cab-doc-bvat');
    createExhibitBoard( 4.8, -1.5, ped2H, 'cab-dep-cao-su');
    createExhibitBoard(-2.3,  1.8, ped3H, 'cab-nhat-ky');
    createExhibitBoard(0, -1.8, ctrCapH, 'cab-trung-tam', 1.4);

    // Star
    const starGeo = new THREE.OctahedronGeometry(0.18, 1);
    const starMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1.5, roughness: 0.08, metalness: 1 });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.set(0, ctrCapH + 2.05, -1.8); scene.add(starMesh);
    // Star glow
    const starGlow = new THREE.PointLight(0xffd700, 4, 3, 2);
    starGlow.position.set(0, ctrCapH + 2.05, -1.8); scene.add(starGlow);

    // ═══ PORTALS ═══════════════════════════════════════════════════════════════
    const mkPortal = (x:number,z:number,id:string,glowHex:number) => {
      const g = new THREE.Group();
      const portalStoneMat = new THREE.MeshStandardMaterial({ color:0x0d1120, roughness:0.6, metalness:0.15 });
      // Arch frame sides
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.55,4.0,0.55), portalStoneMat);
      side.castShadow = true;
      [-0.7, 0.7].forEach(ox => {
        const s = side.clone(); s.position.set(ox, 2.0, 0); g.add(s);
      });
      // Top bar
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.95,0.45,0.55), portalStoneMat);
      top.position.set(0, 4.22, 0); g.add(top);
      // Gold trim on top
      const topGold = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.1,0.6), pedGoldMat);
      topGold.position.set(0, 4.5, 0); g.add(topGold);
      // Glowing inner panel
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05,3.6,0.2),
        new THREE.MeshStandardMaterial({ color:glowHex, emissive:new THREE.Color(glowHex), emissiveIntensity:0.55, roughness:0.1, transparent:true, opacity:0.88 }));
      panel.position.set(0, 1.9, 0.22); panel.userData={id,type:'portal'}; g.add(panel); interactive.push(panel);
      // Body collider
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.35,3.9,0.5), new THREE.MeshStandardMaterial({transparent:true,opacity:0}));
      body.position.set(0, 2.0, 0); body.userData={id,type:'portal'}; g.add(body); interactive.push(body);
      // Glow light
      const gl = new THREE.PointLight(glowHex, 2.5, 5, 2);
      gl.position.set(0, 2.2, 0.8); g.add(gl);
      g.position.set(x,0,z); scene.add(g);
    };
    mkPortal( 2.5,  1.8, 'portal-chat',  0x00c87a);

    // ═══ INTERACTION & DRAG ROTATION ═════════════════════════════════════════════
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const getHit = (cx:number,cy:number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((cx-rect.left)/rect.width)*2-1;
      mouse.y = -((cy-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactive);
      return hits.length > 0 ? hits[0].object : null;
    };
    
    const onMove = (cx:number,cy:number) => {
      const h = getHit(cx,cy);
      canvas.style.cursor = h?.userData?.id ? 'pointer' : 'default';
      setHoveredId(h?.userData?.id ?? null);
    };

    const onClickOrTap = (cx:number,cy:number) => {
      const h = getHit(cx,cy); if (!h) return;
      const { id, type } = h.userData;
      if (type==='portal') {
        if (id==='portal-books' && onSwitchToBooksRef.current) onSwitchToBooksRef.current();
        else if (id==='portal-chat' && onOpenChatRef.current) onOpenChatRef.current();
      } else if (type==='exhibit') {
        const cab = DEFAULT_CABINETS.find(c=>c.id===id);
        if (cab) setSelectedCabinet(prev => prev?.id===id ? prev : { ...cab });
      } else if (type==='painting') {
        const paint = PAINTING_SLOTS.find(p=>p.id===id);
        if (paint) setSelectedPainting(paint);
      }
    };

    const onPointerDown = (clientX: number, clientY: number) => {
      isPointerDown = true;
      isDragging = false;
      downX = clientX;
      downY = clientY;
      startTheta = theta;
      startPhi = phi;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!isPointerDown) return;
      const dx = clientX - downX;
      const dy = clientY - downY;
      if (Math.hypot(dx, dy) > 8) {
        isDragging = true;
      }
      theta = startTheta - dx * 0.004;
      phi = Math.max(-0.5, Math.min(0.5, startPhi + dy * 0.004));
      updateCamera();
    };

    const onPointerUp = (clientX: number, clientY: number) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (!isDragging) {
        onClickOrTap(clientX, clientY);
      }
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      onPointerDown(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      onMove(e.clientX, e.clientY);
      onPointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = (e: MouseEvent) => {
      onPointerUp(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length) {
        onPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    const onResize = () => {
      W = canvas.parentElement?.clientWidth||W; H = canvas.parentElement?.clientHeight||H;
      renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize); onResize();

    // ═══ RENDER LOOP ════════════════════════════════════════════════════════════
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      starMesh.rotation.y += 0.018;
      starMesh.position.y = ctrCapH + 2.05 + Math.sin(t * 1.4) * 0.055;
      starGlow.position.y = starMesh.position.y;
      // Subtle breathing on hero spot
      heroSpot.intensity = 52 + Math.sin(t * 0.4) * 3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      
      // Dispose of all geometries and materials in the scene to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      // Dispose of painting textures
      Object.values(paintingTexturesRef.current).forEach((tex) => {
        if (tex) tex.dispose();
      });
      paintingTexturesRef.current = {};

      renderer.dispose();
    };
  }, []);

  // Sync cabinet images
  useEffect(() => {
    if (!selectedCabinet) return;
    const fresh = cabinets.find(c => c.id === selectedCabinet.id);
    if (fresh && fresh.image !== selectedCabinet.image) setSelectedCabinet(fresh);
  }, [cabinets, selectedCabinet]);

  const hoveredPainting = PAINTING_SLOTS.find(p => p.id === hoveredId);
  const hoveredCabinet  = DEFAULT_CABINETS.find(c => c.id === hoveredId);
  const portalLabel: Record<string,string> = { 'portal-chat':'Hướng dẫn viên AI' };

  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl shadow-2xl bg-[#0b0d12] border border-blue-950/60">

      {/* Hidden inputs */}
      <input ref={cabUploadRef}  type="file" accept="image/*" className="hidden" onChange={onCabFileChange} />
      <input ref={wallUploadRef} type="file" accept="image/*" className="hidden" onChange={onWallFileChange} />

      {/* ── CANVAS ── */}
      <div className="relative w-full flex-1 min-h-0">
        <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" style={{ touchAction: 'none' }} />

        {/* Navigation Tip */}
        <div className="absolute bottom-4 left-4 pointer-events-none z-10 hidden sm:block">
          <div className="bg-black/60 backdrop-blur-md border border-yellow-800/30 rounded-xl px-3 py-1.5 shadow-lg text-[10px] text-yellow-200/90 font-medium">
            💡 Kéo chuột hoặc vuốt màn hình để xoay góc nhìn
          </div>
        </div>

        {/* Mobile Navigation Tip */}
        <div className="absolute bottom-4 left-4 pointer-events-none z-10 sm:hidden">
          <div className="bg-black/70 backdrop-blur-md border border-yellow-800/40 rounded-xl px-2.5 py-1 shadow-lg text-[9px] text-yellow-200/90 font-medium">
            💡 Vuốt để xoay góc nhìn
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md border border-yellow-700/40 rounded-2xl px-5 py-2 shadow-lg">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] font-extrabold text-yellow-100 uppercase tracking-[0.22em]">Không gian Văn hóa Hồ Chí Minh</span>
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          </div>
        </div>

        {/* Admin lock button — bottom-right corner, subtle */}
        <button
          onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
          className={`absolute bottom-4 right-4 z-20 p-2 rounded-xl border backdrop-blur-md duration-200 cursor-pointer ${
            isAdmin
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-black/40 border-white/10 text-white/30 hover:text-white/60 hover:border-white/25'
          }`}
          title={isAdmin ? 'Thoát Admin' : 'Đăng nhập Admin'}
        >
          {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
        </button>

        {/* Admin mode: wall painting panel trigger */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setShowWallPanel(v => !v)}
              className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl border backdrop-blur-md cursor-pointer duration-200 ${
                showWallPanel
                  ? 'bg-yellow-500/25 border-yellow-500/60 text-yellow-300'
                  : 'bg-black/50 border-yellow-700/40 text-yellow-400 hover:bg-yellow-500/15'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Quản lý Tranh tường
            </button>

            <AnimatePresence>
              {showWallPanel && (
                <motion.div
                  initial={{ opacity:0, y:-6, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:-6, scale:0.96 }}
                  className="absolute right-0 top-10 w-64 bg-[#0e1220]/96 backdrop-blur-lg border border-yellow-800/40 rounded-2xl shadow-2xl p-3 space-y-1.5 z-30"
                >
                  <p className="text-[9px] text-yellow-600/80 font-mono uppercase tracking-wider mb-2 px-1">Thay ảnh từng bức tranh</p>
                  {PAINTING_SLOTS.map(p => (
                    <div key={p.id} className="flex items-center gap-2 px-1">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: `#${p.color.toString(16).padStart(6,'0')}` }} />
                      <span className="flex-1 text-[9px] font-medium text-gray-300 truncate">{p.title}</span>
                      <button onClick={() => handleWallUpload(p.id)}
                        className="p-1 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-700/40 text-yellow-400 cursor-pointer duration-150"
                        title="Tải ảnh lên"
                      ><Upload className="w-3 h-3" /></button>
                      {paintingImages[p.id] && (
                        <button onClick={() => resetWallImage(p.id)}
                          className="p-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-800/40 text-red-400 cursor-pointer duration-150"
                          title="Xóa ảnh"
                        ><Trash2 className="w-3 h-3" /></button>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              key={hoveredId}
              initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:5 }}
              transition={{ duration:0.12 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-20"
            >
              <div className="bg-black/70 backdrop-blur-md border border-yellow-700/35 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${hoveredCabinet?'bg-yellow-400':hoveredPainting?'bg-blue-400':'bg-emerald-400'}`} />
                <span className="text-[11px] font-semibold text-white/90">
                  {hoveredCabinet?.name ?? hoveredPainting?.title ?? portalLabel[hoveredId] ?? ''}
                </span>
                <span className="text-[9px] text-white/35 font-mono">
                  {hoveredCabinet ? '● click' : hoveredPainting ? '● tranh' : '● mở'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ ADMIN LOGIN MODAL ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              transition={{ type:'spring', stiffness:350, damping:28 }}
              className="bg-[#0d1122] border border-yellow-800/50 rounded-2xl w-80 p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-extrabold text-white">Xác thực Quản trị viên</h3>
              </div>
              <p className="text-[10px] text-gray-400 mb-4">Nhập mật khẩu để truy cập tính năng quản lý nội dung.</p>
              <input
                type="password"
                value={adminInput}
                onChange={e => { setAdminInput(e.target.value); setAdminError(false); }}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Mật khẩu admin..."
                autoFocus
                className={`w-full bg-white/5 border rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none mb-3 duration-200 ${
                  adminError ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-yellow-600/60'
                }`}
              />
              {adminError && <p className="text-[10px] text-red-400 mb-3">Mật khẩu không đúng. Thử lại.</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAdminModal(false); setAdminInput(''); setAdminError(false); }}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold hover:bg-white/10 cursor-pointer duration-150"
                >Hủy</button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white text-[11px] font-extrabold cursor-pointer duration-150 shadow"
                >Đăng nhập</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ CABINET DETAIL MODAL ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedCabinet && (() => {
          const cab = cabinets.find(c=>c.id===selectedCabinet.id) ?? selectedCabinet;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
              <motion.div
                initial={{ scale:0.94, opacity:0, y:14 }}
                animate={{ scale:1, opacity:1, y:0 }}
                exit={{ scale:0.94, opacity:0, y:14 }}
                transition={{ type:'spring', stiffness:300, damping:28 }}
                className="bg-[#0e1220] border border-yellow-800/35 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-6"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0a0e1a] to-[#111828] px-5 py-4 border-b border-yellow-800/20 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-yellow-600/80 uppercase tracking-widest">{cab.category}</span>
                    <h2 className="text-base font-extrabold text-yellow-100 mt-0.5">{cab.name}</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{cab.year} · {cab.source}</p>
                  </div>
                  <button onClick={() => { setSelectedCabinet(null); setScanLayer('optical'); }}
                    className="text-gray-500 hover:text-white p-1.5 hover:bg-white/8 rounded-lg duration-150 cursor-pointer shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Image viewer */}
                  <div className={`relative rounded-xl overflow-hidden bg-black h-52 mb-3 ${isAdmin ? 'group' : ''}`}>
                    {isScanning && (
                      <motion.div
                        initial={{top:'0%'}} animate={{top:'100%'}}
                        transition={{duration:1.2, ease:'linear', repeat:Infinity}}
                        className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] z-20 pointer-events-none"
                      />
                    )}
                    {scanLayer==='optical' && <img src={cab.image} alt={cab.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    {scanLayer==='infra' && (
                      <div className="w-full h-full relative">
                        <img src={cab.image} alt="" className="w-full h-full object-cover filter saturate-[2.2] hue-rotate-[140deg] contrast-[1.5]" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-red-900/35 mix-blend-color" />
                      </div>
                    )}
                    {scanLayer==='xray' && (
                      <div className="w-full h-full relative">
                        <img src={cab.image} alt="" className="w-full h-full object-cover filter invert-[0.88] grayscale contrast-[2.4]" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-indigo-900/45 mix-blend-screen" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-cyan-300/70 bg-black/60 px-2 py-0.5 rounded uppercase tracking-wider z-10">{scanLayer}</div>

                    {/* Admin-only upload overlay */}
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 z-10">
                        <button onClick={() => handleCabUpload(cab.id)}
                          className="flex items-center gap-1.5 bg-yellow-500/90 hover:bg-yellow-400 text-black font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer duration-150 shadow-lg">
                          <Upload className="w-3.5 h-3.5" /> Thay ảnh
                        </button>
                        {cab.image !== cab.defaultImage && (
                          <button onClick={() => resetCabImage(cab.id)}
                            className="flex items-center gap-1.5 bg-red-800/90 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer duration-150 shadow-lg">
                            <Trash2 className="w-3.5 h-3.5" /> Khôi phục
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Scan buttons */}
                  <div className="flex gap-2 mb-4">
                    {([{id:'optical',label:'Thực',icon:Eye},{id:'infra',label:'Nhiệt',icon:Sun},{id:'xray',label:'X-Ray',icon:Sparkles}] as const).map(({id,label,icon:Icon})=>(
                      <button key={id} onClick={()=>runScan(id)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 duration-200 cursor-pointer border ${
                          scanLayer===id ? 'bg-yellow-700/60 text-yellow-200 border-yellow-600/50 shadow' : 'bg-white/4 text-gray-400 border-white/8 hover:border-yellow-700/40 hover:text-yellow-300'
                        }`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{cab.description}</p>
                  <ul className="space-y-1 mb-4">
                    {cab.details.map((d,i)=>(
                      <li key={i} className="flex items-start gap-2 text-[10px] text-gray-500">
                        <span className="text-yellow-700 mt-0.5 shrink-0">•</span>{d}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-white/3 rounded-xl p-3 mb-4 border border-yellow-900/25">
                    <p className="text-[10px] text-yellow-200/60 leading-relaxed italic">
                      {scanLayer==='optical' && 'Hiện vật mô phỏng chân xác 100%, được kiểm định bởi Hội đồng Giám định Cổ vật quốc gia.'}
                      {scanLayer==='infra' && cab.infraNote}
                      {scanLayer==='xray'  && cab.xrayNote}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={()=>{ const u={...tributeCounts,[cab.id]:(tributeCounts[cab.id]||0)+1}; saveTribute(u); setActiveTributeId(cab.id); setTimeout(()=>setActiveTributeId(null),1100); }}
                      className="flex-1 py-2 rounded-xl bg-red-950/50 border border-red-800/35 hover:bg-red-900/60 hover:border-red-700/50 text-red-400 font-bold text-[11px] flex items-center justify-center gap-1.5 duration-200 cursor-pointer"
                    ><Heart className={`w-3.5 h-3.5 ${activeTributeId===cab.id?'fill-red-500':''}`} /> Tri ân ({tributeCounts[cab.id]||0})</button>
                    <button
                      onClick={()=>{ setSelectedCabinet(null); setScanLayer('optical'); }}
                      className="flex-1 py-2 rounded-xl bg-yellow-700/30 hover:bg-yellow-700/50 border border-yellow-700/30 text-yellow-300 font-extrabold text-[11px] duration-200 cursor-pointer"
                    >Đóng</button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ═══ PAINTING DETAIL MODAL ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPainting && (() => {
          const paint = selectedPainting;
          const imageUrl = paintingImages[paint.id] || paint.defaultImage;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
              <motion.div
                initial={{ scale:0.94, opacity:0, y:14 }}
                animate={{ scale:1, opacity:1, y:0 }}
                exit={{ scale:0.94, opacity:0, y:14 }}
                transition={{ type:'spring', stiffness:300, damping:28 }}
                className="bg-[#0e1220]/95 border border-yellow-800/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0a0e1a] to-[#111828] px-5 py-4 border-b border-yellow-800/20 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono text-yellow-600/80 uppercase tracking-widest">Tranh tư liệu lịch sử</span>
                    <h2 className="text-base font-extrabold text-yellow-100 mt-0.5">{paint.title}</h2>
                  </div>
                  <button onClick={() => setSelectedPainting(null)}
                    className="text-gray-500 hover:text-white p-1.5 hover:bg-white/8 rounded-lg duration-150 cursor-pointer shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-4">
                  {/* Full Size Image */}
                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center max-h-[60vh] min-h-[250px]">
                    <img 
                      src={imageUrl} 
                      alt={paint.title} 
                      className="w-full h-auto object-contain max-h-[55vh] rounded-lg shadow-lg" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>

                  {/* Description Box */}
                  <div className="bg-white/[0.02] border border-yellow-900/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-yellow-400 mb-1.5">Chú thích lịch sử:</h4>
                    <p className="text-[12px] text-gray-300 leading-relaxed font-sans">
                      {paint.description}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 mt-1">
                    {isAdmin && (
                      <button onClick={() => { handleWallUpload(paint.id); setSelectedPainting(null); }}
                        className="px-4 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 hover:bg-yellow-500/25 text-yellow-400 font-bold text-[11px] duration-150 cursor-pointer"
                      >
                        Thay thế ảnh mới (Admin)
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPainting(null)}
                      className="px-6 py-2 rounded-xl bg-yellow-700/30 hover:bg-yellow-700/50 border border-yellow-700/30 text-yellow-300 font-extrabold text-[11px] duration-150 cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
