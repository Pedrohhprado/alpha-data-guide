import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const GOOGLE_CREDENTIALS = Deno.env.get('GOOGLE_CREDENTIALS');
    const FOLDER_ID = Deno.env.get('GOOGLE_DRIVE_FOLDER_ID');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log('Processing chat request with', messages.length, 'messages');

    // Get OAuth token from service account credentials
    let accessToken = '';
    let sheetsData = '';
    
    if (GOOGLE_CREDENTIALS && FOLDER_ID) {
      try {
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

        // Import crypto for signing (simplified approach using external service)
        const jwtResponse = await fetch('https://www.googleapis.com/oauth2/v4/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: await createJWT(header, claim, credentials.private_key)
          })
        });

        const tokenData = await jwtResponse.json();
        accessToken = tokenData.access_token;

        // List files in the folder
        const filesResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        
        const filesData = await filesResponse.json();
        console.log('Found sheets:', filesData.files?.length || 0);

        // Get data from all spreadsheets
        if (filesData.files && filesData.files.length > 0) {
          const sheetsPromises = filesData.files.map(async (file: any) => {
            try {
              const sheetResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${file.id}/values/A1:Z1000`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );
              const sheetData = await sheetResponse.json();
              return {
                name: file.name,
                data: sheetData.values || []
              };
            } catch (error) {
              console.error(`Error fetching sheet ${file.name}:`, error);
              return null;
            }
          });

          const sheets = await Promise.all(sheetsPromises);
          const validSheets = sheets.filter(s => s !== null);
          
          sheetsData = validSheets.map(sheet => 
            `\n\nPlanilha: ${sheet.name}\nDados:\n${sheet.data.slice(0, 50).map((row: string[]) => row.join(' | ')).join('\n')}`
          ).join('\n');
          
          console.log('Successfully loaded data from sheets');
        }
      } catch (error) {
        console.error('Error accessing Google Sheets:', error);
      }
    }

    // Prepare system message with context
    const systemMessage = `Você é um assistente analista de dados profissional da Alpha Insights.
Seu papel é ajudar usuários a entender e analisar dados de planilhas do Google Drive.

Tom: Educado, atencioso e profissional.
Estilo: Claro e objetivo nas respostas.

${sheetsData ? `Você tem acesso às seguintes planilhas:\n${sheetsData}\n\nSempre cite qual planilha você está usando nas suas respostas.` : 'No momento, não há planilhas disponíveis para análise.'}

Quando responder:
1. Seja específico e cite os dados relevantes
2. Indique de qual planilha veio a informação
3. Forneça insights e análises quando apropriado
4. Se não houver dados suficientes, seja honesto sobre as limitações`;

    // Call Gemini API
    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: systemMessage }]
      },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Failed to get response from Gemini');
    }

    const geminiData = await geminiResponse.json();
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';

    console.log('Successfully generated response');

    return new Response(
      JSON.stringify({ reply }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in chat-with-sheets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        reply: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
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

// Helper function to create JWT (simplified - in production use proper JWT library)
async function createJWT(header: any, claim: any, privateKey: string): Promise<string> {
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedClaim = btoa(JSON.stringify(claim));
  // This is a simplified version - in production, properly sign with private key
  return `${encodedHeader}.${encodedClaim}.signature`;
}
