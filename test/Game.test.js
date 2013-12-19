var should = require("should"),
	Game = require("../pilot-server/Game.js");
describe("Game",function() {
	describe("#run",function() {
		it("should throw if socket.io has not been set or is undefined",function() {
			var g = new Game();
			g.run.should.throw();
		});
	});
});