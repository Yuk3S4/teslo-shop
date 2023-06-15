import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts'
import { IOrder, IUser } from '../../interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 300 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        width: 150,
        renderCell: ({row}: GridRenderCellParams) => {
            
            return row.isPaid
                ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
            
        }
    },
    { field: 'noProductos', headerName: 'No.Productos', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({row}: GridRenderCellParams) => {
            
            return (
                <a href={`/admin/orders/${ row.id }`} target="_blank">Ver orden</a>
            )
            
        }
    },
    { field: 'createdAt', headerName: 'Creda en', width: 300 },

]

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders')
    
    if ( !data && !error ) return (<></>)

    const rows = data!.map( order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProductos: order.numberOfItems,
        createdAt: order.createdAt
    }))

  return (
    <AdminLayout 
        title="Órdenes" 
        subTitle="Mantenimiento de órdenes"
        icon={ <ConfirmationNumberOutlined /> }
    >

        <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    initialState={{
                      pagination: { 
                        paginationModel: { pageSize: 5 } 
                      },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Grid>

        </Grid>

    </AdminLayout>
  )
}

export default OrdersPage