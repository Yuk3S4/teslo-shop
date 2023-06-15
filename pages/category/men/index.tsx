import { NextPage } from "next"
import { ShopLayout } from '../../../components/layouts/ShopLayout';
import { Typography } from "@mui/material";
import { ProductList } from "../../../components/products";
import { FullScreenLoading } from "../../../components/ui";
import products from "../../api/products";
import { useProducts } from "../../../hooks";

const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men')

  return (
    <ShopLayout title="Teslo-Shop - Mens" pageDescription="Encuentra los mejores productos de Teslo para ellos aquí">
      {/* component - es para que el SEO sepa que es un h1 */}
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para ellos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      } 
    </ShopLayout>
  )
}

export default MenPage