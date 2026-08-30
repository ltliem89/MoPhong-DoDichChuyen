import { Challenge } from '../types/physics';

export const LAB_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Thử thách 1: Quãng đường cực đại với độ dịch chuyển không đổi',
    difficulty: 'Cơ bản',
    goal: 'Hãy kéo và thêm các điểm trung gian (waypoints) để quãng đường s đạt tối thiểu 120m, trong khi điểm đầu A và điểm cuối B giữ nguyên cố định.',
    targetCriteria: {
      minDistance: 120,
      targetDisplacement: 80,
      toleranceDisplacement: 15,
    },
    hint: 'Bạn có thể kéo các điểm C, D, E ra xa hoặc tạo đường vòng ziczac mà không di chuyển điểm A và B.',
    pedagogicalExplanation:
      'Chính xác! Quãng đường s phụ thuộc vào độ dài thực tế của đường đi mà bạn vẽ ra. Trong khi đó, độ dịch chuyển d chỉ là đoạn thẳng nối điểm đầu A và điểm cuối B, do đó không hề bị thay đổi dù bạn kéo đường đi ngoằn ngoèo đến đâu!',
  },
  {
    id: 'ch-2',
    title: 'Thử thách 2: Quãng đường > 50m nhưng Độ dịch chuyển = 0',
    difficulty: 'Thông hiểu',
    goal: 'Thiết kế một quỹ đạo khép kín sao cho xe đi quãng đường s > 50m nhưng độ dịch chuyển kết thúc d = 0m.',
    targetCriteria: {
      minDistance: 50,
      requireZeroDisplacement: true,
    },
    hint: 'Hãy kéo điểm kết thúc B trùng khít với điểm xuất phát A (hoặc chọn mô hình Vòng hồ / Vòng chạy khép kín).',
    pedagogicalExplanation:
      'Xuất sắc! Khi vật chuyển động khép kín và trở về đúng vị trí xuất phát ban đầu, điểm đầu trùng với điểm cuối. Do đó vectơ độ dịch chuyển có độ dài bằng 0 (d = 0), dù đồng hồ công-tơ-mét đo quãng đường s > 50m!',
  },
  {
    id: 'ch-3',
    title: 'Thử thách 3: Hai quỹ đạo khác biệt – Cùng Độ dịch chuyển',
    difficulty: 'Thông hiểu',
    goal: 'Tạo hai đường đi khác biệt rõ rệt (một đường vòng, một đường ziczac) nhưng có cùng độ dịch chuyển d.',
    targetCriteria: {
      requireCurveTrajectory: true,
    },
    hint: 'Chỉ cần giữ nguyên vị trí của A và B, bạn có thể tự do thay đổi mọi điểm giữa quỹ đạo.',
    pedagogicalExplanation:
      'Đúng vậy! Độ dịch chuyển là một đại lượng vectơ xác định bởi tọa độ điểm đầu và điểm cuối. Mọi quỹ đạo bất kỳ nối giữa cùng 2 điểm A và B đều có chung một vectơ độ dịch chuyển duy nhất.',
  },
  {
    id: 'ch-4',
    title: 'Thử thách 4: Cùng tốc độ trung bình nhưng khác vận tốc trung bình',
    difficulty: 'Vận dụng',
    goal: 'Tạo một chuyển động đường cong sao cho tốc độ trung bình v_tb ≈ 10 m/s nhưng độ lớn vận tốc trung bình |v_tb_vec| < 6 m/s.',
    targetCriteria: {
      targetAverageSpeed: 10,
      targetAverageVelocityMag: 6,
    },
    hint: 'Tốc độ trung bình v_tb = s / t, còn vận tốc trung bình v_tb_vec = d / t. Khi đường đi càng cong uốn khúc, s >> d nên v_tb >> |v_tb_vec|.',
    pedagogicalExplanation:
      'Tuyệt vời! Tốc độ trung bình đo mức độ nhanh chậm theo toàn bộ quãng đường thực tế (s/t), còn vận tốc trung bình đo tốc độ thay đổi vị trí theo đường thẳng (d/t). Khi đi đường vòng, s lớn hơn d rất nhiều nên v_tb > |v_tb_vec|.',
  },
  {
    id: 'ch-5',
    title: 'Thử thách 5: Vận tốc tức thời liên tục đổi hướng',
    difficulty: 'Thử thách nâng cao',
    goal: 'Quan sát và thiết lập một quỹ đạo vòng cung liên tục (như đường cua tròn) để chứng minh vectơ vận tốc tức thời luôn tiếp tuyến và đổi hướng ở mọi thời điểm.',
    targetCriteria: {
      requireCurveTrajectory: true,
    },
    hint: 'Bật chế độ hiển thị [Vectơ vận tốc tức thời] (mũi tên màu cánh sen) và quan sát khi vật chạy qua khúc cua tròn.',
    pedagogicalExplanation:
      'Chính xác! Trong chuyển động cong, vectơ vận tốc tức thời tại mỗi điểm luôn có phương tiếp tuyến với quỹ đạo tại điểm đó và có chiều theo chiều chuyển động. Vì phương tiếp tuyến đổi liên tục nên vận tốc tức thời luôn biến đổi!',
  },
];
