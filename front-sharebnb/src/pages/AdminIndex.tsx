import { useEffect } from 'react'
import { loadUsers, removeUser } from '../store/actions/user.actions.js'
import { useNavigate } from 'react-router'

import { useAppSelector } from '../store/hooks.js'

export function AdminIndex() {
    const navigate = useNavigate()

	const user = useAppSelector(storeState => storeState.userModule.user)
	const users = useAppSelector(storeState => storeState.userModule.users)
	const isLoading = useAppSelector(storeState => storeState.userModule.isLoading)

	useEffect(() => {
        if(!user?.isAdmin) navigate('/')
		loadUsers()
	}, [])

	return <section className="admin">
        {isLoading && 'Loading...'}
        {users && (
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                        <button onClick={() => removeUser(user._id)}>
                            Remove {user.username}
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </section>
}
