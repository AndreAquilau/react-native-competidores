import React, { useEffect, useState } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { executeSQLQueryString, getCompetidorByName, getCompetidores } from '../../db/db';
import Competidor from '../../interfaces/competidor-interface';
import { TypeMode } from '../Competidor';


export function HomeScreen({ route, navigation }: any) {

  // const [competitores, setCompetitors] = useState<Array<Competidor>>([]);

  const [competitors, setCompetitors] = React.useState<Competidor[]>([]);
  const [nomeCompedidorBuscar, setNomeCompedidorBuscar] = React.useState('');

  const fetchCompetitors = async () => {
    //await executeSQLQueryString(``);

    const dados = await getCompetidores();

    if (dados.length > 0) {
      console.log(dados[0]);
      setCompetitors([...dados]);
    }

  };

  const pesquisarCompeditor = () => {
    getCompetidorByName(nomeCompedidorBuscar)
    .then(data => {
      console.log(data);
      if (data.length > 0) {
        console.log(data[0]);
        setCompetitors([...data]);
      }
    })
  }

  if (route.params) {
    if (route.params['id']) {
      getCompetidores().then((dados) => setCompetitors([...dados]));
      // descartando id
      const { id, ...params } = route.params;
      route.params = params;
    }
  }

  React.useEffect(() => {
    fetchCompetitors();
  }, []);

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite o nome do competidor"
        value={nomeCompedidorBuscar}
        onChangeText={(value) => setNomeCompedidorBuscar(value)}
        style={styles.input}
      />
      <Button title="Pesquisar por Nome" onPress={() => pesquisarCompeditor()} color={'#008000'} />
      <Separator />
      <Button title="Limpar Filtro" onPress={async () => { setNomeCompedidorBuscar(''); await fetchCompetitors() }} color={'#265369'} />
      {competitors.length === 0 && <Text>Sem competidores cadastrados</Text>}

      <FlatList
        data={competitors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.card}>
            <Text>Nome: {item.primeiroNome} {item.segundoNome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Telefone: {item.telefone}</Text>
            <Text>Endereço: {item.logradouro}, {item.numero}, {item.bairro}, {item.localidade}</Text>
            <Separator />
            <Button title="Editar" onPress={() => navigation.navigate('Competidor', { mode: 'View' as TypeMode, id: item.id })} />
          </View>
        }
      />
    </View>
  );
}



const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchIcon: {
      padding: 10,
  },
  container: {
      // flex: 1,
      padding: 5,
      // justifyContent: 'center',
  },
  input: {
      height: 60,
      borderColor: '#ccc',
      borderWidth: 1,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 10,
      borderRadius: 8,
      fontSize: 16,
  },
  inputError: {
      height: 60,
      borderColor: '#ccc',
      borderWidth: 1,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 10,
      borderRadius: 8,
      fontSize: 16,
  },
  button: {
      backgroundColor: 'green',
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 12,
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },
  error: {
      color: 'red',
      fontSize: 12,
      paddingHorizontal: 10,
  },
});
