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

      













                





