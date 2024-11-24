import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, createTheme, ThemeProvider } from "@mui/material";

const PlansTable = ({ stateData, onPlanSelect, distanceMeasure, stateSummary, selectedCluster, selectedScatterPoint }) => {

    const [plans, setPlans] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [rowSelectionModel, setRowSelectionModel] = useState([]);


    const dict = {
        'Optimal Transport': 'optimaltransport',
        'Hamming Distance': 'hamming',
        'Entropy': 'entropy'

    }
    useEffect(() => {
        const newPlans = new Map();
        for (let clus in stateSummary[dict[distanceMeasure]][selectedCluster]['indices']) {
            newPlans.set(stateSummary[dict[distanceMeasure]][selectedCluster]['indices'][clus], stateData[String(clus)]);
        }
        setPlans(newPlans);
    }, [stateData, stateSummary]);

    useEffect(() => {
        if (selectedScatterPoint) {
            const selectedIndex = Array.from(plans).findIndex(([key]) => key === selectedScatterPoint['planId']);
            const newPage = Math.floor(selectedIndex / paginationModel.pageSize);
            setPaginationModel({
                pageSize: 5,
                page: newPage,
            });
            setRowSelectionModel(selectedIndex);
        }
    }, [selectedScatterPoint, plans]);

    if (!stateSummary || !stateData || !plans) {
        return <div>Please wait</div>;
    }
    else {
    }
    const columns = [
        { field: 'planId', headerName: 'Plan ID', width: 70 },
        { field: 'republicanSplit', headerName: 'Republican Split', width: 130, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'democraticSplit', headerName: 'Democratic Split', width: 130, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'numAfrAmOppDistricts', headerName: 'African American Opportunity Districts', width: 270, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'numHispanicOppDistricts', headerName: 'Hispanic Opportunity Districts', width: 220, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'numAsianOppDistricts', headerName: 'Asian Opportunity Districts', width: 220, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) }

    ];

    const myTheme = createTheme();

    const handleRowClick = (params) => {
        onPlanSelect(params.row.planId);
    };

    const handleDisplayClick = () => {
        onPlanSelect(stateSummary[dict[distanceMeasure]][selectedCluster]['typical_index']);
    };

    return (
        <div className="plans-table-container">
            <h3>Table of Plans ({distanceMeasure})</h3>
            <div style={{ display: 'flex', justifyContent:'center', alignItems: 'center' }}>
                <h4 style={{ marginRight: '10px' }}>Typical plan in the cluster: Plan {stateSummary[dict[distanceMeasure]][selectedCluster]['typical_index']}</h4>
                <button
                    style={{
                        padding: '10px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={handleDisplayClick}
                >
                    Display Typical Plan
                </button>
            </div>
            <ThemeProvider theme={myTheme}>
                <DataGrid
                    onRowClick={handleRowClick}
                    rowHeight={50}
                    rows={Array.from(plans).map(([key, value], index) => (
                        {
                            id: index, planId: key, republicanSplit: value['RSplit'],
                            democraticSplit: value['DSplit'], numAfrAmOppDistricts: value['AfrAmOpp'],
                            numHispanicOppDistricts: value['HispanicOpp'], numAsianOppDistricts: value['AsianOpp']
                        }
                    ))}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
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
                    }}
                />
            </ThemeProvider>
        </div>
    );

};

export default PlansTable;
