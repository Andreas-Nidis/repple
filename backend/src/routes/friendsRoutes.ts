import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  sendFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController,
  getFriendsController,
  removeFriendController,
} from '../controllers/friendsController';

const router = express.Router();

router.post('/:friendId', authenticateFirebase, sendFriendRequestController);
router.post('/accept/:friendId', authenticateFirebase, acceptFriendRequestController);
router.post('/reject/:friendId', authenticateFirebase, rejectFriendRequestController);
router.get('/', authenticateFirebase, getFriendsController);
router.delete('/remove/:friendId', authenticateFirebase, removeFriendController);

export default router;
