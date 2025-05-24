// models/Service.js
import mongoose from 'mongoose';

const DetailSchema = new mongoose.Schema({
  heading: String,
  para: String,
  link: String,
}, { _id: false });

const CardSchema = new mongoose.Schema({
  text: String,
  detail: [DetailSchema],
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
  imageLink: String,
  para: {
    content: String,
    link: String,
  },
  cards: [CardSchema],
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
