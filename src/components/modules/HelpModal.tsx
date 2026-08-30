import React from 'react';
import { HelpCircle, X, Navigation, MoveRight, ArrowRightLeft, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Hướng Dẫn Sử Dụng Phòng Thí Nghiệm
              </h2>
              <p className="text-xs text-slate-400">
                Các thao tác tương tác và quy ước trực quan khoa học
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Section 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              1. Thao tác trên Bản đồ Quỹ đạo
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong>Kéo các điểm mốc (Waypoints):</strong> Dùng chuột hoặc ngón tay chạm để kéo các điểm A, B, C, D... tạo đường cong hoặc đường ziczac theo ý muốn.
              </li>
              <li>
                <strong>Thêm điểm trung gian:</strong> Nhấn nút <code>+ Thêm điểm</code> ở góc trên canvas để tạo thêm ngã rẽ.
              </li>
              <li>
                <strong>Xóa điểm:</strong> Di chuột vào điểm trung gian và nhấn biểu tượng thùng rác màu đỏ.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              2. Quy ước Trực quan Màu sắc
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <span>
                  <strong>Nét màu Vàng:</strong> Quỹ đạo thực tế và Quãng đường (s).
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
                <span>
                  <strong>Mũi tên Xanh ngọc:</strong> Vectơ Độ dịch chuyển (d⃗) nối thẳng từ A đến vị trí hiện tại.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-fuchsia-500/30 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-fuchsia-400 shrink-0" />
                <span>
                  <strong>Mũi tên Cánh sen:</strong> Vectơ Vận tốc tức thời (v⃗) luôn tiếp tuyến quỹ đạo.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  <strong>Mũi tên Xanh lục:</strong> Vectơ Gia tốc (a⃗) trong chuyển động biến đổi.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              3. Điều khiển Dòng thời gian & Đồ thị
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                Nhấn <strong>Bắt đầu chạy</strong> để xem vật di chuyển theo thời gian thực.
              </li>
              <li>
                Kéo thanh trượt timeline hoặc click trực tiếp lên đồ thị để xem trạng thái vật lí tại bất kỳ thời điểm t nào.
              </li>
              <li>
                Ở mục Đồ thị d–t, kéo 2 mốc <strong>t1</strong> và <strong>t2</strong> để khám phá hệ số góc k = Δd/Δt = v.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
