/* SELab — dữ liệu khóa thiết kế hướng đối tượng, phần 3: mẫu thiết kế */
window.SELAB = window.SELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  "use strict";

  window.SELAB.modules.push({
    id: "mau-thiet-ke",
    num: "03",
    title: "Mẫu thiết kế",
    tone: "yellow",
    blurb: "Ba nhóm mẫu thiết kế kinh điển nhìn qua sơ đồ thay vì danh sách thuộc lòng: khởi tạo che cách tạo object, cấu trúc ghép object linh hoạt, hành vi tách thuật toán khỏi nơi gọi. Mỗi bài có ví dụ TypeScript, Java và tình huống lạm dụng.",
    lessons: ["creational", "structural", "behavioral"]
  });

  Object.assign(window.SELAB.lessons, {
    /* ------------------------------------------------------------------
       Bài 1: nhóm khởi tạo
       ------------------------------------------------------------------ */
    creational: {
      id: "creational",
      module: "mau-thiet-ke",
      title: "Mẫu khởi tạo",
      shortTitle: "Khởi tạo",
      subtitle: "Nhóm khởi tạo trả lời một câu hỏi hẹp: ai được phép gọi new, và làm sao để nơi dùng không biết lớp cụ thể. Factory Method, Builder và Singleton giải ba bài toán khác nhau, không thay thế nhau.",
      blurb: "Che lớp cụ thể sau interface, để mã nghiệp vụ chỉ nói loại sản phẩm cần dùng. Bài đi qua Factory Method, Builder và Singleton kèm ví dụ TypeScript, cùng lúc chỉ ra cái giá phải trả.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["factory", "builder", "singleton", "interface", "khởi tạo"],
      metrics: [
        { key: "tao", label: "Tạo object", tone: "blue" },
        { key: "linh-hoat", label: "Linh hoạt", tone: "green" },
        { key: "phu-thuoc", label: "Phụ thuộc", tone: "violet" },
        { key: "rui-ro", label: "Rủi ro", tone: "coral" }
      ],
      nodes: [
        { id: "client", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Mã nghiệp vụ", sub: "chỉ biết interface" },
        { id: "factory", type: "api", x: 340, y: 80, w: 200, h: 70, label: "Factory Method", sub: "create() trả Product" },
        { id: "builder", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Builder", sub: "dựng object 6 bước" },
        { id: "product", type: "page", x: 55, y: 310, w: 200, h: 70, label: "Product interface", sub: "3 method công khai" },
        { id: "concrete", type: "code", x: 340, y: 310, w: 200, h: 70, label: "ConcreteProduct", sub: "12 trường, 4 ràng buộc" },
        { id: "registry", type: "key", x: 625, y: 310, w: 200, h: 70, label: "Registry", sub: "ánh xạ 8 loại" },
        { id: "singleton", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Singleton", sub: "một instance / JVM" }
      ],
      edges: [
        { id: "client-factory", from: "client", to: "factory", kind: "request", label: "create(kind)" },
        { id: "factory-concrete", from: "factory", to: "concrete", kind: "control", label: "new theo loại" },
        { id: "concrete-product", from: "concrete", to: "product", kind: "control", label: "implements" },
        { id: "builder-product", from: "builder", to: "product", kind: "data", label: "dựng 6 bước" },
        { id: "registry-factory", from: "registry", to: "factory", kind: "data", label: "tra 8 loại" },
        { id: "singleton-registry", from: "singleton", to: "registry", kind: "control", label: "một thể hiện" },
        { id: "product-client", from: "product", to: "client", kind: "response", label: "dùng interface" }
      ],
      learn: [
        "Phân biệt ba bài toán tạo object khác nhau trong nhóm khởi tạo.",
        "Đọc một Factory Method và chỉ ra lớp cụ thể bị che ở đâu.",
        "Dùng Builder cho object nhiều trường tùy chọn và kiểm ràng buộc.",
        "Nhận ra Singleton đang giấu phụ thuộc toàn cục trong test."
      ],
      steps: [
        {
          short: "Bài toán new",
          type: "concept",
          title: "Mười bốn chỗ gọi new",
          body: "Trong một module báo cáo, <code>ReportService</code> gọi <code>new PdfReport()</code> ở 14 chỗ. Khi khách cần thêm bản Excel, bạn sửa 14 chỗ và chạy lại toàn bộ 96 test. Vấn đề không nằm ở việc tạo object, mà ở chỗ mã nghiệp vụ biết quá rõ lớp cụ thể: tên lớp, tham số khởi tạo, thứ tự cấu hình. Chỉ cần một nhà máy đứng giữa, nơi dùng chỉ cần nói <code>create(\"pdf\")</code>. Nhóm khởi tạo không làm code ngắn hơn; nó dồn mọi quyết định tạo object về một chỗ để lần thay đổi sau chỉ chạm một tệp.",
          focus: ["client"],
          edges: ["client-factory"],
          metrics: { "tao": "14 điểm new", "linh-hoat": "thấp", "phu-thuoc": "lớp cụ thể", "rui-ro": "sửa 14 chỗ" },
          changes: ["Đếm số điểm gọi new trong module", "Gom quyết định tạo object về một chỗ"],
          note: "Chi phí thật của new không nằm ở một dòng lệnh mà ở số chỗ phải sửa khi loại sản phẩm đổi."
        },
        {
          short: "Factory",
          type: "flow",
          title: "Nhà máy trả interface",
          body: "<code>ReportFactory</code> khai báo một method <code>create(kind: ReportKind): Report</code>. Mỗi lớp con quyết định sản phẩm cụ thể: bản PDF dựng 3 phần, bản Excel dựng 5 sheet. Nơi dùng giữ biến kiểu <code>Report</code> và gọi <code>render()</code>, không cần biết lớp thật. Thêm loại mới nghĩa là thêm một lớp con và một dòng trong registry 8 loại, không sửa 14 điểm gọi cũ. Đổi lại, hệ thống có thêm một tầng gián tiếp: đọc luồng phải nhảy qua interface. Factory Method hợp khi số loại tăng dần theo thời gian; nếu chỉ có đúng một loại cố định, một hàm tạo đơn giản trung thực hơn.",
          focus: ["factory", "concrete", "product"],
          edges: ["client-factory", "factory-concrete", "concrete-product"],
          metrics: { "tao": "qua factory", "linh-hoat": "thêm lớp con", "phu-thuoc": "1 interface", "rui-ro": "thêm tầng" },
          changes: ["Khai báo factory trả về interface", "Đăng ký loại mới trong registry"],
          note: "Factory không xóa phụ thuộc; nó chuyển phụ thuộc từ 14 điểm gọi về một bảng đăng ký."
        },
        {
          short: "Builder",
          type: "detail",
          title: "Mười hai trường, năm tùy chọn",
          body: "<code>HttpRequest</code> có 12 trường, trong đó 5 trường tùy chọn. Constructor kiểu cũ nhận 12 tham số và sinh ra lời gọi <code>new HttpRequest(url, null, null, 3000, ...)</code> mà không ai đọc được. Builder đổi sang chuỗi gọi có tên: <code>new HttpRequest.Builder(url).timeout(3000).retry(2).build()</code>. Mỗi bước trả về chính builder, còn <code>build()</code> kiểm tra 4 ràng buộc rồi mới tạo object. Cái lợi không phải cú pháp đẹp mà là object luôn ở trạng thái hợp lệ: không có nửa cấu hình, không có tham số đặt nhầm vị trí. Với object dưới 4 trường, Builder chỉ thêm 40 dòng nhiễu.",
          focus: ["builder", "product"],
          edges: ["builder-product"],
          metrics: { "tao": "qua builder", "linh-hoat": "5 trường tùy chọn", "phu-thuoc": "1 builder", "rui-ro": "40 dòng nhiễu" },
          changes: ["Đổi constructor dài sang builder", "Kiểm ràng buộc ngay trong build()"],
          note: "Builder chỉ đáng dùng khi có nhiều trường tùy chọn hoặc ràng buộc giữa các trường."
        },
        {
          short: "Singleton",
          type: "pitfall",
          title: "Một thể hiện, sáu mươi ba tệp",
          body: "<code>ConfigManager.getInstance()</code> tiện đến mức bị gọi ở 63 tệp. Ba test chạy song song cùng sửa một thể hiện, kết quả phụ thuộc thứ tự, và không test nào có thể thay cấu hình riêng. Singleton biến trạng thái toàn cục thành thứ khó thấy: ai đổi, lúc nào, vì sao, đều không nằm trong chữ ký hàm. Trong Java, một <code>enum</code> một phần tử giữ được tính duy nhất và an toàn tuần tự hóa, nhưng vẫn không sửa được vấn đề phụ thuộc ẩn. Cách bền hơn là tạo một thể hiện ở composition root rồi truyền vào constructor; khi đó vòng đời rõ ràng và test có thể thay bằng bản giả.",
          focus: ["singleton", "registry"],
          edges: ["singleton-registry"],
          metrics: { "tao": "một thể hiện", "linh-hoat": "thấp", "phu-thuoc": "toàn cục", "rui-ro": "test song song" },
          changes: ["Thay getInstance() bằng tham số constructor", "Tạo thể hiện ở composition root"],
          note: "Singleton không sai về mặt kỹ thuật; nó sai khi trở thành cách mặc định để chia sẻ trạng thái."
        },
        {
          short: "Tóm tắt",
          type: "final",
          tone: "final",
          title: "Ba câu hỏi, ba mẫu",
          body: "Ba mẫu, ba câu hỏi khác nhau. Factory Method trả lời ai tạo object; Builder trả lời tạo object nhiều tham số thế nào cho hợp lệ; Singleton trả lời có đúng một thể hiện hay không, và câu trả lời thường nên là không. Điểm chung là đẩy quyết định khởi tạo ra khỏi mã nghiệp vụ, nhưng mỗi tầng gián tiếp đều có giá: thêm tệp, thêm bước đọc, thêm chỗ sai. Trước khi chọn, hãy đếm số điểm gọi <code>new</code> và số loại dự kiến trong 6 tháng. Bài tiếp theo chuyển sang nhóm cấu trúc, nơi vấn đề không còn là tạo object mà là ghép chúng mà không phá interface.",
          focus: "all",
          edges: "all",
          metrics: { "tao": "tách khỏi new", "linh-hoat": "theo loại", "phu-thuoc": "interface", "rui-ro": "đếm trước" },
          changes: ["Nắm ba câu hỏi của nhóm khởi tạo", "Chuẩn bị học nhóm cấu trúc"],
          note: "Bài tiếp theo: Adapter, Decorator, Facade và Proxy, bốn cách ghép object mà giữ nguyên interface."
        }
      ]
    },

    /* ------------------------------------------------------------------
       Bài 2: nhóm cấu trúc
       ------------------------------------------------------------------ */
    structural: {
      id: "structural",
      module: "mau-thiet-ke",
      title: "Mẫu cấu trúc",
      shortTitle: "Cấu trúc",
      subtitle: "Nhóm cấu trúc ghép object nhỏ thành cấu trúc lớn mà nơi dùng vẫn thấy một interface. Adapter, Decorator, Facade và Proxy xử lý bốn kiểu va chạm khác nhau: API lệch, hành vi cần bọc, hệ thống con rối, và truy cập cần kiểm soát.",
      blurb: "Ghép object mà không phá interface: Adapter chuyển API lệch, Decorator bọc thêm hành vi, Facade gom hệ thống con, Proxy kiểm soát truy cập. Bài dùng ví dụ thanh toán và cache 60 giây.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["adapter", "decorator", "facade", "proxy", "ghép object"],
      metrics: [
        { key: "co-che", label: "Cơ chế", tone: "blue" },
        { key: "be-mat", label: "Bề mặt API", tone: "green" },
        { key: "chi-phi", label: "Chi phí", tone: "violet" },
        { key: "rui-ro", label: "Rủi ro", tone: "coral" }
      ],
      nodes: [
        { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng đặt hàng", sub: "gọi checkout()" },
        { id: "facade", type: "api", x: 340, y: 80, w: 200, h: 70, label: "CheckoutFacade", sub: "một điểm vào" },
        { id: "adapter", type: "api", x: 625, y: 80, w: 200, h: 70, label: "PaymentAdapter", sub: "đổi 2 chữ ký" },
        { id: "legacy", type: "server", x: 625, y: 310, w: 200, h: 70, label: "Cổng cũ SOAP", sub: "1,8 giây mỗi lời gọi" },
        { id: "service", type: "code", x: 340, y: 310, w: 200, h: 70, label: "OrderService", sub: "4 method lõi" },
        { id: "decorator", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "LoggingDecorator", sub: "bọc + đo thời gian" },
        { id: "proxy", type: "memory", x: 340, y: 195, w: 200, h: 70, label: "CacheProxy", sub: "TTL 60 giây" }
      ],
      edges: [
        { id: "app-facade", from: "app", to: "facade", kind: "request", label: "checkout(cart)" },
        { id: "facade-adapter", from: "facade", to: "adapter", kind: "control", label: "thanh toán" },
        { id: "adapter-legacy", from: "adapter", to: "legacy", kind: "data", label: "SOAP/XML" },
        { id: "facade-service", from: "facade", to: "service", kind: "control", label: "tạo đơn" },
        { id: "decorator-proxy", from: "decorator", to: "proxy", kind: "control", label: "bọc lời gọi" },
        { id: "proxy-service", from: "proxy", to: "service", kind: "data", label: "cache 60 giây" },
        { id: "service-app", from: "service", to: "app", kind: "response", label: "JSON 200" }
      ],
      learn: [
        "Chọn Adapter khi hai interface không thể sửa để gặp nhau.",
        "Xếp Decorator theo thứ tự và hiểu vì sao thứ tự quyết định kết quả.",
        "Dùng Facade để gom 9 bước thành một điểm vào rõ ràng.",
        "Đặt khóa và TTL cho Proxy để cache không trả lời sai câu hỏi."
      ],
      steps: [
        {
          short: "Adapter",
          type: "concept",
          title: "Hai chữ ký không gặp nhau",
          body: "Đơn hàng đã có <code>OrderService</code> gọi thẳng cổng thanh toán cũ bằng <code>sendXml(String)</code>. Khi chuyển sang nhà cung cấp mới dùng JSON, bạn không thể sửa cổng cũ vì 6 đối tác vẫn chạy trên đó. Adapter đặt một lớp mỏng: phía ứng dụng vẫn gọi <code>pay(amount)</code>, bên trong chuyển sang XML, ánh xạ 8 trường và đổi mã lỗi. Nơi dùng không biết gì về SOAP, còn cổng cũ không phải sửa một dòng. Adapter không che khuyết điểm của API cũ, nó chỉ dời sự phức tạp vào một tệp có tên. Khi nào nên dùng: hai interface lệch nhau mà không bên nào sửa được.",
          focus: ["facade", "adapter", "legacy"],
          edges: ["facade-adapter", "adapter-legacy"],
          metrics: { "co-che": "lớp chuyển", "be-mat": "pay(amount)", "chi-phi": "8 trường ánh xạ", "rui-ro": "mã lỗi lệch" },
          changes: ["Bọc cổng cũ bằng adapter", "Ánh xạ mã lỗi về một kiểu chung"],
          note: "Adapter chỉ chuyển hình dạng lời gọi; nó không làm API cũ nhanh hơn hay đúng hơn."
        },
        {
          short: "Facade",
          type: "flow",
          title: "Chín bước thành một lời gọi",
          body: "<code>CheckoutFacade</code> gom ba hệ thống con: kho, thanh toán và vận chuyển. Trước đây một màn hình gọi 9 lời gọi theo đúng thứ tự, và quên bước giữ tồn kho làm bán quá 12 đơn. Facade đưa ra một method <code>checkout(cart)</code> thực hiện đủ 9 bước, trả về kết quả gọn hoặc ném lỗi đã phân loại. Đổi lại, facade dễ phình thành God Object nếu nhét cả quy tắc nghiệp vụ vào. Giữ nó là lớp điều phối: không tính giá, không quyết định khuyến mãi. Facade hợp khi có nhiều hệ thống con khó dùng; không hợp khi chỉ bọc một lớp duy nhất.",
          focus: ["app", "facade", "service"],
          edges: ["app-facade", "facade-service"],
          metrics: { "co-che": "điều phối", "be-mat": "1 method", "chi-phi": "9 bước ẩn", "rui-ro": "God Object" },
          changes: ["Gom 9 bước vào một method", "Giữ quy tắc giá ngoài facade"],
          note: "Facade là điểm vào, không phải nơi chứa toàn bộ nghiệp vụ của hệ thống."
        },
        {
          short: "Decorator",
          type: "detail",
          title: "Ba lớp bọc, bốn tổ hợp",
          body: "<code>LoggingDecorator</code> bọc <code>PaymentService</code> và đo thời gian từng lời gọi mà không sửa service. Xếp thêm <code>RetryDecorator</code> và <code>CacheDecorator</code>, bạn có 3 lớp bọc quanh cùng một interface. Thứ tự quan trọng: cache đặt ngoài retry sẽ trả kết quả cũ trong 60 giây, còn retry đặt ngoài cache sẽ thử lại cả lời gọi đã hỏng. Mỗi lớp chỉ làm một việc, nên 4 tổ hợp hành vi có thể ghép từ 3 lớp thay vì viết 4 lớp con. Cái giá là stack trace sâu 3 tầng và khó thấy lớp nào thật sự chạy. Decorator chỉ nên dùng khi hành vi cần cộng thêm, không phải để vá logic lõi.",
          focus: ["decorator", "proxy", "service"],
          edges: ["decorator-proxy", "proxy-service"],
          metrics: { "co-che": "bọc nhiều lớp", "be-mat": "không đổi", "chi-phi": "3 tầng stack", "rui-ro": "sai thứ tự" },
          changes: ["Tách đo giờ thành decorator riêng", "Chốt thứ tự cache, retry, log"],
          note: "Thứ tự lớp bọc là một phần của logic; hãy viết test cho đúng thứ tự đang chạy."
        },
        {
          short: "Proxy",
          type: "pitfall",
          title: "Khóa cache thiếu một chiều",
          body: "<code>CacheProxy</code> giữ kết quả tra cứu tồn kho trong 60 giây. Với 1.200 lượt xem mỗi phút, cache làm 92% lời gọi không chạm database, độ trễ giảm từ 180 ms xuống 12 ms. Nhưng khóa cache ban đầu chỉ là mã sản phẩm, thiếu kho và kênh bán, nên 12 đơn hiển thị tồn kho của kho khác. Proxy kiểm soát truy cập, không được phép trả lời sai câu hỏi. Khóa phải gồm đủ chiều dữ liệu, và TTL phải ngắn hơn mức chấp nhận của nghiệp vụ. Proxy cũng che lỗi: khi backend chết, cache cũ vẫn trả dữ liệu, nên cần chỉ số hit và tuổi dữ liệu để biết mình đang phục vụ bản cũ.",
          focus: ["proxy", "service", "app"],
          edges: ["proxy-service", "service-app"],
          metrics: { "co-che": "cache 60 giây", "be-mat": "như service", "chi-phi": "12 ms", "rui-ro": "khóa thiếu kho" },
          changes: ["Thêm kho và kênh bán vào khóa cache", "Đo tỉ lệ hit và tuổi dữ liệu"],
          note: "Cache sai khóa không phải lỗi hiệu năng mà là lỗi dữ liệu, và nó im lặng hơn hẳn."
        },
        {
          short: "Tóm tắt",
          type: "final",
          tone: "final",
          title: "Bốn kiểu va chạm",
          body: "4 mẫu cấu trúc, 4 kiểu va chạm. Adapter khi hai interface không thể gặp nhau; Facade khi một quy trình cần nhiều hệ thống con; Decorator khi hành vi cần cộng thêm theo lớp; Proxy khi truy cập cần kiểm soát hoặc cache. Chúng đều giữ nguyên <code>interface</code> phía người dùng, nên dễ cộng dồn đến mức không ai đọc nổi luồng thật. Một dấu hiệu lành mạnh: mỗi lớp bọc trả lời được một câu hỏi riêng và có test riêng. Bài tiếp theo sang nhóm hành vi, nơi cần tách thuật toán và sự kiện khỏi nơi kích hoạt.",
          focus: "all",
          edges: "all",
          metrics: { "co-che": "bốn kiểu", "be-mat": "giữ interface", "chi-phi": "tầng bọc", "rui-ro": "cộng dồn" },
          changes: ["Nắm bốn kiểu va chạm", "Chuẩn bị học nhóm hành vi"],
          note: "Bài tiếp theo: Strategy, Observer và Command, ba cách tách hành vi khỏi nơi gọi."
        }
      ]
    },

    /* ------------------------------------------------------------------
       Bài 3: nhóm hành vi
       ------------------------------------------------------------------ */
    behavioral: {
      id: "behavioral",
      module: "mau-thiet-ke",
      title: "Mẫu hành vi",
      shortTitle: "Hành vi",
      subtitle: "Nhóm hành vi tách thuật toán, sự kiện và thao tác khỏi nơi kích hoạt. Strategy đổi thuật toán, Observer phát sự kiện, Command đóng gói thao tác để hoãn hoặc hoàn tác.",
      blurb: "Tách thuật toán khỏi nơi gọi: Strategy thay cách tính phí, Observer phát sự kiện tới 12 người nghe, Command gói thao tác để hoàn tác. Ví dụ Java và TypeScript, kèm bẫy lạm dụng.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["strategy", "observer", "command", "sự kiện", "hoàn tác"],
      metrics: [
        { key: "thuat-toan", label: "Thuật toán", tone: "blue" },
        { key: "su-kien", label: "Sự kiện", tone: "green" },
        { key: "hoan-tac", label: "Hoàn tác", tone: "violet" },
        { key: "rui-ro", label: "Rủi ro", tone: "coral" }
      ],
      nodes: [
        { id: "ui", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Trang thanh toán", sub: "3 nút, 1 form" },
        { id: "context", type: "api", x: 340, y: 80, w: 200, h: 70, label: "OrderContext", sub: "giữ một Strategy" },
        { id: "strategy", type: "book", x: 625, y: 80, w: 200, h: 70, label: "ShippingStrategy", sub: "3 cách tính phí" },
        { id: "impls", type: "code", x: 625, y: 310, w: 200, h: 70, label: "Air, Road, Sea", sub: "cước 24.000-58.000" },
        { id: "subject", type: "event", x: 55, y: 310, w: 200, h: 70, label: "OrderEvents", sub: "12 người nghe" },
        { id: "observer", type: "task", x: 340, y: 310, w: 200, h: 70, label: "Email, SMS, Audit", sub: "3 observer" },
        { id: "command", type: "task", x: 340, y: 195, w: 200, h: 70, label: "PlaceOrderCommand", sub: "undo trong 1 bước" }
      ],
      edges: [
        { id: "ui-context", from: "ui", to: "context", kind: "request", label: "checkout()", bow: 22 },
        { id: "context-strategy", from: "context", to: "strategy", kind: "data", label: "tính phí" },
        { id: "strategy-impls", from: "strategy", to: "impls", kind: "control", label: "chọn theo vùng" },
        { id: "context-command", from: "context", to: "command", kind: "control", label: "đóng gói thao tác" },
        { id: "command-subject", from: "command", to: "subject", kind: "control", label: "phát OrderPlaced" },
        { id: "subject-observer", from: "subject", to: "observer", kind: "data", label: "12 người nghe" },
        { id: "context-ui", from: "context", to: "ui", kind: "response", label: "tổng 480.000", bow: -22 }
      ],
      learn: [
        "Thay chuỗi if bằng Strategy khi thuật toán thật sự biến thiên.",
        "Phát sự kiện qua Observer và cô lập lỗi của từng người nghe.",
        "Đóng gói thao tác bằng Command để xếp hàng và hoàn tác.",
        "Gỡ đăng ký observer để tránh rò rỉ và gửi trùng."
      ],
      steps: [
        {
          short: "Strategy",
          type: "concept",
          title: "Bảy nhánh trong một hàm",
          body: "Bảng phí vận chuyển có 7 nhánh <code>if</code> trong một hàm 180 dòng: theo vùng, theo cân nặng, theo hạng khách. Mỗi lần mở bán tỉnh mới, bạn sửa hàm và chạy lại 140 test. Strategy tách mỗi cách tính thành một lớp cùng interface <code>ShippingStrategy</code>, còn <code>OrderContext</code> chỉ giữ một tham chiếu và gọi <code>cost(order)</code>. Thêm vùng nghĩa là thêm một lớp, không chạm nhánh cũ. Điều kiện để đáng làm: thuật toán thật sự thay đổi theo dữ liệu cấu hình, không phải chỉ hai nhánh cố định. Với hai nhánh, một <code>if</code> rõ ràng còn dễ đọc hơn 4 tệp mới.",
          focus: ["ui", "context", "strategy"],
          edges: ["ui-context", "context-strategy"],
          metrics: { "thuat-toan": "3 lớp", "su-kien": "chưa có", "hoan-tac": "không", "rui-ro": "7 nhánh cũ" },
          changes: ["Tách mỗi cách tính phí thành một lớp", "Chọn strategy theo vùng"],
          note: "Strategy đổi thuật toán theo cấu hình; nếu chỉ có hai nhánh cố định, if vẫn trung thực hơn."
        },
        {
          short: "Observer",
          type: "flow",
          title: "Một sự kiện, mười hai người nghe",
          body: "Khi đơn được đặt, hệ thống phải gửi email, SMS và ghi audit. Trước đây <code>OrderService</code> gọi tuần tự 3 dịch vụ; email chậm 2 giây làm cả yêu cầu chậm theo, và một lỗi SMS làm mất bản ghi audit. Observer đảo chiều: service chỉ phát <code>OrderPlaced</code>, 12 người nghe tự đăng ký nhận. Mỗi người nghe chạy độc lập, lỗi của một người không chặn người khác, và thêm kênh mới không sửa service. Cái giá là luồng chạy khó lần: đọc một dòng phát sự kiện không cho biết có bao nhiêu việc xảy ra sau đó. Cần log mã sự kiện, thời gian từng người nghe và hàng đợi khi số người nghe tăng.",
          focus: ["command", "subject", "observer"],
          edges: ["command-subject", "subject-observer"],
          metrics: { "thuat-toan": "không đổi", "su-kien": "OrderPlaced", "hoan-tac": "chưa có", "rui-ro": "luồng khó lần" },
          changes: ["Phát OrderPlaced thay vì gọi tuần tự", "Cô lập lỗi từng người nghe"],
          note: "Observer đổi thời gian chạy: việc phụ không còn nằm trên đường tới người dùng, nhưng phải có log."
        },
        {
          short: "Command",
          type: "detail",
          title: "Hoàn tác trong một bước",
          body: "<code>PlaceOrderCommand</code> đóng gói một thao tác thành object có <code>execute()</code> và <code>undo()</code>. Nhờ vậy, nút hoàn tác trên màn hình quản trị chỉ cần giữ 1 command gần nhất thay vì sao lưu cả bảng. Command cũng cho phép xếp 4 thao tác vào hàng đợi, thử lại khi lỗi mạng và ghi log ai làm gì. Mỗi command phải đủ dữ liệu để hoàn tác: mã đơn, trạng thái trước, thời điểm. Nếu <code>undo()</code> gọi lại nghiệp vụ hiện tại, kết quả có thể khác lúc chạy vì giá đã đổi. Command hợp với thao tác cần hoãn, xếp hàng hoặc hoàn tác; không hợp để bọc mọi lời gọi hàm.",
          focus: ["context", "command", "subject"],
          edges: ["context-command", "command-subject"],
          metrics: { "thuat-toan": "không đổi", "su-kien": "1 sự kiện", "hoan-tac": "1 bước", "rui-ro": "giá đã đổi" },
          changes: ["Lưu trạng thái trước trong command", "Xếp command vào hàng đợi có thử lại"],
          note: "Undo phải dùng dữ liệu chụp tại thời điểm chạy, không gọi lại nghiệp vụ đã thay đổi."
        },
        {
          short: "Rò rỉ",
          type: "pitfall",
          title: "Sáu email cho một đơn",
          body: "<code>OrderEvents</code> giữ danh sách người nghe nhưng không có ai gỡ đăng ký. Sau 5 lần tải lại module trong lúc phát triển, một đơn gửi 6 email thay vì 1, và bộ nhớ tăng 40 MB mỗi vòng. Observer không tự dọn: người đăng ký phải trả về hàm hủy hoặc dùng vòng đời rõ ràng. Lỗi thứ hai là phát sự kiện đồng bộ trong giao dịch: người nghe chậm 2 giây giữ transaction mở, khóa 18 dòng. Sự kiện nên phát sau khi giao dịch chốt, hoặc đẩy vào hàng đợi. Pattern không sửa được thiết kế vòng đời; nó chỉ làm chỗ sai rõ hơn.",
          focus: ["subject", "observer", "ui"],
          edges: ["subject-observer", "context-ui"],
          metrics: { "thuat-toan": "không đổi", "su-kien": "6 email", "hoan-tac": "không", "rui-ro": "rò rỉ 40 MB" },
          changes: ["Trả về hàm hủy khi đăng ký", "Phát sự kiện sau khi chốt giao dịch"],
          note: "Observer là hợp đồng vòng đời: ai đăng ký phải có đường gỡ, nếu không sự kiện sẽ nhân bản."
        },
        {
          short: "Tóm tắt",
          type: "final",
          tone: "final",
          title: "Ba cách tách hành vi",
          body: "3 mẫu hành vi, 3 cách tách. <code>Strategy</code> tách thuật toán khỏi nơi chọn; <code>Observer</code> tách người phát khỏi người nghe; <code>Command</code> tách yêu cầu khỏi thời điểm thực hiện. Cả ba đều đổi một lời gọi trực tiếp thành một bước gián tiếp, nên chỉ đáng dùng khi số biến thể hoặc số người nghe thật sự tăng. Hãy đếm: 3 thuật toán, 12 người nghe, 4 thao tác cần hoàn tác là tín hiệu tốt; 1 thuật toán và 1 người nghe thì không. Cheatsheet tiếp theo gom cả ba nhóm vào một bảng chọn theo vấn đề, kèm checklist tránh lạm dụng.",
          focus: "all",
          edges: "all",
          metrics: { "thuat-toan": "3 lớp", "su-kien": "12 người nghe", "hoan-tac": "4 thao tác", "rui-ro": "đếm trước" },
          changes: ["Nắm ba cách tách hành vi", "Chuẩn bị tra cheatsheet theo vấn đề"],
          note: "Hết ba bài. Sang phần luyện tập để thử hai tình huống, rồi mở cheatsheet khi cần tra nhanh."
        }
      ]
    }
  });

  window.SELAB.practice.push(
    {
      tag: "PATTERN",
      title: "Bốn mươi mốt class cho hai báo cáo",
      scenario: "Đội phát triển một ứng dụng gồm 3 màn hình và 2 loại báo cáo, tổng 2.400 dòng TypeScript. Sau một khóa học, họ thêm AbstractFactory cho tầng dữ liệu, Decorator cho mọi service và Visitor cho báo cáo. Kết quả là 41 class, trong đó 9 class chỉ chuyển tiếp lời gọi, và một lỗi giá hiển thị sai nằm trong lớp bọc thứ ba. Người mới cần 3 tuần để lần ra luồng một yêu cầu. Số báo cáo vẫn là 2 và chưa có kế hoạch thêm loại thứ ba. Nhóm đang tranh luận có nên thêm Proxy và Adapter cho tầng API hay không.",
      metrics: [
        { label: "Class cho 2 báo cáo", value: "41", danger: true },
        { label: "Lớp chỉ chuyển tiếp", value: "9" },
        { label: "Thời gian onboard", value: "3 tuần" }
      ],
      options: [
        "Thêm Proxy và Adapter để kiến trúc đầy đủ hơn trước khi mở rộng",
        "Giữ nguyên 9 pattern, chỉ viết tài liệu sơ đồ để người mới đọc nhanh hơn",
        "Bỏ các lớp chỉ chuyển tiếp, gộp Decorator về một lớp đo giờ, giữ pattern nào trả lời được vấn đề đang có rồi đo lại số class và thời gian onboard",
        "Chuyển toàn bộ sang AbstractFactory và Visitor để đồng nhất cách tạo object"
      ],
      correct: 2,
      explain: "Pattern chỉ đáng giữ khi nó trả lời một vấn đề đang tồn tại. Với 2 loại báo cáo và 3 màn hình, AbstractFactory và Visitor thêm tầng gián tiếp mà không có biến thể nào cần che; 9 lớp chuyển tiếp chỉ làm stack trace dài hơn. Lỗi giá nằm trong lớp bọc thứ ba là bằng chứng chi phí đọc đã vượt lợi ích. Gỡ lớp chuyển tiếp, giữ một Decorator đo giờ có test riêng, rồi đo lại số class và thời gian onboard là cách kiểm chứng. Thêm Proxy và Adapter lúc này chỉ lặp lại sai lầm cũ: tăng cấu trúc trước khi có vấn đề.",
    },
    {
      tag: "REVIEW",
      title: "Singleton trong pull request",
      scenario: "Pull request thêm DatabaseSingleton để mọi service dùng chung kết nối. Trong 4 service, mỗi service gọi getInstance() ngay trong constructor, và một cache tĩnh giữ 2.000 bản ghi người dùng. Bộ test có 18 ca chập chờn vì thứ tự chạy quyết định dữ liệu còn trong cache. Dự án đã có connection pool cấu hình 20 kết nối nhưng PR bỏ qua. Tác giả lập luận Singleton tiết kiệm bộ nhớ và giữ cấu hình một chỗ. Reviewer cần một quyết định: chấp nhận, yêu cầu sửa nhỏ, hay chặn PR. Thời hạn phát hành còn 2 ngày.",
      metrics: [
        { label: "Test chập chờn", value: "18", danger: true },
        { label: "Kết nối trong pool", value: "20" },
        { label: "Thời hạn phát hành", value: "2 ngày" }
      ],
      options: [
        "Chấp nhận vì Singleton là mẫu chuẩn cho kết nối dùng chung",
        "Chỉ thêm hàm reset cho cache tĩnh để test tự dọn dữ liệu",
        "Chặn PR, bắt buộc truyền pool qua constructor, xóa cache tĩnh và thể hiện toàn cục",
        "Đổi Singleton sang biến toàn cục để dễ mock hơn trong test"
      ],
      correct: 2,
      explain: "Singleton ở đây che hai vấn đề: vòng đời kết nối và trạng thái dùng chung. Pool 20 kết nối đã tồn tại, nên thể hiện toàn cục không tiết kiệm tài nguyên mà chỉ giấu phụ thuộc khỏi chữ ký constructor. Cache tĩnh 2.000 bản ghi khiến 18 test phụ thuộc thứ tự, đúng loại lỗi khó tái hiện nhất. Thêm hàm reset là vá triệu chứng, không sửa nguồn. Truyền pool qua constructor cho phép mỗi test dựng pool riêng hoặc bản giả, và vòng đời nằm ở composition root. Chặn PR là quyết định đúng dù còn 2 ngày, vì sửa sau phát hành sẽ đắt hơn.",
    }
  );

  window.SELAB.cheatsheets.push({
    id: "patterns",
    num: "03",
    title: "Pattern theo nhóm",
    intro: "Tra nhanh 23 mẫu kinh điển theo vấn đề thay vì theo tên: tạo object, ghép cấu trúc, tách hành vi. Năm thẻ gồm bảng chọn, ba đoạn mã TypeScript và Java, cùng checklist chống lạm dụng pattern.",
    cards: [
      {
        title: "Chọn pattern theo vấn đề",
        wide: true,
        html: `<table class="cheat-table">
<thead><tr><th>Vấn đề</th><th>Pattern</th><th>Dấu hiệu nhận ra</th></tr></thead>
<tbody>
<tr><td>Tạo object theo cấu hình</td><td>Factory Method</td><td>Nhiều lớp con, nơi dùng chỉ biết interface</td></tr>
<tr><td>Tạo cả họ sản phẩm đi kèm</td><td>Abstract Factory</td><td>2 họ giao diện phải khớp nhau, ví dụ nút và ô nhập</td></tr>
<tr><td>Object có 12 tham số</td><td>Builder</td><td>5 trường tùy chọn, thứ tự tham số dễ nhầm</td></tr>
<tr><td>API bên thứ ba lệch chữ ký</td><td>Adapter</td><td>Không sửa được một trong hai phía</td></tr>
<tr><td>Cần cộng hành vi theo lớp</td><td>Decorator</td><td>Đo giờ, nén, mã hóa, retry chồng lên nhau</td></tr>
<tr><td>Một quy trình gọi 9 bước</td><td>Facade</td><td>Nơi dùng phải biết thứ tự hệ thống con</td></tr>
<tr><td>Cache hoặc kiểm quyền truy cập</td><td>Proxy</td><td>Cần chặn, đếm hoặc giữ kết quả trước khi gọi thật</td></tr>
<tr><td>Bảy nhánh if tính phí</td><td>Strategy</td><td>Thuật toán đổi theo cấu hình hoặc vùng</td></tr>
<tr><td>Một sự kiện, nhiều người nghe</td><td>Observer</td><td>Thêm kênh mới không được sửa nơi phát</td></tr>
<tr><td>Thao tác cần hoãn hoặc hoàn tác</td><td>Command</td><td>Cần undo, xếp hàng, thử lại</td></tr>
</tbody>
</table>
<p>Đọc từ cột vấn đề sang cột pattern, không làm ngược. Nếu chưa viết được dấu hiệu bằng số, chưa cần pattern.</p>`
      },
      {
        title: "Factory Method và Strategy (TypeScript)",
        wide: true,
        html: `<pre><code>interface Report {
  render(): string;
}

class PdfReport implements Report {
  render(): string { return "pdf:3-phan"; }
}

class ExcelReport implements Report {
  render(): string { return "excel:5-sheet"; }
}

function createReport(kind: "pdf" | "excel"): Report {
  return kind === "pdf" ? new PdfReport() : new ExcelReport();
}

interface ShippingStrategy {
  cost(weight: number): number;
}

class AirShipping implements ShippingStrategy {
  cost(weight: number): number {
    return 24000 + Math.ceil(weight) * 8000;
  }
}

class OrderContext {
  constructor(private strategy: ShippingStrategy) {}
  total(weight: number): number {
    return this.strategy.cost(weight);
  }
}</code></pre>
<p>Factory che lớp cụ thể sau <code>Report</code>; Strategy giữ thuật toán sau <code>ShippingStrategy</code>. Cả hai nhận cấu hình ở một chỗ và trả interface cho nơi dùng.</p>`
      },
      {
        title: "Builder và Singleton (Java)",
        html: `<pre><code>HttpRequest req = HttpRequest.builder("https://api.local/orders")
    .timeout(3000)
    .retry(2)
    .build();

public final class Config {
  private static final Config INSTANCE = new Config(20);

  private final int poolSize;

  private Config(int poolSize) {
    this.poolSize = poolSize;
  }

  public static Config getInstance() {
    return INSTANCE;
  }

  public int poolSize() {
    return poolSize;
  }
}</code></pre>
<p><code>build()</code> nên kiểm 4 ràng buộc trước khi trả object. Với Singleton, ưu tiên truyền <code>Config</code> qua constructor; <code>getInstance()</code> chỉ giữ cho mã cũ.</p>`
      },
      {
        title: "Adapter, Decorator, Facade",
        html: `<table>
<thead><tr><th>Pattern</th><th>Giữ gì</th><th>Đổi gì</th><th>Bẫy thường gặp</th></tr></thead>
<tbody>
<tr><td><b>Adapter</b></td><td>Interface phía ứng dụng</td><td>Chữ ký và kiểu dữ liệu bên trong</td><td>Nhét nghiệp vụ vào lớp chuyển</td></tr>
<tr><td><b>Decorator</b></td><td>Interface của service</td><td>Cộng hành vi theo lớp bọc</td><td>Đặt sai thứ tự cache và retry</td></tr>
<tr><td><b>Facade</b></td><td>Một điểm vào duy nhất</td><td>Gom 9 bước gọi hệ thống con</td><td>Phình thành God Object</td></tr>
<tr><td><b>Proxy</b></td><td>Interface của service</td><td>Kiểm soát truy cập, cache, quyền</td><td>Khóa cache thiếu chiều dữ liệu</td></tr>
</tbody>
</table>
<p>Ba mẫu đầu giữ nguyên bề mặt gọi; khác nhau ở chỗ đặt logic: chuyển đổi, cộng thêm, điều phối hay kiểm soát.</p>`
      },
      {
        title: "Checklist tránh lạm dụng pattern",
        html: `<ul>
<li><b>Đếm trước:</b> dưới 3 biến thể hoặc dưới 2 người nghe thì chưa cần pattern.</li>
<li><b>Một lý do:</b> mỗi lớp bọc, mỗi factory phải trả lời đúng một vấn đề đang có.</li>
<li><b>Đo chi phí:</b> ghi lại số class, số tầng stack trace và thời gian onboard trước và sau.</li>
<li><b>Giữ lối thoát:</b> pattern phải gỡ được mà không viết lại toàn bộ tầng nghiệp vụ.</li>
<li><b>Không giấu trạng thái:</b> ưu tiên truyền phụ thuộc qua constructor hơn thể hiện toàn cục.</li>
<li><b>Test theo hành vi:</b> kiểm kết quả và thứ tự lớp bọc, không kiểm lớp nào được gọi.</li>
<li><b>Rà lại định kỳ:</b> pattern không còn biến thể nào phục vụ thì xóa, đừng giữ cho đẹp sơ đồ.</li>
</ul>
<p>Pattern là từ vựng để trao đổi, không phải thước đo chất lượng. Một thiết kế ít pattern mà đọc được vẫn tốt hơn sơ đồ đủ 23 mẫu.</p>`
      }
    ]
  });
})();

