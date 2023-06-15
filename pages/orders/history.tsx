import { GetServerSideProps, NextPage } from 'next'
import { Grid, Typography, Chip, Link } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la órden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada" variant="outlined"></Chip>    
                    : <Chip color="error" label="No pagada" variant="outlined"></Chip>    
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver órden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink href={`/orders/${ params.row.orderId }`} passHref legacyBehavior>
                    <Link underline='always'>
                        Ver órden
                    </Link>
                </NextLink> 
            )
        }
    },
    { field: 'orderId', headerName: 'ID de la Órden', width: 300 },
]

interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map( (order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
        orderId: order._id
    }))

  return (
    <ShopLayout title="Historial de órdenes" pageDescription="Historial de órdenes del cliente">
        <Typography variant='h1' component='h1'>Historial de órdenes</Typography>

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

    </ShopLayout>
  )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

    const session: any = await getServerSession( req, res, authOptions )

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser( session.user._id )    

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage