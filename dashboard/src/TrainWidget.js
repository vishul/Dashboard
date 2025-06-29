import React from "react";

function TrainWidget({ error, nextDepartures, refreshing }) {
  return (
    <div className="widget">
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
                    {nextDepartures.map((time, idx) => (
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
  );
}

export default TrainWidget;