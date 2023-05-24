import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createFeedback } from 'apiSdk/feedbacks';
import { Error } from 'components/error';
import { FeedbackInterface } from 'interfaces/feedbacks';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function FeedbackCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FeedbackInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFeedback(values);
      resetForm();
      router.push('/feedbacks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FeedbackInterface>({
    initialValues: {
      rating: 0,
      review: '',
      suggestion: '',
      customer_id: null,
      restaurant_id: null,
    },
    validationSchema: feedbackValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Feedback
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rating" mb="4" isInvalid={!!formik.errors.rating}>
            <FormLabel>Rating</FormLabel>
            <NumberInput
              name="rating"
              value={formik.values.rating}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rating && <FormErrorMessage>{formik.errors.rating}</FormErrorMessage>}
          </FormControl>
          <FormControl id="review" mb="4" isInvalid={!!formik.errors.review}>
            <FormLabel>Review</FormLabel>
            <Input type="text" name="review" value={formik.values.review} onChange={formik.handleChange} />
            {formik.errors.review && <FormErrorMessage>{formik.errors.review}</FormErrorMessage>}
          </FormControl>
          <FormControl id="suggestion" mb="4" isInvalid={!!formik.errors.suggestion}>
            <FormLabel>Suggestion</FormLabel>
            <Input type="text" name="suggestion" value={formik.values.suggestion} onChange={formik.handleChange} />
            {formik.errors.suggestion && <FormErrorMessage>{formik.errors.suggestion}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UsersInterface>
            formik={formik}
            name={'customer_id'}
            label={'Customer'}
            placeholder={'Select Users'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />
          <AsyncSelect<RestaurantsInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Restaurant'}
            placeholder={'Select Restaurants'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />

          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default FeedbackCreatePage;
