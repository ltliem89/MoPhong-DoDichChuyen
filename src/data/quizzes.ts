import { QuizQuestion } from '../types/physics';

export const EXPLORATION_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    lesson: 'Bài 4: Độ dịch chuyển & Quãng đường',
    question:
      'Nếu bạn thay đổi đường đi uốn khúc nhiều hơn nhưng vẫn giữ nguyên điểm xuất phát A và điểm kết thúc B, đại lượng nào sau đây thay đổi?',
    options: [
      {
        id: 'a',
        text: 'Chỉ quãng đường s thay đổi, độ dịch chuyển d không đổi',
        isCorrect: true,
        explanation:
          'Chính xác! Quãng đường s là độ dài toàn bộ đường đi nên thay đổi theo hình dạng quỹ đạo. Còn độ dịch chuyển d chỉ nối từ điểm đầu A đến điểm cuối B nên không đổi.',
      },
      {
        id: 'b',
        text: 'Cả quãng đường s và độ dịch chuyển d đều thay đổi',
        isCorrect: false,
        explanation:
          'Chưa chính xác. Độ dịch chuyển chỉ phụ thuộc vào vị trí điểm đầu A và điểm cuối B, không phụ thuộc vào đường đi ở giữa.',
      },
      {
        id: 'c',
        text: 'Chỉ độ dịch chuyển d thay đổi, quãng đường s không đổi',
        isCorrect: false,
        explanation:
          'Sai. Quãng đường chính là chiều dài thực tế của đường đi uốn khúc nên chắc chắn phải thay đổi.',
      },
      {
        id: 'd',
        text: 'Cả hai đại lượng đều không đổi',
        isCorrect: false,
        explanation:
          'Sai. Con đường dài hơn thì quãng đường đo được trên công-tơ-mét chắc chắn tăng lên.',
      },
    ],
    explanationSummary:
      'Ghi nhớ cốt lõi SGK KNTT: Quãng đường phụ thuộc vào quỹ đạo thực tế. Độ dịch chuyển chỉ phụ thuộc vào điểm đầu và điểm cuối.',
    knttReference: 'SGK Vật lí 10 - Bài 4 (trang 24)',
  },
  {
    id: 'q2',
    lesson: 'Bài 4: Độ dịch chuyển & Quãng đường',
    question:
      'Một vận động viên chạy một vòng quanh sân vận động 400m rồi trở về đúng vạch xuất phát ban đầu. Độ dịch chuyển d và quãng đường s của người này là:',
    options: [
      {
        id: 'a',
        text: 'd = 0 m và s = 400 m',
        isCorrect: true,
        explanation:
          'Đúng! Vì điểm đầu trùng điểm cuối nên vectơ độ dịch chuyển d = 0m. Nhưng người đó đã chạy hết chiều dài đường pitch nên s = 400m.',
      },
      {
        id: 'b',
        text: 'd = 400 m và s = 400 m',
        isCorrect: false,
        explanation:
          'Chưa đúng. Điểm kết thúc trùng điểm xuất phát thì không có sự thay đổi vị trí không gian ròng rã, nên d = 0.',
      },
      {
        id: 'c',
        text: 'd = 400 m và s = 0 m',
        isCorrect: false,
        explanation:
          'Sai. Quãng đường s luôn là số dương lớn hơn 0 khi vật đã chuyển động.',
      },
      {
        id: 'd',
        text: 'd = 0 m và s = 0 m',
        isCorrect: false,
        explanation:
          'Sai. Vận động viên đã tiêu tốn sức lực chạy 400m nên quãng đường không thể bằng 0.',
      },
    ],
    explanationSummary:
      'Chuyển động khép kín: Điểm đầu trùng điểm cuối ➔ Vectơ độ dịch chuyển bằng vectơ không (d = 0), Quãng đường s > 0.',
    knttReference: 'SGK Vật lí 10 - Bài 4 (trang 25)',
  },
  {
    id: 'q3',
    lesson: 'Bài 4: Độ dịch chuyển & Quãng đường',
    question:
      'Khi nào thì độ lớn của độ dịch chuyển bằng đúng quãng đường đi được (|d| = s)?',
    options: [
      {
        id: 'a',
        text: 'Khi vật chuyển động thẳng và không đổi chiều',
        isCorrect: true,
        explanation:
          'Chính xác! Chỉ khi vật đi thẳng tuột một lèo theo một chiều duy nhất từ A đến B thì độ dài quỹ đạo mới bằng đúng khoảng cách nối A và B.',
      },
      {
        id: 'b',
        text: 'Trong mọi chuyển động thẳng',
        isCorrect: false,
        explanation:
          'Chưa đủ. Nếu vật chuyển động thẳng nhưng đi tới rồi lùi lại thì s > |d|.',
      },
      {
        id: 'c',
        text: 'Trong chuyển động tròn đều',
        isCorrect: false,
        explanation:
          'Sai. Chuyển động tròn có đường cong nên quãng đường hình cung luôn dài hơn dây cung hoặc bằng 0 khi hết vòng.',
      },
      {
        id: 'd',
        text: 'Khi vật chuyển động với tốc độ không đổi',
        isCorrect: false,
        explanation:
          'Sai. Đi nhanh hay chậm không quyết định quan hệ hình học giữa quỹ đạo và độ dịch chuyển.',
      },
    ],
    explanationSummary:
      'Hệ thức chuẩn SGK: |d| ≤ s. Dấu "=" xảy ra khi và chỉ khi chuyển động thẳng và không đổi chiều.',
    knttReference: 'SGK Vật lí 10 - Bài 4 (trang 26)',
  },
  {
    id: 'q4',
    lesson: 'Bài 5: Tốc độ và vận tốc',
    question:
      'Điểm khác biệt cơ bản nhất giữa Tốc độ và Vận tốc trong Vật lí là gì?',
    options: [
      {
        id: 'a',
        text: 'Tốc độ là đại lượng vô hướng (chỉ có độ lớn), còn Vận tốc là đại lượng vectơ (có độ lớn và hướng)',
        isCorrect: true,
        explanation:
          'Hoàn hảo! Tốc độ đo bằng quãng đường / thời gian (v = s/t). Vận tốc đo bằng độ dịch chuyển / thời gian (v_vec = d/t) và có hướng xác định.',
      },
      {
        id: 'b',
        text: 'Tốc độ dùng cho xe máy, còn vận tốc dùng cho máy bay',
        isCorrect: false,
        explanation: 'Sai hoàn toàn. Đây là hai khái niệm vật lí cơ bản áp dụng cho mọi đối tượng.',
      },
      {
        id: 'c',
        text: 'Vận tốc luôn lớn hơn tốc độ trong mọi trường hợp',
        isCorrect: false,
        explanation: 'Sai. Vì |d| ≤ s nên độ lớn vận tốc trung bình luôn nhỏ hơn hoặc bằng tốc độ trung bình.',
      },
      {
        id: 'd',
        text: 'Tốc độ có đơn vị m/s, còn vận tốc có đơn vị km/h',
        isCorrect: false,
        explanation: 'Sai. Cả hai đại lượng đều dùng chung đơn vị m/s trong hệ SI.',
      },
    ],
    explanationSummary:
      'Tốc độ: Đại lượng vô hướng (Scalar). Vận tốc: Đại lượng vectơ (Vector) thể hiện cả độ nhanh chậm và hướng chuyển động.',
    knttReference: 'SGK Vật lí 10 - Bài 5 (trang 27)',
  },
  {
    id: 'q5',
    lesson: 'Bài 5: Tốc độ và vận tốc',
    question:
      'Tại một điểm bất kỳ trên quỹ đạo cong, vectơ vận tốc tức thời của vật có phương và chiều như thế nào?',
    options: [
      {
        id: 'a',
        text: 'Phương tiếp tuyến với quỹ đạo tại điểm đó, chiều là chiều chuyển động',
        isCorrect: true,
        explanation:
          'Chính xác! Vectơ vận tốc tức thời tại mỗi điểm luôn bám theo tiếp tuyến của đường cong và hướng theo chiều vật đang chạy tới.',
      },
      {
        id: 'b',
        text: 'Luôn hướng thẳng từ điểm xuất phát A đến điểm kết thúc B',
        isCorrect: false,
        explanation:
          'Sai! Đó là hướng của vectơ độ dịch chuyển tổng thể, không phải hướng vận tốc tức thời trên đường cong.',
      },
      {
        id: 'c',
        text: 'Phương vuông góc với quỹ đạo và hướng vào tâm cong',
        isCorrect: false,
        explanation: 'Sai. Đó là phương của gia tốc hướng tâm, không phải phương của vận tốc.',
      },
      {
        id: 'd',
        text: 'Phương nằm ngang bất kể hình dạng quỹ đạo',
        isCorrect: false,
        explanation: 'Sai. Phương của vectơ vận tốc thay đổi theo từng đoạn cong của quỹ đạo.',
      },
    ],
    explanationSummary:
      'Quy tắc tiếp tuyến: Vectơ vận tốc tức thời luôn tiếp tuyến với quỹ đạo tại vị trí khảo sát.',
    knttReference: 'SGK Vật lí 10 - Bài 5 (trang 28)',
  },
  {
    id: 'q6',
    lesson: 'Bài 7: Đồ thị độ dịch chuyển – thời gian',
    question:
      'Trên đồ thị độ dịch chuyển – thời gian (d – t), độ dốc (hệ số góc) của đường biểu diễn cho biết đại lượng nào?',
    options: [
      {
        id: 'a',
        text: 'Vận tốc của vật (v = Δd / Δt)',
        isCorrect: true,
        explanation:
          'Chính xác! Độ dốc k = Δd/Δt phản ánh tốc độ biến thiên độ dịch chuyển theo thời gian, chính là vận tốc.',
      },
      {
        id: 'b',
        text: 'Gia tốc của vật',
        isCorrect: false,
        explanation:
          'Chưa đúng. Gia tốc là độ dốc của đồ thị vận tốc – thời gian (v – t), không phải đồ thị d – t.',
      },
      {
        id: 'c',
        text: 'Quãng đường đi được',
        isCorrect: false,
        explanation: 'Sai. Quãng đường là chiều dài quỹ đạo.',
      },
      {
        id: 'd',
        text: 'Lực tác dụng lên vật',
        isCorrect: false,
        explanation: 'Sai. Lực liên quan đến khối lượng và gia tốc (Định luật II Newton).',
      },
    ],
    explanationSummary:
      'Ý nghĩa hình học đồ thị d–t: Độ dốc đường thẳng = Vận tốc. Đường càng dốc, vật chuyển động càng nhanh.',
    knttReference: 'SGK Vật lí 10 - Bài 7 (trang 34)',
  },
  {
    id: 'q7',
    lesson: 'Bài 8: Gia tốc & Chuyển động biến đổi',
    question:
      'Khi một chiếc xe đang chạy theo chiều dương và chuyển động CHẬM DẦN ĐỀU, dấu của vận tốc v và gia tốc a là:',
    options: [
      {
        id: 'a',
        text: 'v > 0 và a < 0 (v và a trái dấu)',
        isCorrect: true,
        explanation:
          'Chính xác! Trong chuyển động chậm dần đều, vectơ gia tốc ngược hướng với vectơ vận tốc, do đó tích a · v < 0.',
      },
      {
        id: 'b',
        text: 'v > 0 và a > 0 (v và a cùng dấu)',
        isCorrect: false,
        explanation: 'Sai. Khi a và v cùng dấu thì xe chuyển động NHANH dần đều.',
      },
      {
        id: 'c',
        text: 'v < 0 và a = 0',
        isCorrect: false,
        explanation: 'Sai. Khi a = 0 xe chuyển động thẳng đều.',
      },
      {
        id: 'd',
        text: 'v = 0 và a < 0',
        isCorrect: false,
        explanation: 'Sai. Khi v = 0 xe đang đứng yên ở thời điểm đó.',
      },
    ],
    explanationSummary:
      'Quy tắc vàng SGK KNTT: Nhanh dần đều ➔ a và v cùng dấu (a·v > 0). Chậm dần đều ➔ a và v trái dấu (a·v < 0).',
    knttReference: 'SGK Vật lí 10 - Bài 8 (trang 39)',
  },
];
