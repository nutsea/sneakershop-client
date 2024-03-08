import './styles/base.scss'
import './styles/App.scss'

import { PiTrashSimpleLight } from "react-icons/pi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CiSearch, CiShoppingCart } from "react-icons/ci"
import { IoIosArrowUp } from "react-icons/io";
import { TfiClose } from "react-icons/tfi"
import { useContext, useEffect, useState } from "react"
import { fetchBrands, fetchCart, fetchSearch } from "./http/itemAPI"
import AppRoutes from "./AppRoutes"
import { useNavigate } from "react-router-dom"
import { Context } from '.';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
  const [brands, setBrands] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [scrollPos, setScrollPos] = useState(0)
  const [isTop, setIsTop] = useState(true)
  const [search, setSearch] = useState('')
  const [searched, setSearched] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [clientName, setClientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [sendNumber, setSendNumber] = useState('')
  const [orderDone, setOrderDone] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCost, setCartCost] = useState(null)

  const navigate = useNavigate()
  const { cartItems } = useContext(Context)

  const handleNavigate = (e) => {
    navigate(e.target.id)
    hideSearch()
    document.querySelector('.HeaderBurger').classList.remove('ActiveBurger')
    document.querySelector('.AppContent').classList.remove('Lock')
    window.scrollTo(0, scrollPos)
    document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
    document.querySelector('.BurgerMenu').classList.remove('ActiveBurgerMenu')
    document.querySelector('.OrderItemModal')?.classList.remove('VisibleOrderItem')
    document.querySelector('.OrderItemModal')?.setAttribute('style', `top: 0`)
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


  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchSearch(e.target.value).then(data => {
      setSearched(data)
    })
    if (e.key === 'Enter') {
      navigate(`/catalogue/all/all/${search}`)
      hideSearch()
      document.querySelector('.HeaderBurger').classList.remove('ActiveBurger')
      document.querySelector('.AppContent').classList.remove('Lock')
      window.scrollTo(0, scrollPos)
      document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
      document.querySelector('.BurgerMenu').classList.remove('ActiveBurgerMenu')
      document.querySelector('.OrderItemModal')?.classList.remove('VisibleOrderItem')
      document.querySelector('.OrderItemModal')?.setAttribute('style', `top: 0`)
    }
  }

  const navResult = (id) => {
    navigate(`/item/${id}`)
    hideSearch()
    document.querySelector('.HeaderBurger').classList.remove('ActiveBurger')
    document.querySelector('.AppContent').classList.remove('Lock')
    window.scrollTo(0, scrollPos)
    document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
    document.querySelector('.BurgerMenu').classList.remove('ActiveBurgerMenu')
    document.querySelector('.OrderItemModal')?.classList.remove('VisibleOrderItem')
    document.querySelector('.OrderItemModal')?.setAttribute('style', `top: 0`)
  }

  const convertToCapital = (word) => {
    return word ? word.toUpperCase() : ""
  }

  const alphabetSort = (array) => {
    return array.sort((a, b) => a.brand.localeCompare(b.brand, 'en', { sensitivity: 'base' }))
  }

  const checkIsTop = () => {
    const url = window.location.href.split('/')
    if (window.scrollY > 0 && url[3] !== 'admin') setIsTop(false)
    else setIsTop(true)
  }

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)
  }

  function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  const showBrandsTab = () => {
    let delimiter = Math.ceil(windowWidth / 300)
    let maxHeight = Math.ceil(brands.length / delimiter) * 26.68
    if (brands.length > 0) {
      if (maxHeight < windowHeight - 70 - 80) {
        document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${maxHeight}px; flex-wrap: wrap; transform: translateY(0px)`)
      } else {
        document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${windowHeight - 70 - 80}px; flex-wrap: nowrap; transform: translateY(0px)`)
      }
    } else {
      document.querySelector('.BrandsTab').setAttribute('style', `max-height: fit-content; flex-wrap: wrap; transform: translateY(-70px)`)
    }
  }

  const hideBrandsTab = () => {
    let delimiter = Math.ceil(windowWidth / 300)
    let maxHeight = Math.ceil(brands.length / delimiter) * 26.68
    if (maxHeight < windowHeight - 70 - 80) {
      document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${maxHeight}px; flex-wrap: wrap; transform: translateY(-${maxHeight + 80}px)`)
    } else {
      document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${windowHeight - 70 - 80}px; flex-wrap: nowrap; transform: translateY(-${windowHeight - 70}px)`)
    }
  }

  const showInfoTab = () => {
    document.querySelector('.InfoTab').setAttribute('style', `transform: translateY(0px)`)
  }

  const hideInfoTab = () => {
    document.querySelector('.InfoTab').setAttribute('style', `transform: translateY(-214px)`)
  }

  const showCart = () => {
    document.querySelector('.CartContainer').classList.remove('Opacity0')
    document.querySelector('.CartContainer').setAttribute('style', 'z-index: 11; background-color: rgb(21, 21, 21, 0.3); backdrop-filter: blur(5px);')
    document.querySelector('.CartBlock').setAttribute('style', 'transform: translateX(0);')
    setScrollPos(window.scrollY)
    document.querySelector('.AppContent').setAttribute('style', `transform: translateY(-${window.scrollY}px)`)
    document.querySelector('.AppContent').classList.add('Lock')
    document.querySelector('.OrderItemModal')?.classList.remove('VisibleOrderItem')
    document.querySelector('.OrderItemModal')?.setAttribute('style', `top: 0`)
  }

  const showSearch = () => {
    document.querySelector('.SearchContainer').classList.remove('Opacity0')
    document.querySelector('.SearchContainer').setAttribute('style', 'z-index: 11; background-color: rgb(21, 21, 21, 0.3); backdrop-filter: blur(5px);')
    document.querySelector('.SearchBlock').setAttribute('style', 'transform: translateY(0);')
    setScrollPos(window.scrollY)
    document.querySelector('.AppContent').setAttribute('style', `transform: translateY(-${window.scrollY}px)`)
    document.querySelector('.AppContent').classList.add('Lock')
    setIsSearch(true)
  }

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const hideCart = (e) => {
    if (e.target.id !== 'cart') {
      setIsOrdering(false)
      if (orderDone) {
        localStorage.removeItem('cart')
        cartItems.setCart([])
        cartItems.setCounts({})
        setIsOrdering(false)
        setOrderDone(false)
      }
      document.querySelector('.CartContainer').setAttribute('style', 'z-index: 11; background-color: transparent; backdrop-filter: blur(0);')
      document.querySelector('.CartBlock').setAttribute('style', 'transform: translateX(100vw);')
      document.querySelector('.AppContent').classList.remove('Lock')
      window.scrollTo(0, scrollPos)
      document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
      setTimeout(() => {
        document.querySelector('.CartContainer').setAttribute('style', 'z-index: -1000; background-color: transparent; backdrop-filter: blur(0);')
        document.querySelector('.CartContainer').classList.add('Opacity0')
      }, 334)
    }
  }

  const hideSearch = (e) => {
    if (!e || e.target.id !== 'search') {
      document.querySelector('.SearchContainer').setAttribute('style', 'z-index: 11; background-color: transparent; backdrop-filter: blur(0);')
      document.querySelector('.SearchBlock').setAttribute('style', 'transform: translateY(-280px);')
      document.querySelector('.AppContent').classList.remove('Lock')
      window.scrollTo(0, scrollPos)
      document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
      setTimeout(() => {
        document.querySelector('.SearchContainer').setAttribute('style', 'z-index: -1000; background-color: transparent; backdrop-filter: blur(0);')
        document.querySelector('.SearchContainer').classList.add('Opacity0')
      }, 334)
      setIsSearch(false)
    }
  }

  const handleOrder = () => {
    setOrderDone(true)
  }

  useEffect(() => {
    const url = window.location.href.split('/')
    if (url[3] === 'admin') setIsAdmin(true)
    else setIsAdmin(false)

    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('scroll', checkIsTop)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('scroll', checkIsTop)
    }
  }, [])

  const countsSum = () => {
    let sum = 0
    for (let key in cartItems.counts) {
      sum += cartItems.counts[key]
    }
    return sum
  }

  const countPlus = (id) => {
    let count = cartItems.counts[id]
    cartItems.setCounts({ ...cartItems.counts, [id]: count + 1 })
    const cartList = JSON.parse(localStorage.getItem('cart'))
    if (Array.isArray(cartList)) {
      cartList.push(id)
      localStorage.setItem('cart', JSON.stringify(cartList))
    } else {
      localStorage.setItem('cart', JSON.stringify([id]))
    }
  }

  const countMinus = (id) => {
    let count = cartItems.counts[id]
    if (count > 1) {
      cartItems.setCounts({ ...cartItems.counts, [id]: count - 1 })
      const cartList = JSON.parse(localStorage.getItem('cart'))
      if (Array.isArray(cartList)) {
        let index = cartList.indexOf(id)
        cartList.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(cartList))
      }
    }
  }

  const deleteFromCart = (id) => {
    console.log(id)
    let cartList = JSON.parse(localStorage.getItem('cart'))
    if (Array.isArray(cartList) && cartList.length > 0) {
      cartList = cartList.filter(item => item !== id)
      localStorage.setItem('cart', JSON.stringify(cartList))
      fetchCart(cartList).then(data => {
        cartItems.setFullCart(data, cartList)
        let countsOfItems = {}
        let sum = 0
        for (let key in countsOfItems) {
          let item = data.filter(i => i.id === Number(key))
          if (item[0])
            sum += item[0].sale ? item[0].sale * countsOfItems[key] : item[0].price * countsOfItems[key]
        }
        if (sum > 0) {
          if (document.querySelector('.CartCostSpan'))
            document.querySelector('.CartCostSpan').innerHTML = sum + ' ₽'
        } else {
          if (document.querySelector('.CartCostSpan'))
            document.querySelector('.CartCostSpan').innerHTML = ' '
        }
      })
    } else {
      if (document.querySelector('.CartCostSpan'))
        document.querySelector('.CartCostSpan').innerHTML = ' '
    }
  }

  const cartItemsSum = () => {
    let sum = 0
    for (let key in cartItems.counts) {
      let item = cartItems.cart.filter(i => i.id === Number(key))
      if (item[0])
        sum += item[0].sale ? item[0].sale * cartItems.counts[key] : item[0].price * cartItems.counts[key]
    }
    return formatNumberWithSpaces(sum)
  }

  useEffect(() => {
    if (brands.length > 0) {
      let delimiter = Math.ceil(windowWidth / 300)
      let maxHeight = Math.ceil(brands.length / delimiter) * 26.68
      if (maxHeight < windowHeight - 70 - 80) {
        document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${maxHeight}px; flex-wrap: wrap; transform: translateY(-${maxHeight + 80}px)`)
      } else {
        document.querySelector('.BrandsTab').setAttribute('style', `max-height: ${windowHeight - 70 - 80}px; flex-wrap: nowrap; transform: translateY(-${windowHeight - 70}px)`)
      }
    }
    // eslint-disable-next-line
  }, [windowWidth, windowHeight, brands.length])

  useEffect(() => {
    const cartList = JSON.parse(localStorage.getItem('cart'))
    if (Array.isArray(cartList) && cartList.length > 0) {
      fetchCart(cartList).then(data => {
        cartItems.setFullCart(data, cartList)
        let countsOfItems = {}
        for (let i of data) {
          let count = cartList.filter(item => item === i.id).length
          countsOfItems[i.id] = count
        }
        let sum = 0
        for (let key in countsOfItems) {
          let item = data.filter(i => i.id === Number(key))
          if (item[0])
            sum += item[0].sale ? item[0].sale * countsOfItems[key] : item[0].price * countsOfItems[key]
        }
        setCartCost(sum)
      })
    }
    document.querySelector('.InfoTab').setAttribute('style', `transform: translateY(-214px)`)
    document.querySelector('.BrandsTab').setAttribute('style', `max-height: fit-content; flex-wrap: wrap; transform: translateY(-224px)`)
    fetchBrands().then(data => {
      setBrands(alphabetSort(data))
    })
    // eslint-disable-next-line
  }, [])

  const handleBurger = () => {
    document.querySelector('.HeaderBurger').classList.toggle('ActiveBurger')
    if (document.querySelector('.HeaderBurger').classList.contains('ActiveBurger')) {
      setScrollPos(window.scrollY)
      document.querySelector('.AppContent').setAttribute('style', `transform: translateY(-${window.scrollY}px)`)
      document.querySelector('.AppContent').classList.add('Lock')
      document.querySelector('.BurgerMenu').classList.add('ActiveBurgerMenu')
    } else {
      document.querySelector('.AppContent').classList.remove('Lock')
      window.scrollTo(0, scrollPos)
      document.querySelector('.AppContent').setAttribute('style', 'transform: translateY(0)')
      document.querySelector('.BurgerMenu').classList.remove('ActiveBurgerMenu')
    }
  }

  return (
    <div className="App">
      <>
        <header className="AppHeader">
          <div className="HeaderLogo" id='/' onClick={handleNavigate}>EV</div>
          <nav className="HeaderNav PCNav">
            <li id='/news' onClick={handleNavigate}>НОВИНКИ</li>
            <li
              onMouseEnter={showBrandsTab}
              onMouseLeave={hideBrandsTab}
            >
              БРЕНДЫ
            </li>
            <li id="/catalogue/shoes" onClick={handleNavigate}>ОБУВЬ</li>
            <li id="/catalogue/clothes" onClick={handleNavigate}>ОДЕЖДА</li>
            <li id="/catalogue/accessories" onClick={handleNavigate}>АКСЕССУАРЫ</li>
            <li className='HeaderLiRed' id='/catalogue/all/all/all/sale' onClick={handleNavigate}>SALE</li>
          </nav>
          <div className="HeaderBtns">
            <div className="HeaderBtn" onClick={showSearch}><CiSearch size={30} /></div>
            <div className='HeaderBurger' onClick={handleBurger}><span></span></div>
            <div className="HeaderBtn PCCart" style={{ marginLeft: 16 }} onClick={showCart}>
              <CiShoppingCart size={30} />
              <div className="CartCount">{cartItems.counts && countsSum()}</div>
            </div>
          </div>
          <div className='BurgerMenu'>
            <nav className="HeaderBurgerNav">
              <li id='/news' onClick={handleNavigate}>НОВИНКИ</li>
              <li
                onMouseEnter={showBrandsTab}
                onMouseLeave={hideBrandsTab}
              >
                БРЕНДЫ
              </li>
              <li id="/catalogue/shoes" onClick={handleNavigate}>ОБУВЬ</li>
              <li id="/catalogue/clothes" onClick={handleNavigate}>ОДЕЖДА</li>
              <li id="/catalogue/accessories" onClick={handleNavigate}>АКСЕССУАРЫ</li>
              <li className='HeaderLiRed' id='/catalogue/all/all/all/sale' onClick={handleNavigate}>SALE</li>
            </nav>
          </div>
        </header>
        <div
          className="BrandsTab"
          onMouseEnter={showBrandsTab}
          onMouseLeave={hideBrandsTab}
        >
          {brands.length > 0 ?
            <>
              {brands.length > 0 && brands.map((brand, i) =>
                <div key={i} className="BrandBtn" id={`/catalogue/all/${brand.brand}`} onClick={handleNavigate}>{convertToCapital(brand.brand)}</div>
              )}
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
        </div>
        <div
          className="InfoTab"
          onMouseEnter={showInfoTab}
          onMouseLeave={hideInfoTab}
        >
          <div className="InfoBtn">КОНТАКТЫ</div>
          <div className="InfoBtn">ДОСТАВКА</div>
          <div className="InfoBtn">ОПЛАТА</div>
          <div className="InfoBtn">ВОЗВРАТ</div>
          <div className="InfoBtn">FAQ</div>
        </div>
        <div className="SearchContainer" onClick={hideSearch}>
          <div className='SearchBlock'>
            <div className='SearchBox' id='search'>
              <input type="text" className="SearchInput" placeholder="Поиск" autoComplete='off' value={search} onChange={handleSearch} onKeyDown={handleSearch} id='search' />
              <div className="SearchBtn" id={`/catalogue/all/all/${search}`} onClick={handleNavigate}><CiSearch style={{ marginRight: 5, pointerEvents: 'none' }} size={30} /></div>
              {searched.length > 0 &&
                <div className={`SearchResults ${isSearch ? '' : 'None'}`} id='search'>
                  {searched.map((item, i) => {
                    return (
                      // <div key={i} className='SearchResult' onClick={() => navigate(`/item/${item.id}`)}>
                      <div key={i} className='SearchResult' onClick={() => navResult(item.id)}>
                        <div className='SearchImg'>
                          <img src={process.env.REACT_APP_API_URL + item.img} alt="item" />
                        </div>
                        <div className='SearchInfo'>
                          <div className='SearchName'>{item.name.toUpperCase()}</div>
                          <div className='SearchPrice'>от {item.sale ? formatNumberWithSpaces(item.sale) : formatNumberWithSpaces(item.price)} ₽</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>
          </div>
        </div>
        <div
          className="CartContainer Opacity0"
          onClick={hideCart}
        >
          <div className="CartBlock" id="cart">
            <div className="CartTop" id="cart">
              <div className="CartSub" id="cart">КОРЗИНА</div>
              <div className="HeaderBtn"><TfiClose size={30} /></div>
            </div>
            {cartItems.cart ? (
              cartItems.cart.length > 0 ?
                <>
                  {!isOrdering ?
                    <>
                      <div id="cart" className='ScrollCart'>
                        {cartItems.cart.map((item, i) => {
                          return (
                            <div key={i} className='CartItem' id="cart">
                              <div className='CartImg' id="cart">
                                <img src={process.env.REACT_APP_API_URL + item.img} alt="item" id="cart" />
                              </div>
                              <div className='CartInfo' id="cart">
                                <div className='CartName' id="cart">{item.name.toUpperCase()}</div>
                                <div className='CartSize2' id="cart">{item.size_ru ? `RU ${item.size_ru}` : (item.size_clo ? item.size_clo.toUpperCase() : '')}</div>
                                <div className='CartItemCount' id="cart">
                                  <div className='CartPlus' id="cart" onClick={() => countMinus(item.id)}>
                                    <AiOutlineMinus size={20} style={{ pointerEvents: 'none' }} />
                                  </div>
                                  <span className='CartDigit' id="cart">{cartItems.counts[item.id]}</span>
                                  <div className='CartMinus' id="cart" onClick={() => countPlus(item.id)}>
                                    <AiOutlinePlus size={20} style={{ pointerEvents: 'none' }} />
                                  </div>
                                </div>
                              </div>
                              <div className='CartSize' id="cart">{item.size_ru ? `RU ${item.size_ru}` : (item.size_clo ? item.size_clo.toUpperCase() : '')}</div>
                              <div className='CartItemEnd' id='cart'>
                                <div className='CartCost' id="cart">{item.sale ? formatNumberWithSpaces(cartItems.counts[item.id] * item.sale) : formatNumberWithSpaces(cartItems.counts[item.id] * item.price)} ₽</div>
                                <div className='ItemDelete' id='cart' onClick={() => deleteFromCart(item.id)}><PiTrashSimpleLight size={24} style={{ pointerEvents: 'none' }} /></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className='CartOrder' id='cart'>
                        <div className='CartSum' id='cart'>Итого: <span id='cart'>{cartItemsSum()} ₽</span></div>
                        <div className='CartSend' id='cart' onClick={() => setIsOrdering(true)}>ОФОРМИТЬ ЗАКАЗ</div>
                      </div>
                    </>
                    : (!orderDone) ?
                      <div className='OrderingCart' id='cart'>
                        <div className='OrderTitle' id='cart'>Оформление заказа</div>
                        <input className='OrderInput' id='cart' type="text" placeholder='ФИО' value={clientName} onChange={handleName} />
                        <div className='OrderInput' id='cart'>
                          <span id='cart'>+7</span>
                          <input
                            id='cart'
                            type="text"
                            placeholder='(999) 999-99-99'
                            maxLength="15"
                            value={phoneNumber}
                            onChange={(e) => {
                              // handlePhoneChange(e)
                              handlePhone(e)
                            }}
                            onKeyDown={handleBackspace}
                          />
                        </div>
                        <button className={`OrderConfirm ${clientName.length > 0 && sendNumber.length === 11 ? '' : 'NonActiveOrder'}`} id='cart' onClick={handleOrder}>Отправить</button>
                      </div>
                      :
                      <>
                        <div className='OrderingCart' id='cart'>
                          <div className='OrderTitle' id='cart'>Ваш заказ оформлен!</div>
                          <button className='OrderConfirm'>Вернуться к покупкам</button>
                        </div>
                      </>
                  }
                </>
                :
                <div className='CartIsEmpty'>Корзина пуста</div>
            )
              :
              <div className="LoadingContainer2" id="cart">
                <div className="Spinner" id="cart">
                  <div className="Ball" id="cart"></div>
                  <p className="Loading" id="cart">ЗАГРУЗКА...</p>
                </div>
              </div>
            }
          </div>
        </div>
        {!isAdmin &&
          <div className="MobileCartBtnBox">
            <button className="MobileCartBtn" onClick={showCart}>
              <CiShoppingCart size={34} />
              <span className='CartCostSpan'>{cartCost ? formatNumberWithSpaces(cartCost) + ' ₽' : ''}</span>
            </button>
          </div>
        }
        <div className="AppContent">
          <AppRoutes />
          <footer></footer>
        </div>
        <div className={`GoToTop ${isTop ? 'InvisibleTop' : ''}`} onClick={handleTop}><IoIosArrowUp size={20} style={{ marginBottom: 2 }} /></div>
      </>
    </div>
  );
})

export default App;
