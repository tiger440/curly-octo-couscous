import './Card.scss'
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import profileIcon from "../../../../assets/logo-small.png";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Avatar, Box, Button, Card, Grid, IconButton, Typography, useTheme, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdviceCard = ({ data, index, anchorEl, setAnchorEl, getAllCollections }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleClick = (event, idx) => {
    setAnchorEl({ ...anchorEl, [idx]: event.currentTarget });
  };

  const handleClose = (idx) => {
    setAnchorEl({ ...anchorEl, [idx]: null });
  };

  const handleDeleteValuation = () => {
    setShowWarning(true)
    handleClose(index)
  }

  const closeWarning = () => {
    setShowWarning(false)
  }

  const deleteValuation = async () => {
    setIsLoading(true)
    deleteDoc(doc(db, "enterprise", data.id)).then(() => {
      setShowWarning(false)
      getAllCollections()
    }).catch((err) => {
      console.log('err', err)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card variant="outlined" className="entrepriseCard">
          <Box
            className="profile"
            sx={{
              borderBottom: `1px dashed ${theme.palette.grey["300"]}`,
            }}
          >
            <Box className="profileImage">
              <Avatar
                sx={{ bgcolor: theme.palette.primary.dark }}
                variant="rounded"
              >
                <img src={profileIcon} alt="" />
              </Avatar>
            </Box>
            <Box className="profileText">
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary }}
              >
                {data?.value?.enterpriseName ? data?.value?.enterpriseName : 'Nom entreprise'}
              </Typography>
              <Typography
                component={"span"}
                className="cardDate"
                sx={{ color: theme.palette.text.disabled }}
              >
                Déposé le : <Typography>{data.value?.entrepriseData?.uniteLegale?.dateCreationUniteLegale ? data?.value?.entrepriseData?.uniteLegale?.dateCreationUniteLegale : 'NA'}</Typography>
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="more"
            className="cardMenu"
            id="long-button"
            aria-haspopup="true"
            onClick={(event) => handleClick(event, index)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl[index]}
            open={Boolean(anchorEl[index])}
            onClose={() => handleClose(index)}
          >
            <MenuItem onClick={() => { return setAnchorEl(null), navigate(`/result?enterpriseId=${data.id}`) }}>
              <RemoveRedEyeIcon sx={{ mr: 1.2 }} />
              Résultat
            </MenuItem>
            <MenuItem onClick={() => { return setAnchorEl(null), navigate(`/valuation?enterpriseId=${data.id}`); }}>
              <EditIcon sx={{ mr: 1.2 }} />
              Modifier
            </MenuItem>
            <MenuItem onClick={handleDeleteValuation} sx={{ color: theme.palette.error.main }}>
              <DeleteIcon sx={{ mr: 1.2 }} />
              Supprimer
            </MenuItem>
          </Menu>
          <Box className="capitalBox">
            <Button
              sx={{ backgroundColor: theme.palette.secondary.main }}
              variant="contained"
            >
              {data?.value?.total}
            </Button>
            <Button
              variant="text"
              sx={{ color: theme.palette.primary.main }}
              onClick={() => navigate(`/result?enterpriseId=${data.id}`)}
            >
              Voir plus
            </Button>
          </Box>
        </Card>
      </Grid>


      <Dialog
        open={showWarning}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
        keepMounted
        onClose={closeWarning}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Typography variant='h4' sx={{ fontSize: 30 }}> Es-tu sûr? </Typography>
        </DialogTitle>

        <DialogContent>
          Voulez-vous vraiment supprimer l'évaluation ?
        </DialogContent>

        <DialogActions>
          <LoadingButton
            loading={isLoading}
            type="submit"
            onClick={deleteValuation}
            size="medium"
            variant="contained"
            sx={{
              backgroundColor: theme.palette.error.dark,
              color: "white",
            }}
          >
            Supprimer
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={closeWarning}
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              color: theme.palette.primary.main,
            }}
            size="medium"
          >
            Retour
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdviceCard
