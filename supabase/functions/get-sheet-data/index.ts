import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_CREDENTIALS = Deno.env.get('GOOGLE_CREDENTIALS');
    const FOLDER_ID = Deno.env.get('GOOGLE_DRIVE_FOLDER_ID');

    if (!GOOGLE_CREDENTIALS || !FOLDER_ID) {
      throw new Error('Google credentials or folder ID not configured');
    }

    console.log('Fetching sheet data for charts');

    const credentials = JSON.parse(GOOGLE_CREDENTIALS);
    
    // Create JWT for Google OAuth
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const jwtResponse = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(header, claim, credentials.private_key)
      })
    });

    const tokenData = await jwtResponse.json();
    const accessToken = tokenData.access_token;

    // List files in the folder
    const filesResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    const filesData = await filesResponse.json();
    console.log('Found sheets:', filesData.files?.length || 0);

    // Get data from all spreadsheets
    const sheets = [];
    if (filesData.files && filesData.files.length > 0) {
      for (const file of filesData.files) {
        try {
          const sheetResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${file.id}/values/A1:Z1000`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const sheetData = await sheetResponse.json();
          
          // Convert to structured data
          const values = sheetData.values || [];
          if (values.length > 0) {
            const headers = values[0];
            const rows = values.slice(1).map((row: any[]) => {
              const obj: any = {};
              headers.forEach((header: string, index: number) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
            
            sheets.push({
              name: file.name,
              headers,
              data: rows
            });
          }
        } catch (error) {
          console.error(`Error fetching sheet ${file.name}:`, error);
        }
      }
    }

    console.log('Successfully processed sheets data');

    return new Response(
      JSON.stringify({ sheets }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-sheet-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        sheets: []
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function createJWT(header: any, claim: any, privateKey: string): Promise<string> {
  const base64UrlEncode = (obj: any) => {
    const str = JSON.stringify(obj);
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedClaim = base64UrlEncode(claim);
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  const cleanedKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(cleanedKey), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${signatureInput}.${signature}`;
}
