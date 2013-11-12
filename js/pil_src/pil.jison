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
[0-1]+("."[0-9]+)?\b        return 'BOOSTER_POWER';
<<EOF>>               		return 'EOF';
'.'                         return '.';
.                           console.log("invalid token: " + yytext); return 'INVALID';

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
                ship.boostersByName[$2].power = 0;
            },$4);
            $$ = $3;
        }}
    | 'thrust' booster-identifier booster-power until-statement
        {{
            game.ship.boosters[$2].power = $3;
            game.addFunction(function() {
                if($4) {
                    ship.boostersByName[$2].power = 0;
                    return true;
                } else {
                    return false;
                }
            });

            $$ = $3;
        }}
    | 'thrust' booster-identifier booster-power
        {
            console.log("setting booster " + $2 + " to " + $3);
            game.ship.boostersByName[$2].power = $3;
            $$ = $3;
        }
    ;

for-statement
    : 'for' time-period
    ;

until-statement
    : 'until' condition
    ;

booster-stop-statement
    : 'stop' booster-identifier
        {$$ = undefined;}
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
    : 'BOOSTER_POWER'
    | variable
    ;