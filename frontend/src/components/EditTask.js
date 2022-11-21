import Modal from "./Modal"
import {useState} from 'react'
import '../styles/editTask.css'
import { doc, updateDoc } from "firebase/firestore";
import {db, storage} from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

/**
 * Конструктор для редактирования задачи
 * @constructor
 * @param {number} id - идентификатор задачи
 * @param {string} toEditTitle - заголовок задачи
 * @param {string} toEditDescription - описание задачи
 * @param {boolean} open - состояние модального окна
 * @param {string} toEditDate - дата окончания задачи
 * @param {string} toEditFile - путь до файла
 * @param {function} onClose - функция закрытия модального окна
 */
function EditTask({open, onClose, toEditTitle, toEditDate, toEditFile, toEditDescription, id}) {

  const [title, setTitle] = useState(toEditTitle)
  const [description, setDescription] = useState(toEditDescription)
  const [date, setDate] = useState(toEditDate)
  const [imgUrl, setImgUrl] = useState(toEditFile)
  const [progresspercent, setProgresspercent] = useState(0)
  /** функция добавляющая редактирующая задачу в firestore */
  const handleUpdate = async (e) => {
    e.preventDefault()
	const file = e.target[3]?.files[0];
    if (!file) {
	 return imgUrl;
	}
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    /** функция загрузки файла */
	uploadTask.on("state_changed",(snapshot) => { 
	    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
	    setProgresspercent(progress);
	  },(error) => {
	   alert(error);
	  },
	  () => {
	    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	      setImgUrl(downloadURL)
	    });
	  }
    );

    const taskDocRef = doc(db, 'tasks', id)
    try{
      await updateDoc(taskDocRef, {
        title: title,
        description: description,
		date: date,
		file: file.name
      })
      onClose()
    } catch (err) {
      alert(err)
    }
    
  }

  return (
    <Modal modalLable='Edit Task' onClose={onClose} open={open}>
      <form method="post" encType="multipart/form-data" onSubmit={handleUpdate} className='editTask'>
        <input type='text' name='title' onChange={(e) => setTitle(e.target.value.toUpperCase())} value={title}/>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
		<input type='date' name='date' onChange={(e) => setDate(e.target.value)} value={date}/>
		<input type='file' name='file' multiple/>
        <button type='submit'>Изменить</button>
      </form> 
    </Modal>
  )
}

export default EditTask