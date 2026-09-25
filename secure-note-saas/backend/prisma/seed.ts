import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding with mysql2...');

  const conn = await createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'secureflow_db',
  });

  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');
    const tables = [
      'Activity', 'SecurityLog', 'Notification', 'Reminder', 'Favorite',
      'File', 'NoteShare', 'Task', 'Note', 'Project', 'WorkspaceMember',
      'Role', 'Workspace', 'Subscription', 'SupportTicket', 'Announcement',
      'Payment', 'User'
    ];

    for (const table of tables) {
      await conn.query(`TRUNCATE TABLE \`${table}\`;`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

    const adminHashedPassword = await bcrypt.hash('admin123', 12);

    const now = new Date();

    const adminId = 'usr_admin_001';

    await conn.query(
      `INSERT INTO User (id, email, password, fullName, role, isVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [adminId, 'admin@secureflow.com', adminHashedPassword, 'System Administrator', 'ADMIN', true, now, now]
    );

    await conn.query(
      `INSERT INTO Subscription (id, userId, plan, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['sub_1', adminId, 'ENTERPRISE', true, now, now]
    );

    console.log('👤 Inserted Admin: admin@secureflow.com');
    console.log('🚀 Database seeding finished cleanly!');
  } finally {
    await conn.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
