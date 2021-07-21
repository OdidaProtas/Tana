import React, {useState, useEffect} from "react";
import {View, Text} from "../components/Themed";
import {StyleSheet, StatusBar, Platform} from "react-native";
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Button} from "react-native-paper";


const Scanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({type, data}: any) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.root}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.root}>
                <Text>No access to camera</Text>
            </View>
        )
    }
    return (
        <View style={styles.root}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button mode={"contained"} onPress={() => setScanned(false)}>Scan Again</Button>}
        </View>
    )
}

export default Scanner;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }
})

