export const checkValidData = (email, password) => {
	const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
		email
	);

	// explanation of the regex:
	// ^ - start of string
	// () - start and end of the group
	// [a-zA-Z0-9._%-] - match any character of the group
	// + - one or more of the previous character
	// @ - match the @ character
	// [a-zA-Z0-9.-] - match any character of the group
	// \. - match the . character
	// {2,} - match 2 or more of the previous character
	// $ - end of string

	const isPasswordValid = /^.{7,}$/.test(password);

	// explanation of the regex:
	// ^ - start of string
	// (?=.*\d) - must contain at least one digit
	// (?=.*[a-z]) - must contain at least one lowercase character
	// (?=.*[A-Z]) - must contain at least one uppercase character
	// (?=.*[a-zA-Z]) - must contain at least one letter
	// . - match anything with previous condition checking
	// {7,} - at least 7 characters
	// $ - end of string

	if (!isEmailValid) return "Invalid email address";
	if (!isPasswordValid) return "Password must be at least 7 characters long";

	return null;
};
