// AdminPanel.js
import "./AdminPanel.css";

import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";
import ContentManager from "./ContentManager";

const emptyOcc = { startDate: "", endDate: "", startTime: "", endTime: "" };

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [occurrences, setOccurrences] = useState([ { ...emptyOcc } ]);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [language, setLanguage] = useState("ja");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (activeTab === "events") fetchEvents(); }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "schedules"));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setEvents(list);
    } catch (e) {
      console.error("Error fetching events:", e);
    }
    setLoading(false);
  };

  // ダミー翻訳（元のまま）
  const translateText = async (text) => {
    try {
      const translations = { 尺八コンサート: "Shakuhachi Concert", 尺八ワークショップ: "Shakuhachi Workshop", 東京: "Tokyo", 大阪: "Osaka", 京都: "Kyoto" };
      return translations[text] || `Translated: ${text}`;
    } catch (e) {
      console.error("Translation error:", e);
      return `Translation failed: ${text}`;
    }
  };

  const validate = () => {
    if (!title || !location) return false;
    const hasAtLeastOne = occurrences.length > 0 && occurrences.some(o => o.startDate);
    if (!hasAtLeastOne) return false;
    return true;
  };

  const normalizeOccurrences = (list) => {
    // 空行除去 & 日付昇順
    const filled = list
      .filter(o => o.startDate) // startDate必須
      .map(o => ({
        startDate: o.startDate,
        endDate: o.endDate || "",
        startTime: o.startTime || "",
        endTime: o.endTime || ""
      }))
      .sort((a,b) => a.startDate.localeCompare(b.startDate));
    return filled;
  };

  const computeFirstDate = (occs) => occs.length ? occs.reduce((min, o) => (o.startDate < min ? o.startDate : min), occs[0].startDate) : "";

  const handleAdd = async () => {
    if (!validate()) { alert("必須項目（タイトル／場所／いずれかの日程）を入力してください"); return; }
    setLoading(true);
    try {
      const occs = normalizeOccurrences(occurrences);
      const firstDate = computeFirstDate(occs);

      const base = { title, occurrences: occs, firstDate, location, details, image, language };

      if (language === "ja") {
        await addDoc(collection(db, "schedules"), base);

        const englishData = {
          ...base,
          title: await translateText(title),
          location: await translateText(location),
          details: await translateText(details),
          language: "en",
        };
        await addDoc(collection(db, "schedules"), englishData);
        alert("イベントを日本語と英語で追加しました！");
      } else {
        await addDoc(collection(db, "schedules"), base);
        alert("イベントを追加しました！");
      }

      resetForm();
      fetchEvents();
    } catch (e) {
      console.error("Error adding event:", e);
      alert("エラーが発生しました");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !validate()) { alert("必須項目（タイトル／場所／いずれかの日程）を入力してください"); return; }
    setLoading(true);
    try {
      const occs = normalizeOccurrences(occurrences);
      const firstDate = computeFirstDate(occs);
      const ref = doc(db, "schedules", editingId);
      await updateDoc(ref, { title, occurrences: occs, firstDate, location, details, image, language });
      resetForm();
      fetchEvents();
      alert("イベントを更新しました！");
    } catch (e) {
      console.error("Error updating event:", e);
      alert("更新中にエラーが発生しました");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("本当にこのイベントを削除しますか？")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "schedules", id));
      fetchEvents();
      alert("イベントを削除しました！");
    } catch (e) {
      console.error("Error deleting event:", e);
      alert("削除中にエラーが発生しました");
    }
    setLoading(false);
  };

  const handleEdit = (ev) => {
    setTitle(ev.title || "");
    // 後方互換：occurrences が無ければ旧 date/time を1件に変換
    const occs = Array.isArray(ev.occurrences) && ev.occurrences.length
      ? ev.occurrences
      : [{ startDate: ev.date || "", endDate: "", startTime: ev.time || "", endTime: "" }];
    setOccurrences(occs.length ? occs : [{ ...emptyOcc }]);
    setLocation(ev.location || "");
    setDetails(ev.details || "");
    setImage(ev.image || "");
    setLanguage(ev.language || "ja");
    setEditingId(ev.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setTitle("");
    setOccurrences([{ ...emptyOcc }]);
    setLocation("");
    setDetails("");
    setImage("");
    setLanguage("ja");
    setEditingId(null);
  };

  const updateOcc = (idx, key, val) => {
    setOccurrences(prev => prev.map((o,i) => i===idx ? { ...o, [key]: val } : o));
  };
  const addOcc = () => setOccurrences(prev => [...prev, { ...emptyOcc }]);
  const removeOcc = (idx) => setOccurrences(prev => prev.filter((_,i) => i!==idx));

  const renderOccurrenceLabel = (o) => {
    const sameDay = o.endDate && o.endDate !== "" ? (o.endDate === o.startDate ? true : false) : true;
    const datePart = o.endDate && o.endDate !== "" && !sameDay
      ? `${o.startDate} 〜 ${o.endDate}`
      : `${o.startDate}`;
    const timePart = o.startTime ? (o.endTime ? `${o.startTime}〜${o.endTime}` : `${o.startTime}`) : "";
    return [datePart, timePart].filter(Boolean).join(" / ");
  };

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>イベント管理</button>
        <button className={`tab-btn ${activeTab === "content" ? "active" : ""}`} onClick={() => setActiveTab("content")}>コンテンツ管理</button>
      </div>

      {activeTab === "events" && (
        <>
          <div className="form-container">
            <h2>{editingId ? "イベントを編集" : "新しいイベントを追加"}</h2>

            <div className="form-group">
              <label>タイトル*</label>
              <input type="text" value={title} placeholder="イベントタイトル" onChange={(e) => setTitle(e.target.value)} required />
            </div>

            {/* 複数日程 */}
            <div className="form-group">
              <label>日程（複数可）*</label>
              {occurrences.map((o, idx) => (
                <div key={idx} className="occurrence-row">
                  <div className="form-row">
                    <div className="form-group">
                      <label>開始日</label>
                      <input type="date" value={o.startDate} onChange={(e)=>updateOcc(idx,"startDate",e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>終了日（任意）</label>
                      <input type="date" value={o.endDate} onChange={(e)=>updateOcc(idx,"endDate",e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>開始時間（任意）</label>
                      <input type="time" value={o.startTime} onChange={(e)=>updateOcc(idx,"startTime",e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>終了時間（任意）</label>
                      <input type="time" value={o.endTime} onChange={(e)=>updateOcc(idx,"endTime",e.target.value)} />
                    </div>
                  </div>
                  <div className="occurrence-actions">
                    <span className="occurrence-preview">{renderOccurrenceLabel(o) || "（未入力）"}</span>
                    {occurrences.length > 1 && (
                      <button type="button" className="btn delete-btn" onClick={() => removeOcc(idx)}>この日程を削除</button>
                    )}
                  </div>
                  {idx < occurrences.length - 1 && <hr style={{border:'none', borderTop:'1px dashed #ddd', margin:'8px 0'}}/>}
                </div>
              ))}
              <div className="button-group" style={{marginTop:12}}>
                <button type="button" className="btn add-btn" onClick={addOcc}>＋ 日程を追加</button>
              </div>
            </div>

            <div className="form-group">
              <label>場所*</label>
              <input type="text" value={location} placeholder="開催場所" onChange={(e) => setLocation(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>詳細</label>
              <textarea value={details} placeholder="イベントの詳細情報" onChange={(e) => setDetails(e.target.value)} rows="4" />
            </div>

            <div className="form-group">
              <label>画像URL</label>
              <input type="text" value={image} placeholder="画像のURL" onChange={(e) => setImage(e.target.value)} />
            </div>

            <div className="form-group">
              <label>言語</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="ja">日本語</option>
                <option value="en">英語</option>
              </select>
            </div>

            <div className="button-group">
              {editingId ? (
                <>
                  <button className="btn update-btn" onClick={handleUpdate} disabled={loading}>{loading ? "処理中..." : "更新する"}</button>
                  <button className="btn cancel-btn" onClick={resetForm} disabled={loading}>キャンセル</button>
                </>
              ) : (
                <button className="btn add-btn" onClick={handleAdd} disabled={loading}>{loading ? "処理中..." : "追加する"}</button>
              )}
            </div>
          </div>

          <div className="events-list">
            <h2>イベント一覧</h2>
            {loading && <div className="loading">読み込み中...</div>}
            {events.length === 0 && !loading ? (
              <p className="no-events">イベントはまだありません</p>
            ) : (
              <div className="event-cards">
                {events.map((event) => {
                  const occs = Array.isArray(event.occurrences) && event.occurrences.length
                    ? event.occurrences
                    : (event.date ? [{ startDate: event.date, endDate: "", startTime: event.time || "", endTime: "" }] : []);
                  return (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className="language-tag">{event.language === "en" ? "EN" : "JP"}</span>
                      </div>
                      <div className="event-details">
                        <p><strong>日程:</strong></p>
                        <ul style={{marginTop:6, paddingLeft:18}}>
                          {occs.map((o,i)=>(
                            <li key={i}>
                              {o.endDate && o.endDate!=="" && o.endDate!==o.startDate
                                ? `${o.startDate} 〜 ${o.endDate}`
                                : `${o.startDate}`
                              }
                              {o.startTime ? ` / ${o.startTime}${o.endTime ? `〜${o.endTime}` : ""}` : ""}
                            </li>
                          ))}
                        </ul>
                        <p><strong>場所:</strong> {event.location}</p>
                        {event.details && <p><strong>詳細:</strong> {event.details}</p>}
                        {event.image && (
                          <div className="event-image">
                            <img src={event.image || "/placeholder.svg"} alt={event.title} />
                          </div>
                        )}
                      </div>
                      <div className="event-actions">
                        <button className="btn edit-btn" onClick={() => handleEdit(event)}>編集</button>
                        <button className="btn delete-btn" onClick={() => handleDelete(event.id)}>削除</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "content" && <ContentManager />}
    </div>
  );
};

export default AdminPanel;
