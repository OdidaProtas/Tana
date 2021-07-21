import {io} from "socket.io-client";
import backendUrl from "../constants/URL";
import {useEffect, useState} from "react";

const socket = io(`${backendUrl}/`);

const useMessenger = (id: number) => {

    const [messages, setMessages] = useState({});
    const [users, setUsers] = useState({});
    const [me, setMe] = useState({});

    useEffect(() => {
        if (id != null || id != "")
            socket.emit("new_user", {id: id});

        socket.on("user_connected", handleUserConnected);
        socket.on("chat_message", handleNewMessage);
        socket.on("user_disconnected", handleUserDisconnected);
        socket.on("all_users", handleAllUsers);

        return () => {
            setUsers({});
            setMessages({});
        }


    }, [id]);


    const handleUserDisconnected = (data: any) => {
        if (data) {
            const myUsers: any = {...users};
            delete myUsers[data.id];
            setUsers(() => myUsers);
        }
    }

    const handleAllUsers = (data: any) => {
    }


    const handleUserConnected = (data: any) => {
        if (data) setUsers(prevState => ({...prevState, [data.id]: data}));
    }

    const handleNewMessage = (data: any) => {
        if (data) {
            data.recipient
            handleUserConnected(data.recipient);
            setMessages(prevState => ({...prevState, [data.id]: data}));
        }
    }

    const sendMessage = (data: any) => {
        socket.emit("send_chat_message", data);
    };


    return {messages, sendMessage, users};
}

export default useMessenger;
