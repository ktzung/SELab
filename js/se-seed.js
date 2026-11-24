/* SELab — dữ liệu mô phỏng SOLID, liên kết và kế thừa */
window.SE_SEED = {
  principles: [
    { key: "srp", label: "SRP", name: "Một lý do để đổi" },
    { key: "ocp", label: "OCP", name: "Mở để mở rộng" },
    { key: "lsp", label: "LSP", name: "Thay thế được" },
    { key: "isp", label: "ISP", name: "Interface mảnh" },
    { key: "dip", label: "DIP", name: "Phụ thuộc trừu tượng" }
  ],
  lab: {
    heading: "Ba thước đo của thiết kế",
    intro: "Chấm năm nguyên tắc SOLID, đo độ liên kết giữa các class và độ sâu cây kế thừa. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "solid",
        label: "Chấm SOLID",
        title: "Năm nguyên tắc",
        badge: "0-25 vi phạm",
        runLabel: "Chấm thiết kế",
        hint: "Mỗi vi phạm trừ 4 điểm trên thang 100. Điểm 100 nghĩa là cả năm nguyên tắc đều sạch; nguyên tắc vi phạm nhiều nhất hiện ở cột cảnh báo.",
        fields: [
          { id: "srp", label: "SRP — vi phạm", type: "number", min: 0, max: 5, step: 1, value: 0 },
          { id: "ocp", label: "OCP — vi phạm", type: "number", min: 0, max: 5, step: 1, value: 0 },
          { id: "lsp", label: "LSP — vi phạm", type: "number", min: 0, max: 5, step: 1, value: 0 },
          { id: "isp", label: "ISP — vi phạm", type: "number", min: 0, max: 5, step: 1, value: 0 },
          { id: "dip", label: "DIP — vi phạm", type: "number", min: 0, max: 5, step: 1, value: 0 }
        ]
      },
      {
        id: "couple",
        label: "Liên kết",
        title: "Bao nhiêu phụ thuộc?",
        badge: "fan-out",
        runLabel: "Đo liên kết",
        hint: "Fan-out trung bình = tổng phụ thuộc ÷ số class. Thiết kế dễ đổi giữ fan-out ≤ 3 và tỉ lệ interface ≥ 30% để phụ thuộc vào hợp đồng thay vì lớp cụ thể.",
        fields: [
          { id: "classes", label: "Số class", type: "number", min: 1, max: 50, step: 1, value: 10 },
          { id: "deps", label: "Tổng phụ thuộc", type: "number", min: 0, max: 200, step: 1, value: 20 },
          { id: "abstractTypes", label: "Interface / abstract", type: "number", min: 0, max: 30, step: 1, value: 3 }
        ]
      },
      {
        id: "inherit",
        label: "Kế thừa",
        title: "Cây sâu hay nông?",
        badge: "độ sâu",
        runLabel: "Đo cây kế thừa",
        hint: "Rủi ro = độ sâu × 2 + phần override vượt số lớp con + phần thiếu composition. Cây sâu quá 3 tầng hoặc override nhiều hơn lớp con là dấu hiệu nên chuyển sang composition.",
        fields: [
          { id: "depth", label: "Độ sâu cây", type: "number", min: 1, max: 6, step: 1, value: 3 },
          { id: "subclasses", label: "Số lớp con", type: "number", min: 0, max: 20, step: 1, value: 4 },
          { id: "overrides", label: "Số override", type: "number", min: 0, max: 30, step: 1, value: 4 },
          { id: "composition", label: "Điểm composition", type: "number", min: 0, max: 20, step: 1, value: 5 }
        ]
      }
    ],
    defaults: {
      solid: { srp: 0, ocp: 0, lsp: 0, isp: 0, dip: 0 },
      couple: { classes: 10, deps: 20, abstractTypes: 3 },
      inherit: { depth: 3, subclasses: 4, overrides: 4, composition: 5 }
    },
    presets: {
      solid: [
        { id: "se-clean", label: "Thiết kế sạch", dataset: { srp: 0, ocp: 0, lsp: 0, isp: 0, dip: 0 } },
        { id: "se-srp", label: "Một class gánh ba việc", dataset: { srp: 3, ocp: 0, lsp: 0, isp: 0, dip: 0 } },
        { id: "se-mixed", label: "Rải đều vi phạm", dataset: { srp: 1, ocp: 2, lsp: 1, isp: 1, dip: 1 } }
      ],
      couple: [
        { id: "c-normal", label: "10 class, 20 phụ thuộc", dataset: { classes: 10, deps: 20, abstractTypes: 3 } },
        { id: "c-tight", label: "Fan-out cao", dataset: { classes: 10, deps: 45, abstractTypes: 2 } },
        { id: "c-abstract", label: "Nhiều interface", dataset: { classes: 8, deps: 16, abstractTypes: 4 } }
      ],
      inherit: [
        { id: "i-normal", label: "Cây nông", dataset: { depth: 3, subclasses: 4, overrides: 4, composition: 5 } },
        { id: "i-deep", label: "Cây sâu", dataset: { depth: 5, subclasses: 6, overrides: 2, composition: 1 } },
        { id: "i-override", label: "Override tràn lan", dataset: { depth: 3, subclasses: 2, overrides: 8, composition: 4 } }
      ]
    },
    examples: [
      { id: "ex-srp", kind: "solid", label: "Class OrderService gánh ba việc", dataset: { srp: 3, ocp: 0, lsp: 0, isp: 0, dip: 0 } },
      { id: "ex-couple", kind: "couple", label: "Phụ thuộc lớp cụ thể", dataset: { classes: 10, deps: 45, abstractTypes: 2 } },
      { id: "ex-deep", kind: "inherit", label: "Cây kế thừa năm tầng", dataset: { depth: 5, subclasses: 6, overrides: 2, composition: 1 } }
    ],
    missions: [
      {
        id: "m-solid-clean",
        kind: "solid",
        title: "Thiết kế sạch",
        prompt: "Đặt cả năm nguyên tắc về 0 vi phạm. Engine phải kết luận thiết kế đạt.",
        metric: "clean",
        expect: 1,
        hint: "Đề mặc định đã sạch: không vi phạm nào, điểm 100 trên thang 100.",
        dataset: { srp: 0, ocp: 0, lsp: 0, isp: 0, dip: 0 }
      },
      {
        id: "m-solid-score",
        kind: "solid",
        title: "Điểm sau sáu vi phạm",
        prompt: "Nhập vi phạm lần lượt 1, 2, 1, 1, 1 cho SRP, OCP, LSP, ISP, DIP. Cho engine báo điểm còn lại.",
        metric: "score",
        expect: 76,
        hint: "Tổng 6 vi phạm, mỗi vi phạm trừ 4 điểm: 100 − 24 = 76.",
        dataset: { srp: 1, ocp: 2, lsp: 1, isp: 1, dip: 1 }
      },
      {
        id: "m-couple-avg",
        kind: "couple",
        title: "Fan-out trung bình",
        prompt: "Đo 10 class với tổng 20 phụ thuộc. Ghi lại fan-out trung bình mà engine tính được.",
        metric: "avgFanOut",
        expect: 2,
        hint: "20 ÷ 10 = 2 phụ thuộc mỗi class, nằm dưới ngưỡng 3 nên liên kết vẫn gọn.",
        dataset: { classes: 10, deps: 20, abstractTypes: 3 }
      },
      {
        id: "m-couple-share",
        kind: "couple",
        title: "Tỉ lệ trừu tượng",
        prompt: "Đặt 8 class, 16 phụ thuộc và 4 interface. Cho engine báo tỉ lệ trừu tượng (%).",
        metric: "abstractShare",
        expect: 50,
        hint: "4 interface trên 8 class là 50% — vượt mức 30% cần cho một thiết kế dễ đổi.",
        dataset: { classes: 8, deps: 16, abstractTypes: 4 }
      },
      {
        id: "m-inherit-risk",
        kind: "inherit",
        title: "Rủi ro cây sâu",
        prompt: "Đặt độ sâu 4, 3 lớp con, 9 override và điểm composition 2. Cho engine báo điểm rủi ro.",
        metric: "risk",
        expect: 17,
        hint: "4 × 2 = 8; override vượt lớp con 9 − 3 = 6; thiếu composition 5 − 2 = 3; tổng 17.",
        dataset: { depth: 4, subclasses: 3, overrides: 9, composition: 2 }
      },
      {
        id: "m-inherit-safe",
        kind: "inherit",
        title: "Cây nông an toàn",
        prompt: "Đặt độ sâu 3, 4 lớp con, 4 override và composition 5. Engine phải kết luận cây an toàn.",
        metric: "safe",
        expect: 1,
        hint: "Độ sâu không quá 3, override không vượt lớp con và composition từ 3 điểm trở lên.",
        dataset: { depth: 3, subclasses: 4, overrides: 4, composition: 5 }
      }
    ]
  }
};
