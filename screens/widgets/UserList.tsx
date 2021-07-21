import React, {useContext, useEffect, useState} from "react";
import {View, Text} from "../../components/Themed";
import {Title, List, Avatar, IconButton, Searchbar, Paragraph, Divider, TouchableRipple} from "react-native-paper";
import {Alert, ScrollView, StyleSheet} from "react-native";
import APIContext, {ref} from "../../API";
import {useNavigation} from "@react-navigation/native";
import useUsers from "../../hooks/useUsers";
import axios from "axios";
import backendUrl from "../../constants/URL";

interface UserListInterface {
    handleUserClick: any;
}

interface ListItemInterface {
    user: any;
    handleClick: any;
}

const ListItemWidget: React.FC<ListItemInterface> = ({user, handleClick}) => {

    const {context, usersApi} = useContext(APIContext) as any;

    const {userID, token} = context;
    const {refresh, users} = usersApi;
    const navigation = useNavigation();

    const connectionIDs = users.map((user: any) => user.id);
    const [invitePressed, setInvitePressed] = useState(false);


    const handleInvite = async (status: string) => {

        switch (status) {

            case "cancel":
                await Alert.alert(
                    `Remove ${user.username}`,
                    "Your invite will be cancelled",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Ok",
                            onPress: () => handleRemoveUser(),
                            style: "default",
                        }
                    ],
                    {
                        cancelable: true,
                    }
                );
            case "accept":
                await inviteUser();


        }

    }

    const handleRemoveUser = async (): Promise<void> => {
        const [res, error] = await ref(axios.delete(`${backendUrl}/connections/${user.connection}`, {
            headers: {
                access_token: token
            }
        }));
        if (res && res.data.affected > 0) refresh();
        else if (error) console.log("removed");
    }

    const inviteUser = async (): Promise<void> => {

        setInvitePressed(true);

        const data = {
            partyA: userID,
            partyB: user.id
        }

        const config = {
            headers: {
                access_token: token
            }
        }

        const [res, error] = await ref(axios.post(`${backendUrl}/connections`, data, config));

        if (res) refresh(res.data)
        else setInvitePressed(false);

    }


    return (
        <>
            <List.Item
                onPress={() => handleClick(user.id)}
                style={styles.listItem}
                title={user.username}
                description={
                    userID === user.id ? "(me)" : null}
                left={props =>
                    <>
                        {user.image ?
                            <Avatar.Image
                                size={48}
                                {...props}
                                source={{uri: user.image}}
                            />
                            :
                            <TouchableRipple
                                onPress={() => navigation.navigate("Profile")}
                            >
                                <Avatar.Icon
                                    size={48}
                                    {...props}
                                    icon="account"
                                />
                            </TouchableRipple>
                        }
                    </>
                }
                right={
                    props =>
                        <IconButton
                            style={styles.badge}
                            {...props}
                            onPress={() => handleInvite(
                                invitePressed || connectionIDs.includes(user.id) || user.status == "is_pending" ? "cancel" : "accept"
                            )}
                            icon={
                                user.status == "is_pending"
                                || invitePressed || connectionIDs.includes(user.id) ? "account-clock" : "account-plus"}
                        />
                }
            />
            <Divider/>
        </>
    )
}

const UserList: React.FC<UserListInterface> = ({handleUserClick}) => {

    const [filtered, setFiltered] = useState([]);

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query: string) => {
        setSearchQuery(query)
        const filter = filtered.filter((user: any) => {
            return user.username.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFiltered(filter)
    };

    const navigation = useNavigation();

    return (
        <View style={styles.root}>
            <IconButton
                size={72}
                icon="account-supervisor-circle"
                style={styles.icon}
            />
            <Title style={styles.title}>
                <Text>People</Text>
            </Title>
            <Searchbar
                placeholder="Search username"
                onChangeText={onChangeSearch}
                style={{
                    marginHorizontal: 18,
                    elevation: 1,
                    marginBottom: 18
                }}
                value={searchQuery}
            />
            <IconButton
                onPress={() => navigation.navigate("Scanner")}
                style={styles.scanBtn}
                icon={"qrcode-scan"}
            />
            <ScrollView
                style={{
                    paddingHorizontal: 24,
                    paddingVertical: 18,
                    height: 360
                }}
            >
                {searchQuery.length > 1 ?
                    <>
                        {filtered.map((user: any) => (
                            <ListItemWidget handleClick={handleUserClick} user={user} key={user.id}/>
                        ))}
                    </>
                    :
                    <>
                        {filtered.map((user: any) => (
                            <ListItemWidget handleClick={handleUserClick} user={user} key={user.id}/>
                        ))}
                    </>
                }

                {filtered.length < 1 && searchQuery.length > 0 ?
                    <Paragraph style={styles.empty}><Text> No users found</Text></Paragraph>
                    : null
                }

            </ScrollView>
        </View>
    )
}

export default UserList;

const styles = StyleSheet.create({
    root: {
        borderRadius: 10
    },
    icon: {
        // marginTop: 36,
        alignSelf: "center"
    },
    title: {
        marginTop: 6,
        marginBottom: 18,
        alignSelf: "center"
    },
    listItem: {
        marginVertical: 9
    },
    badge: {
        marginTop: 18
    },
    avatar: {
        // marginTop: 20
    },
    scanBtn: {
        position: "absolute",
        right: 18,
        top: 9,
    },
    empty: {
        marginTop: 9,
        alignSelf: "center",
        marginBottom: 18
    }
})
