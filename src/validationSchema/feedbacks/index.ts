import * as yup from 'yup';

export const feedbackValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  review: yup.string(),
  suggestion: yup.string(),
  customer_id: yup.string().nullable(),
  restaurant_id: yup.string().nullable(),
});
