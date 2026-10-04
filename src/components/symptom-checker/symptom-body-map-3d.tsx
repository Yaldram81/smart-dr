'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import {
  RotateCcw, Eye, Sparkles, HeartPulse, Brain,
  Activity, Layers, Info, Check, Shield
} from 'lucide-react'

export interface OrganDefinition {
  id: string
  name: string
  nameUrdu: string
  category: string
  categories: string[]
  color: number
  emissiveColor: number
  description: string
  descriptionUrdu: string
}

export const ANATOMICAL_ORGANS: Record<string, OrganDefinition> = {
  brain: {
    id: 'brain',
    name: 'Brain & Head',
    nameUrdu: 'دماغ اور سر',
    category: 'Neurological',
    categories: ['Neurological', 'ENT', 'General'],
    color: 0xf43f5e,
    emissiveColor: 0x9f1239,
    description: 'Central nervous system, migraines, dizziness, cognitive and sensory symptoms.',
    descriptionUrdu: 'اعصابی نظام، سر درد، چکر، اور حسی علامات۔',
  },
  eyes: {
    id: 'eyes',
    name: 'Eyes & Vision',
    nameUrdu: 'آنکھیں اور بصارت',
    category: 'Eyes',
    categories: ['Eyes', 'Neurological'],
    color: 0x06b6d4,
    emissiveColor: 0x0891b2,
    description: 'Visual acuity, photophobia, eye pain, redness, and cataracts.',
    descriptionUrdu: 'بصارت کی کمزوری، آنکھوں میں درد، دھندلا پن اور سرخی۔',
  },
  throat: {
    id: 'throat',
    name: 'Throat & Thyroid',
    nameUrdu: 'گلا اور تھائرائڈ',
    category: 'Throat',
    categories: ['Throat', 'ENT', 'Endocrine'],
    color: 0x8b5cf6,
    emissiveColor: 0x6d28d9,
    description: 'Sore throat, difficulty swallowing, tonsils, vocal cords, and thyroid gland.',
    descriptionUrdu: 'گلے میں خراش، نگلنے میں دشواری، ٹانسلز اور تھائرائڈ غدود۔',
  },
  heart: {
    id: 'heart',
    name: 'Heart & Circulatory',
    nameUrdu: 'دل اور خون کی گردش',
    category: 'Cardiovascular',
    categories: ['Cardiovascular'],
    color: 0xef4444,
    emissiveColor: 0xb91c1c,
    description: 'Cardiovascular pump, palpitations, angina, chest tightness, and blood pressure.',
    descriptionUrdu: 'دل کی دھڑکن، سینے میں درد اور دباؤ، بلڈ پریشر۔',
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs & Respiratory',
    nameUrdu: 'پھیپھڑے اور نظامِ تنفس',
    category: 'Respiratory',
    categories: ['Respiratory'],
    color: 0x3b82f6,
    emissiveColor: 0x1d4ed8,
    description: 'Pulmonary gas exchange, shortness of breath, asthma, bronchitis, and cough.',
    descriptionUrdu: 'سانس کی تنگی، کھانسی، دمہ اور پھیپھڑوں کا ورم۔',
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach & Gastrointestinal',
    nameUrdu: 'معدہ اور نظامِ انہضام',
    category: 'Digestive',
    categories: ['Digestive'],
    color: 0xf59e0b,
    emissiveColor: 0xd97706,
    description: 'Gastric acid digestion, GERD, nausea, abdominal ulcers, and bloating.',
    descriptionUrdu: 'سینے اور معدے میں جلن، الٹی، متلی، اور السر۔',
  },
  liver: {
    id: 'liver',
    name: 'Liver & Gallbladder',
    nameUrdu: 'جگر اور پِتّہ',
    category: 'Digestive',
    categories: ['Digestive'],
    color: 0xd97706,
    emissiveColor: 0xb45309,
    description: 'Metabolic detox, bile production, jaundice, and hepatitis symptoms.',
    descriptionUrdu: 'یرقان، جگر کی سوجن، اور نظامِ استحالہ کی خرابیاں۔',
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys & Urinary',
    nameUrdu: 'گردے اور پیشاب کا نظام',
    category: 'Urinary',
    categories: ['Urinary', 'Digestive'],
    color: 0x10b981,
    emissiveColor: 0x047857,
    description: 'Renal filtration, fluid regulation, lower back flank pain, and dysuria.',
    descriptionUrdu: 'گردوں کا درد، فلٹریشن، پیشاب میں جلن اور تکالیف۔',
  },
  spine: {
    id: 'spine',
    name: 'Spine & Musculoskeletal',
    nameUrdu: 'ریڑھ کی ہڈی اور جوڑ',
    category: 'Musculoskeletal',
    categories: ['Musculoskeletal'],
    color: 0xa855f7,
    emissiveColor: 0x7e22ce,
    description: 'Vertebral column, posture, cervical/lumbar back pain, and spinal nerves.',
    descriptionUrdu: 'کمر اور گردن کا درد، جوڑوں کا تناؤ، اور ہڈیوں کی تکلیف۔',
  },
  arms: {
    id: 'arms',
    name: 'Upper Limbs & Hands',
    nameUrdu: 'بازو اور ہاتھ',
    category: 'Musculoskeletal',
    categories: ['Musculoskeletal', 'Skin'],
    color: 0x64748b,
    emissiveColor: 0x475569,
    description: 'Shoulder mobility, elbow/wrist arthritis, numbness, and arm weakness.',
    descriptionUrdu: 'کندھوں اور کہنیوں کا درد، بازوؤں میں کمزوری اور بے حسی۔',
  },
  legs: {
    id: 'legs',
    name: 'Lower Limbs & Mobility',
    nameUrdu: 'ٹانگیں اور گھٹنے',
    category: 'Musculoskeletal',
    categories: ['Musculoskeletal', 'General'],
    color: 0x475569,
    emissiveColor: 0x334155,
    description: 'Femur, knees, calf cramps, edema, joint stiffness, and walking stability.',
    descriptionUrdu: 'گھٹنوں میں درد، پاؤں کی سوجن، جوڑوں کی جکڑن اور اینٹھن۔',
  },
}

