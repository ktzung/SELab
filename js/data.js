/* SELab - dữ liệu phần 1: module OOP nền tảng */
window.SELAB = window.SELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

window.SELAB.modules.push({
  id: "oop-nen-tang",
  num: "01",
  tone: "blue",
  title: "OOP nền tảng",
  blurb: "Bốn bài mở đầu xây nền tảng hướng đối tượng: nhận diện lớp và đối tượng, đóng gói trạng thái, tổ chức kế thừa và gọi đa hình. Mỗi bài có sơ đồ tương tác và năm bước phân tích để nắm khái niệm trước khi luyện tập.",
  lessons: ["doi-tuong", "dong-goi", "ke-thua", "da-hinh"]
});

window.SELAB.lessons["doi-tuong"] = {
  id: "doi-tuong",
  module: "oop-nen-tang",
  title: "Đối tượng và lớp",
  shortTitle: "Đối tượng",
  subtitle: "Lớp, đối tượng, constructor và tham chiếu",
  blurb: "Phân biệt lớp như bản thiết kế và đối tượng như thực thể trong bộ nhớ. Theo dõi một đối tượng SinhVien từ lúc khai báo, gọi constructor, gán thuộc tính đến khi gọi phương thức hiểu rõ tham chiếu và vòng đời.",
  duration: "12 phút",
  level: "Cơ bản",
  tags: ["class", "object", "constructor", "heap", "reference"],
  metrics: [
    { key: "classes", label: "Số lớp", tone: "blue" },
    { key: "objects", label: "Đối tượng", tone: "green" },
    { key: "fields", label: "Thuộc tính", tone: "violet" },
    { key: "heap", label: "Bộ nhớ heap", tone: "coral" }
  ],
  nodes: [
    { id: "code", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Bản thiết kế lớp", sub: "class SinhVien { ... }" },
    { id: "obj", type: "star", x: 340, y: 80, w: 200, h: 70, label: "Đối tượng", sub: "new SinhVien(\"SV01\")" },
    { id: "heap", type: "memory", x: 625, y: 80, w: 200, h: 70, label: "Bộ nhớ heap", sub: "vùng nhớ 48 byte" },
    { id: "ref", type: "key", x: 55, y: 310, w: 200, h: 70, label: "Biến tham chiếu", sub: "sv trỏ tới đối tượng" },
    { id: "state", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Thuộc tính", sub: "maSV, hoTen, diemTB" },
    { id: "method", type: "task", x: 625, y: 310, w: 200, h: 70, label: "Phương thức", sub: "xepLoai(), hienThi()" },
    { id: "ctor", type: "event", x: 340, y: 195, w: 200, h: 70, label: "Constructor", sub: "gán trạng thái ban đầu" }
  ],
  edges: [
    { id: "code-obj", from: "code", to: "obj", kind: "request", label: "new" },
    { id: "obj-heap", from: "obj", to: "heap", kind: "data", label: "cấp phát" },
    { id: "obj-ctor", from: "obj", to: "ctor", kind: "control", label: "gọi" },
    { id: "ctor-state", from: "ctor", to: "state", kind: "data", label: "gán giá trị" },
    { id: "ctor-method", from: "ctor", to: "method", kind: "control", label: "gắn hành vi" },
    { id: "ref-obj", from: "ref", to: "obj", kind: "request", label: "trỏ tới" },
    { id: "state-method", from: "state", to: "method", kind: "request", label: "đọc / ghi" }
  ],
  learn: [
    "Lớp là khuôn mô tả dữ liệu và hành vi, không phải thực thể.",
    "new chạy constructor và cấp phát vùng nhớ trên heap.",
    "Biến tham chiếu giữ địa chỉ, không chứa toàn bộ trạng thái.",
    "Phương thức thao tác trên trạng thái của chính đối tượng."
  ],
  steps: [
    {
      short: "Khuôn lớp",
      type: "concept",
      title: "Khuôn chưa phải vật",
      body: "Một <code>class</code> chỉ mô tả hình dạng dữ liệu và hành vi, trình biên dịch không tạo vùng nhớ cho từng cá thể. Khi khai báo <code>class SinhVien</code> với 3 thuộc tính <code>maSV</code>, <code>hoTen</code>, <code>diemTB</code>, chưa có đối tượng nào tồn tại. Chỉ khi gọi <code>new SinhVien()</code> hai lần, bộ nhớ mới có hai thực thể độc lập, mỗi thực thể giữ bản sao thuộc tính riêng. Đây là khác biệt cốt lõi giữa bản thiết kế và vật thể chạy thật trong chương trình. Mỗi đối tượng có danh tính riêng, nên so sánh hai biến bằng <code>==</code> chỉ đúng khi chúng trỏ cùng một vùng nhớ.",
      focus: ["code", "obj"],
      edges: ["code-obj"],
      metrics: { classes: "1", objects: "0", fields: "3", heap: "0 B" },
      changes: ["Hiện khuôn lớp SinhVien", "Chưa cấp phát vùng nhớ heap"],
      note: "Lớp chỉ là mô tả, đối tượng mới là thực thể có trạng thái."
    },
    {
      short: "new",
      type: "flow",
      title: "Ba việc của new",
      body: "Khi gọi <code>new SinhVien(\"SV01\", \"Lan\")</code>, máy ảo thực hiện ba việc theo thứ tự: cấp phát vùng nhớ cho đối tượng, chạy constructor để gán giá trị ban đầu, rồi trả về tham chiếu. Constructor không phải phương thức thường: nó không có kiểu trả về và chỉ chạy một lần cho mỗi lần <code>new</code>. Với ba trường tham chiếu và một số thực, đối tượng chiếm khoảng 48 byte trên heap 64-bit. Nếu constructor ném lỗi giữa chừng, vùng nhớ vừa cấp phát bị thu hồi và biến nhận giá trị <code>null</code>. Đây là lý do constructor nên kiểm tra tham số trước khi ghi trạng thái.",
      focus: ["obj", "ctor", "heap"],
      edges: ["obj-ctor", "obj-heap"],
      metrics: { classes: "1", objects: "1", fields: "3", heap: "48 B" },
      changes: ["Constructor chạy một lần", "Heap được cấp phát 48 byte"],
      note: "Thứ tự cố định: cấp phát, khởi tạo, trả tham chiếu."
    },
    {
      short: "Trạng thái",
      type: "detail",
      title: "Trạng thái thuộc về đối tượng",
      body: "Hai biến <code>sv1</code> và <code>sv2</code> trỏ tới hai đối tượng khác nhau, nên gán <code>sv1.diemTB = 8.5</code> không làm đổi <code>sv2.diemTB</code>. Nếu gán <code>sv2 = sv1</code>, cả hai biến giữ cùng một địa chỉ và chỉ còn một vùng trạng thái; thay đổi qua biến này hiện ra qua biến kia. Đây là ngữ nghĩa tham chiếu, khác hẳn kiểu giá trị như <code>int</code>. Trên heap lúc này có hai đối tượng, tổng khoảng 96 byte, còn stack giữ hai tham chiếu 8 byte. Muốn so sánh nội dung thay vì địa chỉ, lớp phải ghi đè <code>equals</code> và <code>hashCode</code>.",
      focus: ["ref", "state", "obj"],
      edges: ["ref-obj", "ctor-state"],
      metrics: { classes: "1", objects: "2", fields: "3", heap: "96 B" },
      changes: ["Hai vùng trạng thái tách biệt", "So sánh địa chỉ khác so sánh nội dung"],
      note: "Gán tham chiếu không sao chép đối tượng."
    },
    {
      short: "Null",
      type: "pitfall",
      title: "Tham chiếu null",
      body: "Khai báo <code>SinhVien sv;</code> chỉ tạo biến tham chiếu <code>null</code>, không cấp phát đối tượng. Gọi <code>sv.xepLoai()</code> ngay sau đó ném <code>NullPointerException</code> vì không có vùng trạng thái để đọc. Lỗi này xuất hiện ở khoảng 30% câu hỏi kiểm thử đầu vào khi lập trình viên quên <code>new</code>. Cách phòng: khởi tạo ngay khi khai báo, kiểm tra <code>null</code> trước khi dùng hoặc trả về <code>Optional</code> để buộc xử lý trường hợp thiếu. Đừng bắt lỗi rồi bỏ qua, vì trạng thái thiếu sẽ lan sang bước sau. Trình biên dịch không bắt được lỗi này vì <code>null</code> là giá trị hợp lệ của mọi kiểu tham chiếu.",
      focus: ["ref", "heap", "method"],
      edges: ["ref-obj", "ctor-method"],
      metrics: { classes: "1", objects: "0", fields: "3", heap: "0 B" },
      changes: ["Biến chỉ giữ null", "Lời gọi phương thức bị chặn"],
      note: "Không có new thì không có trạng thái để thao tác."
    },
    {
      short: "Tổng kết",
      type: "final",
      title: "Vòng đời hoàn chỉnh",
      body: "Tóm lại, <code>SinhVien</code> là khuôn gồm ba thuộc tính và hai phương thức; mỗi lần <code>new</code> tạo một đối tượng khoảng 48 byte trên heap và một tham chiếu 8 byte trên stack. Constructor chạy đúng một lần, gán trạng thái ban đầu, còn phương thức đọc và sửa trạng thái đó. Khi nắm vòng đời này, bạn đọc được sơ đồ và chuẩn bị cho bài Đóng gói: che giấu trạng thái để chỉ phương thức được phép thay đổi. Hai đối tượng trong ví dụ chiếm 96 byte và hoàn toàn độc lập.",
      focus: "all",
      edges: "all",
      metrics: { classes: "1", objects: "2", fields: "3", heap: "96 B" },
      changes: ["Đủ vòng đời từ khai báo tới gọi hàm", "Sẵn sàng sang bài Đóng gói"],
      note: "Nắm vòng đời trước khi học cách che giấu trạng thái.",
      tone: "final"
    }
  ]
};

window.SELAB.lessons["dong-goi"] = {
  id: "dong-goi",
  module: "oop-nen-tang",
  title: "Đóng gói",
  shortTitle: "Đóng gói",
  subtitle: "Che giấu trạng thái và giữ bất biến",
  blurb: "Đóng gói che giấu trạng thái và chỉ mở phương thức cần thiết. Bài học theo chân một lệnh nạp tiền qua lớp kiểm tra, cập nhật trường private và ghi nhật ký, đồng thời chỉ ra cách giữ bất biến số dư không âm.",
  duration: "12 phút",
  level: "Cơ bản",
  tags: ["private", "public", "getter", "invariant", "setter"],
  metrics: [
    { key: "public", label: "API công khai", tone: "blue" },
    { key: "private", label: "Trường private", tone: "violet" },
    { key: "guards", label: "Điểm kiểm tra", tone: "green" },
    { key: "violations", label: "Vi phạm bất biến", tone: "coral" }
  ],
  nodes: [
    { id: "user", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Người dùng", sub: "gọi napTien(500000)" },
    { id: "api", type: "api", x: 340, y: 80, w: 200, h: 70, label: "Phương thức public", sub: "napTien(long)" },
    { id: "check", type: "check", x: 625, y: 80, w: 200, h: 70, label: "Kiểm tra hợp lệ", sub: "soTien > 0, hạn mức" },
    { id: "shield", type: "shield", x: 55, y: 310, w: 200, h: 70, label: "Bất biến", sub: "soDu luôn >= 0" },
    { id: "file", type: "file", x: 340, y: 310, w: 200, h: 70, label: "Sổ giao dịch", sub: "nhật ký 3 dòng" },
    { id: "alert", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Lỗi miền", sub: "IllegalArgumentException" },
    { id: "key", type: "key", x: 340, y: 195, w: 200, h: 70, label: "Thuộc tính private", sub: "soDu, lichSu" }
  ],
  edges: [
    { id: "user-api", from: "user", to: "api", kind: "request", label: "gọi" },
    { id: "api-check", from: "api", to: "check", kind: "control", label: "xác thực" },
    { id: "api-key", from: "api", to: "key", kind: "data", label: "ghi private" },
    { id: "check-key", from: "check", to: "key", kind: "data", label: "đọc / ghi" },
    { id: "key-shield", from: "key", to: "shield", kind: "control", label: "giữ bất biến" },
    { id: "key-file", from: "key", to: "file", kind: "data", label: "ghi nhật ký" },
    { id: "check-alert", from: "check", to: "alert", kind: "control", label: "từ chối" }
  ],
  learn: [
    "Trường dữ liệu để private, chỉ mở phương thức nghiệp vụ.",
    "Mọi thay đổi đi qua một cửa duy nhất có kiểm tra.",
    "Bất biến viết thành mệnh đề kiểm thử được.",
    "Getter trả bản sao để không rò rỉ tham chiếu nội bộ."
  ],
  steps: [
    {
      short: "Cửa hẹp",
      type: "concept",
      title: "Cửa hẹp, ruột kín",
      body: "Đóng gói đặt trạng thái vào trong và chỉ để lộ một cửa hẹp. Với lớp <code>TaiKhoan</code>, trường <code>soDu</code> được khai báo <code>private</code>, còn hai phương thức <code>napTien</code> và <code>rutTien</code> là <code>public</code>. Mọi thay đổi phải đi qua cửa này, nơi có kiểm tra số tiền dương và hạn mức. Nhờ vậy lớp giữ được bất biến <code>soDu >= 0</code> bất kể mã bên ngoài viết thế nào. Che giấu không phải để khóa dữ liệu mà để đặt quy tắc vào một chỗ duy nhất, dễ đọc và dễ sửa khi nghiệp vụ đổi.",
      focus: ["user", "api", "key"],
      edges: ["user-api", "api-key"],
      metrics: { public: "2", private: "2", guards: "2", violations: "0" },
      changes: ["Hai trường chuyển sang private", "Chỉ còn hai phương thức public"],
      note: "Một cửa vào duy nhất giúp kiểm soát mọi thay đổi."
    },
    {
      short: "Bốn chặng",
      type: "flow",
      title: "Một lệnh nạp đi qua bốn chặng",
      body: "Một lệnh <code>napTien(500000)</code> đi qua bốn chặng: người dùng gọi phương thức public, phương thức kiểm tra điều kiện, trường private được cập nhật, rồi nhật ký ghi thêm một dòng. Nếu số tiền nhỏ hơn hoặc bằng 0, luồng dừng trước khi chạm trạng thái và ném <code>IllegalArgumentException</code>. Với hạn mức 50.000.000 đồng, lần nạp thứ ba trong ngày có thể bị từ chối. Thứ tự kiểm tra trước, ghi sau giúp trạng thái không bao giờ rơi vào nửa vời, kể cả khi bước ghi nhật ký gặp lỗi. Nếu bước ghi nhật ký thất bại, giao dịch phải được hoàn tác để số dư và sổ khớp nhau.",
      focus: ["api", "check", "key", "file"],
      edges: ["api-check", "check-key", "key-file"],
      metrics: { public: "2", private: "2", guards: "2", violations: "0" },
      changes: ["Kiểm tra chạy trước khi ghi", "Nhật ký chỉ ghi giao dịch hợp lệ"],
      note: "Kiểm tra trước, thay đổi sau, ghi nhật ký cuối."
    },
    {
      short: "Bất biến",
      type: "detail",
      title: "Bất biến phải kiểm được",
      body: "Bất biến là mệnh đề luôn đúng tại mọi điểm quan sát được. Ở đây, <code>soDu >= 0</code> và tổng các dòng nhật ký bằng số dư hiện tại. Hai phương thức <code>getSoDu</code> và <code>getLichSu</code> trả bản sao hoặc giá trị chỉ đọc để người ngoài không sửa được danh sách bên trong. Nếu trả thẳng tham chiếu tới <code>List</code> nội bộ, người dùng có thể gọi <code>clear()</code> và phá bất biến. Kiểm thử nên chạy ít nhất ba kịch bản: nạp hợp lệ, nạp số âm, rút vượt số dư, mỗi kịch bản kiểm cả số dư lẫn độ dài nhật ký.",
      focus: ["key", "shield", "file"],
      edges: ["key-shield", "key-file"],
      metrics: { public: "2", private: "2", guards: "2", violations: "0" },
      changes: ["Thêm kiểm thử cho số dư âm", "Getter trả bản sao phòng thủ"],
      note: "Bất biến chỉ có nghĩa khi có kiểm thử chứng minh."
    },
    {
      short: "Setter",
      type: "pitfall",
      title: "Setter phá đóng gói",
      body: "Pitfall thường gặp là thêm setter cho mọi trường để tiện. Khi có <code>setSoDu(long)</code> công khai, bất biến số dư không âm biến mất vì bất kỳ ai cũng gán được <code>-1</code>. Một biến thể khác là trả về chính đối tượng nội bộ từ getter, khiến đóng gói chỉ còn trên giấy. Cách sửa: bỏ setter, thay bằng phương thức nghiệp vụ có kiểm tra, và trả bản sao phòng thủ. Đo lường đơn giản: đếm số trường private có setter công khai, mục tiêu là 0, và đếm số phương thức public có ít nhất một điểm kiểm tra.",
      focus: ["key", "alert", "shield"],
      edges: ["check-alert", "key-shield"],
      metrics: { public: "3", private: "2", guards: "1", violations: "3" },
      changes: ["Setter công khai xuất hiện", "Bất biến bị phá ở ba điểm"],
      note: "Setter tự do là cửa sau không kiểm tra."
    },
    {
      short: "Tổng kết",
      type: "final",
      title: "Ba việc của đóng gói",
      body: "Tóm lại, đóng gói gồm đúng 3 việc: che trường bằng <code>private</code>, mở phương thức nghiệp vụ có kiểm tra, và không rò rỉ tham chiếu nội bộ. Lớp <code>TaiKhoan</code> giữ 2 trường private, 2 phương thức public và 2 điểm kiểm tra, nhờ đó bất biến số dư luôn đúng. Khi thiết kế lớp mới, hãy viết bất biến trước rồi mới viết API. Bài Kế thừa tiếp theo sẽ dùng chính lớp này làm lớp cha để mở rộng hành vi mà không phá quy tắc đã đặt ra. API thu gọn còn 2 phương thức public, đủ cho nghiệp vụ nạp và rút.",
      focus: "all",
      edges: "all",
      metrics: { public: "2", private: "2", guards: "2", violations: "0" },
      changes: ["API thu gọn còn hai phương thức", "Bất biến được giữ ở mọi bước"],
      note: "Đóng gói là nền để kế thừa an toàn.",
      tone: "final"
    }
  ]
};

window.SELAB.lessons["ke-thua"] = {
  id: "ke-thua",
  module: "oop-nen-tang",
  title: "Kế thừa",
  shortTitle: "Kế thừa",
  subtitle: "Lớp cha, lớp con và ghi đè có kiểm soát",
  blurb: "Kế thừa tái sử dụng hành vi chung nhưng phải kiểm soát độ sâu và hợp đồng. Xem một lớp cha trừu tượng, ba lớp con gọi super, cách ghi đè phương thức và dấu hiệu cây quá sâu cần chuyển sang composition.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["extends", "super", "override", "abstract", "protected"],
  metrics: [
    { key: "depth", label: "Độ sâu cây", tone: "blue" },
    { key: "children", label: "Lớp con", tone: "mint" },
    { key: "overrides", label: "Phương thức ghi đè", tone: "violet" },
    { key: "reuse", label: "Mã dùng lại", tone: "green" }
  ],
  nodes: [
    { id: "contract", type: "book", x: 55, y: 80, w: 200, h: 70, label: "Hợp đồng lớp cha", sub: "abstract + protected" },
    { id: "parent", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Lớp cha NhanVien", sub: "2 trường, 1 abstract" },
    { id: "override", type: "star", x: 625, y: 80, w: 200, h: 70, label: "Ghi đè", sub: "tinhLuong()" },
    { id: "ketoan", type: "code", x: 55, y: 310, w: 200, h: 70, label: "KeToan", sub: "extends NhanVien" },
    { id: "kysu", type: "code", x: 340, y: 310, w: 200, h: 70, label: "KySu", sub: "extends NhanVien" },
    { id: "thukho", type: "code", x: 625, y: 310, w: 200, h: 70, label: "ThuKho", sub: "extends NhanVien" },
    { id: "ctor", type: "event", x: 340, y: 195, w: 200, h: 70, label: "super()", sub: "chạy constructor cha" }
  ],
  edges: [
    { id: "contract-parent", from: "contract", to: "parent", kind: "request", label: "ràng buộc" },
    { id: "parent-override", from: "parent", to: "override", kind: "control", label: "cho phép" },
    { id: "parent-ctor", from: "parent", to: "ctor", kind: "control", label: "gọi" },
    { id: "ctor-ketoan", from: "ctor", to: "ketoan", kind: "data", label: "khởi tạo" },
    { id: "ctor-kysu", from: "ctor", to: "kysu", kind: "data", label: "khởi tạo" },
    { id: "ctor-thukho", from: "ctor", to: "thukho", kind: "data", label: "khởi tạo" },
    { id: "override-thukho", from: "override", to: "thukho", kind: "control", label: "áp dụng" }
  ],
  learn: [
    "Kế thừa chỉ đúng khi quan hệ thật sự là is-a.",
    "Constructor lớp con phải gọi super trước khi dùng trường riêng.",
    "Ghi đè phải giữ chữ ký và không thu hẹp quyền truy cập.",
    "Cây sâu hơn ba tầng là dấu hiệu nên chuyển sang composition."
  ],
  steps: [
    {
      short: "Is-a",
      type: "concept",
      title: "Is-a thật hay chỉ tiện",
      body: "Kế thừa biểu diễn quan hệ is-a: lớp con là một phiên bản chuyên biệt của lớp cha. Lớp <code>NhanVien</code> giữ hai trường chung <code>ma</code> và <code>luongCoBan</code>, cùng phương thức trừu tượng <code>tinhLuong()</code>. Ba lớp con <code>KeToan</code>, <code>KySu</code>, <code>ThuKho</code> chỉ cần viết phần riêng thay vì lặp lại mã. Kế thừa giảm khoảng 40% dòng lệnh trùng, nhưng cũng buộc lớp con tuân theo hợp đồng của cha. Chỉ dùng khi quan hệ thật sự là is-a, không phải để tái sử dụng tiện tay, vì cây sai sẽ rất khó gỡ về sau.",
      focus: ["contract", "parent", "kysu"],
      edges: ["contract-parent"],
      metrics: { depth: "2", children: "3", overrides: "0", reuse: "40%" },
      changes: ["Lớp cha giữ hai trường chung", "Ba lớp con kế thừa hợp đồng"],
      note: "Hỏi is-a trước khi viết extends."
    },
    {
      short: "super",
      type: "flow",
      title: "super chạy trước",
      body: "Khi tạo <code>new KySu(\"KS01\", 12000000)</code>, constructor lớp con chạy trước phần thân của nó nhưng phải gọi <code>super(ma, luongCoBan)</code> ở dòng đầu. Lớp cha khởi tạo trường chung, sau đó lớp con gán thêm trường riêng như <code>heSo</code>. Nếu bỏ <code>super</code>, trình biên dịch chèn lời gọi không tham số và báo lỗi khi lớp cha không có constructor rỗng. Thứ tự này giải thích vì sao không thể dùng trường của lớp con trước khi <code>super</code> hoàn tất. Một constructor cha chạy đúng một lần cho mỗi đối tượng, dù cây có ba tầng.",
      focus: ["parent", "ctor", "kysu"],
      edges: ["parent-ctor", "ctor-kysu"],
      metrics: { depth: "2", children: "3", overrides: "0", reuse: "40%" },
      changes: ["super chạy trước thân lớp con", "Trường heSo được gán sau"],
      note: "super là dòng đầu tiên, không phải tùy chọn."
    },
    {
      short: "Ghi đè",
      type: "detail",
      title: "Ghi đè giữ hợp đồng",
      body: "Ghi đè cho phép lớp con thay hành vi nhưng phải giữ hợp đồng: cùng tên, cùng tham số, kiểu trả về tương thích và không thu hẹp quyền truy cập. <code>KySu</code> ghi đè <code>tinhLuong()</code> bằng <code>luongCoBan * heSo</code>, trong khi <code>KeToan</code> cộng phụ cấp 10%. Gắn <code>@Override</code> để trình biên dịch kiểm tra chữ ký. Lớp cha nên khai báo <code>protected</code> cho trường cần dùng và <code>final</code> cho phương thức không muốn bị thay. Đây là ranh giới giữa mở rộng có kiểm soát và phá vỡ thiết kế, nên hãy ghi rõ trong tài liệu lớp.",
      focus: ["parent", "override", "ketoan"],
      edges: ["parent-override", "override-thukho"],
      metrics: { depth: "2", children: "3", overrides: "3", reuse: "40%" },
      changes: ["Ba lớp con ghi đè tinhLuong", "Thêm @Override để kiểm chữ ký"],
      note: "Ghi đè là thay ruột, không đổi hợp đồng."
    },
    {
      short: "Cây sâu",
      type: "pitfall",
      title: "Cây sâu và fragile base",
      body: "Cây kế thừa sâu là pitfall tốn kém. Với bốn tầng và mười lớp con, một thay đổi ở lớp gốc có thể ảnh hưởng 14 lớp, trong khi chỉ hai lớp thật sự cần hành vi mới. Vấn đề fragile base class khiến sửa cha làm hỏng con theo cách không thấy khi đọc mã. Dấu hiệu: nhiều lớp con ghi đè cùng một phương thức, hoặc lớp con không dùng phần lớn trường của cha. Khi đó hãy chuyển sang <code>composition</code>: giữ một đối tượng thành phần và ủy quyền, thay vì ép mọi thứ vào cây.",
      focus: ["parent", "thukho", "override"],
      edges: ["parent-ctor", "override-thukho"],
      metrics: { depth: "4", children: "3", overrides: "3", reuse: "18%" },
      changes: ["Cây tăng lên bốn tầng", "Tỉ lệ dùng lại giảm còn 18%"],
      note: "Cây càng sâu, thay đổi càng lan rộng."
    },
    {
      short: "Tổng kết",
      type: "final",
      title: "Kế thừa có kỷ luật",
      body: "Tóm lại, kế thừa gồm đúng 1 lớp cha trừu tượng, 3 lớp con và 4 quy tắc: gọi <code>super</code> trước, giữ chữ ký khi ghi đè, không thu hẹp quyền truy cập, và giữ cây nông. Lớp cha đặt hợp đồng, lớp con cung cấp phần riêng, còn <code>@Override</code> giúp phát hiện sai lệch ngay khi biên dịch. Khi cây vượt ba tầng hoặc có quá nhiều override, hãy cân nhắc composition. Bài Đa hình sẽ cho thấy vì sao hợp đồng này là nền tảng để gọi thống nhất trên nhiều lớp con.",
      focus: "all",
      edges: "all",
      metrics: { depth: "2", children: "3", overrides: "3", reuse: "40%" },
      changes: ["Chốt bốn quy tắc kế thừa", "Sẵn sàng sang bài Đa hình"],
      note: "Kế thừa là hợp đồng, không phải mẹo tái sử dụng.",
      tone: "final"
    }
  ]
};

window.SELAB.lessons["da-hinh"] = {
  id: "da-hinh",
  module: "oop-nen-tang",
  title: "Đa hình",
  shortTitle: "Đa hình",
  subtitle: "Một lời gọi, nhiều phiên bản thực thi",
  blurb: "Đa hình cho phép cùng một lời gọi chạy đúng phiên bản theo kiểu thực tế của đối tượng. Bài học bóc tách bảng phương thức ảo, phân giải động, ép kiểu an toàn và khác biệt giữa nạp chồng với ghi đè.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["polymorphism", "override", "vtable", "dispatch", "instanceof"],
  metrics: [
    { key: "refs", label: "Tham chiếu cha", tone: "blue" },
    { key: "vtable", label: "Mục vtable", tone: "violet" },
    { key: "dispatch", label: "Kiểu phân giải", tone: "green" },
    { key: "latency", label: "Chi phí gọi", tone: "coral" }
  ],
  nodes: [
    { id: "ref", type: "key", x: 55, y: 80, w: 200, h: 70, label: "Tham chiếu kiểu cha", sub: "Hinh h = new HinhTron(2)" },
    { id: "vtable", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Bảng phương thức ảo", sub: "vtable 3 mục" },
    { id: "call", type: "api", x: 625, y: 80, w: 200, h: 70, label: "Lời gọi dienTich()", sub: "phân giải lúc chạy" },
    { id: "circle", type: "star", x: 55, y: 310, w: 200, h: 70, label: "Hình tròn", sub: "override dienTich()" },
    { id: "rect", type: "code", x: 340, y: 310, w: 200, h: 70, label: "Hình chữ nhật", sub: "override dienTich()" },
    { id: "tri", type: "code", x: 625, y: 310, w: 200, h: 70, label: "Hình tam giác", sub: "override dienTich()" }
  ],
  edges: [
    { id: "ref-vtable", from: "ref", to: "vtable", kind: "request", label: "tra cứu" },
    { id: "vtable-call", from: "vtable", to: "call", kind: "data", label: "chọn hàm" },
    { id: "call-circle", from: "call", to: "circle", kind: "control", label: "gọi" },
    { id: "call-rect", from: "call", to: "rect", kind: "control", label: "gọi" },
    { id: "call-tri", from: "call", to: "tri", kind: "control", label: "gọi" },
    { id: "ref-rect", from: "ref", to: "rect", kind: "data", label: "trỏ tới" }
  ],
  learn: [
    "Đa hình chọn mã theo kiểu thực tế của đối tượng lúc chạy.",
    "Ghi đè phương thức ảo là cơ chế tạo đa hình.",
    "Vtable thêm một bước tra cứu nhỏ, đổi lại mã dễ mở rộng.",
    "Nạp chồng quyết định lúc biên dịch nên không phải đa hình."
  ],
  steps: [
    {
      short: "Nhiều hình",
      type: "concept",
      title: "Một lời gọi, nhiều hình",
      body: "Đa hình là khả năng một lời gọi mang nhiều hình thái hành vi tùy kiểu thực tế của đối tượng. Khai báo <code>Hinh h = new HinhTron(2)</code> cho phép biến kiểu cha trỏ tới đối tượng con, và <code>h.dienTich()</code> chạy phiên bản của <code>HinhTron</code>. Trình biên dịch chỉ kiểm tra rằng <code>Hinh</code> có phương thức đó; việc chọn mã thật diễn ra lúc chạy. Nhờ vậy một mảng 3 hình khác nhau vẫn duyệt bằng cùng một vòng lặp mà không cần <code>if</code> theo kiểu, và thêm hình mới chỉ cần thêm một lớp.",
      focus: ["ref", "vtable", "circle"],
      edges: ["ref-vtable", "ref-rect"],
      metrics: { refs: "1", vtable: "1", dispatch: "động", latency: "2 ns" },
      changes: ["Biến kiểu cha trỏ đối tượng con", "Lời gọi không cần if theo kiểu"],
      note: "Kiểu khai báo và kiểu thực tế có thể khác nhau."
    },
    {
      short: "Vtable",
      type: "flow",
      title: "Vtable và phân giải động",
      body: "Mỗi lớp có bảng phương thức ảo, thường gọi là vtable, chứa địa chỉ các phương thức có thể bị ghi đè. Với 3 lớp con, bảng của <code>HinhTron</code> trỏ tới <code>dienTich</code> riêng, còn bảng của <code>HinhChuNhat</code> trỏ tới phiên bản khác. Khi gọi <code>h.dienTich()</code>, máy ảo đọc vtable của đối tượng thật rồi nhảy tới ô tương ứng, tốn thêm một lần tra cứu. Cơ chế này là phân giải động, khác với phân giải tĩnh dựa trên kiểu khai báo. Chi phí thường chỉ vài nano giây, nhỏ hơn nhiều so với lợi ích thiết kế.",
      focus: ["ref", "vtable", "call"],
      edges: ["ref-vtable", "vtable-call"],
      metrics: { refs: "1", vtable: "3", dispatch: "động", latency: "2 ns" },
      changes: ["Đọc vtable của đối tượng thật", "Nhảy tới ô phương thức tương ứng"],
      note: "Phân giải động tốn một lần tra bảng."
    },
    {
      short: "Ép kiểu",
      type: "detail",
      title: "Ép kiểu có kiểm tra",
      body: "Ép kiểu xuống chỉ an toàn khi kiểm tra trước. <code>if (h instanceof HinhTron)</code> rồi mới ép <code>(HinhTron) h</code> để đọc <code>banKinh</code>. Từ Java 16 có thể viết <code>if (h instanceof HinhTron tron)</code> để nhận biến mẫu, tránh ép lặp lại. Nếu ép sai, <code>ClassCastException</code> ném ngay tại dòng đó. Lạm dụng <code>instanceof</code> trong vòng lặp thường là dấu hiệu thiết kế đa hình chưa đủ: hãy đưa hành vi vào phương thức chung thay vì rẽ nhánh theo kiểu, và chỉ ép khi thật sự cần truy cập API riêng của lớp con.",
      focus: ["ref", "circle", "tri"],
      edges: ["call-circle", "call-tri"],
      metrics: { refs: "1", vtable: "3", dispatch: "động", latency: "2 ns" },
      changes: ["Kiểm tra instanceof trước khi ép", "Truy cập API riêng có kiểm soát"],
      note: "Ép kiểu không kiểm tra là mầm ClassCastException."
    },
    {
      short: "Nạp chồng",
      type: "pitfall",
      title: "Nạp chồng không đa hình",
      body: "Nạp chồng và ghi đè khác nhau ở thời điểm quyết định. Nạp chồng chọn phiên bản theo kiểu tĩnh của tham số ngay khi biên dịch; ghi đè chọn theo kiểu động của đối tượng lúc chạy. Đoạn <code>f(Hinh)</code> và <code>f(HinhTron)</code> với biến khai báo <code>Hinh</code> luôn gọi bản <code>f(Hinh)</code>, dù đối tượng là hình tròn, nên không phải đa hình. Đây là câu hỏi bẫy phổ biến trong kiểm thử. Muốn đa hình thật, hãy gọi phương thức ảo trên đối tượng thay vì dựa vào tham số nạp chồng. Trình biên dịch chọn trong 2 phiên bản ngay tại dòng gọi.",
      focus: ["call", "rect", "tri"],
      edges: ["call-rect", "vtable-call"],
      metrics: { refs: "1", vtable: "1", dispatch: "tĩnh", latency: "0 ns" },
      changes: ["Lời gọi bị chọn theo kiểu khai báo", "Không chạy phiên bản của lớp con"],
      note: "Nạp chồng chọn lúc biên dịch, không phải lúc chạy."
    },
    {
      short: "Tổng kết",
      type: "final",
      title: "Ba điều kiện của đa hình",
      body: "Tóm lại, đa hình cần 3 điều: lớp cha hoặc interface khai báo phương thức, lớp con ghi đè, và biến kiểu cha trỏ tới đối tượng con. Với 3 hình, một vòng lặp và một lời gọi <code>dienTich()</code> xử lý đủ mọi trường hợp, không cần chuỗi <code>if</code>. Phân giải động đi qua vtable nên thêm một bước tra cứu nhỏ, đổi lại mã mở rộng dễ hơn. Hãy dùng <code>instanceof</code> có kiểm soát và nhớ nạp chồng không tạo ra đa hình. Một vòng lặp duy nhất xử lý cả 3 hình và vẫn đúng khi thêm hình mới.",
      focus: "all",
      edges: "all",
      metrics: { refs: "1", vtable: "3", dispatch: "động", latency: "2 ns" },
      changes: ["Chốt ba điều kiện đa hình", "Hoàn tất module OOP nền tảng"],
      note: "Ba điều kiện đủ: hợp đồng, ghi đè, tham chiếu cha.",
      tone: "final"
    }
  ]
};

window.SELAB.practice.push(
  {
    tag: "OOP",
    title: "Mô hình hoá một đối tượng",
    scenario: "Một nhóm sinh viên xây chức năng quản lý thư viện và tạo lớp Sach với các trường maSach, tuaDe, namXuatBan, cùng phương thức muon(). Họ tranh luận nên tạo đối tượng ở đâu và cần bao nhiêu thực thể cho hai cuốn sách khác nhau. Một bạn đề nghị dùng biến toàn cục để tiện truy cập, bạn khác muốn mỗi lần mượn tạo bản sao. Trước khi viết mã, nhóm cần chốt mô hình nào phản ánh đúng vòng đời và trạng thái riêng của từng cuốn sách.",
    metrics: [
      { label: "Số lớp", value: "1" },
      { label: "Đối tượng cần", value: "2" },
      { label: "Trạng thái riêng", value: "Bắt buộc" }
    ],
    options: [
      "Dùng một biến toàn cục duy nhất cho cả hai cuốn sách để tiết kiệm bộ nhớ.",
      "Khai báo lớp nhưng không gọi new, chỉ gán null cho tới khi cần.",
      "Tạo hai đối tượng bằng new, mỗi đối tượng giữ trạng thái mượn riêng.",
      "Lưu tất cả dữ liệu vào một mảng chuỗi và bỏ lớp Sach."
    ],
    correct: 2,
    explain: "Mỗi cuốn sách là một thực thể độc lập, nên cần hai lời gọi <code>new Sach(...)</code> để có hai vùng trạng thái riêng trên heap. Biến toàn cục dùng chung sẽ khiến mượn cuốn thứ nhất làm đổi trạng thái cuốn thứ hai, còn giữ null thì mọi lời gọi phương thức đều ném NullPointerException. Lớp chỉ là khuôn, không tự sinh đối tượng. Cách đúng là khai báo hai tham chiếu, khởi tạo ngay, rồi gọi <code>muon()</code> trên từng đối tượng. Mô hình này cũng mở đường cho đóng gói ở bài sau. Đây là bài học đầu tiên của module."
  },
  {
    tag: "ENCAPS",
    title: "Setter mở toang cánh cửa",
    scenario: "Lớp TaiKhoan có trường private long soDu và phương thức napTien kiểm tra số tiền dương. Một lập trình viên thêm public void setSoDu(long v) để tiện cho bộ kiểm thử, rồi một đoạn mã khác gán -500000. Sau đó màn hình hiển thị số dư âm và báo cáo cuối ngày lệch 12 dòng. Bộ kiểm thử chỉ gọi setter vì muốn tạo nhanh trạng thái ban đầu, và không có ca nào kiểm số dư âm. Nhóm cần quyết định giữ hay bỏ setter, đồng thời sửa getter trả danh sách giao dịch.",
    metrics: [
      { label: "Trường private", value: "1" },
      { label: "Setter công khai", value: "1" },
      { label: "Bất biến", value: "soDu >= 0" }
    ],
    options: [
      "Giữ setter nhưng thêm ghi chú nhắc không truyền số âm.",
      "Bỏ setter, chỉ cho thay đổi qua napTien và rutTien có kiểm tra.",
      "Đổi trường soDu thành public để mọi nơi thấy rõ giá trị.",
      "Xóa kiểm tra trong napTien để luồng chạy nhanh hơn."
    ],
    correct: 1,
    explain: "Đóng gói chỉ có giá trị khi mọi thay đổi đi qua một cửa có kiểm tra. Setter công khai tạo cửa thứ hai không kiểm tra, nên bất biến <code>soDu >= 0</code> bị phá dù phương thức nạp tiền vẫn đúng. Bỏ setter, giữ hai phương thức nghiệp vụ và trả bản sao danh sách giao dịch là cách sửa gốc. Ghi chú không ngăn được lỗi vì trình biên dịch không đọc ghi chú. Đổi sang public còn tệ hơn: mọi lớp khác đều ghi trực tiếp được. Kiểm thử cần có ca gán số âm để chứng minh cửa đã đóng."
  },
  {
    tag: "POLY",
    title: "Vòng lặp ba hình",
    scenario: "Trong bài tập vẽ hình, nhóm tạo lớp cha Hinh với phương thức dienTich() và ba lớp con HinhTron, HinhChuNhat, HinhTamGiac. Họ đưa ba đối tượng vào mảng kiểu Hinh[] rồi tính tổng diện tích. Một bạn viết chuỗi if (h instanceof ...) cho từng loại, bạn khác chỉ gọi h.dienTich(). Mỗi hình có công thức riêng và không hình nào muốn biết hình kia tồn tại. Nhóm cần chọn cách nào đúng tinh thần đa hình và dễ thêm hình mới mà không sửa vòng lặp, không đụng mã tính tổng.",
    metrics: [
      { label: "Số hình", value: "3" },
      { label: "Lời gọi trong vòng lặp", value: "1" },
      { label: "Chi phí thêm hình", value: "1 lớp" }
    ],
    options: [
      "Dùng chuỗi if instanceof để kiểm soát từng kiểu cụ thể.",
      "Gọi h.dienTich() trên biến kiểu Hinh, để phân giải động chọn phiên bản.",
      "Ép mọi đối tượng về HinhTron trước khi tính.",
      "Lưu ba mảng riêng và viết ba vòng lặp."
    ],
    correct: 1,
    explain: "Gọi <code>h.dienTich()</code> trên biến kiểu <code>Hinh</code> kích hoạt phân giải động: máy ảo đọc vtable của đối tượng thật và chạy đúng phiên bản. Chuỗi <code>instanceof</code> vẫn cho kết quả đúng nhưng buộc sửa vòng lặp mỗi khi thêm hình, đồng thời bỏ qua hợp đồng của lớp cha. Ép về <code>HinhTron</code> gây <code>ClassCastException</code> với hai hình còn lại. Ba vòng lặp riêng làm tăng gấp ba chỗ trùng mã. Thêm <code>HinhVuong</code> chỉ cần một lớp mới ghi đè phương thức. Đây là ví dụ kinh điển của nguyên lý mở để mở rộng, đóng để sửa."
  }
);

window.SELAB.cheatsheets.push({
  id: "oop",
  num: "01",
  title: "OOP & bốn trụ cột",
  intro: "Bốn trụ cột hướng đối tượng trong một trang: khai báo lớp đóng gói, kế thừa có kiểm soát, đa hình qua ghi đè và bảng so sánh nhanh để chọn đúng công cụ cho từng tình huống.",
  cards: [
    {
      title: "Lớp đóng gói đầy đủ",
      wide: true,
      html: `<p>Trường dữ liệu để <code>private</code>, constructor kiểm tra tham số, phương thức nghiệp vụ giữ bất biến.</p>
<pre><code class="language-Java">public class TaiKhoan {
    private final String maTK;
    private long soDu;

    public TaiKhoan(String maTK, long soDuBanDau) {
        this.maTK = maTK;
        this.soDu = Math.max(0L, soDuBanDau);
    }

    public long getSoDu() {
        return soDu;
    }

    public void napTien(long soTien) {
        if (soTien &lt;= 0) {
            throw new IllegalArgumentException("So tien phai duong");
        }
        soDu += soTien;
    }
}</code></pre>`
    },
    {
      title: "Kế thừa và abstract",
      html: `<p>Lớp cha giữ hợp đồng, lớp con gọi <code>super</code> rồi ghi đè phần riêng.</p>
<pre><code class="language-Java">public abstract class NhanVien {
    protected final String ma;
    protected double luongCoBan;

    protected NhanVien(String ma, double luongCoBan) {
        this.ma = ma;
        this.luongCoBan = luongCoBan;
    }

    public abstract double tinhLuong();
}

public class KySu extends NhanVien {
    private final double heSo;

    public KySu(String ma, double luongCoBan, double heSo) {
        super(ma, luongCoBan);
        this.heSo = heSo;
    }

    @Override
    public double tinhLuong() {
        return luongCoBan * heSo;
    }
}</code></pre>`
    },
    {
      title: "Đa hình qua ghi đè",
      html: `<p>Biến kiểu cha gọi phương thức chung, máy ảo chọn phiên bản theo kiểu thật.</p>
<pre><code class="language-TypeScript">interface Hinh {
  dienTich(): number;
}

class HinhTron implements Hinh {
  constructor(private readonly banKinh: number) {}

  dienTich(): number {
    return Math.PI * this.banKinh ** 2;
  }
}

const ds: Hinh[] = [new HinhTron(2), new HinhTron(3)];
const tong = ds.reduce((s, h) => s + h.dienTich(), 0);</code></pre>`
    },
    {
      title: "Bảng so sánh nhanh",
      wide: true,
      html: `<table class="cheat-table">
<thead><tr><th>Tiêu chí</th><th>interface</th><th>abstract class</th></tr></thead>
<tbody>
<tr><td>Đa kế thừa</td><td>Có, một lớp hiện nhiều interface</td><td>Không, chỉ một lớp cha</td></tr>
<tr><td>Trạng thái</td><td>Không giữ trường thực</td><td>Giữ trường và constructor</td></tr>
<tr><td>Mức ràng buộc</td><td>Hợp đồng hành vi</td><td>Hợp đồng kèm mã dùng chung</td></tr>
<tr><td>Khi nào dùng</td><td>Cần nhiều kiểu cùng hành vi</td><td>Cần nền chung có trạng thái</td></tr>
</tbody>
</table>
<table class="cheat-table">
<thead><tr><th>Tiêu chí</th><th>Nạp chồng</th><th>Ghi đè</th></tr></thead>
<tbody>
<tr><td>Chọn lúc</td><td>Biên dịch, theo kiểu tham số</td><td>Chạy, theo kiểu đối tượng</td></tr>
<tr><td>Chữ ký</td><td>Khác tham số</td><td>Giữ nguyên</td></tr>
<tr><td>Đa hình</td><td>Không</td><td>Có</td></tr>
</tbody>
</table>`
    },
    {
      title: "Checklist thiết kế lớp",
      html: `<ul class="cheat-check">
<li>Trường dữ liệu để private, không có setter công khai.</li>
<li>Constructor kiểm tra tham số và giữ bất biến.</li>
<li>Getter trả bản sao với collection và mảng.</li>
<li>Ghi đè có <code>@Override</code>, không thu hẹp quyền truy cập.</li>
<li>Cây kế thừa tối đa ba tầng, ưu tiên composition.</li>
<li>Gọi hành vi qua kiểu cha, hạn chế <code>instanceof</code>.</li>
<li>Bất biến có ít nhất một ca kiểm thử thất bại được.</li>
</ul>`
    }
  ]
});
