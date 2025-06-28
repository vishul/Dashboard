import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
let christopherStreetId = '66dbc8f5-0aca-11e7-82f6-3863bb44ef7c';
let officeId = '';
let gymId = '';
function App() {
  const [nextDepartures, setNextDepartures] = useState([]);
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0); // To restart animation
  const [refreshing, setRefreshing] = useState(false);
  const [citibikeInfos, setCitibikeInfos] = useState([]);
  const [citibikeError, setCitibikeError] = useState(null);
  const scrollDuration = 4000; // ms

  useEffect(() => {
    async function fetchPathTimes() {
      try {
        // Use a public CORS proxy for development only
        const corsProxy = 'https://corsproxy.io/?';
        const url = corsProxy + encodeURIComponent('https://www.panynj.gov/bin/portauthority/ridepath.json');
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched PATH data:', data);

        // If data is an array, find the object with consideredStation === "HOB"

        let hobokenStation = data.results.find(station => station.consideredStation === "HOB");
        // Find the Hoboken to 33rd St route
        const hobokenToNYC = hobokenStation?.destinations?.find(
          des => des.label === 'ToNY'
        );
        if (hobokenToNYC && hobokenToNYC.messages.length > 0) {
          setNextDepartures(hobokenToNYC.messages.map(msg => msg.arrivalTimeMessage));
        } else {
          setNextDepartures([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching PATH times:', err);
        setError('Failed to fetch PATH times: ' + err.message);
        setNextDepartures([]);
      }
    }

    fetchPathTimes();
    const interval = setInterval(fetchPathTimes, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Scroll to next after animation ends
  useEffect(() => {
    if (nextDepartures.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIdx(idx => (idx + 1) % nextDepartures.length);
      setAnimKey(k => k + 1); // Restart animation
    }, scrollDuration);
    return () => clearTimeout(timer);
  }, [currentIdx, nextDepartures]);

  useEffect(() => {
    if (nextDepartures.length === 0) return;
    setRefreshing(true);
    const timeout = setTimeout(() => setRefreshing(false), 600); // duration matches CSS
    return () => clearTimeout(timeout);
  }, [nextDepartures]);

  // Create a single string with 5 spaces between each time
  const marqueeText =
    nextDepartures.length > 0
      ? nextDepartures.join('     ') + '     ' // 5 non-breaking spaces
      : '';

  const citibikeStations = [
    {
      id: 'e8a6c13b-1f6e-4e6b-bdf8-9b0e597e4a62',
      name: '8th & 16th St'
    },
    {
      id: '1929504694747056164',
      name: 'Chelsea Piers'
    },
    {
      id: '66dbc8f5-0aca-11e7-82f6-3863bb44ef7c',
      name: 'Christopher St'
    }
  ];

  // Fetch Citibike info
  useEffect(() => {
    async function fetchCitibike() {
      try {
        const url = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json';
        const response = await fetch(url);
        const data = await response.json();
        const infos = citibikeStations.map(station => {
          const found = data.data.stations.find(s => s.station_id === station.id);
          return found
            ? {
                name: station.name,
                bikes: found.num_bikes_available,
                docks: found.num_docks_available
              }
            : {
                name: station.name,
                bikes: 'N/A',
                docks: 'N/A'
              };
        });
        setCitibikeInfos(infos);
        setCitibikeError(null);
      } catch (err) {
        setCitibikeInfos([]);
        setCitibikeError('Failed to fetch Citibike info: ' + err.message);
      }
    }
    fetchCitibike();
    const interval = setInterval(fetchCitibike, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App" style={{ background: "#181818", minHeight: "100vh" }}>
      <header className="App-header">
        {/* Train Widget */}
        <div
          style={{
            background: "#23272f",
            padding: "24px",
            borderRadius: "16px",
            display: "inline-block",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            position: "relative",
            width: "100%",
            maxWidth: "850px",
            boxSizing: "border-box",
            marginBottom: "24px"
          }}
        >
          <div className="train-widget">
            <div className="train-widget-header">
              <strong>HOB -&gt; 33rd</strong>
              <span className="train-animation" role="img" aria-label="train" style={{ marginLeft: 10 }}>🚂</span>
            </div>
            {error && <span style={{ color: "red" }}>{error}</span>}
            {!error && (
              <div className="scroll-box">
                {nextDepartures.length > 0 ? (
                  <table className={`departures-table${refreshing ? " refreshing" : ""}`}>
                    <tbody>
                      <tr>
                        {nextDepartures.slice(0, 3).map((time, idx) => (
                          <td className="departure-cell" key={idx}>{time}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Calendar Widget */}
        <div
          style={{
            background: "#23272f",
            padding: "24px",
            borderRadius: "16px",
            display: "inline-block",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            position: "relative",
            width: "100%",
            maxWidth: "850px",
            boxSizing: "border-box",
            marginBottom: "24px"
          }}
        >
          <div style={{ position: "relative", width: "100%", paddingTop: "75%" }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=AGENDA&src=dmlzaHZlbmRyYXNpbmdocmF0aG9yZUBnbWFpbC5jb20&src=OW5qcnFlbXM0N2F1Nzhsa2M0dWw5Y2l2b2dAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MjkxMjVjMWRkMDlkNWU0NWFmZmZhZWNlMWVmYjA5ODEzYWJiZDVhN2FlNTMyOWU3ZjY4ZDY4ZTc5OWU5N2JhN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb&color=%23c0ca33&color=%238e24aa"
              style={{
                border: 'solid 1px #444',
                borderRadius: "8px",
                background: "#23272f",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                filter: "invert(1) hue-rotate(180deg)"
              }}
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Citibike Widget */}
        <div
          style={{
            background: "#23272f",
            padding: "24px",
            borderRadius: "16px",
            display: "inline-block",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            position: "relative",
            width: "100%",
            maxWidth: "850px",
            boxSizing: "border-box",
            marginBottom: "24px",
            marginTop: "24px"
          }}
        >
          <div className="citibike-widget">
            <div className="citibike-widget-header">
              <strong>Citibike Stations</strong>
              <span role="img" aria-label="bike" style={{ marginLeft: 10 }}>🚲</span>
            </div>
            {citibikeError && <span style={{ color: "red" }}>{citibikeError}</span>}
            {!citibikeError && citibikeInfos.length > 0 ? (
              <table className="citibike-table" style={{ marginTop: 12, width: "100%", color: "#fff" }}>
                <thead>
                  <tr>
                    <th align="left">Station</th>
                    <th align="left">Bikes Available</th>
                    <th align="left">Empty Docks</th>
                  </tr>
                </thead>
                <tbody>
                  {citibikeInfos.map((info, idx) => (
                    <tr key={idx}>
                      <td>{info.name}</td>
                      <td>{info.bikes}</td>
                      <td>{info.docks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !citibikeError && <span>Loading...</span>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
