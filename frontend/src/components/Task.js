import '../styles/task.css'
import {useState} from 'react'
import TaskItem from './TaskItem'
import EditTask from './EditTask'
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import * as dayjs from 'dayjs'
dayjs().format()

/**
 * Конструктор для создания задачи
 * @constructor
 * @param {number} id - идентификатор задачи
 * @param {string} title - заголовок задачи
 * @param {boolean} completed - состояние чекбокса
 * @param {string} description - описание задачи
 * @param {string} date - дата окончания задачи
 * @param {string} file - путь до файла
 */

function Task({id, title, description, date, file, completed}) {
  const [imgUrl, setImgUrl] = useState('');
  const [checked, setChecked] = useState(completed);
  const [open, setOpen] = useState({edit:false, view:false});
  const storageRef = ref(storage, 'files/' + file);
  /** Статический метод storage для загрузки файла */
	getDownloadURL(storageRef).then((downloadURL) => {
		setImgUrl(downloadURL);
	  });
  /** функция закрытия модального окна */
  const handleClose = () => {
    setOpen({edit:false, view:false})
  }
  const classn = (dayjs().isAfter(dayjs(date)) && !checked)? `task task--borderColorRed`:`task ${checked && 'task--borderColor'}`;

  /** функция обновляющая firestore */
  const handleChange = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await updateDoc(taskDocRef, {
        completed: checked
      })
    } catch (err) {
      alert(err)
    }
  }

  /** функция удаления задачи из firstore */ 
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div className={classn}>
      <div>
        <input 
          id={`checkbox-${id}`} 
          className='checkbox-custom'
          name="checkbox" 
          checked={checked}
          onChange={handleChange}
          type="checkbox" />
        <label 
          htmlFor={`checkbox-${id}`} 
          className={dayjs().isAfter(dayjs(date))? '' : "checkbox-custom-label"} 
          onClick={() => setChecked(!checked)} ></label>
      </div>
      <div className='task__body'>
        <h2>{title}</h2>
        <p>{description}</p>
		<p>Выполнить до {date}</p>
		<img src={imgUrl}  width="100" height="100"></img>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Изменить
            </button>
            <button className='task__deleteButton' onClick={handleDelete}>Удалить</button>
          </div>
          <button 
            onClick={() => setOpen({...open, view: true})}>
            Посмотреть
          </button>
        </div>
      </div>

      {open.view &&
        <TaskItem 
          onClose={handleClose} 
          title={title} 
          description={description}
		  date={date}
		  file={imgUrl}
          open={open.view} />
      }

      {open.edit &&
        <EditTask 
          onClose={handleClose} 
          toEditTitle={title} 
          toEditDescription={description}
		  toEditDate={date}
		  toEditFile={imgUrl}
          open={open.edit}
          id={id} />
      }

    </div>
  )
}

export default Task