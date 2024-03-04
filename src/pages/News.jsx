import React, { useContext, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import '../styles/Catalogue.scss'

import { fetchNews } from "../http/itemAPI"
import { Context } from ".."

const News = observer(() => {
    const { catalogue } = useContext(Context)
    const navigate = useNavigate()


    const navigateItem = (id) => {
        navigate(`/item/${id}`)
    }

    function capitalizeWords(sentence) {
        return sentence
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const hasNotNull = (arr) => {
        for (let i of arr) {
            if (i !== 0) {
                return true
            }
        }
        return false
    }

    function formatNumberWithSpaces(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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


    const findItems = () => {
        fetchNews().then(data => {
            catalogue.setItems(data.rows)
            catalogue.setCount(data.count)
        })
    }

    useEffect(() => {
        findItems()
        // eslint-disable-next-line
    }, [])


    return (
        <div className="MainContainer">
            <div className="CatalogueTop">
                <h2 style={{ marginTop: 0, marginBottom: 20, fontWeight: 500 }}>Новинки</h2>
            </div>
            <div className="CatalogueItems2" style={{ marginTop: -60 }}>
                <div className="CatalogueItems">
                    {catalogue.items && catalogue.items.length === 0 &&
                        <div className="CatalogueNotFound">Товары не найдены</div>
                    }
                    {catalogue.items && catalogue.items.map(item => {
                        return (
                            <div key={item.id[0]} className="CatalogueCard" onClick={() => navigateItem(item.id[0])}>
                                <div className={`CatalogueImg H20`}><img src={`${process.env.REACT_APP_API_URL + item.img[0]}`} alt="" /></div>
                                <div className={`ItemSale ${item.sale[0] ? '' : 'Invisible'}`}>Sale</div>
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
            </div>
        </div>
    )
})

export default News;