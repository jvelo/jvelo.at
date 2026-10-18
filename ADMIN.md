# Admin commands

## D1 Database

Database name: `jvelo-at-db`

### Execute SQL

```bash
# Remote
npx wrangler d1 execute jvelo-at-db --remote --command "SELECT * FROM users"

# Local
npx wrangler d1 execute jvelo-at-db --local --command "SELECT * FROM users"
```

### Export as SQLite

```bash
# Remote
npx wrangler d1 export jvelo-at-db --remote --output remote.sql
sqlite3 remote.db < remote.sql

# Local (direct access)
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/68d998700ee2b4b608a03c41b68fdc04fff52cb8e791b06cd5ab146af9caef1d.sqlite
```

### Apply migrations

```bash
# Remote
npx wrangler d1 migrations apply jvelo-at-db --remote

# Local
npx wrangler d1 migrations apply jvelo-at-db --local
```

### Manage users

```bash
# Add a member
npx wrangler d1 execute jvelo-at-db --remote --command "INSERT INTO users (email, role) VALUES ('user@example.com', 'member')"

# Add an admin
npx wrangler d1 execute jvelo-at-db --remote --command "INSERT INTO users (email, role) VALUES ('user@example.com', 'admin')"

# List users
npx wrangler d1 execute jvelo-at-db --remote --command "SELECT * FROM users"

# Remove a user
npx wrangler d1 execute jvelo-at-db --remote --command "DELETE FROM users WHERE email = 'user@example.com'"
```

### Device access to starred media

`/api/starred-media` and `/api/starred-media/:id/image` also accept `Authorization: Bearer <DEVICE_TOKEN>`, so a device can read them without a session. The image endpoint shrinks each picture to fit `?size=` (default 480), or fills that square and crops the overflow with `?fit=cover`, and returns a PNG, using the Cloudflare Images binding.

```bash
# Set or rotate the token (then update the device's secrets.py)
openssl rand -hex 24 | npx wrangler secret put DEVICE_TOKEN
```
