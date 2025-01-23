/**
 *  Includes various useful functions
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import process from "process";

export class Utils {
    /**
     * Check whether the string is a integer.
     * @param value
     */
    public static isInteger(value: string): boolean {
        return /^[+-]?([0-9]+)$/.test(value);
    }

    /**
     * Check whether the string is a positive integer.
     * @param value
     */
    public static isPositiveInteger(value: string): boolean {
        return /^(\+)?([0-9]+)$/.test(value);
    }

    /**
     * Check whether the string is a negative integer.
     * @param value
     */
    public static isNegativeInteger(value: string): boolean {
        return /^-([0-9]+)$/.test(value);
    }

    /**
     * Check whether the string is a positive.
     * @param value
     */
    public static isPositive(value: string): boolean {
        return /^(\+)?[0-9]\d*(\.\d+)?$/.test(value);
    }

    /**
     * Check whether the string is a negative.
     * @param value
     */
    public static isNegative(value: string): boolean {
        return /^-?[0-9]\d*(\.\d+)?$/.test(value);
    }

    /**
     *  Gets the path to where the execution command was entered for this process.
     */
    public static getInitCWD(): string {
        // Get the working directory the user was in when the process was started,
        // as opposed to the `cwd` exposed by node which is the program's path.
        // Try to use `INIT_CWD` which is provided by npm, and fall back to
        // `PWD` otherwise.
        // See also: https://github.com/npm/cli/issues/2033
        if (process.env.INIT_CWD !== undefined) return process.env.INIT_CWD;
        if (process.env.PWD !== undefined) return process.env.PWD;
        return process.cwd();
    }

    public static prefix0X(key: string): string {
        if (key.length < 2) return `0x${key}`;
        if (key.substring(0, 2).toLowerCase() !== "0x") return `0x${key}`;
        else return key;
    }

    public static remove0X(key: string): string {
        if (key.length < 2) return key;
        if (key.substring(0, 2).toLowerCase() === "0x") return key.substring(2);
        else return key;
    }
}
