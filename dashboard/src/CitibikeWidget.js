import React from "react";

function CitibikeWidget({ citibikeError, citibikeInfos }) {
  return (
    <div className="widget">
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
  );
}

export default CitibikeWidget;