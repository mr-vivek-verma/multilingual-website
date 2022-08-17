import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
// import "./Dashboard.css";
import { auth, db } from "../firebase";
// import { deleteObject, ref } from "../firebase/storage";
import {
  query,
  collection,
  getDocs,
  orderBy,
  endAt,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { stringify } from "@firebase/util";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation, Trans } from "react-i18next";
import i18n from "../i18n";
// import SearchInput from "../components/searchInput";
import { Geofire } from "geofire";
import geohash from "ngeohash";
import { startAt } from "firebase/database";
import { Button } from "@mui/material";
import "./Home.css";

const geofire = require("geofire-common");

function Home() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [loc, setLoc] = useState({});
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // const fetchUserName = async () => {

  //     const q = query(collection(db, "users"), where("uid", "===", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();

  //     setName(data.name);

  // };
  const [userLogin, setUserLogin] = useState({});
  const [subscribe, setSubscribe] = useState();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    let unsub = onAuthStateChanged(auth, (currentUser) => {
      setUserLogin(currentUser);
      // localStorage.setItem("userD",userLogin.email)
    });

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let geoArray = [];
      QuerySnapshot.forEach((doc) => {
        geoArray.push({ ...doc.data(), id: doc.id });
      });
      setSubscribe(geoArray);
      console.log("geoArra", geoArray);
      navigate("../home");
    });

    // fetchUserName();
  }, [user, loading]);

  const getlocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (getCurrentPosition) {
        const times = [
          {
            lati: getCurrentPosition.coords.latitude,
            longi: getCurrentPosition.coords.longitude,
          },
        ];
        localStorage.setItem("time", JSON.stringify(times));
        navigate("../home");
      });
    } else {
      alert("error while fetching location");
    }
  };
  const cordn = JSON.parse(localStorage.getItem("time"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "users"), {
      userLocation: cordn.map((location) => location),
      userName: name,
      createdAt: serverTimestamp(),
      email: userLogin.email,
      uid: userLogin.uid,
    });
    navigate("../home");
  };

  console.log("user loggin", userLogin.email);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteDoc(doc(db, "users", id));
    }
  };
  const locts = () => {
    const center = [20, 78];
    const radiusInM = `${loc}` * 10000;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const arr = [];
    for (const b of bounds) {
      const q = getDocs(
        collection(db, "users"),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1])
      );

      arr.push(q);
    }

    Promise.all(arr)
      .then((snapshots) => {
        const matchingDocs = [];
        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            let data = doc.data();
            let lat = Number(data.userLocation[0].lati);
            let lng = Number(data.userLocation[0].longi);
            const distanceInKm = geofire.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            console.log(distanceInM);
            if (distanceInM <= radiusInM) {
              matchingDocs.push(doc);
            }
          }
          return matchingDocs;
        }
      })
      .then((matchingDocs) => {
        setSubscribe(matchingDocs.map((doc) => doc.data()));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="dashboard">
      <div className="home_box1">
        <div className="searchInput">
          <input
            type="text"
            onChange={(e) => {
              setSearchVal(e.target.value);
            }}
            placeholder="Search Posts ... "
          />
        </div>
        <div className="location">
          <Trans i18nKey="description.part12">
            {" "}
            <span>Nearby User's Location</span>{" "}
          </Trans>
          <div className="inputfield">
            <i className="fa-solid fa-location-dot"></i>
            <input
              type="number"
              placeholder="within"
              step="2"
              min="0"
              value={loc}
              max="100"
              onChange={(e) => {
                setLoc(e.target.value);
              }}
            />{" "}
            <Trans i18nKey="description.part13">
              {" "}
              <span>Km</span>{" "}
            </Trans>
          </div>
          <Button
            sx={{
              backgroundColor: "#1164A3",
              color: "#ffff",
              mt: 1,
              "&:hover": {
                backgroundColor: "blue",
                fontWeight: 800,
              },
            }}
            onClick={() => {
              locts();
            }}
          >
            <Trans i18nKey="description.part14"> Click here </Trans>
          </Button>
        </div>
        <div className="home_box2">
          {subscribe &&
            subscribe
              .filter((data) => {
                if (searchVal === "") {
                  return data;
                } else if (
                  data.userName.toLowerCase().includes(searchVal.toLowerCase())
                ) {
                  return data;
                }
              })
              .map((data) => {
                return (
                  <div className="container">
                    <div>
                      <Trans i18nKey="description.part2">name: </Trans>
                      {data.userName}
                    </div>

                    <div>
                      <Trans i18nKey="description.part3">email: </Trans>
                      {data.email}
                    </div>
                    <div>
                      <Trans i18nKey="description.part4">Location: </Trans>
                    </div>
                    <div>
                      <div>
                        <Trans i18nKey="description.part5"> latitude: </Trans>
                      </div>
                      {data.userLocation && data.userLocation[0].lati}
                    </div>
                    <div>
                      <div>
                        <Trans i18nKey="description.part6"> longitude: </Trans>
                      </div>
                      {data.userLocation && data.userLocation[0].longi}
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleDelete(data.id);
                        }}
                      >
                        <Trans i18nKey="description.part11"> Delete </Trans>
                      </button>
                      ;
                    </div>
                  </div>
                );
              })}
        </div>
        <button>
          <Link to="/dashboard">
            <Trans i18nKey="description.part15"> Back to Dashboard</Trans>
          </Link>
        </button>
        
      </div>
    </div>
  );
}

export default Home;
