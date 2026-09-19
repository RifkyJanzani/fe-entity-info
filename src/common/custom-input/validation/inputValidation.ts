/**
 * Checks if a given value is a valid numeric value.
 * Accepts integers and decimal numbers, with optional negative sign.
 *
 * @param {string | number} value - The value to validate.
 * @returns {boolean} Returns `true` if the value is numeric, otherwise `false`.
 */
const isNumeric = (value: string | number): boolean => {
	return /^-?\d+(\.\d+)?$/.test(String(value));
};

/**
 * Checks if a numeric value has at most one digit after the decimal point.
 * Accepts both integer and decimal numbers (positive or negative).
 *
 * Examples of valid values:
 * - "123"
 * - "123.4"
 * - -56
 * - "-56.7"
 *
 * Examples of invalid values:
 * - "123.45"
 * - "0.123"
 * - "-78.91"
 *
 * @param {string | number} value - The numeric value to check.
 * @returns {boolean} `true` if the value has at most one decimal digit, otherwise `false`.
 */
const hasAtMostOneDecimal = (value: string | number): boolean => {
	const str = String(value).replace(/,/g, "");
	const regex = /\.(\d{2,})$/;
	return !regex.test(str);
};
/**
 * Validates course value: must be between 0 and 359 (inclusive).
 *
 * @param value - The course value to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidBearingCourse = (
	value: string | number
): string | undefined => {
	if (!isNumeric(value) || !hasAtMostOneDecimal(value)) {
		return "Value should be 0.0 ... 359.9 deg";
	}

	const num = parseFloat(String(value));
	if (num < 0 || num > 359.9) {
		return "Value should be 0.0 ... 359.9 deg";
	}

	return undefined;
};

/**
 * Validates data frequency value: must be integer between 1 and 100 inclusive.
 *
 * @param value - The data frequency to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidDataFrequency = (
	value: string | number
): string | undefined => {
	if (!isNumeric(value)) {
		return "Value should be 1 ... 100 Hz";
	}
	const num = parseInt(String(value), 10);
	if (num < 1 || num > 100) {
		return "Value should be 1 ... 100 Hz";
	}
	return undefined;
};

/**
 * Validates bearing tolerance value: must be between 0 and 10 (inclusive).
 *
 * @param value - The bearing tolerance value to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidBearingTolerance = (
	value: string | number
): string | undefined => {
	if (!isNumeric(value)) {
		return "Value should be 0 ... 10 deg";
	}
	const num = parseInt(String(value), 10);
	if (num < 0 || num > 10) {
		return "Value should be 0 ... 10 deg";
	}
	return undefined;
};

/**
 * Validates range altitude tolerance value: must be between 0 and 100 (inclusive).
 *
 * @param value - The range altitude tolerance value to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidRangeAltitudeTolerance = (
	value: string | number
): string | undefined => {
	if (!isNumeric(value)) {
		return "Value should be 0 ... 100 m";
	}
	const num = parseInt(String(value), 10);
	if (num < 0 || num > 100) {
		return "Value should be 0 ... 100 m";
	}
	return undefined;
};

/**
 * Validates laser range noise value: must be between 0 and 30 (inclusive).
 *
 * @param value - The laser range noise value to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidLaserRangeNoise = (
	value: string | number
): string | undefined => {
	if (!isNumeric(value)) {
		return "Value should be 0 ... 30 m";
	}
	const num = parseInt(String(value), 10);
	if (num < 0 || num > 30) {
		return "Value should be 0 ... 30 m";
	}
	return undefined;
};

/**
 * Validates parallax value: must be between -100 and 100 (inclusive).
 *
 * @param value - The parallax value to validate.
 * @returns Error message if invalid, undefined if valid.
 */
export const isValidParallax = (value: string | number): string | undefined => {
	if (!isNumeric(value)) {
		return "Value should be -100 ... 100 m";
	}
	const num = parseFloat(String(value));
	if (num < -100 || num > 100) {
		return "Value should be -100 ... 100 m";
	}
	return undefined;
};
