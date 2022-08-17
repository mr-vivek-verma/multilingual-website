import { Suspense } from 'react';
import './i18n';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {  description: {
            part1: 'Date: ',
            part2: 'Name:',
            part3:"Email:",
            part4:"Location",
            part5:"latitude:",
            part6:"longitude:",
            part7:"submit",
            part8:"Logout",
            part9:"FORM",
            part10:"Back to Home",
            part11:"delete",
            part12:"Nearby User's Location",
            part13:"Km",
            part14:"Click here",
            part15:"Back to dashboard",
        },
           SignUP:{
            1:"Login",
            2: "Login with Google",
            3: "Forgot Password",
            4: "Don't have an account?",
            5:"Register",
            6:"Register with Google",
            7: "Don't have an account?",
                 }
        }
      },
        hn: {
        translation: {
          description: {
            part1:'दिनांक:',
            part2: 'नाम:',
            part3:"ईमेल :",
            part4:"स्थान",
            part5:"अक्षांश:",
            part6:"देशांतर:",
            part7:"प्रस्तुत",
            part8:"लॉग आउट",
            part9:"प्रपत्र",
            part10:"घर वापिस जा रहा हूँ",
            part11:"मिटाना",
            part12:"आस-पास के उपयोगकर्ता का स्थान",
            part13:"किमी",
            part14:"यहां क्लिक करें",
            part15:"डैशबोर्ड पर वापस",
            },
                     SignUP:{
            1:"लॉगिन",
            2: "गूगल के साथ लॉगिन करें",
            3: "पासवर्ड भूल गए" ,
            4: "खाता नहीं है? अभी पंजीकरण करें",
            5:"पंजीकरण",
            6:"गूगल के साथ पंजीकरण करें",
            7: "खाता नहीं है? अभी लॉगिन करें",
                             }
        }
      }
    }
  });
export default i18n;