"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFriendCode = generateFriendCode;
function generateFriendCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}
