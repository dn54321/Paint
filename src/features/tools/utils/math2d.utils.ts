import { Position } from "../../../types/geometry.types";


export function getEuclideanDistance(position1: Position, position2: Position) {
    const dx = position2.x - position1.x;
    const dy = position2.y - position1.y;
    return Math.sqrt(dx*dx + dy*dy);
}

export function getSquaredDistance(position1: Position, position2: Position) {
    const dx = position2.x - position1.x;
    const dy = position2.y - position1.y;
    return dx*dx + dy*dy;
}

export function* midPointCircleGenerator(position: Position, radius: number) {
    let x = radius;
    let y = 0;

    yield {x: position.x + radius, y: position.y}

    if (radius > 0) {
        yield {x: position.x - radius, y: position.y}
        yield {x: position.x, y: position.y + radius}
        yield {x: position.x, y: position.y - radius}
    }

    let p = 1-radius;
    while (x > y) {
        ++y;

        if (p <= 0) {
            p = p + 2*y + 1;
        }
        else {
            --x;
            p = p + 2*y - 2*x + 1;
        }

        if (x<y) {
            break;
        }

        yield {x: x + position.x, y:  y + position.y}
        yield {x: -x + position.x, y:  y + position.y}
        yield {x: x + position.x, y:  -y + position.y}
        yield {x: -x + position.x, y:  -y + position.y}

        if (x != y) {
            yield {x: y + position.x, y:  x + position.y}
            yield {x: -y + position.x, y:  x + position.y}
            yield {x: y + position.x, y:  -x + position.y}
            yield {x: -y + position.x, y:  -x + position.y}
        }
    }
}

export function* midPointCircleAreaGenerator(position: Position, radius: number) {
    let x = radius;
    let y = 0;
    let error = 1 - radius;
    
    while (x >= y) {
        let startX = -x + position.x;
        let endX = x + position.x;

        for (let i = startX; i <= endX; ++i) {
            yield({x: i, y: y + position.y});
        }

        if (y != 0) {
            for (let i = startX; i <= endX; ++i) {
                yield({x: i, y: -y + position.y});
            }
        }
        
        y++;

        if (error < 0) {
            error += 2 * y + 1;
            continue;
        }
   
        if (x >= y) {
            startX = -y + 1 + position.x;
            endX = y - 1 + position.x;
            for (let i = startX; i <= endX; ++i) {
                yield({x: i, y: x + position.y});
                yield({x: i, y: -x + position.y});
            }
        }

        --x;
        error += 2 * (y - x + 1);
    }
}


export function* bresenhamCircleGenerator(position: Position, radius: number) {
    const {x: cx, y: cy} = position;
    let x = -radius;
    let y = 0;
    let err = 2-2*radius;

    while (x < 0) {
        yield {x: cx-x, y: cy+y};
        yield {x: cx-y, y: cy-x};
        yield {x: cx+x, y: cy-y};
        yield {x: cx+y, y: cy+x};

        radius = err;
        if (radius <= y) {
            y += 1;
            err += y*2 + 1;
        }

        if (radius > x || err > y) {
            x += 1;
            err += x*2 + 1;
        }
    }
}

export function* zinglLineGenerator(position1: Position, position2: Position) {
    let {x: x0, y: y0} = position1;
    const {x: x1, y: y1} = position2;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = Math.sign(x1 - x0);
    const sy = Math.sign(y1 - y0);
    let err = dx - dy;
  
    while (true) {
      yield {x: x0, y: y0};

      if (x0 === x1 && y0 === y1) break;
  
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 <  dx) { err += dx; y0 += sy; }
    }
}

export function* zinglNoDiagLineGenerator(position1: Position, position2: Position) {
    let {x: x0, y: y0} = position1;
    const {x: x1, y: y1} = position2;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = Math.sign(x1 - x0);
    const sy = Math.sign(y1 - y0);
    let err = dx - dy;
  
    while (true) {
      yield {x: x0, y: y0};

      if (x0 === x1 && y0 === y1) break;
  
      const e2 = 2 * err;
      if (2*e2 + dy > dx) { err -= dy; x0 += sx; }
      else { err += dx; y0 += sy; }
    }
}

function fPartOfNumber(x: number) {
    return x - Math.floor(x)
}

function rfPartOfNumber(x: number) {
    return 1 - fPartOfNumber(x)
}

