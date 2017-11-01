const gju = require('geojson-utils');
const points = require('../data/pdvs.json');

//Remove wrong points of sale
points.pdvs = points.pdvs.filter(p => p.document.length === 17);

function getPoints() {
    return points;
}

function getPointById(id) {
    ps = points.pdvs.filter(p => p.id === id)
    if (ps.length > 0) {
        return ps[0];
    }
    return {};
}

function addPoint(newPoint) {
    // delete any id from point received
    delete newPoint.id;
    // Generate new ID
    const ids = points.pdvs.map(p => parseInt(p.id, 10));
    generatedId = Math.max(...ids) + 1;
    newPoint.id = '' + generatedId;
    // Check if point is included on the current points
    const pointIncluded = points.pdvs.filter(p => p.id === newPoint.id || p.document === newPoint.document).length > 0;
    var result = {};
    if (pointIncluded) {
        result = {
            'error': 'ID or Document already in use'
        };
    } else if (newPoint.document.length != 17) {
        result = {
            'error': 'Document must have 17 characters'
        };
    } else {
        points.pdvs.push(newPoint);
        result = newPoint;
    }
    return result;
}

function findPoint(latitude, longitude) {
    const point = { 'type': 'Point', 'coordinates': [latitude, longitude] };
    return points.pdvs.filter(p => gju.pointInMultiPolygon(point, p.coverageArea));
}

exports.getPoints = getPoints;
exports.getPointById = getPointById;
exports.addPoint = addPoint;
exports.findPoint = findPoint;