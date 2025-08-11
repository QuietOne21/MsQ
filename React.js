import React, {useState, useEffect, createContext, useCallback} from 'react;

  //Authentication Context - Global State management for auth
    const AuthContext = createContext(null);
    const useAuth = () => {
      const context = useContext(AuthContext); //Get context value
      if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };

    //Authentication Provider Component - Manages global auth state
    const [user, setUser] = useState(null); //Current user object
    const [loading, SetLoading] = useState(true) // Loading state for async opeations
    const [token, setToken] = useState(localStorage.getItem('token')); //JWT token from localStorage

    //API base URL - centralized configuration
    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
      const initializeAuth = async () => {
        const storedToken = localStorage.getItem('token'); //Get token from localStorage
        if(storedToken) {
          try {
            //Verify token by fetchingu user profile - http request
            const response = await fecth(`${API_BASE_URL}/profile`, {
              headers: {
                'Authentication': `Bearer ${storedToken}`,// Include auth header
                'Content-Type': `application/json`
              }
            });

            if(response.ok) {
              const data = await response.json(); //Parse JSON response
              serUser(data.user); //  Set current user
              setToken(storedToken); //Set token state
            } else {
              localStorage.removeItem('token'); //Remove invalid token
              setToken(null); //Clear token state
            }
          }catch (error) {
            console.error('Auth initialization error: ', error);
            localStorage.removeItem('token');
            setToken(null);
          }
        }
        setLoading(false); // Set loading complete
      };
      initializeAuth();
    }, []); //Empty dependency array - runs once on mount


    //Login Function
    const login = useCallback(async (email, password) => {
      setLoading(true); 
      try {
        //Make API request
        const response = await fecth(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email, password}) //Serialize request body
        });

        const data = await response.json(); //Parse response

        if (response.ok) {
          //Login successful
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('token',data.token); //store token persistently
          return {success: true, message: data.token};
        } else{
          //Login failed
          return {success: false, error: data.error};
        }
      } catch (error) {
        console.error('Login error:', error);
        return {success: false, error: 'Network error occurred'};
        } finally {
          setLoading(false);
          }
      },[]); //No dependencies, function is stable

      //Register Function
      const register = useCallbac(async (useerData) => {
        setLoading(true);
        try {
          //Make registrarion API request
          const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          const data = await response.json();

          if(response.ok) {
            //Registration Successful
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            return {success: true, message: data.message};
          } else {
            //Registration failed
            return {success: false, message: data.error};
          } catch (error) {
            console.error('Registration error:',error);
            return {success: false, error: 'Network error occured'};
        } finally {
          setLoading(false);
        }
      },[]);


      //Logout function
      const logout = useCallback(async () => {
        try{
          if(token) {
            //Make logout API request
            await fetch(`${API_BASE_URL}/logout`,{
              method: 'POST',
              headers: {
                'Authorization':`Bearer ${token}`,
                'content-Type': 'application/json'
              }
            });
          }
        } catch (error) {
          console.error)'Logout error:',error);
        } finally {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
  }, [token]); //Depends on token


  const contextValue = {
    user, //Current user object
    loading, //Loading state
    token, //JWT token
    login, //Login function
    register, //Register function
    logout, //Logout function
    isAuthenticated: !!User //Boolean indicating if user is logged in
  };

  return (
    <AuthContext.Provider value={contextValue}>
    {children}
    </AuthContext.Provider>
  );
};

//Input Field Component with floating labels
const InputField = ({type, value, onChange, label, required = false, error}) => {
  return (
    <div className="input-field">
    <input
      type={type} //Input Type
      value={value} //Controlled input value
      onChange={onChange} //Change handler function
      required={required} //HTML Validation
      className={error ? 'error' : ''} //Conditional CSS class
    />

    <label className={value ? 'acitve' : ''}>{label}</label>

    <error && <span className="error-message">{error}</span>}
  </div>
);
};

//Form validation utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  const name = /^[a-zA-Z\s\-']{1,50}$/;
  return nameRegex.test(name);
};

