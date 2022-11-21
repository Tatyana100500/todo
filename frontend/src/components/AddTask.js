import Modal from "./Modal"
import {useState} from 'react'
import '../styles/addTask.css'
import {db} from '../firebase'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import { storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

/**
 * Конструктор для добавления задачи
 * @constructor
 * @param {function} onClose - функция закрытия модального окна
 * @param {boolean} open - состояние модального окна
 */
function AddTask({onClose, open}) {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDay] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [progresspercent, setProgresspercent] = useState(0)

  /** функция добавляющая новую задачу в firestore */
  const handleSubmit = async (e) => {
    e.preventDefault();
	const file = e.target[3]?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    /** функция загрузки файла */
	uploadTask.on("state_changed",
	(snapshot) => {
	  const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
	  setProgresspercent(progress);
	},(error) => { alert(error);},() => {
	  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	  setImgUrl(downloadURL);
	  });
	}
  );
    try {
      await addDoc(collection(db, 'tasks'), {
        title: title,
        description: description,
		date: date,
		file: file.name,
        completed: false,
        created: Timestamp.now()
      })
      onClose()
    } catch (err) {
      alert(err)
    }
  };

  return (
    <Modal modalLable='Add Task' onClose={onClose} open={open}>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className='addTask' name='addTask'>
        <input 
          type='text' 
          name='title' 
          onChange={(e) => setTitle(e.target.value.toUpperCase())} 
          value={title}
          placeholder='Enter title'/>
        <textarea 
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter task decription'
          value={description}></textarea>
		  <input 
          type='date' 
          name='date' 
          onChange={(e) => setDay(e.target.value)} 
          value={date}
          placeholder='Enter day'/>
		  <input 
          type='file' 
          name='file' 
		  multiple
          placeholder='Enter file'/>
        <button type='submit'>Создать</button>
      </form> 
    </Modal>
  )
}

export default AddTask