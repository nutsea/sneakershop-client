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

export const fetchItemsAdmin = async () => {
    const { data } = await $host.get('api/item/alladmin')
    return data
}

export const fetchItems = async (category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet, search, sale, sub_category) => {
    const { data } = await $host.get('api/item/all', { params: { category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet, search, sale, sub_category } })
    return data
}

export const fetchNews = async () => {
    const { data } = await $host.get('api/item/news')
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
    if (idArr.length === 0) return []
    const { data } = await $host.get('api/item/cart', { params: { idArr } })
    return data
}

export const fetchSearch = async (search) => {
    const { data } = await $host.get('api/item/search', { params: { search } })
    return data
}

export const createItem = async (code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, tags, sub_category) => {
    const formData = new FormData()
    console.log(sale)
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', Number(price))
    formData.append('sale', Number(sale))
    formData.append('count', Number(count))
    formData.append('size_eu', Number(size_eu))
    formData.append('size_ru', Number(size_ru))
    formData.append('size_us', Number(size_us))
    formData.append('size_uk', Number(size_uk))
    formData.append('size_sm', Number(size_sm))
    formData.append('size_clo', size_clo)
    formData.append('category', category)
    formData.append('model', model)
    formData.append('color', color)
    formData.append('tags', tags)
    formData.append('img', img)
    formData.append('sub_category', sub_category)

    const { data } = await $host.post('api/item', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export const createItemWithFiles = async (code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, files, tags, sub_category) => {
    return new Promise(async (resolve, reject) => {
        try {
            await createItem(code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, tags, sub_category)
                .then(async (data) => {
                    let item_id = data.id
                    const formData = new FormData()
                    formData.append('item_id', item_id)

                    console.log(img)
                    for (let i of files) {
                        formData.append('img', i)
                    }

                    const { data: data2 } = await $host.post('api/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    resolve(data2)
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const deleteChosen = async (idArr) => {
    const { data } = await $host.delete('api/item/many', { params: { idArr } })
    return data
}

export const changeItem = async (id, code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, tags, sub_category) => {
    const formData = new FormData()
    console.log(sale)
    formData.append('id', id)
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', Number(price))
    formData.append('sale', Number(sale))
    formData.append('count', Number(count))
    formData.append('size_eu', Number(size_eu))
    formData.append('size_ru', Number(size_ru))
    formData.append('size_us', Number(size_us))
    formData.append('size_uk', Number(size_uk))
    formData.append('size_sm', Number(size_sm))
    formData.append('size_clo', size_clo)
    formData.append('category', category)
    formData.append('model', model)
    formData.append('color', color)
    formData.append('tags', tags)
    formData.append('img', img)
    formData.append('sub_category', sub_category)

    const { data } = await $host.post('api/item/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export const changeItemWithFiles = async (id, code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, files, tags, sub_category) => {
    console.log(files)
    return new Promise(async (resolve, reject) => {
        try {
            await changeItem(id, code, brand, name, description, price, sale, count, size_eu, size_ru, size_us, size_uk, size_sm, size_clo, category, model, color, img, tags, sub_category)
                .then(async (data) => {
                    let item_id = data.id
                    const formData = new FormData()
                    formData.append('item_id', item_id)

                    for (let i of files) {
                        formData.append('img', i)
                    }

                    const { data: data2 } = await $host.post('api/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    resolve(data2)
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const destroyImages = async (toDelete) => {
    console.log(toDelete)
    const { data } = await $host.delete('api/image', { params: { toDelete } })
    return data
}