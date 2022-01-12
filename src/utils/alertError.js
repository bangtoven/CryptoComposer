export function alertError(error) {
  if (error.data && error.data.message) {
    var errorMessage = error.data.message;
    const index = errorMessage.indexOf('revert');
    if (index) {
      errorMessage = errorMessage.slice(index + 7);
    }
    alert(errorMessage);
  } else if (error.message) {
    alert(error.message);
  } else {
    alert(error);
  }
  console.log('error: ', error);
}
