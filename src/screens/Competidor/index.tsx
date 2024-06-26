import React, { useEffect, useState } from 'react';
import { Button, TextInput, View, StyleSheet, Alert, TouchableOpacity, ScrollView, Text } from 'react-native';
import axios from 'axios';
import Competidor from '../../interfaces/competidor-interface';
import { addCompetidor, deleteCompetidorById, getCompetidorById, updateCompetidor } from '../../db/db';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export type TypeMode = 'View' | 'Create' | 'Edit';

export function CompetidorScreen({ route, navigation }: any) {

    const [modeScreen, setModeScreen] = useState<TypeMode>('Create');

    if (route.params) {

        if (route.params['mode']) {
            console.log("Params: ", route.params);

            if (route.params['mode']) {
                setModeScreen(route.params['mode'] as TypeMode);
            }

            console.log(`Mode: ${modeScreen} `);

            if (route.params['mode'] as TypeMode === 'View') {
                console.log('View: ' + route.params['id']);

                getCompetidorById(Number(route.params['id']))
                    .then((data) => {

                        if (data.length > 0) {
                            setCompetidor({ ...data[0] });

                        }
                    });
            }

            const { mode, id, ...params } = route.params;
            route.params = params;

        }
    }

    const [competidor, setCompetidor] = useState<Competidor>({
        id: 0,
        primeiroNome: '',
        segundoNome: '',
        email: '',
        telefone: '',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        localidade: '',
        uf: '',
    });

    const getAddress = () => {

        console.log(competidor.cep.length);

        if (competidor.cep.length === 8) {
            axios.get(`https://viacep.com.br/ws/${competidor.cep}/json/`)
                .then((response) => {

                    console.log(response.status);

                    if (!response.data['erro']) {
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

    // Criar competidor
    const insertNewCompetidor = () => {
        // inserir competidor no banco de dados
        // aqui você chamaria uma função que insere os dados no SQLite.


        addCompetidor(competidor)
            .then((res) => {
                console.log(res);
                console.log(res[0].insertId);

                getCompetidorById(res[0].insertId).then((data) => console.log(data));

                Alert.alert("Competidor cadastrado!")
                setTimeout(() => navigation.navigate('Home', { id: res[0].insertId }), 2000);
            })
            .catch((err) => {
                Alert.alert("Erro ao cadastrar competidor!");
                setTimeout(() => navigation.navigate('Home'), 5000);
            });

        cleanCompetidor(setCompetidor);
        resetValidator();
        setModeScreen('Create');
    };

    const atualizarCompetidor = () => {
        //cleanCompetidor(setCompetidor);
        //resetValidator();
        //setModeScreen('Create');

        updateCompetidor(competidor.id, competidor)
            .then(data => {
                console.log(data);
                Alert.alert("Competidor atualizado!")

            })
            .catch((err) => {
                Alert.alert("Erro ao atualizar competidor!");
            });

        setTimeout(() => navigation.navigate('Home', { id: competidor.id }), 2000);
        cleanCompetidor(setCompetidor);
        resetValidator();
        setModeScreen('Create');
    };

    const deletarCompetidor = () => {
        //cleanCompetidor(setCompetidor);
        //resetValidator();
        //setModeScreen('Create');

        deleteCompetidorById(competidor.id)
            .then(data => {
                console.log(data);
                Alert.alert("Competidor deletado!")
            })
            .catch((err) => {
                Alert.alert("Erro ao deletar competidor!");
            });

        setTimeout(() => navigation.navigate('Home', { id: competidor.id }),2000);
        cleanCompetidor(setCompetidor);
        resetValidator();
        setModeScreen('Create');

    };

    const handleChangeText = (name: string, value: string) => {

        setCompetidor({ ...competidor, [name]: value });
    };

    // Formulário
    const [primeiroNomeError, setPrimeiroNomeError] = useState('');
    const [segundoNomeError, setSegundoNomeError] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [TelefoneError, setTelefoneError] = useState('');
    const [cepError, setCepNomeError] = useState('');
    const [logradouroError, setLogradouroNomeError] = useState('');
    const [numeroError, setNumeroError] = useState('');
    const [bairroError, setBairroError] = useState('');
    const [localidadeError, setLocalidadeError] = useState('');
    const [ufError, setUFError] = useState('');

    const resetValidator = () => {
        setPrimeiroNomeError('');
        setSegundoNomeError('');
        setEmailError('');
        setTelefoneError('');
        setCepNomeError('');
        setLogradouroNomeError('');
        setNumeroError('');
        setBairroError('');
        setLocalidadeError('');
        setUFError('');
    }

    const validatorForm = (name: string, value: string): boolean => {

        if (name === 'primeiroNome') {
            if (value === '') {
                setPrimeiroNomeError('Primeiro nome é obrigatório'); return true;
            }
            else if (value.length < 3) {
                setPrimeiroNomeError('Nome deve ter 3 letras'); return true;
            }
            else {
                setPrimeiroNomeError(''); return false;
            }
        }


        if (name === 'segundoNome') {
            if (value === '') {

                setSegundoNomeError('Segundo nome é obrigatório'); return true;
            }
            else if (value.length < 3) {

                setSegundoNomeError('Segundo nome deve ter 3 letras'); return true;
            }
            else {

                setSegundoNomeError(''); return false;
            }

        }

        if (name === 'email') {
            if (value === '') {

                setEmailError('Email inválido'); return true;
            }
            else {

                setEmailError(''); return false;
            }

        }

        if (name === 'telefone') {
            if (value === '') {

                setTelefoneError('Telefone inválido'); return true;
            }
            else {

                setTelefoneError(''); return false;
            }

        }

        if (name === 'cep') {
            if (value.length < 8) {

                setCepNomeError('CEP deve ter 8 números'); return true;
            }
            else {

                setCepNomeError(''); return false;
            }

        }

        if (name === 'logradouro') {
            if (value === '') {

                setLogradouroNomeError('Rua é obrigatória'); return true;
            }
            else {

                setLogradouroNomeError(''); return false;
            }

        }

        if (name === 'numero') {
            if (value === '') {

                setNumeroError('Número é obrigatório'); return true;
            }
            else {

                setNumeroError(''); return false;
            }

        }

        if (name === 'bairro') {
            if (value === '') {

                setBairroError('Bairro é obrigatório'); return true;
            }
            else {

                setBairroError(''); return false;
            }

        }


        if (name === 'localidade') {
            if (value === '') {

                setLocalidadeError('Cidade é obrigatória'); return true;
            }
            else {

                setLocalidadeError(''); return false;
            }

        }

        if (name === 'uf') {
            if (value === '') {

                setUFError('UF deve ter 2 letras');
            }
            else {

                setUFError(''); return false;
            }

        }

        return false;

    }

    const formIsValid = () => {

        const primeiroNomeIsValid = validatorForm('primeiroNome', competidor.primeiroNome);
        const segundoNomeIsValid = validatorForm('segundoNome', competidor.segundoNome);
        const emailIsValid = validatorForm('email', competidor.email);
        const telefoneIsValid = validatorForm('telefone', competidor.telefone);
        const cepIsValid = validatorForm('cep', competidor.cep);
        const logradouroIsValid = validatorForm('logradouro', competidor.logradouro);
        const numeroIsValid = validatorForm('numero', competidor.numero);
        const bairroIsValid = validatorForm('bairro', competidor.bairro);
        const localidadeIsValid = validatorForm('localidade', competidor.localidade);
        const ufIsValid = validatorForm('uf', competidor.uf);

        return (
            primeiroNomeIsValid
            || segundoNomeIsValid
            || emailIsValid
            || telefoneIsValid
            || cepIsValid
            || logradouroIsValid
            || numeroIsValid
            || bairroIsValid
            || localidadeIsValid
            || ufIsValid
        )
    }



    return (
        <ScrollView style={styles.container}>
            <TextInput
                placeholder="Primeiro Nome"
                value={competidor.primeiroNome}
                onChangeText={(value) => handleChangeText('primeiroNome', value)}
                style={styles.input}
                onBlur={() => validatorForm('primeiroNome', competidor.primeiroNome)}
                editable={modeScreen != 'View'}
            />
            {primeiroNomeError && <Text style={styles.error}>{primeiroNomeError}</Text>}

            <TextInput
                placeholder="Segundo Nome"
                value={competidor.segundoNome}
                onChangeText={(value) => handleChangeText('segundoNome', value)}
                style={styles.input}
                onBlur={() => validatorForm('segundoNome', competidor.segundoNome)}
                editable={modeScreen != 'View'}
            />
            {segundoNomeError && <Text style={styles.error}>{segundoNomeError}</Text>}

            <TextInput
                placeholder="Email"
                value={competidor.email}
                onChangeText={(value) => handleChangeText('email', value)}
                style={styles.input}
                onBlur={() => validatorForm('email', competidor.email)}
                editable={modeScreen != 'View'}
            />
            {EmailError && <Text style={styles.error}>{EmailError}</Text>}


            <TextInput
                placeholder="Telefone"
                value={competidor.telefone}
                onChangeText={(value) => handleChangeText('telefone', value)}
                style={styles.input}
                onBlur={() => validatorForm('telefone', competidor.telefone)}
                editable={modeScreen != 'View'}
            />
            {TelefoneError && <Text style={styles.error}>{EmailError}</Text>}

            <TextInput
                placeholder="CEP"
                value={competidor.cep}
                onChangeText={(value) =>
                    handleChangeText('cep', value.replace(/[^0-9]/g, '').substring(0, 8))}
                style={styles.input}
                onBlur={() => validatorForm('cep', competidor.cep.replace(/[^0-9]/g, '').substring(0, 8))}
                editable={modeScreen != 'View'}
            />
            {cepError && <Text style={styles.error}>{cepError}</Text>}

            {modeScreen != 'View' && <Button title="Buscar Endereço" onPress={() => getAddress()} color={'#008000'} />}
            <TextInput
                placeholder="Rua" value={competidor.logradouro}
                onChangeText={(value) => handleChangeText('logradouro', value)}
                style={styles.input}
                onBlur={() => validatorForm('logradouro', competidor.logradouro)}
                editable={modeScreen != 'View'}
            />
            {logradouroError && <Text style={styles.error}>{logradouroError}</Text>}

            <TextInput
                placeholder="Número"
                value={competidor.numero}
                onChangeText={(value) => handleChangeText('numero', value.replace(/[^0-9]/g, ''))}
                style={styles.input}
                onBlur={() => validatorForm('numero', competidor.numero.replace(/[^0-9]/g, ''))}
                editable={modeScreen != 'View'}
            />
            {numeroError && <Text style={styles.error}>{numeroError}</Text>}

            <TextInput
                placeholder="Bairro"
                value={competidor.bairro}
                onChangeText={(value) => handleChangeText('bairro', value)}
                style={styles.input}
                onBlur={() => validatorForm('bairro', competidor.bairro)}
                editable={modeScreen != 'View'}
            />
            {bairroError && <Text style={styles.error}>{bairroError}</Text>}

            <TextInput
                placeholder="Cidade"
                value={competidor.localidade}
                onChangeText={(value) => handleChangeText('localidade', value)}
                style={styles.input}
                onBlur={() => validatorForm('localidade', competidor.localidade)}
                editable={modeScreen != 'View'}
            />
            {localidadeError && <Text style={styles.error}>{localidadeError}</Text>}

            <TextInput
                placeholder="UF"
                value={competidor.uf}
                onChangeText={(value) => handleChangeText('uf', value.substring(0, 2))}
                style={styles.input}
                onEndEditing={() => validatorForm('uf', competidor.uf.substring(0, 2))}
                editable={modeScreen != 'View'}
            />
            {ufError && <Text style={styles.error}>{ufError}</Text>}

            {modeScreen === 'Create' && <Button title="Cadastrar" onPress={() => !formIsValid() ? insertNewCompetidor() : false} />}
            {modeScreen === 'View' && <Button title="Editar" onPress={() => setModeScreen('Edit')} />}
            {modeScreen === 'View' && <Separator />}
            {modeScreen === 'View' && <Button title="Voltar" onPress={() => { resetValidator(); cleanCompetidor(setCompetidor); setModeScreen('Create'); return navigation.navigate('Home') }} />}
            <Separator />
            {modeScreen === 'View' || modeScreen === 'Create' && <Button title="Cancelar" onPress={() => { resetValidator(); cleanCompetidor(setCompetidor); setModeScreen('Create'); return navigation.navigate('Home') }} color={'#DD3C4B'} />}
            {modeScreen === 'Edit' && <Button title="Salvar" onPress={() => !formIsValid() ? atualizarCompetidor() : false} />}
            {modeScreen === 'Edit' && <Separator />}
            {modeScreen === 'Edit' && <Button title="Deletar" onPress={() => { resetValidator(); setModeScreen('Create'); deletarCompetidor() }} color={'#DD3C4B'} />}
            {modeScreen === 'Edit' && <Separator />}
            {modeScreen === 'Edit' && <Button title="Voltar" onPress={() => { resetValidator(); setModeScreen('Create'); return navigation.navigate('Home', { id: 0 }) }} />}
            <Separator />
        </ScrollView>
    );

};



function cleanCompetidor(setData: (data: any) => any) {

    let dataClean = {
        id: 0,
        primeiroNome: '',
        segundoNome: '',
        email: '',
        telefone: '',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        localidade: '',
        uf: '',
    }

    setData(dataClean);
}

const styles = StyleSheet.create({
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


