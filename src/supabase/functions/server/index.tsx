import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Sign up route
app.post('/make-server-adaf32ad/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { userType, email, password, ...userData } = body;

    // Create auth user (we'll use email for both types, generate email for students)
    const userEmail = userType === 'alumni' ? email : `${userData.rollNumber}@student.internal`;
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: password,
      user_metadata: { ...userData, userType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log(`Authorization error during signup: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      userType,
      ...userData,
      email: userType === 'alumni' ? email : null,
      createdAt: new Date().toISOString()
    });

    // Store user lookup by roll number or email
    if (userType === 'student') {
      await kv.set(`student:rollNumber:${userData.rollNumber}`, authData.user.id);
    } else {
      await kv.set(`alumni:email:${email}`, authData.user.id);
    }

    return c.json({ success: true, userId: authData.user.id });
  } catch (error) {
    console.log(`Error during signup: ${error}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Login route
app.post('/make-server-adaf32ad/login', async (c) => {
  try {
    const body = await c.req.json();
    const { userType, identifier, password } = body; // identifier is rollNumber or email

    // Determine email based on user type
    const email = userType === 'student' ? `${identifier}@student.internal` : identifier;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`Authorization error during login: ${error.message}`);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: userData
    });
  } catch (error) {
    console.log(`Error during login: ${error}`);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get user profile
app.get('/make-server-adaf32ad/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    return c.json({ user: userData });
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get dashboard stats
app.get('/make-server-adaf32ad/stats', async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    const contributions = await kv.getByPrefix('contribution:');
    const scholarshipRequests = await kv.getByPrefix('scholarship:');

    const activeAlumni = users.filter((u: any) => u.userType === 'alumni').length;
    const studentsWithScholarship = scholarshipRequests.length;
    
    const totalContributions = contributions.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

    return c.json({
      activeAlumni,
      studentsWithScholarship,
      totalContributions
    });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Submit scholarship request
app.post('/make-server-adaf32ad/scholarship', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const scholarshipData = {
      studentId: user.id,
      ...body,
      totalReceived: 0,
      createdAt: new Date().toISOString()
    };

    await kv.set(`scholarship:${user.id}`, scholarshipData);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error submitting scholarship request: ${error}`);
    return c.json({ error: 'Failed to submit scholarship request' }, 500);
  }
});

// Get all scholarship requests (for alumni)
app.get('/make-server-adaf32ad/scholarships', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const scholarships = await kv.getByPrefix('scholarship:');
    const enrichedScholarships = await Promise.all(
      scholarships.map(async (scholarship: any) => {
        const student = await kv.get(`user:${scholarship.studentId}`);
        return {
          ...scholarship,
          studentName: student?.name || 'Unknown',
          studentDepartment: student?.department || 'Unknown',
          studentYear: student?.year || 'Unknown',
          studentPhone: student?.phone || '',
          studentEmail: student?.email || `${student?.rollNumber}@student.internal`
        };
      })
    );

    return c.json({ scholarships: enrichedScholarships });
  } catch (error) {
    console.log(`Error fetching scholarships: ${error}`);
    return c.json({ error: 'Failed to fetch scholarships' }, 500);
  }
});

// Get specific scholarship
app.get('/make-server-adaf32ad/scholarship/:studentId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { studentId } = c.req.param();
    const scholarship = await kv.get(`scholarship:${studentId}`);
    
    if (!scholarship) {
      return c.json({ error: 'Scholarship not found' }, 404);
    }

    const student = await kv.get(`user:${studentId}`);
    
    return c.json({
      scholarship,
      student
    });
  } catch (error) {
    console.log(`Error fetching scholarship: ${error}`);
    return c.json({ error: 'Failed to fetch scholarship' }, 500);
  }
});

// Make contribution
app.post('/make-server-adaf32ad/contribute', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { studentId, amount } = body;

    // Store contribution
    const contributionId = `${Date.now()}-${user.id}`;
    await kv.set(`contribution:${contributionId}`, {
      id: contributionId,
      alumniId: user.id,
      studentId,
      amount,
      createdAt: new Date().toISOString()
    });

    // Update scholarship total
    const scholarship = await kv.get(`scholarship:${studentId}`);
    if (scholarship) {
      scholarship.totalReceived = (scholarship.totalReceived || 0) + amount;
      await kv.set(`scholarship:${studentId}`, scholarship);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error making contribution: ${error}`);
    return c.json({ error: 'Failed to make contribution' }, 500);
  }
});

Deno.serve(app.fetch);
