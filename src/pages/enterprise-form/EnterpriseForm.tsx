import "./enterpriseForm.scss";
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import endIcon from "../../assets/end-icon.svg";
import Step1 from "./components/step1/Step1";
import Step2 from "./components/step2/Step2";
import Step3 from "./components/step3/Step3";
import Step4 from "./components/step4/Step4";
import { useGetScrollToTop } from 'src/hooks/use-scroll-to-top';
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import { Box, Button, Grid, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { addCompanyData, clearFormData, addEbidtaData, addRatingData, addFinancialCriteriaDataAndCalculateResult, addSiren, setHasSasData, resetGoodwillStep } from "src/store/slices/enterpriseForm";
import { useAppSelector } from "src/hooks/use-app-selector";
import { getDoc, doc } from "firebase/firestore";
import { db } from "src/firebase/firebase";
import HeaderSection from "../header/header";
import { addSirenData } from "src/store/slices/enterpriseForm";

const initialSteps = ["Étape 1", "Étape 2", "Étape 3", "Étape 4"]


const EnterpriseForm = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const scrollToTop = useGetScrollToTop()
  const [searchParams] = useSearchParams()
  const enterpriseId = searchParams.get('enterpriseId');

  const [anchorEl, setAnchorEl] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isStarting, setIsStarting] = useState(true)
  const [steps, setSteps] = useState<Array<string>>(initialSteps)

  const { is3rdStepSkipped } = useAppSelector((state) => state.enterpriseForm)


  const handlePriFill = async () => {
    if (enterpriseId) {
      const docRef = doc(db, "enterprise", enterpriseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const result = docSnap?.data()
        if (result) {
          dispatch(
            addSirenData({
              siren: result?.enterpriseDetails?.siren,
              SASCode: result?.enterpriseDetails?.SASCode,
            })
          );
          dispatch(
            addCompanyData({
              valueBasedOn: result?.enterpriseDetails?.valueBasedOn,
              maturity: result?.enterpriseDetails?.maturity,
              FEC: null
            })
          );
          dispatch(addEbidtaData(
            result?.ebidtaDetails
          ))
          dispatch(addRatingData(
            result?.ratingDetails
          ))
          dispatch(addFinancialCriteriaDataAndCalculateResult(
            result.financialCriteria
          ))
          dispatch(
            addSiren(false)
          )
          dispatch(
            setHasSasData(true)
          )
        }
      }
    }
  }

  const handleNextStep = () => {
    if (currentStep === steps.length - 1) {
      return;
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    if (currentStep === 0) {
      return;
    }
    if (currentStep - 1 === 1) {
      dispatch(resetGoodwillStep())
    }
    setCurrentStep(currentStep - 1)
  }

  const handleStartNewEnterpriceRegistration = () => {
    dispatch(clearFormData())
    setIsStarting(false)
  }

  const handleStartEditEnterpriceRegistration = () => {
    setIsStarting(false)
  }


  useEffect(() => {
    scrollToTop()
  }, [currentStep, isStarting])

  useEffect(() => {
    if (is3rdStepSkipped) {
      setSteps(() => {
        const tmpSteps = [...initialSteps]
        tmpSteps.pop() // Removed 1 step
        return tmpSteps
      })
    } else if (steps.length < 4) {
      setSteps(() => {
        const tmpSteps = [...initialSteps]
        // tmpSteps.push('Étape 4') // Add 1 step
        return tmpSteps
      })
    }
  }, [is3rdStepSkipped])

  useEffect(() => {
    if (enterpriseId) handlePriFill()
  }, [enterpriseId])


  return (
    <Box>

      <HeaderSection setAnchorEl={setAnchorEl} anchorEl={anchorEl} />
      <Box className="stepperWrp">
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Box
              className="stepperBox"
              sx={{ backgroundColor: theme.palette.grey["200"] }}
            >
              <Box className="stepperList">
                <Stepper alternativeLabel activeStep={isStarting ? -1 : currentStep}>
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Button
                className="backButton"
                startIcon={<KeyboardArrowLeftRoundedIcon />}
                variant="contained"
                color="secondary"
                onClick={handlePreviousStep}
              >
                Retour
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className="stepperContent">

              <>
                {isStarting ? (
                  <>
                    {/* form-Model */}
                    <Box
                      className="stepperDefaultModel"
                      sx={{
                        "&:after": {
                          backgroundColor: theme.palette.grey['0'],
                        }
                      }}
                    >
                      <Typography variant="h2" className="modelTitleText" sx={{ color: "primary.darker" }}>
                        Il est temps de découvrir la valorisation de votre
                        entreprise.
                      </Typography>
                      <Typography variant="caption" className="modelSubTitle" sx={{ color: "primary.darker" }}>
                        Avec Hermès, effectuez la valorisation de votre
                        entreprise gratuitement.
                      </Typography>
                      <Button
                        className='buttonModel'
                        variant="contained"
                        color="secondary"
                        endIcon={<img src={endIcon} alt="" />}
                        onClick={() => {
                          if (!enterpriseId) {
                            handleStartNewEnterpriceRegistration()
                          } else {
                            handleStartEditEnterpriceRegistration()
                          }
                        }}
                      >
                        Commencer la valorisation{" "}
                      </Button>
                    </Box>
                    {/* End form-Model */}
                  </>
                ) : (
                  <>
                    {currentStep === 0 && (
                      <Step1
                        handleNextStep={handleNextStep}
                      />
                    )}
                    {currentStep === 1 && (
                      <Step2
                        handleNextStep={handleNextStep}
                      />
                    )}
                    {currentStep === 2 && !is3rdStepSkipped && (
                      <Step3
                        handleNextStep={handleNextStep}
                      />
                    )}
                    {(currentStep === 3 || (is3rdStepSkipped && currentStep === 2)) && (
                      <Step4
                      // handleNextStep={handleNextStep}
                      />
                    )}
                  </>
                )}
              </>

            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default EnterpriseForm;
