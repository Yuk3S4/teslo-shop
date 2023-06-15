import { NextPage } from "next"
import { ShopLayout } from '../../../components/layouts/ShopLayout';
import { Typography } from "@mui/material";
import { ProductList } from "../../../components/products";
import { FullScreenLoading } from "../../../components/ui";
import products from "../../api/products";
import { useProducts } from "../../../hooks";

const KidPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=kid')

  return (
    <ShopLayout title="Teslo-Shop - Kids" pageDescription="Encuentra los mejores productos de niños aquí">
      {/* component - es para que el SEO sepa que es un h1 */}
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para niños</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      } 
    </ShopLayout>
  )
}

export default KidPage