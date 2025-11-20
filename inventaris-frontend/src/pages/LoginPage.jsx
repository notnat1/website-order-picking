import companyLogo from '/icon-website.png';
import mobileLogo from '/logo tanpa text.png';

// --- STABLE MOBILE VIEW COMPONENT ---
const MobileView = ({
  error,
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  loading
}) => (
  <>
    <div className="login-background-animations"></div>
    <div className="mobile-login-wrapper">
      <div className="mobile-logo-container">
        <img src={mobileLogo} alt="Company Logo" className="mobile-logo" />
        <h1 className="mobile-company-name">PT. HASJRAT ABADI</h1>
      </div>
      {error && <Alert variant="danger" dismissible>{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100 mobile-form">
        <div className="mobile-form-group">
          <label htmlFor="mobile-username">Username</label>
          <div className="input-wrapper">
            <Person className="input-icon" />
            <input id="mobile-username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} className="mobile-form-control" />
          </div>
        </div>
        <div className="mobile-form-group">
          <label htmlFor="mobile-password">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input id="mobile-password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="mobile-form-control" />
          </div>
        </div>
        <button className="mobile-login-btn" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'SIGN IN'}
        </button>
      </Form>
    </div>
  </>
);

// --- STABLE DESKTOP VIEW COMPONENT ---
const DesktopView = ({
  error,
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading
}) => (
  <>
    <div className="login-card">
      <div className="login-panel left">
        <div className="desktop-login-wrapper">
          <div className="login-logo">
            <img src={companyLogo} alt="Company Logo" />
            <h3 className="company-name-desktop">PT. HASJRAT ABADI</h3>
          </div>
          {error && <Alert variant="danger" dismissible>{error}</Alert>}
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Floating className="mb-3">
              <Form.Control id="desktop-floatingUsername" type="text" placeholder="Masukkan username Anda" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
              <label htmlFor="desktop-floatingUsername">Username</label>
            </Form.Floating>
            <Form.Floating className="mb-4">
              <Form.Control id="desktop-floatingPassword" type={showPassword ? "text" : "password"} placeholder="Masukkan password Anda" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              <label htmlFor="desktop-floatingPassword">Password</label>
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlash /> : <Eye />}
              </span>
            </Form.Floating>
            <Button className="w-100 btn-accent desktop-login-btn-gradient" type="submit" disabled={loading} style={{ height: '45px' }}>
              {loading ? <Spinner animation="border" size="sm" /> : 'SIGN IN'}
            </Button>
          </Form>
        </div>
      </div>
      <div className="login-panel right login-panel-desktop">
        <h2>Hello, Employee!</h2>
        <p className="lead" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px' }}>
          Selamat datang kembali di sistem Inventory & Order Picking perusahaan. Silakan login untuk melanjutkan pekerjaan Anda.
        </p>
      </div>
    </div>
  </>
);


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const commonProps = {
    error,
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
    loading
  };

  return (
    <div className="login-container">
      {isMobile 
        ? <MobileView {...commonProps} /> 
        : <DesktopView {...commonProps} showPassword={showPassword} setShowPassword={setShowPassword} />
      }
    </div>
  );
};

export default LoginPage;