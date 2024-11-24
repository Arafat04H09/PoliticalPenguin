import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StateMap from "../Components/Maps/StateMap";
import EnsembleDisplay from "../Components/Ensemble/EnsembleDisplay";
import ClusterSummaryTable from "../Components/Clusters/ClusterSummaryTable";
import Header from "../Components/Header/Header";
import ClusterSummaryScatterPlot from "../Components/Clusters/ClusterSummaryScatterPlot";
import PlansTable from "../Components/Clusters/PlansTable";
import PlansScatterPlot from "../Components/Clusters/PlansScatterPlot";
import EnsembleAnalysis from "../Components/Ensemble/EnsembleAnalysis";
import PlanMap from "../Components/Maps/PlanMap";
import Whiskerplot from "../Components/Clusters/WhiskerPlot"


const StatePage = () => {
  const { stateName } = useParams();
  const [districtType, setDistrictType] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [stateMap, setStateMap] = useState(null);
  const [stateSummary, setStateSummary] = useState(null);
  const [stateTableSummary, setStateTableSummary] = useState(null);
  const [currentView, setCurrentView] = useState("select ensemble");
  const [selectedEnsemble, setSelectedEnsemble] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedScatterPoint, setSelectedScatterPoint] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTablePlanId, setSelectedTablePlanId] = useState(null);
  const [selectedPlanJson, setSelectedPlanJson] = useState(null);
  const [mapMode, setMapMode] = useState("top");
  const [viewHistory, setViewHistory] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState("Hamming Distance");

  useEffect(() => {
    if (stateName === "Florida" || stateName === "Ohio") {
      setDistrictType("Federal Congressional");
    } else {
      setDistrictType("State Assembly");
    }

    fetchStateMap();
    fetchSummary();

  }, [stateName]);

  const fetchData = async (ensemble) => {
    try {
      const summaryResponse = await fetch(
        `http://localhost:8080/${stateName}/summary`
      );
      const summaryData = await summaryResponse.json();
      const file = JSON.parse(summaryData["summary"]);

      for (let ens in file) {
        if (file[ens]["summary"]["nplans"] === ensemble) {
          setStateSummary(file[ens]);
        }
      }
      const ensembleResponse = await fetch(
        `http://localhost:8080/${stateName}/ensemble${ensemble}`
      );
      const ensembleResult = await ensembleResponse.json();
      setStateData(JSON.parse(ensembleResult['plan']));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryResponse = await fetch(
        `http://localhost:8080/${stateName}/summary`
      );
      const summaryData = await summaryResponse.json();
      const file = JSON.parse(summaryData["summary"]);
      setStateTableSummary(file);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchStateMap = async () => {
    try {
      const map = await fetch(
        `http://localhost:8080/${stateName}/curDistrictPlan`
      );
      const mapJson = await map.json();
      setStateMap(JSON.parse(mapJson["curDistrictPlan"]))

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleEnsembleSelect = (ensemble) => {

    setViewHistory((prevHistory) => [
      ...prevHistory,
      { view: currentView, state: { selectedCluster, selectedPlan } },
    ]);
    setSelectedEnsemble(ensemble['row']['size']);

    fetchData(ensemble['row']['size']);

    setSelectedDistance("Hamming Distance");
    setCurrentView("ensemble selected");
  };

  const handleClusterSelect = (params) => {
    setViewHistory((prevHistory) => [
      ...prevHistory,
      { view: currentView, state: { selectedCluster, selectedPlan } },
    ]);
    setSelectedCluster(params);
    setCurrentView("cluster selected");
  };

  const handlePlanScatterPointClick = (point) => {
    setSelectedScatterPoint(point);
    setSelectedTablePlanId(point.planId)
    if (stateData[point.planId]['geojson'] !== 'NA') {
      setSelectedPlanJson(stateData[point.planId]['geojson'])
    }
    else {
      setSelectedPlanJson(null);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedTablePlanId(plan);
    if (stateData[plan]['geojson'] !== 'NA') {
      setSelectedPlanJson(stateData[plan]['geojson'])
    }
    else {
      setSelectedPlanJson(null);
    }
  };

  const handleEnsembleAnalysisSelect = () => {
    setViewHistory((prevHistory) => [
      ...prevHistory,
      { view: currentView, state: { selectedCluster, selectedPlan } },
    ]);
    setCurrentView("ensemble analysis");
  };

  const handleBackClick = () => {
    setViewHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const lastHistory = newHistory.pop();
      setCurrentView(lastHistory.view);
      setSelectedCluster(lastHistory.state.selectedCluster);
      setSelectedPlan(lastHistory.state.selectedPlan);
      setSelectedScatterPoint(null);
      setSelectedPlanJson(null);
      setSelectedTablePlanId(null);

      return newHistory;
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "select ensemble":
        return (
          <div>
            <Header
              stateName={stateName}
              districtType={districtType}
              handleBackClick={handleBackClick}
              displayButton={false}
            />
            <div className="map-and-ensemble-container" >
              <StateMap plan={stateMap} />
              <EnsembleDisplay
                stateSummary={stateTableSummary}
                onEnsembleClick={handleEnsembleSelect}
                onAnalysisClick={handleEnsembleAnalysisSelect}
              />
            </div>
          </div>
        );

      case "ensemble analysis":
        return (
          <div style={{ width: "100%" }}>
            <Header
              stateName={stateName}
              districtType={districtType}
              handleBackClick={handleBackClick}
              displayButton={true}
            />
            <div
              className="analysis-container"
              style={{
                height: "50vh",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="ensemble-analysis-chart"
                style={{ width: "100%", height: "100%" }}
              >
                <EnsembleAnalysis stateName={stateName} />
              </div>
            </div>
          </div>
        );

      case "ensemble selected":
        return (
          <div>
            <div>
              <Header
                stateName={stateName}
                districtType={districtType}
                handleBackClick={handleBackClick}
                displayButton={true}
              />
            </div>
            <div>
              <div
                className="map-cluster-scatter-container"
                style={{ border: "solid" }}
              >
                <div
                  className="map-and-other-info"
                  style={{
                    display: "flex",
                    border: "solid",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="map-in-plan"
                    style={{ width: "50%", borderRight: "solid" }}
                  >
                    <StateMap plan={stateMap} />
                  </div>
                  <div className="fourth-quadrant" style={{ width: "50%" }}>
                    <h2>Select a Distance Measure</h2>
                    <select
                      onChange={(e) => setSelectedDistance(e.target.value)}
                      value={selectedDistance}
                    >
                      <option value="" disabled>
                        Select distance measure
                      </option>
                      {selectedEnsemble === 250 ? <>
                        <option value="Optimal Transport"> Optimal Transport </option>
                        <option value="Hamming Distance">Hamming Distance</option>
                        <option value="Entropy">Entropy</option> </> :
                        <>
                          <option value="Hamming Distance">Hamming Distance</option>
                          <option value="Entropy">Entropy</option>
                        </>
                      }
                    </select>
                    <Whiskerplot stateSummary={stateSummary} distanceMeasure={selectedDistance} />
                  </div>  
                </div>
                {selectedDistance && (
                  <div
                    className="table and scatter plot"
                    style={{ display: "flex", border: "solid" }}
                  >
                    <div
                      className="summary-table"
                      style={{ width: "50%", borderRight: "solid" }}
                    >
                      <ClusterSummaryTable
                        stateData={stateData}
                        onClusterSelect={handleClusterSelect}
                        distanceMeasure={selectedDistance}
                        stateSummary={stateSummary}
                      />
                    </div>
                    <div className="summary-scatter" style={{ width: "50%" }}>
                      <ClusterSummaryScatterPlot
                        stateSummary={stateSummary}
                        onClusterSelect={handleClusterSelect}
                        distanceMeasure={selectedDistance}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "cluster selected":
        return (
          <div>
            <div>
              <Header
                stateName={stateName}
                districtType={districtType}
                handleBackClick={handleBackClick}
                displayButton={true}
              />
            </div>
            <div className="map-cluster-scatter-container">
              <div
                className="map-and-other-info"
                style={{
                  display: "flex",
                  border: "solid",
                  borderBottom: "none",
                }}
              >
                <div
                  className="map-in-plan"
                  style={{ width: "50%", borderRight: "solid" }}
                >
                  <StateMap plan={stateMap} />
                </div>
                <div className="fourth-quadrant" style={{ width: "50%" }}>
                  {selectedTablePlanId != null ?
                    <PlanMap plan={selectedPlanJson} planId={selectedTablePlanId} /> :
                    <h2> Select a plan to view</h2>
                  }
                </div>
              </div>
              <div
                className="table and scatter plot"
                style={{ display: "flex", border: "solid" }}
              >
                <>
                  <div
                    className="summary-table"
                    style={{ width: "50%", borderRight: "solid" }}
                  >
                    <PlansTable
                      stateData={stateData}
                      onPlanSelect={handlePlanSelect}
                      distanceMeasure={selectedDistance}
                      stateSummary={stateSummary}
                      selectedCluster={selectedCluster}
                      selectedScatterPoint={selectedScatterPoint}
                    />
                  </div>
                  <div className="summary-scatter" style={{ width: "50%" }}>
                    <PlansScatterPlot
                      stateData={stateData}
                      stateSummary={stateSummary}
                      distanceMeasure={selectedDistance}
                      selectedCluster={selectedCluster}
                      onPlanScatterPointClick={handlePlanScatterPointClick}
                    />
                  </div>
                </>
              </div>
            </div>
          </div>
        );

      case "plan selected":
        break;

      default:
        return null;
    }
  };

  if (!stateName) return <div>Loading...</div>;

  return <div>{renderCurrentView()}</div>;
};

export default StatePage;
