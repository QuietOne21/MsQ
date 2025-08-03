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
