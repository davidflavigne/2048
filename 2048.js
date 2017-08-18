class Game2048 {
    constructor(name){//build page structure
	console.log("building "+name);
	this.game_array = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
	this.board = document.createElement("div")
	$(this.board).addClass("container");
	this.head = this.buildHead();
	this.content = this.buildContent();
	this.table = this.buildTable();
	this.foot = this.buildFoot();
	$(this.content).append(this.table);
	$(this.board).append(this.head);
	$(this.board).append(this.content);
	$(this.board).append(this.foot);
	$("body").append(this.board);
	this.best_score = 0;
	this.top_tile = 2048;
	this.theme = "default";
	this.inittable();
	var clone = [];
	for(var i=0;i<this.game_array.length;i++){
	    var row = [];
	    for(var j=0;j<this.game_array.length;j++){
		row.push(this.game_array[i][j]);
	    }
	    clone.push(row);
	}
	this.history.push(clone);
    }

    buildHead(){
	var result = document.createElement("div");
	$(result).addClass("container heading");
	$(result).append("<h1>2048</h1>");
	var newgame = document.createElement("button");
	$(newgame).text("New Game");
	$(newgame).addClass("newgame");
	var game = this;
	$(newgame).click(function(){
	    game.startNewGame();
	});
	var undo = document.createElement("button");
	$(undo).text("Undo");
	$(undo).addClass("undo");
	$(undo).click(function(){
	    game.undo();
	});
	var rewind = document.createElement("button");
	$(rewind).text("Rewind");
	$(rewind).addClass("undo");
	$(rewind).click(function(){
	    game.rewind();
	});
	$(result).append("<div id='score_div' class='score'>Score : <span id='score_tag'>0</span></div>");
	$(result).append("<div id='best_score_div' class='score'>Best Score : <span id='best_score_tag'>0</span></div>");
	$(result).append(newgame);
	$(result).append(undo);
	$(result).append(rewind);
	return result;
    }
    buildContent(){
	var result = document.createElement("div");
	$(result).addClass("container gametable");
	var overlay_lose = document.createElement("div");
	$(overlay_lose).attr("id","overlay_lose");
	$(overlay_lose).addClass("overlay_hidden");
	$(overlay_lose).text("GAME OVER");
	$(overlay_lose).prepend("<br>");
	$(overlay_lose).prepend("<br>");
	var overlay_win = document.createElement("div");
	$(overlay_win).attr("id","overlay_win");
	$(overlay_win).addClass("overlay_hidden");
	$(overlay_win).text("YOU WIN");
	$(overlay_win).prepend("<br>");
	$(overlay_win).prepend("<br>");
	$(result).append(overlay_lose);
	$(result).append(overlay_win);
	return result;
    }
    
    buildFoot(){
	var result = document.createElement("div");
	$(result).addClass("container footer");
	$(result).append("<br><span id='end_tag'></span><br>");
	var banana_theme = document.createElement("button");
	$(banana_theme).text("BANANA !");
	$(banana_theme).addClass("btn_theme");
	$(banana_theme).attr("id","thm1");
	var game = this;
	$(banana_theme).click(function(){
	    game.theme = "banana";
	    game.draw_table_text();
	    game.beautify();
	});
	var default_theme = document.createElement("button");
	$(default_theme).text("DEFAULT");
	$(default_theme).addClass("btn_theme");
	$(default_theme).attr("id","thm2");
	$(default_theme).click(function(){
	    game.theme = "default";
	    game.draw_table_text();
	    game.beautify();
	});
	$(result).append(banana_theme);
	$(result).append(default_theme);
	return result;
    }

    buildTable(){
	var result = document.createElement("table");
	$(result).addClass("container table");
	for(var i=0; i<4; i++){
	    var row = document.createElement("tr");
	    for(var j=0; j<4; j++){
		var col = document.createElement("td");
		$(col).attr({"row_nb":i,"col_nb":j});
		$(col).text((this.game_array[i][j]==0)?(" "):(this.game_array[i][j]));
		$(row).append(col);
	    }
	    $(result).append(row);
	}
	return result;
    }
    inittable(){
	this.game_array = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	for(var i =0; i<4;i++){
	    for(var j =0; j<4; j++){
		$(this.table).find("td[row_nb="+i+"][col_nb="+j+"]").html(this.get_text(this.game_array[i][j]));
	    }
	}
	this.end_game = false;
	this.you_win = false;
	this.set_score(0);
	$($(this.foot).find("#end_tag")).text("");
	this.fill_new_cell();
	this.fill_new_cell();
	$("td").removeClass("new");
	$("#overlay_lose").addClass("overlay_hidden");
	$("#overlay_lose").removeClass("overlay_visible");
	$("#overlay_win").addClass("overlay_hidden");
	$("#overlay_win").removeClass("overlay_visible");
	this.beautify();
	this.history = [];
    }
    startNewGame(){
	console.log("starting a new game");
	this.inittable();
    }
    set_best_score(x){
	if(x>this.best_score){
	    this.best_score = x;
	    $($(this.head).find("#best_score_tag")).text(this.best_score);
	}
    }
    set_score(x){
	this.score = x;
	this.set_best_score(this.score);
	$($(this.head).find("#score_tag")).text(this.score);
    }
    draw_table_text(){
	for(var i =0; i<4;i++){
	    for(var j =0; j<4; j++){
		$(this.table).find("td[row_nb="+i+"][col_nb="+j+"]").html(this.get_text(this.game_array[i][j]));
	    }
	}
    }
    undo(){
	if(this.history.length>1){
	    console.log(this.history.length);
	    this.history.pop();
	    this.game_array = this.history[this.history.length -1];

	    this.draw_table_text();
	    this.set_score(0);
	    this.beautify();
	    return true;
	}
	else{
	    this.history=[];
	    var clone = [];
	    for(var i=0;i<this.game_array.length;i++){
		var row = [];
		for(var j=0;j<this.game_array.length;j++){
		    row.push(this.game_array[i][j]);
		}
		clone.push(row);
	    }
	    this.history.push(clone);
	    return false;
	}
    }
    rewind(){
	var continuer = true;
	var count = 0;
	var game = this;
	//while(continuer && count<4){
	var id  = setInterval(function(){
	    continuer = game.undo();
	    if(!continuer)
		clearInterval(id);
	},500);
	//count++;
	//}
    }
    get_text(x){
	switch(this.theme){
	case "banana":
	    return (x==0)?(" "):("<img src='images/banane_"+x+".png' alt='"+x+"' height='80%' width='80%'>");
	case "default": 
	default: 
	    return (x==0)?(" "):(x);
	}
    }
    get_cell(x,y){
	return $(this.table).find("td[row_nb="+x+"][col_nb="+y+"]");
    }
    set_cell(x,y,z){
	this.game_array[x][y] = z;
	this.get_cell(x,y).html(this.get_text(z));
    }
    set_cell_animate(x,y,z){
	this.game_array[x][y] = z;
	this.get_cell(x,y).html(this.get_text(z));
    }
    check_end(){
	var result = true;
	for(var i=0;i<4;i++){
	    for(var j=0;j<4;j++){
		var up =    (i+1 < 4)?(!(this.game_array[i][j]==this.game_array[i+1][j])):(true);
		var down =  (i-1 > 0)?(!(this.game_array[i][j]==this.game_array[i-1][j])):(true);
		var right = (j+1 < 4)?(!(this.game_array[i][j]==this.game_array[i][j+1])):(true);
		var left =  (j-1 > 0)?(!(this.game_array[i][j]==this.game_array[i][j-1])):(true);
		result = result && up && down && right && left;
		if(!result)
		    return false;
	    }
	}
	if(result){
	    $("#overlay_lose").toggleClass("overlay_hidden");
	    $("#overlay_lose").toggleClass("overlay_visible");
	    this.history = [];
	}
	return result;
    }
    fill_new_cell(){
	var done = false;
	if(this.is_full()){
	    console.log("no cell left in table");
	    return this.check_end();
	}
	if(this.you_win){
	    console.log("ending game on a win!!!");
	    $("#overlay_win").toggleClass("overlay_hidden");
	    $("#overlay_win").toggleClass("overlay_visible");
	    this.history = [];
	    return true;
	}
	while(!done){
	    var cell = Math.floor((Math.random()*16)+1)-1;
	    var cell_x = Math.floor(cell/4);
	    var cell_y = Math.floor(cell%4);
	    var value = Math.floor((Math.random()*2)+1)*2;
	    
	    if(this.game_array[cell_x][cell_y] == 0){
		$("td[row_nb="+cell_x+"][col_nb="+cell_y+"]").addClass("new");
		this.set_cell(cell_x,cell_y,value);
		done = true;
	    }
	}
	return false;
    }
    is_full(){
	for(var i=0;i<4;i++){
	    for(var j=0;j<4;j++){
		if(this.game_array[i][j] == 0)
		    return false;
	    }
	}
	return true;
    }
    cell_is_empty(x,y){
	return (this.game_array[x][y] == 0);
    }
    move_cell(start_x,start_y,end_x,end_y){
	$("td[row_nb="+start_x+"][col_nb="+start_y+"]").removeClass("new");
	if(!(end_x>=0 && end_x<4 && end_y>=0 && end_y<4))
	    return false;
	if(this.cell_is_empty(start_x,start_y))
	    return false;
	if(this.cell_is_empty(end_x,end_y)){
	    this.set_cell(end_x,end_y,this.game_array[start_x][start_y]);
	    this.set_cell(start_x,start_y,0);
	    return true;
	}
	return false;
    }
    
    mix_cell(start_x,start_y,end_x,end_y){
	if(!(end_x>=0 && end_x<4 && end_y>=0 && end_y<4))
	    return false;
	if(this.cell_is_empty(start_x,start_y))
	    return false;
	if(this.cell_is_empty(end_x,end_y))
	    return false;
	if(this.game_array[start_x][start_y] == this.game_array[end_x][end_y]){
	    this.set_cell(end_x,end_y,this.game_array[start_x][start_y] + this.game_array[end_x][end_y]);
	    this.set_cell(start_x,start_y,0);
	    var mix_score = this.game_array[start_x][start_y] + this.game_array[end_x][end_y];
	    if(mix_score == this.top_tile){
		this.you_win = true;
		console.log("You win!!!!");
	    }
	    this.set_score(this.score + this.game_array[start_x][start_y] + this.game_array[end_x][end_y]);
	    return true;
	}
	return false;
    }

    move(x,y){
	var all_success = false;
    	for(var i=0;i<4;i++){
    	    if(y == 1 ){
    		var success = true;
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(i,j,i,j+1) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    		for(var j=3;j>=0;j--){
    		    var tmp_success = this.mix_cell(i,j,i,j+1);
    		    success = tmp_success || success;
    		    if(tmp_success)
    			j--;//j++;
		    if(success)
			all_success = success || all_success;
    		}
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(i,j,i,j+1) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    	    }
    	    else if(y == -1 ){
    		var success = true;
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(i,3-j,i,3-j-1) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    		for(var j=3;j>=0;j--){
    		    var tmp_success = this.mix_cell(i,3-j,i,3-j-1);
    		    success = tmp_success || success;
    		    if(tmp_success)
    			j--;//j++;
		    if(success)
			all_success = success || all_success;
    		}
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(i,3-j,i,3-j-1) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    	    }
    	    else if(x == 1 ){
    		var success = true;
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success =this.move_cell(j,i,j+1,i) ||  success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    		for(var j=3;j>=0;j--){
    		    var tmp_success =this.mix_cell(j,i,j+1,i);
    		    success = tmp_success || success;
    		    if(tmp_success)
    			j--;//j++;
		    if(success)
			all_success = success || all_success;
    		}
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success =this.move_cell(j,i,j+1,i) ||  success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    	    }
    	    else if(x == -1 ){
    		var success = true;
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(3-j,i,3-j-1,i) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    		for(var j=3;j>=0;j--){
    		    var tmp_success = this.mix_cell(3-j,i,3-j-1,i);
    		    success = tmp_success || success;
    		    if(tmp_success)
    			j--;//j++;
		    if(success)
			all_success = success || all_success;
    		}
    		while(success){
    		    success = false;
    		    for(var j=0;j<4;j++){
    			success = this.move_cell(3-j,i,3-j-1,i) || success;
    		    }
		    if(success)
			all_success = success || all_success;
    		}
    	    }
    	}
    	if(all_success){
    	    this.end_game = this.fill_new_cell();
	    var clone = [];
	    for(var i=0;i<this.game_array.length;i++){
		var row = [];
		for(var j=0;j<this.game_array.length;j++){
		    row.push(this.game_array[i][j]);
		}
		clone.push(row);
	    }
	    this.history.push(clone);
	    // for(var i=0;i<this.history.length;i++){
	    // 	console.log(this.history[this.history.length -i]);
	    // }
	}
    	else if(this.is_full())
    	    this.end_game = this.check_end();

	
    	return this.end_game;
    }
    move_left(){
	//console.log("left");
	this.move(0,-1);
    }
    move_right(){
	//console.log("right");
	this.move(0,1);
    }
    move_up(){
	//console.log("up");
	this.move(-1,0);
    }
    move_down(){
	//console.log("down");
	this.move(1,0);
    }

    restore(old){
	this.game_array = old["game_array"];
	this.set_best_score (old["best_score"]);
	this.set_score(old["score"]);
	this.top_tile = old["top_tile"];
	this.theme = old["theme"];
	this.history = old["history"];
	this.end_game = old["end_game"];
	this.you_win = old["you_win"];
	this.draw_table_text();
	$($(this.foot).find("#end_tag")).text("");
	$("td").removeClass("new");
	$("#overlay_lose").addClass("overlay_hidden");
	$("#overlay_lose").removeClass("overlay_visible");
	$("#overlay_win").addClass("overlay_hidden");
	$("#overlay_win").removeClass("overlay_visible");
    }
    
    beautify(){
	$("body").css({
	    "font-family":"Helvetica",
	    "font-size":"1.5em"
	});
	$("td").css({
	    "width":"20%",
	    "height":"20%",
	    "font-size":"3em",
	    "font-weight":"bold",
	    "color":"#AB5513",
	    "text-align":"center",
	    "vertical-align":"middle",
	    "border-radius":"10px",
	    "background-color":"lightgrey"
	});
	$(".container").css({
	    "width":"60%",
	    "text-align":"center",
	    "margin":"auto",
	    "margin-top": "10px",
	    //"top": "150px",
	    "padding":"auto",
	    "border-radius":"25px",
	});
	$(".heading").css({
	    "margin-bottom":"1%",
	    "margin-top":"5%",
	});
	$(".table").css({
	    "opacity":"1",
	});
	$(".gametable").css({
	    "width":"590px",
	    "height":"590px",
	    "margin":"auto",
	    "margin-top":"0px",
	    "margin-bottom":"0px",
	    "text-align":"center",
	    "padding":"auto"
	});
	$(".table").css({
	    "width":"590px",
	    "height":"590px",
	    "position":"fixed",
	    "text-align":"center",
	    "margin":"auto",
	    "margin-top":"0px",
	    "margin-bottom":"0px",
	    "border-radius":"15px",
	    "border-spacing":"10px",
	    "background-color":"teal",
	    "padding":"15px",
	    "z-index":"1"
	});
	
	$(".overlay_hidden").css({
	    "display":"none",
	    "z-index":"-1",
	    "opacity":"0",
	    
	});
	
	$(".overlay_visible").css({
	    "display":"table-cell",
	    "z-index":"100",
	    "opacity":"0.8",
	    
	});
	
	$("#overlay_lose,#overlay_win").css({
	    "position":"fixed",
	    "width":"590px",
	    "height":"590px",
	    "text-align":"center",
	    "vertical-align":"middle",
	    "font-size":"3.5em",
	    "border-radius":"15px",
	    "border-spacing":"10px",
	    "background-color":"white",
	});
	
	$(".newgame,.btn_theme").css({
	    "background-color":"chocolate",
	    "width":"40%",
	    "color":"white",
	    "margin":"auto",
	    "margin-left":"5px",
	    "font-size":"20px",
	    "padding":"2%",
	    "padding-top":"2.3%",
	    "padding-bottom":"2.3%",
	    "display":"inline",
	    "border-radius":"5px",
	    "border": "none",
	    "text-decoration": "none",
	});
	
	$(".undo").css({
	    "background-color":"darkcyan",
	    "width":"40%",
	    "color":"white",
	    "margin-top":"5px",
	    "font-size":"20px",
	    "padding":"1%",
	    //"display":"inline",
	    "border-radius":"5px",
	    "border": "none",
	    "text-decoration": "none",
	});
	
	$(".score").css({
	    "font-size":"20px",
	    "color":"white",
	    "margin":"auto",
	    "padding":"2%",
	    "display":"inline",
	    "width":"40%",
	    "border-radius":"5px",
	    "background-color":"chocolate",
	});
	
	$("#score_div").css({
	    "margin-right":"5px"
	});
	
	$("#best_score_div").css({
	    "margin-left":"5px"
	});

	// Colors
	$(this.table).find("td:contains(' ')").css({"background-color":"lightgrey"});
	$(this.table).find("td:contains(2)").css({"background-color":"khaki"});
	$(this.table).find("td:contains(4)").css({"background-color":"greenyellow"});
	$(this.table).find("td:contains(8)").css({"background-color":"green"});
	$(this.table).find("td:contains(16)").css({"background-color":"forestgreen"});
	$(this.table).find("td:contains(32)").css({"background-color":"darkseagreen"});
	$(this.table).find("td:contains(64)").css({"background-color":"darkolivegreen"});
	$(this.table).find("td:contains(128)").css({"background-color":"darkgreen"});
	$(this.table).find("td:contains(256)").css({"background-color":"darkgoldenrod"});
	$(this.table).find("td:contains(512)").css({"background-color":"chocolate"});
	$(this.table).find("td:contains(1024)").css({"background-color":"saddlebrown"});
	$(this.table).find("td:contains(2048)").css({"background-color":"sienna"});


	//some animations
    }
    
}
(function ( $ ) {
    
    $.fn.dmqh = function (){
	var game = null;
	if(typeof localStorage.Game2048 != 'undefined' && localStorage.Game2048 != 'undefined' && localStorage.Game2048.length > 0){
	    game = new Game2048("Game2048");
	    console.log("Retrieve local storage : "+localStorage.getItem("Game2048"));
	    var oldgame = JSON.parse(localStorage.getItem("Game2048"));
	    console.log("Retrieve local storage : "+oldgame);
	    console.log(oldgame['game_array']);
	    game.restore(oldgame);
	}
	else{
	    console.log("New game");
	    game = new Game2048("Game2048");
	}
	localStorage.setItem("Game2048",JSON.stringify(game));
	game.beautify();
	$("body").on("keydown",function(e){
	    if(game.end_game) console.log("It's the end of the game as we know it.");
	    if(!game.end_game){
		switch(e.which){
		case 37: game.move_left(); break;
		case 38: game.move_up(); break;
		case 39: game.move_right(); break;
		case 40: game.move_down(); break;
		}
		game.beautify();
		localStorage.setItem("Game2048",JSON.stringify(game));
	    }
	});
	var targets = $("td");
	var observer = new MutationObserver(function( mutations ) {
	    var appearing_mutations = [];
	    //console.log("mutations : "+mutations.length);
	    for(mutation of mutations){
	     	if(mutation.target.nodeName == "TD" && $(mutation.target).hasClass("new")){
		    appearing_mutations.push(mutation);
		}
	    }
	    //console.log("appearing mutations : "+appearing_mutations.length);
	    appearing_mutations.forEach(function( mutation ) {
	    	if($(mutation.target).hasClass("new")){
	    	    $(mutation.target).css({"opacity":"0","font-size":"0.2em","padding":"0px"});
	    	    $(mutation.target).animate({"opacity":"1","font-size":"3em","padding":"5px"});
	    	}
	    });  
	});

	// Configuration of the observer:
	var config = { 
	    //attributes: true, 
	    childList: true, 
	    characterData: true,
	    //subtree: true,
	    //attributeOldValue: true,
	    //characterDataOldValue: true
	};
	
	// Pass in the target node, as well as the observer options
	for(target of targets)
	    observer.observe(target, config);

	return this;
    } ;
}( jQuery ));
$(document).ready(function (){
    $("body").dmqh();
    
});
