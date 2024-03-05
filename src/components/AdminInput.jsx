import React, { useEffect, useState } from "react";
import { BiImageAdd } from 'react-icons/bi'
import { AiOutlineFileImage } from 'react-icons/ai'
import colorwheel from '../assets/colorwheel.png'
import { IoCheckmark } from 'react-icons/io5'
import { FaTrash } from "react-icons/fa";

import { changeItem, changeItemWithFiles, createItem, createItemWithFiles, destroyImages, fetchImages } from "../http/itemAPI";

const colorsList = [
    { name: 'Multicolor', hex: '#ffffff', color: 'multicolor' },
    { name: 'Без цвета', hex: '#FAFAFA', color: 'nocolor' },
    { name: 'Белый', hex: '#FFFFFF', color: 'white' },
    { name: 'Молочный', hex: '#FFFAF0', color: 'milk' },
    { name: 'Кремовый', hex: '#FDF4E3', color: 'cream' },
    { name: 'Бежевый', hex: '#F5F0DC', color: 'beige' },
    { name: 'Персиковый', hex: '#FFDBB4', color: 'peach' },
    { name: 'Жёлтый', hex: '#FFFF00', color: 'yellow' },
    { name: 'Золотой', hex: '#FFD700', color: 'gold' },
    { name: 'Оранжевый', hex: '#FFA500', color: 'orange' },
    { name: 'Красный', hex: '#FF0000', color: 'red' },
    { name: 'Бордовый', hex: '#9B2D30', color: 'burgundy' },
    { name: 'Коричневый', hex: '#755C48', color: 'brown' },
    { name: 'Оливковый', hex: '#808000', color: 'olive' },
    { name: 'Зелёный', hex: '#008000', color: 'green' },
    { name: 'Светло-зелёный', hex: '#90EE90', color: 'lightgreen' },
    { name: 'Голубой', hex: '#42AAFF', color: 'blue' },
    { name: 'Синий', hex: '#063971', color: 'darkblue' },
    { name: 'Фиолетовый', hex: '#8B00FF', color: 'purple' },
    { name: 'Розовый', hex: '#FFC0CB', color: 'pink' },
    { name: 'Серый', hex: '#808080', color: 'grey' },
    { name: 'Чёрный', hex: '#000000', color: 'black' },
]

