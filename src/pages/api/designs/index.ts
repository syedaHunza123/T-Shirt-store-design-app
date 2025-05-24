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
          'SELECT * FROM designs WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        return res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching designs:', error);
        return res.status(500).json({ message: 'Error fetching designs' });
      }
      
    case 'POST':
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
        
        const result = await pool.query(
          `INSERT INTO designs (
            user_id, name, tshirt_color, text_content, text_color, text_font,
            text_position_x, text_position_y, image_url, image_position_x,
            image_position_y, image_scale, preview_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
          [
            userId, name, tshirt_color, text_content, text_color, text_font,
            text_position_x, text_position_y, image_url, image_position_x,
            image_position_y, image_scale, preview_url
          ]
        );
        
        return res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating design:', error);
        return res.status(500).json({ message: 'Error creating design' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}