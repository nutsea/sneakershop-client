import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchCart, fetchImages, fetchItem, fetchSame } from "../http/itemAPI"
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdDone } from "react-icons/md";

import "../styles/Item.scss"
import { Context } from "..";

const Item = () => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [sameItems, setSameItems] = useState(null)
    const [price, setPrice] = useState(0)
    const [sale, setSale] = useState(0)
    const [chosenItem, setChosenItem] = useState(null)
    const [sizeType, setSizeType] = useState(null)
    const [images, setImages] = useState(null)
    const [nowImg, setNowImg] = useState(0)
    const [chosenTab, setChosenTab] = useState('tab1')
    const { cartItems } = useContext(Context)

    useEffect(() => {
        fetchItem(id).then((data) => {
            setItem(data)
            fetchImages(data.id).then((imgs) => {
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
                    setPrice('Доступен к заказу')
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
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
            fetchCart(cartList).then(data => {
                cartItems.setCart(data)
                let countsOfItems = {}
                for (let i of data) {
                    let count = cartList.filter(item => item === i.id).length
                    countsOfItems[i.id] = count
                }
                cartItems.setCounts(countsOfItems)
            })
        }
    }

    const hasNotNull = () => {
        for (let i of sameItems) {
            if (i.count !== null) return true
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

    return (
        <div className="MainContainer">
            {item && sameItems && price ?
                <>
                    <div className="ItemPanel">
                        {images && images.length > 0 &&
                            <div className="ItemImagesSmall">
                                <div className="SmallImg" onClick={() => handleClickImg(0)}>
                                    <img src={process.env.REACT_APP_API_URL + item.img} alt={item.name} />
                                </div>
                                {images && images.map((img, i) => {
                                    return (
                                        <div className="SmallImg" onClick={() => handleClickImg(i + 1)}>
                                            <img key={i} src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <div className={`ItemImgContainer ${images && images.length > 0 ? 'Thin' : ''}`}>
                            <IoIosArrowRoundBack className="ImgBtn LeftImg" size={60} onClick={handleImgLeft} />
                            <img className={`${nowImg === 0 ? '' : 'InvisibleImg'}`} src={process.env.REACT_APP_API_URL + item.img} alt={item.name} />
                            {images && images.map((img, i) => {
                                return (
                                    <img key={i} className={`${nowImg === i + 1 ? '' : 'InvisibleImg'}`} src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                )
                            })}
                            <IoIosArrowRoundForward className="ImgBtn RightImg" size={60} onClick={handleImgRight} />
                        </div>
                        {images && images.length > 0 &&
                            <div className="ItemImagesSmall2">
                                {images && images.map((img, i) => {
                                    return (
                                        <div className="SmallImg" onClick={() => handleClickImg(i + 1)}>
                                            <img key={i} src={process.env.REACT_APP_API_URL + img.name} alt={item.name} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        <div className="ItemInfo">
                            <div className={`ItemSaleItem ${item.sale ? '' : 'Invisible'}`}>Sale</div>
                            <div className="ItemNameItem">{capitalizeWords(item.name)}</div>
                            {sale && hasNotNull() &&
                                <div className="ItemSaledPriceItem MT20">{chosenItem ? formatNumberWithSpaces(chosenItem.sale) : formatNumberWithSpaces(sale)} <span>₽</span></div>
                            }
                            {hasNotNull() ?
                                <div className={`ItemPriceItem MT10 FS20 Span16 FW400 ${item.sale && hasNotNull() ? 'Crossed' : ''}`}>{chosenItem ? formatNumberWithSpaces(chosenItem.price) : formatNumberWithSpaces(price)} <span>₽</span></div>
                                :
                                <div className="ItemPriceItem MT20">Доступен для заказа</div>
                            }
                            {item.size_clo ?
                                <div className="SizeTypes Centered">Размеры</div>
                                :
                                (item.size_eu &&
                                    <div className="SizeTypes">
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
                                                        <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                                                            <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                                                                <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                                                                    <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                                                                        <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                                                                            <span className="RedPrice">{item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽ <MdDone className="GreenCheck" /></span>
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
                            <div className="SizesInfo">
                                <span className="BlackCircle">i</span>
                                <span className="Underlined">Как выбрать размер?</span>
                            </div>
                            <div className="ItemBuy">
                                <div className="BuyBtn" onClick={handleToCart}>
                                    {chosenItem ?
                                        <>
                                            {(chosenItem.size_clo || chosenItem.size_eu) &&
                                                <>
                                                    <div className="BuySize">{sizeType && (sizeType !== 'sm' ? sizeType.toUpperCase() : 'СМ')} {chosenItem.size_clo ? chosenItem.size_clo.toUpperCase() : chosenItem.size_eu}</div>
                                                    <div className="BuyLine"></div>
                                                </>
                                            }
                                            <div className="BuyText">ДОБАВИТЬ В КОРЗИНУ</div>
                                        </>
                                        :
                                        <div className="BuyText">ЗАПРОСИТЬ</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ItemDetails">
                        <div className="ItemInfoTabs">
                            <div className="ItemTab ChosenTab" id="tab1" onClick={handleTab}>СПОСОБЫ ДОСТАВКИ</div>
                            <div className="ItemTab" id="tab2" onClick={handleTab}>УСЛОВИЯ ВОЗВРАТА</div>
                            <div className="ItemTab" id="tab3" onClick={handleTab}>СПОСОБЫ ОПЛАТ</div>
                            <div className="ItemTab" id="tab4" onClick={handleTab}>FAQ</div>
                        </div>
                        <div className="ItemInfoPars">
                            <div className={`ItemInfoPar ${chosenTab === 'tab1' ? '' : 'InvisibleTab'}`}>
                                <p className="Bold">Сейчас доступны следующие варианты доставки:</p>
                                <p>- доставка в любой магазин EFIM VERETSKY.</p>
                                <p>- доставка домой или в офис курьерской службой.</p>
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
                </>
                :
                <></>
            }
        </div>
    )
}

export default Item