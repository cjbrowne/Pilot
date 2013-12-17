

define(["ast_built"], function(ast_built){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"statements":4,"EOF":5,"statement":6,";":7,"booster-statement":8,"command-statement":9,"cannon-statement":10,"booster-thrust-statement":11,"booster-stop-statement":12,"thrust":13,"booster-identifier":14,"booster-power":15,"for-statement":16,"until-statement":17,"booster-position":18,".":19,"booster-orientation":20,"fore":21,"aft":22,"port":23,"starboard":24,"horizontal":25,"vertical":26,"NUMBER":27,"variable":28,"stop":29,"all":30,"fire":31,"cannon-identifier":32,"cannon-power":33,"for":34,"time-period":35,"until":36,"condition":37,"is":38,"rvalue":39,"not":40,"greater":41,"less":42,"literal":43,"true":44,"false":45,"STRING":46,"seconds":47,"milliseconds":48,"minutes":49,"frames":50,"pitch":51,"yaw":52,"roll":53,"hello":54,"command":55,"identifier":56,"{":57,"}":58,"run":59,"spawn":60,"help":61,"guide":62,"help-expression":63,"in":64,"loop":65,"alert":66,"alert-status":67,"red":68,"yellow":69,"none":70,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:";",13:"thrust",19:".",21:"fore",22:"aft",23:"port",24:"starboard",25:"horizontal",26:"vertical",27:"NUMBER",29:"stop",30:"all",31:"fire",34:"for",36:"until",38:"is",40:"not",41:"greater",42:"less",44:"true",45:"false",46:"STRING",47:"seconds",48:"milliseconds",49:"minutes",50:"frames",51:"pitch",52:"yaw",53:"roll",54:"hello",55:"command",56:"identifier",57:"{",58:"}",59:"run",60:"spawn",61:"help",62:"guide",64:"in",65:"loop",66:"alert",68:"red",69:"yellow",70:"none"},
productions_: [0,[3,2],[4,1],[4,3],[6,1],[6,1],[6,1],[8,1],[8,1],[11,4],[11,4],[11,3],[14,3],[18,1],[18,1],[18,1],[18,1],[20,1],[20,1],[15,1],[15,1],[12,2],[12,2],[10,2],[10,3],[32,1],[32,1],[33,1],[16,2],[17,2],[37,1],[37,3],[37,4],[37,3],[37,3],[39,1],[39,1],[43,1],[43,1],[43,1],[43,1],[35,2],[35,2],[35,2],[35,2],[28,1],[28,1],[28,1],[9,1],[9,5],[9,2],[9,1],[9,1],[9,1],[9,1],[9,5],[9,5],[9,2],[63,2],[63,2],[63,2],[63,2],[63,2],[63,2],[63,2],[63,2],[67,1],[67,1],[67,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
            if($$[$0-1] instanceof Array) {
                var last;
                $$[$0-1].forEach(function(sn) {
                    last = sn.value(function(){});
                });
                return last;
            } else if('value' in $$[$0-1] && $$[$0-1].value instanceof Function) {
                return $$[$0-1].value(function(){});
            } else {
                return $$[$0-1];
            }
        
break;
case 2:
            this.$ = $$[$0];
            console.log(JSON.stringify($$[$0]));
        
break;
case 3:
            if($$[$0] instanceof StatementNode) { 
                if($$[$0-2] instanceof Array) {
                    $$[$0-2].push($$[$0]);
                    this.$ = $$[$0-2];
                } else {
                    this.$ = [$$[$0-2],$$[$0]];
                }
            } else {
                this.$ = $$[$0];
            }
            console.log(JSON.stringify($$[$0-2]));
        
break;
case 4:this.$ = $$[$0];
break;
case 5:this.$ = $$[$0];
break;
case 6:this.$ = $$[$0];
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:
            this.$ = (function(boosterName,boosterPower,time) {
                return new StatementNode({
                    f: function(done) {
                        game.ship.boostersByName[boosterName].power = boosterPower.value();
                        setTimeout(function() {
                            game.ship.boostersByName[boosterName].power = 0;
                            done();
                        },time.value());
                    }
                });
            })($$[$0-2],$$[$0-1],$$[$0]);
        
break;
case 10:
            this.$ = (function(boosterName,boosterPower,cond) {
                return new StatementNode({
                    f: function(done) {
                        if(!cond.value())
                        game.ship.boostersByName[boosterName].power = boosterPower.value();
                        game.addFunction(function() {
                            if(cond.value()) {
                                game.ship.boostersByName[boosterName].power = 0;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        done();
                    }
                });
            })($$[$0-2],$$[$0-1],$$[$0]);
            
        
break;
case 11:
            this.$ = (function(boosterName,boosterPower) {
                return new StatementNode({
                    f: function(done) {
                        game.ship.boostersByName[boosterName].power = boosterPower.value();
                        done();
                    }
                });
            })($$[$0-1],$$[$0]);
        
break;
case 12:this.$ = $$[$0-2] + " " + $$[$0]
break;
case 13:this.$ = "fore";
break;
case 14:this.$ = "aft";
break;
case 15:this.$ = "port";
break;
case 16:this.$ = "starboard";
break;
case 17:this.$ = "horizontal";
break;
case 18:this.$ = "vertical";
break;
case 19:
            if($$[$0] < 0 || $$[$0] > 100) {
                throw new Error('Booster power out of range.  Should be 0 to 100.');
            }
            this.$ = new ConstantNode($$[$0]);
        
break;
case 20:
            // TODO: cap variables between 0 and 100 (otherwise this represents a way of cheating)
            this.$ = $$[$0];
        
break;
case 21:
            this.$ = (function(boosterName) {
                return new StatementNode({
                    f: function(done) {
                        game.ship.boostersByName[$$[$0]].power = 0;
                        done();
                    }
                });
            })($$[$0]);
        
break;
case 22:
            this.$ = new StatementNode({
                f: function(done) {
                    game.ship.boosters.forEach(function(booster) {
                        booster.power = 0;
                    });
                    done();
                }
            });
        
break;
case 23:
            this.$ = (function(cannon) {
                return new StatementNode({
                    f: function(done) {
                        game.ship.cannons[cannon].fire();
                        done();
                    }
                });
            })($$[$0]);
        
break;
case 24:
            this.$ = (function(cannon,power) {
                return new StatementNode({
                    f: function(done) {
                        game.ship.cannons[cannon].fire(power);
                        done();
                    }
                });
            })($$[$0-1],$$[$0]);
        
break;
case 25:this.$ = "fore";
break;
case 26:this.$ = "aft";
break;
case 27:
            if($$[$0] < 0 || $$[$0] > 1) {
                throw new Error('Cannon power out of range.  Should be between 0.0 and 1.0.');
            }
            this.$ = new ConstantNode($$[$0]);
        
break;
case 28:this.$ = $$[$0];
break;
case 29:this.$ = $$[$0];
break;
case 30:
            this.$ = new ConditionNode({
                leftNode: $$[$0]
            });
        
break;
case 31:
            this.$ = new ConditionNode({
                leftNode: $$[$0-2],
                rightNode: $$[$0],
                operator: '=='
            });
        
break;
case 32:
            this.$ = new ConditionNode({
                leftNode: $$[$0-3],
                rightNode: $$[$0-1],
                operator: '!='
            });
        
break;
case 33:
            this.$ = new ConditionNode({
                leftNode: $$[$0-2],
                rightNode: $$[$0],
                operator: '>'
            });
        
break;
case 34:
            this.$ = new ConditionNode({
                leftNode: $$[$0-2],
                rightNode: $$[$0],
                operator: '<'
            });
        
break;
case 35:
            this.$ = $$[$0];
        
break;
case 36:
            this.$ = $$[$0];
        
break;
case 37:this.$ = new ConstantNode(parseInt($$[$0]));
break;
case 38:this.$ = new ConstantNode(true);
break;
case 39:this.$ = new ConstantNode(false);
break;
case 40:this.$ = new ConstantNode($$[$0].substring(1,$$[$0].length-1));
break;
case 41:this.$ = new ConstantNode($$[$0-1] * 1000);
break;
case 42:this.$ = new ConstantNode($$[$0-1]);
break;
case 43:this.$ = new ConstantNode($$[$0-1] * 60000);
break;
case 44:this.$ = new ConstantNode($$[$0-1] / 30);
break;
case 45:
            this.$ = new PropertyAccessNode({
                parentObject:game.ship.location.rotation,
                propertyName:'x',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        
break;
case 46:
            this.$ = new PropertyAccessNode({
                parentObject: game.ship.location.rotation,
                propertyName:'y',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        
break;
case 47:
            this.$ = new PropertyAccessNode({
                parentObject: game.ship.location.rotation,
                propertyName:'z',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        
break;
case 48:
            this.$ = new StatementNode({
                f: function(done) { game.console.log("Hi, friend!"); if(done) done(); }
            });
        
break;
case 49:
            this.$ = (function(identifier,statements) {
                if(!statements) {
                    throw new Error('Cannot construct command without statements!');
                }
                statements = ((statements instanceof Array) ? statements : [statements]);
                pil_commands[identifier] = new FunctionNode({
                    statementNodes: statements
                });
                return pil_commands[identifier];
            })($$[$0-3],$$[$0-1]);
        
break;
case 50:
            if(!pil_commands[$$[$0]]) {
                throw new Error("Command not found: " + $$[$0]);
            }
            this.$ = (function(command) {
                return new StatementNode({
                    f: function(done) { pil_commands[command].run(); done(); }
                });
            })($$[$0]);
        
break;
case 51:
            this.$ = new StatementNode({
                f: function(done) {
                    game.spawnTargetDrone();
                    done();
                }
            });
        
break;
case 52:
            this.$ = new StatementNode({
                f:function(done) {
                    game.guide('console');
                    if(done) done();
                }
            });
        
break;
case 53:
            this.$ = new StatementNode({
                f:function(done) {
                    game.guide('modal');
                    if(done) done();
                }
            });
        
break;
case 54:
            this.$ = new StatementNode({
                f:function(done) {
                    if(game.helpText[$$[$0]]) {
                        game.console.showHelp($$[$0],game.helpText[$$[$0]][0],game.helpText[$$[$0]][1]);
                        if(done) done();
                    } else {
                        if(done) done();
                        throw new Error('Could not find help for command: ' + $$[$0]);
                    }
                }
            });
        
break;
case 55:
            this.$ = (function(time,statements) {
                if(!statements) {
                    throw new Error('Cannot run delayed command without statements!');
                }
                statements = ((statements instanceof Array) ? statements : [statements]);
                var dn = new PILDelayNode({
                    statementNodes: statements,
                    delay: time
                });
                return new StatementNode({
                    f: function(done) {
                        dn.run(done);
                    }
                })
            })($$[$0-3].value(),$$[$0-1]);
        
break;
case 56:
            this.$ = (function(time,statements) {
                if(!statements) {
                    throw new Error('Cannot run looping command without statements!');
                }
                statements = ((statements instanceof Array) ? statements : [statements]);
                var fn = new FunctionNode({
                    statementNodes: statements
                });
                var startTime = Date.now();
                return new StatementNode({
                    f: function(done) {
                        game.addFunction(function () {
                            fn.run(done);
                            return (Date.now() - startTime >= time);
                        });
                    }
                });
            })($$[$0-3].value(),$$[$0-1]);
        
break;
case 57:
            this.$ = new StatementNode({
                f: function(done) {
                    game.setAlert($$[$0]);
                    done();
                }
            });
        
break;
case 58: this.$ = "run"; 
break;
case 59: this.$ = "thrust"; 
break;
case 60: this.$ = "help"; 
break;
case 61: this.$ = "stop"; 
break;
case 62: this.$ = "fire"; 
break;
case 63: this.$ = "spawn"; 
break;
case 64: this.$ = "guide"; 
break;
case 65: this.$ = "loop"; 
break;
case 66: this.$ = $$[$0]; 
break;
case 67: this.$ = $$[$0]; 
break;
case 68: this.$ = $$[$0]; 
break;
}
},
table: [{3:1,4:2,6:3,8:4,9:5,10:6,11:7,12:8,13:[1,20],29:[1,21],31:[1,19],54:[1,9],55:[1,10],59:[1,11],60:[1,12],61:[1,13],62:[1,14],63:15,64:[1,16],65:[1,17],66:[1,18]},{1:[3]},{5:[1,22],7:[1,23]},{5:[2,2],7:[2,2],58:[2,2]},{5:[2,4],7:[2,4],58:[2,4]},{5:[2,5],7:[2,5],58:[2,5]},{5:[2,6],7:[2,6],58:[2,6]},{5:[2,7],7:[2,7],58:[2,7]},{5:[2,8],7:[2,8],58:[2,8]},{5:[2,48],7:[2,48],58:[2,48]},{56:[1,24]},{56:[1,25]},{5:[2,51],7:[2,51],58:[2,51]},{5:[2,52],7:[2,52],13:[1,27],29:[1,29],31:[1,30],58:[2,52],59:[1,26],60:[1,31],61:[1,28],62:[1,32],65:[1,33]},{5:[2,53],7:[2,53],58:[2,53]},{5:[2,54],7:[2,54],58:[2,54]},{27:[1,35],35:34},{27:[1,35],35:36},{67:37,68:[1,38],69:[1,39],70:[1,40]},{21:[1,42],22:[1,43],32:41},{14:44,18:45,21:[1,46],22:[1,47],23:[1,48],24:[1,49]},{14:50,18:45,21:[1,46],22:[1,47],23:[1,48],24:[1,49],30:[1,51]},{1:[2,1]},{6:52,8:4,9:5,10:6,11:7,12:8,13:[1,20],29:[1,21],31:[1,19],54:[1,9],55:[1,10],59:[1,11],60:[1,12],61:[1,13],62:[1,14],63:15,64:[1,16],65:[1,17],66:[1,18]},{57:[1,53]},{5:[2,50],7:[2,50],58:[2,50]},{5:[2,58],7:[2,58],58:[2,58]},{5:[2,59],7:[2,59],58:[2,59]},{5:[2,60],7:[2,60],58:[2,60]},{5:[2,61],7:[2,61],58:[2,61]},{5:[2,62],7:[2,62],58:[2,62]},{5:[2,63],7:[2,63],58:[2,63]},{5:[2,64],7:[2,64],58:[2,64]},{5:[2,65],7:[2,65],58:[2,65]},{57:[1,54]},{47:[1,55],48:[1,56],49:[1,57],50:[1,58]},{57:[1,59]},{5:[2,57],7:[2,57],58:[2,57]},{5:[2,66],7:[2,66],58:[2,66]},{5:[2,67],7:[2,67],58:[2,67]},{5:[2,68],7:[2,68],58:[2,68]},{5:[2,23],7:[2,23],27:[1,61],33:60,58:[2,23]},{5:[2,25],7:[2,25],27:[2,25],58:[2,25]},{5:[2,26],7:[2,26],27:[2,26],58:[2,26]},{15:62,27:[1,63],28:64,51:[1,65],52:[1,66],53:[1,67]},{19:[1,68]},{19:[2,13]},{19:[2,14]},{19:[2,15]},{19:[2,16]},{5:[2,21],7:[2,21],58:[2,21]},{5:[2,22],7:[2,22],58:[2,22]},{5:[2,3],7:[2,3],58:[2,3]},{4:69,6:3,8:4,9:5,10:6,11:7,12:8,13:[1,20],29:[1,21],31:[1,19],54:[1,9],55:[1,10],59:[1,11],60:[1,12],61:[1,13],62:[1,14],63:15,64:[1,16],65:[1,17],66:[1,18]},{4:70,6:3,8:4,9:5,10:6,11:7,12:8,13:[1,20],29:[1,21],31:[1,19],54:[1,9],55:[1,10],59:[1,11],60:[1,12],61:[1,13],62:[1,14],63:15,64:[1,16],65:[1,17],66:[1,18]},{5:[2,41],7:[2,41],57:[2,41],58:[2,41]},{5:[2,42],7:[2,42],57:[2,42],58:[2,42]},{5:[2,43],7:[2,43],57:[2,43],58:[2,43]},{5:[2,44],7:[2,44],57:[2,44],58:[2,44]},{4:71,6:3,8:4,9:5,10:6,11:7,12:8,13:[1,20],29:[1,21],31:[1,19],54:[1,9],55:[1,10],59:[1,11],60:[1,12],61:[1,13],62:[1,14],63:15,64:[1,16],65:[1,17],66:[1,18]},{5:[2,24],7:[2,24],58:[2,24]},{5:[2,27],7:[2,27],58:[2,27]},{5:[2,11],7:[2,11],16:72,17:73,34:[1,74],36:[1,75],58:[2,11]},{5:[2,19],7:[2,19],34:[2,19],36:[2,19],58:[2,19]},{5:[2,20],7:[2,20],34:[2,20],36:[2,20],58:[2,20]},{5:[2,45],7:[2,45],34:[2,45],36:[2,45],38:[2,45],41:[2,45],42:[2,45],58:[2,45]},{5:[2,46],7:[2,46],34:[2,46],36:[2,46],38:[2,46],41:[2,46],42:[2,46],58:[2,46]},{5:[2,47],7:[2,47],34:[2,47],36:[2,47],38:[2,47],41:[2,47],42:[2,47],58:[2,47]},{20:76,25:[1,77],26:[1,78]},{7:[1,23],58:[1,79]},{7:[1,23],58:[1,80]},{7:[1,23],58:[1,81]},{5:[2,9],7:[2,9],58:[2,9]},{5:[2,10],7:[2,10],58:[2,10]},{27:[1,35],35:82},{28:84,37:83,51:[1,65],52:[1,66],53:[1,67]},{5:[2,12],7:[2,12],27:[2,12],51:[2,12],52:[2,12],53:[2,12],58:[2,12]},{5:[2,17],7:[2,17],27:[2,17],51:[2,17],52:[2,17],53:[2,17],58:[2,17]},{5:[2,18],7:[2,18],27:[2,18],51:[2,18],52:[2,18],53:[2,18],58:[2,18]},{5:[2,49],7:[2,49],58:[2,49]},{5:[2,55],7:[2,55],58:[2,55]},{5:[2,56],7:[2,56],58:[2,56]},{5:[2,28],7:[2,28],58:[2,28]},{5:[2,29],7:[2,29],58:[2,29]},{5:[2,30],7:[2,30],38:[1,85],41:[1,86],42:[1,87],58:[2,30]},{27:[1,92],28:90,39:88,40:[1,89],43:91,44:[1,93],45:[1,94],46:[1,95],51:[1,65],52:[1,66],53:[1,67]},{27:[1,92],28:90,39:96,43:91,44:[1,93],45:[1,94],46:[1,95],51:[1,65],52:[1,66],53:[1,67]},{27:[1,92],28:90,39:97,43:91,44:[1,93],45:[1,94],46:[1,95],51:[1,65],52:[1,66],53:[1,67]},{5:[2,31],7:[2,31],58:[2,31]},{27:[1,92],28:90,39:98,43:91,44:[1,93],45:[1,94],46:[1,95],51:[1,65],52:[1,66],53:[1,67]},{5:[2,35],7:[2,35],58:[2,35]},{5:[2,36],7:[2,36],58:[2,36]},{5:[2,37],7:[2,37],58:[2,37]},{5:[2,38],7:[2,38],58:[2,38]},{5:[2,39],7:[2,39],58:[2,39]},{5:[2,40],7:[2,40],58:[2,40]},{5:[2,33],7:[2,33],58:[2,33]},{5:[2,34],7:[2,34],58:[2,34]},{5:[2,32],7:[2,32],58:[2,32]}],
defaultActions: {22:[2,1],46:[2,13],47:[2,14],48:[2,15],49:[2,16]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    var AST = ast_built;
    var StatementNode = AST.StatementNode,
        ConditionNode = AST.ConditionNode,
        ConstantNode = AST.ConstantNode,
        DelayNode = AST.DelayNode,
        FunctionNode = AST.FunctionNode,
        PropertyAccessNode = AST.PropertyAccessNode,
        VariableNode = AST.VariableNode;

/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Skip whitespace */
break;
case 1:return '*';
break;
case 2:return '/';
break;
case 3:return '-';
break;
case 4:return '+';
break;
case 5:return '^';
break;
case 6:return '(';
break;
case 7:return ')';
break;
case 8:return 'PI';
break;
case 9:return 'E';
break;
case 10:return 7;
break;
case 11:return 13;
break;
case 12:return 29;
break;
case 13:return 34;
break;
case 14:return 36;
break;
case 15:return 21;
break;
case 16:return 22;
break;
case 17:return 23;
break;
case 18:return 24;
break;
case 19:return 25;
break;
case 20:return 26;
break;
case 21:return 31;
break;
case 22:return 47;
break;
case 23:return 49;
break;
case 24:return 48;
break;
case 25:return 48;
break;
case 26:return 50;
break;
case 27:return 27;
break;
case 28:return 5;
break;
case 29:return 46;
break;
case 30:return 38;
break;
case 31:return 38;
break;
case 32:return 'is not';
break;
case 33:return 'is not';
break;
case 34:return 41;
break;
case 35:return 41;
break;
case 36:return 41;
break;
case 37:return 42;
break;
case 38:return 42;
break;
case 39:return 38;
break;
case 40:return 42;
break;
case 41:return 51;
break;
case 42:return 53;
break;
case 43:return 52;
break;
case 44:return 68;
break;
case 45:return 69;
break;
case 46:return 70;
break;
case 47:return 19;
break;
case 48:return 57;
break;
case 49:return 58;
break;
case 50:return 30;
break;
case 51:return 54;
break;
case 52:return 55;
break;
case 53:return 59;
break;
case 54:return 60;
break;
case 55:return 61;
break;
case 56:return 62;
break;
case 57:return 64;
break;
case 58:return 65;
break;
case 59:return 66;
break;
case 60:return 56;
break;
case 61:return 'INVALID';
break;
}
},
rules: [/^(?:\s+)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:PI\b)/,/^(?:E\b)/,/^(?:;)/,/^(?:thrust\b)/,/^(?:stop\b)/,/^(?:for\b)/,/^(?:until\b)/,/^(?:fore|front\b)/,/^(?:aft|back\b)/,/^(?:port|left\b)/,/^(?:starboard|right\b)/,/^(?:horizontal|h\b)/,/^(?:vertical|v\b)/,/^(?:fire\b)/,/^(?:seconds|second|s\b)/,/^(?:minutes|minute|m\b)/,/^(?:milliseconds|ms\b)/,/^(?:ms\b)/,/^(?:frames\b)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:$)/,/^(?:".*")/,/^(?:=)/,/^(?:==)/,/^(?:is not\b)/,/^(?:!=)/,/^(?:greater than\b)/,/^(?:is greater than\b)/,/^(?:>)/,/^(?:less than\b)/,/^(?:is less than\b)/,/^(?:is\b)/,/^(?:<)/,/^(?:pitch\b)/,/^(?:roll\b)/,/^(?:yaw\b)/,/^(?:red|offensive\b)/,/^(?:yellow|defensive\b)/,/^(?:none\b)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:all\b)/,/^(?:hello|hi|hey|hej\b)/,/^(?:command\b)/,/^(?:run\b)/,/^(?:spawn\b)/,/^(?:help|\?)/,/^(?:guide\b)/,/^(?:in\b)/,/^(?:loop|while|for\b)/,/^(?:alert\b)/,/^(?:[a-zA-Z0-9_]*)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
return parser;
});