import logo from "../../../assets/hermes-logo.png";
import sinscrire from "../../../assets/hermes-icon.png";
import { Box } from "@mui/system";
import { Button, Link, useTheme } from "@mui/material";
import "./header.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <div>
            <Box className="navbar-nav">
                <Box>
                    <img src={logo} alt="img" />
                </Box>
                <Box className="nav-link">
                    <Link
                        className="i-want"
                        href="#"
                        sx={{
                            color: theme.palette.primary.darker,
                            "&:hover": {
                                color: theme.palette.primary.darker,
                            },
                        }}
                    >
                        Je veux proposer la solution à mes clients&nbsp;!
                    </Link>
                    <Box className="buttons">
                        <Button
                            sx={{
                                color: theme.palette.primary.darker,
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Se connecter
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                borderRadius: '100px',
                                paddingInline: '30px',
                                fontWeight: '500'
                            }}
                            onClick={() => navigate("/signup")} >
                            S’inscrire
                            <img src={sinscrire} alt="img" />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default Header;
