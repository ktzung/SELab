/* SELab — engine tất định cho SOLID, liên kết và kế thừa */
(function () {
  const SEED = window.SE_SEED;

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function formatNumber(n) {
    const value = Number(n);
    if (!Number.isFinite(value)) return "0";
    return value.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  }

  function runSolid(input) {
    const box = input || {};
    const counts = {};
    let total = 0;
    let worst = SEED.principles[0];
    SEED.principles.forEach((p) => {
      const value = clampInt(box[p.key], 0, 5, 0);
      counts[p.key] = value;
      total += value;
      if (value > counts[worst.key]) worst = p;
    });
    const score = round1(100 - total * 4);
    const clean = total === 0 ? 1 : 0;
    const verdict = clean ? "Sạch" : "Cần sửa";
    const trace = SEED.principles.map((p) => ({
      step: p.key,
      label: `${p.label} — ${p.name}`,
      result: counts[p.key] === 0 ? "ok" : "warn",
      note: counts[p.key] === 0 ? "không vi phạm" : `${counts[p.key]} vi phạm`
    }));

    return {
      ok: Boolean(clean),
      verdict,
      meta: `${total} vi phạm · điểm ${formatNumber(score)}/100`,
      statusText: clean ? "cả năm nguyên tắc sạch" : `nặng nhất: ${worst.label}`,
      tags: [`${total} vi phạm`, `điểm ${formatNumber(score)}`, worst.label],
      trace,
      payload: {
        SRP: counts.srp,
        OCP: counts.ocp,
        LSP: counts.lsp,
        ISP: counts.isp,
        DIP: counts.dip,
        "nặng nhất": `${worst.label} — ${worst.name}`,
        "điểm": formatNumber(score)
      },
      metrics: [
        { label: "Tổng vi phạm", value: total },
        { label: "Điểm", value: formatNumber(score) },
        { label: "Nặng nhất", value: total ? worst.label : "—" },
        { label: "Kết luận", value: clean ? "đạt" : "sửa" }
      ],
      values: { total, score, clean, worst: worst.key }
    };
  }

  function runCouple(input) {
    const box = input || {};
    const classes = clampInt(box.classes, 1, 50, 10);
    const deps = clampInt(box.deps, 0, 200, 20);
    const abstractTypes = clampInt(box.abstractTypes, 0, 30, 3);
    const avgFanOut = round1(deps / classes);
    const abstractShare = round1((abstractTypes / classes) * 100);
    const stable = avgFanOut <= 3 && abstractShare >= 30 ? 1 : 0;
    const verdict = stable ? "Dễ đổi" : "Rối";
    const trace = [
      {
        step: "fanout",
        label: "Fan-out trung bình",
        result: avgFanOut <= 3 ? "ok" : "warn",
        note: `${formatNumber(avgFanOut)} phụ thuộc mỗi class (cần ≤ 3)`
      },
      {
        step: "abstract",
        label: "Tỉ lệ trừu tượng",
        result: abstractShare >= 30 ? "ok" : "warn",
        note: `${abstractTypes}/${classes} class · ${abstractShare}% (cần ≥ 30%)`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: stable ? "ok" : "warn",
        note: stable ? "Phụ thuộc hợp đồng, thay lớp cụ thể thoải mái" : "Nên tách interface và giảm fan-out"
      }
    ];

    return {
      ok: Boolean(stable),
      verdict,
      meta: `${classes} class · fan-out ${formatNumber(avgFanOut)}`,
      statusText: `${abstractShare}% trừu tượng`,
      tags: [`fan-out ${formatNumber(avgFanOut)}`, `${abstractShare}% trừu tượng`, `${deps} phụ thuộc`],
      trace,
      payload: {
        classes,
        "tổng phụ thuộc": deps,
        "fan-out": formatNumber(avgFanOut),
        "interface/abstract": abstractTypes,
        "tỉ lệ trừu tượng": `${abstractShare}%`
      },
      metrics: [
        { label: "Số class", value: classes },
        { label: "Fan-out TB", value: formatNumber(avgFanOut) },
        { label: "Trừu tượng", value: `${abstractShare}%` },
        { label: "Kết luận", value: stable ? "dễ đổi" : "rối" }
      ],
      values: { classes, deps, avgFanOut, abstractShare, stable }
    };
  }

  function runInherit(input) {
    const box = input || {};
    const depth = clampInt(box.depth, 1, 6, 3);
    const subclasses = clampInt(box.subclasses, 0, 20, 4);
    const overrides = clampInt(box.overrides, 0, 30, 4);
    const composition = clampInt(box.composition, 0, 20, 5);
    const overridePenalty = Math.max(0, overrides - subclasses);
    const compositionPenalty = Math.max(0, 5 - composition);
    const risk = round1(depth * 2 + overridePenalty + compositionPenalty);
    const safe = depth <= 3 && overridePenalty === 0 && composition >= 3 ? 1 : 0;
    const verdict = safe ? "An toàn" : "Rủi ro";
    const trace = [
      {
        step: "depth",
        label: "Độ sâu cây",
        result: depth <= 3 ? "ok" : "warn",
        note: `${depth} tầng (nên ≤ 3)`
      },
      {
        step: "override",
        label: "Override so với lớp con",
        result: overridePenalty === 0 ? "ok" : "warn",
        note: `${overrides} override / ${subclasses} lớp con`
      },
      {
        step: "composition",
        label: "Mức dùng composition",
        result: composition >= 3 ? "ok" : "warn",
        note: `${composition} điểm (nên ≥ 3)`
      }
    ];

    return {
      ok: Boolean(safe),
      verdict,
      meta: `rủi ro ${formatNumber(risk)} · sâu ${depth}`,
      statusText: safe ? "cây nông, ít override" : `rủi ro ${formatNumber(risk)}`,
      tags: [`sâu ${depth}`, `${overrides} override`, `rủi ro ${formatNumber(risk)}`],
      trace,
      payload: {
        "độ sâu": depth,
        "lớp con": subclasses,
        override: overrides,
        composition,
        "phạt override": overridePenalty,
        "phạt composition": compositionPenalty,
        "điểm rủi ro": formatNumber(risk)
      },
      metrics: [
        { label: "Độ sâu", value: depth },
        { label: "Lớp con", value: subclasses },
        { label: "Override", value: overrides },
        { label: "Rủi ro", value: formatNumber(risk) }
      ],
      values: { depth, subclasses, overrides, composition, risk, safe }
    };
  }

  function run(kind, values) {
    if (kind === "couple") return runCouple(values);
    if (kind === "inherit") return runInherit(values);
    return runSolid(values);
  }

  window.SE_ENGINE = { run, formatNumber, round1, clampInt };
})();
