import { signOut } from "firebase/auth"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { auth } from "src/firebase/firebase"
import { logout } from "../store/slices/auth"

export const useLogout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return () => {
        signOut(auth).then(() => {
            dispatch(logout())
            navigate('/login')
        })
    }
}