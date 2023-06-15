import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPaypal } from '../../../interfaces'
import { db } from '../../../database'
import { Order } from '../../../models'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { isValidObjectId } from 'mongoose'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return payOrder( req, res )

        default:
            res.status(400).json({ message : 'Bad Request' })            
    }

}

const getPaypalBearerToken = async(): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials')

    try {
        
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded', 
            }
        })

        return data.access_token

    } catch (err) {
        if ( axios.isAxiosError( err ) ) {
            console.log( err.response?.data )
        } else {
            console.log( err )
        }

        return null
    }

}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Obtención y validación de la sesión del usuario
    const session = getServerSession( req, res, authOptions )
    if ( !session ) {
        return res.status(404).json({ message : 'No existe la sesión del usuario' }) 
    }

    // Obtención y validación del token de paypal
    const paypalBearerToken = await getPaypalBearerToken()
    if ( !paypalBearerToken ) {
        return res.status(400).json({ message : 'No se pudo confirmar el token de paypal' }) 
    }

    const { transactionId = '', orderId = '' } = req.body

    // Validación de que sea un MongoId el id de la órden
    if ( !isValidObjectId( orderId ) ) {
        return res.status(400).json({ message : 'ID de la órden no válido' }) 
    }

    // Obtención de la órden generada en el frontend
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    })

    // Validación de que la órden este completada
    if ( data.status !== 'COMPLETED' ) {
        return res.status(401).json({ message: 'Orden no reconocida' })
    }
    
    await db.connect()
    const dbOrder = await Order.findById( orderId ) //Obtención de la orden de la base de datos
    
    // Validación de que exista la órden en la BD
    if ( !dbOrder ) {
        await db.disconnect()
        return res.status(404).json({ message: 'Orden no existente' })    
    }
    
    // Validación del total de la órden de la BD con la órden que se obtiene de la petición
    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ) {
        await db.disconnect()
        return res.status(400).json({ message: 'Los montos de Paypal y nuestra órden no son iguales' })    
    }

    // Actualización de la órden
    dbOrder.transactionId = transactionId
    dbOrder.isPaid = true
    await dbOrder.save()

    await db.disconnect()


    return res.status(200).json({ message : 'Orden pagada' })      
}
