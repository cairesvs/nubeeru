const Router = require('koa-router');
const PointOfSale = require('../service/pointOfSale');
const router = new Router();

router.get('/point_of_sale/all', async ctx => {
    ctx.body = PointOfSale.getPoints();
})

router.get('/point_of_sale/:id', async ctx => {
    const id = ctx.params.id;
    ctx.body = PointOfSale.getPointById(id);
})

router.get('/point_of_sale', async ctx => {
    const latitude = ctx.request.query.latitude;
    const longitude = ctx.request.query.longitude;
    ctx.body = PointOfSale.findPoint(latitude, longitude);
})

router.post('/point_of_sale/', async ctx => {
    const pointOfSale = ctx.request.body;
    ctx.body = PointOfSale.addPoint(pointOfSale);
})

module.exports = router