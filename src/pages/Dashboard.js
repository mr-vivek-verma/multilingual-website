import React, { useEffect, useState } from "react";
import { useAuthState, } from "react-firebase-hooks/auth";
import { useNavigate,Link } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { stringify } from "@firebase/util";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation, Trans } from 'react-i18next';
import geohash from "ngeohash";
import { GeoFire } from "geofire";

      

function Dashboard() {
  const [user, loading ] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const {i18n } = useTranslation();
  
  // const fetchUserName = async () => {

  //     const q = query(collection(db, "users"), where("uid", "===", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();

  //     setName(data.name); 
    
  // };
  const [userLogin, setUserLogin]=useState({})
  const [subscribe, setSubscribe] = useState();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");       


    let unsub=onAuthStateChanged(auth, (currentUser)=>{
      setUserLogin(currentUser);
      // localStorage.setItem("userD",userLogin.email)

    })
    
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let geoArray = [];
      QuerySnapshot.forEach((doc) => {
        geoArray.push({ ...doc.data(), id: doc.id })
      });
      setSubscribe(geoArray)
      navigate("../dashboard")
    })

    // fetchUserName();                                    
  }, [user, loading]);

  const getlocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (getCurrentPosition) {
       const times = [{
         "lati": getCurrentPosition.coords.latitude,
         "longi": getCurrentPosition.coords.longitude
       }]
       localStorage.setItem("time",JSON.stringify(times))
       navigate("../home")
      });
    }else{  
      alert("error while fetching location")
    }
  }
  const loc = JSON.parse(localStorage.getItem('Cords'));
  const longi = loc[0].longi;
  const lati= loc[0].lati
  
  const hash = geohash.encode(lati, longi);
  console.log("from hash",hash)

  const cordn = JSON.parse(localStorage.getItem("time")) 

  const handleSubmit = async (e) =>{
    e.preventDefault();
    await addDoc(collection(db,"users"),{    
      userLocation: cordn.map((location) => location),
      userName:name,
      createdAt:serverTimestamp(),
      email: userLogin.email,
       uid:userLogin.uid,

    })
    navigate("../home")
  }

  console.log("user loggin", userLogin.email)




  return (
    <div className="box">
      <div className="dashboard__container">
      <form>
      <h2><Trans i18nKey="description.part9"> FORM</Trans></h2>
          <label>
          <Trans i18nKey="description.part2">Name: </Trans>
          </label>
          <input
            type="text"
            name="title"
            value={name}
            className="input"
            onChange={(e)=>setName(e.target.value)}
            />

            <br/><br/>
            
            <div className="location_form">
              {cordn && cordn.map((location) =>{
                return (<div key={location.name} className="box" style={{display:"block",textAlign:"center",height:"200px",}}

                >
                  <div><Trans i18nKey="description.part4">Location: </Trans></div>
                  <div><Trans i18nKey="description.part5">latitude: </Trans>{location.lati}</div>
                  <div><Trans i18nKey="description.part6">longitude:</Trans>{location.longi}</div>
                </div>            
                  
                )
              })}
            </div>
            <button className="location_btn" onClick={(e) => getlocation(e)}><Trans i18nKey="description.part4"> Location: </Trans></button>
            
        <br/><br/>
            <button className="submit_btn" onClick={(e) => {handleSubmit(e)}}><Trans i18nKey="description.part7"> submit: </Trans></button>
            <br/><br/>
        {/* <div>{name}</div>   
        <div>{user?.email}</div> */}
        
        <button className="dashboard__btn" onClick={logout}>
          <Trans i18nKey="description.part8"> Logout </Trans>
        </button>
        <br/><br/>
        <button className="home_btn"><Link to="/home"><Trans i18nKey="description.part10"> Back to Home </Trans></Link></button>
        </form>
      </div>
      <div>
        {subscribe && subscribe.map((data) =>{return(
          <div>
            <div>
              {data.name}
              
               
            </div>
          </div>
        )})}             
      </div>
      
    </div>
  );
}

export default Dashboard;