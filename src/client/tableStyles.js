const tableStyles = (numberOfCells, theme) => (
    {
        table: {
            tableMargin: {
                marginLeft: '5%',
                marginRight: '5%',
                marginBottom: '3%'
            },
            labelMargin: {
                marginLeft: '5%',
            }
        },
        header: {
            row: {
                backgroundColor: theme.palette.secondary.light,
                width: '100%',
                overflowX: 'scroll',
            }
            ,
            cell: {
                padding: '0%',
                textAlign: 'center',
                width: `${100 / numberOfCells}%`,
            },
        },
        body: {
            row: {
                height: 80,
                backgroundColor: 'white',
                borderTop: `8px solid ${theme.palette.secondary.light}`,
                borderBottom: `8px solid ${theme.palette.secondary.light}`,
                width: '100%',
                overflowX: 'scroll',
            },
            cell: {
                padding: '0%',
                textAlign: 'center',
                width: `${100 / numberOfCells}%`,
            }
        }
    }
)

export default tableStyles
