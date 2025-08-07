"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const friendsController_1 = require("../controllers/friendsController");
const router = express_1.default.Router();
router.post('/:friendId', authMiddleware_1.authenticateFirebase, friendsController_1.sendFriendRequestController);
router.post('/accept/:friendId', authMiddleware_1.authenticateFirebase, friendsController_1.acceptFriendRequestController);
router.post('/reject/:friendId', authMiddleware_1.authenticateFirebase, friendsController_1.rejectFriendRequestController);
router.get('/', authMiddleware_1.authenticateFirebase, friendsController_1.getFriendsController);
router.delete('/remove/:friendId', authMiddleware_1.authenticateFirebase, friendsController_1.removeFriendController);
exports.default = router;
