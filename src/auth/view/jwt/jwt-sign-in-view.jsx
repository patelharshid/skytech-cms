import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, IconButton, InputAdornment, Link, Paper, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useBoolean } from 'minimal-shared/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import apiService from 'src/services/ApiService';
import { login } from 'src/store/reducers/authReducer';
import { z as zod } from 'zod';

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required.' }).email(),
  password: zod
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

export function JwtSignInView() {
  const dispatch = useDispatch();
  const showPassword = useBoolean();
  const navigate = useNavigate();

  const webAppVersion = import.meta.env.VITE_APP_VERSION;
  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    // values.domainName = 'witty-forest-09943ce10.1.azurestaticapps.net';

    const { data, errors } = await apiService.loginAsync(values);

    if (data?.session && data?.refresh && data?.user) {
      const token = { session: data.session, refresh: data.refresh };
      const user = data.user;
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      const currentTokenUser = {
        ...jwtDecode(token.session),
        ...user,
        teacherId: user.userId,
        teacherName: fullName,
        name: fullName || user.email,
      };

      dispatch(login({ teacher: currentTokenUser, token }));
      navigate('/dashboard/teacher');
    } else if (errors?.length) {
      setErrorMessage(errors[0]?.msg || 'Login failed. Please check your credentials.');
    } else {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Admin Email"
        placeholder="admin@skytech.com"
        maxLength={100}
        type="email"
      />
      <Field.Text
        name="password"
        label="Password"
        placeholder="Enter your password"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Link
        component={RouterLink}
        href={paths.auth.forgotPassword}
        variant="body2"
        sx={{ alignSelf: 'flex-end', color: '#f59e0b' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          color: '#090d16',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
          },
        }}
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign In to Dashboard
      </LoadingButton>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} align="center">
        Version {webAppVersion}
      </Typography>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 3, sm: 4.5 },
        borderRadius: 3,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(245, 158, 11, 0.12)',
        backdropFilter: 'blur(24px)',
        '& .MuiTypography-root': { color: '#f8fafc' },
        '& .MuiTypography-subtitle2': { color: '#94a3b8' },
        '& .MuiInputLabel-root': { color: '#94a3b8' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
        '& .MuiOutlinedInput-root': {
          color: '#f8fafc',
          backgroundColor: 'rgba(20, 31, 54, 0.75)',
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.24)' },
          '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
        },
        '& .MuiInputAdornment-root .MuiButtonBase-root': { color: '#94a3b8' },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '18px',
            color: '#080c14',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 8px 26px rgba(245, 158, 11, 0.25)',
          }}
        >
          <Iconify icon="solar:shield-check-bold" width={32} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          SkyTech CMS
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.75, color: '#94a3b8' }}>
          Sign in to manage website announcements and content
        </Typography>
      </Box>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </Paper>
  );
}
