import express from 'express';


const router = express.Router();

router.get('/test', (req, res) => {
    res.json({
        message: 'Welcome to the User API',
        status: 'success'
    });
});

export default router;