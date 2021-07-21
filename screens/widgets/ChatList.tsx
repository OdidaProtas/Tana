import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {View, Text} from "../../components/Themed";
import {Avatar, Divider, List, Title} from "react-native-paper";

import {useNavigation} from "@react-navigation/native"
import {useContext} from "react";
import APIContext from "../../API";

const ChatList = () => {

    const navigation = useNavigation();

    const {messengerApi, context: {userID}} = useContext(APIContext) as any;
    const {users} = messengerApi;

    return (
        <View style={styles.root}>
            <Title style={styles.title}><Text>Chats</Text></Title>
            <ScrollView>
                <View style={styles.container}>
                    {Object.keys(users).map(user => users[user]).map((user: any) => {
                        return (
                            <View key={user.id} style={styles.list}>
                                <List.Item
                                    onPress={() => navigation.navigate("MyChat", {id: user.id})}
                                    title={user.username}
                                    description={user.id == userID ? "(me)" : null}
                                    left={props =>
                                        <>
                                            {user.image == null ?
                                                <Avatar.Icon
                                                    {...props}
                                                    style={styles.avatar}
                                                    size={48}
                                                    icon="account"/>
                                                :
                                                <Avatar.Image
                                                    {...props}
                                                    style={styles.avatar}
                                                    size={48}
                                                    source={{uri: user.image}}
                                                />
                                            }
                                        </>

                                    }
                                />
                                <Divider/>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

export default ChatList;

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    title: {
        marginTop: 108,
        marginBottom: 27,
        alignSelf: "center"
    },
    container: {
        marginTop: 48
    },
    list: {
        marginTop: 9,
        marginHorizontal: 9,
        borderRadius: 24
    },
    avatar: {
        marginTop: 3,
        marginLeft: 9
    },
    emptyScreen: {
        alignItems: "center",
        paddingTop: 18
    }
});
