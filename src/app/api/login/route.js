import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@/models/User'; // adjust your import

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  );

  // Return token in JSON only
  return Response.json({ token });
}
