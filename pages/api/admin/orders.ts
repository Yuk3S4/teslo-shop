import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order } from '../../../models'
import { IOrder } from '../../../interfaces'

type Data = 
| { message: string }
| IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getOrdersByUser( req, res )
        
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
    
}

const getOrdersByUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect()
    const orders = await Order.find()
        .sort({ createdAt: 'desc' }) // ordernar conforme la fecha de creación de manera descendente
        .populate('user', 'name email')
        .lean() 
    await db.disconnect()

    return res.status(200).json( orders )

}
