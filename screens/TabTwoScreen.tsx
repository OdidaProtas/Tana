import * as React from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {Avatar, Paragraph, FAB} from "react-native-paper";
import {useContext} from "react";
import APIContext from "../API";

import QRCode from 'react-native-qrcode-svg';


export default function TabTwoScreen() {

    const {handleLogout, context} = useContext(APIContext) as any;
    const {user} = context;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            {user?.image ?
                <Avatar.Image source={{uri: user?.image}}/>
                :
                <Avatar.Icon icon={"account"}/>
            }
            <Paragraph style={styles.username}><Text>@{user?.username}</Text></Paragraph>
            <QRCode
                size={200}
                value={JSON.stringify(user?.username)}
            />
            <FAB small style={styles.logout} label={"logout"} icon={"logout"} onPress={handleLogout}>Logout</FAB>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 27
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    logout: {
        elevation: 0,
        position: "absolute",
        bottom: 18
    },
    username: {
        marginTop: 15,
        marginBottom: 36
    }
});
