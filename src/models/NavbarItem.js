import mongoose from 'mongoose';

const NavbarItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['link', 'button'], required: true },
  text: String,
  href: String,
  order: Number,
});

export default mongoose.models.NavbarItem || mongoose.model('NavbarItem', NavbarItemSchema);
