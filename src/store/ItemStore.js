import {makeAutoObservable} from 'mobx'

export default class ItemStore {
    constructor() {
        this._items = []
        this._min = 0
        this._max = 1000000000
        this._brandsSet = []
        this._modelsSet = []
        this._colorsSet = []
        this._sizesSet = {}
        this._clothesSizesSet = []
        this._page = 1
        this._limit = 18
        this._count = 0
        makeAutoObservable(this)
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get items() {
        return this._items
    }

    get count() {
        return this._count
    }

    get min() {
        return this._min
    }

    get max() {
        return this._max
    }

    get brandsSet() {
        return this._brandsSet
    }

    get modelsSet() {
        return this._modelsSet
    }

    get colorsSet() {
        return this._colorsSet
    }

    get sizesSet() {
        return this._sizesSet
    }

    get clothesSizesSet() {
        return this._clothesSizesSet
    }

    setItems(items) {
        console.log(items)
        this._items = items
    }

    setMin(min) {
        this._min = min
    }

    setMax(max) {
        this._max = max
    }

    setBrandsSet(brands) {
        this._brandsSet = brands
    }

    setModelsSet(models) {
        this._modelsSet = models
    }

    setColorsSet(colors) {
        this._colorsSet = colors
    }

    setSizesSet(sizes) {
        this._sizesSet = sizes
    }

    setClothesSizesSet(sizes) {
        this._clothesSizesSet = sizes
    }

    setPage(page) {
        this._page = page
    }

    setCount(count) {
        this._count = count
    }
}