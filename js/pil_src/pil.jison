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
"thrust"                    return 'thrust';
"stop"                      return 'stop';
"for"                       return 'for';
"until"                     return 'until';
"fore"                      return 'fore';
"aft"                       return 'aft';
"port"                      return 'port';
"starboard"                 return 'starboard';
"left"                      return 'port';
"right"                     return 'starboard';
"front"                     return 'fore';
"back"                      return 'back';
"horizontal"                return 'horizontal';
"vertical"                  return 'vertical';
"seconds"                   return 'seconds';
"second"                    return 'seconds';
"s"                         return 'seconds';
"minutes"                   return 'minutes';
"minute"                    return 'minutes';
"milliseconds"              return 'milliseconds';
"ms"                        return 'milliseconds';
"frames"                    return 'frames';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
<<EOF>>               		return 'EOF';
\".*\"                      return 'STRING';
"is"                        return 'is';
"="                         return 'is';
"=="                        return 'is';
"is not"                    return 'is not';
"!="                        return 'is not';
"greater than"              return 'greater than';
"is greater than"           return 'greater than';
">"                         return 'greater than';
"less than"                 return 'less than';
"is less than"              return 'less than';
"<"                         return 'less than';
"pitch"                     return 'pitch';
'.'                         return '.';
.                           console.log("invalid token: " + yytext); return 'INVALID';

/lex

%output "..\pil.js"

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
        {return $1;}
    ;

statements
    : statement
        {$$ = $1;}
    | statements statement
        {$$ = $2;}
    ;

statement
    : booster-statement
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
            game.ship.boostersByName[$2].power = $3;
            setTimeout(function() {
                game.ship.boostersByName[$2].power = 0;
            },$4);
            $$ = $3;
        }}
    | 'thrust' booster-identifier booster-power until-statement
        {{
            game.ship.boostersByName[$2].power = $3;
            game.addFunction(function() {
                if($4) {
                    game.ship.boostersByName[$2].power = 0;
                    return true;
                } else {
                    return false;
                }
            });
            $$ = $3;
        }}
    | 'thrust' booster-identifier booster-power
        {
            game.ship.boostersByName[$2].power = $3;
            $$ = $3;
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
            $$ = $1;
        }}
    | variable
    ;

booster-stop-statement
    : 'stop' booster-identifier
        {
            game.ship.boostersByName[$2].power = 0;
            $$ = $2;
        }
    ;

for-statement
    : 'for' time-period
        {$$ = $2;}
    ;

until-statement
    : 'until' condition
        {$2}
    ;

condition
    : variable
        {$$ = $1;}
    | variable 'is' rvalue
        {$$ = ($1 == $3);}
    | variable 'is not' rvalue
        {$$ = ($1 != $3);}
    | variable 'greater than' rvalue
        {$$ = ($1 > $3);}
    | variable 'less than' rvalue
        {$$ = ($1 < $3);}
    ;

rvalue
    : variable
    | literal
    ;

literal
    : NUMBER
    | 'true'
    | 'false'
    | STRING
    ;

time-period
    : NUMBER 'seconds'
        {$$ = $1 * 1000;}
    | NUMBER 'milliseconds'
        {$$ = $1;}
    | NUMBER 'minutes'
        {$$ = $1 * 60000;}
    | NUMBER 'frames'
        {$$ = $1 / 30;} // cheat!
    ;

variable
    : 'pitch'
        {$$ = game.ship.location.rotation.x;}
    ;