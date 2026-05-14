import { View, Image, TouchableOpacity, Text, FlatList, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import { Item } from '@/components/Item';
import { Input } from '@/components/Input/index';
import { Filter } from '@/components/Filter';
import { Button } from '@/components/Button'


import { style } from './style';
import { FilterStatus } from '@/types/FilterStatus';
import { ItemStorage, fnStorage } from '@/storage/itensStorage';

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export default function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING)
  const [description, setDescription] = useState('')
  const [itens, setItens] = useState<ItemStorage[]>([])

  async function fnAdicionarItem() {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.")
    }

    const newItem = {
      id: Math.random().toString(36),
      description: description,
      status: FilterStatus.PENDING
    }

    const responseStorage = await fnStorage.add(newItem)

    // Alert.alert("Adicionado", `O item ${description} foi adicionado!`)
    setItens(responseStorage)

    setDescription('')

  }
  async function itemByFilter() {
    try {
      const response = await fnStorage.getByFilter(filter)
      setItens(response)

    } catch (error) {
      Alert.alert("Error", "Não foi possivel filtrar os itens")
    }
  }

  function fnClear() {
    Alert.alert("Limpar", "Deseja limpar todos os itens?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => { fnStorage.clear(); setItens([]) } },
    ])
  }

  async function fnRemoveItem(id: string) {
    await fnStorage.remove(id)
    itemByFilter()
  }

  useEffect(() => {
    itemByFilter()
    console.log("Estou dentro do useEffect")
  }, [filter])

  return (
    <View style={style.container}>
      <Image source={require('@/assets/logo.png')} style={style.logo} />

      <View style={style.form}>
        <Input
          placeholder='O que você precisa comprar?'
          onChangeText={setDescription}
          value={description}
        />

        <Button title="Adicionar" onPress={fnAdicionarItem} />
      </View>

      <View style={style.content}>
        <View style={style.header}>

          {/* pendente, comprado */}
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}

            />
          ))}

          <TouchableOpacity style={style.clearButton} onPress={fnClear}>
            <Text style={style.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* os itens estão aqui !!! */}
        <FlatList
          data={itens}
          renderItem={({ item }) => (
            <Item data={item}
              onRemove={() => fnRemoveItem(item.id)}
            />
          )}
          ListEmptyComponent={() =>
            <Text style={style.empty}>Nenhum item encontrado!</Text>
          }
          ItemSeparatorComponent={() => <View style={style.separator} />}
          contentContainerStyle={style.listContent}
          showsVerticalScrollIndicator={false}
        />

      </View>

    </View >
  );
}


