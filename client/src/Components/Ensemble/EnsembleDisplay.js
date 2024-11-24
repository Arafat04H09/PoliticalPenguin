import './EnsembleDisplay.css';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material";

const EnsembleDisplay = ({ stateSummary, onEnsembleClick, onAnalysisClick }) => {

    const columns = [
        { field: 'ensemble', headerName: 'Ensembles', width: 120, headerClassName: 'font' },
        { field: 'size', headerName: 'Size', width: 70, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'hamming', headerName: 'Avg. Hamming Distance', width: 170, align: 'right', headerAlign: 'right' , valueFormatter: (params) => new Intl.NumberFormat().format(params.value) },
        { field: 'entropy', headerName: 'Avg. Entropy', width: 120, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value)  },
        { field: 'optimaltransport', headerName: 'Avg. Optimal Transport', width: 170, align: 'right', headerAlign: 'right', valueFormatter: (params) => new Intl.NumberFormat().format(params.value)  }
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
    if (!stateSummary) {
        return (<></>)
    }
    
    return (
        <div className="ensemble-display">
            <div className="ensemble-display-col1" style={{height: '50%'}}>
                <h2>Select an Ensemble:</h2>
                <div style = {{display: 'flex', justifyContent: 'center'}}>
                <div style = {{width: '60%', alignSelf: 'center', alignContent: 'center', display: 'space-between'}}>
                <ThemeProvider theme={myTheme}>
                    <DataGrid
                        rowHeight={50}
                        onRowClick={onEnsembleClick}
                        theme={myTheme}
                        rows={
                            Object.values(stateSummary).map((value, index) => ({
                                id: index, ensemble: "Ensemble " + index, size: value['summary']['nplans'], optimaltransport: parseFloat(value['summary']['avg_optimaltransport']).toFixed(5),
                                hamming: parseFloat(value['summary']['avg_hamming'].toFixed(5)), entropy: parseFloat(value['summary']['avg_entropy'].toFixed(5))
                            }))
                        }
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
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
                </div>
            </div>
            <div className="ensemble-display-col1">
                <h2> Ensemble Size Analysis:</h2>
                <button className='ensemble-button' onClick={onAnalysisClick}>
                    Ensemble Size Analysis
                </button>
            </div>
        </div>
    );
}

export default EnsembleDisplay;
