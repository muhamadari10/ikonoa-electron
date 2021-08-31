export const validate = (values: any) => {
    let isError = false
    let errors: any = {
      Product_text: '',
    }

    if (!values.Product_text) {
      errors.name = 'Required';
      isError = true
    }

    if (isError) {
      return errors;
    } else {
      return {};
    }
  };