interface SymptomBodyMap3DProps {
  activeRegion: string | null
  onSelectCategories: (categories: string[], regionLabel: string) => void
}

export function SymptomBodyMap3D({ activeRegion, onSelectCategories }: SymptomBodyMap3DProps) {
  const { language } = useAppStore()
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(activeRegion || 'heart')
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null)
  const [showOrgans, setShowOrgans] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [showSkin, setShowSkin] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)

  // References for Three.js render loop and event handlers
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshesRef = useRef<Map<string, THREE.Mesh | THREE.Group>>(new Map())
  const heartMeshRef = useRef<THREE.Mesh | null>(null)
  const lungsGroupRef = useRef<THREE.Group | null>(null)
  const bodyGroupRef = useRef<THREE.Group | null>(null)
  const controlsStateRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.1,
    rotY: 0,
    zoom: 4.8,
  })

  // Synchronize internal selection with external activeRegion prop
  useEffect(() => {
    if (activeRegion && ANATOMICAL_ORGANS[activeRegion]) {
      setSelectedOrgan(activeRegion)
    }
  }, [activeRegion])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 2. Camera setup
    const width = container.clientWidth || 400
    const height = container.clientHeight || 420
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 4.8)
    cameraRef.current = camera

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.innerHTML = ''
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.8)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xec4899, 1.2)
    rimLight.position.set(-4, -2, -4)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0x0ea5e9, 1.5, 10)
    fillLight.position.set(0, 0, 3)
    scene.add(fillLight)

    // 5. Build 3D Anatomical Human Model
    const bodyGroup = new THREE.Group()
    bodyGroupRef.current = bodyGroup
    scene.add(bodyGroup)

    const meshMap = new Map<string, THREE.Mesh | THREE.Group>()
    meshesRef.current = meshMap

    // Helper material creators
    const createOrganMaterial = (color: number, emissive: number) => {
      return new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.15,
      })
    }

    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      roughness: 0.15,
      transmission: 0.7,
      thickness: 0.8,
      wireframe: false,
    })

    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.1,
    })

    // --- A. Holographic Skin Silhouette ---
    const skinGroup = new THREE.Group()
    skinGroup.name = 'skin_layer'

    // Head contour
    const headGeom = new THREE.SphereGeometry(0.34, 28, 28)
    headGeom.scale(0.85, 1.15, 0.95)
    const headMesh = new THREE.Mesh(headGeom, skinMaterial)
    headMesh.position.set(0, 1.48, 0)
    skinGroup.add(headMesh)

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.14, 0.17, 0.28, 20)
    const neckMesh = new THREE.Mesh(neckGeom, skinMaterial)
    neckMesh.position.set(0, 1.1, 0)
    skinGroup.add(neckMesh)

    // Torso / Chest & Abdomen
    const torsoGeom = new THREE.CylinderGeometry(0.48, 0.36, 1.1, 28)
    torsoGeom.scale(1.15, 1.0, 0.7)
    const torsoMesh = new THREE.Mesh(torsoGeom, skinMaterial)
    torsoMesh.position.set(0, 0.45, 0)
    skinGroup.add(torsoMesh)

    // Pelvis
    const pelvisGeom = new THREE.CylinderGeometry(0.36, 0.42, 0.35, 24)
    pelvisGeom.scale(1.1, 1.0, 0.75)
    const pelvisMesh = new THREE.Mesh(pelvisGeom, skinMaterial)
    pelvisMesh.position.set(0, -0.22, 0)
    skinGroup.add(pelvisMesh)

    // Arms (Left & Right)
    const createArm = (side: number) => {
      const armGroup = new THREE.Group()
      // Upper arm
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.65, 16), skinMaterial)
      upperArm.position.set(side * 0.68, 0.65, 0)
      upperArm.rotation.z = side * -0.15
      armGroup.add(upperArm)

      // Forearm & Hand
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.6, 16), skinMaterial)
      forearm.position.set(side * 0.76, 0.05, 0)
      armGroup.add(forearm)

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), skinMaterial)
      hand.position.set(side * 0.76, -0.32, 0)
      armGroup.add(hand)

      return armGroup
    }
    const leftArm = createArm(-1)
    const rightArm = createArm(1)
    skinGroup.add(leftArm, rightArm)

    // Legs (Left & Right)
    const createLeg = (side: number) => {
      const legGroup = new THREE.Group()
      // Thigh
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.8, 18), skinMaterial)
      thigh.position.set(side * 0.22, -0.75, 0)
      legGroup.add(thigh)

      // Calf
      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.8, 16), skinMaterial)
      calf.position.set(side * 0.22, -1.5, 0)
      legGroup.add(calf)

      // Foot
      const footGeom = new THREE.BoxGeometry(0.12, 0.08, 0.28)
      const foot = new THREE.Mesh(footGeom, skinMaterial)
      foot.position.set(side * 0.22, -1.92, 0.08)
      legGroup.add(foot)

      return legGroup
    }
    const leftLeg = createLeg(-1)
    const rightLeg = createLeg(1)
    skinGroup.add(leftLeg, rightLeg)

    bodyGroup.add(skinGroup)
    meshMap.set('skin_layer', skinGroup)

    // --- B. Skeletal Layer ---
    const skeletonGroup = new THREE.Group()
    skeletonGroup.name = 'skeleton_layer'

    // Spine (Vertebral column)
    const spineGeom = new THREE.CylinderGeometry(0.04, 0.05, 1.4, 16)
    const spineMesh = new THREE.Mesh(spineGeom, boneMaterial)
    spineMesh.position.set(0, 0.45, -0.08)
    spineMesh.userData = { organId: 'spine' }
    skeletonGroup.add(spineMesh)
    meshMap.set('spine', spineMesh)

    // Ribcage (horizontal rings)
    for (let r = 0; r < 5; r++) {
      const ribGeom = new THREE.TorusGeometry(0.3 - r * 0.015, 0.02, 8, 24, Math.PI * 1.6)
      const ribMesh = new THREE.Mesh(ribGeom, boneMaterial)
      ribMesh.rotation.x = Math.PI / 2
      ribMesh.rotation.z = Math.PI * 0.2
      ribMesh.position.set(0, 0.85 - r * 0.1, 0)
      skeletonGroup.add(ribMesh)
    }

    bodyGroup.add(skeletonGroup)
    meshMap.set('skeleton_layer', skeletonGroup)

    // --- C. Internal Visceral Organs ---
    const organsGroup = new THREE.Group()
    organsGroup.name = 'organs_layer'

    // 1. Brain (Cerebrum)
    const brainGeom = new THREE.SphereGeometry(0.24, 20, 20)
    brainGeom.scale(0.9, 0.8, 1.1)
    const brainMat = createOrganMaterial(ANATOMICAL_ORGANS.brain.color, ANATOMICAL_ORGANS.brain.emissiveColor)
    const brainMesh = new THREE.Mesh(brainGeom, brainMat)
    brainMesh.position.set(0, 1.54, 0.02)
    brainMesh.userData = { organId: 'brain' }
    organsGroup.add(brainMesh)
    meshMap.set('brain', brainMesh)

    // 2. Eyes
    const eyeGeom = new THREE.SphereGeometry(0.045, 16, 16)
    const eyeMat = createOrganMaterial(ANATOMICAL_ORGANS.eyes.color, ANATOMICAL_ORGANS.eyes.emissiveColor)
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat)
    leftEye.position.set(-0.11, 1.5, 0.28)
    leftEye.userData = { organId: 'eyes' }
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat)
    rightEye.position.set(0.11, 1.5, 0.28)
    rightEye.userData = { organId: 'eyes' }
    organsGroup.add(leftEye, rightEye)
    meshMap.set('eyes', leftEye)

    // 3. Throat / Thyroid
    const throatGeom = new THREE.TorusGeometry(0.08, 0.03, 10, 18, Math.PI)
    const throatMat = createOrganMaterial(ANATOMICAL_ORGANS.throat.color, ANATOMICAL_ORGANS.throat.emissiveColor)
    const throatMesh = new THREE.Mesh(throatGeom, throatMat)
    throatMesh.rotation.x = Math.PI / 2
    throatMesh.position.set(0, 1.1, 0.08)
    throatMesh.userData = { organId: 'throat' }
    organsGroup.add(throatMesh)
    meshMap.set('throat', throatMesh)

    // 4. Heart
    const heartGeom = new THREE.DodecahedronGeometry(0.14, 2)
    heartGeom.scale(0.9, 1.1, 0.9)
    const heartMat = createOrganMaterial(ANATOMICAL_ORGANS.heart.color, ANATOMICAL_ORGANS.heart.emissiveColor)
    const heartMesh = new THREE.Mesh(heartGeom, heartMat)
    heartMesh.position.set(-0.06, 0.68, 0.06)
    heartMesh.userData = { organId: 'heart' }
    organsGroup.add(heartMesh)
    heartMeshRef.current = heartMesh
    meshMap.set('heart', heartMesh)

    // 5. Lungs (Left and Right Lobes)
    const lungsGroup = new THREE.Group()
    lungsGroup.userData = { organId: 'lungs' }
    const lungGeom = new THREE.CapsuleGeometry(0.11, 0.32, 12, 16)
    const lungMat = createOrganMaterial(ANATOMICAL_ORGANS.lungs.color, ANATOMICAL_ORGANS.lungs.emissiveColor)

    const leftLung = new THREE.Mesh(lungGeom, lungMat)
    leftLung.position.set(-0.2, 0.68, 0.02)
    leftLung.rotation.z = 0.12
    leftLung.userData = { organId: 'lungs' }

    const rightLung = new THREE.Mesh(lungGeom, lungMat)
    rightLung.position.set(0.2, 0.68, 0.02)
    rightLung.rotation.z = -0.12
    rightLung.userData = { organId: 'lungs' }

    lungsGroup.add(leftLung, rightLung)
    organsGroup.add(lungsGroup)
    lungsGroupRef.current = lungsGroup
    meshMap.set('lungs', lungsGroup)

    // 6. Stomach
    const stomachGeom = new THREE.SphereGeometry(0.14, 16, 16)
    stomachGeom.scale(1.2, 0.8, 0.9)
    const stomachMat = createOrganMaterial(ANATOMICAL_ORGANS.stomach.color, ANATOMICAL_ORGANS.stomach.emissiveColor)
    const stomachMesh = new THREE.Mesh(stomachGeom, stomachMat)
    stomachMesh.position.set(0.08, 0.32, 0.08)
    stomachMesh.rotation.z = 0.2
    stomachMesh.userData = { organId: 'stomach' }
    organsGroup.add(stomachMesh)
    meshMap.set('stomach', stomachMesh)

    // 7. Liver
    const liverGeom = new THREE.BoxGeometry(0.26, 0.16, 0.16)
    const liverMat = createOrganMaterial(ANATOMICAL_ORGANS.liver.color, ANATOMICAL_ORGANS.liver.emissiveColor)
    const liverMesh = new THREE.Mesh(liverGeom, liverMat)
    liverMesh.position.set(-0.12, 0.36, 0.07)
    liverMesh.rotation.z = -0.1
    liverMesh.userData = { organId: 'liver' }
    organsGroup.add(liverMesh)
    meshMap.set('liver', liverMesh)

    // 8. Kidneys (Bilateral)
    const kidneyGeom = new THREE.CapsuleGeometry(0.05, 0.1, 10, 14)
    const kidneyMat = createOrganMaterial(ANATOMICAL_ORGANS.kidneys.color, ANATOMICAL_ORGANS.kidneys.emissiveColor)

    const leftKidney = new THREE.Mesh(kidneyGeom, kidneyMat)
    leftKidney.position.set(-0.16, 0.15, -0.06)
    leftKidney.userData = { organId: 'kidneys' }

    const rightKidney = new THREE.Mesh(kidneyGeom, kidneyMat)
    rightKidney.position.set(0.16, 0.15, -0.06)
    rightKidney.userData = { organId: 'kidneys' }

    organsGroup.add(leftKidney, rightKidney)
    meshMap.set('kidneys', leftKidney)

    // Link Arms and Legs to raycast mesh references
    leftArm.userData = { organId: 'arms' }
    rightArm.userData = { organId: 'arms' }
    meshMap.set('arms', leftArm)

    leftLeg.userData = { organId: 'legs' }
    rightLeg.userData = { organId: 'legs' }
    meshMap.set('legs', leftLeg)

    bodyGroup.add(organsGroup)
    meshMap.set('organs_layer', organsGroup)

    // Position entire mannequin vertically centered
    bodyGroup.position.set(0, -0.1, 0)

    // 6. Interactive Raycasting & Mouse Controls
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (e: MouseEvent) => {
      controlsStateRef.current.isDragging = true
      controlsStateRef.current.prevX = e.clientX
      controlsStateRef.current.prevY = e.clientY
    }

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (controlsStateRef.current.isDragging) {
        setAutoRotate(false)
        const deltaX = e.clientX - controlsStateRef.current.prevX
        const deltaY = e.clientY - controlsStateRef.current.prevY
        controlsStateRef.current.rotY += deltaX * 0.008
        controlsStateRef.current.rotX = Math.max(-0.4, Math.min(0.5, controlsStateRef.current.rotX + deltaY * 0.008))
        controlsStateRef.current.prevX = e.clientX
        controlsStateRef.current.prevY = e.clientY
      } else {
        // Hover raycast detection
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(bodyGroup.children, true)
        let foundOrgan: string | null = null

        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object
          while (curr && curr !== bodyGroup) {
            if (curr.userData?.organId) {
              foundOrgan = curr.userData.organId
              break
            }
            curr = curr.parent
          }
          if (foundOrgan) break
        }

        setHoveredOrgan(foundOrgan)
        container.style.cursor = foundOrgan ? 'pointer' : 'grab'
      }
    }

    const onPointerUp = (e: MouseEvent) => {
      if (controlsStateRef.current.isDragging) {
        controlsStateRef.current.isDragging = false
        return
      }
    }

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(bodyGroup.children, true)
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object
        while (curr && curr !== bodyGroup) {
          if (curr.userData?.organId) {
            const organId = curr.userData.organId
            const organ = ANATOMICAL_ORGANS[organId]
            if (organ) {
              setSelectedOrgan(organId)
              onSelectCategories(organ.categories, organ.name)
              return
            }
          }
          curr = curr.parent
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      controlsStateRef.current.zoom = Math.max(2.8, Math.min(6.5, controlsStateRef.current.zoom + e.deltaY * 0.003))
      camera.position.z = controlsStateRef.current.zoom
    }

    // Touch support for mobile devices
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setAutoRotate(false)
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX
        const deltaY = e.touches[0].clientY - touchStartY
        controlsStateRef.current.rotY += deltaX * 0.008
        controlsStateRef.current.rotX = Math.max(-0.4, Math.min(0.5, controlsStateRef.current.rotX + deltaY * 0.008))
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    dom.addEventListener('click', onClick)
    dom.addEventListener('wheel', onWheel, { passive: false })
    dom.addEventListener('touchstart', onTouchStart)
    dom.addEventListener('touchmove', onTouchMove)

    // 7. Animation Loop with Real-time Cardiac & Pulmonary Kinetics
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Idle Rotation
      if (autoRotate && !controlsStateRef.current.isDragging) {
        controlsStateRef.current.rotY += 0.004
      }

      // Smooth interpolation of rotation
      bodyGroup.rotation.y = controlsStateRef.current.rotY
      bodyGroup.rotation.x = controlsStateRef.current.rotX

      // Physiological Heartbeat Animation (72 BPM rhythm)
      if (heartMeshRef.current) {
        const beat = 1.0 + Math.sin(elapsedTime * 6.5) * 0.08 * (Math.sin(elapsedTime * 6.5) > 0 ? 1 : 0.2)
        heartMeshRef.current.scale.set(beat, beat, beat)
      }

      // Physiological Pulmonary Respiration (16 breaths/min expansion)
      if (lungsGroupRef.current) {
        const breath = 1.0 + Math.sin(elapsedTime * 2.2) * 0.04
        lungsGroupRef.current.scale.set(breath, breath, breath)
      }

      // Floating gentle hover
      bodyGroup.position.y = -0.1 + Math.sin(elapsedTime * 1.5) * 0.03

      renderer.render(scene, camera)
    }
    animate()

    // Resize observer
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 400
      const h = container.clientHeight || 420
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      dom.removeEventListener('click', onClick)
      dom.removeEventListener('wheel', onWheel)
      dom.removeEventListener('touchstart', onTouchStart)
      dom.removeEventListener('touchmove', onTouchMove)
      renderer.dispose()
      if (container) container.innerHTML = ''
    }
  }, [autoRotate])

  // Synchronize Layer Toggles
  useEffect(() => {
    const skinLayer = meshesRef.current.get('skin_layer')
    const skeletonLayer = meshesRef.current.get('skeleton_layer')
    const organsLayer = meshesRef.current.get('organs_layer')

    if (skinLayer) skinLayer.visible = showSkin
    if (skeletonLayer) skeletonLayer.visible = showSkeleton
    if (organsLayer) organsLayer.visible = showOrgans
  }, [showSkin, showSkeleton, showOrgans])

  // Reset Camera View
  const handleResetCamera = () => {
    controlsStateRef.current.rotX = 0.1
    controlsStateRef.current.rotY = 0
    controlsStateRef.current.zoom = 4.8
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.2, 4.8)
    }
    setAutoRotate(true)
  }

  // Active Organ Information Card
  const activeOrganData = selectedOrgan ? ANATOMICAL_ORGANS[selectedOrgan] : null
  const hoveredOrganData = hoveredOrgan ? ANATOMICAL_ORGANS[hoveredOrgan] : null

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 3D Canvas Box */}
      <div className="relative w-full h-[400px] md:h-[460px] rounded-2xl overflow-hidden border border-border/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl flex flex-col items-center justify-center">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Top HUD: Selected Anatomical Region Indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto">
            <Activity className="size-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-100">
              {hoveredOrganData
                ? (language === 'ur' ? `${hoveredOrganData.nameUrdu} (${hoveredOrganData.name})` : hoveredOrganData.name)
                : activeOrganData
                ? (language === 'ur' ? `${activeOrganData.nameUrdu} (${activeOrganData.name})` : activeOrganData.name)
                : (language === 'ur' ? 'گھمائیں اور کسی بھی عضو پر کلک کریں' : 'Rotate & Click Any Organ')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetCamera}
              className="size-8 rounded-lg bg-slate-900/80 border-slate-700 hover:bg-slate-800 text-slate-200"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* WebGL Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Bottom Floating Anatomy Layer Switches */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 flex-wrap pointer-events-none">
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 backdrop-blur-md p-1 rounded-xl shadow-lg pointer-events-auto">
            <button
              onClick={() => setShowOrgans(!showOrgans)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                showOrgans ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartPulse className="size-3.5 text-rose-400" />
              <span>Organs</span>
            </button>
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                showSkeleton ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="size-3.5 text-indigo-400" />
              <span>Skeletal</span>
            </button>
            <button
              onClick={() => setShowSkin(!showSkin)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                showSkin ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="size-3.5 text-sky-400" />
              <span>Skin Outline</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 px-2.5 py-1 rounded-lg pointer-events-auto">
            {language === 'ur' ? 'گھمانے کے لیے ڈریگ کریں • زوم کے لیے سکرول کریں' : 'Drag to rotate • Scroll to zoom'}
          </div>
        </div>
      </div>

      {/* Selected Organ Diagnostic Card */}
      {activeOrganData && (
        <div className="p-3.5 rounded-xl border bg-muted/30 flex items-start justify-between gap-3 text-xs leading-relaxed animate-in fade-in duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {language === 'ur' ? activeOrganData.nameUrdu : activeOrganData.name}
              </span>
              <Badge variant="secondary" className="text-[10px] py-0 px-2">
                {activeOrganData.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {language === 'ur' ? activeOrganData.descriptionUrdu : activeOrganData.description}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-primary font-medium text-xs">
            <Check className="size-4 text-emerald-500" />
            <span>{language === 'ur' ? 'فلٹر فعال ہے' : 'Filtering Symptoms'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
