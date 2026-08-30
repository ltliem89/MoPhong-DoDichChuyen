import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LabTab, LayerVisibility, ScenePreset, Waypoint } from './types/physics';
import { SCENE_PRESETS } from './data/presets';
import { PhysicsEngine } from './physics/physicsEngine';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InteractiveCanvas } from './components/canvas/InteractiveCanvas';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { MetricsPanel } from './components/panels/MetricsPanel';
import { ComparisonMatrix } from './components/panels/ComparisonMatrix';
import { ConceptFlowDiagram } from './components/panels/ConceptFlowDiagram';
import { SpeedMeasurementLab } from './components/modules/SpeedMeasurementLab';
import { KinematicsGraphView } from './components/modules/KinematicsGraphView';
import { MultiObjectCompare } from './components/modules/MultiObjectCompare';
import { AcceleratedMotionLab } from './components/modules/AcceleratedMotionLab';
import { ChallengeView } from './components/modules/ChallengeView';
import { QuizExplorationView } from './components/modules/QuizExplorationView';
import { TeacherControlModal } from './components/modules/TeacherControlModal';
import { KnowledgeModal } from './components/modules/KnowledgeModal';
import { HelpModal } from './components/modules/HelpModal';
import { Sparkles, MapPin, Sliders, Info } from 'lucide-react';