const AdminInput = ({ itemChange }) => {
    const [category, setCategory] = useState('')
    // eslint-disable-next-lineА
    // const [items, setItems] = useState()
    const [item, setItem] = useState({
        code: '',
        brand: '',
        name: '',
        description: '',
        price: '',
        sale: '',
        count: '',
        size_eu: '',
        size_ru: '',
        size_us: '',
        size_uk: '',
        size_sm: '',
        size_clo: '',
        category: '',
        model: '',
        color: '',
        tags: '',
        img: '',
        file: null,
        files: null
    })
    const [oldImages, setOldImages] = useState([])
    const [deleteImages, setDeleteImages] = useState([])

    const setFiles = (e) => {
        const unset = document.querySelector(`.${e.target.id}Unset`)
        const set = document.querySelector(`.${e.target.id}Set`)
        const clear = document.querySelector(`.${e.target.id}Clear`)

        if (e.target.files.length === 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = e.target.files[0].name
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }

        if (e.target.files.length > 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = 'Выбрано файлов: ' + e.target.files.length
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }
    }

    const clearFiles = (e) => {
        document.querySelector(`.${e.target.id}Input`).value = null
        document.querySelector(`.${e.target.id}Unset`).classList.add('Showed')
        document.querySelector(`.${e.target.id}Set`).classList.remove('Showed')
        document.querySelector(`.${e.target.id}Clear`).classList.remove('Showed')
        setItem((prevFormData) => ({
            ...prevFormData,
            [e.target.classList[0]]: null,
        }))
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'sale' || name === 'count' || name === 'size_eu' || name === 'size_ru' || name === 'size_us' || name === 'size_uk' || name === 'size_sm') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        if (name === 'file') {
            console.log(files[0])
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        setItem(prevItem => ({
            ...prevItem,
            [name]: type === 'file' ? images : newValue,
        }))
        console.log(item)
    }

    const handleCategory = (e) => {
        setCategory(e.target.id)
        setItem(prevItem => ({
            ...prevItem,
            category: e.target.id,
        }))
    }

    const handleCheckColor = (e, color) => {
        document.querySelector('.CheckedColor')?.classList.remove('CheckedColor')
        document.querySelector(`.Color${e.target.id}`).classList.add('CheckedColor')
        setItem(prevItem => ({
            ...prevItem,
            color: color.color,
        }))
    }


    const canCreate = () => {
        if (item.category && item.code && item.brand && item.name && item.count && item.price && item.file) {
            if (item.category === 'shoes' && item.size_eu && item.size_ru && item.size_us && item.size_uk && item.size_sm) {
                return true
            } else {
                if (item.category === 'clothes' || item.category === 'accessories') {
                    return true
                }
            }
        }
        return false
    }

    const canChange = () => {
        if (item.category && item.code && item.brand && item.name && item.count && item.price) {
            if (item.category === 'shoes' && item.size_eu && item.size_ru && item.size_us && item.size_uk && item.size_sm) {
                return true
            } else {
                if (item.category === 'clothes' || item.category === 'accessories') {
                    return true
                }
            }
        }
        return false
    }

    const click = () => {
        console.log(item)
        if (canCreate()) {
            if (item.files) {
                createItemWithFiles(item.code, item.brand, item.name, item.description, item.price, item.sale, item.count, item.size_eu, item.size_ru, item.size_us, item.size_uk, item.size_sm, item.size_clo, item.category, item.model, item.color, item.file, item.files, item.tags)
                    .then(data => {
                        nullify()
                        // fetchCallback()
                        // fetchItemsAdmin().then(data => setItems(data))
                    })
            } else {
                createItem(item.code, item.brand, item.name, item.description, item.price, item.sale, item.count, item.size_eu, item.size_ru, item.size_us, item.size_uk, item.size_sm, item.size_clo, item.category, item.model, item.color, item.file, item.tags)
                    .then(data => {
                        nullify()
                        // fetchCallback()
                        // fetchItemsAdmin().then(data => setItems(data))
                    })
            }
        }
    }

    const click2 = () => {
        if (canChange()) {
            if (deleteImages.length > 0) {
                destroyImages(deleteImages)
            }
            if (item.files) {
                changeItemWithFiles(item.id, item.code, item.brand, item.name, item.description, item.price, item.sale, item.count, item.size_eu, item.size_ru, item.size_us, item.size_uk, item.size_sm, item.size_clo, item.category, item.model, item.color, item.file, item.files, item.tags)
                    .then(data => {
                        nullify()
                        document.querySelector('.BackToTable')?.click()
                    })
            } else {
                changeItem(item.id, item.code, item.brand, item.name, item.description, item.price, item.sale, item.count, item.size_eu, item.size_ru, item.size_us, item.size_uk, item.size_sm, item.size_clo, item.category, item.model, item.color, item.file, item.tags)
                    .then(data => {
                        nullify()
                        document.querySelector('.BackToTable')?.click()
                    })
            }
        }
    }

    const nullify = () => {
        setItem({
            code: '',
            brand: '',
            name: '',
            description: '',
            price: '',
            sale: '',
            count: '',
            size_eu: '',
            size_ru: '',
            size_us: '',
            size_uk: '',
            size_sm: '',
            size_clo: '',
            category: '',
            model: '',
            color: '',
            tags: '',
            file: null,
            files: null
        })
        setCategory('')
    }

    const deleteImage = (id) => {
        setDeleteImages(prev => [...prev, Number(id)])
        setOldImages(prev => prev.filter(img => img.id !== id))
    }

    useEffect(() => {
        if (itemChange) {
            setItem(itemChange)
            setCategory(itemChange.category)
            fetchImages(itemChange.id).then(data => setOldImages(data))
        }
    }, [itemChange])

    return (
        <>
            <div className="InputClue MT5">Выбор категории*</div>
            <div className="AdminInput">
                <div className="CategoryCheck" id="shoes" onClick={handleCategory}>
                    <span className={`CategoryCheckbox ${category === 'shoes' ? 'BlackCheck' : ''}`} id="shoes"><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                    <span className="CategoryName" id="shoes">Обувь</span>
                </div>
                <div className="CategoryCheck" id="clothes" onClick={handleCategory}>
                    <span className={`CategoryCheckbox ${category === 'clothes' ? 'BlackCheck' : ''}`} id="clothes"><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                    <span className="CategoryName" id="clothes">Одежда</span>
                </div>
                <div className="CategoryCheck" id="accessories" onClick={handleCategory}>
                    <span className={`CategoryCheckbox ${category === 'accessories' ? 'BlackCheck' : ''}`} id="accessories"><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                    <span className="CategoryName" id="accessories">Аксессуар</span>
                </div>
            </div>
            <div className="InputClue MT5">Артикул*</div>
            <input className="AdminInput" type="text" name="code" value={item.code} onChange={handleChange} />
            <div className="InputClue MT5">Бренд*</div>
            <input className="AdminInput" type="text" name="brand" value={item.brand} onChange={handleChange} />
            <div className="InputClue MT5">Наименование*</div>
            <input className="AdminInput" type="text" name="name" value={item.name} onChange={handleChange} />
            <div className="InputClue MT5">Количество*</div>
            <input className="AdminInput" type="text" name="count" value={item.count} onChange={handleChange} />
            {category === 'shoes' ?
                <>
                    <div className="InputClue MT5">Размер EU*</div>
                    <input className="AdminInput" type="text" name="size_eu" value={item.size_eu} onChange={handleChange} />
                    <div className="InputClue MT5">Размер RU*</div>
                    <input className="AdminInput" type="text" name="size_ru" value={item.size_ru} onChange={handleChange} />
                    <div className="InputClue MT5">Размер US*</div>
                    <input className="AdminInput" type="text" name="size_us" value={item.size_us} onChange={handleChange} />
                    <div className="InputClue MT5">Размер UK*</div>
                    <input className="AdminInput" type="text" name="size_uk" value={item.size_uk} onChange={handleChange} />
                    <div className="InputClue MT5">Размер СМ*</div>
                    <input className="AdminInput" type="text" name="size_sm" value={item.size_sm} onChange={handleChange} />
                </>
                : (category === 'accessories' || category === 'clothes') &&
                <>
                    <div className="InputClue MT5">Размер одежды/аксессуара*</div>
                    <input className="AdminInput" type="text" name="size_clo" value={item.size_clo} onChange={handleChange} />
                </>
            }
            <div className="InputClue MT5">Цена*</div>
            <input className="AdminInput" type="text" name="price" value={item.price} onChange={handleChange} />
            <div className="InputClue MT5">Цена со скидкой</div>
            <input className="AdminInput" type="text" name="sale" value={item.sale} onChange={handleChange} />
            {category === 'shoes' &&
                <>
                    <div className="InputClue MT5">Модель</div>
                    <input className="AdminInput" type="text" name="model" value={item.model} onChange={handleChange} />
                </>
            }
            <div className="InputClue MT5">Цвет</div>
            <div className="AdminInput">
                <div className="AdminColors">
                    {colorsList.map((color, i) => {
                        return (
                            <div key={i} className={`ColorItem Color${i}`} id={i} onClick={(e) => handleCheckColor(e, color)}>
                                {color.name === 'Multicolor' ?
                                    <img className="ColorExample" id={`color${i}`} style={{ pointerEvents: 'none' }} src={colorwheel} alt="Цвет" />
                                    :
                                    <span style={{ backgroundColor: color.hex, pointerEvents: 'none' }} className={`ColorExample ${color.name === 'Без цвета' ? 'NoColor' : ''}`}></span>
                                }
                                <span style={{ pointerEvents: 'none' }}>{color.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="InputClue MT5">Описание</div>
            <textarea className="AdminInput AdminTextarea" type="text" name="description" value={item.description} onChange={handleChange} />
            <div className="InputClue MT5">Поисковые теги</div>
            <textarea className="AdminInput AdminTextarea" type="text" name="tags" value={item.tags} onChange={handleChange} />
            <div className="InputClue MT5">Обложка{itemChange ? '' : '*'}</div>
            {itemChange &&
                <div className="AdminInputImg">
                    <img src={process.env.REACT_APP_API_URL + itemChange.img} alt="Обложка" />
                </div>
            }
            <div className="FileInput origfile">
                <input
                    className="origfileInput"
                    type="file"
                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                    multiple={false}
                    id="origfile"
                    name="file"
                    onChange={(e) => {
                        setFiles(e)
                        handleChange(e)
                    }}
                />
                <div className="FileInfo origfileUnset Showed">
                    <div className="FileText">
                        <BiImageAdd className="FileImg" size={30} />
                        <div className="FileTextLoad">Обложка товара</div>
                    </div>
                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                </div>
                <div className="FileInfo origfileSet">
                    <div className="FileText">
                        <AiOutlineFileImage size={30} />
                        <div className="FileTextLoad origfileName"></div>
                    </div>
                </div>
            </div>
            <div className="file FileClear origfileClear" id="origfile" name="file" onClick={clearFiles}>Очистить поле</div>
            <div className="InputClue">Фотографии карточки</div>
            {itemChange && oldImages.length > 0 &&
                <div className="AdminInputImgRow">
                    {oldImages.map((img, i) => {
                        return (
                            <div key={i} className="AdminInputImg">
                                <img src={process.env.REACT_APP_API_URL + img.name} alt="Фото" />
                                <div className="DeleteHover" onClick={() => deleteImage(img.id)}>
                                    <FaTrash size={30} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <div className="FileInput origfiles">
                <input
                    className="origfilesInput"
                    type="file"
                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                    multiple={true}
                    id="origfiles"
                    name="files"
                    onChange={(e) => {
                        setFiles(e)
                        handleChange(e)
                    }}
                />
                <div className="FileInfo origfilesUnset Showed">
                    <div className="FileText">
                        <BiImageAdd className="FileImg" size={30} />
                        <div className="FileTextLoad">Фотографии карточки</div>
                    </div>
                    <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                </div>
                <div className="FileInfo origfilesSet">
                    <div className="FileText">
                        <AiOutlineFileImage size={30} />
                        <div className="FileTextLoad origfilesName"></div>
                    </div>
                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                </div>
            </div>
            <div className="files FileClear origfilesClear" id="origfiles" name="files" onClick={clearFiles}>Очистить поле</div>
            <div className="ImportantFields">* обязательные поля</div>
            {itemChange ?
                <button className={`AdminCreateBtn ${canChange() ? '' : 'NonActiveCreate'}`} onClick={click2}>Сохранить</button>
                :
                <button className={`AdminCreateBtn ${canCreate() ? '' : 'NonActiveCreate'}`} onClick={click}>Создать</button>
            }
            {/* <button className={`AdminCreateBtn ${canCreate() ? '' : 'NonActiveCreate'}`} onClick={click}>{itemChange ? 'Сохранить' : 'Создать'}</button> */}
        </>
    )
}

export default AdminInput;