$env:DATABASE_URL = "postgresql://dummy:dummy@dummy:5432/dummy"
$env:SENDGRID_API_KEY = "dummy_key"
$env:SLACK_BOT_TOKEN = "dummy_token"
$env:SLACK_CHANNEL_ID = "dummy_channel"
$env:PORT = "3000"

Write-Host "Starting development server..."
npm run dev 