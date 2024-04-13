import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCart, fetchImages, fetchItem, fetchSame } from "../http/itemAPI"
import { MdDone } from "react-icons/md";

import "../styles/Item.scss"
import { Context } from "..";
import { TfiClose } from "react-icons/tfi";
import { LuCopy } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";

import arrow from '../assets/arr.png'

const Item = ({ startSearch, openCart }) => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [sameItems, setSameItems] = useState(null)
    const [price, setPrice] = useState(0)
    const [sale, setSale] = useState(0)
    const [chosenItem, setChosenItem] = useState(null)
    const [sizeType, setSizeType] = useState(null)
    const [images, setImages] = useState(null)
    const [nowImg, setNowImg] = useState(0)
    const [chosenTab, setChosenTab] = useState('tab0')
    const { cartItems } = useContext(Context)
    const [scrollPos, setScrollPos] = useState(0)
    const [clientName, setClientName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [isOrderDone, setIsOrderDone] = useState(false)
    const navigate = useNavigate()

    const handleSearch = () => {
        if (startSearch) {
            startSearch()
        }
    }

    const handleNavigate = (e) => {
        navigate(e.target.id)
        document.querySelector('.HeaderBurger').classList.remove('ActiveBurger')
        document.querySelector('.AppContent').classList.remove('Lock')
        window.scrollTo(0, scrollPos)
        document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
        document.querySelector('.BurgerMenu').classList.remove('ActiveBurgerMenu')
        document.querySelector('.OrderItemModal')?.classList.remove('VisibleOrderItem')
        document.querySelector('.OrderItemModal')?.setAttribute('style', `top: 0`)
        hideBurgerBrands()
    }

    const hideBurgerBrands = () => {
        const mainMenu = document.querySelector('.BurgerMain')
        const brandsMenu = document.querySelector('.BurgerBrands')
        const backBtn = document.querySelector('.BurgerBack')
        mainMenu?.classList.remove('TranslateMenu')
        brandsMenu?.classList.remove('TranslateMenu')
        backBtn?.classList.remove('TranslateBtn')
    }

    const handleName = (e) => {
        setClientName(e.target.value)
    }

    const handlePhone = (e) => {
        const formattedNumber = formatPhoneNumber(e)
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setPhoneNumber(formattedNumber)
        setSendNumber('7' + cleaned)
    }


    const formatPhoneNumber = (e) => {
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setSendNumber('7' + cleaned)
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
        let formattedNumber
        switch (cleaned.length) {
            case 10:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 9:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 8:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-`
                break
            case 7:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}`
                break
            case 6:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-`
                break
            case 5:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 4:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 3:
                formattedNumber = !match ? '' : `(${match[1]}) `
                break
            case 2:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 1:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 0:
                formattedNumber = !match ? '' : ``
                break

            default:
                break
        }

        return formattedNumber;
    }


    const handleBackspace = (e) => {
        if (e.keyCode === 8 || e.key === 'Backspace') {
            e.preventDefault()
            const cleaned = ('' + e.target.value).replace(/\D/g, '')
            const match = cleaned.split('')
            let formattedNumber
            switch (cleaned.length) {
                case 10:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-${match[8]}`
                    break
                case 9:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-`
                    break
                case 8:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}`
                    break
                case 7:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-`
                    break
                case 6:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}`
                    break
                case 5:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}`
                    break
                case 4:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) `
                    break
                case 3:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}`
                    break
                case 2:
                    formattedNumber = !match ? '' :
                        `(${match[0]}`
                    break
                case 1:
                    formattedNumber = !match ? '' : ``
                    break
                case 0:
                    formattedNumber = !match ? '' : ``
                    break

                default:
                    break
            }
            const newCleaned = ('7' + formattedNumber).replace(/\D/g, '')
            setPhoneNumber(formattedNumber)
            setSendNumber(newCleaned)
        }
    }


    useEffect(() => {
        fetchItem(id).then((data) => {
            setItem(data)
            fetchImages(data.code).then((imgs) => {
                setImages(imgs)
            })
            fetchSame(data.code).then((data2) => {
                setSameItems(sortByEu(data2))
                const nonNullItems = data2.filter(c => c !== null && c.count !== 0)
                if (nonNullItems.length !== 0) {
                    setPrice(formatNumberWithSpaces(nonNullItems[0].price))
                    setSale(nonNullItems[0].sale)
                    setChosenItem(nonNullItems[0])
                } else {
                    setPrice('Доступен для заказа')
                    setSale(null)
                    setChosenItem(null)
                }
                if (data.category === 'shoes') {
                    setSizeType('eu')
                } else {
                    setSizeType(null)
                }
            })
        })
    }, [id])

    function formatNumberWithSpaces(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function capitalizeWords(sentence) {
        return sentence
    }

    const chooseSize = (e) => {
        setSizeType(e.target.id)
        switch (e.target.id) {
            case 'eu':
                document.querySelector('.SizeUnderline').style.left = '0%'
                break

            case 'ru':
                document.querySelector('.SizeUnderline').style.left = '20%'
                break

            case 'us':
                document.querySelector('.SizeUnderline').style.left = '40%'
                break

            case 'uk':
                document.querySelector('.SizeUnderline').style.left = '60%'
                break

            case 'sm':
                document.querySelector('.SizeUnderline').style.left = '80%'
                break

            default:
                break
        }
    }

    const sortByEu = (array) => {
        return array.sort((a, b) => a.size_eu - b.size_eu)
    }

    const handleChooseSize = (item) => {
        if (item.count !== 0)
            setChosenItem(item)
    }

    const handleImgLeft = () => {
        if (nowImg > 0) setNowImg(nowImg - 1)
        else setNowImg(images.length)
    }

    const handleImgRight = () => {
        if (nowImg < images.length) setNowImg(nowImg + 1)
        else setNowImg(0)
    }

    const handleClickImg = (num) => {
        setNowImg(num)
    }

    const handleToCart = () => {
        if (chosenItem) {
            let cartList = JSON.parse(localStorage.getItem('cart'))
            if (Array.isArray(cartList)) {
                cartList.push(chosenItem.id)
                localStorage.setItem('cart', JSON.stringify(cartList))
            } else {
                localStorage.setItem('cart', JSON.stringify([item.id]))
            }
            openCart()
            const cartList2 = JSON.parse(localStorage.getItem('cart'))
            if (Array.isArray(cartList2) && cartList2.length > 0) {
                fetchCart(cartList2).then(data => {
                    cartItems.setFullCart(data, cartList2)
                    let countsOfItems = {}
                    for (let i of data) {
                        let count = cartList2.filter(item => item === i.id).length
                        countsOfItems[i.id] = count
                    }
                    let sum = 0
                    for (let key in countsOfItems) {
                        let item = data.filter(i => i.id === Number(key))
                        if (item[0])
                            sum += item[0].sale ? item[0].sale * countsOfItems[key] : item[0].price * countsOfItems[key]
                    }
                    if (document.querySelector('.CartCostSpan')) {
                        document.querySelector('.CartCostSpan').innerHTML = formatNumberWithSpaces(sum) + ' ₽'
                    }
                })
            }
        }
    }

    const hasNotNull = () => {
        for (let i of sameItems) {
            if (i.count !== null && i.count > 0) return true
        }
        return false
    }

    const handleTab = (e) => {
        setChosenTab(e.target.id)
        const tabs = document.querySelectorAll('.ItemTab')
        tabs.forEach(tab => {
            tab.classList.remove('ChosenTab')
        })
        e.target.classList.add('ChosenTab')
    }

    const showSizesTable = () => {
        document.querySelector('.SizesText').classList.toggle('SizesHidden')
    }

    const hideSizesTable = (e) => {
        if (e.target.id !== 'sizes') {
            document.querySelector('.AppContent').classList.remove('Lock')
            window.scrollTo(0, scrollPos)
            document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
            document.querySelector('.SizesModal').classList.remove('VisibleSizes')
        }
    }

    const clickToOrder = () => {
        document.querySelector('.OrderItemModal').classList.add('VisibleOrderItem')
        setScrollPos(window.scrollY)
        document.querySelector('.OrderItemModal').setAttribute('style', `top: ${window.scrollY}px`)
        document.querySelector('.AppContent').setAttribute('style', `transform: translateY(-${window.scrollY}px)`)
        document.querySelector('.AppContent').classList.add('Lock')
    }

    const closeOrderModal = () => {
        document.querySelector('.OrderItemModal').classList.remove('VisibleOrderItem')
        document.querySelector('.AppContent').classList.remove('Lock')
        window.scrollTo(0, scrollPos)
        document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
        document.querySelector('.OrderItemModal').setAttribute('style', `top: 0`)
    }

    const handleOrder = () => {
        setIsOrderDone(true)
    }

    const toClipboard = () => {
        navigator.clipboard.writeText(item.code)
    }

    return (
        <div className="MainContainer">
            {item && sameItems && price ?
                <>
                    <div className="ItemLinks">
                        <div className="ItemLink Pointer" id="/catalogue" onClick={handleNavigate}>Каталог /</div>
                        <div className="ItemLink Pointer" id={`/catalogue/${item.category}`} onClick={handleNavigate}>{item.category === 'shoes' ? 'Обувь' : (item.category === 'clothes') ? 'Одежда' : 'Аксессуары'} /</div>
                        <div className="ItemLink">{capitalizeWords(item.name)}</div>
                    </div>
                    <div className="ItemPanel">
                        {images && images.length > 0 &&
                            <div className="ItemImagesSmall">
                                <div className={`SmallImg ${nowImg} ${nowImg === 0 ? 'NowImg' : ''}`} onClick={() => handleClickImg(0)}>
                                    <img src={process.env.REACT_APP_API_URL + item.img} alt={item.name} />
                                </div>
                                {images && images.map((img, i) => {
                                    return (
                                        <div key={i} className={`SmallImg ${nowImg === i + 1 ? 'NowImg' : ''}`} onClick={() => handleClickImg(i + 1)}>
                                            <img src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <div className={`ItemImgContainer ${images && images.length > 0 ? 'Thin' : ''}`}>
                            <div className="ImgBtn LeftImg" onClick={handleImgLeft}><img src={arrow} alt="arrow" /></div>
                            <img className={`ImgOpacity ${nowImg === 0 ? '' : 'InvisibleImg'}`} src={process.env.REACT_APP_API_URL + item.img} alt={item.name} />
                            {images && images.map((img, i) => {
                                return (
                                    <img key={i} className={`ImgOpacity ${nowImg === i + 1 ? '' : 'InvisibleImg'}`} src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                )
                            })}
                            <div className="ImgBtn RightImg" onClick={handleImgRight}><img src={arrow} alt="arrow" /></div>
                        </div>
                        {images && images.length > 0 &&
                            <div className="ItemImagesSmall2">
                                <div className={`SmallImg ${nowImg} ${nowImg === 0 ? 'NowImg' : ''}`} onClick={() => handleClickImg(0)}>
                                    <img src={process.env.REACT_APP_API_URL + item.img} alt={item.name} />
                                </div>
                                {images && images.map((img, i) => {
                                    return (
                                        <div className={`SmallImg ${nowImg === i + 1 ? 'NowImg' : ''}`} onClick={() => handleClickImg(i + 1)}>
                                            <img key={i} src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <div className="ItemInfo">
                            {chosenItem ?
                                <div className={`ItemSaleItem ${chosenItem.sale && chosenItem.count > 0 ? '' : 'InvisibleSale'}`}>Sale</div>
                                :
                                <div className={`ItemSaleItem ${item.sale && item.count > 0 ? '' : 'InvisibleSale'}`}>Sale</div>
                            }
                            <div className="ItemNameItem">{capitalizeWords(item.name)}</div>
                            {(sale && hasNotNull()) ?
                                <div className="ItemSaledPriceItem MT20">{chosenItem ? formatNumberWithSpaces(chosenItem.sale) : formatNumberWithSpaces(sale)} <span>₽</span></div>
                                :
                                <></>
                            }
                            {hasNotNull() ?
                                <>
                                    <div className={`ItemPriceItem MT10 FS20 Span16 FW400 ${item.sale && item.count > 0 && hasNotNull() ? 'Crossed' : ''}`}>{chosenItem ? formatNumberWithSpaces(chosenItem.price) : formatNumberWithSpaces(price)} <span>₽</span></div>
                                    <div className="NoTax">Все налоги и таможенные сборы включены. Стоимость доставки рассчитывается на этапе оформления заказа.</div>
                                </>
                                :
                                <div className="ItemPriceItem MT20">Доступен для заказа</div>
                            }
                            {item.size_clo && item.size_clo !== '0' ?
                                <div className="SizeTypes2 Centered">Размеры</div>
                                :
                                (item.size_eu &&
                                    <div className="SizeTypes2">
                                        <div className={`SizeType ${sizeType === 'eu' ? 'ChosenSize' : ''}`} id="eu" onClick={chooseSize}>EU</div>
                                        <div className={`SizeType ${sizeType === 'ru' ? 'ChosenSize' : ''}`} id="ru" onClick={chooseSize}>RU</div>
                                        <div className={`SizeType ${sizeType === 'us' ? 'ChosenSize' : ''}`} id="us" onClick={chooseSize}>US</div>
                                        <div className={`SizeType ${sizeType === 'uk' ? 'ChosenSize' : ''}`} id="uk" onClick={chooseSize}>UK</div>
                                        <div className={`SizeType ${sizeType === 'sm' ? 'ChosenSize' : ''}`} id="sm" onClick={chooseSize}>CM</div>
                                        <span className="SizeUnderline"></span>
                                    </div>
                                )
                            }
                            <div className="SizesGrid">
                                {sizeType === 'eu' ?
                                    <>
                                        {sameItems.map((item, i) => {
                                            return (
                                                <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                    <span>EU {item.size_eu}</span>
                                                    {item.count !== 0 ?
                                                        <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                        :
                                                        <span className="GreyAsk">Запросить</span>
                                                    }
                                                </div>
                                            )
                                        })}
                                    </>
                                    : (sizeType === 'ru' ?
                                        <>
                                            {sameItems.map((item, i) => {
                                                return (
                                                    <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                        <span>RU {item.size_ru}</span>
                                                        {item.count !== 0 ?
                                                            <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                            :
                                                            <span className="GreyAsk">Запросить</span>
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </>
                                        : (sizeType === 'us' ?
                                            <>
                                                {sameItems.map((item, i) => {
                                                    return (
                                                        <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                            <span>US {item.size_us}</span>
                                                            {item.count !== 0 ?
                                                                <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                                :
                                                                <span className="GreyAsk">Запросить</span>
                                                            }
                                                        </div>
                                                    )
                                                })}
                                            </>
                                            : (sizeType === 'uk' ?
                                                <>
                                                    {sameItems.map((item, i) => {
                                                        return (
                                                            <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                                <span>UK {item.size_uk}</span>
                                                                {item.count !== 0 ?
                                                                    <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                                    :
                                                                    <span className="GreyAsk">Запросить</span>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </>
                                                : (sizeType === 'sm' ?
                                                    <>
                                                        {sameItems.map((item, i) => {
                                                            return (
                                                                <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                                    <span>CM {item.size_sm}</span>
                                                                    {item.count !== 0 ?
                                                                        <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                                        :
                                                                        <span className="GreyAsk">Запросить</span>
                                                                    }
                                                                </div>
                                                            )
                                                        })}
                                                    </>
                                                    :
                                                    <>
                                                        {sameItems.map((item, i) => {
                                                            if (item.size_clo) {
                                                                return (
                                                                    <div key={i} className={`SizeBtn ${chosenItem === item ? 'ChosenBtn' : ''} ${item.count !== 0 ? 'BGGrey' : ''}`} onClick={() => handleChooseSize(item)}>
                                                                        <span>{item.size_clo}</span>
                                                                        {item.count !== 0 ?
                                                                            <span className={`RedPrice ${item.sale ? 'RedSale' : ''}`}>{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
                                                                            :
                                                                            <span className="GreyAsk">Запросить</span>
                                                                        }
                                                                    </div>
                                                                )
                                                            } else {
                                                                return null
                                                            }
                                                        })}
                                                    </>
                                                )
                                            )
                                        )
                                    )
                                }
                            </div>
                            <div className="SizesInfo" onClick={showSizesTable}>
                                <span className="BlackCircle">i</span>
                                <span className="Underlined">Как выбрать размер?</span>
                            </div>
                            <div className="SizesText SizesHidden">
                                <p>
                                    • Нужно встать на лист бумаги и обвести стопу. Далее замерить
                                    расстояние от большого пальца до крайней точки пятки. Вы также можете
                                    ориентироваться по значению в сантиметрах на размерной бирке внутри вашей обуви.
                                </p>
                                <p>
                                    •Отличие европейского от российского размера:
                                    Европейский больше российского на один размер.
                                    Если у вас 38 RU, нужно выбирать 39 EU.
                                </p>
                            </div>
                            <div className="SizesModal" onClick={hideSizesTable}>
                                <div className="SizesTable" id="sizes">
                                    <div id="sizes">Таблица размеров</div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>EU</td>
                                                <td>RU</td>
                                                <td>US</td>
                                                <td>UK</td>
                                                <td>CM</td>
                                            </tr>
                                            <tr>
                                                <td>36</td>
                                                <td>35</td>
                                                <td>4</td>
                                                <td>3</td>
                                                <td>23</td>
                                            </tr>
                                            <tr>
                                                <td>37</td>
                                                <td>36</td>
                                                <td>5</td>
                                                <td>4</td>
                                                <td>23</td>
                                            </tr>
                                            <tr>
                                                <td>38</td>
                                                <td>37</td>
                                                <td>6</td>
                                                <td>5</td>
                                                <td>24</td>
                                            </tr>
                                            <tr>
                                                <td>39</td>
                                                <td>38</td>
                                                <td>7</td>
                                                <td>6</td>
                                                <td>25</td>
                                            </tr>
                                            <tr>
                                                <td>40</td>
                                                <td>39</td>
                                                <td>8</td>
                                                <td>7</td>
                                                <td>26</td>
                                            </tr>
                                            <tr>
                                                <td>41</td>
                                                <td>40</td>
                                                <td>9</td>
                                                <td>8</td>
                                                <td>27</td>
                                            </tr>
                                            <tr>
                                                <td>42</td>
                                                <td>41</td>
                                                <td>10</td>
                                                <td>9</td>
                                                <td>28</td>
                                            </tr>
                                            <tr>
                                                <td>43</td>
                                                <td>42</td>
                                                <td>11</td>
                                                <td>10</td>
                                                <td>29</td>
                                            </tr>
                                            <tr>
                                                <td>44</td>
                                                <td>43</td>
                                                <td>12</td>
                                                <td>11</td>
                                                <td>30</td>
                                            </tr>
                                            <tr>
                                                <td>45</td>
                                                <td>44</td>
                                                <td>13</td>
                                                <td>12</td>
                                                <td>31</td>
                                            </tr>
                                            <tr>
                                                <td>46</td>
                                                <td>45</td>
                                                <td>14</td>
                                                <td>13</td>
                                                <td>32</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ItemBuy">
                                <div className="QualityItem">Товар прошел проверку на качество и оригинальность</div>
                                {chosenItem ?
                                    <>
                                        <div className="BuyBtn" onClick={handleToCart}>
                                            {(chosenItem.size_clo || chosenItem.size_eu) &&
                                                <>
                                                    <div className="BuySize">{sizeType && (sizeType !== 'sm' ? sizeType.toUpperCase() : 'СМ')} {chosenItem.size_clo && chosenItem.size_clo !== '0' ? chosenItem.size_clo.toUpperCase() : (sizeType === 'eu') ? chosenItem.size_eu : (sizeType === 'ru') ? chosenItem.size_ru : (sizeType === 'us') ? chosenItem.size_us : (sizeType === 'uk') ? chosenItem.size_uk : chosenItem.size_sm}</div>
                                                    <div className="BuyLine"></div>
                                                </>
                                            }
                                            <div className="BuyText">ДОБАВИТЬ В КОРЗИНУ</div>
                                        </div>
                                        <div className="BuyBtn BuyNow" onClick={clickToOrder}>
                                            <div className="BuyText">КУПИТЬ</div>
                                        </div>
                                        <div className="OrderItemModal">
                                            <TfiClose className="CloseOrderItem" size={30} onClick={closeOrderModal} style={{ cursor: 'pointer' }} />
                                            {isOrderDone ?
                                                <div className='OrderingCart'>
                                                    <div className='OrderTitle'>Ваш заказ оформлен!</div>
                                                    <button className='OrderConfirm' onClick={closeOrderModal}>Вернуться к покупкам</button>
                                                </div>
                                                :
                                                <div className='OrderingCart'>
                                                    <div className='OrderTitle'>Оформление заказа</div>
                                                    <input className='OrderInput' type="text" placeholder='ФИО' value={clientName} onChange={handleName} />
                                                    <div className='OrderInput' style={{ backgroundColor: 'white' }}>
                                                        <span>+7</span>
                                                        <input
                                                            type="text"
                                                            placeholder='(999) 999-99-99'
                                                            maxLength="15"
                                                            value={phoneNumber}
                                                            onChange={(e) => {
                                                                handlePhone(e)
                                                            }}
                                                            onKeyDown={handleBackspace}
                                                        />
                                                    </div>
                                                    <button className={`OrderConfirm ${clientName.length > 0 && sendNumber.length === 11 ? '' : 'NonActiveOrder'}`} id='cart' onClick={() => handleOrder()}>Отправить</button>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    :
                                    <div className="BuyBtn" onClick={handleToCart}>
                                        <div className="BuyText">ЗАПРОСИТЬ</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="ItemInfoTabs">
                        <div className="ItemTab ChosenTab" id="tab0" onClick={handleTab}>ОПИСАНИЕ</div>
                        <div className="ItemTab" id="tab1" onClick={handleTab}>СПОСОБЫ ДОСТАВКИ</div>
                        <div className="ItemTab" id="tab2" onClick={handleTab}>УСЛОВИЯ ВОЗВРАТА</div>
                        <div className="ItemTab" id="tab3" onClick={handleTab}>СПОСОБЫ ОПЛАТ</div>
                        <div className="ItemTab" id="tab4" onClick={handleTab}>FAQ</div>
                    </div>
                    <div className="ItemDetails">
                        <div className="DetailsLeft">
                            <div className="ItemInfoPars">
                                <div className={`ItemInfoPar ${chosenTab === 'tab0' ? '' : 'InvisibleTab'}`}>
                                    <p>{item.description}</p>
                                </div>
                                <div className={`ItemInfoPar ${chosenTab === 'tab1' ? '' : 'InvisibleTab'}`}>
                                    <p className="Bold">Сейчас доступны следующие варианты доставки:</p>
                                    <p>- Доставка в любой магазин EFIM VERETSKY.</p>
                                    <p>- Доставка домой или в офис курьерской службой.</p>
                                    <p className="Bold">Доставка заказов по России</p>
                                    <p>Доставка по России производится по 100% предоплате и осуществляется следующими способами доставки:</p>
                                    <p>- Почта России. Срок доставки от 4 до 14 дней.</p>
                                    <p>- СДЕК. Сроки доставки 3-7 рабочих дней.</p>
                                    <p>- Боксберри. Сроки доставки 3-7 рабочих дней.</p>
                                    <p className="Bold">Самовывоз</p>
                                    <p>- Самовывоз доступен в нашем магазине по адресу … . Время работы: 10:00-22:00. О готовности заказа сообщит по телефону наш менеджер.</p>
                                    <p>В пункте самовывоза перед оплатой доступна примерка в присутствии сотрудника магазина.</p>
                                    <p>Если выбранный товар доступен только под заказ, то сроки доставки увеличиваются с 14 до 21 дня.</p>
                                    <p className="Bold">Команда магазина EFIM VERETSKY стремится обеспечить исключительное качество обслуживания клиентов. Мы работаем над тем, чтобы наши клиенты были самыми счастливыми, поэтому стараемся доставлять заказы максимально быстро и комфортно для Вас.</p>
                                </div>
                                <div className={`ItemInfoPar ${chosenTab === 'tab2' ? '' : 'InvisibleTab'}`}>

                                </div>
                                <div className={`ItemInfoPar ${chosenTab === 'tab3' ? '' : 'InvisibleTab'}`}>
                                    <p>Мы принимаем оплату следующими способами.</p>
                                    <p className="Bold">- Банковскими картами:</p>
                                    <p>Visa, Mastercard, МИР.</p>
                                    <p className="Bold">- Электронными платежами:</p>
                                    <p>Всеми популярными способами (Visa, MasterCard, МИР, а также СБП и др.)</p>
                                    <p className="Bold">- Наличными средствами:</p>
                                    <p>Оплата заказа производится наличными в рублях в магазине или курьеру, в момент передачи заказа</p>
                                    <p className="Bold">- Оплата переводом по реквизитам</p>
                                </div>
                                <div className={`ItemInfoPar ${chosenTab === 'tab4' ? '' : 'InvisibleTab'}`}>
                                    <p className="Bold">- Чем занимается Ваш интернет-магазин?</p>
                                    <p>Мы занимаемся поиском и продажей оригинальных кроссовок и вещей для широкой аудитории. Мы заинтересованы сделать кроссовки более доступными для всех потребителей, и верим,что для каждого найдется пара, независимо от бренда, стиля, размера и функции.</p>
                                    <p className="Bold">- Вы продаёте оригинальные товары?</p>
                                    <p>Мы продаем исключительно новые и 100% оригинальные товары. Мы не принимаем и не работаем с подделками, товарами с «серого рынка» или заводскими вариантами. Мы гарантируем подлинность каждого проданного товара. Каждый из товаров, представленных в EV, проходит тщательную проверку подлинности нашими экспертами.</p>
                                    <p className="Bold">- Почему цена зависит от размера?</p>
                                    <p>Все модели и размеры выпускаются в ограниченном количестве, стоимость каждого размера зависит от спроса на него на рынке.</p>
                                    <p className="Bold">- Какие размеры указаны на сайте?</p>
                                    <p>Вся обувь на сайте представлена в US размерах. Для удобства в таблице размеров показано соответствие US размеров с UK, EUR, RU размерами и длиной стопы. Вы можете самостоятельно определить свой размер, воспользовавшись таблицей размеров на странице товара.</p>
                                    <p className="Bold">- Гарантирована ли безопасность моих данных?</p>
                                    <p>Мы гарантируем полную безопасность ваших персональных данных. Если у вас есть вопросы, пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности.</p>
                                </div>
                            </div>
                        </div>
                        <div className="DetailsRight">
                            <div className="DetailArt">
                                <span className="DetSub">Артикул</span>
                                <span className="DetInfo">{item.code} <LuCopy style={{ marginLeft: 10, cursor: 'pointer' }} onClick={toClipboard} /></span>
                            </div>
                            <div className="DetailBrand">
                                <span className="DetSub">Бренд</span>
                                <span className="DetInfo" id={`/catalogue/all/${item.brand}`} onClick={handleNavigate} style={{ cursor: 'pointer' }}>{item.brand.toUpperCase()} <IoIosArrowForward style={{ marginLeft: 10 }} /></span>
                            </div>
                        </div>
                    </div>
                    <div className="GoShopping">
                        <div className="GoSub">ПРОДОЛЖИТЬ ПОКУПКИ</div>
                        <div className="GoPar">Найдите то, что вы хотите, в один клик. Всего один клик, не стесняйтесь продолжить</div>
                        <div className="GoBtns">
                            <button onClick={handleSearch}>ПОИСК</button>
                            <button id={`/catalogue/${item.category}`} onClick={handleNavigate}>ВЕРНУТЬСЯ В КАТЕГОРИЮ <MdArrowOutward /></button>
                        </div>
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
        </div>
    )
}

export default Item