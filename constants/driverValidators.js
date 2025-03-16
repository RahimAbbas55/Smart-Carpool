// VALIDATION FUNCTIONS FOR DRIVER'S REGISTERATION


// Driver's Basic Info
export const validateFirstName = (firstName) => {
    const regex = /^[A-Za-z]{2,}$/;
    return regex.test(firstName) ? null : "First name must contain only letters and be at least 2 characters long.";
  };
  
  export const validateLastName = (lastName) => {
    const regex = /^[A-Za-z]{2,}$/;
    return regex.test(lastName) ? null : "Last name must contain only letters and be at least 2 characters long.";
  };
  
  export const validateDOB = (dob) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dobRegex.test(dob) ? null : "Date of Birth must be in YYYY-MM-DD format.";
  };
  

// Driver's CNIC
export const validateCNIC = (cnic) => {
    const regex = /^\d{5}-\d{7}-\d{1}$/;
    return regex.test(cnic) ? null : "CNIC must be in the format 12345-1234567-1.";
  };