%{
    window.pil_commands = [];
%}

%lex

%%
\s+							/* Skip whitespace */
"*"                   		return '*';
"/"                   		return '/';
"-"                   		return '-';
"+"                   		return '+';
"^"                   		return '^';
"("                   		return '(';
")"                   		return ')';
"PI"                 		return 'PI';
"E"                   		return 'E';
";"                         return ';';
// booster commands
"thrust"                    return 'thrust';
"stop"                      return 'stop';
"for"                       return 'for';
"until"                     return 'until';

// anatomical positions
"fore"|"front"              return 'fore';
"aft"|"back"                return 'aft';
"port"|"left"               return 'port';
"starboard"|"right"         return 'starboard';
"horizontal"|"h"            return 'horizontal';
"vertical"|"v"              return 'vertical';

// cannon commands
"fire"                      return 'fire';

// time periods
"seconds"|"second"|"s"      return 'seconds';
"minutes"|"minute"|"m"      return 'minutes';
"milliseconds"|"ms"         return 'milliseconds';
"ms"                        return 'milliseconds';
"frames"                    return 'frames';

// literals
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
<<EOF>>               		return 'EOF';
\".*\"                      return 'STRING';

// conditional operators
"="                         return 'is';
"=="                        return 'is';
"is not"                    return 'is not';
"!="                        return 'is not';
"greater than"              return 'greater';
"is greater than"           return 'greater';
">"                         return 'greater';
"less than"                 return 'less';
"is less than"              return 'less';
"is"                        return 'is';
"<"                         return 'less';

// variables
"pitch"                     return 'pitch';
"roll"                      return 'roll';
"yaw"                       return 'yaw';

// misc
'.'                         return '.';
"{"                         return '{';
"}"                         return '}';
"all"                       return 'all';

// commands
"hello"|"hi"|"hey"|"hej"    return 'hello';
"command"                   return 'command';
"run"                       return 'run';
"spawn"                     return 'spawn';
"help"|"?"                  return 'help';
"guide"                     return 'guide';
[a-zA-Z0-9_]*               return 'identifier';
.                           return 'INVALID';

/lex

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start program

%% /* language grammar */

program
    : statements EOF
        {
            if($1 instanceof Array) {
                var last;
                $1.forEach(function(sn) {
                    last = sn.value();
                });
                return last;
            } else if('value' in $1 && $1.value instanceof Function) {
                return $1.value();
            } else {
                return $1;
            }
        }
    ;

statements
    : statement
        {{
            $$ = $1;
            console.log(JSON.stringify($1));
        }}
    | statements ';' statement
        {{
            if($3 instanceof StatementNode) { 
                if($1 instanceof Array) {
                    $1.push($3);
                    $$ = $1;
                } else {
                    $$ = [$1,$3];
                }
            } else {
                $$ = $3;
            }
            console.log(JSON.stringify($1));
        }}
    ;

statement
    : booster-statement
        {$$ = $1;}
    | command-statement
        {$$ = $1;}
    | cannon-statement
        {$$ = $1;}
    ;

booster-statement
    : booster-thrust-statement
        {$$ = $1;}
    | booster-stop-statement
        {$$ = $1;}
    ;

booster-thrust-statement
    : 'thrust' booster-identifier booster-power for-statement
        {{
            $$ = (function(boosterName,boosterPower,time) {
                return new StatementNode({
                    f: function() {
                        game.ship.boostersByName[boosterName].power = boosterPower.value();
                        setTimeout(function() {
                            game.ship.boostersByName[boosterName].power = 0;
                        },time.value());
                    }
                });
            })($2,$3,$4);
        }}
    | 'thrust' booster-identifier booster-power until-statement
        {{
            $$ = (function(boosterName,boosterPower,cond) {
                return new StatementNode({
                    f: function() {
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
                        return boosterPower.value();
                    }
                });
            })($2,$3,$4);
            
        }}
    | 'thrust' booster-identifier booster-power
        {
            $$ = (function(boosterName,boosterPower) {
                return new StatementNode({
                    f: function() {
                        game.ship.boostersByName[boosterName].power = boosterPower.value();
                    }
                });
            })($2,$3);
        }
    ;

booster-identifier
    : booster-position '.' booster-orientation
        {$$ = $1 + " " + $3}
    ;

booster-position
    : 'fore'
        {$$ = "fore";}
    | 'aft'
        {$$ = "aft";}
    | 'port'
        {$$ = "port";}
    | 'starboard'
        {$$ = "starboard";}
    ;

booster-orientation
    : 'horizontal'
        {$$ = "horizontal";}
    | 'vertical'
        {$$ = "vertical";}
    ;

booster-power
    : 'NUMBER'
        {{
            if($1 < 0 || $1 > 100) {
                throw new Error('Booster power out of range.  Should be 0 to 100.');
            }
            $$ = new ConstantNode($1);
        }}
    | variable
        {{
            // TODO: cap variables between 0 and 100 (otherwise this represents a way of cheating)
            $$ = $1;
        }}
    ;

