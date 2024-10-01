import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  measure_type: {
    type: String,
    required: true,
  },
  measure_value: {
    type: Number,
    required: true,
  },
  customer_code: {
    type: String,
    required: true,
  },
  measure_expiration: {
    type: Date,
    required: true,
  },
  measure_confirm: {
    type: Boolean,
    default: false,
    required: true,
  },
  measure_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const UploadMongo = mongoose.model("upload", UploadSchema);

export default UploadMongo;
