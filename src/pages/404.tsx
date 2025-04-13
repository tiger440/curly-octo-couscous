import { Box } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px',
          textAlign: 'center'
        }}
      >
        <NotFoundView />
      </Box>
    </>
  );
}
