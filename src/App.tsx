import { useScrollToTop } from './hooks/use-scroll-to-top';
import { LocalizationProvider } from './locales';
import { SettingsDrawer, SettingsProvider } from './components/settings';
import ThemeProvider from './theme';
import { MotionLazy } from './components/animate/motion-lazy';
import { SnackbarProvider } from './components/snackbar';
import ProgressBar from './components/progress-bar';
import Router from './routes/sections';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from '@mui/system';

function App() {

  useScrollToTop()

  // useEffect(() => {
  //   onAuthStateChanged(auth, (userData) => {
  //     if (!userData) {
  //       logout()
  //     }
  //   })
  // }, [])


  return (
    <LocalizationProvider >
      <SettingsProvider
        defaultSettings={{
          themeMode: 'dark', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <SettingsDrawer />
              <ProgressBar />
              <ToastContainer />
              <Box sx={{ background: '#ffffff' }}>
                <Router />
              </Box>
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  )
}

export default App;