import React, {useContext, useRef, useState} from "react";
import {View, Text} from "../components/Themed";
import {StyleSheet, StatusBar, Platform, Alert} from "react-native";
import {Button, TextInput, Title} from "react-native-paper";

import {useNavigation} from "@react-navigation/native"
import APIContext, {ref} from "../API";
import axios from "axios";
import backendUrl from "../constants/URL";


const LoginScreen = () => {

    const [state, setState] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const passWordRef = useRef() as any;

    const navigation = useNavigation();
    const {handleLogin} = useContext(APIContext) as any;

    const handleChange = (text: string, value: string) => {
        setState(prevState => ({...prevState, [text]: value}))
    }

    const handleSubmit = async () => {
        setLoading(true);
        const [res, error] = await ref(axios.post(`${backendUrl}/login`, state));
        if (error) {
            setLoading(false);
            Alert.alert("An error occurred", "Please verify details and try again")
        }
        ;
        if (res) {
            setLoading(false)
            handleLogin(res.data.token);
        }
    }

    return (
        <View style={styles.root}>
            <Title style={styles.title}><Text>Login</Text></Title>

            <TextInput
                autoFocus
                label="Username"
                value={state.username}
                returnKeyType={"next"}
                style={[styles.textInput, {marginTop: 72}]}
                onSubmitEditing={() => passWordRef.current.focus()}
                onChangeText={text => handleChange("username", text)}
            />
            <TextInput
                ref={passWordRef}
                label="Password"
                value={state.password}
                secureTextEntry={secureText}
                style={styles.textInput}
                returnKeyType={"done"}
                onChangeText={text => handleChange("password", text)}
                right={
                    <TextInput.Icon
                        onPress={() => setSecureText(!secureText)}
                        name={secureText ? "eye" : "eye-off"}
                    />
                }
            />

            <View style={styles.actions}>
                <Button
                    onPress={() => navigation.navigate("Registration")}
                >Register</Button>
                <Button
                    disabled={
                        state.username === ""
                        || state.password === ""
                    }
                    style={{marginLeft: 9}}
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                >Login</Button>
            </View>

        </View>
    )
}

export default LoginScreen;

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
        marginTop: 9
    },
    actions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 36
    }
})
