import { useEffect, useState } from 'react';

import { StyleSheet, View, ScrollView } from 'react-native';

import { Text, Divider, FAB } from '@rneui/themed';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UserSettingScreen({ navigation }) {

    const [localStorage, setLocalStorage] = useState([]);

    // map to show all keys in LocalStorage and their values
    const localStoreMap = localStorage.map((cItem) => (
        <View key={cItem[0]} style={styles.resultContainer}>
            <Text>Key: {cItem[0]}</Text>
            <Text>Value: {cItem[1]}</Text>

            <Divider style={{width: '100%'}} />
        </View>
    ));

    useEffect(() => {
        // first use getAllKeys to get an array of keys in LS
        AsyncStorage.getAllKeys()
            .then((keyRes) => {
                // then use that array with getValues to get an array of {key, value} pairs
                return AsyncStorage.multiGet(keyRes);
            })
            .then((pairRes) => {
                // set that result in state to re-render and show the mapped LS
                setLocalStorage(pairRes);
            })
            .catch((err) => {
                console.log('error: ' + err);
            });

    }, []);

    return (        
        <View style={styles.container}>
            <Text h2 style={styles.heading}>User Settings</Text>
            
            <View style={styles.resultContainer}>
                {localStoreMap}
            </View>


            <FAB
                onPress={() => {
                    AsyncStorage.clear();
                    setLocalStorage([]);
                }}
                placement="right"
                icon={{
                    type: 'ionicon',
                    name: 'trash-outline',
                }}

            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    resultContainer: {
        width: '100%',
        padding: 5,
        alignItems: 'flex-start',
    },

    heading: {
        marginTop: 10,
        marginBottom: 10,
    },
});