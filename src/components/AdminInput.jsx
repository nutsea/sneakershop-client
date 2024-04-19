import React, { useEffect, useState } from "react";
import { BiImageAdd } from 'react-icons/bi'
import { AiOutlineFileImage } from 'react-icons/ai'
import colorwheel from '../assets/colorwheel.png'
import { IoCheckmark } from 'react-icons/io5'
import { FaTrash } from "react-icons/fa";

import { changeItem, changeItemWithFiles, createItem, createItemWithFiles, createSame, createSameWithFiles, destroyImages, fetchImages, fetchSame } from "../http/itemAPI";

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
    { id: 2, name: 'ЛОНГСЛИВЫ  СВИТЕРЫ' },
    { id: 3, name: 'ФУТБОЛКИ' },
    { id: 4, name: 'ШТАНЫ И ДЖИНСЫ' },
    { id: 5, name: 'ШОРТЫ' },
    { id: 6, name: 'ХУДИ И СВИТШОТЫ' },
    { id: 7, name: 'КУРТКИ И ПУХОВИКИ' },
    { id: 8, name: 'БЕЛЬЕ' },
    { id: 9, name: 'ДРУГАЯ ОДЕЖДА' }
]

const accessoriesSub = [
    { id: 1, name: 'СМОТРЕТЬ ВСЁ' },
    { id: 2, name: 'ГОЛОВНЫЕ УБОРЫ' },
    { id: 3, name: 'ПЕРЧАТКИ' },
    { id: 4, name: 'РЮКЗАКИ И СУМКИ' },
    { id: 5, name: 'КОШЕЛЬКИ' },
    { id: 6, name: 'ОЧКИ' },
    { id: 7, name: 'ШАПКИ' },
    { id: 8, name: 'НОСКИ' },
    { id: 9, name: 'ПРЕДМЕТЫ ИНТЕРЬЕРА' },
    { id: 10, name: 'ДРУГИЕ АКСЕССУАРЫ' },
    { id: 11, name: 'ФИГУРКИ' },
    { id: 12, name: 'BEARBRICKS' },
]

