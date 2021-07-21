import React, {useEffect, useState} from "react";
import {Alert} from "react-native";

const useMessages = ({userID, token, socket}: any) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.emit(`online`, userID);
        }

        socket.on("chat_message", (data: any) => {
            Alert.alert(JSON.parse(data.content));
        })

    }, [token])

    const sendMessage = (data: any): void => {
        socket?.emit("send_chat_message", JSON.stringify(data))
    }


    return {messages, setMessages, sendMessage};
}

export default useMessages;
