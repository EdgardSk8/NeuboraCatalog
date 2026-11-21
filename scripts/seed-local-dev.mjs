// Crea (o recrea) una cuenta de prueba en la base D1 local para poder entrar
// en http://127.0.0.1:8788 sin tocar la base de producción.
// Uso: npm run db:seed:dev
import { spawnSync } from 'node:child_process'
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const EMAIL = process.env.NOUBORA_DEV_EMAIL ?? 'dev@noubora.local'
const PASSWORD = process.env.NOUBORA_DEV_PASSWORD ?? 'noubora-dev-2026'
const TERMS_VERSION = '2026-11-14'
const ITERATIONS = 100_000
const USER_ID = '00000000-0000-4000-8000-0000000000d1'

const workspaces = [
  {
    id: '00000000-0000-4000-8000-0000000000c1',
    name: 'Ropa de prueba',
    slug: 'dev-ropa',
    businessType: 'clothing',
    profile: 'clothing',
    products: [
      { name: 'Camisa deportiva talla M', sku: 'ROP-CAM-M', category: 'Ropa', unit: 'unidad', quantity: 24, minStock: 5, cost: 320, price: 590, variant: 'Azul / M' },
      { name: 'Zapatos casuales', sku: 'ROP-ZAP-40', category: 'Calzado', unit: 'unidad', quantity: 0, minStock: 3, cost: 780, price: 1350, variant: 'Negro / 40' },
      { name: 'Gorra bordada', sku: 'ROP-GOR-01', category: 'Accesorios', unit: 'unidad', quantity: 2, minStock: 3, cost: 120, price: 250 },
    ],
  },
  {
    id: '00000000-0000-4000-8000-0000000000c2',
    name: 'Ferretería de prueba',
    slug: 'dev-ferreteria',
    businessType: 'hardware',
    profile: 'hardware',
    products: [
      { name: 'Taladro percutor 650 W', sku: 'FER-TAL-065', category: 'Herramientas', unit: 'unidad', quantity: 4, minStock: 5, cost: 1450, price: 2190, variant: '650 W / 1/2 pulg.' },
      { name: 'Cable eléctrico THHN', sku: 'FER-CAB-TH', category: 'Electricidad', unit: 'metro', quantity: 86, minStock: 20, cost: 18, price: 32 },
      { name: 'Cemento gris 50 kg', sku: 'FER-CEM-50', category: 'Materiales', unit: 'paquete', quantity: 0, minStock: 10, cost: 240, price: 320 },
    ],
  },
  {
    id: '00000000-0000-4000-8000-0000000000c3',
    name: 'Alimentos de prueba',
    slug: 'dev-alimentos',
    businessType: 'food',
    profile: 'solid_goods',
    products: [
      { name: 'Arroz blanco 500 g', sku: 'ALI-ARR-500', category: 'Granos', unit: 'kilogramo', quantity: 25, minStock: 10, cost: 22, price: 34, variant: '500 g / paquete' },
      { name: 'Aceite vegetal 1 L', sku: 'ALI-ACE-1L', category: 'Alimentos', unit: 'litro', quantity: 3, minStock: 5, cost: 68, price: 95 },
      { name: 'Café molido 250 g', sku: 'ALI-CAF-250', category: 'Alimentos', unit: 'unidad', quantity: 0, minStock: 4, cost: 85, price: 130 },
    ],
  },
  {
    id: '00000000-0000-4000-8000-0000000000c4',
    name: 'Tienda general de prueba',
    slug: 'dev-general',
    businessType: 'general',
    profile: 'solid_goods',
    products: [
      { name: 'Organizador de escritorio', sku: 'GEN-ORG-001', category: 'Oficina', unit: 'unidad', quantity: 15, minStock: 3, cost: 90, price: 160 },
      { name: 'Audífonos Bluetooth', sku: 'GEN-AUD-001', category: 'Tecnología', unit: 'unidad', quantity: 0, minStock: 3, cost: 420, price: 790 },
      { name: 'Lámpara LED', sku: 'GEN-LAM-001', category: 'Hogar', unit: 'unidad', quantity: 2, minStock: 3, cost: 210, price: 380 },
    ],
  },
]

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256')
  return { hash: hash.toString('hex'), salt: salt.toString('hex'), iterations: ITERATIONS }
}

