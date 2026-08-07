import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding with mysql2...');

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'secureflow_db',
  });

  try {
    // 1. Disable FK checks and truncate tables
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

    const hashedPassword = await bcrypt.hash('password123', 12);
    const adminHashedPassword = await bcrypt.hash('admin123', 12);

    const now = new Date();

    // 2. Insert Users
    const adminId = 'usr_admin_001';
    const johnId = 'usr_john_001';

    await conn.query(
      `INSERT INTO User (id, email, password, fullName, role, isVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [adminId, 'admin@secureflow.com', adminHashedPassword, 'System Administrator', 'ADMIN', true, now, now]
    );

    await conn.query(
      `INSERT INTO User (id, email, password, fullName, role, isVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [johnId, 'john@example.com', hashedPassword, 'John Doe', 'USER', true, now, now]
    );

    // Subscriptions
    await conn.query(
      `INSERT INTO Subscription (id, userId, plan, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)`,
      ['sub_1', adminId, 'ENTERPRISE', true, now, now, 'sub_2', johnId, 'PRO', true, now, now]
    );

    console.log('👤 Inserted Users: admin@secureflow.com & john@example.com');

    // 3. Workspaces
    const devWsId = 'ws_dev_001';
    const uniWsId = 'ws_uni_002';
    const startupWsId = 'ws_startup_003';

    await conn.query(
      `INSERT INTO Workspace (id, name, description, ownerId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [devWsId, 'Development Team', 'Core software architecture and engineering team.', johnId, now, now]
    );

    await conn.query(
      `INSERT INTO Workspace (id, name, description, ownerId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uniWsId, 'University Project', 'Distributed systems research project workspace.', johnId, now, now]
    );

    await conn.query(
      `INSERT INTO Workspace (id, name, description, ownerId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [startupWsId, 'Stealth Startup', 'Next-gen SaaS venture collaboration.', adminId, now, now]
    );

    // Workspace Members
    await conn.query(
      `INSERT INTO WorkspaceMember (id, workspaceId, userId, isActive, joinedAt)
       VALUES 
       ('wm_1', ?, ?, true, ?),
       ('wm_2', ?, ?, true, ?),
       ('wm_3', ?, ?, true, ?),
       ('wm_4', ?, ?, true, ?),
       ('wm_5', ?, ?, false, ?)`, // Pending invite for John in Stealth Startup
      [devWsId, johnId, now, devWsId, adminId, now, uniWsId, johnId, now, startupWsId, adminId, now, startupWsId, johnId, now]
    );

    console.log('🏢 Inserted Workspaces & Members (including Pending Invitation)');

    // 4. Projects
    const projAlphaId = 'proj_alpha_01';
    await conn.query(
      `INSERT INTO Project (id, name, description, workspaceId, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projAlphaId, 'Alpha Release v2.0', 'Backend microservices overhaul and DB migration', devWsId, 'ACTIVE', now, now]
    );

    // 5. Personal Notes (John)
    await conn.query(
      `INSERT INTO Note (id, userId, workspaceId, title, content, tags, isEncrypted, status, createdAt, updatedAt)
       VALUES 
       ('note_p1', ?, NULL, '🔒 Private Security Keys Backup', 'Remember to rotate SSH keys every 90 days. Store backup keys in encrypted vault.', 'Security,Private,Important', true, 'ACTIVE', ?, ?),
       ('note_p2', ?, NULL, '💡 Personal SaaS Ideas 2026', '1. AI-assisted developer workflow tool\\n2. Real-time note collaboration system\\n3. Zero-knowledge file vault', 'Ideas,Personal', false, 'ACTIVE', ?, ?),
       ('note_p3', ?, NULL, '📦 Archived Shopping & Specs', 'Server hardware specs: 64GB DDR5 RAM, 2TB NVMe PCIe 4.0 SSD', 'Archive,Hardware', false, 'ARCHIVED', ?, ?),
       ('note_p4', ?, NULL, '🗑️ Old Scratchpad Notes', 'Temporary notes to be cleared.', 'Trash', false, 'TRASHED', ?, ?)`,
      [johnId, now, now, johnId, now, now, johnId, now, now, johnId, now, now]
    );

    // 6. Workspace Notes (Development Team)
    await conn.query(
      `INSERT INTO Note (id, userId, workspaceId, title, content, tags, isEncrypted, status, createdAt, updatedAt)
       VALUES 
       ('note_w1', ?, ?, '📋 Sprint Planning & Architecture Guidelines', 'Guidelines for Q3 roadmap: Maintain 99.9% uptime, implement modular route handlers, enforce strict JWT authentication.', 'Sprint,Architecture,Team', false, 'ACTIVE', ?, ?),
       ('note_w2', ?, ?, '🔐 Security Protocols & Code Reviews', 'All pull requests require 2 approvals and automated SAST security scan checks before merging into main branch.', 'Security,Compliance', false, 'ACTIVE', ?, ?)`,
      [johnId, devWsId, now, now, adminId, devWsId, now, now]
    );

    // Favorites
    await conn.query(
      `INSERT INTO Favorite (id, userId, noteId) VALUES ('fav_1', ?, 'note_p1')`,
      [johnId]
    );

    console.log('📝 Inserted Personal & Workspace Notes');

    // 7. Personal Tasks (John)
    await conn.query(
      `INSERT INTO Task (id, userId, workspaceId, title, description, priority, status, dueDate, createdAt, updatedAt)
       VALUES 
       ('task_p1', ?, NULL, 'Renew SSL Certificates', 'Update Lets Encrypt SSL certificates for custom domain', 'HIGH', 'TODO', ?, ?, ?),
       ('task_p2', ?, NULL, 'Review System Backup Logs', 'Ensure daily automated offsite S3 backups completed cleanly', 'MEDIUM', 'IN_PROGRESS', ?, ?, ?),
       ('task_p3', ?, NULL, 'Setup Two-Factor Authentication App', 'Configure TOTP authenticator for account security', 'LOW', 'DONE', ?, ?, ?)`,
      [
        johnId, new Date(Date.now() + 86400000 * 2), now, now,
        johnId, new Date(Date.now() + 86400000 * 1), now, now,
        johnId, new Date(Date.now() - 86400000 * 1), now, now
      ]
    );

    // 8. Workspace Tasks (Development Team)
    await conn.query(
      `INSERT INTO Task (id, userId, workspaceId, projectId, assigneeId, title, description, priority, status, dueDate, createdAt, updatedAt)
       VALUES 
       ('task_w1', ?, ?, ?, ?, 'Implement OAuth2 & JWT Token Refresh Flow', 'Add token refresh endpoint and secure HTTP-only cookies.', 'HIGH', 'IN_PROGRESS', ?, ?, ?),
       ('task_w2', ?, ?, ?, ?, 'Database Index & Query Performance Optimization', 'Add compound indexes to Note and Task models.', 'MEDIUM', 'TODO', ?, ?, ?)`,
      [
        johnId, devWsId, projAlphaId, johnId, new Date(Date.now() + 86400000 * 3), now, now,
        adminId, devWsId, projAlphaId, adminId, new Date(Date.now() + 86400000 * 5), now, now
      ]
    );

    console.log('✅ Inserted Personal & Workspace Tasks');

    // 9. Announcements & Support Tickets & Logs
    await conn.query(
      `INSERT INTO Announcement (id, title, content, type, isActive, createdAt)
       VALUES ('ann_1', '🚀 SecureFlow SaaS v2.0 Released!', 'We are excited to launch Context-Aware Workspace Dashboards and Enhanced Security Logs.', 'INFO', true, ?)`,
      [now]
    );

    await conn.query(
      `INSERT INTO SupportTicket (id, userId, subject, message, status, priority, createdAt, updatedAt)
       VALUES ('st_1', ?, 'Inquiry regarding Enterprise API Rate Limits', 'Hello Support Team, what are the exact rate limits for standard API endpoints on Pro plan?', 'OPEN', 'MEDIUM', ?, ?)`,
      [johnId, now, now]
    );

    await conn.query(
      `INSERT INTO SecurityLog (id, userId, action, ipAddress, userAgent, createdAt)
       VALUES ('sl_1', ?, 'LOGIN_SUCCESS', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', ?)`,
      [johnId, now]
    );

    await conn.query(
      `INSERT INTO Activity (id, userId, workspaceId, action, itemType, itemId, createdAt)
       VALUES ('act_1', ?, ?, 'CREATE_WORKSPACE', 'WORKSPACE', ?, ?)`,
      [johnId, devWsId, devWsId, now]
    );

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
