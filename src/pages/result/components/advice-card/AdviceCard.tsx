import { Button, Card, Typography, useTheme } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// const ITEM_HEIGHT = 48;

const OPTIONS = [
    {
        label: "Oui",
        value: "oui",
    },
    {
        label: "En cours",
        value: "enCours",
    },
    {
        label: "Non applicable",
        value: "nonApplicable",
    },
    {
        label: "Non",
        value: "non",
    },
];

const AdviceCard = ({ title, description, data, positiveDiff }) => {
    const theme = useTheme();
    // const [open, setOpen] = useState(false);
    // const [anchorEl, setAnchorEl] = useState(null);
    // const open = Boolean(anchorEl)

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // }

    // const handleClose = () => {
    //     setAnchorEl(null);
    // }

    return (
        <>
            <Card variant="outlined" className={`furtherCard ${data.answer}`}>
                {/* <IconButton
                    aria-label="more"
                    className="cardMenu"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton> */}
                {/* <Menu
                    id="long-menu"
                    MenuListProps={{
                        "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "150px",
                        },
                    }}
                >
                    
                        <MenuItem
                            key={option}
                            selected={option === "Pyxis"}
                            onClick={handleClose}
                        >
                          {'Edit'}
                        </MenuItem>
                    ))}
                </Menu>  */}

                <Typography variant="h5" width='100%'>
                    <div className={`title ${data.answer}`}>
                        <span className="titleText">{data ? data.title : title}</span>
                        <span className="separator"></span>
                        <Button
                            color="primary"
                            variant="contained"
                            className={`btn ${data.answer}`}
                        >
                            {OPTIONS.find((el) => el.value === data.answer)?.label || "En cours"}
                        </Button>
                        {positiveDiff && <>
                            <Typography className="positiveDiff" sx={{ color: theme.palette.success.main }}>
                                + {positiveDiff} &nbsp;
                                <Typography className="subTitle">Si sélectionnez oui</Typography>
                            </Typography>
                        </>}
                    </div>
                </Typography>
                <Typography
                    component="p"
                    sx={{ color: theme.palette.text.disabled }}
                >
                    {data ? data.description : description}
                </Typography>
                <Button color="primary" className="viewMore" variant="text">
                    En savoir plus
                </Button>
            </Card>
        </>
    );
};

export default AdviceCard;
