import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = parseInt(session.user.id);
  const designId = parseInt(req.query.id as string);
  
  if (isNaN(designId)) {
    return res.status(400).json({ message: 'Invalid design ID' });
  }
  
  // Only allow GET requests (to be used as a link)
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Check if the design exists and belongs to the user
    const designCheck = await pool.query(
      'SELECT * FROM designs WHERE id = $1 AND user_id = $2',
      [designId, userId]
    );
    
    if (designCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Design not found' });
    }
    
    // Check if the design is already in the cart
    const cartCheck = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND design_id = $2',
      [userId, designId]
    );
    
    if (cartCheck.rows.length > 0) {
      // Update quantity if already in cart
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = $1 AND design_id = $2',
        [userId, designId]
      );
    } else {
      // Add new item to cart
      await pool.query(
        'INSERT INTO cart_items (user_id, design_id, quantity, size) VALUES ($1, $2, $3, $4)',
        [userId, designId, 1, 'M']
      );
    }
    
    // Redirect to cart page
    res.redirect(302, '/cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Error adding design to cart' });
  }
}