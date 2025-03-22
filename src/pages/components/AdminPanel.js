import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [events, setEvents] = useState([]);

  // Fetch existing events
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, "schedules"));
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    };
    
    fetchEvents();
  }, []);

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "schedules"), {
        title,
        date,
        time,
        location,
        image
      });
      
      // Clear form
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setImage("");
      
      // Refresh events list
      const eventsSnapshot = await getDocs(collection(db, "schedules"));
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
      
      alert("イベントを追加しました！");
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("エラーが発生しました。");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "schedules", id));
      
      // Update events list
      setEvents(events.filter(event => event.id !== id));
      
      alert("イベントを削除しました！");
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("削除中にエラーが発生しました。");
    }
  };

  return (
    <div className="admin-panel">
      <h2>イベント管理</h2>
      
      <div className="event-form">
        <input 
          type="text" 
          placeholder="タイトル" 
          value={title}
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          type="date" 
          value={date}
          onChange={e => setDate(e.target.value)} 
        />
        <input 
          type="time" 
          value={time}
          onChange={e => setTime(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="場所" 
          value={location}
          onChange={e => setLocation(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="画像URL" 
          value={image}
          onChange={e => setImage(e.target.value)} 
        />
        <button onClick={handleAdd}>追加</button>
      </div>

      <div className="events-list">
        <h3>登録済みイベント</h3>
        {events.length === 0 ? (
          <p>イベントがありません</p>
        ) : (
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <div className="event-item">
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.date} {event.time} @ {event.location}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="delete-button"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;