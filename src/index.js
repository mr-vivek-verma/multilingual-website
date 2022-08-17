import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Suspense } from 'react';
import './i18n'
// import i18n (needs to be bundled ;)
// import "./i18nextConf";

window.onload = function (e) {
  getlocation(e);
 }
  const getlocation = async (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (getCurrentPosition) {
        const coords = [{
          "lati": getCurrentPosition.coords.latitude,
          "longi": getCurrentPosition.coords.longitude
        }]
        localStorage.setItem("Cords", JSON.stringify(coords))
      });
    } else {
      alert("error occured while fetching your location")
    }
  }
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
  <Suspense fallback="...is loading">
   <App />
    </Suspense>
  </React.StrictMode>
);