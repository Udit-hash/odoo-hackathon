const express=require ('express');
const UserRouter=require('./routes/authRoutes');
const ProjectRouter=require('./routes/projectRoutes.js');
const TaskModel=require("./routes/taskRoutes.js")
const router=express.Router();

router.use('/user',UserRouter);
router.use('/projects',ProjectRouter);
router.use('/tasks',TaskModel);
// router.use('/Comments',CommentsModel);


module.exports=router;