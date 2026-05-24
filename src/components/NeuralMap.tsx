import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Brain, Code, X, Play, Zap, CheckCircle2, Circle } from 'lucide-react';
import { PROBLEMS } from '../problems';

interface NeuralMapProps {
  submissions: any[];
  onSelectProblem: (problemId: string) => void;
}

interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  description: string;
}

interface SkillLink {
  source: string;
  target: string;
}

// 🌐 Node positions in a 3D coordinate space (spaced out for deep 3D perspective)
const SKILL_NODES: SkillNode[] = [
  { id: 'array', name: 'Array', x: -100, y: -20, z: -60, baseRadius: 10, description: 'Sequential linear collection. Master index math, cyclic sort, and sub-array logic.' },
  { id: 'string', name: 'String', x: 80, y: 40, z: -40, baseRadius: 10, description: 'Char arrays, parsing, manipulation, anagram matches, and pattern matches.' },
  { id: 'hash-table', name: 'Hash Table', x: 0, y: -90, z: -80, baseRadius: 10, description: 'Key-value mapping. Achieve O(1) average lookups and frequency counting.' },
  { id: 'stack', name: 'Stack', x: -70, y: 90, z: 20, baseRadius: 9, description: 'Last-In-First-Out data flow. Perfect for tracking history, recursion, and match validation.' },
  { id: 'two-pointers', name: 'Two Pointers', x: -160, y: -50, z: 50, baseRadius: 8, description: 'Dual index pointers scanning from opposite boundaries inwards.' },
  { id: 'sliding-window', name: 'Sliding Window', x: -50, y: -160, z: 90, baseRadius: 8, description: 'Sub-array window expansion and contraction to locate optimum subsets.' },
  { id: 'sorting', name: 'Sorting', x: -200, y: 70, z: -90, baseRadius: 8, description: 'Arrange elements. QuickSort, MergeSort, Custom sorting, and interval merging.' },
  { id: 'recursion', name: 'Recursion', x: 90, y: -70, z: 130, baseRadius: 8, description: 'Self-calling functions resolving smaller sub-problems. Foundation of Trees and DFS.' },
  { id: 'dp', name: 'Dynamic Programming', x: 130, y: 130, z: -110, baseRadius: 11, description: 'Memoization & Tabulation. Optimizing recursive relations by reusing overlapping calculations.' },
  { id: 'greedy', name: 'Greedy', x: 50, y: 170, z: 30, baseRadius: 9, description: 'Localized optimal selections at each interval hoping for global equilibrium.' },
  { id: 'trees', name: 'Trees', x: 180, y: -110, z: -50, baseRadius: 9, description: 'Hierarchical node branching. BST operations, traversal algorithms, and DFS/BFS patterns.' },
  { id: 'graphs', name: 'Graphs', x: 240, y: -30, z: 70, baseRadius: 9, description: 'Networks of interconnected nodes. Master shortest path, cycle detection, and union-find.' },
  { id: 'system-design', name: 'System Design', x: 10, y: 240, z: 180, baseRadius: 10, description: 'Scalability, microservices, load balancers, caching strategies, and database replication.' }
];

// 🔗 Connections forming the "neural synaptic pathways"
const SKILL_LINKS: SkillLink[] = [
  { source: 'array', target: 'two-pointers' },
  { source: 'array', target: 'sliding-window' },
  { source: 'array', target: 'sorting' },
  { source: 'array', target: 'hash-table' },
  { source: 'string', target: 'stack' },
  { source: 'string', target: 'hash-table' },
  { source: 'stack', target: 'recursion' },
  { source: 'recursion', target: 'trees' },
  { source: 'trees', target: 'graphs' },
  { source: 'two-pointers', target: 'greedy' },
  { source: 'hash-table', target: 'dp' },
  { source: 'dp', target: 'greedy' },
  { source: 'graphs', target: 'system-design' }
];

// Helper: Convert HEX color strings to RGB format for flexible canvas transparency controls
const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  if (hex.startsWith('rgb')) {
    const m = hex.match(/\d+/g);
    if (m && m.length >= 3) return `${m[0]}, ${m[1]}, ${m[2]}`;
  }
  return '167, 139, 250'; // Fallback
};

