import React, { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

//useEffect – For Side Effects (e.g., API calls)
const UseEffectHook = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(users => setUsers(users))
    }, [])

    return (
        <div>
            <h1>UseEffectHook</h1>
            <h3>useEffect without async</h3>
            <ol>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name}
                    </li>
                ))}
            </ol>
            <UseEffectAsync />
        </div>

    );
}

//useEffect with try and catch block of async fuction
const UseEffectAsync = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(API_URL)
            const users = await res.json()
            setUsers(users)

        } catch (error) {
            console.log("Failed to fetch users", error);
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <h3>UseEffect with Async</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}> {user.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default UseEffectHook