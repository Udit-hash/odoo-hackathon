const express=require ('express');
const UserRouter=require('./routes/authRoutes');
const ProjectRouter=require('./projectRoute.js');

const router=express.Router();

router.use('/user',UserRouter);
router.use('/Project',ProjectRouter);
// router.use('/Task',TaskModel);
// router.use('/Comments',CommentsModel);


module.exports=router;