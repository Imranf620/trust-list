import connectDB from '@/lib/mongoose';
import NavbarItem from '@/models/NavbarItem';

export async function GET() {
  await connectDB();

  const sample = [
    { type: 'link', text: 'Home', href: '/', order: 1 },
    { type: 'link', text: 'About', href: '/about', order: 2 },
    { type: 'link', text: 'Blog', href: '/blog', order: 3 },
    { type: 'link', text: 'Contact', href: '/contact', order: 4 },
    { type: 'link', text: 'Docs', href: '/docs', order: 5 },
    { type: 'button', text: 'Login', href: '/login', order: 6 },
    { type: 'button', text: 'Signup', href: '/signup', order: 7 },
  ];

  await NavbarItem.deleteMany();
  await NavbarItem.insertMany(sample);

  return Response.json({ success: true });
}
