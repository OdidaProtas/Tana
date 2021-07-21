import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList} from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import RegistrationScreen from "../screens/RegistrationScreen";
import APIContext, {ref} from "../API";
import {useEffect} from "react";
import ChatScreen from "../screens/ChatScreen";
import jwtDecode from "jwt-decode";
import Scanner from "../screens/Scanner";
import useMessenger from "../hooks/useMessenger";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator/>
        </NavigationContainer>
    );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {

    const [state, setState] = React.useState({
        isLoggedIn: false,
        token: "",
        userID: "",
        user: {}
    });

    useEffect(() => {
        checkLoginStatus();

    }, [])

    const checkLoginStatus = async () => {
        const [res, error] = await ref(AsyncStorage.getItem("@access_token"));
        if (res) {
            let user = jwtDecode(res.split(" ")[1]) as any;
            setState(prevState => ({
                ...prevState,
                isLoggedIn: true,
                token: `Bearer ${res}`,
                user: user,
                userID: user.id
            }));

        }
    }


    const handleLogin = async (token: string) => {

        const [res, error] = await ref(AsyncStorage.setItem("@access_token", `Bearer ${token}`))

        if (res) {
            let user = jwtDecode(token, {header: true}) as any;
            setState(prevState => ({
                ...prevState,
                isLoggedIn: true,
                token: `Bearer ${token}`,
                user: user,
                userID: user.id
            }));
        }
    }

    const handleLogout = async () => {
        const [res, error] = await ref(AsyncStorage.removeItem("@access_token"));
        setState(prevState => ({...prevState, isLoggedIn: false, token: ""}));
    }

    const handleAuthorization = (token: string) => {

    }

    const messengerApi = useMessenger(parseInt(state.userID)) as any;

    return (
        <APIContext.Provider
            value={{
                context: state,
                handleLogin: handleLogin,
                handleLogout: handleLogout,
                messengerApi: messengerApi,
            }}
        >
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {state.isLoggedIn ?
                    <>
                        <Stack.Screen name="Root" component={BottomTabNavigator}/>
                        <Stack.Screen name="MyChat" component={ChatScreen}/>
                        <Stack.Screen name="Scanner" component={Scanner}/>
                    </>
                    :
                    <>
                        <Stack.Screen name="Registration" component={RegistrationScreen}/>
                    </>
                }
                <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
            </Stack.Navigator>
        </APIContext.Provider>
    );
}
