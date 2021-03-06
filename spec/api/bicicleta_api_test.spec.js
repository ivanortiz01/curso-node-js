var Bicicleta = require('../../models/bicicleta');
var request = require("request");

describe("Bicicleta API", () => {
    beforeAll(function (done) {
        require("../../bin/www");
        done();
    });

    describe("GET BICICLETAS /", () => {
        it("Status 200", () => {
            Bicicleta.allBicis(function (err, bicis) {
                var a = new Bicicleta(1, 'negra', 'Urbana', [3.385958, -76.524502]);
                Bicicleta.add(a, function (err, bici) {
                    request.get("http://localhost:3000/api/bicicletas", function (error, response, body) {
                        expect(response.statusCode).toBe(200);
                    });
                });
            });
        });
    });
});