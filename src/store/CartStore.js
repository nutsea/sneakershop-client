import {makeAutoObservable} from 'mobx'

export default class CartStore {
    constructor() {
        this._cart = []
        this._counts = 0
        makeAutoObservable(this)
    }

    get cart() {
        return this._cart
    }

    get counts() {
        return this._counts
    }

    setCart(cart) {
        this._cart = cart
    }

    setCounts(counts) {
        this._counts = counts
    }
}