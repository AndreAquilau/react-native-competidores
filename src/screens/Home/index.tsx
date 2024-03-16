import React, { useEffect, useState } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { executeSQLQueryString, getCompetidores } from '../../db/db';
import Competidor from '../../interfaces/competidor-interface';


export function HomeScreen({ route, navigation } : any) {



  // const [competitores, setCompetitors] = useState<Array<Competidor>>([]);
  
  const [competitors, setCompetitors] = React.useState<Competidor[]>([]);
  
  const fetchCompetitors = async () => {
    //await executeSQLQueryString(``);

    const dados = await getCompetidores();

    if(dados.length > 0)
    {
      console.log(dados);
      console.log(dados[0].id)
      console.log(dados[0]);
      setCompetitors([...dados]);
    }

  };

  console.log(route.params);

  if(route.params)
  {
    if(route.params['id'])
    {
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
            <Button title="Editar" onPress={() => { }} />
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
  },
  container: {
    // flex: 1,
    padding: 5,
    // justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});