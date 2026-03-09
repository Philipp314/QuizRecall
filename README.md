# QuizRecall - WAP智慧輔助記憶系統

WAP 是一款基於 **間隔重複 (Spaced Repetition)** 原理開發的輕量化 Web App。它透過動態計算複習間隔與多樣化的選擇題練習，幫助使用者科學地管理長短期記憶。

## 🚀 核心特色

* **智慧間隔算法**：系統自動計算複習週期。
* **測驗通過**：延長複習間隔。
* **測驗失敗**：適度縮短間隔（非直接歸零），「知道自己錯了」也是有效的練習過程。


* **多樣化題庫管理**：支援分庫管理（如：英文單字、日文單字）。
* **學習模式**：可指定特定資料庫進行強化。
* **測驗模式**：各庫題目自動混雜，模擬真實應用場景。


* **靈活的學習節奏**：使用者自主掌握進度。每次從題庫抽出 10 題新內容，確認記住後才正式納入複習循環。
* **結構化資料庫**：支援使用者自行匯入 JSON 格式的記憶內容，具備高度擴充性。
* **完整備份機制**：支援一鍵導出/還原整個資料庫，包含所有題庫內容與個人記憶情形。
* **語音輔助**：整合瀏覽器內建 TTS (Text-to-Speech) 技術，提供即時發音參考。

---

## 🛠 使用指南

### 1. 初始與複習

* **預覽進度**：進入頁面即可看到今日「待複習」的題目總數。
* **啟動測驗**：點擊「開始測驗」進入練習。
* **作答互動**：點擊題目框開始，按下下方選項作答。作答後選項鎖定，再次點擊題目框即可進入下一題。

### 2. 學習新題目

* **抽取新題**：點擊主畫面下方的「學習新題目」，系統會從未學過的題目中隨機抽出 10 題。
* **字卡互動**：點擊字卡可放大檢視詳細內容。
* **記住了**：點擊該按鈕，題目將正式進入複習排程。
* **取消**：若暫不想學習該題，則不記入複習。



### 3. 進度與資料管理

* **進度顯示**：透過左上角選單按鈕，可查看各分庫的進度條。
* **數據保障**：提供「備份」與「還原」功能，可一鍵導出所有題庫數據（IndexedDB 內容）。

---

## ⚖️ 授權與聲明 (License & Credits)

### 專案授權

本專案程式碼部分採用 **[MIT License](https://opensource.org/licenses/MIT)** 授權。

### 第三方組件

本專案在運行時透過 CDN (`<script src="...">`) 引入以下套件，本倉庫未直接包含其原始碼：

* **[Dexie.js](https://dexie.org/)**: 用於處理瀏覽器 IndexedDB 存儲。
* **[DOMPurify](https://github.com/cure53/dompurify)**：用於過濾並防止 XSS 攻擊，確保使用者匯入內容的安全。

### 資料庫來源說明

本專案內建之「日文單字題庫」係參考自：

* **來源**: [JLPT vocabulary by level](https://www.kaggle.com/datasets/robinpourtaud/jlpt-words-by-level) (作者: Robin Pourtaud / Kaggle)。
* **授權**: **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**。
* **說明**: 本項目對原始數據進行了結構化整理與格式轉換，以符合 WAP 系統運行規格。

---

## 📂 附錄：題庫 JSON 規格說明

使用者可依據以下結構自定義匯入題庫。本格式支援多種出題邏輯與 HTML 樣式自定義。

### 數據範例 (以日文單字為例)

```json
{
  "name": "JLPT-N5",
  "format": ["Kanji", "reading", "meaning"],
  "showType": "<span style='font-size: 2em;'>${Kanji}</span><span>${reading}</span><hr><span style='font-size: 1.5em;'>${meaning}</span>",
  "TTSvoiceURl": "Google 日本語",
  "question": [
    {"Kanji": "会う", "reading": "あう", "meaning": "遇見，看見"},
    {"Kanji": "青", "reading": "あお", "meaning": "藍色"}
  ],
  "testMethod": [
    {
      "probability": 0.65,
      "show": "meaning",
      "show2nd": null,
      "select":"reading",
      "selectType": "random",
      "selectNumber": 4,
      "answer": null,
      "soundBefore": null,
      "sdoundAfter": "reading",
      "score": 100
    },
    {
      "probability": 0.35,
      "show": "Kanji",
      "show2nd": "reading",
      "select":"meaning",
      "selectType": "random",
      "selectNumber": 4,
      "answer": null,
      "soundBefore": "reading",
      "sdoundAfter": "reading",
      "score": 20
    }
  ]
}

```

### 欄位解析

| 欄位名稱 | 說明 |
| --- | --- |
| **name** | 題庫顯示名稱。 |
| **format** | 核心欄位定義（對應 question 中的 Key）。 |
| **showType** | 學習模式下的 HTML 字卡模板，支援 `${Key}` 變數。 |
| **TTSvoiceURl** | 指定使用的瀏覽器語音引擎。 |
| **testMethod** | 出題邏輯陣列，可設定多種模式與出現權重（probability）。 |
| **selectType** | 選項生成方式（如 `random` 從題庫隨機抽取干擾項）。 |
| **soundBefore/After** | 題目出現前或作答完成後是否自動發音（指定欄位）。 |
| **score** | 該測試模式對記憶算法的影響權重。 |

---

## 📝 技術備註

* 本專案採用結構化資料庫設計，確保資料與記憶情形（Interval/Ease Factor）分離。
* 建議使用支援 Web Speech API 的現代瀏覽器以獲得最佳語音體驗。