'use client';

import { createContext, useContext, useEffect, useState } from 'react';
// import { quizzesData } from './QuizzesData';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  // const [user, setUser] = useState({});
  const [user, setUser] = useState({ isLogged: false, name: null, id: null });
  const [openIconBox, setOpenIconBox] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });

  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  // const [userXP, setUserXP] = useState(0);


  useEffect(() => {
    // On initial load, check for the auth token in localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
      // If a token exists, attempt to fetch user data
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/me', { // Your protected user info endpoint
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            // Update user state with fetched data
            setUser({ isLogged: true, name: userData.username, id: userData.userId }); // Adjust property names based on your API response
          } else {
            // Token might be invalid or expired, clear it
            localStorage.removeItem('authToken');
            setAuthToken(null);
            setUser({ isLogged: false, name: null, id: null });
          }
        } catch (error) {
          console.error('Error fetching user data on load:', error);
          // Handle error appropriately, maybe set user as not logged in
          setUser({ isLogged: false, name: null, id: null });
        } finally {
          setLoading(false); // Ensure loading is set to false after attempting to fetch
        }
      };

      fetchUserData();
      // setUser(prevUser => ({ ...prevUser, isLogged: true }));
    } else {
      // No token, user is not logged in
      setUser(prevUser => ({ ...prevUser, isLogged: false, name: null, id: null }));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch all quizzes
    const storedToken = localStorage.getItem('authToken');
    const fetchAllQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/quizzes', {
          cache: 'no-cache',
          headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${storedToken}`,
          }
        });

        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('fetching failed...');
        }

        const quizzesData = await response.json();

        setAllQuizzes(quizzesData);
        // console.log("test allQuizzes in context fetchallquizzes 2",quizzesData);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (storedToken) { 
      fetchAllQuizzes();
    }
  }, [authToken]);
  // console.log("test allQuizzes in context fetchallquizzes--",allQuizzes);
  
  
  // useEffect(() => {
  //   // Fetch the user
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/api/user', {
  //         method: 'POST',
  //         headers: {
  //           'Content-type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           name: 'quizUser',
  //           isLogged: false,
  //           // experience: 0,
  //         }),
  //       });

  //       if (!response.ok) {
  //         toast.error('Something went wrong...');
  //         throw new Error('fetching failed...');
  //       }

  //       const userData = await response.json();
  //       console.log(userData);

  //       if (userData.message === 'User already exists') {
  //         // If user already exists, update the user state with the returned user
  //         setUser(userData.user);
  //       } else {
  //         // If user doesn't exist, set the newly created user state
  //         setUser(userData.user);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // useEffect(() => {
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     experience: userXP,
  //   }));
  // }, [userXP]);

  useEffect(() => {
    if (selectedQuiz) {
      setSelectedIcon({ faIcon: selectedQuiz.icon });
    } else {
      setSelectedIcon({ faIcon: faQuestion });
    }
  }, [selectedQuiz]);

  // const updateAuthStatus = (token) => {
  //   if (token) {
  //     setAuthToken(token);
  //     setUser(prevUser => ({ ...prevUser, isLogged: true }));
  //     localStorage.setItem('authToken', token);
  //   } else {
  //     setAuthToken(null);
  //     setUser({ isLogged: false }); // Reset user state on logout
  //     localStorage.removeItem('authToken');
  //   }
  // };

  const updateAuthStatus = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('authToken', token);
      // When the auth token is updated (login/signup), fetch user data
      const fetchUserDataOnAuth = async () => {
        try {
          const response = await fetch('/api/user/me', { // Your protected user info endpoint
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({ isLogged: true, name: userData.username, id: userData.userId }); // Adjust property names
          } else {
            // Handle error, maybe log it
            console.error('Failed to fetch user data after authentication');
            setUser({ isLogged: true, name: null, id: null }); // Still mark as logged in, but name might be missing
          }
        } catch (error) {
          console.error('Error fetching user data after authentication:', error);
          setUser({ isLogged: true, name: null, id: null }); // Still mark as logged in, but name might be missing
        }
      };
      fetchUserDataOnAuth();
    } else {
      localStorage.removeItem('authToken');
      setUser({ isLogged: false, name: null, id: null }); // Reset user state on logout
    }
  };

  const userObject = { user, setUser };

  return (
    <GlobalContext.Provider
      value={{
        allQuizzes,
        setAllQuizzes,
        quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
        userObject,
        openBoxToggle: { openIconBox, setOpenIconBox },
        selectedIconObject: { selectedIcon, setSelectedIcon },
        dropDownToggleObject: { dropDownToggle, setDropDownToggle },
        threeDotsPositionsObject: { threeDotsPositions, setThreeDotsPositions },
        selectedQuizObject: { selectedQuiz, setSelectedQuiz },
        // userXpObject: { userXP, setUserXP },
        isLoadingObject: { isLoading, setLoading },
        authToken, // Expose the authToken if needed
        updateAuthStatus, // Function to update auth state
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobalContextProvider() {
  return useContext(GlobalContext);
}
