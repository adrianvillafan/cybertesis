// src/hooks/useUser.js
import { useContext } from 'react';
import UserContext from '../components/dashboard/contexts/UserContext';

export const useUser = () => useContext(UserContext);
