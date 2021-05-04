p5.disableFriendlyErrors = true;
const cor = 255, t_pixel = 1;
let ponto = 100, tamanho = 180, novaCor, figura, algoritmo;

mode = false;

let menu_figura, menu_algoritmo, menu_cor;

let beatmap = [];
let table = [];
let polygon = [];


function setup() {
  const canvas = createCanvas(400, 400);
  canvas.position(0, 30);
  noLoop();
  
  menu_figura = createSelect();
  menu_figura.option('Retângulo');
  menu_figura.option('Circunferência');
  menu_figura.option('Figura A');
  menu_figura.option('Figura C');
  
  menu_algoritmo = createSelect();
  menu_algoritmo.option('Flood Fill');
  menu_algoritmo.option('Varredura');
  
  menu_cor = createSelect();
  menu_cor.option('red');
  menu_cor.option('blue');
  menu_cor.option('green');
  
  
}

function figura_a(ponto, tamanho){
  let v;
  let a = round(tamanho * 0.3),
      b = round(tamanho * 0.4),
      c = b - a;
  beginShape();
  v = [ponto, ponto + a];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + b + c, ponto];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + tamanho + c, ponto + b];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + 2 * b, ponto + 2 * a];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + c, ponto + 2 * a + c];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + a, ponto + b + c];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto, ponto + a];vertex(v[0], v[1]); polygon.push(v);
  endShape();
}

function figura_c(ponto, tamanho){
  let v;
  let a = round(tamanho * 0.4),
      b = round(tamanho / 2),
      c = round(tamanho * 0.1),
      d = ponto + 2 * a + 2 * c,
      e = ponto + 3 * c;
  
  beginShape();
  v = [ponto, ponto];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + a, ponto];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + b, ponto + c];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + a + 2 * c, ponto];vertex(v[0], v[1]); polygon.push(v);
  v = [d, ponto];vertex(v[0], v[1]); polygon.push(v);
  v = [d, e];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto + b, ponto + 8 * c];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto, e];vertex(v[0], v[1]); polygon.push(v);
  v = [ponto, ponto];vertex(v[0], v[1]); polygon.push(v);
  endShape();
 
}

function varredura_retangulo(a, b, tam_x, tam_y){
  let max_x = a + tam_x,
  max_y = b + tam_y;
  for(let min_x = a + t_pixel; min_x < max_x; min_x += t_pixel){
    for(let min_y = b + t_pixel; min_y < max_y; min_y += t_pixel){
      fill(novaCor);
      noStroke();
      rect(min_x, min_y, t_pixel, t_pixel);
    }
  }
}


function varredura_circular(xc, yc, tamanho){
  let raio = round(tamanho / 2),
      raiz, x1, x2, x, y;
  for(y = yc - raio + t_pixel; y < yc + raio; y += t_pixel){
    raiz = round(sqrt(pow(raio, 2) - pow((y - yc), 2)));
    x1 = xc - raiz;
    x2 = xc + raiz;
    for(x = x1; x < x2; x += t_pixel){
     
      fill(novaCor);
      noStroke();
      rect(x, y, t_pixel, t_pixel);
      
    }
  }
}

function sortByY(vet){
  if (vet[0][1] > vet[1][1])
    return [vet[1], vet[0]]
  return vet;
}

function tabela(){
  let a, b, dx, dy, _m;
  let tam = polygon.length;
  for (let i = 0; i < tam - 1; i ++){
    [a ,b] = sortByY([polygon[i], polygon[i + 1]]);
    dx = b[0] - a[0];
    dy = b[1] - a[1];
    _m = dx / dy;
    if(_m != Infinity)
      table.push([a[1], b[1], a[0], _m]);
    else
      table.push([a[1], polygon[i + 2][1], a[0], _m]);
  }
}

function varredura(){
  tabela();
  let x, y, tab, pontos = [], varr;
  let tam = table.length;
  for(tab = 0; tab < tam; tab ++){
    for(y = table[tab][0] + t_pixel; y < table[tab][1] - t_pixel; y += t_pixel){
      if(table[tab][3] != Infinity)
        x = table[tab][3] * (y - table[tab][0]) + table[tab][2];
      else
        x = table[tab + 1][2];

      pontos = sort([table[tab][2], round(x)]);
      
      for(varr = pontos[0] + t_pixel; varr < pontos[1] - t_pixel; varr += t_pixel){
        fill(novaCor);
        noStroke();
        rect(varr, y, t_pixel, t_pixel);
      }
    }
  }
}

function floodFill(x , y){
  
  let pixel = get(x, y);
  let pontos = [x, y];
  
  if (pixel[0] !== cor){
    beatmap.push(pontos);
  }
  else if (beatmap.includes(pontos) === false){  
    
    beatmap.push(pontos);
    
    fill(novaCor);
    noStroke();
    rect(x, y, t_pixel, t_pixel);
    
    floodFill(x + t_pixel, y);
    floodFill(x, y + t_pixel);
    floodFill(x - t_pixel, y);
    floodFill(x , y - t_pixel);
  }
}

function draw() {
  background(255);
  fill(255);
  stroke(t_pixel);
  strokeWeight(t_pixel);
  
  figura = menu_figura.value();
  
  let x  = ponto, y = ponto,
     tam_x = tamanho, tam_y = tamanho * 0.75;
  
  let xc = ponto + tamanho / 2, yc = ponto + tamanho / 2;
  
  if (figura === 'Retângulo')
      rect(x, y, tam_x, tam_y);
  
  if (figura === 'Circunferência')
    circle(xc, yc, tamanho);
  
  if (figura === 'Figura A')
    figura_a(ponto, tamanho);
  
  if (figura === 'Figura C')
    figura_c(ponto, tamanho);
  
  
  if (mode == true){
    if(algoritmo === 'Flood Fill')
      floodFill(ponto + tamanho / 2, ponto + tamanho / 2);
    
    if(algoritmo === 'Varredura'){
      if((figura !== 'Retângulo') && (figura !== 'Circunferência'))
        varredura();
      if(figura === 'Retângulo')
        varredura_retangulo(x, y, tam_x, tam_y);
      if(figura === 'Circunferência')
        varredura_circular(xc, yc, tamanho);
      
    }
  }
}

function mouseClicked() {
  if(mode == false){
    novaCor = menu_cor.value();
    algoritmo = menu_algoritmo.value();
    mode = true;
    redraw();
    }
  else{
    mode = false;
    polygon = [];
    table = [];
    beatmap = [];
    redraw();
  }
}