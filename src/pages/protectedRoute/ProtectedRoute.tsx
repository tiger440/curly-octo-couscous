import { useAppSelector } from 'src/hooks/use-app-selector'
import { Navigate } from 'react-router-dom'

const AuthLayout = ({ children }) => {
    const user = useAppSelector((state) => state.auth.userData)

    return (
        <>
            {user ? children : <Navigate to='/login' />}
        </>
    );
}

export default AuthLayout