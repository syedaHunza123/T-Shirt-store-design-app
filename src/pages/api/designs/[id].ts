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
  const designId = parseInt(req.query.id as string);
  
  if (isNaN(designId)) {
    return res.status(400).json({ message: 'Invalid design ID' });
  }
  
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM designs WHERE id = $1 AND user_id = $2',
          [designId, userId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Design not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching design:', error);
        return res.status(500).json({ message: 'Error fetching design' });
      }
      
    case 'PUT':
      try {
        const {
          name,
          tshirt_color,
          text_content,
          text_color,
          text_font,
          text_position_x,
          text_position_y,
          image_url,
          image_position_x,
          image_position_y,
          image_scale,
          preview_url
        } = req.body;
        
        if (!name || !tshirt_color) {
          return res.status(400).json({ message: 'Name and t-shirt color are required' });
        }
        
        // Check if the design belongs to the user
        const checkResult = await pool.query(
          'SELECT * FROM designs WHERE id = $1 AND user_id = $2',
          [designId, userId]
        );
        
        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: 'Design not found' });
        }
        
        const result = await pool.query(
          `UPDATE designs SET 
            name = $1, tshirt_color = $2, text_content = $3, text_color = $4, 
            text_font = $5, text_position_x = $6, text_position_y = $7, 
            image_url = $8, image_position_x = $9, image_position_y = $10, 
            image_scale = $11, preview_url = $12
          WHERE id = $13 AND user_id = $14 RETURNING *`,
          [
            name, tshirt_color, text_content, text_color, 
            text_font, text_position_x, text_position_y, 
            image_url, image_position_x, image_position_y, 
            image_scale, preview_url, designId, userId
          ]
        );
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating design:', error);
        return res.status(500).json({ message: 'Error updating design' });
      }
      
    case 'DELETE':
      try {
        // Check if the design belongs to the user
        const checkResult = await pool.query(
          'SELECT * FROM designs WHERE id = $1 AND user_id = $2',
          [designId, userId]
        );
        
        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: 'Design not found' });
        }
        
        await pool.query(
          'DELETE FROM designs WHERE id = $1 AND user_id = $2',
          [designId, userId]
        );
        
        return res.status(200).json({ message: 'Design deleted' });
      } catch (error) {
        console.error('Error deleting design:', error);
        return res.status(500).json({ message: 'Error deleting design' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}