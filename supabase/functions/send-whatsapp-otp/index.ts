// Supabase Edge Function: Send WhatsApp OTP via Twilio API
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone } = await req.json()

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Twilio credentials (from environment variables)
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const contentSid = Deno.env.get('TWILIO_CONTENT_SID') // Template SID kamu: HX57469e9f7ed15c2c347dece7fd851e09
    const fromNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER') // Format: whatsapp:+1415xxxxxxx

    if (!accountSid || !authToken || !contentSid || !fromNumber) {
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Twilio API to send WhatsApp message with template
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('To', `whatsapp:${phone}`)
    formData.append('From', fromNumber)
    formData.append('ContentSid', contentSid)
    formData.append('ContentVariables', JSON.stringify({ "1": otp }))

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Twilio error:', result)
      return new Response(
        JSON.stringify({ error: 'Failed to send WhatsApp message', details: result }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store OTP in database for verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (supabaseUrl && supabaseServiceKey) {
      // Store OTP with expiration (5 minutes)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      
      await fetch(`${supabaseUrl}/rest/v1/otp_codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          phone,
          otp,
          expires_at: expiresAt,
          used: false,
        }),
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // Return OTP only in development!
        ...(Deno.env.get('ENV') === 'development' && { otp })
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})