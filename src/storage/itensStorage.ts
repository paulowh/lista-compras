import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from '@/types/FilterStatus';

const ITENS_STORAGE_KEY = '@listacompras:itens'

export type ItemStorage = {
    id: string, // sequencia de caracter randonica,
    status: FilterStatus,
    description: string,
}

// função base para consulta de dados
async function get(): Promise<ItemStorage[]> {
    try {
        const storage = await AsyncStorage.getItem(ITENS_STORAGE_KEY)

        return storage ? JSON.parse(storage) : []

    } catch (error) {
        throw new Error("ITEM_GET: " + error)
    }
}
// função base para salvar todos os dados
async function save(itens: ItemStorage[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITENS_STORAGE_KEY, JSON.stringify(itens))
    } catch (error) {
        throw new Error("ITEM_SAVE: " + error)
    }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
    const itens = await get() // []
    const updateItem = [...itens, newItem]

    await save(updateItem)
    return updateItem
}

async function getByFilter(statusFilter: FilterStatus) {
    const itens = await get() // ATIVO, DESATIVADO, ATIVO, ATIVO, DESATIVADO
    const itensFiltrados = itens.filter((item) => item.status === statusFilter)

    return itensFiltrados
}

async function clear() {
    try {
        await AsyncStorage.removeItem(ITENS_STORAGE_KEY)
    } catch (error) {
        throw new Error("ITEM_CLEAR: " + error)
    }
}

async function remove(id: string) {
    const items = await get()
    const updateItems = items.filter((item) => item.id !== id)
    await save(updateItems)

}

export const fnStorage = {
    add,
    get,
    getByFilter,
    clear,
    remove
}