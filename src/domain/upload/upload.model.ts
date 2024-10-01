interface BodyUploadMeasurement {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

interface BodyConfirmMeasurement {
  measure_uuid: string;
  confirmed_value: number;
}

export { BodyUploadMeasurement, BodyConfirmMeasurement };