function buildStatements(now) {
  const password = hashPassword(PASSWORD)
  const tenantIds = workspaces.map((workspace) => sql(workspace.id)).join(', ')

  const statements = [
    'PRAGMA foreign_keys = ON;',
    `DELETE FROM sessions WHERE user_id = ${sql(USER_ID)};`,
    `DELETE FROM tenant_memberships WHERE user_id = ${sql(USER_ID)};`,
    `DELETE FROM tenants WHERE id IN (${tenantIds});`,
    `DELETE FROM users WHERE id = ${sql(USER_ID)} OR email = ${sql(EMAIL)};`,
    `INSERT INTO users (id, email, password_hash, password_salt, password_iterations, email_verified, created_at, terms_accepted_version, terms_accepted_at)
     VALUES (${sql(USER_ID)}, ${sql(EMAIL)}, ${sql(password.hash)}, ${sql(password.salt)}, ${password.iterations}, 1, ${sql(now)}, ${sql(TERMS_VERSION)}, ${sql(now)});`,
  ]

  workspaces.forEach((workspace, workspaceIndex) => {
    statements.push(
      `INSERT INTO tenants (id, name, slug, inventory_profile, business_type, currency, created_at, setup_completed, trial_started_at)
       VALUES (${sql(workspace.id)}, ${sql(workspace.name)}, ${sql(workspace.slug)}, ${sql(workspace.profile)}, ${sql(workspace.businessType)}, 'NIO', ${sql(now)}, 1, ${sql(now)});`,
      `INSERT INTO tenant_memberships (tenant_id, user_id, role, created_at)
       VALUES (${sql(workspace.id)}, ${sql(USER_ID)}, 'owner', ${sql(now)});`,
    )

    workspace.products.forEach((product, index) => {
      const productId = `00000000-0000-4000-8000-0000000000${workspaceIndex + 1}${index + 1}`
      statements.push(
        `INSERT INTO products (id, tenant_id, name, sku, category, inventory_profile, quantity, min_stock, unit, cost, price, variant, created_at, updated_at)
         VALUES (${sql(productId)}, ${sql(workspace.id)}, ${sql(product.name)}, ${sql(product.sku)}, ${sql(product.category)}, ${sql(workspace.profile)}, ${product.quantity}, ${product.minStock}, ${sql(product.unit)}, ${product.cost}, ${product.price}, ${product.variant ? sql(product.variant) : 'NULL'}, ${sql(now)}, ${sql(now)});`,
      )
    })
  })

  return `${statements.join('\n')}\n`
}

function run(command) {
  const result = spawnSync(command, { stdio: 'inherit', shell: true })
  if (result.status !== 0) throw new Error(`Falló el comando: ${command}`)
}

const directory = mkdtempSync(join(tmpdir(), 'noubora-seed-'))
const sqlFile = join(directory, 'dev-account.sql')
writeFileSync(sqlFile, buildStatements(new Date().toISOString()), 'utf8')

try {
  console.log('Aplicando migraciones locales…')
  run('npx wrangler d1 migrations apply nouboracatalog --local --config wrangler.jsonc')
  console.log('Creando la cuenta de prueba local…')
  run(`npx wrangler d1 execute nouboracatalog --local --config wrangler.jsonc --file "${sqlFile}"`)
  run(`npx wrangler d1 execute nouboracatalog --local --config wrangler.jsonc --command "SELECT email, email_verified FROM users WHERE email = '${EMAIL}'"`)
  console.log(`\nCuenta de prueba lista:\n  correo:    ${EMAIL}\n  contraseña: ${PASSWORD}\n  espacios:  ${workspaces.map((workspace) => workspace.name).join(', ')}`)
} finally {
  rmSync(directory, { recursive: true, force: true })
}
