
import './AdminPanel.css';



import { useState, useEffect } from "react"
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query } from "firebase/firestore"
import { db } from "./firebase"
import ContentManager from "./ContentManager"

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("events")
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [details, setDetails] = useState("")
  const [image, setImage] = useState("")
  const [language, setLanguage] = useState("ja")
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents()
    }
  }, [activeTab])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "schedules"))
      const querySnapshot = await getDocs(q)
      const eventList = []
      querySnapshot.forEach((doc) => {
        eventList.push({ id: doc.id, ...doc.data() })
      })
      setEvents(eventList)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
    setLoading(false)
  }

  const translateText = async (text) => {
    try {
      const translations = {
        尺八コンサート: "Shakuhachi Concert",
        尺八ワークショップ: "Shakuhachi Workshop",
        東京: "Tokyo",
        大阪: "Osaka",
        京都: "Kyoto",
      }

      return translations[text] || `Translated: ${text}`
    } catch (error) {
      console.error("Translation error:", error)
      return `Translation failed: ${text}`
    }
  }

  const handleAdd = async () => {
    if (!title || !date || !time || !location) {
      alert("すべての必須フィールドを入力してください")
      return
    }

    setLoading(true)
    try {
      const eventData = {
        title,
        date,
        time,
        location,
        details,
        image,
        language,
      }

      if (language === "ja") {
        await addDoc(collection(db, "schedules"), eventData)

        const englishData = {
          title: await translateText(title),
          date,
          time,
          location: await translateText(location),
          details: await translateText(details),
          image,
          language: "en",
        }

        await addDoc(collection(db, "schedules"), englishData)
        alert("イベントを日本語と英語で追加しました！")
      } else {
        await addDoc(collection(db, "schedules"), eventData)
        alert("イベントを追加しました！")
      }

      resetForm()
      fetchEvents()
    } catch (error) {
      console.error("Error adding event:", error)
      alert("エラーが発生しました")
    }
    setLoading(false)
  }

  const handleUpdate = async () => {
    if (!title || !date || !time || !location || !editingId) {
      alert("すべての必須フィールドを入力してください")
      return
    }

    setLoading(true)
    try {
      const eventRef = doc(db, "schedules", editingId)
      await updateDoc(eventRef, {
        title,
        date,
        time,
        location,
        details,
        image,
        language,
      })

      resetForm()
      fetchEvents()
      alert("イベントを更新しました！")
    } catch (error) {
      console.error("Error updating event:", error)
      alert("更新中にエラーが発生しました")
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm("本当にこのイベントを削除しますか？")) {
      setLoading(true)
      try {
        await deleteDoc(doc(db, "schedules", id))
        fetchEvents()
        alert("イベントを削除しました！")
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("削除中にエラーが発生しました")
      }
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setTitle(event.title)
    setDate(event.date)
    setTime(event.time)
    setLocation(event.location)
    setDetails(event.details || "")
    setImage(event.image || "")
    setLanguage(event.language || "ja")
    setEditingId(event.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = () => {
    setTitle("")
    setDate("")
    setTime("")
    setLocation("")
    setDetails("")
    setImage("")
    setLanguage("ja")
    setEditingId(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
          イベント管理
        </button>
        <button
          className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          コンテンツ管理
        </button>
      </div>

      {activeTab === "events" && (
        <>
          <div className="form-container">
            <h2>{editingId ? "イベントを編集" : "新しいイベントを追加"}</h2>

            <div className="form-group">
              <label>タイトル*</label>
              <input
                type="text"
                value={title}
                placeholder="イベントタイトル"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>日付*</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>時間*</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>場所*</label>
              <input
                type="text"
                value={location}
                placeholder="開催場所"
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>詳細</label>
              <textarea
                value={details}
                placeholder="イベントの詳細情報"
                onChange={(e) => setDetails(e.target.value)}
                rows="4"
              />
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
                  <button className="btn update-btn" onClick={handleUpdate} disabled={loading}>
                    {loading ? "処理中..." : "更新する"}
                  </button>
                  <button className="btn cancel-btn" onClick={resetForm} disabled={loading}>
                    キャンセル
                  </button>
                </>
              ) : (
                <button className="btn add-btn" onClick={handleAdd} disabled={loading}>
                  {loading ? "処理中..." : "追加する"}
                </button>
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
                {events.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className="language-tag">{event.language === "en" ? "EN" : "JP"}</span>
                    </div>

                    <div className="event-details">
                      <p>
                        <strong>日付:</strong> {event.date}
                      </p>
                      <p>
                        <strong>時間:</strong> {event.time}
                      </p>
                      <p>
                        <strong>場所:</strong> {event.location}
                      </p>
                      {event.details && (
                        <p>
                          <strong>詳細:</strong> {event.details}
                        </p>
                      )}
                      {event.image && (
                        <div className="event-image">
                          <img src={event.image || "/placeholder.svg"} alt={event.title} />
                        </div>
                      )}
                    </div>

                    <div className="event-actions">
                      <button className="btn edit-btn" onClick={() => handleEdit(event)}>
                        編集
                      </button>
                      <button className="btn delete-btn" onClick={() => handleDelete(event.id)}>
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "content" && <ContentManager />}
    </div>
  )
}

export default AdminPanel
