import React, { useState } from 'react';
import EnsembleClusterDisplay from './EnsembleClusterDisplay';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material";

const EnsembleDataTable = ({ clustersData }) => {
    const [showTable, setShowTable] = useState(true);
    const [selectedCluster, setSelectedCluster] = useState(null);

    const columns = [
        { field: 'clusterId', headerName: 'Cluster ID', width: 125 },
        { field: 'population', headerName: 'Population Number', width: 200 },
        { field: 'totalDistrict', headerName: 'Number of District Plans', width: 200 },
        { field: 'disPlan', headerName: 'Distance Between Plans', width: 200 },
        { field: 'repSplit', headerName: 'Republican Split', width: 200 },
        { field: 'demSplit', headerName: 'Democratic Split', width: 200 }
    ];

    const myTheme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    row: {
                        "&.Mui-selected": {
                            backgroundColor: "white",
                            "&:hover": {
                                backgroundColor: "white"
                            }
                        }
                    }
                }
            }
        }
    });

    const handleRowClick = (params) => {
        setSelectedCluster(params)
    };

    if (!showTable) return null;

    return (
        <div className="ensemble-data-modal">
            {selectedCluster && (
                <div className="ensemble-cluster-display-container">
                    <EnsembleClusterDisplay clusterId={selectedCluster} />
                    <button className="close-button" onClick={() => setSelectedCluster(null)}>Close Image</button>
                </div>
            )}
            <div className="ensemble-data-table-container">
                <h3>Ensemble Data</h3>
                <ThemeProvider theme={myTheme}>
                    <DataGrid onRowClick={handleRowClick} theme={myTheme}
                        rows={Object.values(clustersData.clusters).map((value, index) => (
                            {
                                id: index, clusterId: index + 1, population: value.population, totalDistrict: value.number_of_district_plans, disPlan: value.average_distance_between_plans,
                                repSplit: value.average_republican_split, demSplit: value.average_democratic_split
                            }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        sx={{
                            bgcolor: 'lightgray'
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );

}

export default EnsembleDataTable;
