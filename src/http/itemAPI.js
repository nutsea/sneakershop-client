import { $host } from '.'

export const fetchBrands = async () => {
    const { data } = await $host.get('api/item/allbrands')
    return data
}

export const fetchShoesRnd = async () => {
    const category = 'shoes'
    const { data } = await $host.get('api/item/rndcategory', { params: { category } })
    return data
}

export const fetchClothesRnd = async () => {
    const category = 'clothes'
    const { data } = await $host.get('api/item/rndcategory', { params: { category } })
    return data
}

export const fetchAccessoriesRnd = async () => {
    const category = 'accessories'
    const { data } = await $host.get('api/item/rndcategory', { params: { category } })
    return data
}

export const fetchBrandsCategory = async (category) => {
    const { data } = await $host.get('api/item/brands', { params: { category } })
    return data
}

export const fetchModels = async () => {
    const { data } = await $host.get('api/item/models')
    return data
}

export const fetchSizesCategory = async () => {
    const { data } = await $host.get('api/item/sizes')
    return data
}

export const fetchColorsCategory = async (category) => {
    const { data } = await $host.get('api/item/colors', { params: { category } })
    return data
}

export const fetchShoes = async (brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, priceMin, priceMax, sort, limit, page, in_stock) => {
    const { data } = await $host.get('api/item/allshoes', { params: { brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, priceMin, priceMax, sort, limit, page, in_stock } })
    return data
}

export const fetchItems = async (category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet) => {
    const { data } = await $host.get('api/item/all', { params: { category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet } })
    return data
}

export const fetchItem = async (id) => {
    const { data } = await $host.get(`api/item/one/${id}`)
    return data
}

export const fetchSame = async (code) => {
    const { data } = await $host.get('api/item/same', { params: { code } })
    return data
}

export const fetchImages = async (id) => {
    const { data } = await $host.get('api/image', { params: { id } })
    return data
}

export const fetchCart = async (idArr) => {
    const { data } = await $host.get('api/item/cart', { params: { idArr } })
    return data
}

export const fetchSearch = async (search) => {
    const { data } = await $host.get('api/item/search', { params: { search } })
    return data
}