import './App.css';
import React, { useEffect, useState } from 'react';
import TrainWidget from './TrainWidget';
import CitibikeWidget from './CitibikeWidget';

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

        let hobokenStation = data.results.find(station => station.consideredStation === "HOB");
        const hobokenToNYC = hobokenStation?.destinations?.find(
          des => des.label === 'ToNY'
        );
        if (hobokenToNYC && hobokenToNYC.messages.length > 0) {
          const filteredMessages = hobokenToNYC.messages
            .filter(msg => msg.target === "33S")
            .map(msg => msg.arrivalTimeMessage);
          setNextDepartures(filteredMessages);
        } else {
          setNextDepartures([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch PATH times: ' + err.message);
        setNextDepartures([]);
      }
    }

    fetchPathTimes();
    const interval = setInterval(fetchPathTimes, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

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
    <div className="App">
      <header className="dashboard-header">
        {/* LEFT COLUMN: Train, Citibike, Todoist */}
        <div className="left-column">
          <div className="top-row">
            <TrainWidget
              error={error}
              nextDepartures={nextDepartures}
              refreshing={refreshing}
            />
            <CitibikeWidget
              citibikeError={citibikeError}
              citibikeInfos={citibikeInfos}
            />
          </div>
          <div className="todoist-container">
            <div className="todoist-widget">
              <div className="todoist-iframe-container">
                <iframe
                  src="https://todoist.com/app/todoist"
                  className="todoist-iframe"
                  frameBorder="0"
                  title="Todoist"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT COLUMN: Calendar */}
        <div className="right-column">
          <div className="right-column-content">
            <div className="calendar-iframe-container">
              <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=AGENDA&src=dmlzaHZlbmRyYXNpbmdocmF0aG9yZUBnbWFpbC5jb20&src=OW5qcnFlbXM0N2F1Nzhsa2M0dWw5Y2l2b2dAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MjkxMjVjMWRkMDlkNWU0NWFmZmZhZWNlMWVmYjA5ODEzYWJiZDVhN2FlNTMyOWU3ZjY4ZDY4ZTc5OWU5N2JhN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb&color=%23c0ca33&color=%238e24aa"
                className="calendar-iframe"
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