booster-stop-statement
    : 'stop' booster-identifier
        {{
            $$ = (function(boosterName) {
                return new StatementNode({
                    f: function() {
                        game.ship.boostersByName[$2].power = 0;
                    }
                });
            })($2);
        }}
    | 'stop' 'all'
        {{
            $$ = new StatementNode({
                f: function() {
                    game.ship.boosters.forEach(function(booster) {
                        booster.power = 0;
                    });
                }
            });
        }}
    ;

cannon-statement
    : 'fire' cannon-identifier
        {{
            $$ = (function(cannon) {
                return new StatementNode({
                    f: function() {
                        game.ship.cannons[cannon].fire();
                    }
                });
            })($2);
        }}
    | 'fire' cannon-identifier cannon-power
        {{
            $$ = (function(cannon,power) {
                return new StatementNode({
                    f: function() {
                        game.ship.cannons[cannon].fire(power);
                    }
                });
            })($2,$3);
        }}
    ;

cannon-identifier
    : 'fore'
        {$$ = "fore";}
    | 'aft'
        {$$ = "aft";}
    ;

cannon-power
    : 'NUMBER'
        {{
            if($1 < 0 || $1 > 1) {
                throw new Error('Cannon power out of range.  Should be between 0.0 and 1.0.');
            }
            $$ = new ConstantNode($1);
        }}
    ;

for-statement
    : 'for' time-period
        {$$ = $2;}
    ;

until-statement
    : 'until' condition
        {$$ = $2;}
    ;

condition
    : variable
        {{
            $$ = new ConditionNode({
                leftNode: $1
            });
        }}
    | variable 'is' rvalue
        {{
            $$ = new ConditionNode({
                leftNode: $1,
                rightNode: $3,
                operator: '=='
            });
        }}
    | variable 'is not' rvalue
        {{
            $$ = new ConditionNode({
                leftNode: $1,
                rightNode: $3,
                operator: '!='
            });
        }}
    | variable 'greater' rvalue
        {{
            $$ = new ConditionNode({
                leftNode: $1,
                rightNode: $3,
                operator: '>'
            });
        }}
    | variable 'less' rvalue
        {{
            $$ = new ConditionNode({
                leftNode: $1,
                rightNode: $3,
                operator: '<'
            });
        }}
    ;

rvalue
    : variable
        {{
            $$ = $1;
        }}
    | literal
        {{
            $$ = $1;
        }}
    ;

literal
    : NUMBER
        {$$ = new ConstantNode(parseInt($1));}
    | 'true'
        {$$ = new ConstantNode(true);}
    | 'false'
        {$$ = new ConstantNode(false);}
    | STRING
        {$$ = new ConstantNode($1.substring(1,$1.length-1));}
    ;

time-period
    : NUMBER 'seconds'
        {$$ = new ConstantNode($1 * 1000);}
    | NUMBER 'milliseconds'
        {$$ = new ConstantNode($1);}
    | NUMBER 'minutes'
        {$$ = new ConstantNode($1 * 60000);}
    | NUMBER 'frames'
        // TODO: later, we can add a FrameCountdownNode that will reduce in value by 1 every frame.  Maybe.
        {$$ = new ConstantNode($1 / 30);}
    ;

variable
    : 'pitch'
        {{
            $$ = new PropertyAccessNode({
                parentObject:game.ship.location.rotation,
                propertyName:'x',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        }}
    | 'yaw'
        {{
            $$ = new PropertyAccessNode({
                parentObject: game.ship.location.rotation,
                propertyName:'y',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        }}
    | 'roll'
        {{
            $$ = new PropertyAccessNode({
                parentObject: game.ship.location.rotation,
                propertyName:'z',
                accessFunction: function(o,v) {
                    return o[v].toFixed(2);
                }
            });
        }}
    ;

command-statement
    : 'hello'
        {
            $$ = new StatementNode({
                f: function() { game.console.log("Hi, friend!"); return false; }
            });
        }
    | 'command' 'identifier' '{' statements '}'
        {{
            $$ = (function(identifier,statements) {
                if(!statements) {
                    throw new Error('Cannot construct command without statements!');
                }
                statements = ((statements instanceof Array) ? statements : [statements]);
                pil_commands[identifier] = new FunctionNode({
                    statementNodes: statements
                });
                return pil_commands[identifier];
            })($2,$4);
        }}
    | 'run' 'identifier'
        {{
            if(!pil_commands[$2]) {
                throw new Error("Command not found: " + $2);
            }
            $$ = (function(command) {
                return new StatementNode({
                    f: function() { return pil_commands[command].run(); }
                });
            })($2);
        }}
    | 'spawn'
        {{
            $$ = new StatementNode({
                f: function() {
                    game.spawnTargetDrone();
                    return true;
                }
            });
        }}
    | 'help'
        {{
            $$ = new StatementNode({
                f:function() {
                    game.guide('console');
                }
            });
        }}
    | 'guide'
        {{
            $$ = new StatementNode({
                f:function() {
                    game.guide('modal');
                }
            });
        }}
    ;