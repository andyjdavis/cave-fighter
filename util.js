function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}
function drawBox(context, x, y, width, height, color) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
}
function drawText(context, text, font, style, x, y) {
    context.font = font;
    context.fillStyle = style;
    context.fillText(text, x, y);
}
function angleToVector(ang) {
    return [Math.cos(ang), Math.sin(ang)]
}
function calcDistance(vect) {
    return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2));
}
function calcVector(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}
function calcNormalVector(p1, p2) {
    var vect = calcVector(p1, p2);
    var h = calcDistance(vect);
    vect[0] = vect[0] / h;
    vect[1] = vect[1] / h;
    return vect;
}

function convertPointToTile(pos) {
    var leftX = Math.floor(pos[0]/gSettings.tilesize);
    var topY  = Math.floor(pos[1]/gSettings.tilesize);
    return [leftX, topY];
}
function convertRectToTiles(pos, size) {
    var tiles = Array();
    
    var leftX =  Math.floor(pos[0]/gSettings.tilesize);
    var rightX = Math.floor((pos[0]+size)/gSettings.tilesize);
    
    var topY =    Math.floor(pos[1]/gSettings.tilesize);
    var bottomY = Math.floor((pos[1]+size)/gSettings.tilesize);

    for(var x = leftX; x <= rightX; x++){
        for(var y = topY; y <= bottomY; y++){
            tiles.push([x, y]);
        }
    }
    return tiles;
}
function getMapSize() {
    return [gSettings.tilesize * gSettings.tileswidth, gSettings.tilesize * gSettings.tilesheight];
}

function getDrawPos(p) {
    return [p[0] - gCamera[0], p[1] - gCamera[1]];
}
