import { makeAutoObservable } from 'mobx'

export default class CartStore {
    constructor() {
        this._cart = []
        this._counts = 0
        this._cost = 0
        makeAutoObservable(this)
    }

    get cart() {
        return this._cart
    }

    get counts() {
        return this._counts
    }

    get cost() {
        return this._cost
    }

    setFullCart(cart, cartList) {
        this._cart = cart
        let countsOfItems = {}
        for (let i of cart) {
            let count = cartList.filter(item => item === i.id).length
            countsOfItems[i.id] = count
        }
        this._counts = countsOfItems
    }

    setCart(cart) {
        this._cart = cart
    }

    setCounts(counts) {
        this._counts = counts
    }
}