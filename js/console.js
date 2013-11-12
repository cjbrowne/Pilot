(function() {
	function Console() {
		this.history = [];
	}
	Console.prototype.repl = function() {
		var console = this;
		$("#prompt").focus();
		$("#prompt").on('keydown',function(e) {
			e = e || window.event;
			if(e.which == 13) {
				e.preventDefault();
				var result;
				$("#output").append("> " + $("#prompt").val() + "<br />");
				try {
					result = pil.parse($("#prompt").val());
				} catch(e) {
					$("#output").append("Error: " + e + "<br />");
				} finally {
					console.history.push($("#prompt").val());
					$("#output").append(result + "<br />");
					$("#prompt").val("");
				}
			} else if(e.which == 40) {
				// TODO: implement history
			} else if(e.which == 38) {
				// TODO: implement history
			}
		});
		$("#console").on('click',function(e) {
			$("#prompt").focus();
		});
		$("#editor_save").on('click',function(e) {
			try {
				eval.call(window,$("#editor_body").val());
			} catch(e) {
				$("#output").append("Editor caused error: " + e + "<br />");
			} finally {
				// until we get around to emulating some sort of file system...
				$("#output").append("WARNING: Hard Disk Drive disconnected, code was run but may not have been saved.<br />");
			}
		});
		$("#editor_close").on('click',function(e) {
			// again, we need to automatically save when the editor is closed once saving becomes a thing
			// note that this is somewhat of a lie.  The chances are your browser cached the changes and they'll come back if you call "editor()" again.
			$("#output").append("WARNING: Editor closed.  Any changes you made since the last evaluation may have been lost.  Sorry about that. <br/>");
			$("#editor").hide();
			$("#output").show();
			$("#prompt").show();
			$("#PS1").show();
			$("#prompt").focus();
		});
	}
	window.Console = Console;
})();