const AdminInput = ({ itemChange }) => {
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
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
        sub_category: '',
        model: '',
        color: '',
        tags: '',
        img: '',
        file: null,
        files: null
    })
    const [counts, setCounts] = useState(Array.from({ length: 30 }, () => ''))
    const [prices, setPrices] = useState(Array.from({ length: 30 }, () => ''))
    const [sales, setSales] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_eu, setSizes_eu] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_ru, setSizes_ru] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_us, setSizes_us] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_uk, setSizes_uk] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_sm, setSizes_sm] = useState(Array.from({ length: 30 }, () => ''))
    const [sizes_clo, setSizes_clo] = useState(Array.from({ length: 30 }, () => ''))
    const [idsToChange, setIdsToChange] = useState(Array.from({ length: 30 }, () => ''))
    const [sizesCount, setSizesCount] = useState(1)
    const [addSizesCount, setAddSizesCount] = useState(0)
    const [oldImages, setOldImages] = useState([])
    const [deleteImages, setDeleteImages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

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
        const { name, value, type, files, id } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'sale' || name === 'count') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        let tempArr

        switch (name) {
            case 'size_eu':
                tempArr = sizes_eu
                tempArr[id] = newValue
                setSizes_eu(tempArr)
                break

            case 'size_ru':
                tempArr = sizes_ru
                tempArr[id] = newValue
                setSizes_ru(tempArr)
                break

            case 'size_us':
                tempArr = sizes_us
                tempArr[id] = newValue
                setSizes_us(tempArr)
                break

            case 'size_uk':
                tempArr = sizes_uk
                tempArr[id] = newValue
                setSizes_uk(tempArr)
                break

            case 'size_sm':
                tempArr = sizes_sm
                tempArr[id] = newValue
                setSizes_sm(tempArr)
                break

            case 'size_clo':
                tempArr = sizes_clo
                if (newValue !== '0') {
                    tempArr[id] = newValue;
                    setSizes_clo(tempArr);
                }
                break

            case 'price':
                tempArr = prices
                tempArr[id] = newValue
                setPrices(tempArr)
                break

            case 'sale':
                tempArr = sales
                tempArr[id] = newValue
                setSales(tempArr)
                break

            case 'count':
                tempArr = counts
                tempArr[id] = newValue
                setCounts(tempArr)
                break

            default:
                break
        }

        if (name === 'file') {
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        setItem(prevItem => ({
            ...prevItem,
            [name]: (type === 'file' || type === 'files') ? images : newValue,
        }))
    }

    const handleCategory = (e) => {
        setCategory(e.target.id)
        setSubCategory('')
        setItem(prevItem => ({
            ...prevItem,
            category: e.target.id,
            model: ''
        }))
        setSizes_eu(Array.from({ length: 30 }, () => ''))
        setSizes_ru(Array.from({ length: 30 }, () => ''))
        setSizes_us(Array.from({ length: 30 }, () => ''))
        setSizes_uk(Array.from({ length: 30 }, () => ''))
        setSizes_sm(Array.from({ length: 30 }, () => ''))
        setSizes_clo(Array.from({ length: 30 }, () => ''))
    }

    const handleSubCategory = (e) => {
        setSubCategory(e.target.id)
        setItem(prevItem => ({
            ...prevItem,
            sub_category: e.target.id,
        }))
    }

    const handleCheckColor = (e, color) => {
        const oldColors = item.color
        const checker = document.querySelector(`.Color${e.target.id}`)
        if (checker.classList.contains('CheckedColor')) {
            checker.classList.remove('CheckedColor')
            setItem(prevItem => ({
                ...prevItem,
                color: oldColors.replace(color.color, '').replace('  ', ' '),
            }))
        } else {
            checker.classList.add('CheckedColor')
            setItem(prevItem => ({
                ...prevItem,
                color: oldColors + ' ' + color.color,
            }))
        }
    }


    const canCreate = () => {
        if (item.category && item.code && item.brand && item.name && item.file && item.price) {
            if (item.category === 'shoes') {
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
        if (item.category && item.code && item.brand && item.name) {
            if (item.category === 'shoes') {
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
        if (canCreate()) {
            if (item.files) {
                setIsLoading(true)
                createItemWithFiles(sizesCount, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color, item.file, item.files, item.tags, item.sub_category)
                    .then(() => {
                        nullify()
                        setIsLoading(false)
                    })
            } else {
                setIsLoading(true)
                createItem(sizesCount, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color, item.file, item.tags, item.sub_category)
                    .then(() => {
                        nullify()
                        setIsLoading(false)
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
                setIsLoading(true)
                changeItemWithFiles(sizesCount, idsToChange, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color.trim(' '), item.file, item.files, item.tags, item.sub_category)
                    .then(() => {
                        nullify()
                        setIsLoading(false)
                        document.querySelector('.BackToTable')?.click()
                    })
                if (addSizesCount > 0)
                    createSameWithFiles(sizesCount, addSizesCount, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color, item.file, item.files, item.tags, item.sub_category, item.img)
            } else {
                setIsLoading(true)
                changeItem(sizesCount, idsToChange, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color.trim(' '), item.file, item.tags, item.sub_category)
                    .then(() => {
                        nullify()
                        setIsLoading(false)
                        document.querySelector('.BackToTable')?.click()
                    })
                if (addSizesCount > 0)
                    createSame(sizesCount, addSizesCount, item.code, item.brand, item.name, item.description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, item.category, item.model, item.color, item.file, item.tags, item.sub_category, item.img)
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
            sub_category: '',
            model: '',
            color: '',
            tags: '',
            file: null,
            files: null
        })
        setCounts(Array.from({ length: 30 }, () => ''))
        setPrices(Array.from({ length: 30 }, () => ''))
        setSales(Array.from({ length: 30 }, () => ''))
        setSizes_eu(Array.from({ length: 30 }, () => ''))
        setSizes_ru(Array.from({ length: 30 }, () => ''))
        setSizes_us(Array.from({ length: 30 }, () => ''))
        setSizes_uk(Array.from({ length: 30 }, () => ''))
        setSizes_sm(Array.from({ length: 30 }, () => ''))
        setSizes_clo(Array.from({ length: 30 }, () => ''))
        setCategory('')
        setOldImages([])
    }

    const deleteImage = (id) => {
        setDeleteImages(prev => [...prev, Number(id)])
        setOldImages(prev => prev.filter(img => img.id !== id))
    }

    const addSize = () => {
        if (!itemChange) setSizesCount(sizesCount + 1)
        else setAddSizesCount(addSizesCount + 1)
    }

    useEffect(() => {
        if (itemChange) {
            setItem(itemChange)
            fetchSame(itemChange.code)
                .then(data => {
                    setSizesCount(data.length)
                    setIdsToChange(data.map(item => item.id))
                    setCounts(Array.from({ length: 30 }, (_, index) => data[index]?.count ?? ''))
                    setPrices(Array.from({ length: 30 }, (_, index) => data[index]?.price ?? ''))
                    setSales(Array.from({ length: 30 }, (_, index) => data[index]?.sale ?? ''))
                    setSizes_eu(Array.from({ length: 30 }, (_, index) => data[index]?.size_eu ?? ''))
                    setSizes_ru(Array.from({ length: 30 }, (_, index) => data[index]?.size_ru ?? ''))
                    setSizes_us(Array.from({ length: 30 }, (_, index) => data[index]?.size_us ?? ''))
                    setSizes_uk(Array.from({ length: 30 }, (_, index) => data[index]?.size_uk ?? ''))
                    setSizes_sm(Array.from({ length: 30 }, (_, index) => data[index]?.size_sm ?? ''))
                    setSizes_clo(Array.from({ length: 30 }, (_, index) => data[index]?.size_clo ?? ''))
                })
            setCategory(itemChange.category)
            setSubCategory(itemChange.sub_category)
            for (let i of itemChange.color.split(' ')) {
                const checker = document.querySelector(`.Color${colorsList.findIndex(col => col.color === i)}`)
                if (checker) {
                    checker.classList.add('CheckedColor')
                }
            }
            fetchImages(itemChange.code).then(data => setOldImages(data))
        }
    }, [itemChange])

    return (
        <>
            {!isLoading ?
                <>
                    {!itemChange &&
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
                        </>
                    }
                    {category &&
                        <>
                            <div className="InputClue MT5">Выбор подкатегории</div>
                            <div className="AdminInput">
                                {category === 'shoes' ?
                                    <>
                                        {shoesSub.map((sub, i) => {
                                            return (
                                                <div key={i} className="CategoryCheck" id={sub.id} onClick={handleSubCategory}>
                                                    <span className={`CategoryCheckbox ${Number(subCategory) === Number(sub.id) ? 'BlackCheck' : ''}`} id={sub.id}><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                                                    <span className="CategoryName" id={sub.id}>{sub.name}</span>
                                                </div>
                                            )
                                        })}
                                    </>
                                    : (category === 'clothes') ?
                                        <>
                                            {clothesSub.map((sub, i) => {
                                                return (
                                                    <div key={i} className="CategoryCheck" id={sub.id} onClick={handleSubCategory}>
                                                        <span className={`CategoryCheckbox ${Number(subCategory) === Number(sub.id) ? 'BlackCheck' : ''}`} id={sub.id}><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                                                        <span className="CategoryName" id={sub.id}>{sub.name}</span>
                                                    </div>
                                                )
                                            })}
                                        </>
                                        : (category === 'accessories') &&
                                        <>
                                            {accessoriesSub.map((sub, i) => {
                                                return (
                                                    <div key={i} className="CategoryCheck" id={sub.id} onClick={handleSubCategory}>
                                                        <span className={`CategoryCheckbox ${Number(subCategory) === Number(sub.id) ? 'BlackCheck' : ''}`} id={sub.id}><IoCheckmark style={{ pointerEvents: 'none', color: 'white' }} /></span>
                                                        <span className="CategoryName" id={sub.id}>{sub.name}</span>
                                                    </div>
                                                )
                                            })}
                                        </>
                                }
                            </div>
                        </>
                    }
                    {Array.from({ length: sizesCount + addSizesCount }, (_, i) => (
                        <div style={{ width: '100%' }} key={i}>
                            <div className="InputClue MT5">Размер {i + 1}</div>
                            <div className="AdminInput">
                                <div className="RowInput">
                                    {category === 'shoes' ?
                                        <>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер EU</div>
                                                <input className="AdminInput" type="text" name="size_eu" id={i} value={sizes_eu[i]} onChange={handleChange} />
                                            </div>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер RU</div>
                                                <input className="AdminInput" type="text" name="size_ru" id={i} value={sizes_ru[i]} onChange={handleChange} />
                                            </div>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер US</div>
                                                <input className="AdminInput" type="text" name="size_us" id={i} value={sizes_us[i]} onChange={handleChange} />
                                            </div>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер UK</div>
                                                <input className="AdminInput" type="text" name="size_uk" id={i} value={sizes_uk[i]} onChange={handleChange} />
                                            </div>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер СМ</div>
                                                <input className="AdminInput" type="text" name="size_sm" id={i} value={sizes_sm[i]} onChange={handleChange} />
                                            </div>
                                        </>
                                        : (category === 'accessories' || category === 'clothes') &&
                                        <>
                                            <div className="SizeCol">
                                                <div className="InputClue MT5">Размер*</div>
                                                <input className="AdminInput" type="text" name="size_clo" id={i} value={sizes_clo[i]} onChange={handleChange} />
                                            </div>
                                        </>
                                    }
                                    <div className="SizeCol">
                                        <div className="InputClue MT5">Количество*</div>
                                        <input className="AdminInput" type="text" name="count" id={i} value={counts[i]} onChange={handleChange} />
                                    </div>
                                    <div className="SizeCol">
                                        <div className="InputClue MT5">Цена*</div>
                                        <input className="AdminInput" type="text" name="price" id={i} value={prices[i]} onChange={handleChange} />
                                    </div>
                                    <div className="SizeCol">
                                        <div className="InputClue MT5">Цена со скидкой</div>
                                        <input className="AdminInput" type="text" name="sale" id={i} value={sales[i]} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        className="AddSizeBtn"
                        onClick={addSize}
                    >
                        Добавить размер
                    </div>
                    <div className="InputClue MT5">Артикул*</div>
                    <input className="AdminInput" type="text" name="code" value={item.code} onChange={handleChange} />
                    <div className="InputClue MT5">Бренд*</div>
                    <input className="AdminInput" type="text" name="brand" value={item.brand} onChange={handleChange} />
                    <div className="InputClue MT5">Наименование*</div>
                    <input className="AdminInput" type="text" name="name" value={item.name} onChange={handleChange} />
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
                </>
                :
                <>
                    <div className="LoadingContainer2">
                        <div className="Spinner">
                            <div className="Ball"></div>
                            <p className="Loading">ЗАГРУЗКА...</p>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default AdminInput;