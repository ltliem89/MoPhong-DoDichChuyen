export interface KnowledgeLesson {
  id: string;
  lessonNumber: number;
  title: string;
  bookSource: string; // 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống'
  summary: string;
  keyConcepts: {
    name: string;
    symbol?: string;
    unit?: string;
    type: 'vector' | 'scalar' | 'concept' | 'formula';
    definition: string;
    formula?: string;
    note: string;
  }[];
  misconceptions: {
    wrong: string;
    correct: string;
    reason: string;
  }[];
  experimentsAndApplications: string[];
}

export const KNTT_PHYSICS_10_DATABASE: KnowledgeLesson[] = [
  {
    id: 'bai-4',
    lessonNumber: 4,
    title: 'Độ dịch chuyển và quãng đường đi được',
    bookSource: 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống (Chương II)',
    summary:
      'Bài học phân biệt rõ ràng giữa đại lượng vô hướng là quãng đường đi được (s) và đại lượng vectơ là độ dịch chuyển (d).',
    keyConcepts: [
      {
        name: 'Vị trí của vật',
        symbol: '(x, y)',
        unit: 'm',
        type: 'concept',
        definition:
          'Để xác định vị trí của một vật trên mặt phẳng, ta chọn một hệ tọa độ vuông góc Oxy gắn với vật làm mốc.',
        note: 'Vị trí phụ thuộc vào gốc tọa độ O được chọn.',
      },
      {
        name: 'Quãng đường đi được',
        symbol: 's',
        unit: 'm',
        type: 'scalar',
        definition:
          'Quãng đường là độ dài toàn bộ quỹ đạo mà vật đã thực sự đi qua trong khoảng thời gian chuyển động. Quãng đường là đại lượng vô hướng luôn dương (s ≥ 0).',
        formula: 's = \\sum \\Delta s_i',
        note: 'Quãng đường phụ thuộc vào hình dạng con đường (quỹ đạo) vật đi.',
      },
      {
        name: 'Độ dịch chuyển',
        symbol: '\\vec{d}',
        unit: 'm',
        type: 'vector',
        definition:
          'Độ dịch chuyển là một đại lượng vectơ cho biết độ dài và hướng sự thay đổi vị trí của vật. Vectơ độ dịch chuyển có gốc tại vị trí ban đầu và ngọn tại vị trí cuối.',
        formula: '\\vec{d} = \\vec{r}_2 - \\vec{r}_1',
        note: 'Độ dịch chuyển chỉ phụ thuộc vào điểm đầu và điểm cuối, hoàn toàn KHÔNG phụ thuộc vào hình dạng quỹ đạo vật đã đi giữa hai điểm đó.',
      },
      {
        name: 'Quan hệ giữa s và d',
        symbol: 'd \\le s',
        type: 'formula',
        definition:
          'Độ lớn của độ dịch chuyển luôn nhỏ hơn hoặc bằng quãng đường đi được (|\\vec{d}| \\le s).',
        formula: '|\\vec{d}| \\le s',
        note: 'Đẳng thức |\\vec{d}| = s chỉ xảy ra khi vật chuyển động thẳng và không đổi chiều.',
      },
      {
        name: 'Chuyển động khép kín (vòng về điểm xuất phát)',
        symbol: '\\vec{d} = \\vec{0}',
        type: 'concept',
        definition:
          'Khi vật đi một quỹ đạo bất kỳ rồi quay trở về đúng vị trí xuất phát ban đầu, điểm đầu trùng điểm cuối.',
        formula: 'd = 0; s > 0',
        note: 'Độ dịch chuyển bằng 0 dù quãng đường vật đi được có thể rất lớn.',
      },
    ],
    misconceptions: [
      {
        wrong: 'Độ dịch chuyển là độ dài đường cong mà vật đi qua.',
        correct: 'Độ dịch chuyển là đoạn thẳng có hướng nối từ điểm xuất phát đến điểm kết thúc.',
        reason: 'Đường cong là quỹ đạo, độ dài đường cong là quãng đường.',
      },
      {
        wrong: 'Vật đi nhiều thì độ dịch chuyển luôn lớn.',
        correct: 'Nếu vật đi vòng quanh rồi quay lại điểm xuất phát thì độ dịch chuyển bằng 0.',
        reason: 'Điểm đầu trùng điểm cuối nên vectơ d có độ dài bằng 0.',
      },
    ],
    experimentsAndApplications: [
      'Đi từ nhà đến trường qua nhiều ngã rẽ phố xá.',
      'Chạy một vòng quanh sân vận động 400m.',
      'Bơi một vòng hồ bơi đi và về.',
    ],
  },
  {
    id: 'bai-5',
    lessonNumber: 5,
    title: 'Tốc độ và vận tốc',
    bookSource: 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống (Chương II)',
    summary:
      'Bài học phân biệt đại lượng vô hướng là Tốc độ (đặc trưng cho mức độ nhanh chậm) và đại lượng vectơ là Vận tốc (đặc trưng cho cả mức độ nhanh chậm và hướng chuyển động).',
    keyConcepts: [
      {
        name: 'Tốc độ trung bình',
        symbol: 'v_{tb}',
        unit: 'm/s (hoặc km/h)',
        type: 'scalar',
        definition:
          'Tốc độ trung bình là thương số giữa quãng đường đi được và khoảng thời gian đi hết quãng đường đó. Là đại lượng vô hướng, không âm.',
        formula: 'v_{tb} = \\frac{s}{\\Delta t}',
        note: 'Không có hướng, chỉ có độ lớn và đơn vị đo.',
      },
      {
        name: 'Tốc độ tức thời',
        symbol: 'v',
        unit: 'm/s',
        type: 'scalar',
        definition:
          'Tốc độ tại một thời điểm xác định, đo bằng tốc kế của ô tô, xe máy.',
        formula: 'v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta s}{\\Delta t}',
        note: 'Giá trị hiển thị trên đồng hồ tốc kế xe máy, ô tô là tốc độ tức thời.',
      },
      {
        name: 'Vận tốc trung bình',
        symbol: '\\vec{v}_{tb}',
        unit: 'm/s',
        type: 'vector',
        definition:
          'Vận tốc trung bình là thương số giữa vectơ độ dịch chuyển và khoảng thời gian thực hiện độ dịch chuyển đó. Là đại lượng vectơ cùng hướng với vectơ độ dịch chuyển.',
        formula: '\\vec{v}_{tb} = \\frac{\\vec{d}}{\\Delta t}',
        note: 'Có gốc tại vị trí xét, cùng hướng với vectơ độ dịch chuyển d.',
      },
      {
        name: 'Vận tốc tức thời',
        symbol: '\\vec{v}',
        unit: 'm/s',
        type: 'vector',
        definition:
          'Vectơ vận tốc tức thời tại một điểm trên quỹ đạo có: gốc tại vị trí của vật, phương tiếp tuyến với quỹ đạo tại điểm đó, chiều là chiều chuyển động, độ lớn bằng tốc độ tức thời.',
        formula: '\\vec{v} = \\lim_{\\Delta t \\to 0} \\frac{\\Delta \\vec{d}}{\\Delta t}',
        note: 'Trên đường cong, vectơ vận tốc tức thời luôn đổi phương (tiếp tuyến với đường cong tại mỗi điểm).',
      },
    ],
    misconceptions: [
      {
        wrong: 'Tốc độ và vận tốc là một, chỉ là hai từ khác nhau.',
        correct: 'Tốc độ là đại lượng vô hướng (chỉ có độ lớn), vận tốc là đại lượng vectơ (có độ lớn và hướng).',
        reason: 'Khi nói "xe chạy 60 km/h về hướng Bắc" là vận tốc, còn nói "xe chạy 60 km/h" là tốc độ.',
      },
      {
        wrong: 'Vận tốc tức thời trên đường cong luôn hướng về điểm đích B.',
        correct: 'Vận tốc tức thời tại mọi điểm luôn có phương tiếp tuyến với quỹ đạo tại điểm đó.',
        reason: 'Phương tiếp tuyến phản ánh xu hướng chuyển động tức thời tại khoảnh khắc xét.',
      },
    ],
    experimentsAndApplications: [
      'Quan sát kim đồng hồ tốc kế trên ô tô khi cua qua vòng xuyến.',
      'So sánh tốc độ trung bình và vận tốc trung bình của người đi bộ quanh bờ hồ.',
    ],
  },
  {
    id: 'bai-6',
    lessonNumber: 6,
    title: 'Thực hành: Đo tốc độ của vật chuyển động',
    bookSource: 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống (Chương II)',
    summary:
      'Phương pháp thực nghiệm dùng máng định hướng, xe con có tấm chắn sáng, hai cổng quang điện E, F và đồng hồ đo thời gian hiện số để đo tốc độ.',
    keyConcepts: [
      {
        name: 'Nguyên lý đo tốc độ',
        type: 'concept',
        definition: 'Đo quãng đường s bằng thước đo milimet, đo thời gian t bằng đồng hồ đo hiện số nối cổng quang điện, sau đó tính v = s / t.',
        formula: 'v = \\frac{s}{t}',
        note: 'Cần thực hiện nhiều lần đo (thường 3 đến 5 lần) để tính giá trị trung bình và sai số.',
      },
      {
        name: 'Giá trị trung bình và sai số',
        symbol: '\\bar{v} \\pm \\Delta v',
        type: 'formula',
        definition: 'Giá trị trung bình của tốc độ: \\bar{v} = \\frac{v_1 + v_2 + ... + v_n}{n}. Sai số tuyệt đối: \\Delta v = \\overline{\\Delta v} + \\Delta v_{dc}.',
        formula: '\\bar{v} = \\frac{\\sum v_i}{n}',
        note: 'Đánh giá độ chính xác của phép đo thực hành trong phòng thí nghiệm.',
      },
    ],
    misconceptions: [
      {
        wrong: 'Chỉ cần đo một lần duy nhất là đủ kết luận tốc độ.',
        correct: 'Phải đo lặp lại nhiều lần để giảm thiểu sai số ngẫu nhiên do thao tác và thiết bị.',
        reason: 'Nguyên tắc cơ bản của phương pháp thực nghiệm khoa học.',
      },
    ],
    experimentsAndApplications: [
      'Bố trí thí nghiệm đo tốc độ chuyển động của xe con trên máng nghiêng / máng đệm khí.',
      'Sử dụng cảm biến quang điện bấm giờ chính xác đến một phần nghìn giây (ms).',
    ],
  },
  {
    id: 'bai-7',
    lessonNumber: 7,
    title: 'Đồ thị độ dịch chuyển – thời gian (d – t)',
    bookSource: 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống (Chương II)',
    summary:
      'Cách vẽ, phân tích và khai thác đồ thị d–t để xác định vị trí, quãng đường, độ dịch chuyển, thời gian và vận tốc của vật.',
    keyConcepts: [
      {
        name: 'Độ dốc của đồ thị d – t',
        symbol: 'k = \\frac{\\Delta d}{\\Delta t} = v',
        type: 'formula',
        definition:
          'Độ dốc (hệ số góc) của đường biểu diễn trên đồ thị độ dịch chuyển - thời gian chính là vận tốc của vật.',
        formula: 'v = \\frac{d_2 - d_1}{t_2 - t_1} = \\frac{\\Delta d}{\\Delta t}',
        note: 'Độ dốc dương: vật chuyển động theo chiều dương. Độ dốc âm: vật chuyển động ngược chiều dương. Đường nằm ngang (độ dốc = 0): vật đứng yên.',
      },
      {
        name: 'Đồ thị d – t trong chuyển động thẳng đều',
        type: 'concept',
        definition:
          'Trong chuyển động thẳng đều, đồ thị d–t là một đường thẳng xiên góc. Vận tốc không đổi nên độ dốc của đường thẳng không đổi.',
        formula: 'd = v \\cdot t + d_0',
        note: 'Đường thẳng càng dốc đứng thì tốc độ chuyển động càng lớn.',
      },
    ],
    misconceptions: [
      {
        wrong: 'Đồ thị d–t dốc lên rồi dốc xuống nghĩa là vật leo đồi rồi xuống đồi.',
        correct: 'Đồ thị d–t biểu diễn sự thay đổi của độ dịch chuyển theo thời gian, không phải là hình ảnh quỹ đạo trong không gian thực.',
        reason: 'Trục hoành là trục thời gian t (giây), trục tung là độ dịch chuyển d (mét).',
      },
    ],
    experimentsAndApplications: [
      'Phân tích chuyển động của người đi bộ, dừng lại nghỉ, rồi quay trở về điểm ban đầu trên đồ thị d-t.',
    ],
  },
  {
    id: 'bai-8-9',
    lessonNumber: 8,
    title: 'Chuyển động biến đổi. Gia tốc & Chuyển động thẳng biến đổi đều',
    bookSource: 'SGK Vật lí 10 - Kết nối tri thức với cuộc sống (Chương II - Mở rộng)',
    summary:
      'Gia tốc là đại lượng vectơ đặc trưng cho sự biến thiên nhanh hay chậm của vận tốc theo thời gian.',
    keyConcepts: [
      {
        name: 'Gia tốc',
        symbol: '\\vec{a}',
        unit: 'm/s²',
        type: 'vector',
        definition:
          'Gia tốc là đại lượng vectơ đặc trưng cho tốc độ thay đổi của vận tốc. Bằng tỉ số giữa độ biến thiên vận tốc và khoảng thời gian xảy ra độ biến thiên đó.',
        formula: '\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t} = \\frac{\\vec{v} - \\vec{v}_0}{t - t_0}',
        note: 'Khi vật chuyển động nhanh dần đều: a và v cùng dấu (\\vec{a} \\cdot \\vec{v} > 0). Khi chậm dần đều: a và v trái dấu (\\vec{a} \\cdot \\vec{v} < 0).',
      },
      {
        name: 'Công thức vận tốc theo thời gian',
        symbol: 'v(t)',
        unit: 'm/s',
        type: 'formula',
        definition: 'Vận tốc tức thời ở thời điểm t trong chuyển động thẳng biến đổi đều.',
        formula: 'v = v_0 + a \\cdot t',
        note: 'Đồ thị v–t là đường thẳng xiên góc có hệ số góc bằng gia tốc a.',
      },
      {
        name: 'Công thức độ dịch chuyển theo thời gian',
        symbol: 'd(t)',
        unit: 'm',
        type: 'formula',
        definition: 'Độ dịch chuyển trong chuyển động thẳng biến đổi đều xuất phát từ gốc tọa độ.',
        formula: 'd = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2',
        note: 'Đồ thị d–t là một nhánh của đường parabol.',
      },
      {
        name: 'Hệ thức độc lập thời gian',
        symbol: 'v^2 - v_0^2 = 2ad',
        type: 'formula',
        definition: 'Liên hệ giữa vận tốc, gia tốc và độ dịch chuyển.',
        formula: 'v^2 - v_0^2 = 2ad',
        note: 'Rất hữu ích khi không cho biết khoảng thời gian t.',
      },
    ],
    misconceptions: [
      {
        wrong: 'Gia tốc âm luôn có nghĩa là chuyển động chậm dần đều.',
        correct: 'Dấu của gia tốc phụ thuộc vào việc chọn chiều dương. Nếu chiều dương ngược chiều chuyển động thì vật chuyển động nhanh dần đều vẫn có gia tốc âm.',
        reason: 'Quy tắc chuẩn: Nhanh dần đều khi a và v cùng dấu; Chậm dần đều khi a và v trái dấu.',
      },
    ],
    experimentsAndApplications: [
      'Xe tăng tốc khi đèn giao thông chuyển sang xanh.',
      'Ô tô hãm phanh khi đến gần ngã tư.',
    ],
  },
];

/**
 * Knowledge Retriever
 */
export function searchKnowledgeBase(query: string): KnowledgeLesson[] {
  if (!query || query.trim() === '') return KNTT_PHYSICS_10_DATABASE;
  const q = query.toLowerCase().trim();

  return KNTT_PHYSICS_10_DATABASE.filter((lesson) => {
    const inTitle = lesson.title.toLowerCase().includes(q);
    const inSummary = lesson.summary.toLowerCase().includes(q);
    const inConcepts = lesson.keyConcepts.some(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q) ||
        (c.formula && c.formula.toLowerCase().includes(q))
    );
    const inMisconceptions = lesson.misconceptions.some(
      (m) =>
        m.wrong.toLowerCase().includes(q) ||
        m.correct.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q)
    );
    return inTitle || inSummary || inConcepts || inMisconceptions;
  });
}
