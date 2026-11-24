/* SELab — dữ liệu phần 2: module Thiết kế & SOLID */
window.SELAB = window.SELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  "use strict";

  const root = window.SELAB;
  const modules = root.modules || (root.modules = []);
  const lessons = root.lessons || (root.lessons = {});
  const practice = root.practice || (root.practice = []);
  const cheatsheets = root.cheatsheets || (root.cheatsheets = []);

  modules.push({
    id: "thiet-ke-solid",
    num: "02",
    tone: "mint",
    title: "Thiết kế & SOLID",
    blurb: "Ba bài về thiết kế hướng đối tượng: tách trách nhiệm và mở rộng bằng interface, giữ hợp đồng thay thế được, rồi đảo chiều phụ thuộc và lắp hành vi bằng composition. Ví dụ TypeScript, Java, kèm sơ đồ và tình huống luyện tập sát mã thật.",
    lessons: ["srp-ocp", "lsp-isp", "dip-composition"]
  });

  /* ------------------------------------------------------------------
     Bài 1: SRP và OCP
     ------------------------------------------------------------------ */
  lessons["srp-ocp"] = {
    id: "srp-ocp",
    module: "thiet-ke-solid",
    title: "SRP và OCP: tách việc, mở rộng",
    shortTitle: "SRP & OCP",
    subtitle: "Một class chỉ nên có một lý do để thay đổi; yêu cầu mới nên được đáp bằng implementation mới sau interface, không bằng cách sửa chuỗi if/else đang chạy.",
    blurb: "OrderService gánh tính giá, lưu đơn và gửi mail trong 420 dòng. Tách mỗi việc về một class, đặt quy tắc giảm giá sau interface, rồi thêm quy tắc Tết bằng một lớp mới mà không sửa mã cũ.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["SRP", "OCP", "trách nhiệm", "interface", "mở rộng"],
    metrics: [
      { key: "trach-nhiem", label: "Trách nhiệm", tone: "blue" },
      { key: "ly-do", label: "Lý do để đổi", tone: "yellow" },
      { key: "mo-rong", label: "Cách mở rộng", tone: "mint" },
      { key: "file-sua", label: "File phải sửa", tone: "coral" }
    ],
    nodes: [
      { id: "checkout", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Khách đặt hàng", sub: "POST /orders" },
      { id: "order", type: "task", x: 340, y: 80, w: 200, h: 70, label: "Đơn hàng", sub: "dữ liệu đầu vào" },
      { id: "pricing", type: "code", x: 625, y: 80, w: 200, h: 70, label: "PricingService", sub: "thuế và giảm giá" },
      { id: "service", type: "task", x: 340, y: 195, w: 200, h: 70, label: "OrderService", sub: "điều phối, không tính" },
      { id: "repo", type: "disk", x: 55, y: 310, w: 200, h: 70, label: "OrderRepository", sub: "lưu đơn xuống DB" },
      { id: "mailer", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "MailService", sub: "gửi xác nhận" },
      { id: "rule", type: "layers", x: 625, y: 310, w: 200, h: 70, label: "DiscountRule", sub: "interface mở rộng" }
    ],
    edges: [
      { id: "checkout-order", from: "checkout", to: "order", kind: "request", label: "đặt hàng" },
      { id: "order-service", from: "order", to: "service", kind: "control", label: "chuyển" },
      { id: "service-pricing", from: "service", to: "pricing", kind: "control", label: "tính giá" },
      { id: "service-repo", from: "service", to: "repo", kind: "data", label: "lưu" },
      { id: "service-mailer", from: "service", to: "mailer", kind: "control", label: "gửi mail" },
      { id: "service-rule", from: "service", to: "rule", kind: "control", label: "áp quy tắc" },
      { id: "rule-pricing", from: "rule", to: "pricing", kind: "response", label: "giá mới" }
    ],
    learn: [
      "Một class, một lý do để thay đổi.",
      "Tách theo trục thay đổi, không theo số method.",
      "Điểm mở rộng là interface, không phải if/else.",
      "Đo bằng số tệp phải sửa cho một yêu cầu."
    ],
    steps: [
      {
        short: "Ba việc một class",
        type: "concept",
        title: "Ba lý do để đổi trong một tệp",
        body: "Phiên bản đầu của <code>OrderService</code> dài 420 dòng và gánh ba việc: tính giá, lưu đơn, gửi mail. Mỗi lần biểu thuế đổi, mỗi lần bảng <code>orders</code> thêm cột, mỗi lần mẫu mail đổi, cùng một tệp phải mở. Ba nhóm người khác nhau cùng sửa một tệp nên xung đột merge tăng gấp ba, và 27 ca kiểm thử phải chạy lại cho cả ba thay đổi. SRP không đòi mỗi class một method; nó đòi một lý do để thay đổi. Ba lý do này độc lập, vì vậy phải tách. Một tệp như vậy còn chặn việc chia nhóm làm việc theo chuyên môn.",
        focus: ["checkout", "order", "service"],
        edges: ["checkout-order", "order-service"],
        metrics: { "trach-nhiem": "3 trong 1", "ly-do": "3", "mo-rong": "Chưa có", "file-sua": "3 tệp" },
        changes: [
          "Ba lý do thay đổi lộ ra trong một tệp 420 dòng",
          "27 ca kiểm thử chạy lại cho mọi thay đổi"
        ],
        note: "SRP không phải 'mỗi class một method'. Tiêu chí là số lý do để thay đổi, không phải số dòng."
      },
      {
        short: "Tách cộng sự",
        type: "flow",
        title: "Tách theo lý do thay đổi",
        body: "Tách thành <code>PricingService</code>, <code>OrderRepository</code> và <code>MailService</code>. <code>OrderService</code> còn 70 dòng, chỉ điều phối: tính giá, lưu đơn, gửi xác nhận. Mỗi cộng sự nhận dữ liệu qua tham số thay vì đọc biến toàn cục. Sau khi tách, nhóm kế toán sửa biểu thuế trong một tệp 90 dòng và không chạm vào luồng đặt hàng. Số tệp phải sửa cho một thay đổi về thuế giảm từ ba xuống một, còn thời gian chạy 27 ca kiểm thử giảm từ 14 giây xuống 5 giây vì chỉ một nhóm test bị ảnh hưởng.",
        focus: ["service", "pricing", "repo", "mailer"],
        edges: ["service-pricing", "service-repo", "service-mailer"],
        metrics: { "trach-nhiem": "1 mỗi class", "ly-do": "1", "mo-rong": "Chưa có", "file-sua": "1 tệp" },
        changes: [
          "OrderService còn 70 dòng điều phối",
          "Một thay đổi thuế chỉ chạm 1 tệp"
        ],
        note: "Nếu class điều phối vẫn dài hơn 150 dòng, rất có thể một trách nhiệm nữa đang ẩn trong đó."
      },
      {
        short: "Điểm cắm quy tắc",
        type: "detail",
        title: "Mở rộng bằng lớp mới",
        body: "OCP hỏi: thêm quy tắc giảm giá Tết thì sửa ở đâu? Khai báo <code>interface DiscountRule { apply(total: number): number }</code> và cho <code>PricingService</code> nhận một mảng <code>DiscountRule[]</code>. Quy tắc Tết chỉ là một lớp 18 dòng, thêm vào mảng khởi tạo ở <code>main()</code>. Không sửa <code>PricingService</code>, không chạy lại 27 ca kiểm thử cũ, không thêm nhánh <code>if</code> theo mùa. Điểm mở rộng là mảng implementation, không phải thân hàm. Đóng để sửa nghĩa là tệp dịch vụ không đổi khi danh sách quy tắc dài thêm. Mỗi quy tắc mới chỉ cần một ca kiểm thử riêng.",
        focus: ["pricing", "rule"],
        edges: ["service-pricing", "rule-pricing"],
        metrics: { "trach-nhiem": "1 mỗi class", "ly-do": "1", "mo-rong": "Lớp mới", "file-sua": "0 tệp" },
        changes: [
          "Thêm quy tắc Tết bằng 1 lớp 18 dòng",
          "PricingService không phải sửa"
        ],
        note: "Điểm mở rộng phải là mảng hoặc danh sách implementation, không phải một enum rồi switch."
      },
      {
        short: "Bẫy thường gặp",
        type: "pitfall",
        title: "Tách class mà vẫn buộc cứng",
        body: "SRP và OCP thường bị phá cùng lúc. <code>OrderService</code> đã tách lớp nhưng vẫn viết <code>new VnPayGateway()</code> bên trong, nên thêm cổng thanh toán thứ tư vẫn phải sửa chính nó. Một dấu hiệu khác là tách quá vụn: 18 class, trong đó 11 lớp chỉ bọc một lời gọi, khiến đọc một luồng phải nhảy qua 6 tệp. Hai câu hỏi đo lường: thay đổi này chạm bao nhiêu tệp, và class này có bao nhiêu lý do để đổi. Nếu câu trả lời là ba tệp và ba lý do thì thiết kế chưa đạt.",
        focus: ["service", "pricing", "repo", "mailer"],
        edges: ["service-pricing", "service-repo", "service-mailer"],
        metrics: { "trach-nhiem": "1 mỗi class", "ly-do": "1", "mo-rong": "Chưa đúng", "file-sua": "2 tệp" },
        changes: [
          "Thấy rõ new bên trong vẫn là buộc cứng",
          "Tách vụn làm luồng khó đọc"
        ],
        note: "Đo bằng số tệp phải sửa cho một yêu cầu thật, đừng đo bằng số class."
      },
      {
        short: "Tóm tắt",
        type: "final",
        tone: "final",
        title: "Bản đồ hai nguyên tắc",
        body: "SRP chia hệ thống theo trục thay đổi, OCP giữ trục đó mở bằng abstraction. Với đơn hàng: <code>OrderService</code> điều phối, <code>PricingService</code> tính tiền, <code>OrderRepository</code> lưu, <code>MailService</code> báo, <code>DiscountRule</code> là điểm cắm quy tắc mới. Kiểm tra bằng ba con số: một thay đổi về thuế chỉ chạm 1 tệp; thêm quy tắc giảm giá cần 0 dòng sửa trong dịch vụ; mỗi class dưới 120 dòng. Khi cả ba đúng, yêu cầu mới đến sẽ không mở lại tệp cũ. Đây cũng là cách đọc một diff: nếu diff mở nhiều tệp không liên quan, thiết kế đang thiếu điểm cắt.",
        focus: "all",
        edges: "all",
        metrics: { "trach-nhiem": "1 mỗi class", "ly-do": "1", "mo-rong": "Interface", "file-sua": "0 tệp" },
        changes: [
          "Ba số đo: 1 tệp, 0 dòng sửa, 120 dòng",
          "Yêu cầu mới không mở lại mã cũ"
        ],
        note: "Tiếp theo: LSP và ISP — điều kiện để abstraction ở trên thật sự thay thế được."
      }
    ]
  };

  /* ------------------------------------------------------------------
     Bài 2: LSP và ISP
     ------------------------------------------------------------------ */
  lessons["lsp-isp"] = {
    id: "lsp-isp",
    module: "thiet-ke-solid",
    title: "LSP và ISP: thay thế được, hợp đồng mảnh",
    shortTitle: "LSP & ISP",
    subtitle: "Lớp con phải dùng được ở mọi nơi lớp cha được dùng. Interface chỉ nên chứa method mà mọi implementation đều thực hiện được với cùng ý nghĩa.",
    blurb: "Intern kế thừa Employee nhưng ném lỗi ở bonus(), làm sập báo cáo lương. Tách Payable và BonusEligible, mỗi lớp chỉ ký hợp đồng mình thật sự thực hiện, để vòng lặp tính lương không cần instanceof.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["LSP", "ISP", "hợp đồng", "interface", "kế thừa"],
    metrics: [
      { key: "hop-dong", label: "Hợp đồng", tone: "blue" },
      { key: "thay-the", label: "Thay thế", tone: "mint" },
      { key: "method", label: "Method/interface", tone: "violet" },
      { key: "loi", label: "Lỗi chạy", tone: "coral" }
    ],
    nodes: [
      { id: "report", type: "page", x: 55, y: 80, w: 200, h: 70, label: "PayrollReport", sub: "duyệt 50 nhân viên" },
      { id: "employee", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Employee", sub: "lớp cơ sở" },
      { id: "perm", type: "code", x: 625, y: 80, w: 200, h: 70, label: "FullTime", sub: "đủ hai method" },
      { id: "intern", type: "code", x: 55, y: 310, w: 200, h: 70, label: "Intern", sub: "bonus() ném lỗi" },
      { id: "payable", type: "layers", x: 340, y: 310, w: 200, h: 70, label: "Payable", sub: "chỉ total()" },
      { id: "bonusif", type: "key", x: 625, y: 310, w: 200, h: 70, label: "BonusEligible", sub: "chỉ bonus()" }
    ],
    edges: [
      { id: "report-employee", from: "report", to: "employee", kind: "request", label: "kiểm tra" },
      { id: "perm-employee", from: "perm", to: "employee", kind: "control", label: "kế thừa" },
      { id: "intern-employee", from: "intern", to: "employee", kind: "control", label: "kế thừa" },
      { id: "employee-payable", from: "employee", to: "payable", kind: "control", label: "triển khai" },
      { id: "intern-payable", from: "intern", to: "payable", kind: "control", label: "triển khai" },
      { id: "bonusif-perm", from: "bonusif", to: "perm", kind: "control", label: "triển khai" },
      { id: "intern-report", from: "intern", to: "report", kind: "response", label: "ném lỗi" }
    ],
    learn: [
      "Lớp con không được siết điều kiện đầu vào.",
      "Không ném lỗi mới ở method đã hứa.",
      "Tách interface theo nhu cầu của client.",
      "Đừng dùng instanceof để né hợp đồng."
    ],
    steps: [
      {
        short: "Hợp đồng thay thế",
        type: "concept",
        title: "Lớp con phải thay được lớp cha",
        body: "LSP không nói về cú pháp kế thừa mà về hợp đồng. Nếu <code>PayrollReport</code> nhận một <code>Employee</code> và gọi <code>total()</code> cùng <code>bonus()</code>, mọi lớp con phải trả về kết quả hợp lý cho cả hai lời gọi. <code>Intern</code> kế thừa <code>Employee</code> nhưng <code>bonus()</code> ném <code>UnsupportedOperationException</code>, nên chỗ nào thay <code>Employee</code> bằng <code>Intern</code> cũng có thể nổ. Ba điều kiện: không ném lỗi mới, không siết điều kiện đầu vào, không nới lỏng điều kiện đầu ra. Trong 9 method công khai của <code>Employee</code>, báo cáo chỉ dựa vào 2 method, nhưng cả 9 đều phải giữ đúng nghĩa. Vi phạm một điều là đã phá hợp đồng, và lỗi chỉ lộ khi có người gọi đúng method sai.",
        focus: ["report", "employee", "perm"],
        edges: ["report-employee", "perm-employee"],
        metrics: { "hop-dong": "total, bonus", "thay-the": "Chưa", "method": "9", "loi": "1 kiểu" },
        changes: [
          "Intern thừa hưởng hợp đồng không thực hiện được",
          "Lỗi chỉ lộ khi chạy, không lộ khi biên dịch"
        ],
        note: "LSP kiểm tra bằng hành vi, không bằng từ khóa extends. Trình biên dịch không giúp được ở đây."
      },
      {
        short: "Dừng giữa báo cáo",
        type: "flow",
        title: "Vòng lặp không cần instanceof",
        body: "<code>PayrollReport</code> duyệt danh sách 50 nhân viên và gọi hai method cho mỗi người. Với 2 intern, lời gọi <code>bonus()</code> ném lỗi ở phần tử 17, toàn bộ báo cáo tháng dừng và 48 người còn lại không có phiếu lương. Đây là hậu quả của LSP chứ không phải lỗi của vòng lặp: báo cáo chỉ làm đúng theo hợp đồng <code>Employee</code>. Cách vá đúng là làm cho tập kiểu nhỏ lại, không phải thêm <code>try/catch</code> để bỏ qua lỗi. Nếu báo cáo phải tự biết bỏ qua 2 người, nó đã phụ thuộc vào lớp con chứ không còn là client của hợp đồng.",
        focus: ["intern", "report", "employee"],
        edges: ["intern-report", "report-employee"],
        metrics: { "hop-dong": "Bị phá", "thay-the": "Không", "method": "9", "loi": "2/50" },
        changes: [
          "Báo cáo dừng ở phần tử 17",
          "48 phiếu lương bị chậm"
        ],
        note: "try/catch trong vòng lặp chỉ che lỗi; báo cáo vẫn thiếu dữ liệu của người bị lỗi."
      },
      {
        short: "Tách interface",
        type: "detail",
        title: "Chỉ ký hợp đồng thật sự dùng",
        body: "<code>Employee</code> có 9 method nhưng báo cáo lương chỉ dùng 2. Tách thành <code>Payable</code> với <code>total()</code> và <code>BonusEligible</code> với <code>bonus()</code>. <code>FullTime</code> ký cả hai hợp đồng; <code>Intern</code> chỉ ký <code>Payable</code>. Không còn method rỗng, không còn ngoại lệ giả. Báo cáo nhận <code>List&lt;Payable&gt;</code>, phần thưởng nhận <code>List&lt;BonusEligible&gt;</code>, mỗi client chỉ thấy đúng phần mình cần. Sáu lớp, hai interface, 0 method ném lỗi. Đổi lại, số interface tăng từ 1 lên 2, nhưng số nhánh kiểm tra kiểu trong client giảm từ 14 xuống 0. Một interface chỉ đáng tồn tại khi có ít nhất một client thật dùng nó.",
        focus: ["payable", "bonusif", "intern", "perm"],
        edges: ["employee-payable", "intern-payable", "bonusif-perm"],
        metrics: { "hop-dong": "2 interface", "thay-the": "Có", "method": "1-2", "loi": "0" },
        changes: [
          "Payable tách khỏi BonusEligible",
          "Intern không còn method ném lỗi"
        ],
        note: "Tách interface làm tăng số kiểu nhưng giảm số nhánh kiểm tra kiểu ở client."
      },
      {
        short: "Bẫy instanceof",
        type: "pitfall",
        title: "Kiểm tra kiểu để né hợp đồng",
        body: "Khi gặp lớp con phá hợp đồng, phản xạ thường là thêm kiểm tra kiểu. Trong 14 chỗ gọi <code>bonus()</code>, nhóm thêm <code>if (e instanceof Intern)</code> để bỏ qua. Cách này chạy được hôm nay nhưng buộc mọi nơi biết mọi lớp con: thêm <code>Contractor</code> phải sửa đủ 14 chỗ, và một chỗ quên là lỗi dây chuyền. Đó là dấu hiệu ISP bị phá: client đang phụ thuộc vào thứ nó không cần. Hợp đồng đúng thì không cần hỏi kiểu. Đếm số lần instanceof trong mã nghiệp vụ là một chỉ số review nhanh.",
        focus: ["intern", "bonusif", "report"],
        edges: ["intern-report", "bonusif-perm"],
        metrics: { "hop-dong": "Bị phá", "thay-the": "Không", "method": "9", "loi": "14 chỗ" },
        changes: [
          "14 chỗ instanceof mọc ra",
          "Thêm Contractor phải sửa 14 chỗ"
        ],
        note: "instanceof trong mã nghiệp vụ là mùi thiết kế, không phải cách xử lý ngoại lệ."
      },
      {
        short: "Tóm tắt",
        type: "final",
        tone: "final",
        title: "Hai nguyên tắc, một hệ quả",
        body: "LSP giữ cho abstraction thay thế được; ISP giữ cho abstraction vừa đúng nhu cầu. Với ví dụ lương: 2 interface, 6 lớp, 0 method ném lỗi, 0 lần instanceof trong báo cáo. Kiểm tra: thay một implementation bất kỳ vào danh sách mà báo cáo vẫn chạy; mỗi interface có ít nhất một client thật dùng; không lớp nào để trống method. Khi cả ba đúng, thêm loại nhân viên mới chỉ là thêm một lớp. Chạy <code>PayrollReport</code> với 50 nhân viên thuộc 3 loại, đếm số phiếu in ra và số lần instanceof. Đừng quên chạy lại bộ test sau khi tách interface.",
        focus: "all",
        edges: "all",
        metrics: { "hop-dong": "2 interface", "thay-the": "Có", "method": "1-2", "loi": "0" },
        changes: [
          "0 method ném lỗi trong hệ thống",
          "Thêm loại mới chỉ là thêm lớp"
        ],
        note: "Tiếp theo: DIP và composition — đảo chiều phụ thuộc để thay implementation mà không sửa client."
      }
    ]
  };

  /* ------------------------------------------------------------------
     Bài 3: DIP và composition
     ------------------------------------------------------------------ */
  lessons["dip-composition"] = {
    id: "dip-composition",
    module: "thiet-ke-solid",
    title: "DIP và composition: lắp ráp từ ngoài",
    shortTitle: "DIP & composition",
    subtitle: "Module cấp cao và cấp thấp cùng phụ thuộc abstraction. Hành vi được lắp bằng composition ở điểm khởi tạo, không bằng cây kế thừa sâu.",
    blurb: "NotificationService tạo trực tiếp SmtpClient nên không kiểm thử được. Đảo phụ thuộc qua interface Notifier, tiêm implementation từ main(), rồi bọc thêm RetryNotifier bằng composition thay vì thêm tầng kế thừa.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["DIP", "DI", "composition", "interface", "kiểm thử"],
    metrics: [
      { key: "huong", label: "Chiều phụ thuộc", tone: "blue" },
      { key: "diem-tiem", label: "Điểm tiêm", tone: "mint" },
      { key: "tang", label: "Tầng kế thừa", tone: "violet" },
      { key: "test", label: "Thời gian test", tone: "yellow" }
    ],
    nodes: [
      { id: "app", type: "task", x: 55, y: 80, w: 200, h: 70, label: "OrderService", sub: "module cấp cao" },
      { id: "main", type: "task", x: 340, y: 80, w: 200, h: 70, label: "main()", sub: "lắp implementation" },
      { id: "smtp", type: "server", x: 625, y: 80, w: 200, h: 70, label: "SmtpNotifier", sub: "gửi qua SMTP" },
      { id: "notifier", type: "layers", x: 340, y: 195, w: 200, h: 70, label: "Notifier", sub: "notify(msg)" },
      { id: "fake", type: "check", x: 55, y: 310, w: 200, h: 70, label: "FakeNotifier", sub: "ghi lời gọi" },
      { id: "retry", type: "bolt", x: 340, y: 310, w: 200, h: 70, label: "RetryNotifier", sub: "bọc Notifier khác" },
      { id: "sms", type: "signal", x: 625, y: 310, w: 200, h: 70, label: "SmsNotifier", sub: "gửi qua SMS" }
    ],
    edges: [
      { id: "app-notifier", from: "app", to: "notifier", kind: "request", label: "gọi notify()" },
      { id: "main-notifier", from: "main", to: "notifier", kind: "control", label: "tiêm vào" },
      { id: "main-app", from: "main", to: "app", kind: "control", label: "tạo" },
      { id: "smtp-notifier", from: "smtp", to: "notifier", kind: "response", label: "triển khai" },
      { id: "fake-notifier", from: "fake", to: "notifier", kind: "response", label: "triển khai" },
      { id: "retry-notifier", from: "retry", to: "notifier", kind: "control", label: "triển khai" },
      { id: "retry-smtp", from: "retry", to: "smtp", kind: "control", label: "bọc" }
    ],
    learn: [
      "Phụ thuộc vào interface, không vào lớp cụ thể.",
      "Tiêm phụ thuộc từ điểm khởi tạo duy nhất.",
      "Composition linh hoạt hơn cây kế thừa.",
      "Test nhanh vì thay được implementation."
    ],
    steps: [
      {
        short: "New bên trong",
        type: "concept",
        title: "Tạo trực tiếp là buộc cứng",
        body: "<code>NotificationService</code> khởi tạo <code>SmtpClient</code> ngay trong constructor, ở 6 chỗ khác nhau. Muốn kiểm thử phải dựng một SMTP server giả, nên bộ test mất 14 giây và thỉnh thoảng gửi mail thật tới 42 địa chỉ trong danh sách thử. Module cấp cao đang phụ thuộc module cấp thấp, và cả hai cùng gắn vào giao thức SMTP. DIP nói: cả hai phải phụ thuộc abstraction. Bước đầu tiên không phải viết container, mà là đặt một interface mỏng đúng chỗ seam. Điểm seam là chỗ duy nhất cần sửa để thay nguồn gửi. Một interface 12 dòng là đủ cho ví dụ này.",
        focus: ["app", "smtp"],
        edges: ["app-notifier", "smtp-notifier"],
        metrics: { "huong": "Cấp cao xuống thấp", "diem-tiem": "Không có", "tang": "0", "test": "14 giây" },
        changes: [
          "6 chỗ new SmtpClient lộ ra",
          "Test phải dựng SMTP server giả"
        ],
        note: "DIP không bắt buộc dùng DI container. Một constructor nhận interface là đủ cho phần lớn dịch vụ."
      },
      {
        short: "Đảo chiều",
        type: "flow",
        title: "Cùng trỏ vào abstraction",
        body: "Khai báo <code>interface Notifier { notify(msg: string): void }</code>. <code>NotificationService</code> nhận <code>Notifier</code> qua constructor và không còn import <code>SmtpClient</code>. <code>SmtpNotifier</code> triển khai interface đó, giữ toàn bộ chi tiết SMTP ở lớp cấp thấp. Mũi tên phụ thuộc đảo chiều: trước đây dịch vụ trỏ xuống SMTP, nay cả hai cùng trỏ vào <code>Notifier</code>. Sửa import là bước kiểm tra rõ nhất: xóa dòng <code>import { SmtpClient }</code> mà dịch vụ vẫn biên dịch. Nếu tên interface xuất hiện trong cả 2 tầng, chiều phụ thuộc đã đúng và có thể kiểm tra bằng biểu đồ import.",
        focus: ["app", "notifier", "smtp"],
        edges: ["app-notifier", "smtp-notifier"],
        metrics: { "huong": "Cùng vào Notifier", "diem-tiem": "Constructor", "tang": "0", "test": "14 giây" },
        changes: [
          "NotificationService bỏ import SmtpClient",
          "SmtpNotifier giữ chi tiết giao thức"
        ],
        note: "Nếu interface chỉ có một implementation và sẽ không bao giờ có cái thứ hai, hãy cân nhắc trước khi thêm."
      },
      {
        short: "Lắp ở main",
        type: "detail",
        title: "Một điểm lắp duy nhất",
        body: "<code>main()</code> là nơi duy nhất biết implementation cụ thể: <code>const notifier = new SmtpNotifier(cfg); new NotificationService(notifier)</code>. Đổi sang SMS chỉ sửa một dòng ở đây. Trong test, <code>FakeNotifier</code> ghi lại lời gọi, không mở socket, nên 12 ca chạy trong 0,4 giây thay vì 14 giây. Điểm tiêm nằm ở constructor, không phải biến toàn cục hay service locator. Một điểm lắp duy nhất giúp đọc cấu hình hệ thống như đọc bảng dây nối. Tên implementation chỉ nên xuất hiện trong tệp cấu hình, trong test và trong tài liệu triển khai nội bộ. Điểm lắp càng ít, cấu hình càng dễ đọc.",
        focus: ["main", "app", "fake", "smtp"],
        edges: ["main-app", "main-notifier", "fake-notifier"],
        metrics: { "huong": "Cùng vào Notifier", "diem-tiem": "main()", "tang": "0", "test": "0,4 giây" },
        changes: [
          "Đổi kênh gửi còn 1 dòng ở main()",
          "FakeNotifier thay SMTP trong test"
        ],
        note: "Đừng để main() phình thành 300 dòng. Tách theo nhóm tính năng khi số dây nối tăng."
      },
      {
        short: "Bọc hay kế thừa",
        type: "pitfall",
        title: "Composition thay vì cây kế thừa",
        body: "Cần retry khi gửi lỗi? Cách kế thừa là tạo <code>RetrySmtpNotifier</code>, rồi <code>RetrySmsNotifier</code>, rồi bốn lớp nữa cho mỗi kênh, tổng 6 lớp và 6 ca test. Cách composition là một lớp <code>RetryNotifier</code> giữ một <code>Notifier</code> bên trong và gọi lại tối đa 3 lần. Một lớp dùng cho mọi kênh, không đụng cây kế thừa. Quy tắc: hành vi cộng thêm thì bọc, không kế thừa; chỉ kế thừa khi quan hệ thật sự là loại của nhau. Số lớp giảm từ 6 xuống 1, số ca test từ 6 xuống 2, không đổi interface.",
        focus: ["retry", "smtp", "sms", "notifier"],
        edges: ["retry-notifier", "retry-smtp", "smtp-notifier"],
        metrics: { "huong": "Cùng vào Notifier", "diem-tiem": "main()", "tang": "1 lớp bọc", "test": "0,4 giây" },
        changes: [
          "6 lớp retry gộp thành 1 lớp bọc",
          "Không thêm tầng kế thừa"
        ],
        note: "Bọc quá nhiều lớp (retry, log, cache, metric) làm luồng khó đọc; giữ dưới 3 lớp bọc cho một Notifier."
      },
      {
        short: "Tóm tắt",
        type: "final",
        tone: "final",
        title: "Đảo chiều và lắp ráp",
        body: "DIP đảo chiều phụ thuộc để cả hai phía cùng nhìn vào <code>Notifier</code>; composition lắp các hành vi nhỏ thành cấu hình lớn. Trong ví dụ: 1 interface, 3 implementation, 1 lớp bọc retry, 1 điểm lắp ở <code>main()</code>. Test chạy 0,4 giây, không gửi mail thật. Kiểm tra: dịch vụ không import lớp cụ thể, constructor nhận abstraction, và đổi kênh gửi chỉ sửa một dòng khởi tạo. Đếm số import lớp cụ thể trong module cấp cao, số lần new trong thân dịch vụ và số tầng kế thừa: cả ba nên bằng 0 hoặc 1.",
        focus: "all",
        edges: "all",
        metrics: { "huong": "Cùng vào Notifier", "diem-tiem": "main()", "tang": "1 lớp bọc", "test": "0,4 giây" },
        changes: [
          "1 interface, 3 implementation",
          "Test 0,4 giây, không gửi mail thật"
        ],
        note: "Tiếp theo: luyện ba tình huống SRP, LSP và DIP ở chế độ Luyện tập."
      }
    ]
  };

  /* ------------------------------------------------------------------
     Luyện tập
     ------------------------------------------------------------------ */
  practice.push(
    {
      tag: "SRP",
      title: "OrderService gánh ba việc",
      scenario: "OrderService dài 640 dòng, vừa tính giá, vừa ghi bảng orders, vừa gửi mail xác nhận. Trong 6 sprint gần đây, 41 trong 63 commit chạm tệp này. Ba nhóm cùng sửa: kế toán đổi thuế, hạ tầng đổi cột lưu trữ, marketing đổi mẫu mail. Mỗi lần merge đều phải giải quyết xung đột ở cùng vùng mã. Bộ test 38 ca mất 22 giây vì ca nào cũng dựng SMTP giả. Sếp yêu cầu thêm kênh Zalo trong sprint tới và muốn giữ nguyên tốc độ giao hàng. Không ai muốn thêm một kênh nữa vào cùng tệp đó.",
      metrics: [
        { label: "Độ dài", value: "640 dòng" },
        { label: "Commit chạm tệp", value: "41 / 63", danger: true },
        { label: "Thời gian test", value: "22 giây" }
      ],
      options: [
        "Thêm nhánh if cho Zalo ngay trong OrderService để kịp sprint",
        "Tách PricingService, OrderRepository, MailService; OrderService chỉ điều phối và nhận chúng qua constructor",
        "Gộp cả ba việc vào một lớp cha để dùng chung phần xử lý",
        "Chia tệp theo vùng chức năng nhưng giữ nguyên class và biến toàn cục"
      ],
      correct: 1,
      explain: "SRP không đo bằng số dòng mà bằng số lý do để thay đổi. Ba nhóm sửa ba lý do khác nhau trên cùng một class nên mọi thay đổi đều va vào nhau, và 41/63 commit là dấu hiệu rõ. Tách theo trục thay đổi giúp mỗi tệp chỉ phục vụ một nhóm, còn OrderService giữ vai trò điều phối mỏng. Thêm nhánh if chỉ làm class dài thêm. Gộp vào lớp cha làm tăng liên kết. Chia tệp mà giữ class và biến toàn cục thì chỉ đổi chỗ đau chứ không giảm lý do để sửa."
    },
    {
      tag: "LSP",
      title: "Intern làm sập báo cáo lương",
      scenario: "Employee có total() và bonus(). Intern kế thừa Employee nhưng bonus() ném UnsupportedOperationException vì thực tập sinh không có thưởng. PayrollReport duyệt danh sách 50 nhân viên, gọi cả hai method cho mỗi người. Tháng này có 2 intern, báo cáo dừng ở phần tử 17 và 48 người còn lại không nhận được phiếu lương. Nhóm phát triển vá bằng cách bọc try/catch trong vòng lặp, nhưng 3 tháng sau thêm Contractor cũng không có thưởng và lỗi lặp lại ở đúng chỗ cũ. Một tuần sau, bản vá thứ hai lại bọc thêm một try/catch nữa.",
      metrics: [
        { label: "Nhân viên", value: "50" },
        { label: "Dừng ở", value: "phần tử 17", danger: true },
        { label: "Lớp phá hợp đồng", value: "2" }
      ],
      options: [
        "Bọc try/catch và bỏ qua lỗi bonus() để báo cáo chạy tiếp",
        "Cho bonus() trả 0 với intern để vòng lặp không dừng",
        "Tách Payable với total() và BonusEligible với bonus(); báo cáo chỉ gọi bonus() trên BonusEligible",
        "Đổi PayrollReport sang kiểm tra instanceof trước khi gọi bonus()"
      ],
      correct: 2,
      explain: "LSP yêu cầu lớp con thay được lớp cha mà client không phải biết kiểu cụ thể. Intern không thực hiện được bonus() nên không nên ký hợp đồng đó; tách Payable và BonusEligible làm tập kiểu nhỏ lại và báo cáo chỉ nhận thứ nó dùng. Trả 0 làm sai nghĩa nghiệp vụ và che mất việc thiếu dữ liệu. try/catch chỉ giấu lỗi, còn 48 người vẫn mất phiếu. instanceof là dấu hiệu client đang phải bù cho hợp đồng sai và sẽ mọc thêm ở mọi nơi gọi bonus(). Hợp đồng đúng thì client không cần biết lớp con."
    },
    {
      tag: "DIP",
      title: "Không test được vì new SmtpClient",
      scenario: "NotificationService khởi tạo new SmtpClient(host, 587) trong constructor và ở 5 phương thức khác. Bộ test 26 ca phải chạy một SMTP server giả trên cổng 2525; mỗi lần chạy mất 31 giây và 3 ca hay flaky. Tuần trước cấu hình sai khiến 180 mail thử gửi tới khách thật. Nhóm muốn thêm kênh SMS và Zalo trong quý này, đồng thời giảm thời gian pipeline từ 9 phút xuống dưới 4 phút. Một kỹ sư đề xuất đặt SmtpClient vào singleton toàn cục để mọi nơi dùng chung cho dễ.",
      metrics: [
        { label: "Bộ test", value: "26 ca / 31 giây", danger: true },
        { label: "Mail gửi nhầm", value: "180" },
        { label: "Pipeline", value: "9 phút" }
      ],
      options: [
        "Đặt SmtpClient vào singleton toàn cục để mọi nơi dùng chung",
        "Thêm interface Notifier, tiêm qua constructor và lắp implementation ở main()",
        "Chặn DNS của máy chủ SMTP trong lúc chạy test để không gửi thật",
        "Tăng timeout và chạy test song song để giảm thời gian pipeline"
      ],
      correct: 1,
      explain: "DIP đảo chiều phụ thuộc: NotificationService nên phụ thuộc interface Notifier, còn SmtpNotifier giữ chi tiết giao thức. Tiêm qua constructor cho phép FakeNotifier thay thế trong test, không mở socket và không gửi mail thật; đổi kênh chỉ sửa một dòng ở main(). Singleton toàn cục vẫn là lớp cụ thể và làm test khó cô lập. Chặn DNS là mẹo môi trường, không sửa thiết kế. Tăng timeout và chạy song song chỉ giảm triệu chứng, không mở đường cho SMS hay Zalo. Chỉ một interface đặt đúng chỗ mới xử lý được cả ba yêu cầu cùng lúc."
    }
  );

  /* ------------------------------------------------------------------
     Cheatsheet
     ------------------------------------------------------------------ */
  cheatsheets.push({
    id: "solid",
    num: "02",
    title: "SOLID thực hành",
    intro: "Bảng tra năm nguyên tắc kèm dấu hiệu vi phạm và cách sửa, mẫu TypeScript cho SRP, OCP, LSP, ISP và DIP, cùng checklist review trước khi mở pull request. Dùng khi đọc diff trước lúc merge.",
    cards: [
      {
        title: "Năm nguyên tắc trong một bảng",
        wide: true,
        html: `<table class="cheat-table">
<thead><tr><th>Nguyên tắc</th><th>Dấu hiệu vi phạm</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><b>SRP</b></td><td>Một class có ba nhóm người cùng sửa; tên chứa "và"</td><td>Tách theo lý do thay đổi; giữ lớp điều phối mỏng</td></tr>
<tr><td><b>OCP</b></td><td>Thêm loại mới phải sửa chuỗi if/else hoặc switch</td><td>Đặt sau interface, thêm implementation mới</td></tr>
<tr><td><b>LSP</b></td><td>Lớp con ném lỗi, trả null hoặc siết điều kiện</td><td>Giữ đúng hợp đồng hoặc bỏ quan hệ kế thừa</td></tr>
<tr><td><b>ISP</b></td><td>Interface 9 method, nhiều lớp để trống 6 method</td><td>Tách interface theo nhu cầu của client</td></tr>
<tr><td><b>DIP</b></td><td>Module cấp cao new lớp cấp thấp bên trong</td><td>Phụ thuộc interface, tiêm từ điểm khởi tạo</td></tr>
</tbody></table>
<p>Đọc bảng theo chiều dọc: dấu hiệu là thứ nhìn thấy trong mã, cách sửa là thay đổi nhỏ nhất loại bỏ dấu hiệu đó.</p>`
      },
      {
        title: "TypeScript: SRP và OCP",
        wide: true,
        html: `<pre><code>interface DiscountRule {
  apply(total: number): number;
}

class PricingService {
  constructor(private readonly rules: DiscountRule[]) {}

  price(items: Item[]): number {
    const base = items.reduce((sum, i) =&gt; sum + i.price * i.qty, 0);
    return this.rules.reduce((t, rule) =&gt; rule.apply(t), base);
  }
}

class TetRule implements DiscountRule {
  apply(total: number): number {
    return total &gt;= 500000 ? total * 0.9 : total;
  }
}</code></pre>
<p><code>PricingService</code> chỉ biết hợp đồng. Thêm quy tắc mùa khác là thêm một lớp, không sửa tệp dịch vụ.</p>`
      },
      {
        title: "Java: hợp đồng LSP",
        html: `<pre><code>abstract class Employee {
  abstract double total();
}

class Intern extends Employee {
  double total() { return hourlyRate * hours; }

  double bonus() {
    throw new UnsupportedOperationException();
  }
}</code></pre>
<p>Ba điều kiện của LSP: không ném lỗi mới, không siết điều kiện đầu vào, không nới lỏng điều kiện đầu ra. <code>bonus()</code> ném lỗi là vi phạm rõ nhất.</p>`
      },
      {
        title: "ISP: tách theo nhu cầu",
        html: `<pre><code>interface Payable { double total(); }
interface BonusEligible { double bonus(); }

class FullTime implements Payable, BonusEligible {
  public double total() { return baseSalary; }
  public double bonus() { return baseSalary * 0.1; }
}

class Intern implements Payable {
  public double total() { return hourlyRate * hours; }
}</code></pre>
<p>Client chỉ phụ thuộc interface nó dùng. <code>PayrollReport</code> nhận <code>List&lt;Payable&gt;</code>, phần thưởng nhận <code>List&lt;BonusEligible&gt;</code>.</p>`
      },
      {
        title: "Checklist review thiết kế",
        wide: true,
        html: `<ul>
<li>Class này có bao nhiêu lý do để thay đổi? Trên 1 là xem lại SRP.</li>
<li>Thêm một loại mới cần sửa bao nhiêu tệp? Trên 1 là xem lại OCP.</li>
<li>Mọi lớp con có dùng được thay lớp cha mà không cần instanceof hay try/catch?</li>
<li>Interface có method nào bị implementation để trống hoặc ném lỗi?</li>
<li>Module cấp cao có import lớp cụ thể nào không?</li>
<li>Hành vi cộng thêm đang dùng kế thừa hay composition?</li>
</ul>
<p>Chạy checklist này trên diff trước khi mở pull request; mỗi câu trả lời xấu chỉ ra một chỗ sửa cụ thể.</p>`
      }
    ]
  });
})();
