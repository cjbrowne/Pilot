var should = require("should"),
	pilot_server = require("pilot-server"),
	Game = pilot_server.Game;
describe("Game",function() {
	describe("#run",function() {
		it("should throw if socket.io has not been set or is undefined",function() {
			var g = new Game();
			g.run.should.throw();
		});
	});
});