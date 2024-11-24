import React from 'react';
import { generateEffectivenessData } from '../../Utils/generateEffectivenessData';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material";

const DistanceMeasureEffectivenessTable = ({ measureName }) => {
    const data = generateEffectivenessData(measureName);

    const columns = [
        { field: 'metric', headerName: 'Metric', width: 250 },
        { field: 'value', headerName: 'Value', width: 250 }
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

    return (
        <div>
            <h3>Effectiveness Data for {measureName}</h3>
            <ThemeProvider theme={myTheme}>
                    <DataGrid theme={myTheme}
                        rows={Object.entries(data).map(([metric, value], index) => (
                            {
                                id: index, metric: metric, value: value
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
    );
}

export default DistanceMeasureEffectivenessTable;
