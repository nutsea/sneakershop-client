import React, { useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useNavigate, useParams } from "react-router-dom"
import '../styles/Catalogue.scss'

import { BsSortUpAlt, BsSortDown } from "react-icons/bs"
import { LuSettings2 } from "react-icons/lu"
import { SlClose } from "react-icons/sl"
import { IoCheckmark } from "react-icons/io5"
import { IoIosArrowRoundForward } from "react-icons/io";
import { fetchBrandsCategory, fetchColorsCategory, fetchItems, fetchModels, fetchSizesCategory } from "../http/itemAPI"
import { Context } from ".."

import colorwheel from '../assets/colorwheel.png'

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

const Catalogue = observer(() => {
    const { category, brandlink, search, sale, sub_category } = useParams()
    const { catalogue } = useContext(Context)
    const [sortBy, setSortBy] = useState('price')
    const [sortDir, setSortDir] = useState('down')
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState({})
    const [filters, setFilters] = useState(false)
    const [priceMin, setPriceMin] = useState('')
    const [priceMax, setPriceMax] = useState('')
    const [inStock, setInStock] = useState(false)
    const [brandsSet, setBrandsSet] = useState([])
    const [modelsSet, setModelsSet] = useState([])
    const [subcatSet, setSubcatSet] = useState([])
    const [colorsSet, setColorsSet] = useState([])
    const [sizesEuSet, setSizesEuSet] = useState([])
    const [sizesRuSet, setSizesRuSet] = useState([])
    const [sizesUsSet, setSizesUsSet] = useState([])
    const [sizesUkSet, setSizesUkSet] = useState([])
    const [sizesSmSet, setSizesSmSet] = useState([])
    const [sizesCloSet, setSizesCloSet] = useState([])
    const [pages, setPages] = useState(0)
    const [found, setFound] = useState(false)
    const navigate = useNavigate()

    const navigateItem = (id) => {
        navigate(`/item/${id}`)
    }

    const handleSortDir = (dir) => {
        setSortDir(dir)
    }

    const handleSortBy = (e) => {
        setSortBy(e.target.id)
    }

    const handleSortShow = () => {
        document.querySelector('.AbsoluteSortList').classList.toggle('HiddenList')
    }

    function formatNumberWithSpaces(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    function formatText(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    const showFilters = () => {
        if (!filters) {
            setFilters(true)
            document.querySelector('.FilterPanel').setAttribute('style', 'transform: translateX(0); opacity: 1; display: block')
            document.querySelector('.CatalogueItems2').setAttribute('style', 'width: calc(100% - 300px)')
        } else {
            setFilters(false)
            if (window.innerWidth > 780) {
                document.querySelector('.FilterPanel').setAttribute('style', 'transform: translateX(-300px); opacity: 0')
                document.querySelector('.CatalogueItems2').setAttribute('style', 'width: 100%')
            } else {
                document.querySelector('.FilterPanel').setAttribute('style', 'display: none')
                document.querySelector('.CatalogueItems2').setAttribute('style', 'width: 100%')
            }
        }
    }

    const showPriceFilter = () => {
        const box = document.querySelector('.FilterPrice')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            box.setAttribute('style', 'height: 83.34px')
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const showBrandFilter = () => {
        const box = document.querySelector('.FilterBrand')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            box.setAttribute('style', `height: ${brands.length * 29.34 + 22}px`)
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const showModelFilter = () => {
        const box = document.querySelector('.FilterModel')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            const nonNullModels = models.filter(model => model !== null && model.model !== null)
            box.setAttribute('style', `height: ${nonNullModels.length * 29.34 + 22}px`)
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const showSubcatFilter = () => {
        const box = document.querySelector('.FilterSubcat')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            if (category === 'shoes') {
                box.setAttribute('style', `height: ${(shoesSub.length - 1) * 29.34 + 22}px`)
            } else if (category === 'clothes') {
                box.setAttribute('style', `height: ${(clothesSub.length - 1) * 29.34 + 22}px`)
            } else if (category === 'accessories') {
                box.setAttribute('style', `height: ${(accessoriesSub.length - 1) * 29.34 + 22}px`)
            } else {
                let height = (shoesSub.length + clothesSub.length + accessoriesSub.length - 4) * 29.34 + 56
                box.setAttribute('style', `height: ${height}px`)
            }
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const showShoesSizeFilter = () => {
        const box = document.querySelector('.FilterShoesSize')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            document.querySelector('.SizeTypes').setAttribute('style', 'height: 262px')
            box.setAttribute('style', 'height: 284px')
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', 'height: 0')
            document.querySelector('.FilterEu').classList.remove('FilterShown2')
            document.querySelector('.FilterEu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterRu').classList.remove('FilterShown2')
            document.querySelector('.FilterRu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUs').classList.remove('FilterShown2')
            document.querySelector('.FilterUs').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUk').classList.remove('FilterShown2')
            document.querySelector('.FilterUk').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterSm').classList.remove('FilterShown2')
            document.querySelector('.FilterSm').setAttribute('style', 'height: 22px')
        }
    }

    const showEuFilter = () => {
        const box = document.querySelector('.FilterEu')
        if (!box.classList.contains('FilterShown2')) {
            box.classList.add('FilterShown2')
            const nonNullSizesEu = sizes.sizesEu.filter(size => size !== null && size.size_eu !== null)
            box.setAttribute('style', `height: ${Math.ceil(nonNullSizesEu.length / 2) * 39 + 32}px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', `height: ${Math.ceil(nonNullSizesEu.length / 2) * 39 + 10 + 284}px`)
            document.querySelector('.SizeTypes').setAttribute('style', `height: ${Math.ceil(nonNullSizesEu.length / 2) * 39 + 10 + 262}px`)
            document.querySelector('.FilterRu').classList.remove('FilterShown2')
            document.querySelector('.FilterRu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUs').classList.remove('FilterShown2')
            document.querySelector('.FilterUs').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUk').classList.remove('FilterShown2')
            document.querySelector('.FilterUk').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterSm').classList.remove('FilterShown2')
            document.querySelector('.FilterSm').setAttribute('style', 'height: 22px')
        } else {
            box.classList.remove('FilterShown2')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', `height: 262px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', 'height: 284px')
        }
    }

    const showRuFilter = () => {
        const box = document.querySelector('.FilterRu')
        if (!box.classList.contains('FilterShown2')) {
            box.classList.add('FilterShown2')
            const nonNullSizesRu = sizes.sizesRu.filter(size => size !== null && size.size_ru !== null)
            box.setAttribute('style', `height: ${Math.ceil(nonNullSizesRu.length / 2) * 39 + 32}px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', `height: ${Math.ceil(nonNullSizesRu.length / 2) * 39 + 10 + 284}px`)
            document.querySelector('.SizeTypes').setAttribute('style', `height: ${Math.ceil(nonNullSizesRu.length / 2) * 39 + 10 + 262}px`)
            document.querySelector('.FilterEu').classList.remove('FilterShown2')
            document.querySelector('.FilterEu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUs').classList.remove('FilterShown2')
            document.querySelector('.FilterUs').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUk').classList.remove('FilterShown2')
            document.querySelector('.FilterUk').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterSm').classList.remove('FilterShown2')
            document.querySelector('.FilterSm').setAttribute('style', 'height: 22px')
        } else {
            box.classList.remove('FilterShown2')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', `height: 262px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', 'height: 284px')
        }
    }

    const showUsFilter = () => {
        const box = document.querySelector('.FilterUs')
        if (!box.classList.contains('FilterShown2')) {
            box.classList.add('FilterShown2')
            const nonNullSizesUs = sizes.sizesUs.filter(size => size !== null && size.size_us !== null)
            box.setAttribute('style', `height: ${Math.ceil(nonNullSizesUs.length / 2) * 39 + 32}px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', `height: ${Math.ceil(nonNullSizesUs.length / 2) * 39 + 10 + 284}px`)
            document.querySelector('.SizeTypes').setAttribute('style', `height: ${Math.ceil(nonNullSizesUs.length / 2) * 39 + 10 + 262}px`)
            document.querySelector('.FilterEu').classList.remove('FilterShown2')
            document.querySelector('.FilterEu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterRu').classList.remove('FilterShown2')
            document.querySelector('.FilterRu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUk').classList.remove('FilterShown2')
            document.querySelector('.FilterUk').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterSm').classList.remove('FilterShown2')
            document.querySelector('.FilterSm').setAttribute('style', 'height: 22px')
        } else {
            box.classList.remove('FilterShown2')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', `height: 262px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', 'height: 284px')
        }
    }

    const showUkFilter = () => {
        const box = document.querySelector('.FilterUk')
        if (!box.classList.contains('FilterShown2')) {
            box.classList.add('FilterShown2')
            const nonNullSizesUk = sizes.sizesUk.filter(size => size !== null && size.size_uk !== null)
            box.setAttribute('style', `height: ${Math.ceil(nonNullSizesUk.length / 2) * 39 + 32}px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', `height: ${Math.ceil(nonNullSizesUk.length / 2) * 39 + 10 + 284}px`)
            document.querySelector('.SizeTypes').setAttribute('style', `height: ${Math.ceil(nonNullSizesUk.length / 2) * 39 + 10 + 262}px`)
            document.querySelector('.FilterEu').classList.remove('FilterShown2')
            document.querySelector('.FilterEu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterRu').classList.remove('FilterShown2')
            document.querySelector('.FilterRu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUs').classList.remove('FilterShown2')
            document.querySelector('.FilterUs').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterSm').classList.remove('FilterShown2')
            document.querySelector('.FilterSm').setAttribute('style', 'height: 22px')
        } else {
            box.classList.remove('FilterShown2')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', `height: 262px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', 'height: 284px')
        }
    }

    const showSmFilter = () => {
        const box = document.querySelector('.FilterSm')
        if (!box.classList.contains('FilterShown2')) {
            box.classList.add('FilterShown2')
            const nonNullSizesSm = sizes.sizesSm.filter(size => size !== null && size.size_sm !== null)
            box.setAttribute('style', `height: ${Math.ceil(nonNullSizesSm.length / 2) * 39 + 32}px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', `height: ${Math.ceil(nonNullSizesSm.length / 2) * 39 + 10 + 284}px`)
            document.querySelector('.SizeTypes').setAttribute('style', `height: ${Math.ceil(nonNullSizesSm.length / 2) * 39 + 10 + 262}px`)
            document.querySelector('.FilterEu').classList.remove('FilterShown2')
            document.querySelector('.FilterEu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterRu').classList.remove('FilterShown2')
            document.querySelector('.FilterRu').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUs').classList.remove('FilterShown2')
            document.querySelector('.FilterUs').setAttribute('style', 'height: 22px')
            document.querySelector('.FilterUk').classList.remove('FilterShown2')
            document.querySelector('.FilterUk').setAttribute('style', 'height: 22px')
        } else {
            box.classList.remove('FilterShown2')
            box.setAttribute('style', 'height: 22px')
            document.querySelector('.SizeTypes').setAttribute('style', `height: 262px`)
            document.querySelector('.FilterShoesSize').setAttribute('style', 'height: 284px')
        }
    }

    const showClothesSizeFilter = () => {
        const box = document.querySelector('.FilterClothesSize')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            const nonNullSizesClo = sizes.sizesClo.filter(size => size !== null && size.size_clo !== null)
            box.setAttribute('style', `height: ${nonNullSizesClo.length * 29.34 + 22}px`)
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const showColorsFilter = () => {
        const box = document.querySelector('.FilterColor')
        if (!box.classList.contains('FilterShown')) {
            box.classList.add('FilterShown')
            box.setAttribute('style', `height: 687.34px`)
        } else {
            box.classList.remove('FilterShown')
            box.setAttribute('style', 'height: 22px')
        }
    }

    const handlePriceMin = (e) => {
        setPriceMin(e.target.value)
    }

    const handlePriceMax = (e) => {
        setPriceMax(e.target.value)
    }

    const handleCheck = (e) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedInput')
        if (document.querySelector(`.${e.target.id}`).classList.contains('CheckedInput')) {
            setInStock(true)
        } else {
            setInStock(false)
        }
    }

    const handleBrand = (e, brand) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedInput')
        if (brandsSet.includes(brand)) {
            setBrandsSet(brandsSet.filter(b => b !== brand))
        } else {
            setBrandsSet([...brandsSet, brand])
        }
    }

    const handleModel = (e, model) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedInput')
        if (modelsSet.includes(model)) {
            setModelsSet(modelsSet.filter(m => m !== model))
        } else {
            setModelsSet([...modelsSet, model])
        }
    }

    const handleSubcat = (e, subcat) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedInput')
        if (subcatSet.includes(subcat.id)) {
            console.log(subcatSet[0] === subcat.id)
            setSubcatSet(subcatSet.filter(s => s !== Number(subcat.id)))
        } else {
            setSubcatSet([...subcatSet, subcat.id])
        }
    }

    const handleColor = (e, color) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedColor')
        if (colorsSet.includes(color)) {
            setColorsSet(colorsSet.filter(c => c !== color))
        } else {
            setColorsSet([...colorsSet, color])
        }
    }

    const handleEuSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedSize')
        if (sizesEuSet.includes(size)) {
            setSizesEuSet(sizesEuSet.filter(s => s !== size))
        } else {
            setSizesEuSet([...sizesEuSet, size])
        }
    }

    const handleRuSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedSize')
        if (sizesRuSet.includes(size)) {
            setSizesRuSet(sizesRuSet.filter(s => s !== size))
        } else {
            setSizesRuSet([...sizesRuSet, size])
        }
    }

    const handleUsSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedSize')
        if (sizesUsSet.includes(size)) {
            setSizesUsSet(sizesUsSet.filter(s => s !== size))
        } else {
            setSizesUsSet([...sizesUsSet, size])
        }
    }

    const handleUkSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedSize')
        if (sizesUkSet.includes(size)) {
            setSizesUkSet(sizesUkSet.filter(s => s !== size))
        } else {
            setSizesUkSet([...sizesUkSet, size])
        }
    }

    const handleSmSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedSize')
        if (sizesSmSet.includes(size)) {
            setSizesSmSet(sizesSmSet.filter(s => s !== size))
        } else {
            setSizesSmSet([...sizesSmSet, size])
        }
    }

    const handleCloSize = (e, size) => {
        document.querySelector(`.${e.target.id}`).classList.toggle('CheckedInput')
        if (sizesCloSet.includes(size)) {
            setSizesCloSet(sizesCloSet.filter(s => s !== size))
        } else {
            setSizesCloSet([...sizesCloSet, size])
        }
    }

    const findItems = () => {
        let subcatsSet2 = []
        // eslint-disable-next-line
        shoesSub.map(sub => {
            subcatsSet2.push(sub.id)
        })
        // eslint-disable-next-line
        clothesSub.map(sub => {
            if (sub.id !== 1)
                subcatsSet2.push(sub.id)
        })
        // eslint-disable-next-line
        accessoriesSub.map(sub => {
            if (sub.id !== 1)
                subcatsSet2.push(sub.id)
        })
        if (sizes.sizesEu && brands.length > 0 && models.length > 0 && colors.length > 0) {
            fetchItems(
                category,
                brandsSet.length > 0 ? brandsSet : brands,
                modelsSet.length > 0 ? modelsSet : models,
                colorsSet.length > 0 ? colorsSet : colors,
                sizesEuSet.length > 0 ? sizesEuSet : sizes.sizesEu,
                sizesRuSet.length > 0 ? sizesRuSet : sizes.sizesRu,
                sizesUsSet.length > 0 ? sizesUsSet : sizes.sizesUs,
                sizesUkSet.length > 0 ? sizesUkSet : sizes.sizesUk,
                sizesSmSet.length > 0 ? sizesSmSet : sizes.sizesSm,
                sizesCloSet.length > 0 ? sizesCloSet : sizes.sizesClo,
                priceMin.length > 0 ? Number(priceMin) : catalogue.min,
                priceMax.length > 0 ? Number(priceMax) : catalogue.max,
                sortBy + sortDir,
                catalogue.limit,
                catalogue.page,
                inStock,
                modelsSet.length > 0 ? true : false,
                sizesEuSet.length > 0 || sizesRuSet.length > 0 || sizesUsSet.length > 0 || sizesUkSet.length > 0 || sizesSmSet.length > 0 ? true : false,
                sizesCloSet.length > 0 ? true : false,
                search,
                sale,
                subcatSet.length > 0 ? subcatSet : subcatsSet2
            )
                .then(data => {
                    catalogue.setItems(data.rows)
                    catalogue.setCount(data.count)
                    setPages(Math.ceil(data.count / catalogue.limit))
                    setFound(true)
                })
        }
    }

    let first = 1,
        last = pages,
        thisP = catalogue.page,
        nextP = catalogue.page + 1,
        prevP = catalogue.page - 1

    const handlePagination = (e) => {
        const thisE = document.getElementById(`${e.target.id}`)
        const hide_1_2 = document.querySelector('.Hide-1-2')
        const hide_29_30 = document.querySelector('.Hide-29-30')
        const buttons = document.getElementsByClassName('E-pag')
        for (let i of buttons) {
            i.classList.remove('E-this')
        }

        switch (e.target.id) {
            case 'left':
                if (prevP !== 0) {
                    thisP--
                    nextP--
                    prevP--
                }
                break

            case 'right':
                if (nextP !== last + 1) {
                    thisP++
                    prevP++
                    nextP++
                }
                break

            case 'first':
                thisP = first
                nextP = first + 1
                prevP = first - 1
                break

            case 'mid1':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'mid2':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'mid3':
                thisP = Number(thisE.innerText)
                nextP = thisP + 1
                prevP = thisP - 1
                break

            case 'last':
                thisP = last
                prevP = last - 1
                nextP = last + 1
                break

            default:
                break
        }

        catalogue.setPage(Number(thisP))
        findItems()

        if (last > 5) {
            switch (thisP) {
                case 1:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.add('E-inactive')
                    buttons[1].classList.add('E-this')
                    buttons[2].innerText = '2'
                    buttons[3].innerText = '3'
                    buttons[4].innerText = '4'
                    buttons[6].classList.remove('E-inactive')
                    break

                case last:
                    hide_29_30.classList.add('Removed')
                    hide_1_2.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${last - 3}`
                    buttons[3].innerText = `${last - 2}`
                    buttons[4].innerText = `${last - 1}`
                    buttons[5].classList.add('E-this')
                    buttons[6].classList.add('E-inactive')
                    break

                case 2:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].classList.add('E-this')
                    buttons[2].innerText = '2'
                    buttons[3].innerText = '3'
                    buttons[4].innerText = '4'
                    buttons[6].classList.remove('E-inactive')
                    break

                case last - 1:
                    hide_29_30.classList.add('Removed')
                    hide_1_2.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${last - 3}`
                    buttons[3].innerText = `${last - 2}`
                    buttons[4].innerText = `${last - 1}`
                    buttons[4].classList.add('E-this')
                    buttons[6].classList.remove('E-inactive')
                    break

                case 3:
                    hide_1_2.classList.add('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break

                case last - 2:
                    hide_1_2.classList.remove('Removed')
                    hide_29_30.classList.add('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break

                default:
                    hide_1_2.classList.remove('Removed')
                    hide_29_30.classList.remove('Removed')
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].innerText = `${prevP}`
                    buttons[3].classList.add('E-this')
                    buttons[3].innerText = `${thisP}`
                    buttons[4].innerText = `${nextP}`
                    buttons[6].classList.remove('E-inactive')
                    break
            }
        } else {
            switch (thisP) {
                case 1:
                    buttons[0].classList.add('E-inactive')
                    buttons[1].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case last:
                    buttons[0].classList.remove('E-inactive')
                    buttons[last].classList.add('E-this')
                    buttons[last + 1].classList.add('E-inactive')
                    break

                case 2:
                    buttons[0].classList.remove('E-inactive')
                    buttons[2].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case 3:
                    buttons[0].classList.remove('E-inactive')
                    buttons[3].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                case 4:
                    buttons[0].classList.remove('E-inactive')
                    buttons[4].classList.add('E-this')
                    buttons[last + 1].classList.remove('E-inactive')
                    break

                default:
                    break
            }
        }
    }

    const hasNotNull = (arr) => {
        for (let i of arr) {
            if (i !== 0) {
                return true
            }
        }
        return false
    }

    const notNullMinimum = (countsArr, pricesArr) => {
        let indexes = []
        for (let i in countsArr) {
            if (countsArr[i] !== 0) {
                indexes.push(i)
            }
        }
        let min = pricesArr[indexes[0]]
        for (let i of indexes) {
            if (pricesArr[i] < min) {
                min = pricesArr[i]
            }
        }
        return min
    }

    function capitalizeWords(sentence) {
        return sentence
    }

    const clearFilters = () => {
        setBrandsSet([])
        setModelsSet([])
        setColorsSet([])
        setSizesEuSet([])
        setSizesRuSet([])
        setSizesUsSet([])
        setSizesUkSet([])
        setSizesSmSet([])
        setSizesCloSet([])
        setPriceMin('')
        setPriceMax('')
        setInStock(false)
        const inputs = document.querySelectorAll('.InputCheckbox')
        for (let i of inputs) {
            i.classList.remove('CheckedInput')
        }
        const sizes = document.querySelectorAll('.CheckedSize')
        for (let i of sizes) {
            i.classList.remove('CheckedSize')
        }
        const colors = document.querySelectorAll('.CheckedColor')
        for (let i of colors) {
            i.classList.remove('CheckedColor')
        }

    }

    const nullify = () => {
        first = 1
        last = pages
        catalogue.setPage(1)
        thisP = catalogue.page
        nextP = catalogue.page + 1
        prevP = catalogue.page - 1
    }

    useEffect(() => {
        const handleSort = (e) => {
            const sortPanel = document.querySelector('.AbsoluteSortList')
            if (e.target.id !== 'filtersort') {
                sortPanel && sortPanel.classList.add('HiddenList')
            }
        }
        document.addEventListener('click', handleSort)
        fetchSizesCategory().then(data => setSizes(data))
        if (category === 'accessories' || category === 'clothes' || category === 'shoes') {
            fetchBrandsCategory(category).then(data => setBrands(data))
            fetchColorsCategory(category).then(data => setColors(data))
        } else {
            fetchBrandsCategory().then(data => setBrands(data))
            fetchColorsCategory().then(data => setColors(data))
        }
        fetchModels().then(data => setModels(data))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (brandlink && brandlink !== 'all') {
            setBrandsSet([{ brand: brandlink }])
        } else {
            setBrandsSet([])
        }
        if (sub_category && sub_category !== 'all') {
            console.log(sub_category)
            setSubcatSet([Number(sub_category)])
        } else {
            setSubcatSet([])
        }
        if (category === 'accessories' || category === 'clothes' || category === 'shoes') {
            fetchBrandsCategory(category).then(data => setBrands(data))
            fetchColorsCategory(category).then(data => setColors(data))
        } else {
            fetchBrandsCategory().then(data => setBrands(data))
            fetchColorsCategory().then(data => setColors(data))
        }
        if (document.querySelector('.FilterPrice')?.classList.contains('FilterShown')) showPriceFilter()
        if (document.querySelector('.FilterBrand')?.classList.contains('FilterShown')) showBrandFilter()
        if (document.querySelector('.FilterModel')?.classList.contains('FilterShown')) showModelFilter()
        if (document.querySelector('.FilterSubcat')?.classList.contains('FilterShown')) showSubcatFilter()
        if (document.querySelector('.FilterShoesSize')?.classList.contains('FilterShown')) showShoesSizeFilter()
        if (document.querySelector('.FilterClothesSize')?.classList.contains('FilterShown')) showClothesSizeFilter()
        if (document.querySelector('.FilterColor')?.classList.contains('FilterShown')) showColorsFilter()
        if (document.querySelector('.FilterEu')?.classList.contains('FilterShown2')) showEuFilter()
        if (document.querySelector('.FilterRu')?.classList.contains('FilterShown2')) showRuFilter()
        if (document.querySelector('.FilterUs')?.classList.contains('FilterShown2')) showUsFilter()
        if (document.querySelector('.FilterUk')?.classList.contains('FilterShown2')) showUkFilter()
        if (document.querySelector('.FilterSm')?.classList.contains('FilterShown2')) showSmFilter()
        nullify()
        setFilters(false)
        if (window.innerWidth > 780) {
            document.querySelector('.FilterPanel').setAttribute('style', 'transform: translateX(-300px); opacity: 0')
            document.querySelector('.CatalogueItems2').setAttribute('style', 'width: 100%')
        } else {
            document.querySelector('.FilterPanel').setAttribute('style', 'display: none')
            document.querySelector('.CatalogueItems2').setAttribute('style', 'width: 100%')
        }
        // eslint-disable-next-line
    }, [category, brandlink, search])

    useEffect(() => {
        setFound(false)
        findItems()
        // eslint-disable-next-line
    }, [sizes, brands, models, colors, priceMin, priceMax, sortBy, sortDir, inStock, brandsSet, modelsSet, subcatSet, colorsSet, sizesEuSet, sizesRuSet, sizesUsSet, sizesUkSet, sizesSmSet, sizesCloSet])

    return (
        <div className="MainContainer">
            {category === 'shoes' ?
                <div className="CatalogueHead">КРОССОВКИ И КЕДЫ</div>
                : (category === 'clothes') ?
                    <div className="CatalogueHead">ОДЕЖДА</div>
                    : (category === 'accessories') &&
                    <div className="CatalogueHead">АКСЕССУАРЫ</div>
            }
            <div className="CatalogueTop">
                <div className="FoundCount">Найдено: {found && catalogue.count}</div>
                <div className="CatalogueFilters">
                    <div className="FilterList" onClick={showFilters}><span>ПОКАЗАТЬ ФИЛЬТР</span><LuSettings2 size={18} /></div>
                    <div className="FilterSort" id="filtersort" onClick={handleSortShow}>
                        <span id="filtersort">СОРТИРОВАТЬ ПО: </span>
                        {sortBy === 'new' ?
                            <span className="SortOpacity" id="filtersort">НОВИЗНЕ</span>
                            : sortBy === 'price' &&
                            <span className="SortOpacity" id="filtersort">ЦЕНЕ</span>
                        }
                        <div className="AbsoluteSortList HiddenList">
                            <span id="new" onClick={handleSortBy}>НОВИЗНЕ</span>
                            <span id="price" onClick={handleSortBy}>ЦЕНЕ</span>
                        </div>
                    </div>
                    {sortDir === 'down' ?
                        <BsSortDown className="SortDirection" size={24} onClick={() => handleSortDir('up')} />
                        :
                        <BsSortUpAlt className="SortDirection" size={24} onClick={() => handleSortDir('down')} />
                    }
                </div>
            </div>
            <div className="CatalogueContent">
                <div className="FilterPanel">
                    <div className="FilterClear" onClick={clearFilters}>
                        <SlClose style={{ marginRight: 10 }} />
                        <span>Очистить</span>
                    </div>
                    <div className="FilterInStock" id="instock" onClick={handleCheck}>
                        <div className="InputCheckbox instock" id="instock"><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                        <span id="instock">Только в наличии</span>
                    </div>
                    <span className="FilterLine"></span>
                    <div className="FilterBox FilterPrice">
                        <div className="FilterItem" onClick={showPriceFilter}>
                            <span>Цена, ₽</span>
                            <span className="FilterPlus"></span>
                        </div>
                        <div className="PriceInputs">
                            <input type="text" placeholder="Цена от" value={priceMin} onChange={handlePriceMin} />
                            <input type="text" placeholder="Цена до" value={priceMax} onChange={handlePriceMax} />
                        </div>
                    </div>
                    <span className="FilterLine"></span>
                    <div className="FilterBox FilterBrand">
                        <div className="FilterItem" onClick={showBrandFilter}>
                            <span>Бренды</span>
                            <span className="FilterPlus"></span>
                        </div>
                        {brands.length > 0 && brands.map((brand, i) => {
                            return (
                                <div key={i} className="FilterChecker" id={`brand${i}`} onClick={(e) => handleBrand(e, brand)}>
                                    <div className={`InputCheckbox brand${i} ${brandlink === brand.brand ? 'CheckedInput' : ''}`} id={`brand${i}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                    <span id={`brand${i}`}>{brand.brand}</span>
                                </div>
                            )
                        })}
                    </div>
                    <span className="FilterLine"></span>
                    {(category !== 'accessories' && category !== 'clothes') &&
                        <>
                            <div className="FilterBox FilterModel">
                                <div className="FilterItem" onClick={showModelFilter}>
                                    <span>Модель</span>
                                    <span className="FilterPlus"></span>
                                </div>
                                {models.length > 0 && models.map((model, i) => {
                                    if (model && model.model) {
                                        return (
                                            <div key={i} className="FilterChecker" id={`model${i}`} onClick={(e) => handleModel(e, model)}>
                                                <div className={`InputCheckbox model${i}`} id={`model${i}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                                <span id={`model${i}`}>{model.model}</span>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                            <span className="FilterLine"></span>
                        </>
                    }
                    <div className="FilterBox FilterSubcat">
                        <div className="FilterItem" onClick={showSubcatFilter}>
                            <span>Товарная категория</span>
                            <span className="FilterPlus"></span>
                        </div>
                        {(category !== 'clothes' && category !== 'accessories') && shoesSub.map((sub, i) => {
                            if (sub.id !== 1)
                                return (
                                    <div key={i} className="FilterChecker" id={`subcat${sub.id}`} onClick={(e) => handleSubcat(e, sub)}>
                                        <div className={`InputCheckbox subcat${sub.id} ${Number(sub_category) === sub.id ? 'CheckedInput' : ''}`} id={`subcat${sub.id}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                        <span id={`subcat${sub.id}`}>{formatText(sub.name)}</span>
                                    </div>
                                )
                            else return null
                        })}
                        {(category !== 'shoes' && category !== 'accessories') && clothesSub.map((sub, i) => {
                            if (sub.id !== 1)
                                return (
                                    <div key={i} className="FilterChecker" id={`subcat${sub.id}`} onClick={(e) => handleSubcat(e, sub)}>
                                        <div className={`InputCheckbox subcat${sub.id} ${Number(sub_category) === sub.id ? 'CheckedInput' : ''}`} id={`subcat${sub.id}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                        <span id={`subcat${sub.id}`}>{formatText(sub.name)}</span>
                                    </div>
                                )
                            else return null
                        })}
                        {(category !== 'shoes' && category !== 'clothes') && accessoriesSub.map((sub, i) => {
                            if (sub.id !== 1)
                                return (
                                    <div key={i} className="FilterChecker" id={`subcat${sub.id}`} onClick={(e) => handleSubcat(e, sub)}>
                                        <div className={`InputCheckbox subcat${sub.id} ${Number(sub_category) === sub.id ? 'CheckedInput' : ''}`} id={`subcat${sub.id}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                        <span id={`subcat${sub.id}`}>{formatText(sub.name)}</span>
                                    </div>
                                )
                            else return null
                        })}
                    </div>
                    <span className="FilterLine"></span>
                    <div className="FilterBox FilterColor">
                        <div className="FilterItem" onClick={showColorsFilter}>
                            <span>Цвет</span>
                            <span className="FilterPlus"></span>
                        </div>
                        <div className="ColorsBox">
                            {colorsList.length > 0 && colorsList.map((color, i) => {
                                return (
                                    <div key={i} className={`ColorChecker color${i}`} id={`color${i}`} onClick={(e) => handleColor(e, color)}>
                                        {color.name === 'Multicolor' ?
                                            <img className="ColorCircle" id={`color${i}`} src={colorwheel} alt="Цвет" />
                                            :
                                            <div className={`ColorCircle ${color.name === 'Без цвета' ? 'NoColor' : ''}`} id={`color${i}`} style={{ backgroundColor: color.hex }}></div>
                                        }
                                        <span id={`color${i}`}>{color.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <span className="FilterLine"></span>
                    {category !== 'shoes' &&
                        <>
                            <div className="FilterBox FilterClothesSize">
                                <div className="FilterItem" onClick={showClothesSizeFilter}>
                                    <span>Размер одежды</span>
                                    <span className="FilterPlus"></span>
                                </div>
                                {sizes.sizesClo && sizes.sizesClo.map((size, i) => {
                                    if (size && size.size_clo && size.size_clo !== 'null') {
                                        return (
                                            <div key={i} className="FilterChecker" id={`size${i}`} onClick={(e) => handleCloSize(e, size)}>
                                                <div className={`InputCheckbox size${i}`} id={`size${i}`}><IoCheckmark color="white" style={{ pointerEvents: 'none' }} /></div>
                                                <span id={`size${i}`}>{size.size_clo.toUpperCase()}</span>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                            <span className="FilterLine"></span>
                        </>
                    }
                    {(category !== 'accessories' && category !== 'clothes') &&
                        <>
                            <div className="FilterBox FilterShoesSize">
                                <div className="FilterItem" onClick={showShoesSizeFilter}>
                                    <span>Размер обуви</span>
                                    <span className="FilterPlus"></span>
                                </div>
                                <div className="SizeTypes">
                                    <div className="Empty30"></div>
                                    <div className="FilterBox FilterEu">
                                        <div className="FilterItem" style={{ marginBottom: 10 }} onClick={showEuFilter}>
                                            <span>EU</span>
                                            <span className="FilterPlus2"></span>
                                        </div>
                                        <div className="SizesBox">
                                            {sizes.sizesEu && sizes.sizesEu.map((size, i) => {
                                                if (size && size.size_eu) {
                                                    return (
                                                        <div key={i} className={`FilterCheckerSize eusize${i}`} id={`eusize${i}`} onClick={(e) => handleEuSize(e, size)}>
                                                            <span id={`eusize${i}`}>{size.size_eu}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <span className="FilterLine"></span>
                                    <div className="FilterBox FilterRu">
                                        <div className="FilterItem" style={{ marginBottom: 10 }} onClick={showRuFilter}>
                                            <span>RU</span>
                                            <span className="FilterPlus2"></span>
                                        </div>
                                        <div className="SizesBox">
                                            {sizes.sizesRu && sizes.sizesRu.map((size, i) => {
                                                if (size && size.size_ru) {
                                                    return (
                                                        <div key={i} className={`FilterCheckerSize rusize${i}`} id={`rusize${i}`} onClick={(e) => handleRuSize(e, size)}>
                                                            <span id={`rusize${i}`}>{size.size_ru}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <span className="FilterLine"></span>
                                    <div className="FilterBox FilterUs">
                                        <div className="FilterItem" style={{ marginBottom: 10 }} onClick={showUsFilter}>
                                            <span>US</span>
                                            <span className="FilterPlus2"></span>
                                        </div>
                                        <div className="SizesBox">
                                            {sizes.sizesUs && sizes.sizesUs.map((size, i) => {
                                                if (size && size.size_us) {
                                                    return (
                                                        <div key={i} className={`FilterCheckerSize ussize${i}`} id={`ussize${i}`} onClick={(e) => handleUsSize(e, size)}>
                                                            <span id={`ussize${i}`}>{size.size_us}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <span className="FilterLine"></span>
                                    <div className="FilterBox FilterUk">
                                        <div className="FilterItem" style={{ marginBottom: 10 }} onClick={showUkFilter}>
                                            <span>UK</span>
                                            <span className="FilterPlus2"></span>
                                        </div>
                                        <div className="SizesBox">
                                            {sizes.sizesUk && sizes.sizesUk.map((size, i) => {
                                                if (size && size.size_uk) {
                                                    return (
                                                        <div key={i} className={`FilterCheckerSize uksize${i}`} id={`uksize${i}`} onClick={(e) => handleUkSize(e, size)}>
                                                            <span id={`uksize${i}`}>{size.size_uk}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <span className="FilterLine"></span>
                                    <div className="FilterBox FilterSm">
                                        <div className="FilterItem" style={{ marginBottom: 10 }} onClick={showSmFilter}>
                                            <span>СМ</span>
                                            <span className="FilterPlus2"></span>
                                        </div>
                                        <div className="SizesBox">
                                            {sizes.sizesSm && sizes.sizesSm.map((size, i) => {
                                                if (size && size.size_sm) {
                                                    return (
                                                        <div key={i} className={`FilterCheckerSize smsize${i}`} id={`smsize${i}`} onClick={(e) => handleSmSize(e, size)}>
                                                            <span id={`smsize${i}`}>{size.size_sm}</span>
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="FilterLine"></span>
                        </>
                    }
                </div>
                <div className="CatalogueItems2">
                    {found ?
                        <>
                            <div className="CatalogueItems">
                                {catalogue.items && catalogue.items.length === 0 &&
                                    <div className="CatalogueNotFound">Товары не найдены</div>
                                }
                                {catalogue.items && catalogue.items.map(item => {
                                    return (
                                        <div key={item.id[0]} className="CatalogueCard" onClick={() => navigateItem(item.id[0])}>
                                            <div className={`CatalogueImg ${filters ? 'H15' : 'H20'}`}><img src={`${process.env.REACT_APP_API_URL + item.img[0]}`} alt="" /></div>
                                            <div className={`ItemSale ${item.sale[0] && item.counts[0] > 0 ? '' : 'Invisible'}`}>Sale</div>
                                            <div className="ItemName">{capitalizeWords(item.name[0])}</div>
                                            {hasNotNull(item.counts) ?
                                                <>
                                                    {item.sale[0] ?
                                                        <div className="ItemSaledPrice"><span>от</span> {formatNumberWithSpaces(notNullMinimum(item.counts, item.sale))} <span>₽</span></div>
                                                        :
                                                        <></>
                                                    }
                                                    <div className={`ItemPrice ${item.sale[0] ? 'Crossed' : ''}`}>от {formatNumberWithSpaces(notNullMinimum(item.counts, item.price))} ₽</div>
                                                </>
                                                :
                                                <>
                                                    <div className="ItemPriceAvailable">Доступен для заказа</div>
                                                </>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                        :
                        <div className="LoadingContainer2">
                            <div className="Spinner">
                                <div className="Ball"></div>
                                <p className="Loading">ЗАГРУЗКА...</p>
                            </div>
                        </div>
                    }
                    {pages > 5 ?
                        <div className="E-pagination">
                            <button id="left" className="E-pag E-left E-margin-0 E-inactive E-arr" onClick={handlePagination}><IoIosArrowRoundForward className="IconEvent" size={35} /></button>
                            <button id="first" className="E-pag E-this" onClick={handlePagination}>1</button>
                            <div className="Hide-1-2 Removed">. . .</div>
                            <button id="mid1" className="E-pag E-mid-1" onClick={handlePagination}>2</button>
                            <button id="mid2" className="E-pag" onClick={handlePagination}>3</button>
                            <button id="mid3" className="E-pag E-mid-3" onClick={handlePagination}>4</button>
                            <div className="Hide-29-30">. . .</div>
                            <button id="last" className="E-pag E-last" onClick={handlePagination}>{pages}</button>
                            <button id="right" className="E-pag E-arr" onClick={handlePagination}><IoIosArrowRoundForward className="IconEvent" size={35} /></button>
                        </div>
                        : (pages > 1) &&
                        <div className="E-pagination">
                            <button id="left" className="E-pag E-left E-margin-0 E-inactive E-arr" onClick={handlePagination}><IoIosArrowRoundForward className="IconEvent" size={35} /></button>
                            <button id="first" className="E-pag E-this" onClick={handlePagination}>1</button>
                            <button id="mid1" className="E-pag E-mid-1" onClick={handlePagination}>2</button>
                            {pages > 2 &&
                                <button id="mid2" className="E-pag" onClick={handlePagination}>3</button>
                            }
                            {pages > 3 &&
                                <button id="mid3" className="E-pag E-mid-3" onClick={handlePagination}>4</button>
                            }
                            {pages > 4 &&
                                <button id="last" className="E-pag E-last" onClick={handlePagination}>5</button>
                            }
                            <button id="right" className="E-pag E-arr" onClick={handlePagination}><IoIosArrowRoundForward className="IconEvent" size={35} /></button>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
})

export default Catalogue