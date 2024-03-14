import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-svg';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import axios from 'axios';

interface Competidor {
    primeiroNome: string;
    segundoNome: string;
    email: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    localidade: string;
    uf: string;
}

export function CompetidorScreen({ navigation }: any) {

    const [competidor, setCompetidor] = useState<Competidor>({
        primeiroNome: '',
        segundoNome: '',
        email: '',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        localidade: '',
        uf: '',
    });

    const handleChangeText = (name: string, value: string) => {
        setCompetidor({ ...competidor, [name]: value });
    };

    const getAddress = () => {

        console.log(competidor.cep.length);

        if(competidor.cep.length === 8)
        {
            axios.get(`https://viacep.com.br/ws/${competidor.cep}/json/`)
            .then((response) => {

                console.log(response.status);

                if(!response.data['erro'])
                {
                    competidor.cep = response.data['cep'].replace(/[^0-9]/g, '') ?? competidor.cep;
                    competidor.logradouro = response.data['logradouro'] ?? competidor.logradouro;
                    competidor.bairro = response.data['bairro'] ?? competidor.bairro;
                    competidor.localidade = response.data['localidade'] ?? competidor.localidade;
                    competidor.uf = response.data['uf'] ?? competidor.uf;
                    setCompetidor({ ...competidor });
                }

                console.log(competidor);

            })
            .catch((error) => {
                console.log(error);
            });
        }
 
    };

    const Separator = () => <View style={styles.separator} />;

    const insertNewCompetidor = () => {
        // inserir competidor no banco de dados
        // aqui você chamaria uma função que insere os dados no SQLite.
    };

    return (
        <View style={styles.container}>
            {/* bunch of TextInput components */}
            <TextInput placeholder="Primeiro Nome" value={competidor.primeiroNome} onChangeText={(value) => handleChangeText('primeiroNome', value)} style={styles.input} />
            <TextInput placeholder="Segundo Nome" value={competidor.segundoNome} onChangeText={(value) => handleChangeText('segundoNome', value)} style={styles.input} />
            <TextInput placeholder="Email" value={competidor.email} onChangeText={(value) => handleChangeText('email', value)} style={styles.input} />
            <TextInput placeholder="CEP" value={competidor.cep} onChangeText={(value) => handleChangeText('cep',  value.replace(/[^0-9]/g, ''))} style={styles.input} />
            <Button title="Buscar Endereço" onPress={() => getAddress()} color={'#008000'} />
            <TextInput placeholder="Rua" value={competidor.logradouro} onChangeText={(value) => handleChangeText('logradouro', value)} style={styles.input} />
            <TextInput placeholder="Número" value={competidor.numero} onChangeText={(value) => handleChangeText('numero', value.replace(/[^0-9]/g, ''))} style={styles.input} />
            <TextInput placeholder="Bairro" value={competidor.bairro} onChangeText={(value) => handleChangeText('bairro', value)} style={styles.input} />
            <TextInput placeholder="Cidade" value={competidor.localidade} onChangeText={(value) => handleChangeText('localidade', value)} style={styles.input} />
            <TextInput placeholder="UF" value={competidor.uf} onChangeText={(value) => handleChangeText('uf', value)} style={styles.input} />
            <Button title="Salvar" onPress={insertNewCompetidor} color={'#421781'} />
            <Separator />
            <Button title="Cancelar" onPress={() => {
                setCompetidor({
                    primeiroNome: '',
                    segundoNome: '',
                    email: '',
                    cep: '',
                    logradouro: '',
                    numero: '',
                    bairro: '',
                    localidade: '',
                    uf: '',
                });
                return navigation.navigate('Home')
            }} color={'#BB1AB2'} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        borderColor: '#6F6989',
        padding: 10,
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    searchIcon: {
        padding: 10,
    },
});


