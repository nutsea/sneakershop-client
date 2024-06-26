import React, { useEffect, useState } from "react";
import "../styles/Admin.scss";
import { IoCheckmark } from "react-icons/io5"
import { deleteChosen, fetchItemsAdmin } from "../http/itemAPI";

import AdminInput from "../components/AdminInput";

const shoesSub = [
    { id: 1, name: 'СМОТРЕТЬ ВСЁ' },
    { id: 2, name: 'КЕДЫ И КРОССОВКИ' },
    { id: 3, name: 'БОТИНКИ И УГГИ' },
    { id: 4, name: 'СЛАЙДЫ' },
    { id: 5, name: 'ДЕТСКОЕ' },
    { id: 6, name: 'ДРУГАЯ ОБУВЬ' },
  ]
  
  const clothesSub = [
    { id: 1, name: 'СМОТРЕТЬ ВСЁ' },
    { id: 7, name: 'ЛОНГСЛИВЫ  СВИТЕРЫ' },
    { id: 8, name: 'ФУТБОЛКИ' },
    { id: 9, name: 'ШТАНЫ И ДЖИНСЫ' },
    { id: 10, name: 'ШОРТЫ' },
    { id: 11, name: 'ХУДИ И СВИТШОТЫ' },
    { id: 12, name: 'КУРТКИ И ПУХОВИКИ' },
    { id: 13, name: 'БЕЛЬЕ' },
    { id: 14, name: 'ДРУГАЯ ОДЕЖДА' }
  ]
  
  const accessoriesSub = [
    { id: 1, name: 'СМОТРЕТЬ ВСЁ' },
    { id: 15, name: 'ГОЛОВНЫЕ УБОРЫ' },
    { id: 16, name: 'ПЕРЧАТКИ' },
    { id: 17, name: 'РЮКЗАКИ И СУМКИ' },
    { id: 18, name: 'КОШЕЛЬКИ' },
    { id: 19, name: 'ОЧКИ' },
    { id: 20, name: 'ШАПКИ' },
    { id: 21, name: 'НОСКИ' },
    { id: 22, name: 'ПРЕДМЕТЫ ИНТЕРЬЕРА' },
    { id: 23, name: 'ДРУГИЕ АКСЕССУАРЫ' },
    { id: 24, name: 'ФИГУРКИ' },
    { id: 25, name: 'BEARBRICKS' },
  ]  

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [password, setPassword] = useState('')
    const [tab, setTab] = useState('creating')
    const [items, setItems] = useState()
    const [deleteIds, setDeleteIds] = useState([])
    const [isDelete, setIsDelete] = useState(false)
    const [itemChange, setItemChange] = useState(null)

    const formatCategory = (cat, subcat) => {
        if (subcat && Number(subcat) >= 1) {
            if (cat === 'shoes') {
                return shoesSub[Number(subcat - 1)].name
            }
            if (cat === 'clothes') {
                return clothesSub[Number(subcat - 1)].name
            }
            if (cat === 'accessories') {
                return accessoriesSub[Number(subcat - 1)].name
            }
        } else {
            return 'СМОТРЕТЬ ВСЁ'
        }
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
        if (e.key === "Enter") {
            checkPassword()
        }
    }

    const checkPassword = () => {
        if (password === process.env.REACT_APP_ADMIN) {
            setIsAdmin(true)
            const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
            localStorage.setItem('isAdmin', true)
            localStorage.setItem('date', date)
        }
    }

    const chooseTab = (e) => {
        setTab(e.target.id)
    }

    const handleCheckItem = (e) => {
        document.querySelector(`.Item${e.target.id}`).classList.toggle('CheckedItem')
        if (!deleteIds.includes(e.target.id)) {
            setDeleteIds([...deleteIds, e.target.id])
        } else {
            const newDeleteIds = deleteIds.filter(id => id !== e.target.id)
            setDeleteIds(newDeleteIds)
        }
    }

    const handleDeleteItems = () => {
        setIsDelete(false)
        setDeleteIds([])
        deleteChosen(deleteIds).then(data => {
            fetchItemsAdmin().then(data => setItems(data))
        })
    }

    const fetchCallback = () => {
        fetchItemsAdmin().then(data => {
            data.sort(sortByCreatedAt)
            setItems(data)
        })
    }

    const sortByCreatedAt = (a, b) => {
        if (a.createdAt > b.createdAt) {
            return -1
        }
        if (a.createdAt < b.createdAt) {
            return 1
        }
        return 0
    }

    const formatDate = (date) => {
        const newDate = new Date(date)
        const day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
        const month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)
        const year = newDate.getFullYear()
        const hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
        const minutes = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
        return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
    }

    useEffect(() => {
        const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        if (localStorage.getItem('isAdmin') && localStorage.getItem('date') === date) {
            setIsAdmin(true)
        }
        fetchItemsAdmin().then(data => {
            data.sort(sortByCreatedAt)
            setItems(data)
        })
    }, [])

    return (
        <div className="MainContainer">
            <h1 className="AdminSub">Панель администратора</h1>
            {!isAdmin ?
                <>
                    <input className="AdminPassInput" type="password" placeholder="Пароль" value={password} onChange={handlePassword} onKeyDown={handlePassword} />
                    <button className="AdminBtn" onClick={checkPassword}>ВОЙТИ</button>
                </>
                :
                <div className="AdminPanel">
                    <div className="AdminTabs">
                        <div className={`AdminTab ${tab === 'creating' ? 'ChosenTabAdmin' : ''}`} id="creating" onClick={chooseTab}>Создание</div>
                        <div className={`AdminTab ${tab === 'table' ? 'ChosenTabAdmin' : ''}`} id="table" onClick={chooseTab}>Просмотр</div>
                    </div>
                    {tab === 'creating' ?
                        <>
                            <div className="ChangeSub">Создание товара</div>
                            <AdminInput />
                        </>
                        :
                        <>
                            {items ?
                                <>
                                    {!itemChange ?
                                        <>
                                            <div className="TableBtns">
                                                <button className={`DeleteChecked ${deleteIds.length > 0 ? '' : 'NonActiveDelete'}`} onClick={() => setIsDelete(true)}>Удалить выбранное</button>
                                                <button className="UpdateTable" onClick={fetchCallback}>Обновить таблицу</button>
                                            </div>
                                            <div className={`DeleteConfirm ${isDelete ? '' : 'InvisibleDelete'}`}>
                                                <div className="ConfirmSub">Вы уверены, что хотите удалить выбранные товары?</div>
                                                <button className="DeleteConfirmBtn" onClick={handleDeleteItems}>Удалить</button>
                                                <button className="DeleteCancelBtn" onClick={() => setIsDelete(false)}>Отмена</button>
                                            </div>
                                            <div className="AdminTableScroll">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th></th>
                                                            <th>Артикул</th>
                                                            <th>Бренд</th>
                                                            <th>Наименование</th>
                                                            <th>Модель</th>
                                                            <th>Кол-во</th>
                                                            <th>EU</th>
                                                            <th>RU</th>
                                                            <th>US</th>
                                                            <th>UK</th>
                                                            <th>СМ</th>
                                                            <th>Одежда</th>
                                                            <th>Цена</th>
                                                            <th>Цена со скидкой</th>
                                                            <th>Цвет</th>
                                                            <th>Категория</th>
                                                            <th>Подкатегория</th>
                                                            <th>Дата создания</th>
                                                        </tr>
                                                        {items.map((item, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className={`DeleteChecker Item${item.id}`} id={item.id} onClick={handleCheckItem}>
                                                                        <span id={item.id}>
                                                                            <IoCheckmark style={{ pointerEvents: 'none' }} />
                                                                        </span>
                                                                    </td>
                                                                    <td onClick={() => setItemChange(item)}>{item.code}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.brand}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.name}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.model}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.count}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_eu !== 'null' && item.size_eu}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_ru !== 'null' && item.size_ru}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_us !== 'null' && item.size_us}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_uk !== 'null' && item.size_uk}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_sm !== 'null' && item.size_sm}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.size_clo !== 'null' && item.size_clo}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.price}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.sale !== 'null' && item.sale}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.color !== 'null' && item.color}</td>
                                                                    <td onClick={() => setItemChange(item)}>{item.category}</td>
                                                                    <td onClick={() => setItemChange(item)}>{formatCategory(item.category, item.sub_category)}</td>
                                                                    <td>{formatDate(item.createdAt)}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="TableBtns">
                                                {/* <button className={`DeleteChecked ${deleteIds.length > 0 ? '' : 'NonActiveDelete'}`} onClick={() => setIsDelete(true)}>Удалить выбранное</button> */}
                                                {/* <button className="UpdateTable" onClick={fetchCallback}>Обновить таблицу</button> */}
                                                <button className="UpdateTable BackToTable" style={{ marginLeft: 0 }} onClick={() => setItemChange(null)}>Назад к таблице</button>
                                            </div>
                                            <div className="ChangeSub">Изменение товара</div>
                                            <AdminInput itemChange={itemChange} />
                                        </>
                                    }
                                </>
                                :
                                <></>
                            }
                        </>
                    }
                </div>
            }
        </div>
    )
}

export default Admin