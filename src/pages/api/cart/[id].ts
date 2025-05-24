import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = parseInt(session.user.id);
  const cartItemId = parseInt(req.query.id as string);
  
  if (isNaN(cartItemId)) {
    return res.status(400).json({ message: 'Invalid cart item ID' });
  }
  
  switch (req.method) {
    case 'PUT':
      try {
        const { quantity, size } = req.body;
        
        // Check if the cart item belongs to the user
        const checkResult = await pool.query(
          'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
          [cartItemId, userId]
        );
        
        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: 'Cart item not found' });
        }
        
        let query = '';
        let values = [];
        
        if (quantity !== undefined && size !== undefined) {
          query = 'UPDATE cart_items SET quantity = $1, size = $2 WHERE id = $3 AND user_id = $4 RETURNING *';
          values = [quantity, size, cartItemId, userId];
        } else if (quantity !== undefined) {
          query = 'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
          values = [quantity, cartItemId, userId];
        } else if (size !== undefined) {
          query = 'UPDATE cart_items SET size = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
          values = [size, cartItemId, userId];
        } else {
          return res.status(400).json({ message: 'No fields to update' });
        }
        
        const result = await pool.query(query, values);
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating cart item:', error);
        return res.status(500).json({ message: 'Error updating cart item' });
      }
      
    case 'DELETE':
      try {
        // Check if the cart item belongs to the user
        const checkResult = await pool.query(
          'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
          [cartItemId, userId]
        );
        
        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: 'Cart item not found' });
        }
        
        await pool.query(
          'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
          [cartItemId, userId]
        );
        
        return res.status(200).json({ message: 'Cart item deleted' });
      } catch (error) {
        console.error('Error deleting cart item:', error);
        return res.status(500).json({ message: 'Error deleting cart item' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}