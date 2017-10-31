const Router = require('koa-router');
const router = new Router();
const gju = require('geojson-utils');
const points = require('../data/pdvs.json');

//Remove wrong points of sale
points.pdvs = points.pdvs.filter(p => p.document.length === 17);

router.get('/point_of_sale/all', async ctx => {
    ctx.body = JSON.stringify(points);
})

router.get('/point_of_sale/:id', async ctx => {
    const id = ctx.params.id;
    ctx.body = points.pdvs.filter(p => p.id === id);
})

router.get('/point_of_sale', async ctx => {
    const latitude = ctx.request.query.latitude;
    const longitude = ctx.request.query.longitude;
    const point = { 'type': 'Point', 'coordinates': [latitude, longitude] };
    const onCoverage = points.pdvs.filter(p => gju.pointInMultiPolygon(point, p.coverageArea));
    ctx.body = onCoverage;
})

router.post('/point_of_sale/', async ctx => {
    const pointOfSale = ctx.request.body;
    delete pointOfSale.id;
    const ids = points.pdvs.map(p => parseInt(p.id, 10));
    generatedId = Math.max(...ids) + 1;
    pointOfSale.id = '' + generatedId;
    const pointIncluded = points.pdvs.filter(p => p.id === pointOfSale.id || p.document === pointOfSale.document).length > 0;
    if (pointIncluded) {
        ctx.body = {
            'error': 'ID or Document already in use'
        };
    } else if (pointOfSale.document.length != 17) {
        ctx.body = {
            'error': 'Document must have 17 characters'
        };
    } else {
        points.pdvs.push(pointOfSale);
        ctx.body = pointOfSale;
    }
})

module.exports = router