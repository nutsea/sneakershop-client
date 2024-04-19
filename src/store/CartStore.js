import { makeAutoObservable } from 'mobx'

function mergeObjectsWithCount(arr) {
    const counts = {};

    arr.forEach(obj => {
        const key = JSON.stringify(obj);
        counts[key] = (counts[key] || 0) + 1;
    });

    const result = Object.entries(counts).map(([key, count]) => {
        const obj = JSON.parse(key);
        return { ...obj, count };
    });

    return result;
}

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
        let newCart = mergeObjectsWithCount(cartList)
        let countsOfItems = {}
        for (let i of cart) {
            let count = cartList.filter(item => item.id === i.id).length
            countsOfItems[i.id] = count
        }

        for (let i of newCart) {
            let same = cart.find(item => item.id === i.id)
            console.log(cart)
            if (same) {
                i.size = same[`size_${i.size_type}`]
                i.img = same.img
                i.price = same.price
                i.sale = same.sale
                i.name = same.name
            } else {
                let oldCart = JSON.parse(localStorage.getItem('cart'))
                oldCart = oldCart.filter(j => j.id !== i.id)
                localStorage.setItem('cart', JSON.stringify(oldCart))
            }
        }

        this._cart = newCart
        this._counts = countsOfItems
    }

    setCart(cart) {
        this._cart = cart
    }

    setCounts(counts) {
        this._counts = counts
    }
}