const handleResponse = (status = 200, error, message, data) => {
  let result = {};
  result.status = status;

  if (error) result.error = error;

  if (message) result.message = message;

  if (data) result.data = data;

  return result;
}

export default handleResponse;
