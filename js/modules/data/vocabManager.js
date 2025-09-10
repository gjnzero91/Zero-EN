// js/modules/data/vocabManager.js
// Quản lý tải và tìm kiếm từ vựng cho các trang A1-B1 và B2-C2

import { config } from "../core/config.js";
import { appState } from "../core/appState.js";

// Load dataset cho A1-B1 hoặc B2-C2
export async function loadDatasetForPage(page) {
  const src = page === "b2c2" ? config.dataset.b2c2 : config.dataset.a1b1;
  const res = await fetch(src, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dataset: " + src);
  const data = await res.json();

  // Dữ liệu của cả A1-B1 và B2-C2 đều nằm trong packages
  const items = data.packages?.flat() || [];

  // Chuẩn hoá thành {word,pos,ipa}
  appState.words = items.map(x => ({
    word: x.word ?? x.term ?? "",
    pos: x.pos ?? x.wordType ?? x.partOfSpeech ?? "",
    ipa: x.ipa ?? x.pronunciation ?? ""
  }));
}

// Search across BOTH datasets (3000 + 5000)
export async function searchAcrossDatasets(query) {
  const [aRes, bRes] = await Promise.all([
    fetch(config.dataset.a1b1, { cache: "force-cache" }),
    fetch(config.dataset.b2c2, { cache: "force-cache" })
  ]);

  const [aData, bData] = await Promise.all([aRes.json(), bRes.json()]);

  const norm = w => (w || "").toLowerCase().trim();
  const q = norm(query);

  const toObj = x => ({
    word: x.word ?? x.term ?? "",
    pos:  x.pos ?? x.wordType ?? x.partOfSpeech ?? "",
    ipa:  x.ipa ?? x.pronunciation ?? ""
  });

  // Cả hai dataset đều lấy từ packages
  const allA = aData.packages?.flat().map(toObj) || [];
  const allB = bData.packages?.flat().map(toObj) || [];

  const inA = allA.find(x => norm(x.word) === q);
  if (inA) return inA;

  const inB = allB.find(x => norm(x.word) === q);
  return inB || null;
}
