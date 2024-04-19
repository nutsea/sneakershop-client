import { $host } from '.'

export const fetchBrands = async () => {
    const { data } = await $host.get('api/item/allbrands')
    return data
}

export const fetchShoesRnd = async () => {
    const category = 'shoes'
    const { data } = await $host.get('api/item/rndcategory', { params: { category } })
    console.log(data)
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

export const fetchItems = async (category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet, search, sale, subcats) => {
    const { data } = await $host.get('api/item/all', { params: { category, brands, models, colors, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, priceMin, priceMax, sort, limit, page, in_stock, isModelsSet, isShoesSet, isClothesSet, search, sale, subcats } })
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

export const fetchImages = async (code) => {
    const { data } = await $host.get('api/image', { params: { code } })
    return data
}

export const fetchCart = async (idArr) => {
    if (idArr.length === 0) return []
    const formattedArr = idArr.map(item => {
        if (typeof item === 'string') {
            return item.replace(/\b(?:eu|ru|us|sm|clo)\b/g, '');
        } else {
            return item;
        }
    })
    console.log(formattedArr)
    const { data } = await $host.get('api/item/cart', { params: { idArr: formattedArr } })
    return data
}

export const fetchSearch = async (search) => {
    const { data } = await $host.get('api/item/search', { params: { search } })
    return data
}

export const createItem = async (sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category) => {
    const formData = new FormData()
    formData.append('sizes_count', sizes_count)
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('prices', JSON.stringify(prices))
    formData.append('sales', JSON.stringify(sales))
    formData.append('counts', JSON.stringify(counts))
    formData.append('sizes_eu', JSON.stringify(sizes_eu))
    formData.append('sizes_ru', JSON.stringify(sizes_ru))
    formData.append('sizes_us', JSON.stringify(sizes_us))
    formData.append('sizes_uk', JSON.stringify(sizes_uk))
    formData.append('sizes_sm', JSON.stringify(sizes_sm))
    formData.append('sizes_clo', JSON.stringify(sizes_clo))
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

export const createItemWithFiles = async (sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, files, tags, sub_category) => {
    return new Promise(async (resolve, reject) => {
        try {
            await createItem(sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category)
                .then(async (data) => {
                    let item_id = data[0].code
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

export const createSame = async (sizes_count, add_sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category, old_filename) => {
    const formData = new FormData()
    formData.append('sizes_count', sizes_count)
    formData.append('add_sizes_count', add_sizes_count)
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('prices', JSON.stringify(prices))
    formData.append('sales', JSON.stringify(sales))
    formData.append('counts', JSON.stringify(counts))
    formData.append('sizes_eu', JSON.stringify(sizes_eu))
    formData.append('sizes_ru', JSON.stringify(sizes_ru))
    formData.append('sizes_us', JSON.stringify(sizes_us))
    formData.append('sizes_uk', JSON.stringify(sizes_uk))
    formData.append('sizes_sm', JSON.stringify(sizes_sm))
    formData.append('sizes_clo', JSON.stringify(sizes_clo))
    formData.append('category', category)
    formData.append('model', model)
    formData.append('color', color)
    formData.append('tags', tags)
    formData.append('img', img)
    formData.append('sub_category', sub_category)
    formData.append('old_filename', old_filename)

    const { data } = await $host.post('api/item/createsame', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export const createSameWithFiles = async (sizes_count, add_sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, files, tags, sub_category, old_filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            await createItem(sizes_count, add_sizes_count, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category, old_filename)
                .then(async (data) => {
                    let item_id = data[0].code
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

export const deleteChosen = async (idArr) => {
    const { data } = await $host.delete('api/item/many', { params: { idArr } })
    return data
}

export const changeItem = async (sizes_count, ids, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category) => {
    const formData = new FormData()
    formData.append('sizes_count', sizes_count)
    formData.append('ids', JSON.stringify(ids))
    formData.append('code', code)
    formData.append('brand', brand)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('prices', JSON.stringify(prices))
    formData.append('sales', JSON.stringify(sales))
    formData.append('counts', JSON.stringify(counts))
    formData.append('sizes_eu', JSON.stringify(sizes_eu))
    formData.append('sizes_ru', JSON.stringify(sizes_ru))
    formData.append('sizes_us', JSON.stringify(sizes_us))
    formData.append('sizes_uk', JSON.stringify(sizes_uk))
    formData.append('sizes_sm', JSON.stringify(sizes_sm))
    formData.append('sizes_clo', JSON.stringify(sizes_clo))
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

export const changeItemWithFiles = async (sizes_count, ids, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, files, tags, sub_category) => {
    return new Promise(async (resolve, reject) => {
        try {
            await changeItem(sizes_count, ids, code, brand, name, description, prices, sales, counts, sizes_eu, sizes_ru, sizes_us, sizes_uk, sizes_sm, sizes_clo, category, model, color, img, tags, sub_category)
                .then(async (data) => {
                    let item_id = data[0].code
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
    const { data } = await $host.delete('api/image', { params: { toDelete } })
    return data
}