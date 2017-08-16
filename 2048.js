class Game2048 {
    constructor(name){//build page structure
	console.log("building "+name);
	//this.game_array = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
	this.game_array = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
	this.board = document.createElement("div")
	$(this.board).addClass("container");
	this.head = this.buildHead();
	this.content = this.buildContent();
	this.table = this.buildTable();
	this.foot = this.buildFoot();
	$(this.content).append(this.table);
	$(this.board).append(this.head);
	$(this.board).append(this.table);
	$(this.board).append(this.foot);
	$("body").append(this.board);
	this.best_score = 0;
	this.inittable();
    }

    buildHead(){
	var result = document.createElement("div");
	$(result).addClass("container heading");
	$(result).append("<h1>2048</h1>");
	$(result).append("<div>Score : <span id='score_tag'>0</span></div>    ");
	$(result).append("<div>Best Score : <span id='best_score_tag'>0</span></div><br>");
	var newgame = document.createElement("button");
	$(newgame).text("New Game");
	var game = this;
	$(newgame).click(function(){
	    game.startNewGame();
	});
	//$(result).append("<button id='new_game_button'>New game</button><br>");
	$(result).append(newgame);
	return result;
    }
    
    buildContent(){
	var result = document.createElement("div");
	$(result).addClass("container gametable");
	return result;
    }
    
    buildFoot(){
	var result = document.createElement("div");
	$(result).addClass("container footer");
	$(result).append("<br><span id='end_tag'></span><br>");
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
	//this.game_array = [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]];
	for(var i =0; i<4;i++){
	    for(var j =0; j<4; j++){
		$(this.table).find("td[row_nb="+i+"][col_nb="+j+"]").text(this.get_text(this.game_array[i][j]));
	    }
	}
	this.end_game = false;
	this.set_score(0);
	$($(this.foot).find("#end_tag")).text("");
	this.fill_new_cell();
	this.fill_new_cell();
    }
    startNewGame(){
	console.log("starting a new game");
	this.inittable();
    }
    set_best_score(x){
	if(x>this.best_score){
	    this.best_score = x;
	    $($(this.head).find("#best_score_tag")).text(this.best_score);
	    console.log("New record: "+this.best_score);
	}
    }
    set_score(x){
	this.score = x;
	this.set_best_score(this.score);
	$($(this.head).find("#score_tag")).text(this.score);
	console.log("Score: "+this.score);
    }
    draw_table_text(){
	for(var i =0; i<4;i++){
	    for(var j =0; j<4; j++){
		$(this.table).find("td[row_nb="+i+"][col_nb="+j+"]").text(this.get_text(this.game_array[i][j]));
	    }
	}
    }
    get_text(x){
	return (x==0)?("."):(x);
    }
    get_cell(x,y){
	return $(this.table).find("td[row_nb="+x+"][col_nb="+y+"]");
    }
    set_cell(x,y,z){
	this.game_array[x][y] = z;
	//$(this.table).find("td[row_nb="+x+"][col_nb="+y+"]").text(this.get_text(z));
	this.get_cell(x,y).text(this.get_text(z));
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
	    $($(this.foot).find("#end_tag")).text("GAME OVER!!!!");
	}
	return result;
    }
    fill_new_cell(){
	var done = false;
	if(this.is_full()){
	    console.log("no cell left in table");
	    return this.check_end();
	    //return false;
	}
	while(!done){
	    var cell = Math.floor((Math.random()*16)+1)-1;
	    var cell_x = Math.floor(cell/4);
	    var cell_y = Math.floor(cell%4);
	    var value = Math.floor((Math.random()*2)+1)*2;
	    
	    //console.log("CREATING NEW CELL");
	    if(this.game_array[cell_x][cell_y] == 0){
		//console.log("Cell " + cell+": "+value);
		this.set_cell(cell_x,cell_y,value);
		done = true;
	    }
	    //console.log("CREATING NEW CELL END");
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
	//console.log("empty : " + x + ","+y);
	return (this.game_array[x][y] == 0);
    }
    move_cell(start_x,start_y,end_x,end_y){
	if(!(end_x>=0 && end_x<4 && end_y>=0 && end_y<4))
	    return false;
	if(this.cell_is_empty(start_x,start_y))
	    return false;
	if(this.cell_is_empty(end_x,end_y)){
	    this.set_cell(end_x,end_y,this.game_array[start_x][start_y]);
	    this.set_cell(start_x,start_y,0);
	    //console.log("start:("+start_x+","+start_y+") -> end:("+end_x+","+end_y+")");
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
	    this.set_score(this.score + this.game_array[start_x][start_y] + this.game_array[end_x][end_y]);
	    //console.log("start:("+start_x+","+start_y+") -> end:("+end_x+","+end_y+")");
	    return true;
	}
	return false;
    }
    
    move(x,y){
	//console.log("MOVING __ x: "+x+" - y:"+y);
	for(var i=0;i<4;i++){
	    if(y == 1 ){
		var success = true;
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(i,j,i,j+1) || success;
		    }
		}
		for(var j=0;j<4;j++){
		    var tmp_success = this.mix_cell(i,j,i,j+1);
		    success = tmp_success || success;
		    if(tmp_success)
			j++;
		}
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(i,j,i,j+1) || success;
		    }
		}
	    }
	    else if(y == -1 ){
		var success = true;
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(i,3-j,i,3-j-1) || success;
		    }
		}
		for(var j=0;j<4;j++){
		    var tmp_success = this.mix_cell(i,3-j,i,3-j-1);
		    success = tmp_success || success;
		    if(tmp_success)
			j++;
		}
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(i,3-j,i,3-j-1) || success;
		    }
		}
	    }
	    else if(x == 1 ){
		var success = true;
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success =this.move_cell(j,i,j+1,i) ||  success;
		    }
		}
		for(var j=0;j<4;j++){
		    var tmp_success =this.mix_cell(j,i,j+1,i);
		    success = tmp_success || success;
		    if(tmp_success)
			j++;
		}
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success =this.move_cell(j,i,j+1,i) ||  success;
		    }
		}
	    }
	    else if(x == -1 ){
		var success = true;
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(3-j,i,3-j-1,i) || success;
		    }
		}
		for(var j=0;j<4;j++){
		    var tmp_success = this.mix_cell(3-j,i,3-j-1,i);
		    success = tmp_success || success;
		    if(tmp_success)
			j++;
		}
		while(success){
		    success = false;
		    for(var j=0;j<4;j++){
			success = this.move_cell(3-j,i,3-j-1,i) || success;
		    }
		}
	    }
	}
	this.end_game = this.fill_new_cell();
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

    beautify(){
	$("td").css({
	    "width":"50px",
	    "height":"50px",
	});
	$(".container").css({
	    "width":"50%",
	    "display":"block",
	    "text-align":"center",
	    "margin":"auto",
	    "background-color":"lightgrey",
	    "border":"1px solid black"
	});
	$(".table").css({
	    "text-align":"center",
	    "margin-right":"25%",
	    "margin-left":"25%",
	    //"padding-left":"20%"
	    //"padding-right":"20%"
	});
    }
    
}
$.fn.dmqh = function (){
    var game = new Game2048("Game2048");
    game.beautify();
    $("body").on("keydown",function(e){
	//game.fill_new_cell();
	if(game.end_game) console.log("It's the end of the game as we know it.");
	if(!game.end_game){
	    switch(e.which){
	    case 37: game.move_left(); break;
	    case 38: game.move_up(); break;
	    case 39: game.move_right(); break;
	    case 40: game.move_down(); break;
	    }
	}
    });
}
$(document).ready(function (){
    $("body").dmqh();
});
