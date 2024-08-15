import { Navbar, BigSidebar, SmallSidebar } from '../components';
import { Outlet, redirect,useLoaderData  } from 'react-router-dom';
import Wrapper from'../assets/wrappers/Dashboard';
import { useState, createContext, useContext } from 'react';
import { checkDefaultTheme } from '../App';


export const loader = () =>{
  return "Hello World";
}

const DashboardContext = createContext();
const Dashboard = () => {
  // temp
  const user = { name: 'john' };

  const data = useLoaderData();
  console.log(data);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const Dashboard = ({ isDarkThemeEnabled }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);
  };


  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    console.log('logout user');
  };
  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default Dashboard;