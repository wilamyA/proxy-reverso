const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'nodedb'
};

const sampleNames = [
  'Wescley',
  'Luiz',
  'Wesley',
  'Eduardo',
  'Carolina',
  'Ana',
  'Carlos',
  'Beatriz'
];

let pool;

async function initDb(retries = 30, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[DB Init] Tentativa ${i}/${retries} de conexão com MySQL...`);
      pool = mysql.createPool({
        ...dbConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      const connection = await pool.getConnection();
      console.log('[DB Init] Conexão estabelecida com sucesso!');

      const createTableSql = `
        CREATE TABLE IF NOT EXISTS people (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await connection.query(createTableSql);
      console.log("[DB Init] Tabela 'people' verificada/criada com sucesso!");

      connection.release();
      return;
    } catch (err) {
      console.error(`[DB Init] Falha na conexão (tentativa ${i}/${retries}): ${err.message}`);
      if (i === retries) {
        console.error('[DB Init] Número máximo de tentativas atingido. Encerrando...');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

app.get('/', async (req, res) => {
  try {
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    await pool.query('INSERT INTO people(name) VALUES(?)', [randomName]);

    const [rows] = await pool.query('SELECT name FROM people ORDER BY id ASC');

    const listItems = rows.map((person) => `<li>${person.name}</li>`).join('\n  ');

    const html = `<h1>Full Cycle Rocks!</h1>\n\n<ul>\n  ${listItems}\n</ul>`;

    res.send(html);
  } catch (error) {
    console.error('[App Error]', error);
    res.status(500).send(`<h1>Erro Interno do Servidor</h1><p>${error.message}</p>`);
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`[App] Servidor Node.js rodando na porta ${PORT}`);
  });
});
