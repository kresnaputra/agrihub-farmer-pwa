import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create admin client with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create user with admin API (bypasses email confirmation)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email!
      user_metadata: {
        name,
        phone,
      },
    });

    if (userError || !userData.user) {
      console.error('Error creating user:', userError);
      return NextResponse.json(
        { error: userError?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userData.user.id,
          name,
          email,
          phone: phone || null,
        },
      ]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't fail - user is created, profile can be created later
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        id: userData.user.id,
        email: userData.user.email,
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}