export function* xiaolinWuAALineGenerator(position1: Position, position2: Position) {
    let {x: x0, y: y0} = position1;
    let {x: x1, y: y1} = position2;

    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

    if (steep) {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    const dx = x1 - x0;
    const dy = y1 - y0;
    const gradient = dy / dx || 1;

    const xpxl1 = Math.floor(x0);
    const xpxl2 = Math.floor(x1);
    let intersectY = y0;

    if (steep) {
        for (let x = xpxl1; x <= xpxl2; x++) {
            yield({x: Math.floor(intersectY), y: x, brightness: rfPartOfNumber(intersectY)});
            yield({x: Math.floor(intersectY) - 1, y: x, brightness: fPartOfNumber(intersectY)});
            intersectY += gradient;
        }
    } else {
        for (let x = xpxl1; x <= xpxl2; x++) {
            yield({x: x, y: Math.floor(intersectY), brightness: rfPartOfNumber(intersectY)});
                yield({x: x, y: Math.floor(intersectY) - 1, brightness: fPartOfNumber(intersectY)});
            intersectY += gradient;
        }
    }
}

export function* zinglAALineGenerator(position1: Position, position2: Position) {
    let {x: x0, y: y0} = position1;
    const {x: x1, y: y1} = position2;
    const dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1;
    let err = dx-dy, e2, x2;                               /* error value e_xy */
    const ed = dx+dy == 0 ? 1 : Math.sqrt(dx*dx+dy*dy);

    for ( ; ; ){                                                 /* pixel loop */
        yield {x: x0, y: y0, brightness: 255*Math.abs(err-dx+dy)/ed};
        e2 = err; x2 = x0;
        if (2*e2 >= -dx) {                                            /* x step */
            if (x0 == x1) break;
            if (e2+dy < ed) yield {x: x0,y: y0+sy, brightness: 255*(e2+dy)/ed};
            err -= dy; x0 += sx;
        }
        if (2*e2 <= dy) {                                             /* y step */
            if (y0 == y1) break;
             if (dx-e2 < ed) yield {x:x2+sx, y: y0, brightness: 255*(dx-e2)/ed};
            err += dx; y0 += sy;
        }
    }
}

export function* zinglAALineThicknessV1Generator(position1: Position, position2: Position, th: number) {
    let {x: x0, y: y0} = position1;
    const {x: x1, y: y1} = position2;
    const dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1;
    let err = dx-dy, e2, x2, y2;                               /* error value e_xy */
    const ed = dx+dy == 0 ? 1 : Math.sqrt(dx*dx+dy*dy);

    for (th = (th+1)/2; ; ) {                                              /* pixel loop */
        yield {x: x0, y: y0, brightness: Math.max(0,255*(Math.abs(err-dx+dy)/ed-th+1))};
        e2 = err; x2 = x0;
        if (2*e2 >= -dx) {                                            /* x step */
            y2 = y0;
            for (e2 += dy; e2 < ed*th && (y1 != y2 || dx > dy); e2 += dx)
                yield {x: x0,y: y2 += sy, brightness: Math.max(0,255*(Math.abs(e2)/ed-th+1))};
            if (x0 == x1) break;
            err -= dy; x0 += sx;
        }
        
        if (2*e2 <= dy) {  
            for (e2 = dx-e2; e2 < ed*th && (x1 != x2 || dx < dy); e2 += dy)
                yield{ x: x2 += sx, y: y0, brightness: Math.max(0,255*(Math.abs(e2)/ed-th+1))};
            if (y0 == y1) break;
            err += dx; y0 += sy;
        }
    }
}

 export function* zinglExperimental1(position1: Position, position2: Position, th: number) {
    let {x: x0, y: y0} = position1;
    const {x: x1, y: y1} = position2;
    const dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1;
    const dy = Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1;
    let err = dx-dy, e2; 
    const ed = dx+dy == 0 ? 1 : Math.sqrt(dx*dx+dy*dy);
    th = Math.floor(th/2);
    for (; ; ) {  
        let xOffset = 0;
        let yOffset = 0;                                 
        yield {x: x0, y: y0, brightness: Math.max(0,255*(Math.abs(err-dx+dy)/ed-th+1))};
        e2 = err; 

        if (2*e2 > -dy) {
            for (let i = 0; i < th; ++i) {
                yield {x: x0, y: y0 + i + 1};
                yield {x: x0, y: y0 - i - 1};
            }
                
            e2 = err;
            if (x0 == x1) break;
            err -= dy; xOffset += sx;
        }
        
        if (2*e2 < dx) {  
            for (let i = 0; i < th; ++i) {
                yield {x: x0 + i + 1, y: y0};
                yield {x: x0 - i - 1, y: y0};
            }
               
            if (y0 == y1) break;
            err += dx; yOffset += sy;
        }

        x0 += xOffset;
        y0 += yOffset;
    }
 }

 export function* zinglExperimental2(position1: Position, position2: Position, th: number) {
    let {x: x0, y: y0} = position1;
    let {x: x1, y: y1} = position2;

    let dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1; 
    let dy = Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1; 
    let err, dist = Math.sqrt(dx*dx+dy*dy);                            /* length */
 
    if (th <= 1 || dist == 0) return zinglAALineGenerator(position1,  position2);               /* assert */
    dx *= 255/dist; dy *= 255/dist; th = 255*(th-1);               /* scale values */
 
    if (dx < dy) {                                               /* steep line */
        x1 = Math.round((dist+th/2)/dy);                          /* start offset */
        err = x1*dy-th/2;                  /* shift error value to offset width */
        for (x0 -= x1*sx; ; y0 += sy) {
            yield {x: x1 = x0, y: y0, brightness: err};               /* aliasing pre-pixel */
            for (dist = dy-err-th; dist+dy < 255; dist += dy)  
                yield {x: x1 += sx, y:y0};                      /* pixel on the line */
            yield {x: x1+sx, y: y0, brightness: dist};                    /* aliasing post-pixel */
            if (y0 == y1) break;
            err += dx;                                                 /* y-step */
            if (err > 255) { err -= dy; x0 += sx; }                    /* x-step */ 
       }
    } else {                                                      /* flat line */
        y1 = Math.round((dist+th/2)/dx);                          /* start offset */
        err = y1*dx-th/2;                  /* shift error value to offset width */
        for (y0 -= y1*sy; ; x0 += sx) {
            y1 = y0;
            yield {x: x0, y: y1 = y0, brightness: err};                  /* aliasing pre-pixel */
            for (dist = dx-err-th; dist+dx < 255; dist += dx) 
                yield {x: x0, y: y1 += sy};                      /* pixel on the line */
            yield {x: x0, y: y1+sy, brightness: dist};                    /* aliasing post-pixel */
            if (x0 == x1) break;
            err += dy;                                                 /* x-step */ 
            if (err > 255) { err -= dx; y0 += sy; }                    /* y-step */
        } 
    }
 }

export function* zinglAALineThicknessV2Generator(position1: Position, position2: Position, th: number) {
    let {x: x0, y: y0} = position1;
    let {x: x1, y: y1} = position2;

    let dx = Math.abs(x1-x0), sx = x0 < x1 ? 1 : -1; 
    let dy = Math.abs(y1-y0), sy = y0 < y1 ? 1 : -1; 
    let err, dist = Math.sqrt(dx*dx+dy*dy);                            /* length */
 
    if (th <= 1 || dist == 0) return zinglAALineGenerator(position1,  position2);               /* assert */
    dx *= 255/dist; dy *= 255/dist; th = 255*(th-1);               /* scale values */
 
    if (dx < dy) {                                               /* steep line */
        x1 = Math.round((dist+th/2)/dy);                          /* start offset */
        err = x1*dy-th/2;                  /* shift error value to offset width */
        for (x0 -= x1*sx; ; y0 += sy) {
            yield {x: x1 = x0, y: y0, brightness: err};               /* aliasing pre-pixel */
            for (dist = dy-err-th; dist+dy < 255; dist += dy)  
                yield {x: x1 += sx, y:y0};                      /* pixel on the line */
            yield {x: x1+sx, y: y0, brightness: dist};                    /* aliasing post-pixel */
            if (y0 == y1) break;
            err += dx;                                                 /* y-step */
            if (err > 255) { err -= dy; x0 += sx; }                    /* x-step */ 
       }
    } else {                                                      /* flat line */
        y1 = Math.round((dist+th/2)/dx);                          /* start offset */
        err = y1*dx-th/2;                  /* shift error value to offset width */
        for (y0 -= y1*sy; ; x0 += sx) {
            y1 = y0;
            yield {x: x0, y: y1 = y0, brightness: err};                  /* aliasing pre-pixel */
            for (dist = dx-err-th; dist+dx < 255; dist += dx) 
                yield {x: x0, y: y1 += sy};                      /* pixel on the line */
            yield {x: x0, y: y1+sy, brightness: dist};                    /* aliasing post-pixel */
            if (x0 == x1) break;
            err += dy;                                                 /* x-step */ 
            if (err > 255) { err -= dx; y0 += sy; }                    /* y-step */
        } 
    }
 }


