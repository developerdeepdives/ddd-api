import { Router } from 'express';
import * as RoomController from '../controllers/room';

// BASE PATH = /room
const router = Router();

router.get('/', RoomController.allRooms);
router.get('/:id', RoomController.showRoom);
router.post('/', RoomController.addRoom);
router.put('/:id', RoomController.updateRoom);

export default router;
