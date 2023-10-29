import { ErrorMessage } from '@hookform/error-message';
import { FormProvider, useForm } from 'react-hook-form';
import { DynamicFieldData } from './dynamic-control-types';
import { DynamicControl } from './DynamicControl';

interface FormProps {
  fields: DynamicFieldData[];
}

export const Form = ({ fields }: FormProps) => {
  const formMethods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting, errors }
  } = formMethods;

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        {fields.map((d, i) => (
          <div key={i}>
            <label htmlFor={d.fieldName}>{d.label}</label>

            <DynamicControl {...d} />

            <ErrorMessage errors={errors} name={d.fieldName} />
          </div>
        ))}
      </FormProvider>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting' : 'Submit'}
      </button>
    </form>
  );
};
