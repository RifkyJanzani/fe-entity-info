/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author           : Saeful Abdulloh Sayuti
 * Version, Date    : 1.0.0, 23 April 2025
 * Description      : This module is test file from inputValidation
 *
 */
import {
	isValidBearingCourse,
	isValidBearingTolerance,
	isValidDataFrequency,
	isValidLaserRangeNoise,
	isValidParallax,
	isValidRangeAltitudeTolerance
} from "./inputValidation";

describe("inputValidation – Numeric Validators", () => {
	describe("isValidBearingCourse", () => {
		it("validates correct values with at most one decimal", () => {
			expect(isValidBearingCourse(0)).toBeUndefined();
			expect(isValidBearingCourse("359.9")).toBeUndefined();
			expect(isValidBearingCourse(180.5)).toBeUndefined();
			expect(isValidBearingCourse("-0.0")).toBeUndefined(); // edge case
		});
		it("rejects out-of-range values", () => {
			expect(isValidBearingCourse(-1)).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse(360)).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse(400)).toMatch(/0.0 ... 359.9/);
		});
		it("rejects invalid decimals and non-numeric", () => {
			expect(isValidBearingCourse("10.11")).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse("12.456")).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse("abc")).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse("")).toMatch(/0.0 ... 359.9/);
			expect(isValidBearingCourse("0.99")).toMatch(/0.0 ... 359.9/);
		});
	});

	describe("isValidDataFrequency", () => {
		it("validates integer between 1 and 100", () => {
			expect(isValidDataFrequency(1)).toBeUndefined();
			expect(isValidDataFrequency("100")).toBeUndefined();
			expect(isValidDataFrequency(50)).toBeUndefined();
		});
		it("rejects non-integer, string, and out of range", () => {
			expect(isValidDataFrequency("abc")).toMatch(/1 ... 100/);
			expect(isValidDataFrequency("0")).toMatch(/1 ... 100/);
			expect(isValidDataFrequency(101)).toMatch(/1 ... 100/);
			expect(isValidDataFrequency("101")).toMatch(/1 ... 100/);
			expect(isValidDataFrequency("")).toMatch(/1 ... 100/);
			expect(isValidDataFrequency("5.5")).toBeUndefined(); // passes isNumeric and parseInt(5.5) === 5 (so still valid, unless you want to restrict to integer!)
		});
	});

	describe("isValidBearingTolerance", () => {
		it("valid for integer/string 0...10", () => {
			expect(isValidBearingTolerance(0)).toBeUndefined();
			expect(isValidBearingTolerance("10")).toBeUndefined();
		});
		it("invalid for out of range or non-numeric", () => {
			expect(isValidBearingTolerance(-1)).toMatch(/0 ... 10/);
			expect(isValidBearingTolerance(11)).toMatch(/0 ... 10/);
			expect(isValidBearingTolerance("abc")).toMatch(/0 ... 10/);
			expect(isValidBearingTolerance("")).toMatch(/0 ... 10/);
		});
	});

	describe("isValidRangeAltitudeTolerance", () => {
		it("valid 0-100", () => {
			expect(isValidRangeAltitudeTolerance(0)).toBeUndefined();
			expect(isValidRangeAltitudeTolerance("100")).toBeUndefined();
		});
		it("invalid cases", () => {
			expect(isValidRangeAltitudeTolerance(-1)).toMatch(/0 ... 100/);
			expect(isValidRangeAltitudeTolerance(101)).toMatch(/0 ... 100/);
			expect(isValidRangeAltitudeTolerance("nope")).toMatch(/0 ... 100/);
			expect(isValidRangeAltitudeTolerance("")).toMatch(/0 ... 100/);
		});
	});

	describe("isValidLaserRangeNoise", () => {
		it("valid 0-30", () => {
			expect(isValidLaserRangeNoise(0)).toBeUndefined();
			expect(isValidLaserRangeNoise("30")).toBeUndefined();
		});
		it("invalid", () => {
			expect(isValidLaserRangeNoise(-1)).toMatch(/0 ... 30/);
			expect(isValidLaserRangeNoise(31)).toMatch(/0 ... 30/);
			expect(isValidLaserRangeNoise("x")).toMatch(/0 ... 30/);
			expect(isValidLaserRangeNoise("")).toMatch(/0 ... 30/);
		});
	});

	describe("isValidParallax", () => {
		it("valid -100...100, string or number", () => {
			expect(isValidParallax(-100)).toBeUndefined();
			expect(isValidParallax("100")).toBeUndefined();
			expect(isValidParallax(0)).toBeUndefined();
			expect(isValidParallax("0")).toBeUndefined();
		});
		it("invalid cases", () => {
			expect(isValidParallax(-101)).toMatch(/-100 ... 100/);
			expect(isValidParallax(101)).toMatch(/-100 ... 100/);
			expect(isValidParallax("oops")).toMatch(/-100 ... 100/);
			expect(isValidParallax("")).toMatch(/-100 ... 100/);
		});
	});
});
