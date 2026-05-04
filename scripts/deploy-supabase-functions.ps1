$ErrorActionPreference = "Stop"

npx supabase secrets set --env-file supabase/.env.local --project-ref kooqqxuketynrcrsaemb
if ($LASTEXITCODE -ne 0) { throw "Failed to set Supabase secrets. Run npx supabase login first." }

npx supabase functions deploy create-payment --project-ref kooqqxuketynrcrsaemb
if ($LASTEXITCODE -ne 0) { throw "Failed to deploy create-payment." }

npx supabase functions deploy intasend-webhook --project-ref kooqqxuketynrcrsaemb --no-verify-jwt
if ($LASTEXITCODE -ne 0) { throw "Failed to deploy intasend-webhook." }

Write-Host "Supabase Edge Functions deployed."