// 🌌 Background starfield coordinates (3D static particles)
const createStarfield = (count = 120) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const distance = 250 + Math.random() * 200; // Radial distance from center
    stars.push({
      x: distance * Math.sin(phi) * Math.cos(theta),
      y: distance * Math.sin(phi) * Math.sin(theta),
      z: distance * Math.cos(phi),
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.7
    });
  }
  return stars;
};

export const NeuralMap: React.FC<NeuralMapProps> = ({ submissions, onSelectProblem }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Interactive UI states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.1);

  // Theme Detection State
  const [theme, setTheme] = useState('midnight-purple');

  // Monitor DOM modifications to document theme configurations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'midnight-purple';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    setTheme(document.documentElement.getAttribute('data-theme') || 'midnight-purple');

    return () => observer.disconnect();
  }, []);

  // Retrieve computed CSS variables dynamically
  const themeColors = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        accentPrimary: '#a78bce',
        accentSecondary: '#7e82c9',
        textPrimary: '#fff',
        textMuted: 'rgba(255,255,255,0.4)',
        isLight: false
      };
    }

    const computed = getComputedStyle(document.documentElement);
    const accentPrimary = computed.getPropertyValue('--accent-primary').trim() || '#a78bce';
    const accentSecondary = computed.getPropertyValue('--accent-secondary').trim() || '#7e82c9';
    const textPrimary = computed.getPropertyValue('--text-primary').trim() || '#fff';
    const textMuted = computed.getPropertyValue('--text-muted').trim() || 'rgba(255,255,255,0.4)';
    
    // Light mode detection
    const isLight = document.documentElement.getAttribute('data-theme') === 'light-mode' || theme === 'light-mode';

    return {
      accentPrimary,
      accentSecondary,
      textPrimary,
      textMuted,
      isLight
    };
  }, [theme]);

  // 3D rotation tracking
  const rotationX = useRef<number>(-0.2); // Initial tilt angle
  const rotationY = useRef<number>(0.3);  // Initial spin angle
  const isDragging = useRef<boolean>(false);
  const previousMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const spinVelocity = useRef<{ x: number; y: number }>({ x: 0.001, y: 0.002 }); // Auto-rotation velocity

  // Static background starfield
  const stars = useMemo(() => createStarfield(150), []);

  // Synapse flow particles along active links
  const activeLinkParticles = useRef<{ linkIndex: number; progress: number; speed: number }[]>([]);

  // 📋 Mapping user submissions to skill completion levels
  const skillAnalytics = useMemo(() => {
    const analytics: Record<string, { solved: string[]; total: string[]; solvedCount: number; totalCount: number }> = {};

    SKILL_NODES.forEach(node => {
      // Find all problems in problem list that belong to this tag (case-insensitive checks)
      const related = PROBLEMS.filter(p => 
        p.tags.some(tag => tag.toLowerCase() === node.name.toLowerCase() || 
          (node.id === 'dp' && tag.toLowerCase() === 'dynamic programming') ||
          (node.id === 'hash-table' && tag.toLowerCase() === 'hash table') ||
          (node.id === 'two-pointers' && tag.toLowerCase() === 'two pointers') ||
          (node.id === 'sliding-window' && tag.toLowerCase() === 'sliding window')
        )
      );

      const relatedIds = related.map(p => p.id);
      
      // Get unique successfully solved problem IDs matching these problems
      const solvedIds = Array.from(new Set(
        submissions
          .filter(s => s.status === 'passed' && relatedIds.includes(s.problem_id))
          .map(s => s.problem_id)
      ));

      analytics[node.id] = {
        solved: solvedIds,
        total: relatedIds,
        solvedCount: solvedIds.length,
        totalCount: relatedIds.length
      };
    });

    return analytics;
  }, [submissions]);

  // Selected node details helper
  const selectedNodeInfo = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = SKILL_NODES.find(n => n.id === selectedNodeId);
    if (!node) return null;
    
    const stats = skillAnalytics[node.id];
    
    // Map related problem definitions
    const categoryProblems = PROBLEMS.filter(p => 
      p.tags.some(tag => tag.toLowerCase() === node.name.toLowerCase() || 
        (node.id === 'dp' && tag.toLowerCase() === 'dynamic programming') ||
        (node.id === 'hash-table' && tag.toLowerCase() === 'hash table') ||
        (node.id === 'two-pointers' && tag.toLowerCase() === 'two pointers') ||
        (node.id === 'sliding-window' && tag.toLowerCase() === 'sliding window')
      )
    ).map(p => ({
      ...p,
      solved: stats.solved.includes(p.id)
    }));

    return {
      node,
      stats,
      problems: categoryProblems
    };
  }, [selectedNodeId, skillAnalytics]);

  // Canvas context / draw pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handles layout dimension sizing
    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize synapse signal particle flow tracker
    if (activeLinkParticles.current.length === 0) {
      SKILL_LINKS.forEach((link, idx) => {
        // Only run flows on links that connect active/solved categories
        const sourceActive = skillAnalytics[link.source]?.solvedCount > 0;
        const targetActive = skillAnalytics[link.target]?.solvedCount > 0;
        
        if (sourceActive && targetActive) {
          // Multiple pulses per active connection
          activeLinkParticles.current.push({ linkIndex: idx, progress: 0.0, speed: 0.003 + Math.random() * 0.004 });
          activeLinkParticles.current.push({ linkIndex: idx, progress: 0.5, speed: 0.003 + Math.random() * 0.004 });
        }
      });
    }

    const focalLength = 300;

    // 🎨 Main Render Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply drag momentum physics (friction)
      if (!isDragging.current) {
        rotationY.current += spinVelocity.current.y;
        rotationX.current += spinVelocity.current.x;
        spinVelocity.current.y *= 0.95;
        spinVelocity.current.x *= 0.95;
        // Keep a very tiny idle rotation
        if (Math.abs(spinVelocity.current.y) < 0.0005) spinVelocity.current.y = 0.0005;
        if (Math.abs(spinVelocity.current.x) < 0.0002) spinVelocity.current.x = -0.0002;
      }

      const cosX = Math.cos(rotationX.current);
      const sinX = Math.sin(rotationX.current);
      const cosY = Math.cos(rotationY.current);
      const sinY = Math.sin(rotationY.current);

      // Utility: Transform 3D coordinates into rotated 3D space
      const transform3D = (x: number, y: number, z: number) => {
        // Y-axis spin
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        // X-axis tilt
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        return { x: x1, y: y2, z: z2 };
      };

      // Project 3D rotated point into 2D Screen Space
      const project = (transformed: { x: number; y: number; z: number }) => {
        const scale = (focalLength / (focalLength + transformed.z)) * zoom;
        const scrX = transformed.x * scale + width / 2;
        const scrY = transformed.y * scale + height / 2;
        return { x: scrX, y: scrY, scale };
      };

      // Convert HEX theme primary color to RGB digits
      const rgbAccent = hexToRgb(themeColors.accentPrimary);

      // 1. Draw static background starfield projected in 3D
      stars.forEach(star => {
        const rot = transform3D(star.x, star.y, star.z);
        if (rot.z > -focalLength + 10) { // Clip if too close
          const proj = project(rot);
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, star.size * proj.scale, 0, Math.PI * 2);
          
          // Light mode uses darker violet stars; dark mode uses bright glowing ones
          const starBaseColor = themeColors.isLight ? '122, 98, 176' : '167, 139, 250';
          ctx.fillStyle = `rgba(${starBaseColor}, ${star.alpha * Math.max(0, 1 - rot.z / 400)})`;
          ctx.fill();
        }
      });

      // Transform all skill node coordinates
      const projectedNodes = SKILL_NODES.map(node => {
        const rot = transform3D(node.x, node.y, node.z);
        const proj = project(rot);
        const stats = skillAnalytics[node.id];
        const isActive = (stats?.solvedCount || 0) > 0;
        return {
          id: node.id,
          name: node.name,
          x: proj.x,
          y: proj.y,
          z: rot.z,
          scale: proj.scale,
          radius: node.baseRadius * proj.scale,
          isActive,
          stats
        };
      });

      // 2. Draw connections (Links) with theme-adapted accent color paths
      SKILL_LINKS.forEach(link => {
        const nA = projectedNodes.find(n => n.id === link.source);
        const nB = projectedNodes.find(n => n.id === link.target);

        if (nA && nB) {
          const bothActive = nA.isActive && nB.isActive;
          
          ctx.beginPath();
          ctx.moveTo(nA.x, nA.y);
          ctx.lineTo(nB.x, nB.y);

          // Alpha fade out if pushed far back
          const avgDepth = (nA.z + nB.z) / 2;
          const depthFade = Math.max(0.1, 1 - avgDepth / 300);

          if (bothActive) {
            ctx.strokeStyle = `rgba(${rgbAccent}, ${0.4 * depthFade})`;
            ctx.lineWidth = 1.8 * ((nA.scale + nB.scale) / 2);
          } else {
            ctx.strokeStyle = themeColors.isLight 
              ? `rgba(0, 0, 0, ${0.05 * depthFade})` 
              : `rgba(255, 255, 255, ${0.06 * depthFade})`;
            ctx.lineWidth = 0.8 * ((nA.scale + nB.scale) / 2);
          }
          ctx.stroke();
        }
      });

      // 3. Render active electric impulses flow along links
      activeLinkParticles.current.forEach(p => {
        const link = SKILL_LINKS[p.linkIndex];
        const nA = projectedNodes.find(n => n.id === link.source);
        const nB = projectedNodes.find(n => n.id === link.target);

        if (nA && nB) {
          // Increment path progress index
          p.progress += p.speed;
          if (p.progress > 1.0) p.progress = 0.0;

          const partX = nA.x + (nB.x - nA.x) * p.progress;
          const partY = nA.y + (nB.y - nA.y) * p.progress;
          const avgScale = nA.scale + (nB.scale - nA.scale) * p.progress;

          ctx.beginPath();
          ctx.arc(partX, partY, 2.5 * avgScale, 0, Math.PI * 2);
          
          // Glowing synaptic fire dot
          ctx.shadowBlur = 10;
          ctx.shadowColor = themeColors.accentPrimary;
          ctx.fillStyle = themeColors.isLight ? themeColors.accentPrimary : '#fff';
          ctx.fill();
          
          // Reset shadow config
          ctx.shadowBlur = 0;
        }
      });

      // 4. Sort nodes by depth (z-index) to paint back nodes first (visual depth correctness)
      const sortedNodes = [...projectedNodes].sort((a, b) => b.z - a.z);

      sortedNodes.forEach(node => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const pulse = Math.sin(Date.now() / 250) * 3;

        // Custom glow overlay for active or selected nodes (color dynamically links to accent)
        if (node.isActive || isSelected) {
          ctx.shadowBlur = (isSelected ? 25 : isHovered ? 20 : 12) + Math.abs(pulse);
          ctx.shadowColor = themeColors.accentPrimary;
        }

        // Draw radial base core gradient
        const radGrad = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * (isSelected ? 1.25 : 1)
        );

        const progressPercent = node.stats.totalCount > 0 ? (node.stats.solvedCount / node.stats.totalCount) : 0;

        if (node.isActive) {
          if (progressPercent === 1) {
            // Mastered: Golden/Pink or secondary theme gradient
            radGrad.addColorStop(0, themeColors.isLight ? themeColors.accentPrimary : '#f472b6'); 
            radGrad.addColorStop(0.7, themeColors.accentSecondary);
            radGrad.addColorStop(1, `rgba(${rgbAccent}, 0.1)`);
          } else {
            // Solved partially: Accent gradient
            radGrad.addColorStop(0, themeColors.accentPrimary);
            radGrad.addColorStop(0.7, themeColors.accentSecondary);
            radGrad.addColorStop(1, `rgba(${rgbAccent}, 0.05)`);
          }
        } else {
          // Dormant locked states
          if (themeColors.isLight) {
            radGrad.addColorStop(0, '#e2e8f0');
            radGrad.addColorStop(0.7, '#f1f5f9');
            radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.01)');
          } else {
            radGrad.addColorStop(0, '#1e293b');
            radGrad.addColorStop(0.7, '#0f172a');
            radGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isSelected ? 1.15 : 1), 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Stroke ring boundaries
        ctx.shadowBlur = 0; // Clear shadow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isSelected ? 1.15 : 1), 0, Math.PI * 2);
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 1;
        
        ctx.strokeStyle = isSelected 
          ? themeColors.accentPrimary 
          : isHovered 
            ? themeColors.textPrimary 
            : node.isActive 
              ? `rgba(${rgbAccent}, 0.35)` 
              : themeColors.isLight 
                ? 'rgba(0, 0, 0, 0.1)' 
                : 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // 5. Pulsing orbit ring for active nodes
        if (node.isActive) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * (1.4 + Math.sin(Date.now() / 400 + node.radius) * 0.15), 0, Math.PI * 2);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(${rgbAccent}, ${0.15 + Math.sin(Date.now() / 400 + node.radius) * 0.08})`;
          ctx.stroke();
        }

        // 6. Responsive Typography Labels
        const textDepthOpacity = Math.max(0.2, 1 - node.z / 350);
        ctx.globalAlpha = textDepthOpacity;
        ctx.fillStyle = isSelected 
          ? themeColors.accentPrimary 
          : isHovered 
            ? themeColors.textPrimary 
            : node.isActive 
              ? themeColors.textPrimary 
              : themeColors.textMuted;

        const labelFontSize = Math.max(8, Math.min(13, 11 * node.scale));
        ctx.font = `${isSelected || isHovered ? 'bold' : 'normal'} ${labelFontSize}px 'Outfit', 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 15);

        // Render mini completion progress text (e.g. 2/5) on hover or selection
        if ((isSelected || isHovered) && node.stats.totalCount > 0) {
          ctx.font = `600 ${labelFontSize - 2.5}px monospace`;
          ctx.fillStyle = node.isActive ? themeColors.accentPrimary : themeColors.textMuted;
          ctx.fillText(`${node.stats.solvedCount}/${node.stats.totalCount} Solved`, node.x, node.y + node.radius + 27);
        }
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedNodeId, hoveredNodeId, zoom, stars, skillAnalytics, themeColors]);

  // 🖱️ Rotation controls: Mouse down dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging.current) {
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;

      rotationY.current += deltaX * 0.006;
      rotationX.current += deltaY * 0.006;

      // Keep rotation values bounded
      rotationX.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotationX.current));

      spinVelocity.current = { x: deltaY * 0.0015, y: deltaX * 0.0015 };
      previousMouse.current = { x: e.clientX, y: e.clientY };
    } else {
      // 🛠️ Hover Collision check
      let hitNodeId: string | null = null;
      
      const cosX = Math.cos(rotationX.current);
      const sinX = Math.sin(rotationX.current);
      const cosY = Math.cos(rotationY.current);
      const sinY = Math.sin(rotationY.current);
      const focalLength = 300;

      // Re-project nodes on the fly to detect exact collision
      for (const node of SKILL_NODES) {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        const scale = (focalLength / (focalLength + z2)) * zoom;
        const scrX = x1 * scale + rect.width / 2;
        const scrY = y2 * scale + rect.height / 2;
        const radius = node.baseRadius * scale;

        const dx = x - scrX;
        const dy = y - scrY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius + 12) { // 12px margin padding
          hitNodeId = node.id;
          break;
        }
      }
      setHoveredNodeId(hitNodeId);
      canvas.style.cursor = hitNodeId ? 'pointer' : 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = () => {
    if (hoveredNodeId) {
      setSelectedNodeId(hoveredNodeId);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom control scaling bounded
    setZoom(prev => Math.max(0.6, Math.min(2.5, prev - e.deltaY * 0.0008)));
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMouse.current.x;
      const deltaY = e.touches[0].clientY - previousMouse.current.y;
      rotationY.current += deltaX * 0.008;
      rotationX.current += deltaY * 0.008;
      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  return (
    <div className="neural-map-wrapper" style={{ 
      display: 'flex', 
      position: 'relative', 
      width: '100%', 
      height: 'calc(100vh - 160px)', 
      minHeight: '500px', 
      background: 'radial-gradient(circle at 50% 50%, var(--bg-panel-solid) 0%, var(--bg-dark) 100%)', 
      borderRadius: '24px', 
      border: '1px solid var(--border-color)', 
      overflow: 'hidden', 
      userSelect: 'none' 
    }}>
      
      <style>{`
        .neural-map-wrapper {
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.4), 0 10px 40px rgba(0,0,0,0.15);
        }
        .hud-overlay {
          pointer-events: none;
          animation: fadeHud 0.6s ease-out;
        }
        .canvas-container:active {
          cursor: grabbing !important;
        }
        @keyframes fadeHud {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hidden::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-hidden::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .scrollbar-hidden::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 99px;
        }
        .scrollbar-hidden::-webkit-scrollbar-thumb:hover {
          background: var(--accent-primary);
        }
      `}</style>

      {/* 🚀 Interactive Canvas Container */}
      <div 
        ref={containerRef} 
        className="canvas-container"
        style={{ flex: 1, height: '100%', position: 'relative' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ display: 'block', outline: 'none' }}
        />

        {/* 🗺️ Floating Tech HUD Labels */}
        <div className="hud-overlay" style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={18} className="text-gradient" style={{ filter: 'drop-shadow(0 0 8px var(--border-highlight))' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Neural Skill Galaxy</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Drag to Orbit &bull; Scroll to Zoom &bull; Click Node to Expand Synapse
          </span>
        </div>

        {/* Zoom Level Indicator */}
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', padding: '4px 10px', borderRadius: '8px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          Zoom: {Math.round(zoom * 100)}%
        </div>

        {/* Global Progress HUD */}
        <div style={{ 
          position: 'absolute', 
          top: '24px', 
          right: selectedNodeId ? 'calc(350px + 24px)' : '24px', 
          padding: '10px 16px', 
          borderRadius: '16px', 
          background: 'var(--bg-panel)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          transition: 'right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          color: 'var(--text-primary)' 
        }}>
          <Zap size={14} color="#f59e0b" style={{ animation: 'pulse 1.8s infinite' }} />
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Mastery Coverage</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              {SKILL_NODES.filter(n => (skillAnalytics[n.id]?.solvedCount || 0) > 0).length}
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {SKILL_NODES.length} Nodes Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 Glassmorphism Sidebar (Skill Detail & Problems Panel) */}
      <div style={{
        width: selectedNodeId ? '350px' : '0px',
        opacity: selectedNodeId ? 1 : 0,
        height: '100%',
        background: 'var(--bg-panel)',
        backdropFilter: 'blur(20px)',
        borderLeft: selectedNodeId ? '1px solid var(--border-color)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        transition: 'width 0.35s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.25s ease-in-out',
        overflow: 'hidden',
        color: 'var(--text-primary)'
      }}>
        {selectedNodeInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '350px', padding: '24px' }}>
            
            {/* Sidebar Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: selectedNodeInfo.stats.solvedCount > 0 ? 'var(--accent-primary)' : 'var(--text-muted)'
                }}>
                  {selectedNodeInfo.stats.solvedCount === selectedNodeInfo.stats.totalCount && selectedNodeInfo.stats.totalCount > 0 ? '✨ MASTERY COMPLETED' : selectedNodeInfo.stats.solvedCount > 0 ? '⚡ ACTIVE SYNAPSE' : '🔒 DORMANT NODE'}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedNodeInfo.node.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                style={{ background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={15} />
              </button>
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 20px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {selectedNodeInfo.node.description}
            </p>

            {/* Completion stats metrics */}
            <div style={{ padding: '16px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-color)', borderRadius: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Solved Progress</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                  {selectedNodeInfo.stats.solvedCount} / {selectedNodeInfo.stats.totalCount}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '5px', width: '100%', background: 'var(--bg-panel-light)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${selectedNodeInfo.stats.totalCount > 0 ? (selectedNodeInfo.stats.solvedCount / selectedNodeInfo.stats.totalCount) * 100 : 0}%`,
                  background: 'var(--accent-gradient)',
                  borderRadius: '99px',
                  boxShadow: '0 0 8px var(--border-highlight)',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>

            {/* Mapped Problems List */}
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={14} /> Practice Target Tracks
            </h3>

            <div className="scrollbar-hidden" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '2px' }}>
              {selectedNodeInfo.problems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  No coding problems are mapped to this node yet.
                </div>
              ) : (
                selectedNodeInfo.problems.map(problem => (
                  <div 
                    key={problem.id}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'var(--bg-panel-light)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.25s'
                    }}
                  >
                    {problem.solved ? (
                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.5 }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {problem.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: problem.difficulty === 'Easy' ? '#10B981' : problem.difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
                        }}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProblem(problem.id)}
                      style={{
                        background: 'var(--bg-panel-light)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-primary)',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-panel)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-panel-light)'; }}
                      title="Launch Practice Space"
                    >
                      <Play size={12} fill="currentColor" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
