import React from 'react';
import {
  Layers,
  X,
  Eye,
  EyeOff,
  Presentation,
  CheckSquare,
  Square,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { LayerVisibility, ScenePreset } from '../../types/physics';
import { SCENE_PRESETS } from '../../data/presets';

interface TeacherControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  layerVisibility: LayerVisibility;
  setLayerVisibility: React.Dispatch<React.SetStateAction<LayerVisibility>>;
  onSelectPreset: (preset: ScenePreset) => void;
  currentPresetId: string;
}

export const TeacherControlModal: React.FC<TeacherControlModalProps> = ({
  isOpen,
  onClose,
  layerVisibility,
  setLayerVisibility,
  onSelectPreset,
  currentPresetId,
}) => {
  if (!isOpen) return null;

  const toggleLayer = (key: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showAllLayers = () => {
    setLayerVisibility({
      showTrajectory: true,
      showDisplacementVector: true,
      showInstantaneousVelocity: true,
      showAverageVelocity: true,
      showGrid: true,
      showWaypoints: true,
      showObjectTrail: true,
      showCoordinates: true,
      showTangentLine: true,
      showMetricsOverlay: true,
    });
  };

  const hideVectorsForGuessing = () => {
    setLayerVisibility((prev) => ({
      ...prev,
      showDisplacementVector: false,
      showInstantaneousVelocity: false,
      showAverageVelocity: false,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Bảng Điều Khiển Dành Cho Giáo Viên & Trình Chiếu
              </h2>
              <p className="text-xs text-slate-400">
                Bật/tắt từng lớp đại lượng để gợi mở tư duy và dẫn dắt học sinh khám phá
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Chọn Tình Huống Bài Giảng Mẫu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCENE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPreset(p);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    currentPresetId === p.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{p.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{p.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Layer Visibility Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Ẩn / Hiện Lớp Đại Lượng (Sư Phạm Dẫn Dắt)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={hideVectorsForGuessing}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-amber-400 border border-slate-700 transition"
                >
                  Ẩn vectơ để học sinh đoán
                </button>
                <button
                  onClick={showAllLayers}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white transition"
                >
                  Hiện tất cả
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Trajectory */}
              <label
                onClick={() => toggleLayer('showTrajectory')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  Quỹ đạo thực tế (Đường đi s)
                </span>
                {layerVisibility.showTrajectory ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>

              {/* Displacement Vector */}
              <label
                onClick={() => toggleLayer('showDisplacementVector')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  Vectơ Độ dịch chuyển (d⃗)
                </span>
                {layerVisibility.showDisplacementVector ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>

              {/* Instantaneous Velocity */}
              <label
                onClick={() => toggleLayer('showInstantaneousVelocity')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="w-3 h-3 rounded-full bg-fuchsia-400" />
                  Vectơ Vận tốc tức thời (v⃗)
                </span>
                {layerVisibility.showInstantaneousVelocity ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>

              {/* Tangent Guide Line */}
              <label
                onClick={() => toggleLayer('showTangentLine')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="w-3 h-0.5 bg-fuchsia-400" />
                  Đường tiếp tuyến quỹ đạo
                </span>
                {layerVisibility.showTangentLine ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>

              {/* Grid */}
              <label
                onClick={() => toggleLayer('showGrid')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="text-slate-200">Lưới tọa độ milimet</span>
                {layerVisibility.showGrid ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>

              {/* Waypoints */}
              <label
                onClick={() => toggleLayer('showWaypoints')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
              >
                <span className="text-slate-200">Các điểm mốc (A, B, C, D...)</span>
                {layerVisibility.showWaypoints ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </label>
            </div>
          </div>

          {/* Suggested Pedagogical Questions */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Gợi ý câu hỏi tương tác cho Giáo viên trên lớp:</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
              <li>"Thầy/cô vừa kéo đường đi uốn khúc hơn, các em hãy dự đoán quãng đường s và độ dịch chuyển d sẽ thế nào?"</li>
              <li>"Tại sao khi xe chạy hết một vòng hồ về điểm A, công tơ mét chỉ 100m nhưng độ dịch chuyển lại bằng 0?"</li>
              <li>"Tại khúc cua tròn, mũi tên vận tốc tức thời có hướng về đích B hay bám theo tiếp tuyến?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
