import React, {useContext, useState} from "react";
import {View, Text} from "../components/Themed";
import {StyleSheet, StatusBar, Platform, ScrollView, Alert} from "react-native";
import {Avatar, Button, Paragraph, TextInput, Title} from "react-native-paper";
import axios from "axios";
import APIContext, {ref as tryRef} from "../API";
import * as ImagePicker from "expo-image-picker";
import backendUrl from "../constants/URL";

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;


const RegistrationScreen = () => {

    const [state, setState] = useState({username: "",});
    const [mode, setMode] = React.useState("Login");

    const [logoUri, setLogoUri] = React.useState("");
    const [uploading, setUploading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const {handleLogin} = useContext(APIContext) as any;

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const handleChange = (text: string, value: string) => {
        setState(prevState => ({...prevState, [text]: value}));
    }

    let openImagePickerAsync = async () => {
        setUploading(true);
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            setUploading(false);
            return;
        }

        let pickerResult: any = await ImagePicker.launchImageLibraryAsync({allowsEditing: true});
        if (pickerResult.cancelled === true) {
            setUploading(false);
            return;
        }

        setLogoUri(pickerResult.uri);
        handleUpload(pickerResult);
    }


    const handleUpload = (image: any): void => {

        image["type"] = `test/${image.uri.split(".")[1]}`
        image["name"] = `test.${image.uri.split(".")[1]}`

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "dreamner");
        formData.append("cloud_name", "artik");

        fetch("https://api.cloudinary.com/v1_1/dreamner/image/upload", {
            method: "post",
            body: formData
        }).then(res => res.json())
            .then(data => {
                setUploading(false);
                setLogoUri(data.url);
            });
    }


    const handleSubmit = async () => {
        setLoading(true);
        let [res, error] = await tryRef(axios.post(`${backendUrl}/${mode == "Login" ? "login" : "users"}/`, {
            username: state.username,
            password: value,
            image: logoUri === "" ? null : logoUri
        }));
        if (error) {
            Alert.alert("Invalid username", "The username you provided has been taken")
            setLoading(false);
        } else {
            setState({username: ""});
            setValue("");
            setLoading(false);
            if (mode === "Register") setMode("Login");
            else handleLogin(res.data.token);
        }
    }


    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#D2C687"
            }}
        >
            <View style={styles.root}>
                <Title style={styles.title}>
                    <Text>{mode}</Text></Title>
                <>
                    {logoUri !== "" ?
                        <Avatar.Image
                            size={72}
                            style={styles.avatar}
                            source={{uri: logoUri}}
                        />
                        :
                        <Avatar.Icon
                            size={72}
                            style={styles.avatar}
                            icon={"account"}
                        />
                    }
                </>
                <TextInput
                    autoFocus
                    placeholder="Username"
                    outlineColor={"#D2C687"}
                    value={state.username}
                    mode="outlined"
                    style={[styles.textInput, {marginTop: 48}]}
                    returnKeyType={"done"}
                    onChangeText={text => handleChange("username", text)}
                />
                <Paragraph style={styles.pin}>
                    <Text>Pin</Text>
                </Paragraph>

                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {(symbol ? '•' : symbol) || (isFocused ? <Cursor/> : null)}
                        </Text>
                    )}
                />

                {mode === "Register" ?
                    <Button
                        loading={uploading}
                        onPress={openImagePickerAsync}
                        style={styles.upload}
                        icon="image">Upload Image</Button>
                    :
                    null
                }

                <View style={styles.actions}>
                    <Button
                        onPress={() => setMode(mode == "Login" ? "Register" : "Login")}
                    >
                        {mode === "Login" ? "Register" : "Login"}
                    </Button>
                    <Button
                        disabled={
                            state.username == "" || value.length < 4
                        }
                        mode="contained"
                        style={{marginLeft: 9}}
                        loading={loading}
                        icon="send-circle"
                        onPress={handleSubmit}
                    >{mode === "Login" ? "Login" : "Sign Up"}</Button>
                </View>

            </View>
        </ScrollView>
    )
}

export default RegistrationScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    title: {
        alignSelf: "center",
        marginTop: 72
    },
    textInput: {
        marginTop: 9,
        paddingHorizontal: 21,
        backgroundColor: "#FDF7FA"
    },
    actions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 36
    },
    pin: {
        marginTop: 36,
        marginLeft: 27,
        marginBottom: 18
    },
    codeFieldRoot: {
        paddingHorizontal: 27,
        marginBottom: 9
    },
    cell: {
        width: 60,
        height: 60,
        lineHeight: 60,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        borderRadius: 10
    },
    focusCell: {
        borderColor: '#000',
    },
    avatar: {
        alignSelf: "center",
        marginTop: 36
    },
    upload: {
        marginTop: 27,
        alignSelf: "center"
    }
})
