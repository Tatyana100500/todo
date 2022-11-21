import Modal from "./Modal"
import '../styles/taskItem.css'

/**
 * Конструктор для просмотра задачи
 * @constructor
 * @param {boolean} open - состояние модального окна
 * @param {string} title - заголовок задачи
 * @param {string} date - дата окончания задачи
 * @param {string} description - описание задачи
 * @param {string} file - путь до файла
 * @param {function} onClose - функция закрытия модального окна
 */
function TaskItem({onClose, open, title, date, file, description}) {

  return (
    <Modal modalLable='Task Item' onClose={onClose} open={open}>
      <div className='taskItem'>
        <h2>{title}</h2>
        <p>{description}</p>
		<p>Выполнить до {date}</p>
		<img src={file}  width="400" height="400"></img>
      </div>
    </Modal>
  )
}

export default TaskItem