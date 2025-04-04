import { collection, addDoc, deleteDoc, doc } from "firebase/firestore"; // これが正しい
import { getFirestore } from "firebase/firestore"; // firestoreからdbをインポート

const db = getFirestore(); // dbの取得

const AdminPanel = () => {
   const [title, setTitle] = useState("");
   const [date, setDate] = useState("");
   const [time, setTime] = useState("");
   const [location, setLocation] = useState("");
   const [image, setImage] = useState("");

   const handleAdd = async () => {
       await addDoc(collection(db, "schedules"), {
           title,
           date,
           time,
           location,
           image
       });
       alert("イベントを追加しました！");
   };

   const handleDelete = async (id) => {
       await deleteDoc(doc(db, "schedules", id));
       alert("イベントを削除しました！");
   };

   return (
       <div>
           <h2>イベント管理</h2>
           <input type="text" placeholder="タイトル" onChange={e => setTitle(e.target.value)} />
           <input type="date" onChange={e => setDate(e.target.value)} />
           <input type="time" onChange={e => setTime(e.target.value)} />
           <input type="text" placeholder="場所" onChange={e => setLocation(e.target.value)} />
           <input type="text" placeholder="画像URL" onChange={e => setImage(e.target.value)} />
           <button onClick={handleAdd}>追加</button>
       </div>
   );
};

export default AdminPanel;
