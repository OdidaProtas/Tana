import React, {createRef, useContext, useEffect, useRef, useState} from "react";
import {StyleSheet, Platform, StatusBar, TextInput, ScrollView} from "react-native";
import {Appbar, Avatar, IconButton} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import APIContext from "../API";
import {View, Text} from "../components/Themed";
import useUsers from "../hooks/useUsers";

interface BubbleInterface {
    message: any
}


const BlueBubble: React.FC<BubbleInterface> = ({message}) => {
    return (
        <View style={{
            backgroundColor: "#A17C6B",
            padding: 10,
            marginLeft: '50%',
            marginTop: 9,
            marginRight: "5%",
            maxWidth: '50%',
            borderRadius: 20,
            minWidth: "20%"
        }}>
            <Text style={{fontSize: 16, color: "#fff", alignSelf: "flex-end"}}>{message.content} </Text>

        </View>
    )
}

const GreyBubble: React.FC<BubbleInterface> = ({message}) => {
    return (
        <View style={{
            backgroundColor: "#B3CBB9",
            padding: 10,
            marginRight: '45%',
            marginTop: 9,
            marginLeft: "5%",
            maxWidth: '50%',
            borderRadius: 20,
            alignSelf: "flex-start",
            minWidth: "20%"
        }}>
            <Text style={{fontSize: 16, color: "#000"}}>{message.content}</Text>
        </View>
    )
}



const ChatScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const scrollViewRef = useRef() as any;

    const {context, messengerApi} = useContext(APIContext) as any;
    const {sendMessage, messages, users} = messengerApi;

    const {userID, user} = context;

    const {id} = route.params as any;
    const recipient = Object.keys(users).map(user => users[user]).filter((user: any) => user.id === id)[0];

    const [message, setMessage] = useState("");

    const handleSubmit = () => {

        const testPut = {
            content: message,
            sender: user.id,
            recipient: recipient.id,
            isRead: false,
            timeStamp: new Date()
        }

        if (recipient != null || recipient != undefined) {
            sendMessage(testPut);
            setMessage("");
        }
    }

    return (
        <View style={styles.root}>
            <Appbar.Header
                style={{
                    elevation: 0,
                    paddingBottom: 10
                }}
                theme={{colors: {primary: "#D2C687"}}}
            >
                <Appbar.BackAction onPress={navigation.canGoBack() ? () => navigation.goBack() : console.log}/>
                <Appbar.Action
                    icon={props =>
                        <>
                            {recipient?.image === null ?
                                <Avatar.Icon
                                    size={27}
                                    icon="account"/>
                                :
                                <Avatar.Image
                                    size={27}
                                    source={{uri: recipient?.image}}
                                />
                            }

                        </>
                    }
                    onPress={() => console.log('Pressed mail')}/>
                <Appbar.Content title={recipient?.username} subtitle="online"/>
                <Appbar.Action icon="dots-vertical"/>
            </Appbar.Header>
            <ScrollView
                ref={scrollViewRef}
                style={{width: "100%", paddingBottom: 9}}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}
            >
                <View style={styles.chatContainer}>
                    {Object.keys(messages).map(id => messages[id]).map((message: any) => (
                        message.sender == userID ?
                            <BlueBubble message={message} key={message.id}/>
                            : <GreyBubble message={message} key={message.id}/>))}
                </View>
            </ScrollView>
            <View style={styles.grid}>
                <View style={{
                    width: "9%",
                }}>
                    <IconButton
                        color={"#A17C6B"}
                        style={styles.attach}
                        icon={"attachment"}
                    />
                </View>
                <View style={{
                    width: "91%"
                }}>
                    <View style={styles.searchSection}>
                        <TextInput
                            style={styles.newInput}
                            value={message}
                            // onSubmitEditing={this.sendMessage}
                            placeholder="Message..."
                            returnKeyType="send"
                            multiline
                            numberOfLines={3}
                            // ref="newMessage"
                            // onFocus={this.inputFocused.bind(this, "newMessage")}
                            // onBlur={() => {this.refs.scrollView.scrollTo(0,0)}}
                            onChangeText={text => setMessage(text)}
                        />
                        <IconButton onPress={handleSubmit} style={styles.searchIcon} icon="send" size={20}
                                    color="#000"/>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }
    ,
    messageBox: {
        paddingHorizontal: 18,
        position: "absolute",
        bottom: 9,
        width: "100%",
        height: 18
    },
    chatContainer: {
        paddingTop: 36,
    },
    grid: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 9,
        marginTop: 9
    },
    attach: {
        marginStart: 9,
    },
    newInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        padding: 10,
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 9,
        color: '#424242',
        marginStart: 9,
        borderRadius: 9,
        backgroundColor: "#fff"
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {}

});
