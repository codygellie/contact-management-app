const { pool } = require('../config/database');

class ContactController {
  static async getContacts(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      
      const currentPage = Math.max(1, Number(page) || 1);
      const limitValue = Math.max(1, Math.min(100, Number(limit) || 10));
      const offset = Math.max(0, (currentPage - 1) * limitValue);
      
      console.log('Debug - Query params:', { page, limit, search });
      console.log('Debug - Processed values:', { currentPage, limitValue, offset });
      
      let query = 'SELECT * FROM contacts';
      let countQuery = 'SELECT COUNT(*) as total FROM contacts';
      let params = [];
      let countParams = [];
      
      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
        countQuery += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
        params = [searchTerm, searchTerm, searchTerm];
        countParams = [searchTerm, searchTerm, searchTerm];
      }
      
      query += ` ORDER BY created_at DESC LIMIT ${limitValue} OFFSET ${offset}`;

      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      
      const [contacts] = await pool.execute(query, params);
      
      const totalPages = Math.ceil(total / limitValue);
      
      res.json({
        contacts,
        pagination: {
          page: currentPage,
          limit: limitValue,
          total,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  static async createContact(req, res) {
    try {
      const { name, email, phone } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, email, phone' 
        });
      }

      const [result] = await pool.execute(
        'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone]
      );

      const [newContact] = await pool.execute(
        'SELECT * FROM contacts WHERE id = ?',
        [result.insertId]
      );

      // Emit real-time update to ALL connected clients
      console.log('📡 Broadcasting contactCreated event:', newContact[0]);
      req.io.emit('contactCreated', newContact[0]);

      res.status(201).json(newContact[0]);
    } catch (error) {
      console.error('Error creating contact:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create contact' });
      }
    }
  }

  static async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, email, phone' 
        });
      }

      const [result] = await pool.execute(
        'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const [updatedContact] = await pool.execute(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      );

      // Emit real-time update to ALL connected clients
      console.log('📡 Broadcasting contactUpdated event:', updatedContact[0]);
      req.io.emit('contactUpdated', updatedContact[0]);

      res.json(updatedContact[0]);
    } catch (error) {
      console.error('Error updating contact:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update contact' });
      }
    }
  }

  static async deleteContact(req, res) {
    try {
      const { id } = req.params;

      const [contactToDelete] = await pool.execute(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      );

      if (contactToDelete.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const [result] = await pool.execute(
        'DELETE FROM contacts WHERE id = ?',
        [id]
      );

      console.log('Broadcasting contactDeleted event:', { id: parseInt(id), contact: contactToDelete[0] });
      req.io.emit('contactDeleted', { 
        id: parseInt(id),
        contact: contactToDelete[0] 
      });

      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  }
}

module.exports = ContactController;