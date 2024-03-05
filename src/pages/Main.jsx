import React, { useEffect, useState } from "react";
import '../styles/Main.scss'
import { fetchAccessoriesRnd, fetchClothesRnd, fetchShoesRnd } from "../http/itemAPI";
import { MdArrowOutward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate()
    const [shoes, setShoes] = useState()
    const [clothes, setClothes] = useState()
    const [accessories, setAccessories] = useState()

    const handleNavigate = (e) => {
        navigate(e.target.id)
    }

    const navigateItem = (id) => {
        navigate(`/item/${id}`)
    }

    useEffect(() => {
        fetchShoesRnd().then(data => {
            setShoes(data)
        })
        fetchClothesRnd().then(data => {
            setClothes(data)
            console.log(data)
        })
        fetchAccessoriesRnd().then(data => {
            setAccessories(data)
        })
    }, [])

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

    return (
        <div className="MainContainer">
            {shoes && clothes && accessories ?
                <>
                    <div className="MainCategoryTop">
                        <div className="MainSub">ОБУВЬ</div>
                        <div className="AllModels" id="/catalogue/shoes" onClick={handleNavigate}>ВСЕ МОДЕЛИ <MdArrowOutward /></div>
                    </div>
                    <div className="ItemsContainer">
                        {shoes.length > 0 && shoes.map(item => {
                            return (
                                <div key={item.id} className="ItemCard" onClick={() => navigateItem(item.id)}>
                                    <div className="ItemImg"><img src={`${process.env.REACT_APP_API_URL + item.img}`} alt="" /></div>
                                    <div className={`ItemSale ${item.sale && item.count > 0 ? '' : 'Invisible'}`}>Sale</div>
                                    <div className="ItemName">{capitalizeWords(item.name)}</div>
                                    {item.count > 0 ?
                                        <>
                                            {item.sale &&
                                                <div className="ItemSaledPrice"><span>от</span> {formatNumberWithSpaces(item.sale)} <span>₽</span></div>
                                            }
                                            <div className={`ItemPrice ${item.sale ? 'Crossed' : ''}`}>от {formatNumberWithSpaces(item.price)} ₽</div>
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
                    <div className="MainCategoryTop MT100">
                        <div className="MainSub">ОДЕЖДА</div>
                        <div className="AllModels" id="/catalogue/clothes" onClick={handleNavigate}>ВСЕ МОДЕЛИ <MdArrowOutward /></div>
                    </div>
                    <div className="ItemsContainer">
                        {clothes.length > 0 && clothes.map(item => {
                            return (
                                <div key={item.id} className="ItemCard" onClick={() => navigateItem(item.id)}>
                                    <div className="ItemImg"><img src={`${process.env.REACT_APP_API_URL + item.img}`} alt="" /></div>
                                    <div className={`ItemSale ${item.sale ? '' : 'Invisible'}`}>Sale</div>
                                    <div className="ItemName">{capitalizeWords(item.name)}</div>
                                    {item.count > 0 ?
                                        <>
                                            {item.sale ?
                                                <div className="ItemSaledPrice"><span>от</span> {formatNumberWithSpaces(item.sale)} <span>₽</span></div>
                                                :
                                                <></>
                                            }
                                            <div className={`ItemPrice ${item.sale ? 'Crossed' : ''}`}>от {formatNumberWithSpaces(item.price)} ₽</div>
                                        </>
                                        :
                                        <>
                                            <div className="ItemPrice">Доступен для заказа</div>
                                        </>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className="MainCategoryTop MT100">
                        <div className="MainSub">АКСЕССУАРЫ</div>
                        <div className="AllModels" id="/catalogue/accessories" onClick={handleNavigate}>ВСЕ МОДЕЛИ <MdArrowOutward /></div>
                    </div>
                    <div className="ItemsContainer">
                        {accessories.length > 0 && accessories.map(item => {
                            return (
                                <div key={item.id} className="ItemCard" onClick={() => navigateItem(item.id)}>
                                    <div className="ItemImg"><img src={`${process.env.REACT_APP_API_URL + item.img}`} alt="" /></div>
                                    <div className={`ItemSale ${item.sale ? '' : 'Invisible'}`}>Sale</div>
                                    <div className="ItemName">{capitalizeWords(item.name)}</div>
                                    {item.count > 0 ?
                                        <>
                                            {item.sale &&
                                                <div className="ItemSaledPrice"><span>от</span> {formatNumberWithSpaces(item.sale)} <span>₽</span></div>
                                            }
                                            <div className={`ItemPrice ${item.sale ? 'Crossed' : ''}`}>от {formatNumberWithSpaces(item.price)} ₽</div>
                                        </>
                                        :
                                        <>
                                            <div className="ItemPrice">Доступен для заказа</div>
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
        </div>
    )
}

export default Main