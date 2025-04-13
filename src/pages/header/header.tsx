import { AppBar, Avatar, Box, Button, Menu, MenuItem, Toolbar, useTheme, } from "@mui/material";
import { useAppSelector } from 'src/hooks/use-app-selector';
import Fichier from "../../assets/Fichier.svg";
import { useNavigate } from "react-router-dom";
import { useLogout } from 'src/hooks/shared';
import { profiles } from "src/utils/constants/profileAvatars";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const HeaderSection = ({ setAnchorEl, anchorEl }) => {
    const theme = useTheme();
    const navigate = useNavigate()
    const logout = useLogout()
    const user = useAppSelector((state) => state.auth.userData)

    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleLogout = () => {
        setAnchorEl(null)
        logout()
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }


    return (
        <AppBar className="AppBar" position="static">

            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                <Box
                    className="logo"
                    sx={{
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/')}
                >
                    <img src={Fichier} alt="" />
                </Box>
                <Box>
                    {user ? <Avatar
                        alt=""
                        src={profiles[user.avatar - 1]?.image ?? profiles[0].image}
                        onClick={handleClick}
                        sx={{ cursor: "pointer" }}
                    /> : <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/login')}
                        sx={{
                            borderRadius: '100px',
                            paddingInline: '30px',                                                                                                                                                                                                                                                                                                                                                           
                            fontWeight:'500'
                        }}
                    >Sign In
                    </Button>}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { return setAnchorEl(null), navigate('/profile') }}>
                            <PersonIcon sx={{ mr: 1.2 }} />
                            Profil
                        </MenuItem>
                        {/* <MenuItem onClick={handleClose}>
                            <LockIcon sx={{ mr: 1.2 }} />
                            Mon compte
                        </MenuItem> */}
                        <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                            <LogoutIcon sx={{ mr: 1.2 }} />
                            Déconnexion
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar >
    )
}

export default HeaderSection
