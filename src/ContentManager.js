"use client"
import { useState, useEffect } from "react"
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const ContentManager = () => {
  const [contents, setContents] = useState([])
  const [contentType, setContentType] = useState("profile")
  const [language, setLanguage] = useState("ja")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [order, setOrder] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editedOrders, setEditedOrders] = useState({})

  useEffect(() => {
    fetchContents()
  }, [contentType, language])

  const fetchContents = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "content"), where("type", "==", contentType), where("language", "==", language))
      const querySnapshot = await getDocs(q)
      const contentList = []
      querySnapshot.forEach((doc) => {
        contentList.push({ id: doc.id, ...doc.data() })
      })
      contentList.sort((a, b) => (a.order || 0) - (b.order || 0))
      setContents(contentList)
      // ドラッグ＆ドロップの順序管理
      const initialOrders = {}
      contentList.forEach((item, idx) => {
        initialOrders[item.id] = idx
      })
      setEditedOrders(initialOrders)
    } catch (error) {
      console.error("Error fetching contents:", error)
    }
    setLoading(false)
  }

  // ★ 新規追加時、orderを「今の最小order-1」にする
  const handleSave = async () => {
    if (!content) {
      alert("内容を入力してください")
      return
    }
    setLoading(true)
    try {
      let newOrder = Number.parseInt(order) || 0
      if (!editingId) {
        // 追加時：contentsの最小order-1
        const minOrder = contents.length > 0
          ? Math.min(...contents.map(item => typeof item.order === "number" ? item.order : 0))
          : 0
        newOrder = minOrder - 1
      }
      const contentData = {
        type: contentType,
        language,
        title,
        content,
        order: newOrder,
        updatedAt: new Date().toISOString(),
      }
      if (editingId) {
        const contentRef = doc(db, "content", editingId)
        await updateDoc(contentRef, contentData)
        alert("コンテンツを更新しました！")
      } else {
        await addDoc(collection(db, "content"), contentData)
        alert("コンテンツを追加しました！")
      }
      resetForm()
      fetchContents()
    } catch (error) {
      console.error("Error saving content:", error)
      alert("エラーが発生しました")
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm("本当にこのコンテンツを削除しますか？")) {
      setLoading(true)
      try {
        await deleteDoc(doc(db, "content", id))
        fetchContents()
        alert("コンテンツを削除しました！")
      } catch (error) {
        console.error("Error deleting content:", error)
        alert("削除中にエラーが発生しました")
      }
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setTitle(item.title || "")
    setContent(item.content)
    setOrder(item.order || 0)
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setOrder(0)
    setEditingId(null)
  }

  // ドラッグ＆ドロップでリスト順入れ替え
  const handleDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(contents)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setContents(reordered)
    // index順を保存
    const newOrders = {}
    reordered.forEach((item, idx) => {
      newOrders[item.id] = idx
    })
    setEditedOrders(newOrders)
  }

  // ドラッグ後の順序をfirestoreに一括保存
  const handleBulkOrderSave = async () => {
    setLoading(true)
    try {
      await Promise.all(
        contents.map(item => {
          const newOrder = editedOrders[item.id]
          if (newOrder !== item.order) {
            const docRef = doc(db, "content", item.id)
            return updateDoc(docRef, { order: newOrder, updatedAt: new Date().toISOString() })
          }
          return null
        })
      )
      alert("表示順序を更新しました！")
      fetchContents()
    } catch (error) {
      console.error("Error updating orders:", error)
      alert("順序の保存中にエラーが発生しました")
    }
    setLoading(false)
  }

  return (
    <div className="content-manager">
      <div className="form-container">
        <h2>{editingId ? "コンテンツを編集" : "新しいコンテンツを追加"}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>コンテンツタイプ</label>
            <select value={contentType} onChange={(e) => { setContentType(e.target.value); resetForm(); }} >
              <option value="profile">プロフィール</option>
              <option value="appearance">過去の出演情報</option>
            </select>
          </div>
          <div className="form-group">
            <label>言語</label>
            <select value={language} onChange={(e) => { setLanguage(e.target.value); resetForm(); }} >
              <option value="ja">日本語</option>
              <option value="en">英語</option>
            </select>
          </div>
          <div className="form-group">
            <label>表示順序</label>
            {/* ドラッグで順序変更するためinputは新規追加/編集専用 */}
            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} min="0" />
          </div>
        </div>
        <div className="form-group">
          <label>タイトル</label>
          <input type="text" value={title} placeholder="コンテンツのタイトル" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>内容*</label>
          <textarea value={content} placeholder="コンテンツの内容" onChange={(e) => setContent(e.target.value)} rows="6" required />
        </div>
        <div className="button-group">
          {editingId ? (
            <>
              <button className="btn update-btn" onClick={handleSave} disabled={loading}>
                {loading ? "処理中..." : "更新する"}
              </button>
              <button className="btn cancel-btn" onClick={resetForm} disabled={loading}>
                キャンセル
              </button>
            </>
          ) : (
            <button className="btn add-btn" onClick={handleSave} disabled={loading}>
              {loading ? "処理中..." : "追加する"}
            </button>
          )}
        </div>
      </div>
      <div className="content-list">
        <h2>
          {contentType === "profile" ? "プロフィール" : "過去の出演情報"}({language === "ja" ? "日本語" : "英語"})
        </h2>
        {loading && <div className="loading">読み込み中...</div>}
        {contents.length === 0 && !loading ? (
          <p className="no-content">コンテンツはまだありません</p>
        ) : (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="contentListDroppable">
                {(provided) => (
                  <div
                    className="content-cards"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {contents.map((item, idx) => (
                      <Draggable key={item.id} draggableId={item.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            className="content-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              boxShadow: snapshot.isDragging ? "0 2px 8px #8888" : "none",
                              background: snapshot.isDragging ? "#f0f0f0" : "#fff",
                              marginBottom: 8,
                            }}
                          >
                            <div className="content-header">
                              <h3>{item.title || "（タイトルなし）"}</h3>
                              <span className="order-tag">順序: {idx}</span>
                            </div>
                            <div className="content-body">
                              <p>{item.content}</p>
                            </div>
                            <div className="content-actions">
                              <button className="btn edit-btn" onClick={() => handleEdit(item)}>
                                編集
                              </button>
                              <button className="btn delete-btn" onClick={() => handleDelete(item.id)}>
                                削除
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {/* 一括順序保存ボタン */}
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button
                className="btn update-btn"
                disabled={loading}
                onClick={handleBulkOrderSave}
              >
                {loading ? "処理中..." : "順序をまとめて保存"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ContentManager
