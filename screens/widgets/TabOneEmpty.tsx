import React from "react";
import {StyleSheet} from "react-native";
import {View, Text} from "../../components/Themed";
import {Paragraph, Title} from "react-native-paper";

const TabOneEmpty = () => {
    return (
        <View style={styles.root}>
            <Title style={styles.title}><Text>Chats</Text></Title>
            <Paragraph style={styles.desc}><Text>Empty</Text></Paragraph>
        </View>
    )
}

export default TabOneEmpty;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        marginBottom: 144
    },
    desc: {
        marginBottom: 144
    }

})