const LoginForm - ({ onSwitchToRegister }) => {
  const {login, loading} = useAuth();

  const [formData, setFormulaData] = useState ({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({}); 
  const [submitError, setSubmitError] = useState(''); //API error messages

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({...prev, [field]: value}));

  //Clear field-specific error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({...prev, [field]: '' }));
  }

  if (submitError) {
    setSubmitError('');
  }
};

//Form validation function
const ValidateForm = () => {
  const newErrors ={}; //Object to store validation errors

  if(!formData.email.trim() {
    newErrors.email = 'Email is required';
  }else if (!validateEmail(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if(!formData.password) {
    newErrors.password = 'Password is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length) === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if(!ValidateForm()) return;
  const result = await login(formData.email, formData.password);

  if(!result.success){
    setSubmitError(result.error);
  }
};

return (
  <div className="wrapper">
    <form onSubmit={handleSubmit} id="loginForm">
      <h2>Login Form<\h2>

      {submitError && (
        <div className="error-banner">
            {submitError}
        </div>
  });

//Email input field
 <InputField
      type="email"
      value={formData.email}
      onChange={handleInputChange('email')}
      label="Enter your email"
      required
      error={errors.email}
  />

//Password input field
<InputField
      type="password"
      value={formData.password}
      onChange={handleInputChange('password')}
      label="Enter your password"
      required
      error={errors.password}
  />

//Forgot password link
<div className="forget">
    <a href="#" onClick={(e) => { e.preventDefault(); alert('Forgot password functionality would be implemented here'); }}>
    Forgot password?</a>
  </div>

//Submit button
 <button type="submit" disabled={loading}>
    {loading ? 'Logging in...' : 'Log In'}
  </button>

 //Register link
  <div className="register">
      <p>Don't have an account? 
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}> Register</a>
      </p>
  </div>

  //Social media links
  <div className="social-platforms">
          <p>Check out our social media accounts</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="X" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

//Register form component
const RegisterForm = ({ onSwitchToLogin}) =>
  const {register, loading} = useAuth();

//Form state using React hooks
const [formData, setFormData] = useState({
    name: '', 
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
 });

 //Error state for form validation
 const [errors, setErrors] = useState({});
 const [submitError, setSubmitError] = useState(''); 


 // Handle input changes
  const handleInputChange = (field) => (e) => {
    const value = e.target.value; 
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (submitError) {
      setSubmitError('');
    }
  };


 const validateForm = () => {
    const newErrors = {};
    
    //Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'First name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters, spaces, hyphens, and apostrophes (1-50 chars)';
    }
    
    //Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = 'Last name is required';
    } else if (!validateName(formData.surname)) {
      newErrors.surname = 'Surname must contain only letters, spaces, hyphens, and apostrophes (1-50 chars)';
    }
    
    //Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    //Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    //Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8-128 characters with uppercase, lowercase, number, and special character';
    }
    
    //Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    //Attempt registration via context function
    const result = await register(formData);
    if (!result.success) {
      setSubmitError(result.error);
    }
  };


  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} id="signUpForm">
        <h2>Create Account</h2>
        {submitError && (
          <div className="error-banner">
            {submitError}
      </div>
    )} 

 <InputField
    type="text"
    value={formData.name}
    onChange={handleInputChange('name')}
    label="Name"
    required
    error={errors.name}
  />

<InputField
    type="text"
    value={formData.surname}
    onChange={handleInputChange('surname')}
    label="Surname"
    required
    error={errors.surname}
 />

<InputField
    type="email"
    value={formData.email}
    onChange={handleInputChange('email')}
    label="Email"
    required
    error={errors.email}
/>


<InputField
    type="tel"
    value={formData.phone}
    onChange={handleInputChange('phone')}
    label="Phone Number"
    required
    error={errors.phone}
  />

<InputField
    type="password"
    value={formData.password}
    onChange={handleInputChange('password')}
    label="Create Password"
    required
    error={errors.password}
/>

<InputField
    type="password"
    value={formData.confirmPassword}
    onChange={handleInputChange('confirmPassword')}
    label="Confirm Password"
    required
    error={errors.confirmPassword}
  />


 <div className="signIn">
   <p>Already have an account? 
      <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
        login</a>
    </p>
  </div>


<button type="submit" disabled={loading}>
    {loading ? 'Creating Account...' : 'Submit'}
  </button>
</form>
  </div>
  );
};






