// utils/validation.js

// Signup Validation Function
const ValidationSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req;
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // First Name
  if (!firstName || !firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }

  // Last Name
  if (!lastName || !lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  // Email
  if (!emailId) {
    errors.emailId = "Email is required";
  } else if (!emailRegex.test(emailId)) {
    errors.emailId = "Email is not valid";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  return errors;
};

const ValidateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "emailId",
    "dateOfBirth",
    "gender",
    "bio",
    "photos",
    "location",
    "height",
    "education",
    "occupation",
    "company",
    "drinking",
    "smoking",
    "workout",
    "pets",
    "religion",
    "languages",
    "interests",
    "relationshipGoal",
    "preferences",
    "verified",
    "profileCompleted",
    "isPremium",
    "profilePicture",
    "skills",
    "age",
    "highestQualification",
    "collegeInstitution",
    "currentRole",
    "totalExperience",
  ];

  // Only allow updates on these fields
  const isValid = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  return isValid;
};

module.exports = { ValidationSignUp, ValidateEditProfileData };
