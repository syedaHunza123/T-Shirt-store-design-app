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
          'SELECT id, email, name, created_at FROM users WHERE id = $1',
          [userId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Error fetching user profile' });
      }
      
    case 'PUT':
      try {
        const { name } = req.body;
        
        const result = await pool.query(
          'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, created_at',
          [name, userId]
        );
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Error updating user profile' });
      }
      
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}