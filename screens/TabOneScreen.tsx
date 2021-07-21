import * as React from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import ActionSheet from "react-native-actions-sheet";

import {FAB, IconButton} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import TabOneEmpty from "./widgets/TabOneEmpty";
import ChatList from "./widgets/ChatList";
import {createRef, useContext} from "react";
import UserList from "./widgets/UserList";
import {useNavigation} from "@react-navigation/native";
import APIContext from "../API";

const TabOneScreen = () => {

    const actionSheetRef = createRef() as any;
    const navigation = useNavigation();

    const {messengerApi} = useContext(APIContext) as any;
    const {users} = messengerApi;

    const toggle = () => {
        actionSheetRef.current?.setModalVisible();
    }

    const handleUserClick = (id: number) => {
        actionSheetRef.current?.setModalVisible(false);
        navigation.navigate("MyChat", {id: id});
    }

    return (
        <View style={styles.container}>

            {Object.keys(users).length < 1 ?
                <>
                    <TabOneEmpty/>
                    <IconButton
                        icon="qrcode-scan"
                        style={styles.qrcode}
                        onPress={() => navigation.navigate("Scanner")}
                    />
                    <FAB
                        style={styles.fab}
                        small
                        label={"Start Conversation"}
                        icon="chat"
                        onPress={toggle}
                    />
                </>
                :
                <>
                    <ChatList/>
                    <IconButton
                        icon={"plus"}
                        onPress={toggle}
                        style={styles.iconBtn}
                    />
                </>
            }
            {/*<ActionSheet containerStyle={{}} ref={actionSheetRef}>*/}
            {/*    <UserList handleUserClick={handleUserClick}/>*/}
            {/*</ActionSheet>*/}
        </View>
    );
}

export default TabOneScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    fab: {
        position: 'absolute',
        margin: 16,
        bottom: 18,
        alignSelf: "center",
        elevation: 0
    },
    iconBtn: {
        position: "absolute",
        right: 18,
        top: 48
    },
    qrcode: {
        position: "absolute",
        bottom: 90,
        alignSelf: "center"
    }
});