export function App() {
  // Navigation & Modes
  const [activeTab, setActiveTab] = useState<LabTab>('DISPLACEMENT_DISTANCE');
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Map & Waypoint Presets
  const [currentPreset, setCurrentPreset] = useState<ScenePreset>(SCENE_PRESETS[0]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(SCENE_PRESETS[0].waypoints);

  // Interactive Layer Visibility
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    showTrajectory: true,
    showDisplacementVector: true,
    showInstantaneousVelocity: true,
    showAverageVelocity: false,
    showGrid: true,
    showWaypoints: true,
    showObjectTrail: true,
    showCoordinates: true,
    showTangentLine: true,
    showMetricsOverlay: true,
  });

  // Spotlight / Highlighted Physics Element
  const [highlightedElement, setHighlightedElement] = useState<
    'distance' | 'displacement' | 'speed' | 'velocity' | 'acceleration' | null
  >(null);

  // Simulation Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Modals
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Physics Engine Instance
  const physicsEngine = useMemo(() => {
    return new PhysicsEngine({
      waypoints,
      scaleMeterPerPixel: currentPreset.scaleMeterPerPixel,
      motionType: 'uniform',
      totalDuration: currentPreset.defaultDuration,
      isClosed: currentPreset.id === 'lake-loop' || currentPreset.id === 'track-stadium',
    });
  }, [waypoints, currentPreset]);

  // Compute live physics state at current time
  const motionState = useMemo(() => {
    return physicsEngine.computeStateAtTime(currentTime);
  }, [physicsEngine, currentTime]);

  const sampledPath = useMemo(() => {
    return physicsEngine.getSampledPath();
  }, [physicsEngine]);

  const graphData = useMemo(() => {
    return physicsEngine.generateGraphSeries(80);
  }, [physicsEngine]);

  // Handle Preset Switching
  const handleSelectPreset = useCallback((preset: ScenePreset) => {
    setCurrentPreset(preset);
    setWaypoints(preset.waypoints);
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  // Update Waypoints from drag or toolbar
  const handleWaypointsChange = useCallback((newWps: Waypoint[]) => {
    setWaypoints(newWps);
  }, []);

  // Playback Animation Loop
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + deltaTime * playbackSpeed;
        if (nextTime >= currentPreset.defaultDuration) {
          if (isLooping) {
            return 0;
          } else {
            setIsPlaying(false);
            return currentPreset.defaultDuration;
          }
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, currentPreset.defaultDuration, isLooping]);

  // Playback Handlers
  const handleTogglePlay = () => {
    if (currentTime >= currentPreset.defaultDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleStep = (delta: number) => {
    setIsPlaying(false);
    setCurrentTime((t) =>
      Math.max(0, Math.min(currentPreset.defaultDuration, t + delta))
    );
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(currentPreset.defaultDuration, time)));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation Header */}
      <Header
        mode={mode}
        setMode={setMode}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenTeacherTools={() => setIsTeacherModalOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onResetAll={() => {
          handleReset();
          setWaypoints(currentPreset.waypoints);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Topic Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Auto adapt preset if relevant
            if (tab === 'UNIFORM_MOTION') {
              const straight = SCENE_PRESETS.find((p) => p.id === 'straight-uniform');
              if (straight) handleSelectPreset(straight);
            }
          }}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Center & Right Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-4 max-h-[calc(100vh-3.5rem)]">
          {/* Preset Scenario Selector Bar (Shown for Map-based tabs) */}
          {activeTab !== 'SPEED_MEASUREMENT' &&
            activeTab !== 'MULTI_OBJECT' &&
            activeTab !== 'ACCELERATED_MOTION' &&
            activeTab !== 'EXPLORATION_QUIZ' && (
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#090d16]/90 p-3 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Chọn Tình Huống Mẫu:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {SCENE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        currentPreset.id === preset.id
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400/40'
                          : 'bg-[#030712] text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* TAB 1, 2, 3, 5, 6: Central Interactive Canvas & Analysis Grid */}
          {(activeTab === 'DISPLACEMENT_DISTANCE' ||
            activeTab === 'SPEED_VELOCITY' ||
            activeTab === 'INSTANTANEOUS_VECTOR' ||
            activeTab === 'DT_GRAPH' ||
            activeTab === 'UNIFORM_MOTION' ||
            activeTab === 'CHALLENGES') && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              {/* Left/Center 8 cols: Interactive Canvas & Playback Bar */}
              <div className="xl:col-span-8 space-y-3">
                {/* Educational Hint Banner */}
                {currentPreset.educationalQuestion && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.1)]">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-white block mb-0.5 font-bold">Câu hỏi gợi mở SGK:</strong>
                      {currentPreset.educationalQuestion}
                    </div>
                  </div>
                )}

                {/* Primary Interactive Physics Canvas */}
                <InteractiveCanvas
                  preset={currentPreset}
                  waypoints={waypoints}
                  onWaypointsChange={handleWaypointsChange}
                  motionState={motionState}
                  sampledPath={sampledPath}
                  layerVisibility={layerVisibility}
                  highlightedElement={highlightedElement}
                />

                {/* Playback Control Bar */}
                <PlaybackControls
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onReset={handleReset}
                  onStep={handleStep}
                  currentTime={currentTime}
                  totalDuration={currentPreset.defaultDuration}
                  onSeek={handleSeek}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                  isLooping={isLooping}
                  onToggleLoop={() => setIsLooping(!isLooping)}
                />

                {/* Tab 5 or Tab 6: Inline Synchronized Kinematics Graph View */}
                {activeTab === 'DT_GRAPH' && (
                  <KinematicsGraphView
                    graphData={graphData}
                    motionState={motionState}
                    currentTime={currentTime}
                    totalDuration={currentPreset.defaultDuration}
                    onSeekTime={handleSeek}
                  />
                )}

                {/* Tab 9: Inline Challenges Container */}
                {activeTab === 'CHALLENGES' && (
                  <ChallengeView motionState={motionState} />
                )}
              </div>

              {/* Right 4 cols: Physics Metrics & Pedagogical Panels */}
              <div className="xl:col-span-4 space-y-4">
                {/* Real-time Metrics Card */}
                <MetricsPanel
                  motionState={motionState}
                  onHighlightElement={setHighlightedElement}
                  highlightedElement={highlightedElement}
                />

                {/* Concept Flow Pipeline */}
                <ConceptFlowDiagram
                  onHighlight={(elem) =>
                    setHighlightedElement(highlightedElement === elem ? null : elem)
                  }
                  activeHighlight={highlightedElement}
                />

                {/* Core SGK Comparison Matrix */}
                <ComparisonMatrix
                  onHighlight={(elem) =>
                    setHighlightedElement(highlightedElement === elem ? null : elem)
                  }
                  activeHighlight={highlightedElement}
                />
              </div>
            </div>
          )}

          {/* TAB 4: Speed Measurement Virtual Experiment (Bài 6) */}
          {activeTab === 'SPEED_MEASUREMENT' && <SpeedMeasurementLab />}

          {/* TAB 7: Accelerated Motion & Acceleration Vector Lab (Bài 8-9) */}
          {activeTab === 'ACCELERATED_MOTION' && <AcceleratedMotionLab />}

          {/* TAB 8: 3-Object Simultaneous Comparison */}
          {activeTab === 'MULTI_OBJECT' && <MultiObjectCompare />}

          {/* TAB 10: Socratic Concept Exploration Quiz */}
          {activeTab === 'EXPLORATION_QUIZ' && <QuizExplorationView />}
        </main>
      </div>

      {/* Teacher Presentation & Layer Toggles Modal */}
      <TeacherControlModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        layerVisibility={layerVisibility}
        setLayerVisibility={setLayerVisibility}
        onSelectPreset={(p) => {
          handleSelectPreset(p);
          setIsTeacherModalOpen(false);
        }}
        currentPresetId={currentPreset.id}
      />

      {/* Sổ Tay Kiến Thức SGK KNTT Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
      />

      {/* User Guide & Conventions Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
