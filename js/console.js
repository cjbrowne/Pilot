(function() {
	function Console(pil) {
		this.history = [];
		this.pil = pil;
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
					result = console.pil.parse($("#prompt").val());
				} catch(e) {
					$("#output").append("[ERROR] " + e + "<br />");
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
			$("#console")[0].scrollTop = $("#console")[0].scrollHeight;
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
	Console.prototype.log = function(string,logClass) {
		var stardate = ((Date.now() % 10000000) / 1000).toFixed(3);
		logClass = logClass || "pilot_log";
		$("#output").append("<span class='"+logClass+"'>["+stardate+"]</span> <span class='log'>" + string + "</span><br />");
	}
	Console.prototype.warn = function(string,warningLevel) {
		warningLevel = warningLevel || 'low';
		var warningText = "WARNING";
		switch(warningLevel) {
			case 'low':
				warningText = "WARNING";
				break;
			case 'medium':
				warningText = "ALERT";
				break;
			case 'high':
				warningText = "DANGER";
				break;
			case 'critical':
				warningText = "CRITICAL";
				break;
		}
		$("#output").append("<span class='warning_" + warningLevel + "'>["+warningText+"] " + string + "</span><br />");
	}
	window.Console = Console;
})();