import { NextPage } from "next"
import { ShopLayout } from '../../../components/layouts/ShopLayout';
import { Typography } from "@mui/material";
import { ProductList } from "../../../components/products";
import { FullScreenLoading } from "../../../components/ui";
import products from "../../api/products";
import { useProducts } from "../../../hooks";

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women')

  return (
    <ShopLayout title="Teslo-Shop - Womens" pageDescription="Encuentra los mejores productos de Teslo para ellas aquí">
      {/* component - es para que el SEO sepa que es un h1 */}
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para ellas</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      } 
    </ShopLayout>
  )
}

export default WomenPage