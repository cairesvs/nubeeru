const PointOfSale = require('../service/pointOfSale');
const should = require('should');

const fixtures = require('./fixtures/pointsOfSale');

describe('Point of sale', function () {
    describe('Get point of sale by id', function () {
        it('should get point', function () {
            ps = PointOfSale.getPointById('1');
            ps.should.eql(fixtures.SimplePointOfSale);
        });
    })

    describe('Insert point', function () {
        it('should get point inserted', function () {
            result = PointOfSale.addPoint(fixtures.ToBeInsertedPointOfSale);
            ps = PointOfSale.getPointById(result.id);
            ps.should.eql(fixtures.ToBeInsertedPointOfSale);
        });
    })

    describe('Insert point with repeated document', function () {
        it('should not work', function () {
            result = PointOfSale.addPoint(fixtures.ProblematicPointOfSale);
            result.error.should.eql('ID or Document already in use');
        });
    })

    describe('Insert point with document with size bigger or smaller than 17', function () {
        it('should not work', function () {
            fixtures.PointsOfSaleWithDocumentProblem.forEach(p => {
                result = PointOfSale.addPoint(p);
                result.error.should.eql('Document must have 17 characters');
            })
        });
    })

    describe('Find point of sale given point', function () {
        it('should return points of sale', function () {
            pointsOfSale = PointOfSale.findPoint(fixtures.UserPoint.latitude, fixtures.UserPoint.longitude);
            pointsOfSale.length.should.equal(1);
            pointsOfSale.forEach(p => p.should.eql(fixtures.SimplePointOfSale));
        });
    })
})