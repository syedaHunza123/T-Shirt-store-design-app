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
  
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          `SELECT c.*, d.name, d.tshirt_color, d.preview_url 
           FROM cart_items c
           JOIN designs d ON c.design_id = d.id
           WHERE c.user_id = $1
           ORDER BY c.created_at DESC`,
          [userId]
        );
        
        // Format the response to match the CartItem type with nested design
        const cartItems = result.rows.map(row => ({
          id: row.id,
          user_id: row.user_id,
          design_id: row.design_id,
          quantity: row.quantity,
          size: row.size,
          created_at: row.created_at,
          design: {
            id: row.design_id,
            name: row.name,
            tshirt_color: row.tshirt_color,
            preview_url: row.preview_url
          }
        }));
        
        return res.status(200).json(cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Error fetching cart items' });
      }
      
    case 'POST':
      try {
        const { design_id, quantity, size } = req.body;
        
        if (!design_id || !quantity || !size) {
          return res.status(400).json({ message: 'Design ID, quantity, and size are required' });
        }
        
        // Check if the design exists
        const designCheck = await pool.query(
          'SELECT * FROM designs WHERE id = $1',
          [design_id]
        );
        
        if (designCheck.rows.length === 0) {
          return res.status(404).json({ message: 'Design not found' });
        }
        
        // Check if the item is already in the cart
        const cartCheck = await pool.query(
          'SELECT * FROM cart_items WHERE user_id = $1 AND design_id = $2',
          [userId, design_id]
        );
        
        if (cartCheck.rows.length > 0) {
          // Update quantity if already in cart
          const result = await pool.query(
            'UPDATE cart_items SET quantity = quantity + $1, size = $2 WHERE user_id = $3 AND design_id = $4 RETURNING *',
            [quantity, size, userId, design_id]
          );
          
          return res.status(200).json(result.rows[0]);
        } else {
          // Add new item to cart
          const result = await pool.query(
            'INSERT INTO cart_items (user_id, design_id, quantity, size) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, design_id, quantity, size]
          );
          
          return res.status(201).json(result.rows[0]);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Error adding to cart' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}