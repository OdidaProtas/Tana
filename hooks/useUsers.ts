import React, {useEffect} from "react";
import {ref} from "../API";
import axios from "axios";
import backendUrl from "../constants/URL";

const useUsers = ({token, userID, mode}: any) => {

    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setErrors] = React.useState(false);

    const modeSuffix = () => mode === "all" ? "/users" : `/connections/${userID}`

    useEffect(() => {
        getUsers();

    }, [token]);

    const getUsers = async () => {
        if (token) {
            const [res, error] = await ref(axios.get(`${backendUrl}${modeSuffix()}`, {
                headers: {
                    access_token: token
                }
            }));
            if (error) {
                setErrors(true);
            }
            setUsers(res.data);
        }
    }


    const refresh = (data: any) => {
        getUsers();
    }


    return {users, loading, refresh}
}

export default useUsers;
