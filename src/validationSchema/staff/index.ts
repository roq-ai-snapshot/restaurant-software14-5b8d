import * as yup from 'yup';

export const staffValidationSchema = yup.object().shape({
  role: yup.string().required(),
  restaurant_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
