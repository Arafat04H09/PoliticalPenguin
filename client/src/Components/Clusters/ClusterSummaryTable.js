//Import statements 
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material";

const ClusterSummaryTable = ({ stateData, onClusterSelect, distanceMeasure, stateSummary }) => {
    //Create different useStates to help facilitate data visualization
    const [hoveredClusterId, setHoveredClusterId] = useState(null); // hovering over a cluster on the table displays some initial information
    const [selectedClusterId, setSelectedClusterId] = useState(null); //clicking on a cluster on the table displayts a table of plans for that cluster
    const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 }); //mouse position
    const [summary, setSummary] = useState(null)
    const [data, setData] = useState(null)
    
    const dict = {
        'Optimal Transport': 'optimaltransport',
        'Hamming Distance': 'hamming',
        'Entropy': 'entropy'

    }
    //event listener for when a cluster is hovered over
    const handleMouseEnter = (clusterId, event) => {
        const { clientX, clientY } = event;
        setHoverPosition({ left: clientX, top: clientY - 200 });
        setHoveredClusterId(clusterId);
    }

    useEffect(() => {
        setSummary(stateSummary);
        setData(stateData);
    }, [stateData, stateSummary]);

    if (!summary || !data) {
        return <div>Please wait</div>
    }
    else {
    }

    //creating the columns for the table
    const columns = [
        { field: 'clusterId', headerName: 'Cluster ID', width: 80 },
        { field: 'totalDistrict', headerName: '# District Plans', width: 120, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'repSplit', headerName: 'Avg. Republican Split', width: 150, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value)  },
        { field: 'demSplit', headerName: 'Avg. Democratic Split', width: 150, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value)  },
        { field: 'disPlan', headerName: `Avg. ${distanceMeasure}`, width: 170, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value)  },
        { field: 'avgafropp', headerName: `Avg. African American Opportunity Districts`, width: 150, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'avgasiopp', headerName: `Avg. Asian Opportunity Districts`, width: 150, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'avghisopp', headerName: `Avg. Hispanic Opportunity Districts`, width: 150, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },

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
        const clusterId = `cluster_${params.id}`;
        onClusterSelect(clusterId);
    };

    return (
        <div className="cluster-summary-container">
            <div className="cluster-summary-table">
                <h3 style={{ marginTop: 0, paddingTop: "2%" }}>Cluster Summary</h3>
                <ThemeProvider theme={myTheme}>
                    <DataGrid
                        rowHeight={50}
                        onRowClick={handleRowClick}
                        theme={myTheme}
                        rows={summary[dict[distanceMeasure]] ? Object.values(summary[dict[distanceMeasure]]).slice(0, summary[dict[distanceMeasure]]['summary']['nclusters']).map((value, index) => (
                            {
                                id: index, clusterId: index + 1, totalDistrict: value['indices'].length, disPlan: parseFloat(summary[dict[distanceMeasure]]['summary']['avg_dists'][index]).toFixed(5),
                                repSplit: summary[dict[distanceMeasure]]['summary']['avg_R_split'][index], demSplit: summary[dict[distanceMeasure]]['summary']['avg_D_split'][index],
                                avgafropp: summary[dict[distanceMeasure]]['summary']['avg_afrAm_opp'][index], avgasiopp: summary[dict[distanceMeasure]]['summary']['avg_asian_opp'][index],
                                avghisopp: summary[dict[distanceMeasure]]['summary']['avg_hispanic_opp'][index]
                            }
                        ))
                            :
                            [
                                {
                                    id: "NA",
                                    clusterId: "NA",
                                    totalDistrict: "NA",
                                    disPlan: "NA",
                                    repSplit: "NA",
                                    demSplit: "NA",
                                    avgafropp: "NA",
                                    avgasiopp: "NA",
                                    avghisopp: "NA"
                                }
                            ]

                        }
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        columnHeaderHeight={60}
                        sx={{
                            bgcolor: 'lightgray',
                            '& .MuiDataGrid-row': (theme) => ({
                                '&:nth-of-type(odd)': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '&:nth-of-type(even)': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }), 
                            "& .MuiDataGrid-columnHeaderTitle": {
                                whiteSpace: "normal",
                                lineHeight: "normal"
                              },
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default ClusterSummaryTable;