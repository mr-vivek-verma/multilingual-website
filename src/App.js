import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Reset from './pages/Reset';
import Dashboard from './pages/Dashboard';
import "./styles.css";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./languageSelect";
import TextField from "@material-ui/core/TextField";
import Navbar from "./components/Nabar";
import Page from "./pages/Home"

// const lngs = {
//   en: { nativeName: 'English' },
//   hn: { nativeName: 'Hindi' }
// };            
function App() {
  const { t } = useTranslation();
  return (   
    <>
    <div>
    {/* <Navbar/> */}
    <LanguageSelect />
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />}/>
          <Route exact path="/home" element={<Page />}/>
          
        </Routes>
      </Router>
    </div>
       
    {/* <div className="language-select">
        <LanguageSelect />
    </div>
    <div className="App">
      <div className="example-text">
        <p>{t("hello_welcome_to_react")}</p>
        <p>{t("this_is_an_example")}</p>
        <TextField
          label={t("please_enter_name")}
          color="primary"
          variant="outlined"
          className='field'
        />
      </div> */}
    {/* </div> */}
    
    </>
  );
}

export default App;