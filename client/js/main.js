require(["Game","Renderer","HUD","Console","PilotAudio","pil"],function(Game,Renderer,HUD,Console,PilotAudio,pil) {
	var PILParser = pil;
	pil.yy = window;
	game = new Game(new Renderer(), new HUD(), new Console(PILParser),new PilotAudio());
	game.run();
});