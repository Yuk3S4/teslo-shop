import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces'

type Data = 
| { message: string }
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getProducts( req, res )

        default:
            return res.status(400).json({
                message: 'Bad Request'
            })
    }
}

const getProducts = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { gender = 'all' } = req.query

    let condition = {}

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${ gender }`) ) {
        condition = { gender }
    }
    
    await db.connect()
    const products = await Product.find( condition ) // condition - condiciones de busqueda (filtros)
                                  .select('title images price inStock slug -_id') // -_id restar id
                                  .lean() 
    // lean() - traer la menos info posible  
    // find() - traer todos los registros
    // select() - seleccionar ciertos campos a regresar

    await db.disconnect()

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
        })

        return product
    })

    return res.status(200).json( updatedProducts )

}
